import { NS } from '@ns';

export async function main(ns : NS) : Promise<void> {

    ns.disableLog('ALL')

    const HSERVnames = /**Hacknet-Server names*/ ['H01','H02','H03','H04','H05','H06','H07','H08','H09','H10','H11','H12','H13','H14','H15','H16','H17','H18','H19','H20']
    const PSERVnames = /**Player-Server names */ ['S01','S02','S03','S04','S05','S06','S07','S08','S09','S10','S11','S12','S13','S14','S15','S16','S17','S18','S19','S20','S21','S22','S23','S24','S25']

    while (true) {

        ns.clearLog()

        let prnt = '\n'

        prnt += getPRNTsimple(HSERVnames)
        prnt += getPRNTsimple(PSERVnames)
        prnt += ('\n').padStart(28,'=')
        prnt += getPRNTcomplex(HSERVnames,PSERVnames)
        prnt += '\n'
        prnt += padding('HOME', formatSize(ns.getServerMaxRam('home')),Math.ceil((ns.getServerUsedRam('home') / ns.getServerMaxRam('home')) * 100) + ' %')

        ns.print(prnt)

        await ns.sleep(1000)
    }

    function getPRNTsimple (names: string[]) {

        let result = ''

        for (let i = 0; i < names.length; i++) {
            result += padding(names[i],getsize(names[i]),getused(names[i]))
        }

        return result

    }

    function padding (name: string, size: string, utilization: string) {
        return (name).padEnd(5,' ') + (size).padStart(12,' ') + (utilization).padStart(10,' ') + '\n'
    }

    function getsize (name: string) {
        if (!ns.serverExists(name)) { return ('---- GB') }

        return formatSize(ns.getServerMaxRam(name))
    }

    function formatSize (rawGB: number) {

        if (rawGB >= 2**30) { return ((rawGB / (2**30)).toFixed(2) + ' EB') }
        if (rawGB >= 2**20) { return ((rawGB / (2**20)).toFixed(2) + ' PB') }
        if (rawGB >= 2**10) { return ((rawGB / (2**10)).toFixed(2) + ' TB') }

        return ((rawGB).toFixed(2) + ' GB')
    }

    function getused (name: string) {

        if (!ns.serverExists(name)) { return ('-- %') }

        return (Math.ceil((ns.getServerUsedRam(name) / ns.getServerMaxRam(name)) * 100) + ' %')
    }

    function getPRNTcomplex (array1: string[], array2: string[]) {
        const names = [...array1, ...array2]
        let size = 0
        let used = 0

        for (let i = 0; i < names.length; i++) {
            if (ns.serverExists(names[i])) {
                size += ns.getServerMaxRam(names[i])
                used += ns.getServerUsedRam(names[i])
            }
        }
        used = Math.ceil((used / size) * 100)
        if (used == Infinity) { used = 0 }

        return padding('ALL',formatSize(size), Math.ceil(used) + ' %')

    }

}