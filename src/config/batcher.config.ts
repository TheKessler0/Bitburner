export abstract class BatcherConfig {
  //Attacking Scripts (ALL need to take the same time to execute as the Weakenfile)
  static readonly ATTACKS = {
    HCK: '/programs/dependencies/1hack.js',         //Hackingfile
    GRW: '/programs/dependencies/1grow.js',         //Growfile
    WKN: '/programs/dependencies/1weaken.js',       //Weakenfile
  }

  static readonly START_ONCE = [
    '/programs/tools/watcher.js',
    '/programs/tools/servinf.js',
    '/programs/ContractSolver.js',
  ];

  //Integers

  batchtime: number = 50;         //delay between componets of a batch (<50ms)
  batchcountTresh: number = 25;   //number of batches between sleeping
  sleeptime: number = 10000;      //time to sleep
  tresh: number = 500;            //treshhold of threads before only using PSERVs

  //Booleans

  PSERV_ONLY: boolean = false;    //use only PSERVs from the get-go?
  server: boolean = true;         //upgrade PSERVs?
  hacknet: boolean = false;       //upgrade Hacknet?
  
}