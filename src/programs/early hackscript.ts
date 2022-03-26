import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {

    ns.disableLog('ALL')
    ns.clearLog()
    ns.tail()

    let target = ns.args[0]
    if (target === undefined || typeof target !== 'string') { target = 'n00dles'}

    const scripts = {
        HCK:"/programs/dependencies/1hack.js",
        GRW:"/programs/dependencies/1grow.js",
        WKN:"/programs/dependencies/1weaken.js",
    }

    if (!ns.fileExists(scripts.HCK,'home')) { await createHCK() }
    if (!ns.fileExists(scripts.GRW,'home')) { await createGRW() }
    if (!ns.fileExists(scripts.WKN,'home')) { await createWKN() }

    while (true) {

        let allServers :string[] | string = ['home'] //initialize with first server to scan from
        let thisScan :string[] = [] //current scan
        for (const server of allServers) {
            thisScan = (ns.scan(server)) //do scan
            thisScan = thisScan.filter(function (a) { return !allServers.includes(a) }); //filter servers allready in allServers out
            allServers = [...allServers,...thisScan] //merge allServers
        }

        const portOpeners = {
            ssh: ns.fileExists('BruteSSH.exe','home'), //has ssh?
            ftp: ns.fileExists('FTPCrack.exe','home'), //has ftp?
            sql: ns.fileExists('SQLInject.exe','home'), //has sql?
            http: ns.fileExists('HTTPWorm.exe','home'), //has http?
            smtp: ns.fileExists('relaySMTP.exe','home'), //has smtp?
            Possible: 0 //number of possible ports to open
        }
        if (portOpeners.ssh) { portOpeners.Possible += 1 } //count possible
        if (portOpeners.ftp) { portOpeners.Possible += 1 }
        if (portOpeners.sql) { portOpeners.Possible += 1 }
        if (portOpeners.http) { portOpeners.Possible += 1 }
        if (portOpeners.smtp) { portOpeners.Possible += 1 }

        let workers = allServers
        allServers = allServers.filter(function (a) { return ns.getServerNumPortsRequired(a) <= portOpeners.Possible && !ns.hasRootAccess(a) }) //filter by rootable and hasroot

        for (const server of allServers) {

            if (portOpeners.ssh) { ns.brutessh(server) } //open ports
            if (portOpeners.ftp) { ns.ftpcrack(server) }
            if (portOpeners.sql) { ns.sqlinject(server) }
            if (portOpeners.http) { ns.httpworm(server) }
            if (portOpeners.smtp) { ns.relaysmtp(server) }
            ns.nuke(server) //nuke
        }

        let action = ''
        if (ns.getServerMinSecurityLevel(target) - ns.getServerSecurityLevel(target) > 3) { action = 'weaken' }
        else if ( 0.75 * (ns.getServerMaxMoney(target)) > ns.getServerMoneyAvailable(target)) { action = 'grow' }
        else { action = 'hack' }
        let sleeptime = 0
        workers = workers.filter( function (a) { return ns.hasRootAccess(a) })
        

        switch(action) {
            case 'weaken': {
                for (const worker of workers) {
                    if (ns.fileExists(scripts.WKN,target)) {
                        await ns.scp(scripts.WKN,target,'home')
                    }
                    let threads = Math.floor((ns.getServerMaxRam(worker) - ns.getServerUsedRam(worker)) / ns.getScriptRam(scripts.WKN,target))
                    ns.exec(scripts.WKN,worker,threads,target,0)
                }
                sleeptime = ns.getWeakenTime(target) + 500
                break
            }
            case 'grow': {
                for (const worker of workers) {
                    if (ns.fileExists(scripts.GRW,target)) {
                        await ns.scp(scripts.GRW,target,'home')
                    }
                    let threads = Math.floor((ns.getServerMaxRam(worker) - ns.getServerUsedRam(worker)) / ns.getScriptRam(scripts.GRW,target))
                    ns.exec(scripts.GRW,worker,threads,target,0)
            }
                sleeptime = ns.getGrowTime(target) + 500
                break
            }
            case 'hack': {
                for (const worker of workers) {
                    if (ns.fileExists(scripts.HCK,target)) {
                        await ns.scp(scripts.HCK,target,'home')
                    }
                    let threads = Math.floor((ns.getServerMaxRam(worker) - ns.getServerUsedRam(worker)) / ns.getScriptRam(scripts.HCK,target))
                    ns.exec(scripts.HCK,worker,threads,target,0)
                }
                sleeptime = ns.getHackTime(target) + 500
                break
            }

            default: {
                sleeptime = 1000
                break
            }
        }
        
        await ns.sleep(sleeptime)

    }


    
    
    async function createHCK () : Promise<void> {
        let raw = [
            'export async function main(ns) {\n',
            '    await ns.sleep(ns.args[1]);\n',
            '    await ns.hack(ns.args[0]);\n',
            '}'
        ];
        let compiled = ''
        raw.forEach( function (a) {compiled += a})
        await ns.write(scripts.HCK,compiled,'w')
        ns.tprint('INFO: created ' + scripts.HCK)
    }

    async function createGRW () : Promise<void> {
        let raw = [
            'export async function main(ns) {\n',
            '    await ns.sleep(ns.args[1]);\n',
            '    await ns.grow(ns.args[0]);\n',
            '}'
        ];
        let compiled = ''
        raw.forEach( function (a) {compiled += a})
        await ns.write(scripts.GRW,compiled,'w')
        ns.tprint('INFO: created ' + scripts.GRW)
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
        await ns.write(scripts.WKN,compiled,'w')
        ns.tprint('INFO: created ' + scripts.WKN)
    }
}