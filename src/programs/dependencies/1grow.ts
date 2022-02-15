export async function main(ns: NS): Promise<void> {
    const target = <string>ns.args[0]
    await ns.sleep(ns.getHackTime(target) * 0.8);
    await ns.grow(target);
}