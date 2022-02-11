// Ports
const portAdditionalInfo = 10;
const portEmpty = 'NULL PORT DATA';
function printHelp(ns) {
    console(ns, `ps [OPTION]...
'ps' displays information about all active processes on all servers.

Parameters:
  --debug              Enable debug mode (more logging, increased sleep timer, ...)
  --help               Displays this help.
`);
}
/**
 * Displays information about all active processes on all servers.
 *
 * @version 3.0-beta1
 */
/** @param {NS} ns **/
export async function main(ns) {
    // Args
    const args = ns.flags([
        ['debug', false],
        ['help', false]
    ]);
    if (args.help) {
        printHelp(ns);
        return;
    }
    disableLog(ns, 'sleep', 'getServerMaxRam');
    ns.tail();
    ns.clearLog();
    log(ns, 'Start process monitoring');
    const additionalData = [];
    // Monitor loop
    let nextFullCycle = 0;
    let needSleep = false;
    while (true) {
        // Update additional data
        const portRead = ns.readPort(portAdditionalInfo);
        if (portRead !== portEmpty) {
            const data = JSON.parse(portRead);
            if (Array.isArray(data)) {
                data.forEach(o => {
                    if (o !== undefined && o !== null && typeof o === 'object') {
                        additionalData.push(o);
                    }
                    else {
                        TODO(ns, 'Wrong port data (not an array)');
                    }
                });
            }
            else {
                TODO(ns, 'Wrong port data (not an array)');
            }
        }
        // Save execution time and prevent loop without sleep
        if (nextFullCycle > Date.now() || needSleep) {
            await ns.sleep(5);
            needSleep = false;
            continue;
        }
        needSleep = true;
        // Load data
        const hostnames = getRootHostnames(ns, true);
        const groups = {};
        for (const id of hostnames) {
            for (const processInfo of ns.ps(id)) {
                const process = processSchema.get(processInfo.filename)?.(processInfo, id) || unknownProcess(processInfo, id);
                if (process.type === ProcessType.Monitor) {
                    continue;
                } // Skip monitor processes
                Object.assign(process.options, additionalData.find(options => process.pid === options.pid)); // Add additional data
                //const key = process.type + (process.options.sid ? '/' + process.options.sid : '')
                const key = process.type + (process.targetId ? '/' + process.targetId : '');
                let group = groups[key];
                if (group === undefined) {
                    group = new ProcessGroup(process.type);
                    groups[key] = group;
                }
                group.processes.push(process);
                group.threads += process.threads;
            }
        }
        // Show data
        ns.clearLog();
        let prnt = '\n'
        const objInfo = Object.entries(groups)
        objInfo.sort(([, aGroup], [, bGroup]) => {
            const aType = aGroup.processes[0].type
            const bType = bGroup.processes[0].type
            return bType - aType
        })

        objInfo.sort(([, aGroup], [, bGroup]) => {
            const aName = aGroup.processes[0].targetId || ''
            const bName = bGroup.processes[0].targetId || ''

            if (aName < bName) { return -1 }
            if (aName > bName) { return 1 }
            return 0
        })

        let iterator = 0
        objInfo.forEach(([, group]) => {
            const firstP = group.processes[0];
            const firstSid = firstP.options.sid;
            const line = [];
            line.push(ProcessType[group.type]);
            //if (firstSid) {
            //    line.push('/', String(firstSid));
            //}
            line.push(' => threads: ', (group.threads + '').padStart(8, ' '));
            if (firstP.targetId) {
                line.push(' │ target: \'', firstP.targetId, '\'');
            }
            prnt += line.join('') + '\n';
            iterator++
            if (iterator / 3 == Math.ceil(iterator / 3)) { prnt += '\n' }
        });
        if (iterator / 3 != Math.ceil(iterator / 3)) { prnt = 'ERROR:' + prnt; prnt.replace('\n\n','\n')}
        ns.print(prnt);
        const now = Date.now();
        nextFullCycle = now + 1000;
        //ns.print('Last update: ' + t(now));
    }
}
var ProcessType;
(function (ProcessType) {
    ProcessType[ProcessType["Batcher"] = 0] = "Batcher";
    ProcessType[ProcessType["SchedulerWeaken"] = 1] = "SchedulerWeaken";
    ProcessType[ProcessType["SchedulerGrow"] = 2] = "SchedulerGrow";
    ProcessType[ProcessType["SchedulerHack"] = 3] = "SchedulerHack";
    ProcessType[ProcessType["WKN"] = 4] = "WKN";
    ProcessType[ProcessType["GRW"] = 5] = "GRW";
    ProcessType[ProcessType["HCK"] = 6] = "HCK";
    ProcessType[ProcessType["BasicHack"] = 7] = "BasicHack";
    ProcessType[ProcessType["Unknown"] = 8] = "Unknown";
    ProcessType[ProcessType["Monitor"] = 9] = "Monitor";
})(ProcessType || (ProcessType = {}));
class Process {
    type;
    pid;
    hostId;
    threads;
    targetId;
    options;
    constructor(type, pid, hostId, threads = 1, targetId = undefined, options = {}) {
        this.type = type;
        this.pid = pid;
        this.hostId = hostId;
        this.threads = threads;
        this.targetId = targetId;
        this.options = options;
    }
}
class ProcessGroup {
    type;
    processes = [];
    threads = 0;
    constructor(type) {
        this.type = type;
    }
}
const processSchema = new Map([
    [
        '1weaken.js', (p, hostId) => processHelperCat(p, hostId, ProcessType.WKN)
    ],
    [
        '1grow.js', (p, hostId) => processHelperCat(p, hostId, ProcessType.GRW)
    ],
    [
        '1hack.js', (p, hostId) => processHelperCat(p, hostId, ProcessType.HCK)
    ],
    [
        'batch-watcher.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
    ],
    [
        'servinf.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
    ],
    [
        'batcher.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
    ]
]);
function unknownProcess(p, hostId) {
    return new Process(ProcessType.Unknown, p.pid, hostId, p.threads);
}
function processHelperSchedulerV3(p, hostId, type) {
    if (p.args.length !== 3) {
        return unknownProcess(p, hostId);
    }
    return new Process(type, p.pid, hostId, p.threads, p.args[0], { sid: +p.args[2], delay: +p.args[1] });
}
function processHelperCat(p, hostId, type) {
    if (p.args.length !== 3) {
        return unknownProcess(p, hostId);
    }
    return new Process(type, p.pid, hostId, p.threads, p.args[0], { sid: +p.args[1] });
}
/**
 * Message helper library
 *
 * @module
 */
