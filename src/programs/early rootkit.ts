import { NS } from '@ns';

export async function main(ns : NS) : Promise<void> {
    ns.tail()
    ns.disableLog('ALL')

    const script = '/programs/dependencies/1share.js'
    const servers = ns.getPurchasedServers()

    for (let i = 0; i < servers.length; i++) {
        ns.killall(servers[i])
        await ns.scp(script,'home',servers[i])
    }

    ns.clearLog()

    while (true) {
        let prnt = ''
        let allThreads = 0
        for (let i = 0; i < servers.length; i++) {
            const threads = Math.floor((ns.getServerMaxRam(servers[i]) - ns.getServerUsedRam(servers[i])) / ns.getScriptRam(script))
            if (threads > 0) {
                allThreads += threads
                ns.exec(script,servers[i],threads)
                prnt += (`\n${servers[i]}: ${formatNumber(threads)} threads`)
            }
        }
        if (allThreads > 0) {
            prnt += `\nALL: ${formatNumber(allThreads)} threads`
            ns.clearLog()
            ns.print(prnt)
        }
        await ns.sleep(1000)
    }

    function formatNumber (num : number): string {
        if (num >= 10**12) { return ((num / 10**12).toFixed(2) + 'q').padStart(7,' ') }
        if (num >= 10**9) { return ((num / 10**9).toFixed(2) + 't').padStart(7,' ') }
        if (num >= 10**6) { return ((num / 10**6).toFixed(2) + 'm').padStart(7,' ') }
        if (num >= 10**3) { return ((num / 10**3).toFixed(2) + 'k').padStart(7,' ') }
        return ((num).toFixed(0) + '').padStart(7,' ')
    }

}