import { solveContract } from "/programs/dependencies/solver.js";
/** @param {NS} ns **/
export async function main(ns) {
    await dfs(ns, null, "home", trySolveContracts, 0);
}
/** @param {NS} ns **/
async function dfs(ns, parent, current, f, depth, ...args) {
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
        await dfs(ns, current, host, f, depth + 1, ...args);
    }
}
/** @param {NS} ns **/
async function trySolveContracts(ns, host, depth) {
    var contracts = ns.ls(host, "cct");
    for (var contract of contracts) {
        solveContract(ns, host, contract, 0);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJhY3RTb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3NvdXJjZXMvIiwic291cmNlcyI6WyJwcm9ncmFtcy9Db250cmFjdFNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFHakUsc0JBQXNCO0FBQ3RCLE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQU87SUFDakMsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUVELHNCQUFzQjtBQUN0QixLQUFLLFVBQVUsR0FBRyxDQUFDLEVBQWlDLEVBQUUsTUFBWSxFQUFFLE9BQWUsRUFBRSxDQUEwRyxFQUFFLEtBQWEsRUFBRSxHQUFHLElBQWlCO0lBQ25PLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0IsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO1FBQ25CLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDZixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2QjtLQUNEO0lBRUQsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUVyQyxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLEdBQUcsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFO1FBQzdELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxHQUFDLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQ2xEO0FBQ0YsQ0FBQztBQUVELHNCQUFzQjtBQUN0QixLQUFLLFVBQVUsaUJBQWlCLENBQUMsRUFBNkMsRUFBRSxJQUFTLEVBQUUsS0FBVTtJQUNwRyxJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuQyxLQUFLLElBQUksUUFBUSxJQUFJLFNBQVMsRUFBRTtRQUMvQixhQUFhLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckM7QUFDRixDQUFDIn0=