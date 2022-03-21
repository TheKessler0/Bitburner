import { NS } from '@ns'
export async function main(ns:NS) : Promise<void> {

    let scripts = ns.ls('home')

    scripts = scripts.filter(function (a) { return a != ns.getScriptName() })

    for (let script of scripts) {
        ns.kill(script,'home')
        ns.rm(script,'home')
    }
    ns.tprint('INFO: delete this script manualy!')
}