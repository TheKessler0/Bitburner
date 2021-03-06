export async function main(ns) {
    ns.tail();
    ns.disableLog('ALL');
    const script = '/programs/dependencies/1weaken.js';
    if (!ns.fileExists(script))
        await createWKN();
    const target = 'joesguns';
    let servers = ns.getPurchasedServers();
    for (let server of servers) {
        ns.killall(server);
        await ns.scp(script, 'home', server);
    }
    servers.push('home');
    servers = servers.sort(function (a, b) {
        if (a == 'home')
            return 1;
        const aN = parseInt(a.replace(/S0|S/gm, ''), 10);
        const bN = parseInt(b.replace(/S0|S/gm, ''), 10);
        return aN - bN;
    });
    ns.clearLog();
    while (true) {
        let prnt = '';
        let allThreads = 0;
        for (let server of servers) {
            const threads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(script));
            if (threads > 0) {
                allThreads += threads;
                ns.exec(script, server, threads, target, 0);
            }
            prnt += (`\n${(server + ':').padEnd(5, ' ')} ${formatNumber(threads)} threads`);
        }
        if (allThreads > 0) {
            prnt += `\nALL:  ${formatNumber(allThreads)} threads`;
            ns.clearLog();
            ns.print(prnt);
        }
        await ns.sleep(250);
    }
    async function createWKN() {
        let raw = [
            'export async function main(ns) {\n',
            '    await ns.sleep(ns.args[1]);\n',
            '    await ns.weaken(ns.args[0])\n;',
            '}'
        ];
        let compiled = '';
        raw.forEach(function (a) { compiled += a; });
        await ns.write(script, compiled, 'w');
        ns.tprint('INFO: created ' + script);
    }
    function formatNumber(num) {
        if (num >= 10 ** 12) {
            return ((num / 10 ** 12).toFixed(2) + 'q').padStart(7, ' ');
        }
        if (num >= 10 ** 9) {
            return ((num / 10 ** 9).toFixed(2) + 't').padStart(7, ' ');
        }
        if (num >= 10 ** 6) {
            return ((num / 10 ** 6).toFixed(2) + 'm').padStart(7, ' ');
        }
        if (num >= 10 ** 3) {
            return ((num / 10 ** 3).toFixed(2) + 'k').padStart(7, ' ');
        }
        return ((num).toFixed(0) + '').padStart(7, ' ');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHAtZmFybWVyLmpzIiwic291cmNlUm9vdCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zb3VyY2VzLyIsInNvdXJjZXMiOlsicHJvZ3JhbXMveHAtZmFybWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQU87SUFDOUIsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ1QsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVwQixNQUFNLE1BQU0sR0FBRyxtQ0FBbUMsQ0FBQTtJQUNsRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFBRSxNQUFNLFNBQVMsRUFBRSxDQUFDO0lBRTlDLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQTtJQUN6QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtJQUV0QyxLQUFLLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUN4QixFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xCLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ3JDO0lBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVwQixPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLE1BQU07WUFBRSxPQUFPLENBQUMsQ0FBQTtRQUN6QixNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUMsRUFBRSxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUE7UUFDOUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUUsQ0FB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