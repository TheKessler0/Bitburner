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
    /** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
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
        await ns.sleep(50); //catch-up time
        while (NEEDED_GRW > 0 && !batch_failed) {
            let n_grw = 0;
            const current_batch = [];
            await ns.sleep(50);
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
            await ns.sleep(50);
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
            await ns.sleep(50);
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
            await ns.sleep(50);
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
            await ns.sleep(50);
        }
        if (temp_weakentime != ns.getWeakenTime(TARGET)) {
            batch_failed = true;
        }
        if (batch_failed || current_batch.includes(0)) {
            current_batch = current_batch.filter(function (a) { return a !== 0; });
            for (let i = 0; i < current_batch.length; i++) {
                if (!ns.kill(current_batch[i])) {
                    ns.print('\nERROR: "ns.kill()" failed\n');
                }
                batch_failed = true;
            }
        }
    }
    /** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
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
    /**@param ns{NS} */
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
        for (let i = 20; ns.getPurchasedServerCost(maxram) > ns.getPlayer().money && i > 1; i--) {
            maxram = 2 ** i;
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
                    await ns.sleep(100);
                    ns.purchaseServer(servers[0].name, maxram);
                    await ns.scp([SCRIPTS.GRW, SCRIPTS.HCK, SCRIPTS.WKN], 'home', servers[0].name);
                    prnt = 'UPGRADED:   ' + servers[0].name + '\n';
                }
            }
            else {
                ns.purchaseServer(servers[0].name, maxram);
                await ns.sleep(100);
                await ns.scp([SCRIPTS.GRW, SCRIPTS.HCK, SCRIPTS.WKN], 'home', servers[0].name);
                prnt = 'BOUGHT ' + servers[0].name + '\n';
                await startup(ns);
                await refresh(ns);
            }
            return prnt;
        }
        return prnt;
    }
    /**@param ns{NS} */
    async function Hacknet(ns) {
        let nothing_to_do = false;
        let prnt = '';
        //get first node
        if (ns.hacknet.numNodes() == 0) {
            ns.hacknet.purchaseNode();
        }
        //lööp
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbInByb2dyYW1zL2JhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBTztJQUM5QixFQUFFLENBQUMsSUFBSSxDQUFDLDRCQUE0QixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlDLEVBQUUsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDOUMsSUFBSSxHQUFHLEdBQVUsRUFBRSxDQUFDO0lBQ3BCLElBQUksT0FBTyxHQUFVLEVBQUUsQ0FBQztJQUN4QixNQUFNLE9BQU8sR0FBRztRQUNaLEdBQUcsRUFBRSxpQ0FBaUM7UUFDdEMsR0FBRyxFQUFFLGlDQUFpQztRQUN0QyxHQUFHLEVBQUUsbUNBQW1DO1FBQ3hDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSztLQUNsQixDQUFDO0lBQ0YsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztJQUNuQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDbkIsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztJQUN2QixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7SUFDdkIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztJQUNoQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDZixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDdkIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztJQUN6QixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ25CLENBQUMsT0FB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R0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1NBQUU7UUFDN0UsSUFBSSxLQUFLLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtZQUFFLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTtTQUFFO1FBQzNFLElBQUksS0FBSyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFBRSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7U0FBRTtRQUMzRSxJQUFJLEtBQUssSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO1NBQUU7UUFDM0UsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLEtBQUssR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO0lBQ3JELENBQUM7QUFDTCxDQUFDIn0=