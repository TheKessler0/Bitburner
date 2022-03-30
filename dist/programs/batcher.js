export async function main(ns) {
    let config = await parseConfig();
    config.StartOnce.forEach(function (a) { ns.exec(a, 'home'); });
    let ALL = [];
    let CURRENT = [];
    const SCRIPTS = {
        HCK: config.HCK,
        GRW: config.GRW,
        WKN: config.WKN,
        CST: Math.max(ns.getScriptRam(config.HCK), ns.getScriptRam(config.GRW), ns.getScriptRam(config.WKN))
    };
    await testSaveFileIntegrity();
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
    let PSERV_ONLY = config.PSERV_ONLY;
    let batchcount = 0;
    let batch_failed = false;
    ns.disableLog('ALL');
    ns.clearLog();
    ns.tail();
    ns.print(`\ntresh:   ${config.tresh}\nserver:  ${config.server}\nhacknet: ${config.hacknet}\n`);
    await startup(ns);
    await ns.sleep(5000);
    while (true) {
        config = await parseConfig();
        hasFormulas = ns.fileExists("Formulas.exe", 'home');
        await ns.sleep(0);
        if (batchcount >= config.batchcountTresh && config.sleeptime > 0) {
            batchcount = 0;
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
                ns.print('\nTarget:     ' + ((printout.name.length > 10) ? printout.name.substring(0, 10) + '…' : printout.name) + '\nALL:        ' + printout.all + ' \nWeaken:     ' + printout.wkn + ' \nHack:       ' + printout.hck + ' \nGrow:       ' + printout.grw + ' \n$ stolen:   ' + formatMoney(ns.getServerMoneyAvailable(printout.name) * HACKPERCENT) + '\nSEC:        ' + printout.sec + '\nTTF:        ' + Math.ceil(ns.getWeakenTime(printout.name) / 1000) + 's\nOWNED ONLY: ' + PSERV_ONLY + '\n' + prnt_S + prnt_H);
            }
            else {
                //ns.print('\nINFO: BATCH CANCELED\n');
            }
        }
    }
    async function read_config() {
        const raw_data = ns.read("/programs/dependencies/batcher_config.txt"); //TODO: this
    }
    async function batch(ns) {
        const temp_weakentime = ns.getWeakenTime(TARGET);
        const hacktime = ns.getHackTime(TARGET);
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
                current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, Math.floor(hacktime * 0.00), FLUFFY++, 'WKN_SEC0'));
                NEEDED_WKN_SEC -= minimum;
                CURRENT[i].left -= minimum;
                if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                    batch_failed = true;
                }
            }
        }
        await ns.sleep(config.batchtime); //catch-up time
        while (NEEDED_GRW > 0 && !batch_failed) {
            let n_grw = 0;
            const current_batch = [];
            await ns.sleep(config.batchtime);
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
                    current_batch.push(ns.exec(SCRIPTS.GRW, CURRENT[i].name, minimum, TARGET, Math.floor(hacktime * 0.80), FLUFFY++, 'GRW'));
                    n_grw = Math.ceil(minimum / 12.50);
                    NEEDED_GRW -= minimum;
                    CURRENT[i].left -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
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
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                    current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, Math.floor(hacktime * 0.00), FLUFFY++, 'WKN_GRW'));
                    CURRENT[i].left -= minimum;
                    n_grw -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
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
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                    current_batch.push(ns.exec(SCRIPTS.HCK, CURRENT[i].name, minimum, TARGET, Math.floor(hacktime * 3.00), FLUFFY++, 'HCK'));
                    n_hck = Math.ceil(minimum / 25.00);
                    NEEDED_HCK -= minimum;
                    CURRENT[i].left -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
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
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                    current_batch.push(ns.exec(SCRIPTS.WKN, CURRENT[i].name, minimum, TARGET, Math.floor(hacktime * 0.00), FLUFFY++, 'WKN_HCK'));
                    CURRENT[i].left -= minimum;
                    n_hck -= minimum;
                    if (temp_weakentime != ns.getWeakenTime(TARGET)) {
                        batch_failed = true;
                    }
                }
            }
            await ns.sleep(config.batchtime);
        }
        if (batch_failed || current_batch.includes(0) || temp_weakentime != ns.getWeakenTime(TARGET)) {
            current_batch = current_batch.filter(function (a) { return a !== 0; });
            await ns.sleep(250);
            for (let i = 0; i < current_batch.length; i++) {
                if (!ns.kill(current_batch[i])) {
                    ns.print('\nERROR: "ns.kill()" failed\n');
                }
            }
            await ns.sleep(Math.min(10000, Math.ceil(ns.getWeakenTime(TARGET))));
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
            if (hasFormulas) {
                const fakeServer = ns.getServer(CURRENT[i].name);
                fakeServer.hackDifficulty = fakeServer.minDifficulty;
                fakeServer.moneyAvailable = fakeServer.moneyMax;
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
        for (let i = 20; ns.getPurchasedServerCost(maxram) > ns.getPlayer().money && i >= 2; i -= 1) {
            maxram = 2 ** i;
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
    function Hacknet(ns) {
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
    async function parseConfig() {
        let filepath = '/config/batcher.config.txt';
        if (!ns.fileExists(filepath)) {
            let standardconfigArray = [
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
                '//* IF YOU WANT THE STANDARD CONFIG BACK, DELETE THIS FILE! IT WILL BE RE-CREATED AUTOMATICLY! */\n',
                '\n',
                '\n'
            ];
            let standardconfig = '';
            standardconfigArray.forEach(function (a) { standardconfig += a; });
            await ns.write(filepath, standardconfig);
            ns.tprint('ERROR: created missing config at:\n' + filepath + '\n\nadjust values if needed, then start this script again!');
        }
        let raw = ns.read(filepath);
        return JSON.parse(raw.replace(/( *\/\/\*.*?\*\/)| *\n */gm, ''));
    }
    async function testSaveFileIntegrity() {
        let createdScripts = false;
        if (!ns.fileExists(config.HCK)) {
            await createHCK();
            createdScripts = true;
        }
        if (!ns.fileExists(config.GRW)) {
            await createGRW();
            createdScripts = true;
        }
        if (!ns.fileExists(config.WKN)) {
            await createWKN();
            createdScripts = true;
        }
        if (createdScripts) {
            ns.tprint('WARN: CHECK NEW FILES\n');
        }
        let test = true;
        for (let i = 0; i < config.StartOnce.length && test; i++) {
            test = ns.fileExists(config.StartOnce[i]);
        }
        if (test) {
            return;
        }
        else {
            ns.tprint('ERROR: PLEASE CHECK YOUR CONFIG FILE\nERROR IN "StartOnce" Array');
            ns.exit();
            return;
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
            await ns.write(config.HCK, compiled, 'w');
            ns.tprint('INFO: created ' + config.HCK);
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
            await ns.write(config.GRW, compiled, 'w');
            ns.tprint('INFO: created ' + config.GRW);
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
            await ns.write(config.WKN, compiled, 'w');
            ns.tprint('INFO: created ' + config.WKN);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbInByb2dyYW1zL2JhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBTztJQWdCOUIsSUFBSSxNQUFNLEdBQUcsTUFBTSxXQUFXLEVBQUUsQ0FBQztJQUVqQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBRSxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9ELElBQUksR0FBRyxHQUFVLEVBQUUsQ0FBQztJQUNwQixJQUFJLE9BQU8sR0FBVSxFQUFFLENBQUM7SUFDeEIsTUFBTSxPQUFPLEdBQUc7UUFDWixHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7UUFDZixHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7UUFDZixHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUc7UUFDZixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyRyxDQUFDO0lBRUYsTUFBTSxxQkFBcUIsRUFBRSxDQUFBO0lBRTdCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDbkIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztJQUN2QixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7SUFDdkIsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFD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