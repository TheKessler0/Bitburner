import { NS } from '@ns';

export async function main(ns : NS) : Promise<void> {

    interface configValues {
        HCK: string;
        WKN: string;
        GRW: string;
        StartOnce: string[];
        batchtime: number;
        batchcountTresh: number;
        sleeptime: number;
        tresh: number;
        PSERV_ONLY: boolean;
        server: boolean;
        hacknet: boolean;
    }

    let config = await parseConfig();

    config.StartOnce.forEach( function (a) { ns.exec(a,'home'); });

    let ALL: any[] = [];
    let CURRENT: any[] = [];
    const SCRIPTS = {
        HCK: config.HCK,
        GRW: config.GRW,
        WKN: config.WKN,
        CST: Math.max(ns.getScriptRam(config.HCK),ns.getScriptRam(config.GRW),ns.getScriptRam(config.WKN))
    };

    await testSaveFileIntegrity()

    let TARGET = '';
    let NEEDED_HCK = 0;
    let NEEDED_GRW = 0;
    let NEEDED_WKN_HCK = 0;
    let NEEDED_WKN_GRW = 0;
    let NEEDED_WKN_SEC = 0;
    let NEEDED_ALL = 0;
    let THREADS = 0;
    let FLUFFY = 0;
    let hasFormulas = ns.fileExists("Formulas.exe", 'home');
    let PSERV_ONLY = config.PSERV_ONLY
    let batchcount = 0;
    let batch_failed = false;

    ns.disableLog('ALL');
    ns.clearLog();
    ns.tail();
    ns.print(`\ntresh:   ${config.tresh}\nserver:  ${config.server}\nhacknet: ${config.hacknet}\n`);
    await startup(ns);
    await ns.sleep(5000);
    while (true) {

        config = await parseConfig()

        await ns.sleep(0);


        if (batchcount >= config.batchcountTresh && config.sleeptime > 0) {
            batchcount = 0;
            hasFormulas = ns.fileExists("Formulas.exe", 'home');
            ns.print('\nINFO: sleeping for ' + (config.sleeptime / 1000).toFixed(2) + 's\n');
            await ns.sleep(config.sleeptime);
        }


        let pserv_threads = 0;
        for (let i = 0; i < ns.getPurchasedServers().length && !PSERV_ONLY; i++) {
            pserv_threads += Math.floor((ns.getServerMaxRam(ns.getPurchasedServers()[i])) / SCRIPTS.CST);
            if (pserv_threads >= config.tresh) {
                PSERV_ONLY = true;
            }
        }
        let prnt_S = '';
        let prnt_H = '';
        if (FLUFFY >= 69420) {
            FLUFFY = 0;
        }
        await refresh(ns);
        if (config.server) {
            prnt_S = await Server(ns);
        }
        if (config.hacknet) {
            prnt_H = Hacknet(ns);
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
            if (TARGET != '') { break }

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
                ns.print('\nTarget:     ' + ((printout.name.length > 10 ) ? printout.name.substring(0,10) + '…' : printout.name) + '\nALL:        ' + printout.all + ' \nWeaken:     ' + printout.wkn + ' \nHack:       ' + printout.hck + ' \nGrow:       ' + printout.grw + ' \n$ stolen:   ' + formatMoney(ns.getServerMoneyAvailable(printout.name) * HACKPERCENT) + '\nSEC:        ' + printout.sec + '\nTTF:        ' + Math.ceil(ns.getWeakenTime(printout.name) / 1000) + 's\nOWNED ONLY: ' + PSERV_ONLY + '\n' + prnt_S + prnt_H);
            }
            else {
                //ns.print('\nINFO: BATCH CANCELED\n');
            }
        }
    }

    async function read_config(): Promise<void> {

        const raw_data = ns.read("/programs/dependencies/batcher_config.txt") //TODO: this



    }

    async function batch(ns: NS): Promise<void> {
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
                if (temp_weakentime != ns.getWeakenTime(TARGET)) { batch_failed = true }
                current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_SEC0'));
                NEEDED_WKN_SEC -= minimum;
                CURRENT[i].left -= minimum;
                if (temp_weakentime != ns.getWeakenTime(TARGET)) { batch_failed = true }
            }
        }
        await ns.sleep(config.batchtime); //catch-up time
        while (NEEDED_GRW > 0 && !batch_failed) {
            let n_grw = 0;
            const current_batch = [];

            await ns.sleep(config.batchtime)

            CURRENT = CURRENT.sort(function (a, b) { return b.left - a.left; });
            for (let i = 0; NEEDED_GRW > 0 && !batch_failed; i++) {
                if (CURRENT.length <= i) {
                    ns.tprint('ERROR: GRW ' + TARGET);
                    return;
                }
                const minimum = Math.min(CURRENT[i].left, NEEDED_GRW);
                if (minimum > 0) {
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) { batch_failed = true }
                    current_batch.push(ns.exec(SCRIPTS.GRW, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'GRW'));
                    n_grw = Math.ceil(minimum / 12.50);
                    NEEDED_GRW -= minimum;
                    CURRENT[i].left -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) { batch_failed = true }
                    break;
                }
            }
            await ns.sleep(config.batchtime);
            CURRENT = CURRENT.sort(function (a, b) { return a.left - b.left; });
            for (let i = 0; i < CURRENT.length && !batch_failed; i++) {
                if (CURRENT.length <= i) {
                    ns.tprint('ERROR : WKN_GRW ' + TARGET);
                    return;
                }
                const minimum = Math.min(n_grw, CURRENT[i].left);
                if (minimum > 0) {
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) { batch_failed = true }
                    current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_GRW'));
                    CURRENT[i].left -= minimum;
                    n_grw -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) { batch_failed = true }
                }
            }
            await ns.sleep(config.batchtime);
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
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) { batch_failed = true }
                    current_batch.push(ns.exec(SCRIPTS.HCK, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'HCK'));
                    n_hck = Math.ceil(minimum / 25.00);
                    NEEDED_HCK -= minimum;
                    CURRENT[i].left -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) { batch_failed = true }
                    break;
                }
            }
            await ns.sleep(config.batchtime);
            for (let i = 0; i < CURRENT.length && !batch_failed; i++) {
                if (CURRENT.length <= i) {
                    ns.tprint('ERROR: WKN ' + TARGET);
                    return;
                }
                const minimum = Math.min(n_hck, CURRENT[i].left);
                if (minimum > 0) {
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) { batch_failed = true }
                    current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, FLUFFY++, 'WKN_HCK'));
                    CURRENT[i].left -= minimum;
                    n_hck -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) { batch_failed = true }
                }
            }
            await ns.sleep(config.batchtime);
        }

        if (batch_failed || current_batch.includes(0) || temp_weakentime != ns.getWeakenTime(TARGET)) {
            current_batch = current_batch.filter(function (a) { return a !== 0; });
            await ns.sleep(250)
            for (let i = 0; i < current_batch.length; i++) {
                if (!ns.kill(current_batch[i])) {
                    ns.print('\nERROR: "ns.kill()" failed\n');
                }
            }
            await ns.sleep(Math.min(10000,Math.ceil(ns.getWeakenTime(TARGET) / 2)))
        }
    }
    async function startup(ns: NS): Promise<void> {
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
    async function refresh(ns: NS): Promise<void> {
        CURRENT = ALL;
        const PORTS = {
            can_ssh: ns.fileExists('BruteSSH.exe'),
            can_ftp: ns.fileExists('FTPCrack.exe'),
            can_smtp: ns.fileExists('RelaySMTP.exe'),
            can_http: ns.fileExists('HTTPWorm.exe'),
            can_sql: ns.fileExists('SQLInject.exe'),
            possible: 0
        };
        PORTS.possible = ([PORTS.can_ssh,PORTS.can_ftp,PORTS.can_smtp,PORTS.can_http,PORTS.can_sql].filter(function (a) { return a})).length
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

            if (hasFormulas) {
                const fakeServer = ns.getServer(CURRENT[i].name);
                fakeServer.hackDifficulty = fakeServer.minDifficulty
                fakeServer.moneyAvailable = fakeServer.moneyMax

                CURRENT[i].left = Math.floor((ns.getServerMaxRam(CURRENT[i].name) - ns.getServerUsedRam(CURRENT[i].name)) / SCRIPTS.CST);
                CURRENT[i].security = ns.getServerSecurityLevel(CURRENT[i].name) - ns.getServerMinSecurityLevel(CURRENT[i].name);
                CURRENT[i].value = 1;
                CURRENT[i].value *= ns.getServerMaxMoney(CURRENT[i].name) * ns.hackAnalyze(CURRENT[i].name) * ns.formulas.hacking.hackChance(fakeServer, ns.getPlayer());
                CURRENT[i].value /= ns.formulas.hacking.weakenTime(fakeServer, ns.getPlayer());
            }
            else {
                CURRENT[i].left = Math.floor((ns.getServerMaxRam(CURRENT[i].name) - ns.getServerUsedRam(CURRENT[i].name)) / SCRIPTS.CST);
                CURRENT[i].security = ns.getServerSecurityLevel(CURRENT[i].name) - ns.getServerMinSecurityLevel(CURRENT[i].name);
                CURRENT[i].value = 1;
                CURRENT[i].value *= ns.getServerMaxMoney(CURRENT[i].name) * ns.hackAnalyze(CURRENT[i].name);
                CURRENT[i].value /= ns.getWeakenTime(CURRENT[i].name);
            }

        }
        CURRENT = CURRENT.filter(function (a) { return (ns.hasRootAccess(a.name)); });
    }
    async function Server(ns: NS): Promise<string> {
        let prnt = '';
        let servers: { name: string;ram: number }[] = [];
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
        for (let i = 20; ns.getPurchasedServerCost(maxram) > ns.getPlayer().money && i >= 2; i -= 1) {
            maxram = 2 ** i
        }
        if (maxram == 0 || servers[0].ram == 2 ** 20 || ns.getPurchasedServerCost(maxram) > ns.getPlayer().money) {
            return prnt;
        }
        if (maxram > servers[0].ram) {
            if (ns.serverExists(servers[0].name)) {
                CURRENT = CURRENT.filter(function (a) { return a.name != servers[0].name; });
                prnt = 'RESERVING:  ' + servers[0].name + '\n';
                if (ns.getServerUsedRam(servers[0].name) == 0) {
                    ns.deleteServer(servers[0].name);
                    await ns.sleep(config.batchtime);
                    ns.purchaseServer(servers[0].name, maxram);
                    await ns.scp([SCRIPTS.GRW, SCRIPTS.HCK, SCRIPTS.WKN], 'home', servers[0].name);
                    prnt = 'UPGRADED:   ' + servers[0].name + '\n';
                }
            }
            else {
                ns.purchaseServer(servers[0].name, maxram);
                await ns.sleep(config.batchtime);
                await ns.scp([SCRIPTS.GRW, SCRIPTS.HCK, SCRIPTS.WKN], 'home', servers[0].name);
                prnt = 'BOUGHT ' + servers[0].name + '\n';
                await startup(ns);
                await refresh(ns);
            }
            return prnt;
        }
        return prnt;
    }
    function Hacknet(ns: NS) {
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

    function formatMoney(money: number): string {
        if (money >= 10 ** 15) { return ('$' + (money / 10 ** 15).toFixed(2) + 's') }
        if (money >= 10 ** 12) { return ('$' + (money / 10 ** 12).toFixed(2) + 'q') }
        if (money >= 10 ** 9) { return ('$' + (money / 10 ** 9).toFixed(2) + 't') }
        if (money >= 10 ** 6) { return ('$' + (money / 10 ** 6).toFixed(2) + 'm') }
        if (money >= 10 ** 3) { return ('$' + (money / 10 ** 3).toFixed(2) + 'k') }
        return ('$' + (money / 10 ** 0).toFixed(2) + ' ')
    }

    
    async function parseConfig(): Promise < configValues >{

        let filepath = '/config/batcher.config.txt'

        if (!ns.fileExists(filepath)) {
            
            let standardconfigArray : string[] = [
                '{\n',
                '\n',
                '//* Vital executables for the batcher to work                                                                                   */\n',
                '\n',
                '"HCK":"/programs/dependencies/1hack.js",        //* hack-file                                                                   */\n',
                '"GRW":"/programs/dependencies/1grow.js",        //* grow-file                                                                   */\n',
                '"WKN":"/programs/dependencies/1weaken.js",      //* weaken-file                                                                 */\n',
                '\n',
                '\n',
                '\n',
                '//* other scripts that should be run at startup                                                                                 */\n',
                '\n',
                '"StartOnce":["/programs/tools/watcher.js","/programs/tools/servinf.js","/programs/ContractSolver.js"],\n',
                '\n',
                '\n',
                '\n',
                '//* times and threshholds                                                                                                       */\n',
                '\n',
                '"batchtime":50,                                 //* delay between constituent parts of a batch                                  */\n',
                '"batchcountTresh":25,                           //* number of batches between sleeping (to avoid batch fragmenting)             */\n',
                '"sleeptime":10000,                              //* time to sleep for (to avoid batch fragmenting)                              */\n',
                '"tresh":500,                                    //* threshhold of threads on player-servers before switch to only using those   */\n',
                '\n',
                '\n',
                '\n',
                '//* boolean settings                                                                                                            */\n',
                '\n',
                '"PSERV_ONLY":false,                             //* only use player-servers from the get-go?                                    */\n',
                '"server":true,                                  //* upgrade/buy player-servers?                                                 */\n',
                '"hacknet":false                                 //* upgrade/buy hacknet nodes?                                                  */\n',
                '}\n',
                '\n',
                '\n',
                '\n',
                '\n',
                '//* IF YOU WANT THE STANDARD CONFIG BACK, DELETE THIS FILE! IT WILL BE RE_CREATED AUTOMATICLY! */\n',
                '\n',
                '\n'
            ];
            
            let standardconfig : string = ''
            standardconfigArray.forEach(function (a) {standardconfig += a});
            
            await ns.write(filepath,standardconfig)
            ns.tprint('ERROR: created missing config at:\n' + filepath + '\n\nadjust values if needed, then start this script again!')
            ns.exit()
        }
        let raw = ns.read(filepath)
        return JSON.parse(raw.replace(/( *\/\/\*.*\*\/)| *\n */gm,''))
    }

    async function testSaveFileIntegrity() : Promise<void> {

        let createdScripts = false

        if (!ns.fileExists(config.HCK)) { await createHCK(); createdScripts = true }
        if (!ns.fileExists(config.GRW)) { await createGRW(); createdScripts = true }
        if (!ns.fileExists(config.WKN)) { await createWKN(); createdScripts = true }

        if (createdScripts) {
            ns.tprint('WARN: CHECK NEW FILES LOCATED AT:\n' + config.HCK + '\n' + config.GRW + '\n' + config.WKN + '\n ')
            ns.exit()
        }

        let test = true

        for (let i = 0; i < config.StartOnce.length && test; i++) {
            test = ns.fileExists(config.StartOnce[i])
        }

        if (test) {
            return
        }
        else {
            ns.tprint('ERROR: PLEASE CHECK YOUR CONFIG FILE\nERROR IN "StartOnce" Array')
            ns.exit()
            return
        }

        async function createHCK () : Promise<void> {
            let raw = [
                'export async function main(ns) {\n',
                '    const target = ns.args[0];\n',
                '    await ns.sleep(ns.getHackTime(target) * 3.0);\n',
                '    await ns.hack(target);\n',
                '}'
            ];
            let compiled = ''
            raw.forEach( function (a) {compiled += a})
            await ns.write(config.HCK,compiled,'w')
            ns.tprint('INFO: created ' + config.HCK)
        }

        async function createGRW () : Promise<void> {
            let raw = [
                'export async function main(ns) {\n',
                '    const target = ns.args[0];\n',
                '    await ns.sleep(ns.getHackTime(target) * 0.8);\n',
                '    await ns.grow(target);\n',
                '}'
            ];
            let compiled = ''
            raw.forEach( function (a) {compiled += a})
            await ns.write(config.GRW,compiled,'w')
            ns.tprint('INFO: created ' + config.GRW)
        }

        async function createWKN () : Promise<void> {
            let raw = [
                'export async function main(ns) {\n',
                '    const target = ns.args[0];\n',
                '    await ns.sleep(0);\n',
                '    await ns.weaken(target)\n;',
                '}'
            ];
            let compiled = ''
            raw.forEach( function (a) {compiled += a})
            await ns.write(config.WKN,compiled,'w')
            ns.tprint('INFO: created ' + config.WKN)
        }

    }

}
