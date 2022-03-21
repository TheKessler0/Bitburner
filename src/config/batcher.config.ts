export class BatcherConfig {
  //Attacking Scripts (ALL need to take the same time to execute as the Weakenfile)
  
  public ATTACKS = {
    HCK: '/programs/dependencies/1hack.js',         //Hackingfile
    GRW: '/programs/dependencies/1grow.js',         //Growfile
    WKN: '/programs/dependencies/1weaken.js',       //Weakenfile
  }

  public START_ONCE = [
    '/programs/tools/watcher.js',
    '/programs/tools/servinf.js',
    '/programs/ContractSolver.js',
  ];

  //Integers

  public batchtime: number = 50;         //delay between componets of a batch (<50ms)
  public batchcountTresh: number = 25;   //number of batches between sleeping
  public sleeptime: number = 10000;      //time to sleep
  public tresh: number = 500;            //treshhold of threads before only using PSERVs

  //Booleans

  public PSERV_ONLY: boolean = false;    //use only PSERVs from the get-go?
  public server: boolean = true;         //upgrade PSERVs?
  public hacknet: boolean = false;       //upgrade Hacknet?
}