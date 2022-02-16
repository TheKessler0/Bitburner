import { NS } from '@ns';

export async function main(ns : NS) : Promise<void> {
    const target:string = <string>ns.args[0]
    await ns.sleep(ns.getHackTime(target) * 3);
    await ns.hack(target);
}