export function disableLog(ns, ...functions) {
    ns.disableLog('disableLog');
    functions.forEach(fn => ns.disableLog(fn));
}
export function all(ns, msg, type, duration = 6000) {
    log(ns, msg);
    ns.tprint(msg);
    ns.toast(msg, type, duration);
}
export function toast(ns, msg, type, duration = 6000) {
    log(ns, msg);
    ns.toast(msg, type, duration);
}
export function console(ns, ...msg) {
    log(ns, msg);
    ns.tprint(...msg);
}
export function log(ns, ...msg) {
    ns.print(`[${t()}] ${msg.map(m => {
        return typeof m === 'object' ? JSON.stringify(m) : m;
    }).join('')}`);
}
export function TODO(ns, operation) {
    toast(ns, `Operation '${operation}' is not implemented!`, 'error');
    ns.exit();
}
/**
* Format objects to human readable strings.
*
* @module
*/
/** Formats a number with standard notation */
export function n(number) {
    return Intl.NumberFormat('en').format(number);
}
/** Formats a number with standard notation without fraction digits  */
export function i(number) {
    return Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(number);
}
/** Formats a number with compact notation */
export function c(number) {
    return Intl.NumberFormat('en', { notation: 'compact' }).format(number);
}
/** Formats a number with compact notation */
export function cf3(number) {
    return Intl.NumberFormat('en', { notation: 'compact', minimumFractionDigits: 3 }).format(number);
}
/** Formats a number as percentage */
export function p(number) {
    return Intl.NumberFormat('en', { style: 'percent' }).format(number);
}
/**
 * Formats a *unix time number* to a human readable time string.
 *
 * @param date Unix time number to format. Default is `Date.now()`
 * @param precise `hh:mm:ss.SSS` or `hh:mm:ss`. Default is: `hh:mm:ss`
 * @returns A human readable `string`.
 */
