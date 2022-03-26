import { NS } from '@ns';

export async function main(ns : NS) : Promise<void> {

    ns.disableLog('ALL')
    ns.clearLog()
    ns.tail()

    let raw_data = ns.ls(ns.getHostname())
    raw_data = raw_data.sort()

    let post = ''

    for (const raw of raw_data) {
        const type = '.' + raw.replace(/^.*?\./gm,'')
        const validTypes = ['.js','.txt']
        if (validTypes.includes(type)) {
            post += raw + '\n'
        }
    }

    ns.print(post)

}