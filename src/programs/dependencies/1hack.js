/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
export async function main(ns) {
    await ns.sleep(ns.getHackTime(ns.args[0]) * 3);
    await ns.hack(ns.args[0]);
}