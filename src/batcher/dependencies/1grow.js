/** @param {NS} ns **/
export async function main(ns) {
    await ns.sleep(ns.getHackTime(ns.args[0]) * 0.8)
    await ns.grow(ns.args[0])
}
