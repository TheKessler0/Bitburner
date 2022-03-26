export async function main(ns) {
    ns.disableLog('ALL');
    ns.clearLog();
    ns.tail();
    let target = ns.args[0];
    if (target === undefined || typeof target !== 'string') {
        target = 'n00dles';
    }
    const scripts = {
        HCK: "/programs/dependencies/1hack.js",
        GRW: "/programs/dependencies/1grow.js",
        WKN: "/programs/dependencies/1weaken.js",
    };
    if (!ns.fileExists(scripts.HCK, 'home')) {
        await createHCK();
    }
    if (!ns.fileExists(scripts.GRW, 'home')) {
        await createGRW();
    }
    if (!ns.fileExists(scripts.WKN, 'home')) {
        await createWKN();
    }
    while (true) {
        let allServers = ['home']; //initialize with first server to scan from
        let thisScan = []; //current scan
        for (const server of allServers) {
            thisScan = (ns.scan(server)); //do scan
            thisScan = thisScan.filter(function (a) { return !allServers.includes(a); }); //filter servers allready in allServers out
            allServers = [...allServers, ...thisScan]; //merge allServers
        }
        const portOpeners = {
            ssh: ns.fileExists('BruteSSH.exe', 'home'),
            ftp: ns.fileExists('FTPCrack.exe', 'home'),
            sql: ns.fileExists('SQLInject.exe', 'home'),
            http: ns.fileExists('HTTPWorm.exe', 'home'),
            smtp: ns.fileExists('relaySMTP.exe', 'home'),
            Possible: 0 //number of possible ports to open
        };
        if (portOpeners.ssh) {
            portOpeners.Possible += 1;
        } //count possible
        if (portOpeners.ftp) {
            portOpeners.Possible += 1;
        }
        if (portOpeners.sql) {
            portOpeners.Possible += 1;
        }
        if (portOpeners.http) {
            portOpeners.Possible += 1;
        }
        if (portOpeners.smtp) {
            portOpeners.Possible += 1;
        }
        let workers = allServers;
        allServers = allServers.filter(function (a) { return ns.getServerNumPortsRequired(a) <= portOpeners.Possible && !ns.hasRootAccess(a); }); //filter by rootable and hasroot
        for (const server of allServers) {
            if (portOpeners.ssh) {
                ns.brutessh(server);
            } //open ports
            if (portOpeners.ftp) {
                ns.ftpcrack(server);
            }
            if (portOpeners.sql) {
                ns.sqlinject(server);
            }
            if (portOpeners.http) {
                ns.httpworm(server);
            }
            if (portOpeners.smtp) {
                ns.relaysmtp(server);
            }
            ns.nuke(server); //nuke
        }
        let action = '';
        if (ns.getServerMinSecurityLevel(target) - ns.getServerSecurityLevel(target) > 3) {
            action = 'weaken';
        }
        else if (0.75 * (ns.getServerMaxMoney(target)) > ns.getServerMoneyAvailable(target)) {
            action = 'grow';
        }
        else {
            action = 'hack';
        }
        let sleeptime = 0;
        workers = workers.filter(function (a) { return ns.hasRootAccess(a); });
        switch (action) {
            case 'weaken': {
                for (const worker of workers) {
                    if (ns.fileExists(scripts.WKN, target)) {
                        await ns.scp(scripts.WKN, target, 'home');
                    }
                    let threads = Math.floor((ns.getServerMaxRam(worker) - ns.getServerUsedRam(worker)) / ns.getScriptRam(scripts.WKN, target));
                    ns.exec(scripts.WKN, worker, threads, target, 0);
                }
                sleeptime = ns.getWeakenTime(target) + 500;
                break;
            }
            case 'grow': {
                for (const worker of workers) {
                    if (ns.fileExists(scripts.GRW, target)) {
                        await ns.scp(scripts.GRW, target, 'home');
                    }
                    let threads = Math.floor((ns.getServerMaxRam(worker) - ns.getServerUsedRam(worker)) / ns.getScriptRam(scripts.GRW, target));
                    ns.exec(scripts.GRW, worker, threads, target, 0);
                }
                sleeptime = ns.getGrowTime(target) + 500;
                break;
            }
            case 'hack': {
                for (const worker of workers) {
                    if (ns.fileExists(scripts.HCK, target)) {
                        await ns.scp(scripts.HCK, target, 'home');
                    }
                    let threads = Math.floor((ns.getServerMaxRam(worker) - ns.getServerUsedRam(worker)) / ns.getScriptRam(scripts.HCK, target));
                    ns.exec(scripts.HCK, worker, threads, target, 0);
                }
                sleeptime = ns.getHackTime(target) + 500;
                break;
            }
            default: {
                sleeptime = 1000;
                break;
            }
        }
        await ns.sleep(sleeptime);
    }
    async function createHCK() {
        let raw = [
            'export async function main(ns) {\n',
            '    await ns.sleep(ns.args[1]);\n',
            '    await ns.hack(ns.args[0]);\n',
            '}'
        ];
        let compiled = '';
        raw.forEach(function (a) { compiled += a; });
        await ns.write(scripts.HCK, compiled, 'w');
        ns.tprint('INFO: created ' + scripts.HCK);
    }
    async function createGRW() {
        let raw = [
            'export async function main(ns) {\n',
            '    await ns.sleep(ns.args[1]);\n',
            '    await ns.grow(ns.args[0]);\n',
            '}'
        ];
        let compiled = '';
        raw.forEach(function (a) { compiled += a; });
        await ns.write(scripts.GRW, compiled, 'w');
        ns.tprint('INFO: created ' + scripts.GRW);
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
        await ns.write(scripts.WKN, compiled, 'w');
        ns.tprint('INFO: created ' + scripts.WKN);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWFybHkgaGFja3NjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbInByb2dyYW1zL2Vhcmx5IGhhY2tzY3JpcHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBTztJQUU5QixFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3BCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUNiLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUVULElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdkIsSUFBSSxNQUFNLEtBQUssU0FBUyxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtRQUFFLE1BQU0sR0FBRyxTQUFTLENBQUE7S0FBQztJQUU3RSxNQUFNLE9BQU8sR0FBRztRQUNaLEdBQUcsRUFBQyxpQ0FBaUM7UUFDckMsR0FBRyxFQUFDLGlDQUFpQztRQUNyQyxHQUFHLEVBQUMsbUNBQW1DO0tBQzFDLENBQUE7SUFFRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQUUsTUFBTSxTQUFTLEVBQUUsQ0FBQTtLQUFFO0lBQzdELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUMsTUFBTSxDQUFDLEVBQUU7UUFBRSxNQUFNLFNBQVMsRUFBRSxDQUFBO0tBQUU7SUFDN0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBQyxNQUFNLENBQUMsRUFBRTtRQUFFLE1BQU0sU0FBUyxFQUFFLENBQUE7S0FBRTtJQUU3RCxPQUFPLElBQUksRUFBRTtRQUVULElBQUksVUFBVSxHQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFB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