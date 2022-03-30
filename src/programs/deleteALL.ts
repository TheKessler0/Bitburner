import { NS } from '@ns';

export async function main(ns : NS) : Promise<void> {

    ns.disableLog('ALL')
    ns.clearLog()
    ns.tail()

    let allServers :string[] = ['home'] //initialize with first server to scan from
    let thisScan :string[] = [] //current scan
    for (const server of allServers) {
        thisScan = (ns.scan(server)) //do scan
        thisScan = thisScan.filter(function (a) { return !allServers.includes(a) }); //filter servers allready in allServers out
        allServers = [...allServers,...thisScan] //merge allServers
    }
    allServers.sort( function (a, b) {
        if (a !== 'home') { return -1 }
        else { return 0 }
    });

    for (const server of allServers) {

        const scripts = ns.ls(server).filter( function (a) { return !(a == ns.getScriptName() && server == ns.getHostname())});

        for (const script of scripts) {
            const type = '.' + script.replace(/^.*\./gm,'')
            const validTypes = ['.js','.script','.ns','.txt']
            if (validTypes.includes(type)) {
                if (ns.scriptRunning(script,server)) {
                    ns.scriptKill(script, server)
                    await ns.sleep(0)
                }
                if (ns.rm(script,server)) {
                    ns.print(`${server}: deleted "${script}"`)
                }
                await ns.sleep(0)
            }
        }
    }
    ns.print('WARN: DELETE THIS SCRIPT MANUALLY')
}