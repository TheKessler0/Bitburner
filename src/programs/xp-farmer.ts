import { NS } from '@ns';

export async function main(ns : NS) : Promise<void> {
    ns.tail()
    ns.disableLog('ALL')

    const script = '/programs/dependencies/1weaken.js'
    if (!ns.fileExists(script)) await createWKN();

    const target = 'joesguns'
    let servers = ns.getPurchasedServers()

    for (let server of servers) {
        ns.killall(server)
        await ns.scp(script,'home',server)
    }

    servers.push('home')

    servers = servers.sort(function (a,b) {
        if (a == 'home') return 1
        const aN = parseInt(a.replace(/S0|S/gm,''),10)
        const bN = parseInt(b.replace(/S0|S/gm,''),10)
        return aN - bN
    });

    ns.clearLog()

    while (true) {
        let prnt = ''
        let allThreads = 0
        for (let server of servers) {
            const threads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(script))
            if (threads > 0) {
                allThreads += threads   
                ns.exec(script,server,threads,target,0)
            }
            prnt += (`\n${(server + ':').padEnd(5,' ')} ${formatNumber(threads)} threads`)
        }
        if (allThreads > 0) {
            prnt += `\nALL:  ${formatNumber(allThreads)} threads`
            ns.clearLog()
            ns.print(prnt)
        }
        await ns.sleep(250)
    }

    async function createWKN () : Promise<void> {
      let raw = [
          'export async function main(ns) {\n',
          '    await ns.sleep(ns.args[1]);\n',
          '    await ns.weaken(ns.args[0])\n;',
          '}'
      ];
      let compiled = ''
      raw.forEach( function (a) {compiled += a})
      await ns.write(config.WKN,compiled,'w')
      ns.tprint('INFO: created ' + config.WKN)
    }

    function formatNumber (num : number): string {
        if (num >= 10**12) {return ((num / 10**12).toFixed(2) + 'q').padStart(7,' ')}
        if (num >= 10**9) {return ((num / 10**9).toFixed(2) + 't').padStart(7,' ')}
        if (num >= 10**6) {return ((num / 10**6).toFixed(2) + 'm').padStart(7,' ')}
        if (num >= 10**3) {return ((num / 10**3).toFixed(2) + 'k').padStart(7,' ')}
        return ((num).toFixed(0) + '').padStart(7,' ')
    }

}