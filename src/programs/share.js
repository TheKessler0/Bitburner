/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
export async function main(ns) {

	ns.disableLog('ALL')
	ns.tail()

	let servers = await startup(ns)

	while (true) {

		await ns.sleep(0)

		for (let i = 0; i < servers.length; i++) {

			let threads = Math.floor((ns.getServerMaxRam(servers[i]) - ns.getServerUsedRam(servers[i])) / ns.getScriptRam('programs/dependencies/1share.js'))

			if (servers[i] == 'home') { Math.max(threads - 16, 0) }

			if (threads > 0) {

				ns.exec('programs/dependencies/1share.js', servers[i], threads)

			}
		}
	}
}

/**@param ns{NS} */
async function startup(ns) {
	let stage1 = ['home']
	for (let i = 0; i < stage1.length; i++) {
		let thisScan = ns.scan(stage1[i])
		for (let j = 0; j < thisScan.length; j++) {
			if (!stage1.includes(thisScan[j])) {
				stage1.push(thisScan[j])
			}
			await ns.sleep(0)
		}
		await ns.sleep(0)
	}

	stage1 = stage1.filter(function (a) { return ns.hasRootAccess(a) });

	for (let i = 0; i < stage1.length; i++) {
		if (stage1[i] != 'home') {
			await ns.scp('programs/dependencies/1share.js', 'home', stage1[i])
		}
	}
	return stage1
}