export function t(date = Date.now(), precise = false) {
    return Intl.DateTimeFormat('en', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        fractionalSecondDigits: precise ? 3 : undefined
    }).format(date);
}
const bytePetabyte = new Intl.NumberFormat('en', { notation: 'compact', style: 'unit', unit: 'petabyte' });
const byteTerabyte = new Intl.NumberFormat('en', { notation: 'compact', style: 'unit', unit: 'terabyte' });
const byteGigabyte = new Intl.NumberFormat('en', { notation: 'compact', style: 'unit', unit: 'gigabyte' });
export function b(gigabyte) {
    if (gigabyte > 1000000) {
        return bytePetabyte.format(gigabyte / 1000000);
    }
    else if (gigabyte > 1000) {
        return byteTerabyte.format(gigabyte / 1000);
    }
    else {
        return byteGigabyte.format(gigabyte);
    }
}
/**
 * Converts a duration representing time in milliseconds to a human readable string.
 *
 * @param time Time in milliseconds
 * @param precise A number between `1` and `4`, default is `1`
 * @param compact Use compact units, e.g. 'd' instead of ' days'; default is `true`
 * @returns A human readable formatted `string`
 */
export function d(time, precise = 1, compact = true) {
    const perDay = 86400000, perHour = 3600000, perMinute = 60000, perSecond = 1000;
    time = Math.round(time);
    const days = Math.floor(time / perDay);
    time = time % perDay;
    const hours = Math.floor(time / perHour);
    time = time % perHour;
    const minutes = Math.floor(time / perMinute);
    time = time % perMinute;
    const seconds = Math.floor(time / perSecond);
    time = time % perSecond;
    const result = [];
    if (days) {
        result.push(days + (compact ? 'd' : ' days'));
        --precise;
    }
    if (!precise)
        return result.join(', ');
    if (hours) {
        result.push(hours + (compact ? 'h' : ' hours'));
        --precise;
    }
    if (!precise)
        return result.join(', ');
    if (minutes) {
        result.push(minutes + (compact ? 'm' : ' minutes'));
        --precise;
    }
    if (!precise)
        return result.join(', ');
    if (seconds) {
        result.push(seconds + (compact ? 's' : ' seconds'));
        --precise;
    }
    if (!precise)
        return result.join(', ');
    if (time || result.length === 0) {
        result.push(time + (compact ? 'ms' : ' milliseconds'));
    }
    return result.join(', ');
}
/**
 * Converts an array to a human readable string.
 *
 * @param array Array to convert
 * @param maxLength Maximum return string length (minimum length is 3)
 * @param mapper Function to convert the individual array elements to strings
 * @param separator The separator between elements
 * @param prefix The prefix for each element
 * @param suffix The suffix for each element
 * @returns
 */
export function a(array, maxLength, mapper = o => String(o), separator = ', ', prefix = "'", suffix = "'") {
    const result = [];
    const p3 = '...', p3Length = p3.length;
    const minChars = 3; // minimum x chars with p3 <prefix><minium x chars><p3><suffix>, e.g. 'abc...'
    const fixLength = prefix.length + suffix.length;
    const wrapLength = fixLength + separator.length;
    let remLength = maxLength - p3Length;
    for (let i = 0; i < array.length; ++i) {
        const item = mapper(array[i]);
        const itemLength = item.length + wrapLength; // <prefix><item><suffix><separator>
        if (array.length === i + 1) { // Last element from the input array
            remLength += p3Length;
            if (remLength >= item.length + fixLength) { // Full item size
                result.push(prefix + item + suffix);
                break;
            }
            else if (remLength >= minChars + p3Length + fixLength) { // Shortened item size
                result.push(prefix + item.slice(0, remLength - fixLength - p3Length) + p3 + suffix);
                break;
            }
        }
        else if (remLength >= itemLength) { // Full item size
            result.push(prefix + item + suffix);
            remLength -= itemLength;
            continue; // Only normal append
        }
        else if (array.length === i + 2 && remLength + p3Length >= itemLength + mapper(array[i + 1]).length + fixLength) { // Corner case: 'abc', ''
            result.push(prefix + item + suffix, prefix + mapper(array[i + 1]) + suffix);
            break;
        }
        else if (remLength >= minChars + p3Length + wrapLength) { // Shortened item size
            result.push(prefix + item.slice(0, remLength - wrapLength - p3Length) + p3 + suffix, p3);
            break;
        }
        result.push(p3);
        break;
    }
    return result.join(separator);
}
/**
 * Server helper library
 *
 * @module
 */
