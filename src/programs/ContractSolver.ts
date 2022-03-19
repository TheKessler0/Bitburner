import { NS } from '@ns';
import { solveContract } from "/programs/dependencies/solver.js";


/** @param {NS} ns **/
export async function main(ns: any) {
	await dfs(ns, null, "home", trySolveContracts, 0);
}

/** @param {NS} ns **/
async function dfs(ns: { scan: (arg0: any) => any; }, parent: null, current: string, f: { (ns: any, host: any, depth: any): Promise<void>; (arg0: any, arg1: any, arg2: any, arg3: any): any; }, depth: number, ...args: undefined[]) {
	var hosts = ns.scan(current);
	if (parent != null) {
		const index = hosts.indexOf(parent);
		if (index > -1) {
			hosts.splice(index, 1);
		}
	}

	await f(ns, current, depth, ...args);

	for (let index = 0, len = hosts.length; index < len; ++index) {
		const host = hosts[index];
		await dfs(ns, current, host, f, depth+1, ...args);
	}
}

/** @param {NS} ns **/
async function trySolveContracts(ns: { ls: (arg0: any, arg1: string) => any; }, host: any, depth: any) {
	var contracts = ns.ls(host, "cct");
	for (var contract of contracts) {
		solveContract(ns, host, contract, 0);
	}
}