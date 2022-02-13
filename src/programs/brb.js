/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */

export async function main(ns) {

	ns.tail()
	ns.disableLog('ALL')

	const flags = ns.flags([
        ['minutes', 0.1]
    ]);

	let msg = ''
	let msg_cnt = 0

	flags._.forEach( function (a) {
		if (a == '\\n') {
			msg += '\n[MSG_' + ++msg_cnt + ']: '
		}
		else {
			msg += a + ' '
		}
	});

	if (msg != '') {msg = '[MSG_0]: ' + msg + '\n'}

	const divisions = 60
	const delay = (flags.minutes * 60 * 1000) / divisions;

	let loadingbar = []

	for (let i = 0; i < divisions; i++) {

		loadingbar.push('[')
		loadingbar[i] = loadingbar[i].padEnd(i + 1, '|')
		loadingbar[i] = loadingbar[i].padEnd(divisions, '-') + ']'
		loadingbar[i] = 'I´ll be back in aprox ' + (((delay / (1000 * 60)) * (divisions - i)).toFixed(2)).padStart(5,'0') + ' minutes!\n' + msg + loadingbar[i] + '\n'

	}

	for (let i = 0; i < loadingbar.length; i++) {

		ns.clearLog()
		ns.print(loadingbar[i])
		await ns.sleep(delay)

	}

	loadingbar = []

	for (let i = 0; i < divisions; i++) {

		loadingbar.push('[')
		loadingbar[i] = loadingbar[i].padEnd(i, '|') + '.'
		loadingbar[i] = loadingbar[i].padEnd(divisions, '|') + ']'
		loadingbar[i] = 'I´ll be back in just a few secs...\n' + msg + loadingbar[i] + '\n'

	}

	for (let i = 0; i < loadingbar.length; i++) {

		ns.clearLog()
		ns.print(loadingbar[i])
		await ns.sleep(1000)

		if ( i == loadingbar.length - 1) {
			i = 0
		}

	}

}