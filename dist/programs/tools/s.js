/** @param {NS} ns **/
export async function main(ns) {
    await window.sendMessage(ns.args.join(' '));
}