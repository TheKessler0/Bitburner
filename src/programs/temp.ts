import { NS } from '@ns';

export async function main(ns : NS) : Promise<void> {

    interface income {[key: string] : {[key: string] : number};

    let incomeOld : income[] = [];

    let servers :string[] | string = ['home'] //initialize with first server to scan from
        let thisScan :string[] = [] //current scan
        for (const server of servers) {
            thisScan = (ns.scan(server)) //do scan
            thisScan = thisScan.filter(function (a) { return !servers.includes(a) }); //filter servers allready in allServers out
            servers = [...servers,...thisScan] //merge allServers
        }

    const scripts = ['/programs/dependencies/1hack.js','/programs/dependencies/1grow.js','/programs/dependencies/1weaken.js'];

    let serverIncome : {[key: string] : {[key: string] : number}} = {};

    while(true) {

    await ns.sleep(250)

        for (const script of scripts) {
            for (const server of servers) {
                let processes = ns.ps(server).filter(function (a) { return a.filename === script})
                for (const process of processes) {
                    const target = process.args[0]
                    if (undefined === serverIncome[target]) serverIncome[target] = {};
                    if (undefined === serverIncome[target][script]) serverIncome[target][script] = 0;
                    serverIncome[target][script] += ns.getScriptIncome(script,server,...process.args)
                }
            }
        }

        for (let i = 1; i < 50; i++) {
            if (incomeOld[i] !== undefined) {
                incomeOld[i] = incomeOld[i+1]
            }
            ns.tprint(i)
        }
        incomeOld[50] = serverIncome



        ns.exit()

        ns.tprint(serverIncome)

    }
}