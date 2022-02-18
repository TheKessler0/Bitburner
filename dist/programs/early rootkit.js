export async function main(ns) {
    const scripts = ['script1.js', 'script2.js', 'script3.js', 'script4.js']; //the files you want to scp over
    while (true) {
        let allServers = ['home']; //initialize with first server to scan from
        let thisScan = []; //current scan
        for (const server of allServers) {
            thisScan = (ns.scan(server)); //do scan
            thisScan = thisScan.filter(function (a) { return !allServers.includes(a); }); //filter servers allready in allServers out
            allServers = [...allServers, ...thisScan]; //merge allServers
        }
        const portOpeners = {
            ssh: ns.fileExists('BruteSSH.exe', 'home'),
            ftp: ns.fileExists('FTPCrack.exe', 'home'),
            sql: ns.fileExists('SQLInject.exe', 'home'),
            http: ns.fileExists('HTTPWorm.exe', 'home'),
            smtp: ns.fileExists('relaySMTP.exe', 'home'),
            Possible: 0 //number of possible ports to open
        };
        if (portOpeners.ssh) {
            portOpeners.Possible += 1;
        } //count possible
        if (portOpeners.ftp) {
            portOpeners.Possible += 1;
        }
        if (portOpeners.sql) {
            portOpeners.Possible += 1;
        }
        if (portOpeners.http) {
            portOpeners.Possible += 1;
        }
        if (portOpeners.smtp) {
            portOpeners.Possible += 1;
        }
        allServers = allServers.filter(function (a) { return ns.getServerNumPortsRequired(a) <= portOpeners.Possible && !ns.hasRootAccess(a); }); //filter by rootable and hasroot
        for (let i = 0; i < allServers.length; i++) {
            if (portOpeners.ssh) {
                ns.brutessh(allServers[i]);
            } //open ports
            if (portOpeners.ftp) {
                ns.ftpcrack(allServers[i]);
            }
            if (portOpeners.sql) {
                ns.sqlinject(allServers[i]);
            }
            if (portOpeners.http) {
                ns.httpworm(allServers[i]);
            }
            if (portOpeners.smtp) {
                ns.relaysmtp(allServers[i]);
            }
            ns.nuke(allServers[i]); //nuke
            if (scripts.length > 0) {
                await ns.scp(scripts, 'home', allServers[i]);
            } //scp stuff over
        }
        await ns.sleep(1000); //i hope you know what this does
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWFybHkgcm9vdGtpdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbInByb2dyYW1zL2Vhcmx5IHJvb3RraXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBTztJQUU5QixNQUFNLE9BQU8sR0FBRyxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUMsWUFBWSxFQUFDLFlBQVksQ0FBQyxDQUFBLENBQUMsZ0NBQWdDO0lBRXZHLE9BQU8sSUFBSSxFQUFFO1FBRVQsSUFBSSxVQUFVLEdBQXNCLENBQUMsTUFBTSxDQUFDLENBQUEsQ0FBQywyQ0FBMkM7UUFDeEYsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFBLENBQUMsY0FBYztRQUMxQyxLQUFLLE1BQU0sTUFBTSxJQUFJLFVBQVUsRUFBRTtZQUM3QixRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQ0FBQyxTQUFTO1lBQ3RDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywyQ0FBMkM7WUFDeEgsVUFBVSxHQUFHLENBQUMsR0FBRyxVQUFVLEVBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQSxDQUFDLGtCQUFrQjtTQUM5RDtRQUVELE1BQU0sV0FBVyxHQUFHO1lBQ2hCLEdBQUcsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBQyxNQUFNLENBQUM7WUFDekMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFDLE1BQU0sQ0FBQztZQUN6QyxHQUFHLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUMsTUFBTSxDQUFDO1lBQzFDLElBQUksRUFBRSxF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