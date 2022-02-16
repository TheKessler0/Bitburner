/** @param {import("C:/Users/lfrit/Desktop/Bitburner/Bitburner/NetscriptDefinitions").NS } ns */
export async function main(ns) {
    ns.tail();
    const script = '/programs/dependencies/1weaken.js';
    const target = 'joesguns';
    const servers = ns.getPurchasedServers();
    for (let i = 0; i < servers.length; i++) {
        await ns.scp(script, 'home', servers[i]);
    }
    while (true) {
        for (let i = 0; i < servers.length; i++) {
            const threads = (ns.getServerMaxRam(servers[i]) - ns.getServerUsedRam(servers[i])) / ns.getScriptRam(script);
            if (threads > 0) {
                ns.exec(script, servers[i], threads, target);
            }
        }
        await ns.sleep(0);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieHAtZmFybWVyLmpzIiwic291cmNlUm9vdCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zb3VyY2VzLyIsInNvdXJjZXMiOlsicHJvZ3JhbXMveHAtZmFybWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdHQUFnRztBQUNoRyxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBQ3pCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUVULE1BQU0sTUFBTSxHQUFHLG1DQUFtQyxDQUFBO0lBQ2xELE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQTtJQUN6QixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtJQUV4QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNyQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUN6QztJQUVELE9BQU8sSUFBSSxFQUFFO1FBQ1QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDNUcsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO2dCQUNiLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUMsTUFBTSxDQUFDLENBQUE7YUFDNUM7U0FDSjtRQUNELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNwQjtBQUNMLENBQUMifQ==