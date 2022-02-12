/** @param {NS} ns **/
export async function main(ns) {
await ns.sleep(0)
await ns.weaken(ns.args[0])
}
