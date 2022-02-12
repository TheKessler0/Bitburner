/**@param ns{NS} */
export async function main(ns) {

    ns.exec('/batcher/tools/watcher.js', 'home')
    ns.exec('/batcher/tools/servinf.js', 'home')

    let ALL = []
    let CURRENT = []
    const SCRIPTS = {
        HCK: '/batcher/dependencies/1hack.js',
        GRW: '/batcher/dependencies/1grow.js',
        WKN: '/batcher/dependencies/1weaken.js',
        CST: 1.80 //GB
    }
    let TARGET = ''
    let NEEDED_HCK = 0
    let NEEDED_GRW = 0
    let NEEDED_WKN_HCK = 0
    let NEEDED_WKN_GRW = 0
    let NEEDED_WKN_SEC = 0
    let NEEDED_ALL = 0
    let THREADS = 0
    let FLUFFY = 0
    let PSERV_ONLY = false
    let batchcount = 0
    let batch_failed = false

    const flags = ns.flags([
        ['tresh', 2000],
        ['server', false],
        ['hacknet', false]
    ])
    flags.server = !flags.server

    ns.disableLog('ALL')
    ns.clearLog()
    ns.tail()

    ns.print('\ntresh:   ' + flags.tresh + '\nserver:  ' + flags.server + '\nhacknet: ' + flags.hacknet + '\n')

    await startup(ns)

    await ns.sleep(5000)

    while (true) {
        await ns.sleep(0)

        if (batchcount >= 50) { batchcount = 0; ns.print('\nINFO: sleeping for 10s\n'); await ns.sleep(10000) }

        let pserv_threads = 0
        for (let i = 0; i < ns.getPurchasedServers().length && !PSERV_ONLY; i++) {
            pserv_threads += Math.floor((ns.getServerMaxRam(ns.getPurchasedServers()[i])) / SCRIPTS.CST)
            if (pserv_threads >= flags.tresh) { PSERV_ONLY = true }
        }

        let prnt_S = ''
        let prnt_H = ''

        if (FLUFFY >= 69420) { FLUFFY = 0 };

        await refresh(ns)
        if (flags.server) { prnt_S = await Server(ns) }
        if (flags.hacknet) { prnt_H = await Hacknet(ns) }

        let temp = CURRENT

        if (PSERV_ONLY) { CURRENT = CURRENT.filter(function (a) { return ns.getPurchasedServers().includes(a.name) }) };

        THREADS = 0
        for (let i = 0; i < CURRENT.length; i++) {
            THREADS += CURRENT[i].left
        }

        if (prnt_S === undefined) { prnt_S = '' };
        if (prnt_H === undefined) { prnt_H = '' };

        let HACKPERCENT = 0.9875
        while (HACKPERCENT > 0) {

            temp = temp.filter(function (a) { return ((ns.getHackingLevel() - ns.getServerRequiredHackingLevel(a.name)) >= 0) && (!ns.getPurchasedServers().includes(a.name)) && a.name != 'home' });
            temp = temp.sort(function (a, b) { return b.value - a.value; });
            TARGET = ''

            for (let i = 0; i < temp.length; i++) {
                let GROWMULTIPLIER = Math.max((1 / (1 - HACKPERCENT)), ns.getServerMaxMoney(temp[i].name) / (ns.getServerMoneyAvailable(temp[i].name) + 1))

                NEEDED_HCK = Math.floor(ns.hackAnalyzeThreads(temp[i].name, ns.getServerMoneyAvailable(temp[i].name) * HACKPERCENT))
                NEEDED_GRW = Math.ceil(ns.growthAnalyze(temp[i].name, GROWMULTIPLIER))
                NEEDED_WKN_HCK = Math.ceil(NEEDED_HCK / 25)
                NEEDED_WKN_GRW = Math.ceil(NEEDED_GRW / 12.5)
                NEEDED_WKN_SEC = Math.ceil((ns.getServerSecurityLevel(temp[i].name) - ns.getServerMinSecurityLevel(temp[i].name)) / 0.05)
                NEEDED_ALL = (NEEDED_HCK + NEEDED_GRW + NEEDED_WKN_HCK + NEEDED_WKN_GRW + NEEDED_WKN_SEC + temp.length + ns.getPurchasedServers().length) - 1//offset
                if (THREADS >= NEEDED_ALL && NEEDED_GRW > 0 && NEEDED_HCK > 0) {
                    TARGET = temp[i].name
                    break
                }
            }
            if (TARGET != '') { break };
            HACKPERCENT -= 0.0125
        }

        const printout = {
            name: TARGET,
            wkn: NEEDED_WKN_GRW + NEEDED_WKN_HCK + NEEDED_WKN_SEC,
            hck: NEEDED_HCK,
            grw: NEEDED_GRW,
            all: NEEDED_WKN_GRW + NEEDED_WKN_HCK + NEEDED_WKN_SEC + NEEDED_HCK + NEEDED_WKN_GRW
        }

        if (TARGET != '') {
            await batch(ns)
            if (!batch_failed) {
                batchcount++
                ns.print('\nTarget:     ' + printout.name + '\nALL:        ' + printout.all + ' \nWeaken:     ' + printout.wkn + ' \nHack:       ' + printout.hck + ' \nGrow:       ' + printout.grw + ' \nMoney:      ' + Math.floor(ns.getServerMoneyAvailable(printout.name)) + '$\nTTF:        ' + Math.ceil(ns.getWeakenTime(printout.name) / 1000) + 's\nOWNED ONLY: ' + PSERV_ONLY + '\n' + prnt_S + prnt_H)
            }
            if (batch_failed) { ns.print('\nERROR: BATCH FAILED\n') }
        }
    }

    /**@param ns{NS} */
    async function batch(ns) {

        const temp_sec = ns.getWeakenTime(TARGET)
        let current_batch = []
        batch_failed = false

        CURRENT = CURRENT.sort(function (a, b) { return a.left - b.left; });
        for (let i = 0; NEEDED_WKN_SEC > 0 && i < CURRENT.length; i++) {
            if (CURRENT.length <= i) { ns.tprint('ERROR: SEC0 ' + TARGET); return }
            let minimum = Math.min(CURRENT[i].left, NEEDED_WKN_SEC)
            if (minimum > 0) {
                if (temp_sec != ns.getWeakenTime(TARGET)) { batch_failed = true }
                current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_SEC0'))
                NEEDED_WKN_SEC -= minimum
                CURRENT[i].left -= minimum
            }
        }

        await ns.sleep(50) //catch-up time

        while (NEEDED_GRW > 0) {
            let n_grw = 0
            let current_batch = []

            CURRENT = CURRENT.sort(function (a, b) { return b.left - a.left; });
            for (let i = 0; NEEDED_GRW > 0; i++) {
                if (CURRENT.length <= i) { ns.tprint('ERROR: GRW ' + TARGET); return }
                let minimum = Math.min(CURRENT[i].left, NEEDED_GRW)
                if (minimum > 0) {
                    if (temp_sec != ns.getWeakenTime(TARGET)) { batch_failed = true }
                    current_batch.push(ns.exec(SCRIPTS.GRW, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'GRW'))
                    n_grw = Math.ceil(minimum / 12.50)
                    NEEDED_GRW -= minimum
                    CURRENT[i].left -= minimum
                    break
                }
            }
            await ns.sleep(50)
            CURRENT = CURRENT.sort(function (a, b) { return a.left - b.left; });
            for (let i = 0; i < CURRENT.length; i++) {
                if (CURRENT.length <= i) { ns.tprint('ERROR : WKN_GRW ' + TARGET); return }
                let minimum = Math.min(n_grw, CURRENT[i].left)
                if (minimum > 0) {
                    if (temp_sec != ns.getWeakenTime(TARGET)) { batch_failed = true }
                    current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_GRW'))
                    CURRENT[i].left -= minimum
                    n_grw -= minimum
                }
            }
            await ns.sleep(50)
        }

        while (NEEDED_HCK > 0) {
            let n_hck = 0

            CURRENT = CURRENT.sort(function (a, b) { return a.left - b.left; });
            for (let i = 0; NEEDED_HCK > 0; i++) {
                if (CURRENT.length <= i) { ns.tprint('ERROR: HCK ' + TARGET); return }
                let minimum = Math.min(CURRENT[i].left, NEEDED_HCK)
                if (minimum > 0) {
                    if (temp_sec != ns.getWeakenTime(TARGET)) { batch_failed = true }
                    current_batch.push(ns.exec(SCRIPTS.HCK, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'HCK'))
                    n_hck = Math.ceil(minimum / 25.00)
                    NEEDED_HCK -= minimum
                    CURRENT[i].left -= minimum
                    break
                }
            }
            await ns.sleep(50)
            for (let i = 0; i < CURRENT.length; i++) {
                if (CURRENT.length <= i) { ns.tprint('ERROR: WKN ' + TARGET); return }
                let minimum = Math.min(n_hck, CURRENT[i].left)
                if (minimum > 0) {
                    if (temp_sec != ns.getWeakenTime(TARGET)) { batch_failed = true }
                    current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_HCK'))
                    CURRENT[i].left -= minimum
                    n_hck -= minimum
                }
            }
            await ns.sleep(50)
        }
        if (temp_sec != ns.getWeakenTime(TARGET)) { batch_failed = true }

        if (batch_failed || current_batch.includes(0)) {
            current_batch = current_batch.filter(function (a) { return a !== 0 })
            for (let i = 0; i < current_batch.length; i++) {
                if (!ns.kill(current_batch[i])) { ns.print('\nERROR: "ns.kill()" failed'); ns.exit() };
                batch_failed = true
            }
        }

    }

    /**@param ns{NS} */
    async function startup(ns) {

        ALL = []

        let stage1 = ['home']
        for (let i = 0; i < stage1.length; i++) {
            let thisScan = ns.scan(stage1[i])
            for (let j = 0; j < thisScan.length; j++) {
                if (!stage1.includes(thisScan[j])) {
                    stage1.push(thisScan[j])
                }
                await ns.sleep(0)
            }
            await ns.sleep(0)
        }

        stage1 = stage1.filter(function (a) { return a != 'home' })

        for (let i = 0; i < stage1.length; i++) {
            if (stage1[i] != 'home') {
                await ns.scp([SCRIPTS.GRW, SCRIPTS.HCK, SCRIPTS.WKN], 'home', stage1[i])
            }
        }

        for (let i = 0; i < stage1.length; i++) {
            ALL.push({
                name: stage1[i],
                left: 0,
                value: 0,
                security: 0
            });
            await ns.sleep(0)
        }
    }

    /**@param ns{NS} */
    async function refresh(ns) {
        CURRENT = ALL
        let PORTS = {
            can_ssh: ns.fileExists('BruteSSH.exe'),
            can_ftp: ns.fileExists('FTPCrack.exe'),
            can_smtp: ns.fileExists('RelaySMTP.exe'),
            can_http: ns.fileExists('HTTPWorm.exe'),
            can_sql: ns.fileExists('SQLInject.exe'),
            possible: 0
        };
        PORTS.possible = PORTS.can_ssh + PORTS.can_ftp + PORTS.can_smtp + PORTS.can_http + PORTS.can_sql

        for (let i = 0; i < CURRENT.length; i++) {
            if (!ns.hasRootAccess(CURRENT[i].name) && ns.getServerNumPortsRequired(CURRENT[i].name) <= PORTS.possible) {
                if (PORTS.can_ssh) { ns.brutessh(CURRENT[i].name) };
                if (PORTS.can_ftp) { ns.ftpcrack(CURRENT[i].name) };
                if (PORTS.can_smtp) { ns.relaysmtp(CURRENT[i].name) };
                if (PORTS.can_http) { ns.httpworm(CURRENT[i].name) };
                if (PORTS.can_sql) { ns.sqlinject(CURRENT[i].name) };
                ns.nuke(CURRENT[i].name)
            }
            CURRENT[i].left = Math.floor((ns.getServerMaxRam(CURRENT[i].name) - ns.getServerUsedRam(CURRENT[i].name)) / SCRIPTS.CST)
            CURRENT[i].security = ns.getServerSecurityLevel(CURRENT[i].name) - ns.getServerMinSecurityLevel(CURRENT[i].name)

            CURRENT[i].value = 1
            CURRENT[i].value *= ns.getServerMaxMoney(CURRENT[i].name) * ns.hackAnalyze(CURRENT[i].name, 0.95) * CURRENT[i].security
            CURRENT[i].value /= ns.getWeakenTime(CURRENT[i].name)
        }

        CURRENT = CURRENT.filter(function (a) { return (ns.hasRootAccess(a.name)) });

    }

    /**@param ns{NS} */
    async function Server(ns) {

        let prnt = ''
        let servers = []
        for (let i = 0; i < 25; i++) {
            servers.push({
                name: '',
                ram: 0
            });
            servers[i].name = 'S' + ('' + (i + 1)).padStart(2, '0')
            if (ns.serverExists(servers[i].name)) { servers[i].ram = ns.getServerMaxRam(servers[i].name) };
        }

        servers = servers.sort(function (a, b) { return a.ram - b.ram })

        let maxram = 2 ** 20
        for (let i = 20; ns.getPurchasedServerCost(maxram) > ns.getPlayer().money && i > 1; i--) {
            maxram = 2 ** i
        }

        if (maxram == 0 || servers[0].ram == 2 ** 20 || ns.getPurchasedServerCost(maxram) > ns.getPlayer().money) { return prnt }

        if (maxram > servers[0].ram) {

            //if server already exists, kill all scripts and delete it
            if (ns.serverExists(servers[0].name)) {

                CURRENT = CURRENT.filter(function (a) { return a.name != servers[0].name });
                prnt = 'RESERVING:  ' + servers[0].name + '\n'

                if (ns.getServerUsedRam(servers[0].name) == 0) {

                    ns.deleteServer(servers[0].name);
                    await ns.sleep(100)
                    ns.purchaseServer(servers[0].name, maxram);
                    await ns.scp([SCRIPTS.GRW, SCRIPTS.HCK, SCRIPTS.WKN], 'home', servers[0].name)
                    prnt = 'UPGRADED:   ' + servers[0].name + '\n'
                }
            }
            else {

                ns.purchaseServer(servers[0].name, maxram);
                await ns.sleep(100)
                await ns.scp([SCRIPTS.GRW, SCRIPTS.HCK, SCRIPTS.WKN], 'home', servers[0].name)
                prnt = 'BOUGHT ' + servers[0].name + '\n'
                await startup(ns)
                await refresh(ns)

            }
            return prnt
        }
        return prnt
    }

    /**@param ns{NS} */
    async function Hacknet(ns) {

        let nothing_to_do = false
        let prnt = ''

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

            let money = ns.getPlayer().money

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
            };

            if ((money >= Math.min(cost_lvl, cost_ram, cost_cpu, cost_new) && ns.hacknet.numNodes() <= 23)) {
                prnt = 'UPGRADING HACKNET\n'
            };

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
        return prnt
    }
}
