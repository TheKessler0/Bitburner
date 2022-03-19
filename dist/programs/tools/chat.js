// https://pegasus.pimpninjas.org/code/javascript/bitburner/chat.js
// for BitBurner - https://danielyxie.github.io/bitburner/
// by "The Almighty Pegasus Epsilon" <pegasus@pimpninjas.org>
// version 2.1 (C)opyright March 14 2020
// Distribute Unmodified - https://pegasus.pimpninjas.org/license
/** @param {NS} ns **/
import { terminal } from "/programs/tools/terminal.js";
export async function main (ns) {
	const wss = new WebSocket('wss://bitburn.ampeer.tk');
	const keepalive = setInterval(() =>
		wss.send(JSON.stringify({ keepAlive: true })), 1000);
	let usernumber;
	ns.atExit(() => {
		clearInterval(keepalive);
		// politely announce our own exit
		wss.send(JSON.stringify({ message: "User ns.katze() has disconnected" }));
		wss.close();
	});
	function sendMessage (m) {
		wss.send(JSON.stringify({ message: m, username: "ns.katze()" }));
	}
	wss.addEventListener('message', (e) => {
		let data = JSON.parse(e.data);
		if (data.keepAlive) return;
		if (undefined === usernumber && "system" == data.username)
			usernumber = data.message.split("(")[1].split(")")[0];
            //usernumber = "ns.katze()"
		(m => (ns.toast(m), ns.print(m)))
			("<" + data.username + "> " + data.message);
	});
	await terminal(ns, "chat.js", e => sendMessage(e.target.value));
}
