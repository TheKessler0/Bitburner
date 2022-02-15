/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.clearLog();
    ns.tail();
    while (true) {
        const ALL = {
            used: 0,
            usedPercent: '',
            total: 0,
            totalFormat: ''
        };
        const servers = [];
        let prnt = '\n';
        for (let i = 0; i < 25; i++) {
            servers.push({
                name: 'S' + ('' + (i + 1)).padStart(2, '0'),
                total: format(0),
                usedPercent: ('---%').padStart(8, ' ')
            });
            if (ns.serverExists(servers[i].name)) {
                servers[i].total = format(ns.getServerMaxRam(servers[i].name));
                servers[i].usedPercent = (Math.ceil((ns.getServerUsedRam(servers[i].name) / ns.getServerMaxRam(servers[i].name)) * 100) + '%').padStart(7, ' ');
                ALL.total += ns.getServerMaxRam(servers[i].name);
                ALL.used += ns.getServerUsedRam(servers[i].name);
            }
            prnt += servers[i].name + servers[i].total + servers[i].usedPercent + '\n';
        }
        prnt += '=======================\n';
        ALL.totalFormat = format(ALL.total);
        if (ALL.used / ALL.total != NaN && ALL.used / ALL.total < Infinity) {
            ALL.usedPercent = (Math.ceil((ALL.used / ALL.total) * 100) + '%').padStart(7, ' ');
        }
        else {
            ALL.usedPercent = ('---%').padStart(8, ' ');
        }
        prnt += 'ALL' + ALL.totalFormat + ALL.usedPercent + '\n';
        prnt += 'HME' + format(ns.getServerMaxRam('home')) + (Math.ceil((ns.getServerUsedRam('home') / ns.getServerMaxRam('home')) * 100) + '%').padStart(8, ' ');
        ns.clearLog();
        ns.print(prnt);
        await ns.sleep(1000);
    }
    function format(num) {
        if (num >= 2 ** 30) {
            return ((num / 2 ** 30).toFixed(2) + ' EB').padStart(12, ' ');
        }
        if (num >= 2 ** 20) {
            return ((num / 2 ** 20).toFixed(2) + ' PB').padStart(12, ' ');
        }
        if (num >= 2 ** 10) {
            return ((num / 2 ** 10).toFixed(2) + ' TB').padStart(12, ' ');
        }
        if (num >= 2 ** 0) {
            return ((num / 2 ** 0).toFixed(2) + ' GB').padStart(12, ' ');
        }
        return ('----- GB').padStart(12, ' ');
    }
}