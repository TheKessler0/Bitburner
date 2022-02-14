/** @param {import('@ns').NS} ns */
export async function main(ns) {
    ns.exec('/programs/tools/watcher.js', 'home');
    ns.exec('/programs/tools/servinf.js', 'home');
    let ALL = [];
    let CURRENT = [];
    const SCRIPTS = {
        HCK: '/programs/dependencies/1hack.js',
        GRW: '/programs/dependencies/1grow.js',
        WKN: '/programs/dependencies/1weaken.js',
        CST: 1.80 //GB
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

    ns.hack()

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
        ;
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
        ;
        THREADS = 0;
        for (let i = 0; i < CURRENT.length; i++) {
            THREADS += CURRENT[i].left;
        }
        if (prnt_S === undefined) {
            prnt_S = '';
        }
        ;
        if (prnt_H === undefined) {
            prnt_H = '';
        }
        ;
        let HACKPERCENT = 0.9875;
        while (HACKPERCENT > 0) {
            temp = temp.filter(function (a) { return ((ns.getHackingLevel() - ns.getServerRequiredHackingLevel(a.name)) >= 0) && (!ns.getPurchasedServers().includes(a.name)) && a.name != 'home'; });
            temp = temp.sort(function (a, b) { return b.value - a.value; });
            TARGET = '';
            for (let i = 0; i < temp.length; i++) {
                let GROWMULTIPLIER = Math.max((1 / (1 - HACKPERCENT)), ns.getServerMaxMoney(temp[i].name) / (ns.getServerMoneyAvailable(temp[i].name) + 1));
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
            if (TARGET != '') { break };

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
            let minimum = Math.min(CURRENT[i].left, NEEDED_WKN_SEC);
            if (minimum > 0) {
                if (temp_weakentime != ns.getWeakenTime(TARGET)) {batch_failed = true};
                current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_SEC0'));
                NEEDED_WKN_SEC -= minimum;
                CURRENT[i].left -= minimum;
                if (temp_weakentime != ns.getWeakenTime(TARGET)) {batch_failed = true};
            }
        }
        await ns.sleep(50); //catch-up time
        while (NEEDED_GRW > 0 && !batch_failed) {
            let n_grw = 0;
            let current_batch = [];

            await ns.sleep(50)

            CURRENT = CURRENT.sort(function (a, b) { return b.left - a.left; });
            for (let i = 0; NEEDED_GRW > 0 && !batch_failed; i++) {
                if (CURRENT.length <= i) {
                    ns.tprint('ERROR: GRW ' + TARGET);
                    return;
                }
                let minimum = Math.min(CURRENT[i].left, NEEDED_GRW);
                if (minimum > 0) {
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {batch_failed = true};
                    current_batch.push(ns.exec(SCRIPTS.GRW, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'GRW'));
                    n_grw = Math.ceil(minimum / 12.50);
                    NEEDED_GRW -= minimum;
                    CURRENT[i].left -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {batch_failed = true};
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
                let minimum = Math.min(n_grw, CURRENT[i].left);
                if (minimum > 0) {
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {batch_failed = true};
                    current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_GRW'));
                    CURRENT[i].left -= minimum;
                    n_grw -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {batch_failed = true};
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
                let minimum = Math.min(CURRENT[i].left, NEEDED_HCK);
                if (minimum > 0) {
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {batch_failed = true};
                    current_batch.push(ns.exec(SCRIPTS.HCK, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'HCK'));
                    n_hck = Math.ceil(minimum / 25.00);
                    NEEDED_HCK -= minimum;
                    CURRENT[i].left -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {batch_failed = true};
                    break;
                }
            }
            await ns.sleep(50);
            for (let i = 0; i < CURRENT.length && !batch_failed; i++) {
                if (CURRENT.length <= i) {
                    ns.tprint('ERROR: WKN ' + TARGET);
                    return;
                }
                let minimum = Math.min(n_hck, CURRENT[i].left);
                if (minimum > 0) {
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {batch_failed = true};
                    current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_HCK'));
                    CURRENT[i].left -= minimum;
                    n_hck -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {batch_failed = true};
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
                ;
                batch_failed = true;
            }
        }
    }
    /** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
    async function startup(ns) {
        ALL = [];
        let stage1 = ['home'];
        for (let i = 0; i < stage1.length; i++) {
            let thisScan = ns.scan(stage1[i]);
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
    /** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
    async function refresh(ns) {
        CURRENT = ALL;
        let PORTS = {
            can_ssh: ns.fileExists('BruteSSH.exe'),
            can_ftp: ns.fileExists('FTPCrack.exe'),
            can_smtp: ns.fileExists('RelaySMTP.exe'),
            can_http: ns.fileExists('HTTPWorm.exe'),
            can_sql: ns.fileExists('SQLInject.exe'),
            possible: 0
        };
        PORTS.possible = PORTS.can_ssh + PORTS.can_ftp + PORTS.can_smtp + PORTS.can_http + PORTS.can_sql;
        for (let i = 0; i < CURRENT.length; i++) {
            if (!ns.hasRootAccess(CURRENT[i].name) && ns.getServerNumPortsRequired(CURRENT[i].name) <= PORTS.possible) {
                if (PORTS.can_ssh) {
                    ns.brutessh(CURRENT[i].name);
                }
                ;
                if (PORTS.can_ftp) {
                    ns.ftpcrack(CURRENT[i].name);
                }
                ;
                if (PORTS.can_smtp) {
                    ns.relaysmtp(CURRENT[i].name);
                }
                ;
                if (PORTS.can_http) {
                    ns.httpworm(CURRENT[i].name);
                }
                ;
                if (PORTS.can_sql) {
                    ns.sqlinject(CURRENT[i].name);
                }
                ;
                ns.nuke(CURRENT[i].name);
            }
            let fakeServer = ns.getServer(CURRENT[i].name);
            fakeServer.hackDifficulty = fakeServer.minDifficulty
            fakeServer.moneyAvailable = fakeServer.moneyMax
            
            CURRENT[i].left = Math.floor((ns.getServerMaxRam(CURRENT[i].name) - ns.getServerUsedRam(CURRENT[i].name)) / SCRIPTS.CST);
            CURRENT[i].security = ns.getServerSecurityLevel(CURRENT[i].name) - ns.getServerMinSecurityLevel(CURRENT[i].name);
            CURRENT[i].value = 1;
            CURRENT[i].value *= ns.getServerMaxMoney(CURRENT[i].name) * ns.hackAnalyze(CURRENT[i].name, 0.95) * ns.formulas.hacking.hackChance(fakeServer, ns.getPlayer());
            CURRENT[i].value /= ns.formulas.hacking.weakenTime(fakeServer,ns.getPlayer());
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
            ;
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
            let money = ns.getPlayer().money;
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
            ;
            if ((money >= Math.min(cost_lvl, cost_ram, cost_cpu, cost_new) && ns.hacknet.numNodes() <= 23)) {
                prnt = 'UPGRADING HACKNET\n';
            }
            ;
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

    function formatMoney (money) {
        if (money >= 10**15) { return ('$' + (money / 10**15).toFixed(2) + 's') }
        if (money >= 10**12) { return ('$' + (money / 10**12).toFixed(2) + 'q') }
        if (money >= 10**9) { return ('$' + (money / 10**9).toFixed(2) + 't') }
        if (money >= 10**6) { return ('$' + (money / 10**6).toFixed(2) + 'm') }
        if (money >= 10**3) { return ('$' + (money / 10**3).toFixed(2) + 'k') }
        if (money >= 10**0) { return ('$' + (money / 10**0).toFixed(2) + ' ') }
    }

}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbImJhdGNoZXIvYmF0Y2hlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxtQkFBbUI7QUFDbkIsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBRTtJQUV6QixFQUFFLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQzVDLEVBQUUsQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFFNUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFBO0lBQ1osSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFBO0lBQ2hCLE1BQU0sT0FBTyxHQUFHO1FBQ1osR0FBRyxFQUFFLGdDQUFnQztRQUNyQyxHQUFHLEVBQUUsZ0NBQWdDO1FBQ3JDLEdBQUcsRUFBRSxrQ0FBa0M7UUFDdkMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJO0tBQ2pCLENBQUE7SUFDRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUE7SUFDZixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUE7SUFDbEIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFBO0lBQ2xCLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQTtJQUN0QixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUE7SUFDdEIsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFBO0lBQ3RCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQTtJQUNsQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUE7SUFDZixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUE7SUFDZCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUE7SUFDdEIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFBO0lBQ2xCLElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQTtJQUV4QixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ25C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