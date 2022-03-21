import { NS } from '@ns';
export async function main(ns: NS) : Promise<void> {
	// helpers
	const getMoney = () => ns.getPlayer().money;
	const getProd = (level: number, ram: number, cores: number) => (level * 1.5) * Math.pow(1.035, ram - 1) * ((cores + 5) / 6);
	// your production multiplier
	const PROD_MULTIPLIER = ns.getHacknetMultipliers().production;
	// maximum waiting time for collecting money for new node (default 30s)
	const WAITING_TIME = <number>ns.args[0] || 30;

	const MAX_NODES = 23;

	// check if you have any nodes in your hacknet
	if (!ns.hacknet.numNodes()) {
		while (getMoney() < ns.hacknet.getPurchaseNodeCost()) {
			await ns.sleep(1000);
		}
		ns.hacknet.purchaseNode();
		// ns.tprint("Bought first node");
	}

	while (true) {
		const ratios = [];
		let hacknetProduction = 0;
		// loop through all nodes
		for (let index = 0; index < ns.hacknet.numNodes(); index++) {
			// get current node stats
			const { level, ram, cores, production } = ns.hacknet.getNodeStats(index);
			hacknetProduction += production;
			// get upgrades cost
			const levelUpgradeCost = ns.hacknet.getLevelUpgradeCost(index, 1);
			const ramUpgradeCost = ns.hacknet.getRamUpgradeCost(index, 1);
			const coreUpgradeCost = ns.hacknet.getCoreUpgradeCost(index, 1);
			// get prod. growth / cost ratios
			const levelUpgradeRatio = ((getProd(level + 1, ram, cores) * PROD_MULTIPLIER) - production) / levelUpgradeCost;
			const ramUpgradeRatio = ((getProd(level, ram * 2, cores) * PROD_MULTIPLIER) - production) / ramUpgradeCost;
			const coreUpgradeRatio = ((getProd(level, ram, cores + 1) * PROD_MULTIPLIER) - production) / coreUpgradeCost;
			// possible upgrades of current node
			const currentNodeUpgrades = [
				{ ratio: levelUpgradeRatio, cost: levelUpgradeCost, nodeIndex: index, upgrade: "level" },
				{ ratio: ramUpgradeRatio, cost: ramUpgradeCost, nodeIndex: index, upgrade: "ram" },
				{ ratio: coreUpgradeRatio, cost: coreUpgradeCost, nodeIndex: index, upgrade: "core" }
			];
			// push current node upgrades to all upgrades
			ratios.push(...currentNodeUpgrades);
		}
		// get the most profitable upgrade
		const { cost, nodeIndex, upgrade } = ratios.sort((a, b) => b.ratio - a.ratio)[0];
		if (cost !== Infinity && cost) {
			// wait until you have the money for upgrade
			while (getMoney() < cost) {
				await ns.sleep(100);
			}
			// execute upgrade
			switch (upgrade) {
				case "level":
					await ns.hacknet.upgradeLevel(nodeIndex, 1);
					// ns.tprint("Upgraded Level on node " + nodeIndex);
					break;
				case "ram":
					await ns.hacknet.upgradeRam(nodeIndex, 1);
					// ns.tprint("Upgraded RAM on node " + nodeIndex);
					break;
				case "core":
					await ns.hacknet.upgradeCore(nodeIndex, 1);
					// ns.tprint("Upgraded Core on node " + nodeIndex);
					break;
				default:
					continue;
			}
		}
		// check if you can purchase new node
		if (ns.hacknet.numNodes() <= MAX_NODES) {
			const purchaseNodeCost = ns.hacknet.getPurchaseNodeCost();
			const missingMoneyForNewNode = purchaseNodeCost - getMoney();
			if (missingMoneyForNewNode < 0) {
				ns.hacknet.purchaseNode();
				// ns.tprint("Buying new node");
			}
			// else check if you can buy new node in less than WAITING_TIME (default 30s)
			else if (missingMoneyForNewNode < hacknetProduction * WAITING_TIME) {
				while (getMoney() < purchaseNodeCost) {
					await ns.sleep(1);
				}
				ns.hacknet.purchaseNode();
				// ns.tprint("Buying new node");
			}
		}



		// sleep 1ms to prevent crash because of infinite loop
		await ns.sleep(1);
	}
}