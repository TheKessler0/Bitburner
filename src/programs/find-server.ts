import { NS } from '@ns';

export async function main(ns: NS): Promise < void > {
  ns.disableLog("ALL");
  let route: string[] = [];
  let server = <string>ns.args[0];
  let showPath = ns.args[1] == 'show' ? true : false;

  recursiveScan(ns, '', 'home', server, route);

  if (!showPath) {
    route.shift();
    // let formatted = route.map((server, index) => `connect ${server}${(index < route.length - 1)?';':''}`).join('');
    let colorString = [];
    let routeLength: number = route.length;
    for (const server of route) {
      let serverIndex = route.indexOf(server);
      colorString.push('connect ', server);
      if (serverIndex < routeLength - 1) {
        colorString.push(';');
      }
    }
    
    ns.tprint(colorString.join(''));
  } else {
    for (const server of route) {
      let serverIndex = route.indexOf(server);
      await ns.sleep(500);
      const extra = serverIndex > 0 ? "└ " : "";
      ns.tprint(`${" ".repeat(serverIndex)}${extra}${route[serverIndex]}`);
    }
  }

  function recursiveScan(ns: NS, parent: string, server: string, target: string, route: Array<string>) {
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

export function autocomplete(data: any, args: any) {
  return data.servers;
}