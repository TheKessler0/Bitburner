export class BatcherConfig {
    //Attacking Scripts (ALL need to take the same time to execute as the Weakenfile)
    ATTACKS = {
        HCK: '/programs/dependencies/1hack.js',
        GRW: '/programs/dependencies/1grow.js',
        WKN: '/programs/dependencies/1weaken.js', //Weakenfile
    };
    START_ONCE = [
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hlci5jb25maWcuanMiLCJzb3VyY2VSb290IjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3NvdXJjZXMvIiwic291cmNlcyI6WyJjb25maWcvYmF0Y2hlci5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLGFBQWE7SUFDeEIsaUZBQWlGO0lBRTFFLE9BQU8sR0FBRztRQUNmLEdBQUcsRUFBRSxpQ0FBaUM7UUFDdEMsR0FBRyxFQUFFLGlDQUFpQztRQUN0QyxHQUFHLEVBQUUsbUNBQW1DLEVBQVEsWUFBWTtLQUM3RCxDQUFBO0lBRU0sVUFBVSxHQUFHO1FBQ2xCLDRCQUE0QjtRQUM1Qiw0QkFBNEI7UUFDNUIsNkJBQTZCO0tBQzlCLENBQUM7SUFFRixVQUFVO0lBRUgsU0FBUyxHQUFXLEVBQUUsQ0FBQyxDQUFTLDRDQUE0QztJQUM1RSxlQUFlLEdBQVcsRUFBRSxDQUFDLENBQUcsb0NBQW9DO0lBQ3BFLFNBQVMsR0FBVyxLQUFLLENBQUMsQ0FBTSxlQUFlO0lBQy9DLEtBQUssR0FBVyxHQUFHLENBQUMsQ0FBWSwrQ0FBK0M7SUFFdEYsVUFBVTtJQUVILFVBQVUsR0FBWSxLQUFLLENBQUMsQ0FBSSxrQ0FBa0M7SUFDbEUsTUFBTSxHQUFZLElBQUksQ0FBQyxDQUFTLGlCQUFpQjtJQUNqRCxPQUFPLEdBQVksS0FBSyxDQUFDLENBQU8sa0JBQWtCO0NBQzFEIn0=