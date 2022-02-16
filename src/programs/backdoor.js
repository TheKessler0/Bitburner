/** @param {import("C:/Users/lfrit/Desktop/Bitburner/Bitburner/NetscriptDefinitions").NS } ns */
const targets = ['I.I.I.I','CSEC','avmnite-02h','run4theh111z']
export async function main(ns) {
    ns.disableLog('sleep');
    ns.disableLog('scan');
    const s = ['home'],
        p = [''],
        r = { home: ['home'] };
    for (let i = 0, j; i < s.length; i++) {
        for (j of ns.scan(s[i])) {
            if (!s.includes(j)) s.push(j), p.push(s[i]), r[j] = r[s[i]] + ';' + j;
        }
    }
    let targetObj
    function updateServers() {
        targetObj = targets.map(tm=> { return {name: tm, values:ns.getServer(tm)} })
    }
    updateServers()
    function allBackdoored() {
        return targetObj.every(te=> te.values.backdoorInstalled)
    }
    while (!allBackdoored()) {
        for (const entry of targetObj) {
            if (!entry.values.backdoorInstalled && entry.values.hasAdminRights) {
                r[entry.name].split(';').map(rsm=> ns.connect(rsm));
                await ns.installBackdoor();
                ns.connect('home');
            }
            updateServers();
            await ns.sleep(10);
        }
    }
}
