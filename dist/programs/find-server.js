export async function main(ns) {
    ns.disableLog("ALL");
    let route = [];
    let server = ns.args[0];
    let showPath = ns.args[1] == 'show' ? true : false;
    recursiveScan(ns, '', 'home', server, route);
    if (!showPath) {
        route.shift();
        // let formatted = route.map((server, index) => `connect ${server}${(index < route.length - 1)?';':''}`).join('');
        let colorString = [];
        let routeLength = route.length;
        for (const server of route) {
            let serverIndex = route.indexOf(server);
            colorString.push('connect ', server);
            if (serverIndex < routeLength - 1) {
                colorString.push(';');
            }
        }
        ns.tprint(colorString.join(''));
    }
    else {
        for (const server of route) {
            let serverIndex = route.indexOf(server);
            await ns.sleep(500);
            const extra = serverIndex > 0 ? "└ " : "";
            ns.tprint(`${" ".repeat(serverIndex)}${extra}${route[serverIndex]}`);
        }
    }
    function recursiveScan(ns, parent, server, target, route) {
        const children = ns.scan(server);
        for (let child of children) {
            if (parent == child) {
                continue;
            }
            if (child == target) {
                route.unshift(child);
                route.unshift(server);
                return true;
            }
            if (recursiveScan(ns, server, child, target, route)) {
                route.unshift(server);
                return true;
            }
        }
        return false;
    }
}
export function autocomplete(data, args) {
    return data.servers;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC1zZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3NvdXJjZXMvIiwic291cmNlcyI6WyJwcm9ncmFtcy9maW5kLXNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFNO0lBQy9CLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsSUFBSSxLQUFLLEdBQWEsRUFBRSxDQUFDO0lBQ3pCLElBQUksTUFBTSxHQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBRW5ELGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFN0MsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNiLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNkLGtIQUFrSDtRQUNsSCxJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxXQUFXLEdBQVcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUN2QyxLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssRUFBRTtZQUMxQixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLElBQUksV0FBVyxHQUFHLFdBQVcsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdkI7U0FDRjtRQUVELEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2pDO1NBQU07UUFDTCxLQUFLLE1BQU0sTUFBTSxJQUFJLEtBQUssRUFBRTtZQUMxQixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwQixNQUFNLEtBQUssR0FBRyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUMxQyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN0RTtLQUNGO0lBRUQsU0FBUyxhQUFhLENBQUMsRUFBTSxFQUFFLE1BQWMsRUFBRSxNQUFjLEVBQUUsTUFBYyxFQUFFLEtBQW9CO1FBQ2pHLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakMsS0FBSyxJQUFJLEtBQUssSUFBSSxRQUFRLEVBQUU7WUFDMUIsSUFBSSxNQUFNLElBQUksS0FBSyxFQUFFO2dCQUNuQixTQUFTO2FBQ1Y7WUFDRCxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7Z0JBQ25CLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JCLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFFRCxJQUFJLGFBQWEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ25ELEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7U0FDRjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsWUFBWSxDQUFDLElBQVMsRUFBRSxJQUFTO0lBQy9DLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUN0QixDQUFDIn0=