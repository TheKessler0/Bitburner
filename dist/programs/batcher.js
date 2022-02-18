export async function main(ns) {
    ns.exec('/programs/tools/watcher.js', 'home');
    ns.exec('/programs/tools/servinf.js', 'home');
    let ALL = [];
    let CURRENT = [];
    const SCRIPTS = {
        HCK: '/programs/dependencies/1hack.js',
        GRW: '/programs/dependencies/1grow.js',
        WKN: '/programs/dependencies/1weaken.js',
        CST: 1.80 // GB
    };
    let TARGET = '';
    let NEEDED_HCK = 0;
    let NEEDED_GRW = 0;
    let NEEDED_WKN_HCK = 0;
    let NEEDED_WKN_GRW = 0;
    let NEEDED_WKN_SEC = 0;
    let NEEDED_ALL = 0;
    let THREADS = 0;
    let FLUFFY = 0;
    let PSERV_ONLY = false;
    let batchcount = 0;
    let batch_failed = false;
    const flags = ns.flags([
        ['tresh', 500],
        ['server', false],
        ['hacknet', false]
    ]);
    flags.server = !flags.server;
    ns.disableLog('ALL');
    ns.clearLog();
    ns.tail();
    ns.print('\ntresh:   ' + flags.tresh + '\nserver:  ' + flags.server + '\nhacknet: ' + flags.hacknet + '\n');
    await startup(ns);
    await ns.sleep(5000);
    while (true) {
        await ns.sleep(0);
        if (batchcount >= Infinity) {
            batchcount = 0;
            ns.print('\nINFO: sleeping for 10s\n');
            await ns.sleep(10000);
        }
        let pserv_threads = 0;
        for (let i = 0; i < ns.getPurchasedServers().length && !PSERV_ONLY; i++) {
            pserv_threads += Math.floor((ns.getServerMaxRam(ns.getPurchasedServers()[i])) / SCRIPTS.CST);
            if (pserv_threads >= flags.tresh) {
                PSERV_ONLY = true;
            }
        }
        let prnt_S = '';
        let prnt_H = '';
        if (FLUFFY >= 69420) {
            FLUFFY = 0;
        }
        await refresh(ns);
        if (flags.server) {
            prnt_S = await Server(ns);
        }
        if (flags.hacknet) {
            prnt_H = await Hacknet(ns);
        }
        let temp = CURRENT;
        if (PSERV_ONLY) {
            CURRENT = CURRENT.filter(function (a) { return ns.getPurchasedServers().includes(a.name); });
        }
        THREADS = 0;
        for (let i = 0; i < CURRENT.length; i++) {
            THREADS += CURRENT[i].left;
        }
        if (prnt_S === undefined) {
            prnt_S = '';
        }
        if (prnt_H === undefined) {
            prnt_H = '';
        }
        let HACKPERCENT = 0.9875;
        while (HACKPERCENT > 0) {
            temp = temp.filter(function (a) { return ((ns.getHackingLevel() - ns.getServerRequiredHackingLevel(a.name)) >= 0) && (!ns.getPurchasedServers().includes(a.name)) && a.name != 'home'; });
            temp = temp.sort(function (a, b) { return b.value - a.value; });
            TARGET = '';
            for (let i = 0; i < temp.length; i++) {
                const GROWMULTIPLIER = Math.max((1 / (1 - HACKPERCENT)), ns.getServerMaxMoney(temp[i].name) / (ns.getServerMoneyAvailable(temp[i].name) + 1));
                NEEDED_HCK = Math.floor(ns.hackAnalyzeThreads(temp[i].name, ns.getServerMoneyAvailable(temp[i].name) * HACKPERCENT));
                NEEDED_GRW = Math.ceil(ns.growthAnalyze(temp[i].name, GROWMULTIPLIER));
                NEEDED_WKN_HCK = Math.ceil(NEEDED_HCK / 25);
                NEEDED_WKN_GRW = Math.ceil(NEEDED_GRW / 12.5);
                NEEDED_WKN_SEC = Math.ceil((ns.getServerSecurityLevel(temp[i].name) - ns.getServerMinSecurityLevel(temp[i].name)) / 0.05);
                NEEDED_ALL = (NEEDED_HCK + NEEDED_GRW + NEEDED_WKN_HCK + NEEDED_WKN_GRW + NEEDED_WKN_SEC + temp.length + ns.getPurchasedServers().length) - 1; //offset
                if (THREADS >= NEEDED_ALL && NEEDED_GRW > 0 && NEEDED_HCK > 0) {
                    TARGET = temp[i].name;
                    break;
                }
            }
            if (TARGET != '') {
                break;
            }
            HACKPERCENT -= 0.0125;
        }
        if (TARGET != '') {
            const printout = {
                name: TARGET,
                wkn: NEEDED_WKN_GRW + NEEDED_WKN_HCK + NEEDED_WKN_SEC,
                hck: NEEDED_HCK,
                grw: NEEDED_GRW,
                all: NEEDED_WKN_GRW + NEEDED_WKN_HCK + NEEDED_WKN_SEC + NEEDED_HCK + NEEDED_WKN_GRW,
                sec: (ns.getServerSecurityLevel(TARGET) - ns.getServerSecurityLevel(TARGET))
            };
            await batch(ns);
            if (!batch_failed) {
                batchcount++;
                ns.print('\nTarget:     ' + printout.name + '\nALL:        ' + printout.all + ' \nWeaken:     ' + printout.wkn + ' \nHack:       ' + printout.hck + ' \nGrow:       ' + printout.grw + ' \n$ stolen:   ' + formatMoney(ns.getServerMoneyAvailable(printout.name) * HACKPERCENT) + '\nSEC:        ' + printout.sec + '\nTTF:        ' + Math.ceil(ns.getWeakenTime(printout.name) / 1000) + 's\nOWNED ONLY: ' + PSERV_ONLY + '\n' + prnt_S + prnt_H);
            }
            else {
                //ns.print('\nINFO: BATCH CANCELED\n');
            }
        }
    }
    async function batch(ns) {
        const temp_weakentime = ns.getWeakenTime(TARGET);
        let current_batch = [];
        batch_failed = false;
        CURRENT = CURRENT.sort(function (a, b) { return a.left - b.left; });
        for (let i = 0; NEEDED_WKN_SEC > 0 && i < CURRENT.length && !batch_failed; i++) {
            if (CURRENT.length <= i) {
                ns.tprint('ERROR: SEC0 ' + TARGET);
                return;
            }
            const minimum = Math.min(CURRENT[i].left, NEEDED_WKN_SEC);
            if (minimum > 0) {
                if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                    batch_failed = true;
                }
                current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_SEC0'));
                NEEDED_WKN_SEC -= minimum;
                CURRENT[i].left -= minimum;
                if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                    batch_failed = true;
                }
            }
        }
        await ns.sleep(75); //catch-up time
        while (NEEDED_GRW > 0 && !batch_failed) {
            let n_grw = 0;
            const current_batch = [];
            await ns.sleep(75);
            CURRENT = CURRENT.sort(function (a, b) { return b.left - a.left; });
            for (let i = 0; NEEDED_GRW > 0 && !batch_failed; i++) {
                if (CURRENT.length <= i) {
                    ns.tprint('ERROR: GRW ' + TARGET);
                    return;
                }
                const minimum = Math.min(CURRENT[i].left, NEEDED_GRW);
                if (minimum > 0) {
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                    current_batch.push(ns.exec(SCRIPTS.GRW, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'GRW'));
                    n_grw = Math.ceil(minimum / 12.50);
                    NEEDED_GRW -= minimum;
                    CURRENT[i].left -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                    break;
                }
            }
            await ns.sleep(75);
            CURRENT = CURRENT.sort(function (a, b) { return a.left - b.left; });
            for (let i = 0; i < CURRENT.length && !batch_failed; i++) {
                if (CURRENT.length <= i) {
                    ns.tprint('ERROR : WKN_GRW ' + TARGET);
                    return;
                }
                const minimum = Math.min(n_grw, CURRENT[i].left);
                if (minimum > 0) {
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                    current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_GRW'));
                    CURRENT[i].left -= minimum;
                    n_grw -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                }
            }
            await ns.sleep(75);
        }
        while (NEEDED_HCK > 0 && !batch_failed) {
            let n_hck = 0;
            CURRENT = CURRENT.sort(function (a, b) { return a.left - b.left; });
            for (let i = 0; NEEDED_HCK > 0 && !batch_failed; i++) {
                if (CURRENT.length <= i) {
                    ns.tprint('ERROR: HCK ' + TARGET);
                    return;
                }
                const minimum = Math.min(CURRENT[i].left, NEEDED_HCK);
                if (minimum > 0) {
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                    current_batch.push(ns.exec(SCRIPTS.HCK, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'HCK'));
                    n_hck = Math.ceil(minimum / 25.00);
                    NEEDED_HCK -= minimum;
                    CURRENT[i].left -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                    break;
                }
            }
            await ns.sleep(75);
            for (let i = 0; i < CURRENT.length && !batch_failed; i++) {
                if (CURRENT.length <= i) {
                    ns.tprint('ERROR: WKN ' + TARGET);
                    return;
                }
                const minimum = Math.min(n_hck, CURRENT[i].left);
                if (minimum > 0) {
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                    current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_HCK'));
                    CURRENT[i].left -= minimum;
                    n_hck -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                }
            }
            await ns.sleep(75);
        }
        if (batch_failed || current_batch.includes(0) || temp_weakentime != ns.getWeakenTime(TARGET)) {
            current_batch = current_batch.filter(function (a) { return a !== 0; });
            for (let i = 0; i < current_batch.length; i++) {
                if (!ns.kill(current_batch[i])) {
                    ns.print('\nERROR: "ns.kill()" failed\n');
                }
            }
            await ns.sleep(Math.min(10000, Math.ceil(ns.getWeakenTime(TARGET) / 2)));
        }
    }
    async function startup(ns) {
        ALL = [];
        let stage1 = ['home'];
        for (let i = 0; i < stage1.length; i++) {
            const thisScan = ns.scan(stage1[i]);
            for (let j = 0; j < thisScan.length; j++) {
                if (!stage1.includes(thisScan[j])) {
                    stage1.push(thisScan[j]);
                }
                await ns.sleep(0);
            }
            await ns.sleep(0);
        }
        stage1 = stage1.filter(function (a) { return a != 'home'; });
        for (let i = 0; i < stage1.length; i++) {
            if (stage1[i] != 'home') {
                await ns.scp([SCRIPTS.GRW, SCRIPTS.HCK, SCRIPTS.WKN], 'home', stage1[i]);
            }
        }
        for (let i = 0; i < stage1.length; i++) {
            ALL.push({
                name: stage1[i],
                left: 0,
                value: 0,
                security: 0
            });
            await ns.sleep(0);
        }
    }
    async function refresh(ns) {
        CURRENT = ALL;
        const PORTS = {
            can_ssh: ns.fileExists('BruteSSH.exe'),
            can_ftp: ns.fileExists('FTPCrack.exe'),
            can_smtp: ns.fileExists('RelaySMTP.exe'),
            can_http: ns.fileExists('HTTPWorm.exe'),
            can_sql: ns.fileExists('SQLInject.exe'),
            possible: 0
        };
        PORTS.possible = ([PORTS.can_ssh, PORTS.can_ftp, PORTS.can_smtp, PORTS.can_http, PORTS.can_sql].filter(function (a) { return a; })).length;
        for (let i = 0; i < CURRENT.length; i++) {
            if (!ns.hasRootAccess(CURRENT[i].name) && ns.getServerNumPortsRequired(CURRENT[i].name) <= PORTS.possible) {
                if (PORTS.can_ssh) {
                    ns.brutessh(CURRENT[i].name);
                }
                if (PORTS.can_ftp) {
                    ns.ftpcrack(CURRENT[i].name);
                }
                if (PORTS.can_smtp) {
                    ns.relaysmtp(CURRENT[i].name);
                }
                if (PORTS.can_http) {
                    ns.httpworm(CURRENT[i].name);
                }
                if (PORTS.can_sql) {
                    ns.sqlinject(CURRENT[i].name);
                }
                ns.nuke(CURRENT[i].name);
            }
            const fakeServer = ns.getServer(CURRENT[i].name);
            fakeServer.hackDifficulty = fakeServer.minDifficulty;
            fakeServer.moneyAvailable = fakeServer.moneyMax;
            CURRENT[i].left = Math.floor((ns.getServerMaxRam(CURRENT[i].name) - ns.getServerUsedRam(CURRENT[i].name)) / SCRIPTS.CST);
            CURRENT[i].security = ns.getServerSecurityLevel(CURRENT[i].name) - ns.getServerMinSecurityLevel(CURRENT[i].name);
            CURRENT[i].value = 1;
            CURRENT[i].value *= ns.getServerMaxMoney(CURRENT[i].name) * ns.hackAnalyze(CURRENT[i].name) * ns.formulas.hacking.hackChance(fakeServer, ns.getPlayer());
            CURRENT[i].value /= ns.formulas.hacking.weakenTime(fakeServer, ns.getPlayer());
        }
        CURRENT = CURRENT.filter(function (a) { return (ns.hasRootAccess(a.name)); });
    }
    async function Server(ns) {
        let prnt = '';
        let servers = [];
        for (let i = 0; i < 25; i++) {
            servers.push({
                name: '',
                ram: 0
            });
            servers[i].name = 'S' + ('' + (i + 1)).padStart(2, '0');
            if (ns.serverExists(servers[i].name)) {
                servers[i].ram = ns.getServerMaxRam(servers[i].name);
            }
        }
        servers = servers.sort(function (a, b) { return a.ram - b.ram; });
        let maxram = 2 ** 20;
        for (let i = 20; ns.getPurchasedServerCost(maxram) > ns.getPlayer().money && i > 1; i -= 2) {
            maxram = Math.min(2 ** i, 2 ** 2);
        }
        if (maxram == 0 || servers[0].ram == 2 ** 20 || ns.getPurchasedServerCost(maxram) > ns.getPlayer().money) {
            return prnt;
        }
        if (maxram > servers[0].ram) {
            //if server already exists, kill all scripts and delete it
            if (ns.serverExists(servers[0].name)) {
                CURRENT = CURRENT.filter(function (a) { return a.name != servers[0].name; });
                prnt = 'RESERVING:  ' + servers[0].name + '\n';
                if (ns.getServerUsedRam(servers[0].name) == 0) {
                    ns.deleteServer(servers[0].name);
                    await ns.sleep(75);
                    ns.purchaseServer(servers[0].name, maxram);
                    await ns.scp([SCRIPTS.GRW, SCRIPTS.HCK, SCRIPTS.WKN], 'home', servers[0].name);
                    prnt = 'UPGRADED:   ' + servers[0].name + '\n';
                }
            }
            else {
                ns.purchaseServer(servers[0].name, maxram);
                await ns.sleep(75);
                await ns.scp([SCRIPTS.GRW, SCRIPTS.HCK, SCRIPTS.WKN], 'home', servers[0].name);
                prnt = 'BOUGHT ' + servers[0].name + '\n';
                await startup(ns);
                await refresh(ns);
            }
            return prnt;
        }
        return prnt;
    }
    async function Hacknet(ns) {
        let nothing_to_do = false;
        let prnt = '';
        if (ns.hacknet.numNodes() == 0) {
            ns.hacknet.purchaseNode();
        }
        for (let i = 0; !nothing_to_do && i <= 24; i++) {
            let index_lvl = 0;
            let index_ram = 0;
            let index_cpu = 0;
            let cost_lvl = Infinity;
            let cost_ram = Infinity;
            let cost_cpu = Infinity;
            let cost_new = Infinity;
            const money = ns.getPlayer().money;
            //get node with lowest stats
            for (let j = ns.hacknet.numNodes(); j > 0; j--) {
                if (ns.hacknet.getLevelUpgradeCost(j - 1, 1) < cost_lvl) {
                    index_lvl = (j - 1);
                }
                if (ns.hacknet.getRamUpgradeCost(j - 1, 1) < cost_ram) {
                    index_ram = (j - 1);
                }
                if (ns.hacknet.getCoreUpgradeCost(j - 1, 1) < cost_cpu) {
                    index_cpu = (j - 1);
                }
                //get costs
                cost_lvl = ns.hacknet.getLevelUpgradeCost(index_lvl, 1);
                cost_ram = ns.hacknet.getRamUpgradeCost(index_ram, 1);
                cost_cpu = ns.hacknet.getCoreUpgradeCost(index_cpu, 1);
                cost_new = ns.hacknet.getPurchaseNodeCost();
                //await ns.sleep(0)
            }
            if ((money >= Math.min(cost_lvl, cost_ram, cost_cpu, cost_new) && ns.hacknet.numNodes() <= 23)) {
                prnt = 'UPGRADING HACKNET\n';
            }
            //buy cheapest
            if (cost_lvl == Math.min(cost_lvl, cost_ram, cost_cpu, cost_new, money)) {
                ns.hacknet.upgradeLevel(index_lvl, 1);
            }
            else if (cost_ram == Math.min(cost_lvl, cost_ram, cost_cpu, cost_new, money)) {
                ns.hacknet.upgradeRam(index_ram, 1);
            }
            else if (cost_cpu == Math.min(cost_lvl, cost_ram, cost_cpu, cost_new, money)) {
                ns.hacknet.upgradeCore(index_cpu, 1);
            }
            else if ((cost_new == Math.min(cost_lvl, cost_ram, cost_cpu, cost_new, money)) && ns.hacknet.numNodes() <= 23) {
                ns.hacknet.purchaseNode();
            }
            else {
                nothing_to_do = true;
            }
            //await ns.sleep(0)
        }
        //await ns.sleep(0)
        return prnt;
    }
    function formatMoney(money) {
        if (money >= 10 ** 15) {
            return ('$' + (money / 10 ** 15).toFixed(2) + 's');
        }
        if (money >= 10 ** 12) {
            return ('$' + (money / 10 ** 12).toFixed(2) + 'q');
        }
        if (money >= 10 ** 9) {
            return ('$' + (money / 10 ** 9).toFixed(2) + 't');
        }
        if (money >= 10 ** 6) {
            return ('$' + (money / 10 ** 6).toFixed(2) + 'm');
        }
        if (money >= 10 ** 3) {
            return ('$' + (money / 10 ** 3).toFixed(2) + 'k');
        }
        return ('$' + (money / 10 ** 0).toFixed(2) + ' ');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbInByb2dyYW1zL2JhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBTztJQUM5QixFQUFFLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLEVBQUUsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUMsSUFBSSxHQUFHLEdBQVUsRUFBRSxDQUFDO0lBQ3BCLElBQUksT0FBTyxHQUFVLEVBQUUsQ0FBQztJQUN4QixNQUFNLE9BQU8sR0FBRztRQUNaLEdBQUcsRUFBRSxpQ0FBaUM7UUFDdEMsR0FBRyxFQUFFLGlDQUFpQztRQUN0QyxHQUFHLEVBQUUsbUNBQW1DO1FBQ3hDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSztLQUNsQixDQUFDO0lBQ0YsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNuQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDbkIsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztJQUN2QixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7SUFDdkIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNoQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDZixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDdkIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztJQUN6QixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ25CLENBQUMsT0FB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SyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFBRSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7U0FBRTtRQUM3RSxJQUFJLEtBQUssSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1NBQUU7UUFDM0UsSUFBSSxLQUFLLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTtTQUFFO1FBQzNFLElBQUksS0FBSyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFBRSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7U0FBRTtRQUMzRSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7SUFDckQsQ0FBQztBQUNMLENBQUMifQ==