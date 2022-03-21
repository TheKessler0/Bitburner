export async function main(ns) {
    // helpers
    const getMoney = () => ns.getPlayer().money;
    const getProd = (level, ram, cores) => (level * 1.5) * Math.pow(1.035, ram - 1) * ((cores + 5) / 6);
    // your production multiplier
    const PROD_MULTIPLIER = ns.getHacknetMultipliers().production;
    // maximum waiting time for collecting money for new node (default 30s)
    const WAITING_TIME = ns.args[0] || 30;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1ib3QuanMiLCJzb3VyY2VSb290IjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3NvdXJjZXMvIiwic291cmNlcyI6WyJwcm9ncmFtcy9ub2RlLWJvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFNO0lBQ2hDLFVBQVU7SUFDVixNQUFNLFFBQVEsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQzVDLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBYSxFQUFFLEdBQVcsRUFBRSxLQUFhLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzVILDZCQUE2QjtJQUM3QixNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDOUQsdUVBQXVFO0lBQ3ZFLE1BQU0sWUFBWSxHQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRTlDLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUVyQiw4Q0FBOEM7SUFDOUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUU7UUFDM0IsT0FBTyxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLEVBQUU7WUFDckQsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JCO1FBQ0QsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUMxQixrQ0FBa0M7S0FDbEM7SUFFRCxPQUFPLElBQUksRUFBRTtR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