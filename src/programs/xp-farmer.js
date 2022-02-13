/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
export async function main(ns) {

	const script = '/programs/dependencies/1weaken.js'
	const target = 'joesguns'
	const servers = ns.getPurchasedServers()

	for (let i = 0; i < servers.length; i++) {
		await ns.scp(script,'home',servers[i])
	}

	while (true) {
		for (let i = 0; i < servers.length; i++) {
			const threads = (ns.getServerMaxRam(servers[i]) - ns.getServerUsedRam(servers[i])) / ns.getScriptRam(script)
			if (threads > 0) {
				ns.exec(script,servers[i],threads,target)
			}
		}
		await ns.sleep(0)
	}
}