const homeServer = 'home';
const hackTools = [
    ['BruteSSH.exe', (ns, id) => ns.brutessh(id)],
    ['FTPCrack.exe', (ns, id) => ns.ftpcrack(id)],
    ['relaySMTP.exe', (ns, id) => ns.relaysmtp(id)],
    ['HTTPWorm.exe', (ns, id) => ns.httpworm(id)],
    ['SQLInject.exe', (ns, id) => ns.sqlinject(id)]
];
export default { getRootHostnames, getHostnames, getFacts: getFactsStats, getRoot: getRootServers, get: getServers, isConnected, getConnectedHost };
export function isConnected(ns, id) {
    return getConnectedHost(ns) === id;
}
export function getConnectedHost(ns) {
    const server = getServers(ns);
    return server.find(server => server.isConnectedTo).hostname;
}
export function getRootHostnames(ns, includeHome = false, minMemory = 0) {
    disableLog(ns, 'getServerNumPortsRequired', 'brutessh', 'ftpcrack', 'relaysmtp', 'httpworm', 'sqlinject', 'nuke', 'getServerMaxRam');
    const tools = hackTools.filter(tool => ns.fileExists(tool[0], homeServer));
    return getHostnames(ns, includeHome).filter(hostname => ensureRoot(ns, hostname, tools) && ns.getServerMaxRam(hostname) >= minMemory);
}
export function getHostnames(ns, includeHome = true) {
    disableLog(ns, 'scan');
    const visited = [], queue = [homeServer];
    let hostname;
    while ((hostname = queue.pop())) {
        visited.push(hostname);
        ns.scan(hostname).forEach(name => {
            if (!visited.includes(name)) {
                queue.push(name);
            }
        });
    }
    if (!includeHome) {
        visited.shift();
    } // Home ist the first element
    return visited;
}
export function getFactsStats(ns, includeHome = false) {
    const servers = getRootServers(ns, includeHome, 1);
    const stats = { maxRam: 0, ramUsed: 0, freeRam: 0, length: servers.length, highestMaxRam: Math.max(...servers.map(server => server.maxRam)) };
    servers.forEach(server => {
        stats.maxRam += server.maxRam;
        stats.ramUsed += server.ramUsed;
        stats.freeRam += server.maxRam - server.ramUsed;
    });
    return stats;
}
export function getRootServers(ns, includeHome = false, minMemory = 0) {
    disableLog(ns, 'getServerNumPortsRequired', 'brutessh', 'ftpcrack', 'relaysmtp', 'httpworm', 'sqlinject', 'nuke');
    const tools = hackTools.filter(tool => ns.fileExists(tool[0], homeServer));
    return getServers(ns, includeHome).filter(server => ensureRoot(ns, server.hostname, tools) && server.maxRam >= minMemory);
}
function ensureRoot(ns, id, tools) {
    if (ns.hasRootAccess(id)) {
        return true;
    }
    tools.forEach(tool => tool[1](ns, id));
    if (ns.getServerNumPortsRequired(id) <= tools.length) {
        // toast(ns, `Nuking '${id}'`, 'info');
        ns.nuke(id); // Nuke server if possible
        return true;
    }
    else {
        return false;
    }
}
/**
 * Get all servers as server objects
 *
 * @see https://www.reddit.com/r/Bitburner/comments/rhpp8p/scan_script_updated_for_bitburner_v110/
 */
export function getServers(ns, includeHome = true) {
    disableLog(ns, 'scan');
    const result = [];
    const visited = { 'home': 0 };
    const queue = Object.keys(visited);
    let hostname;
    while ((hostname = queue.pop())) {
        const depth = visited[hostname];
        if (includeHome || hostname !== homeServer) {
            const server = ns.getServer(hostname);
            server.depth = depth;
            result.push(server);
        }
        ns.scan(hostname).forEach(id => {
            if (visited[id] === undefined) {
                queue.push(id);
                visited[id] = depth + 1;
            }
        });
    }
    return result;
}
