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
                if (process.type === ProcessType.Monitor || process.type === ProcessType.Unknown) {
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
let ProcessType;
(function (ProcessType) {
    ProcessType[ProcessType['Batcher'] = 0] = 'Batcher';
    ProcessType[ProcessType['SchedulerWeaken'] = 1] = 'SchedulerWeaken';
    ProcessType[ProcessType['SchedulerGrow'] = 2] = 'SchedulerGrow';
    ProcessType[ProcessType['SchedulerHack'] = 3] = 'SchedulerHack';
    ProcessType[ProcessType['WKN'] = 4] = 'WKN';
    ProcessType[ProcessType['GRW'] = 5] = 'GRW';
    ProcessType[ProcessType['HCK'] = 6] = 'HCK';
    ProcessType[ProcessType['BasicHack'] = 7] = 'BasicHack';
    ProcessType[ProcessType['Unknown'] = 8] = 'Unknown';
    ProcessType[ProcessType['Monitor'] = 9] = 'Monitor';
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
        '/programs/dependencies/1share.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
    ],
    [
        '/programs/tools/watcher.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
    ],
    [
        '/programs/tools/servinf.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
    ],
    [
        '/programs/batcher.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
    ],
    [
        '/programs/brb.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
    ],
    [
        '/programs/share.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
    ],
    [
        '/programs/dependencies/xp-farmer.js', (p, hostId) => new Process(ProcessType.Monitor, p.pid, hostId, p.threads)
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
    if (p.args.length !== 4) {
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
export function a(array, maxLength, mapper = o => String(o), separator = ', ', prefix = '\'', suffix = '\'') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbInByb2dyYW1zL3Rvb2xzL3dhdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsUUFBUTtBQUNSLE1BQU0sa0JBQWtCLEdBQUcsRUFBRSxDQUFDO0FBQzlCLE1BQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDO0FBQ25DLFNBQVMsU0FBUyxDQUFDLEVBQUU7SUFDakIsT0FBTyxDQUFDLEVBQUUsRUFBRTs7Ozs7O0NBTWYsQ0FBQyxDQUFDO0FBQ0gsQ0FBQztBQUNEOzs7O0dBSUc7QUFDSCxnR0FBZ0c7QUFDaEcsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBRTtJQUN6QixPQUFPO0lBQ1AsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNsQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUM7UUFDaEIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO0tBQ2xCLENBQUMsQ0FBQztJQUNILElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtRQUNYLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNkLE9BQU87S0FDVjtJQUNELFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDM0MsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1YsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2QsR0FBRyxDQUFDLEVBQUUsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUMxQixlQUFlO0lBQ2YsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztJQUN0QixPQUFPLElBQUksRUFBRTtRQUNULHlCQUF5QjtRQUN6QixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFD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