// https://pegasus.pimpninjas.org/code/javascript/bitburner/second-terminal.js
// for BitBurner - https://danielyxie.github.io/bitburner/
// by "The Almighty Pegasus Epsilon" <pegasus@pimpninjas.org>
// version 2.1 (C)opyright March 13 2022
// Distribute Unmodified - https://pegasus.pimpninjas.org/license
/** @param {NS} ns **/
export async function main (ns) {
	await terminal(ns, "/programs/tools/terminal.js", e => ns.print(e.target.value));
}
export async function terminal (ns, scriptName, handler) {
	ns.disableLog("ALL");
	const style = globalThis.getComputedStyle(document
		.querySelector(".MuiDrawer-paper")
		.querySelector("p"));
	let input = document.createElement("input");
	input.style.boxSizing = "border-box";
	input.style.position = "relative";
	input.style["width"] = "100%";
	input.style.outline = "none";
	input.style.padding = "2px";
	input.style.fontFamily = style.fontFamily;
	input.style.fontSize = style.fontSize;
	input.style.color = style.color;
	input.style.background = style.backgroundColor;
	input.style.borderTop = "1px solid " + style.color;
	input.addEventListener("keydown", e => {
		e.cancelBubble = true;
		if ("Enter" != e.code) return true;
		handler(e);
		e.target.value = "";
	});
	ns.clearLog();
	ns.tail();
	function addInputBox () {
		let log = document.querySelector("h6[title=\""
			+ scriptName + " " + ns.args.join(" ") + "\"]");
		if (!log) return;
		log = log.parentNode.parentNode.nextSibling;
		if (log.querySelector("input")) return;
		try { log.appendChild(input); }
		catch (e) { console.log(e); }
	}
	for (;;) {
		addInputBox();
		await ns.asleep(1000);
	}
}
