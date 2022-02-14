/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.clearLog();
    ns.tail();
    while (true) {
        let ALL = {
            used: 0,
            usedPercent: '',
            total: 0,
            totalFormat: ''
        };
        let servers = [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmluZi5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbImJhdGNoZXIvdG9vbHMvc2VydmluZi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBRTtJQUV6QixFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3BCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUNiLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUVULE9BQU8sSUFBSSxFQUFFO1FBRVQsSUFBSSxHQUFHLEdBQUc7WUFDTixJQUFJLEVBQUUsQ0FBQztZQUNQLFdBQVcsRUFBRSxFQUFFO1lBQ2YsS0FBSyxFQUFFLENBQUM7WUFDUixXQUFXLEVBQUUsRUFBRTtTQUNsQixDQUFBO1FBRUQsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFBO1FBQ2hCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQTtRQUVmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFFekIsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDVCxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7Z0JBQzNDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQzthQUN6QyxDQUFDLENBQUM7WUFDSCxJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNsQyxPQUFPLENBQUMsQ0FB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