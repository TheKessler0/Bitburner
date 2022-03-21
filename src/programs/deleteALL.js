/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
export async function main(ns) {

    let scripts = ns.ls('home')

    scripts = scripts.filter(function (a) { return a != '/programs/deleteALL' })

    for (let i = 0; i < scripts.length; i++) {
        ns.kill(scripts[i],'home')
        ns.rm(scripts[i],'home')
    }
    ns.tprint('INFO: delete this script manualy!')
}