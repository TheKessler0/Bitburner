/** @param {NS} ns **/
export async function main(ns) {

	ns.tail();
	ns.disableLog('ALL');
	ns.enableLog('print');
	ns.clearLog();

	while (true) {
		await AutoHacker(ns)
		await ns.sleep(0);
	}
}

/**
* Automaticly hacks, weakens and grows servers
* [fully autonomous]
* @param {NS} ns 
*/
async function AutoHacker(ns) {

	let possible_ports = 0;
	let SSH = false;
	let FTP = false;
	let SQL = false;
	let SMTP = false;
	let HTTP = false;
	let all_servers = ['home'];
	let optimal_target = 'joesguns';
	let rooted_servers = [];
	let not_rooted = [];
	let filelist = ['1weaken.js', '1hack.js', '1grow.js']; //weaken,- hack,- grow-script [ORDER IS IMPORTANT]
	let file_num = 0;
	let to_print = '\n────────────────Hacker────────────────\n';

	//get number of possible open ports
	if (ns.fileExists("BruteSSH.exe", "home")) {
		possible_ports++;
		SSH = true;
	}
	if (ns.fileExists("FTPCrack.exe", "home")) {
		possible_ports++;
		FTP = true;
	}
	if (ns.fileExists("RelaySMTP.exe", "home")) {
		possible_ports++;
		SMTP = true;
	}
	if (ns.fileExists("HTTPWorm.exe", "home")) {
		possible_ports++;
		HTTP = true;
	}
	if (ns.fileExists("SQLInject.exe", "home")) {
		possible_ports++;
		SQL = true;
	}

	//Missing executables?
	if (!SSH) {
		to_print += 'MISSING "BruteSSH.exe"\n';
	}
	if (!FTP) {
		to_print += 'MISSING "FTPCrack.exe"\n';
	}
	if (!SQL) {
		to_print += 'MISSING "SQLInject.exe"\n';
	}
	if (!SMTP) {
		to_print += 'MISSING "RelaySMTP.exe"\n';
	}
	if (!HTTP) {
		to_print += 'MISSING "HTTPWorm.exe"\n';
	}

	//get all servers
	for (let i = 0; i < all_servers.length; i++) {
		let thisScan = ns.scan(all_servers[i]);
		for (let j = 0; j < thisScan.length; j++) {
			if (all_servers.indexOf(thisScan[j]) === -1) {
				all_servers.push(thisScan[j]);
			}
			await ns.sleep(0);
		}
		await ns.sleep(0);
	}

	//make sure that "home" isnt included
	if (all_servers.includes('home')) {
		all_servers.splice(all_servers.indexOf('home'), 1);
	}

	//get rootable servers
	for (let i = all_servers.length - 1; i >= 0; i--) {
		if (ns.hasRootAccess(all_servers[i]) === true) {
			rooted_servers.push(all_servers[i]);
		}
		else {
			not_rooted.push(all_servers[i]);
		}
		await ns.sleep(0);
	}

	//root available servers
	for (let i = not_rooted.length - 1; i >= 0; i--) {
		if (ns.getServerNumPortsRequired(not_rooted[i]) <= possible_ports) {

			if (SSH) {
				ns.brutessh(not_rooted[i]);
			}
			if (FTP) {
				ns.ftpcrack(not_rooted[i]);
			}
			if (SQL) {
				ns.sqlinject(not_rooted[i]);
			}
			if (SMTP) {
				ns.relaysmtp(not_rooted[i]);
			}
			if (HTTP) {
				ns.httpworm(not_rooted[i]);
			}
			ns.nuke(not_rooted[i]);
			rooted_servers.push(not_rooted[i]);
			to_print += '\nNEW SERVER: ' + not_rooted[i];
		}
		await ns.sleep(0);
	}

	//kill old and run new scripts
	for (let i = rooted_servers.length - 1; i >= 0; i--) {
		await ns.sleep(0)
		let threads = ((ns.getServerMaxRam(rooted_servers[i]) - ns.getServerUsedRam(rooted_servers[i])) / ns.getScriptRam(filelist[file_num], rooted_servers[i]));
		if (threads > 0) {
			ns.exec(filelist[0], rooted_servers[i], threads, optimal_target);
		}
		await ns.sleep(0);
	}

	let sleeptime = 0


	await ns.sleep(0);
	return [to_print, sleeptime];
}