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
/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
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
        let prnt = '\n';
        const objInfo = Object.entries(groups);
        objInfo.sort(([, aGroup], [, bGroup]) => {
            const aType = aGroup.processes[0].type;
            const bType = bGroup.processes[0].type;
            return bType - aType;
        });
        objInfo.sort(([, aGroup], [, bGroup]) => {
            const aName = aGroup.processes[0].targetId || '';
            const bName = bGroup.processes[0].targetId || '';
            if (aName < bName) {
                return -1;
            }
            if (aName > bName) {
                return 1;
            }
            return 0;
        });
        let iterator = 0;
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
            iterator++;
            if (iterator / 3 == Math.ceil(iterator / 3)) {
                prnt += '\n';
            }
        });
        if (iterator / 3 != Math.ceil(iterator / 3)) {
            prnt = 'ERROR:' + prnt;
            prnt.replace('\n\n', '\n');
        
        }
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
        '/programs/dependencies/1weaken.js', (p, hostId) => processHelperCat(p, hostId, ProcessType.WKN)
    ],
    [
        '/programs/dependencies/1grow.js', (p, hostId) => processHelperCat(p, hostId, ProcessType.GRW)
    ],
    [
        '/programs/dependencies/1hack.js', (p, hostId) => processHelperCat(p, hostId, ProcessType.HCK)
    ],
    [
        '/programs/tools/watcher.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
    ],
    [
        '/programs/tools/servinf.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
    ],
    [
        '/programs/batcher.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbImJhdGNoZXIvdG9vbHMvd2F0Y2hlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxRQUFRO0FBQ1IsTUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7QUFDOUIsTUFBTSxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7QUFDbkMsU0FBUyxTQUFTLENBQUMsRUFBRTtJQUNqQixPQUFPLENBQUMsRUFBRSxFQUFFOzs7Ozs7Q0FNZixDQUFDLENBQUM7QUFDSCxDQUFDO0FBQ0Q7Ozs7R0FJRztBQUNILHNCQUFzQjtBQUN0QixNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBQ3pCLE9BQU87SUFDUCxNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2xCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztRQUNoQixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7S0FDbEIsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1gsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2QsT0FBTztLQUNWO0lBQ0QsVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUMzQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDVixFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDZCxHQUFHLENBQUMsRUFBRSxFQUFFLDBCQUEwQixDQUFDLENBQUM7SUFDcEMsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBQzFCLGVBQWU7SUFDZixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFDdEIsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLE9BQU8sSUFBSSxFQUFFO1FBQ1QseUJBQXlCO1FBQ3pCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMs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