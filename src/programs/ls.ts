import { NS } from '@ns';

export async function main(ns : NS) : Promise<void> {

    const raw_data = ns.ls(ns.getHostname())

    let post1 = []
    for (let i = 0; i < raw_data.length; i++) {
        post1.push(raw_data[i].split('/'))
    }

    

}