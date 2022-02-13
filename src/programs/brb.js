/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
export async function main(ns) {
	ns.tail()
	ns.disableLog('ALL');
	ns.enableLog('print');
	ns.clearLog();

	let time_between_frames = ((ns.args[0] * 60 * 1000) / 22)
	let picture = '\n\n\n\n\n         a,  8a\n         `8, `8)                            ,adPPRg,\n          8)  ]8                        ,ad888888888b\n         ,8´,8´                    ,gPPR888888888888\n        ,8´, 8´                 ,ad8""   `Y888888888P\n        8)  8)              ,ad8""        (8888888""\n        8,  8,          ,ad8""            d888""\n        `8, `8,     ,ad8""            ,ad8""\n         `8, `" ,ad8""            ,ad8""\n            ,gPPR8b           ,ad8""\n           dP:::::Yb      ,ad8""\n           8):::::(8  ,ad8""\n           Yb:;;;:d888""\n            "8ggg8P"\n        \n        \n';
	let offset = '		       TAKING A BREAK\n\n		  '

	await draw(ns, picture, offset, time_between_frames, ' [                    ]\n\n')
	await ns.sleep(5000)
	await draw(ns, picture, offset, time_between_frames, ' [■                   ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■                  ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■                 ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■                ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■               ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■              ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■             ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■            ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■           ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■■          ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■■■         ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■■■■        ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■■■■■       ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■■■■■■      ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■■■■■■■     ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■■■■■■■■    ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■■■■■■■■■   ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■■■■■■■■■■  ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■■■■■■■■■■■ ]\n\n')
	await draw(ns, picture, offset, time_between_frames, ' [■■■■■■■■■■■■■■■■■■■■]\n\n')

	await draw2(ns, picture, offset, ' [■   ■■■■■■■■■■■■■■■■]\n\n')
	await draw2(ns, picture, offset, ' [■■      ■■■■■■■■■■■■]\n\n')
	await draw2(ns, picture, offset, ' [■■■         ■■■■■■■■]\n\n')
	await draw2(ns, picture, offset, ' [■■■■            ■■■■]\n\n')
	await draw2(ns, picture, offset, ' [■■■■■               ]\n\n')

	while (true) {
		await draw2(ns, picture, offset, ' [■■■■■               ]\n\n')
		await draw2(ns, picture, offset, ' [ ■■■■■              ]\n\n')
		await draw2(ns, picture, offset, ' [  ■■■■■             ]\n\n')
		await draw2(ns, picture, offset, ' [   ■■■■■            ]\n\n')
		await draw2(ns, picture, offset, ' [    ■■■■■           ]\n\n')
		await draw2(ns, picture, offset, ' [     ■■■■■          ]\n\n')
		await draw2(ns, picture, offset, ' [      ■■■■■         ]\n\n')
		await draw2(ns, picture, offset, ' [       ■■■■■        ]\n\n')
		await draw2(ns, picture, offset, ' [        ■■■■■       ]\n\n')
		await draw2(ns, picture, offset, ' [         ■■■■■      ]\n\n')
		await draw2(ns, picture, offset, ' [          ■■■■■     ]\n\n')
		await draw2(ns, picture, offset, ' [           ■■■■■    ]\n\n')
		await draw2(ns, picture, offset, ' [            ■■■■■   ]\n\n')
		await draw2(ns, picture, offset, ' [             ■■■■■  ]\n\n')
		await draw2(ns, picture, offset, ' [              ■■■■■ ]\n\n')
		await draw2(ns, picture, offset, ' [               ■■■■■]\n\n')
		await draw2(ns, picture, offset, ' [■               ■■■■]\n\n')
		await draw2(ns, picture, offset, ' [■■               ■■■]\n\n')
		await draw2(ns, picture, offset, ' [■■■               ■■]\n\n')
		await draw2(ns, picture, offset, ' [■■■■               ■]\n\n')
	}
}

async function draw(ns, picture, offset, time_between_frames, progressbar) {
	await ns.clearLog()
	await ns.print(picture + offset + progressbar)
	await ns.sleep(time_between_frames)
}

async function draw2(ns, picture, offset, progressbar) {
	await ns.clearLog()
	await ns.print(picture + offset + progressbar)
	await ns.sleep(1000)
}