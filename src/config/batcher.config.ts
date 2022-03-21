export class BatcherConfig {
  //Attacking Scripts (ALL need to take the same time to execute as the Weakenfile)
  
  static ATTACKS = {
    HCK: '/programs/dependencies/1hack.js',         //Hackingfile
    GRW: '/programs/dependencies/1grow.js',         //Growfile
    WKN: '/programs/dependencies/1weaken.js',       //Weakenfile
  }

  static START_ONCE = [
    '/programs/tools/watcher.js',
    '/programs/tools/servinf.js',
    '/programs/ContractSolver.js',
  ];

  //Integers

  public static batchtime: number = 50;         //delay between componets of a batch (<50ms)
  public static batchcountTresh: number = 25;   //number of batches between sleeping
  public static sleeptime: number = 10000;      //time to sleep
  public static tresh: number = 500;            //treshhold of threads before only using PSERVs

  public static setBatchtime(batchtime: number): void {
    this.batchtime = batchtime;
  }

  public static setBatchcountTresh(batchcountTresh: number): void {
    this.batchcountTresh = batchcountTresh;
  }

  public static setSleeptime(sleeptime: number): void {
    this.sleeptime = sleeptime;
  }

  public static setTresh(tresh: number): void {
    this.tresh = tresh;
  }

  //Booleans

  public static PSERV_ONLY: boolean = false;    //use only PSERVs from the get-go?
  public static server: boolean = true;         //upgrade PSERVs?
  public static hacknet: boolean = false;       //upgrade Hacknet?

  public static setPSERV_ONLY(pserv_only: boolean): void {
    this.PSERV_ONLY = pserv_only;
  }

  public static setServer(server: boolean): void {
    this.server = server;
  }

  public static setHacknet(hacknet: boolean): void {
    this.hacknet = hacknet;
  }
}