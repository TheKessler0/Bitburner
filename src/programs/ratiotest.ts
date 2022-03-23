import { NS } from '@ns'

export async function main(ns : NS) : Promise<void> {

    const target = <string> ns.args[0]

    let wkn = ns.getWeakenTime(target)
    let grw = ns.getGrowTime(target)
    let hck = ns.getHackTime(target)

    wkn += (0.00 * hck)
    grw += (0.80 * hck)
    hck += (3.00 * hck)

    


    if (wkn.toFixed(10) === wkn.toFixed(10)) {
        ns.tprint('wkn: ' + wkn.toFixed(10) + ' === ' + 'wkn: ' + wkn.toFixed(10))
    }
    else{
        ns.tprint('wkn: ' + wkn.toFixed(10) + ' !== ' + 'wkn: ' + wkn.toFixed(10))
    };
    
    if (grw.toFixed(10) === wkn.toFixed(10)) {
        ns.tprint('grw: ' + grw.toFixed(10) + ' === ' + 'wkn: ' + wkn.toFixed(10))
    }
    else{
        ns.tprint('grw: ' + grw.toFixed(10) + ' !== ' + 'wkn: ' + wkn.toFixed(10))
    };
    
    if (hck.toFixed(10) === wkn.toFixed(10)) {
        ns.tprint('hck: ' + hck.toFixed(10) + ' === ' + 'wkn: ' + wkn.toFixed(10))
    }
    else{
        ns.tprint('hck: ' + hck.toFixed(10) + ' !== ' + 'wkn: ' + wkn.toFixed(10))
    };

}   