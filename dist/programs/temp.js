export async function main(ns) {
    let incomeOld = [];
    let servers = ['home']; //initialize with first server to scan from
    let thisScan = []; //current scan
    for (const server of servers) {
        thisScan = (ns.scan(server)); //do scan
        thisScan = thisScan.filter(function (a) { return !servers.includes(a); }); //filter servers allready in allServers out
        servers = [...servers, ...thisScan]; //merge allServers
    }
    const scripts = ['/programs/dependencies/1hack.js', '/programs/dependencies/1grow.js', '/programs/dependencies/1weaken.js'];
    let serverIncome = {};
    while (true) {
        await ns.sleep(250);
        for (const script of scripts) {
            for (const server of servers) {
                let processes = ns.ps(server).filter(function (a) { return a.filename === script; });
                for (const process of processes) {
                    const target = process.args[0];
                    if (undefined === serverIncome[target])
                        serverIncome[target] = {};
                    if (undefined === serverIncome[target][script])
                        serverIncome[target][script] = 0;
                    serverIncome[target][script] += ns.getScriptIncome(script, server, ...process.args);
                }
            }
        }
        for (let i = 1; i < 50; i++) {
            if (incomeOld[i] !== undefined) {
                incomeOld[i] = incomeOld[i + 1];
            }
            ns.tprint(i);
        }
        incomeOld[50] = serverIncome;
        ns.exit();
        ns.tprint(serverIncome);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcC5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbInByb2dyYW1zL3RlbXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBTztJQUk5QixJQUFJLFNBQVMsR0FBYyxFQUFFLENBQUM7SUFFOUIsSUFBSSxPQUFPLEdBQXNCLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQywyQ0FBMkM7SUFDakYsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFBLENBQUMsY0FBYztJQUMxQyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtRQUMxQixRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQ0FBQyxTQUFTO1FBQ3RDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywyQ0FBMkM7UUFDckgsT0FBTyxHQUFHLENBQUMsR0FBRyxPQUFPLEVBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQSxDQUFDLGtCQUFrQjtLQUN4RDtJQUVMLE1BQU0sT0FBTyxHQUFHLENBQUMsaUNBQWlDLEVBQUMsaUNBQWlDLEVBQUMsbUNBQW1DLENBQUMsQ0FBQztJQUUxSCxJQUFJLFlBQVksR0FBZ0QsRUFBRSxDQUFDO0lBRW5FLE9BQU0sSUFBSSxFQUFFO1FBRVosTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBRWYsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDMUIsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLEVBQUU7Z0JBQzFCLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLFFBQVEsS0FBSyxNQUFNLENBQUEsQ0FBQSxDQUFDLENBQUMsQ0FBQTtnQkFDbEYsS0FBSyxNQUFNLE9BQU8sSUFBSSxTQUFTLEVBQUU7b0JBQzdCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7b0JBQzlCLElBQUksU0FBUyxLQUFLLFlBQVksQ0FBQyxNQUFNLENBQUM7d0JBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDbEUsSUFBSSxTQUFTLEtBQUssWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQzt3QkFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqRixZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUMsTUFBTSxFQUFDLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2lCQUNwRjthQUNKO1NBQ0o7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3pCLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDNUIsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUE7YUFDaEM7WUFDRCxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ2Y7UUFDRCxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFBO1FBSTVCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUVULEVBQUUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7S0FFMUI7QUFDTCxDQUFDIn0=