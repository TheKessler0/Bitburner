import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {

    const scripts = ['script1.js', 'script2.js','script3.js','script4.js'] //the files you want to scp over

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

        allServers = allServers.filter(function (a) { return ns.getServerNumPortsRequired(a) <= portOpeners.Possible && !ns.hasRootAccess(a) }) //filter by rootable and hasroot

        for (let i = 0; i < allServers.length; i++) {

            if (portOpeners.ssh) { ns.brutessh(allServers[i]) } //open ports
            if (portOpeners.ftp) { ns.ftpcrack(allServers[i]) }
            if (portOpeners.sql) { ns.sqlinject(allServers[i]) }
            if (portOpeners.http) { ns.httpworm(allServers[i]) }
            if (portOpeners.smtp) { ns.relaysmtp(allServers[i]) }
            ns.nuke(allServers[i]) //nuke

            if (scripts.length > 0) { await ns.scp(scripts,'home',allServers[i]) } //scp stuff over

        }
        await ns.sleep(1000) //i hope you know what this does
    }
}