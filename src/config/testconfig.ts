import { BatcherConfig as BC } from "config/batcher.config";

export async function main(ns : NS) {
    ns.tprint(BC)
    while (true) {
        let BC_OLD = BC
        await ns.sleep(1000)
        if (BC !== BC_OLD) {
            ns.print(BC_OLD, BC)
        }

    }
}