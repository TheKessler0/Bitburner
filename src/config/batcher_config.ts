import { NS } from '@ns';

export async function main(ns : NS) : Promise<void> {
    ns.tprint("ERROR: \nTHIS IS NOT MEANT TO BE RUN, DUMMY!")
}

export function getUserland() : Promise<any> {

    let USERLAND = {

        //Attacking Scripts (ALL need to take the same time to execute as the Weakenfile)

        HCK: '/programs/dependencies/1hack.js',         //Hackingfile
        GRW: '/programs/dependencies/1grow.js',         //Growfile
        WKN: '/programs/dependencies/1weaken.js',       //Weakenfile

        //Other scripts that should be Started at Startup

        StartOnce: ['/programs/tools/watcher.js','/programs/tools/servinf.js','/programs/ContractSolver.js'],       //Array of other scripts

        //Integers

        batchtime: 50,              //delay between componets of a batch (<50ms)
        batchcountTresh: 25,        //number of batches between sleeping
        sleeptime: 10000,           //time to sleep
        tresh: 500,                 //treshhold of threads before only using PSERVs

        //Booleans

        PSERV_ONLY: false,          //use only PSERVs from the get-go?
        server: true,               //upgrade PSERVs?
        hacknet: false              //upgrade Hacknet?
    };

    return USERLAND

}