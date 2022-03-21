export class BatcherConfig {
    //Attacking Scripts (ALL need to take the same time to execute as the Weakenfile)
    static ATTACKS = {
        HCK: '/programs/dependencies/1hack.js',
        GRW: '/programs/dependencies/1grow.js',
        WKN: '/programs/dependencies/1weaken.js', //Weakenfile
    };
    static START_ONCE = [
        '/programs/tools/watcher.js',
        '/programs/tools/servinf.js',
        '/programs/ContractSolver.js',
    ];
    //Integers
    batchtime = 50; //delay between componets of a batch (<50ms)
    batchcountTresh = 25; //number of batches between sleeping
    sleeptime = 10000; //time to sleep
    tresh = 500; //treshhold of threads before only using PSERVs
    //Booleans
    PSERV_ONLY = false; //use only PSERVs from the get-go?
    server = true; //upgrade PSERVs?
    hacknet = false; //upgrade Hacknet?
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hlci5jb25maWcuanMiLCJzb3VyY2VSb290IjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3NvdXJjZXMvIiwic291cmNlcyI6WyJjb25maWcvYmF0Y2hlci5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFnQixhQUFhO0lBQ2pDLGlGQUFpRjtJQUNqRixNQUFNLENBQVUsT0FBTyxHQUFHO1FBQ3hCLEdBQUcsRUFBRSxpQ0FBaUM7UUFDdEMsR0FBRyxFQUFFLGlDQUFpQztRQUN0QyxHQUFHLEVBQUUsbUNBQW1DLEVBQVEsWUFBWTtLQUM3RCxDQUFBO0lBRUQsTUFBTSxDQUFVLFVBQVUsR0FBRztRQUMzQiw0QkFBNEI7UUFDNUIsNEJBQTRCO1FBQzVCLDZCQUE2QjtLQUM5QixDQUFDO0lBRUYsVUFBVTtJQUVWLFNBQVMsR0FBVyxFQUFFLENBQUMsQ0FBUyw0Q0FBNEM7SUFDNUUsZUFBZSxHQUFXLEVBQUUsQ0FBQyxDQUFHLG9DQUFvQztJQUNwRSxTQUFTLEdBQVcsS0FBSyxDQUFDLENBQU0sZUFBZTtJQUMvQyxLQUFLLEdBQVcsR0FBRyxDQUFDLENBQVksK0NBQStDO0lBRS9FLFVBQVU7SUFFVixVQUFVLEdBQVksS0FBSyxDQUFDLENBQUksa0NBQWtDO0lBQ2xFLE1BQU0sR0FBWSxJQUFJLENBQUMsQ0FBUyxpQkFBaUI7SUFDakQsT0FBTyxHQUFZLEtBQUssQ0FBQyxDQUFPLGtCQUFrQiJ9