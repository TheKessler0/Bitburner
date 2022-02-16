/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
export async function main(ns) {
    const hashes = {};
    const files = ns.ls('home', '.js');
    for (const file of files) {
        const contents = ns.read(file);
        hashes[file] = getHash(contents);
    }
    while (true) {
        const files = ns.ls('home', '.js');
        for (const file of files) {
            const contents = ns.read(file);
            const hash = getHash(contents);
            if (hash != hashes[file]) {
                ns.tprintf(`INFO: Detected change in ${file}`);
                const processes = ns.ps().filter((p) => {
                    return p.filename == file;
                });
                for (const process of processes) {
                    ns.tprintf(`INFO: Restarting ${process.filename} ${process.args} -t ${process.threads}`);
                    if (process.filename != ns.getScriptName()) {
                        ns.kill(process.pid);
                        ns.run(process.filename, process.threads, ...process.args);
                    }
                    else {
                        ns.spawn(process.filename, process.threads, ...process.args);
                    }
                }
                hashes[file] = hash;
            }
        }
        await ns.sleep(1000);
    }
}
const getHash = (input) => {
    let hash = 0, i, chr;
    if (input.length === 0)
        return hash;
    for (i = 0; i < input.length; i++) {
        chr = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbIndhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBTTtJQUM3QixNQUFNLE1BQU0sR0FBMEIsRUFBRSxDQUFBO0lBRXhDLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3RCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUNuQztJQUVELE9BQU8sSUFBSSxFQUFFO1FBQ1QsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFFbEMsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDdEIsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUM5QixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7WUFFOUIsSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN0QixFQUFFLENBQUMsT0FBTyxDQUFDLDRCQUE0QixJQUFJLEVBQUUsQ0FBQyxDQUFBO2dCQUU5QyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBYyxFQUFFLEVBQUU7b0JBQ2hELE9BQU8sQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUE7Z0JBQzdCLENBQUMsQ0FBQyxDQUFBO2dCQUVGLEtBQUssTUFBTSxPQUFPLElBQUksU0FBUyxFQUFFO29CQUM3QixFQUFFLENBQUMsT0FBTyxDQUFDLG9CQUFvQixPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxJQUFJLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7b0JBQ3hGLElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsYUFBYSxFQUFFLEVBQUU7d0JBQ3hDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO3dCQUNwQixFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtxQkFDN0Q7eUJBQU07d0JBQ0gsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7cUJBQy9EO2lCQUNKO2dCQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUE7YUFDdEI7U0FDSjtRQUVELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN2QjtBQUNMLENBQUM7QUFFRCxNQUFNLE9BQU8sR0FBRyxDQUFDLEtBQWEsRUFBVSxFQUFFO0lBQ3RDLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFBO0lBQ3BCLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUE7SUFDbkMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQy9CLEdBQUcsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3pCLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUNqQyxJQUFJLElBQUksQ0FBQyxDQUFBLENBQUMsMkJBQTJCO0tBQ3hDO0lBQ0QsT0FBTyxJQUFJLENBQUE7QUFDZixDQUFDLENBQUEifQ==
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbImxpYi93YXRjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdHQUFnRztBQUVoRyxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBQ3pCLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNsQixNQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNuQyxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtRQUN0QixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEM7SUFDRCxPQUFPLElBQUksRUFBRTtRQUNULE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3RCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0IsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQy9CLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdEIsRUFBRSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsSUFBSSxFQUFFLENBQUMsQ0FBQztnQkFDL0MsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNuQyxPQUFPLENBQUMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDO2dCQUM5QixDQUFDLENBQUMsQ0FBQztnQkFDSCxLQUFLLE1BQU0sT0FBTyxJQUFJLFNBQVMsRUFBRTtvQkFDN0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO29CQUN6RixJQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLGFBQWEsRUFBRSxFQUFFO3dCQUN4QyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDckIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQzlEO3lCQUNJO3dCQUNELEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNoRTtpQkFDSjtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQ3ZCO1NBQ0o7UUFDRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEI7QUFDTCxDQUFDO0FBQ0QsTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRTtJQUN0QixJQUFJLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQztJQUNyQixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUNsQixPQUFPLElBQUksQ0FBQztJQUNoQixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0IsR0FBRyxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQywyQkFBMkI7S0FDekM7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUM7QUFDRixraEZBQWtoRiJ9