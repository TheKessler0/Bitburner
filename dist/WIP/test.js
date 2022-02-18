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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbIldJUC90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQU87SUFFOUIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFDLFlBQVksRUFBQyxZQUFZLENBQUMsQ0FBQSxDQUFDLGdDQUFnQztJQUV2RyxPQUFPLElBQUksRUFBRTtRQUVULElBQUksVUFBVSxHQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFBLENBQUMsMkNBQTJDO1FBQ3hGLElBQUksUUFBUSxHQUFhLEVBQUUsQ0FBQSxDQUFDLGNBQWM7UUFDMUMsS0FBSyxNQUFNLE1BQU0sSUFBSSxVQUFVLEVBQUU7WUFDN0IsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLENBQUMsU0FBUztZQUN0QyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsMkNBQTJDO1lBQ3hILFVBQVUsR0FBRyxDQUFDLEdBQUcsVUFBVSxFQUFDLEdBQUcsUUFBUSxDQUFDLENBQUEsQ0FBQyxrQkFBa0I7U0FDOUQ7UUFFRCxNQUFNLFdBQVcsR0FBRztZQUNoQixHQUFHLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUMsTUFBTSxDQUFDO1lBQ3pDLEdBQUcsRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBQyxNQUFNLENBQUM7WUFDekMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFDLE1BQU0sQ0FBQztZQUMxQyxJQUFJLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFj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