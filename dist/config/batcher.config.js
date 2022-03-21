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
    static batchtime = 50; //delay between componets of a batch (<50ms)
    static batchcountTresh = 25; //number of batches between sleeping
    static sleeptime = 10000; //time to sleep
    static tresh = 500; //treshhold of threads before only using PSERVs
    static setBatchtime(batchtime) {
        this.batchtime = batchtime;
    }
    static setBatchcountTresh(batchcountTresh) {
        this.batchcountTresh = batchcountTresh;
    }
    static setSleeptime(sleeptime) {
        this.sleeptime = sleeptime;
    }
    static setTresh(tresh) {
        this.tresh = tresh;
    }
    //Booleans
    static PSERV_ONLY = false; //use only PSERVs from the get-go?
    static server = true; //upgrade PSERVs?
    static hacknet = false; //upgrade Hacknet?
    static setPSERV_ONLY(pserv_only) {
        this.PSERV_ONLY = pserv_only;
    }
    static setServer(server) {
        this.server = server;
    }
    static setHacknet(hacknet) {
        this.hacknet = hacknet;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hlci5jb25maWcuanMiLCJzb3VyY2VSb290IjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3NvdXJjZXMvIiwic291cmNlcyI6WyJjb25maWcvYmF0Y2hlci5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLGFBQWE7SUFDeEIsaUZBQWlGO0lBRWpGLE1BQU0sQ0FBQyxPQUFPLEdBQUc7UUFDZixHQUFHLEVBQUUsaUNBQWlDO1FBQ3RDLEdBQUcsRUFBRSxpQ0FBaUM7UUFDdEMsR0FBRyxFQUFFLG1DQUFtQyxFQUFRLFlBQVk7S0FDN0QsQ0FBQTtJQUVELE1BQU0sQ0FBQyxVQUFVLEdBQUc7UUFDbEIsNEJBQTRCO1FBQzVCLDRCQUE0QjtRQUM1Qiw2QkFBNkI7S0FDOUIsQ0FBQztJQUVGLFVBQVU7SUFFSCxNQUFNLENBQUMsU0FBUyxHQUFXLEVBQUUsQ0FBQyxDQUFTLDRDQUE0QztJQUNuRixNQUFNLENBQUMsZUFBZSxHQUFXLEVBQUUsQ0FBQyxDQUFHLG9DQUFvQztJQUMzRSxNQUFNLENBQUMsU0FBUyxHQUFXLEtBQUssQ0FBQyxDQUFNLGVBQWU7SUFDdEQsTUFBTSxDQUFDLEtBQUssR0FBVyxHQUFHLENBQUMsQ0FBWSwrQ0FBK0M7SUFFdEYsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFpQjtRQUMxQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRU0sTUFBTSxDQUFDLGtCQUFrQixDQUFDLGVBQXVCO1FBQ3RELElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0lBQ3pDLENBQUM7SUFFTSxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQWlCO1FBQzFDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0lBQzdCLENBQUM7SUFFTSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQWE7UUFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVELFVBQVU7SUFFSCxNQUFNLENBQUMsVUFBVSxHQUFZLEtBQUssQ0FBQyxDQUFJLGtDQUFrQztJQUN6RSxNQUFNLENBQUMsTUFBTSxHQUFZLElBQUksQ0FBQyxDQUFTLGlCQUFpQjtJQUN4RCxNQUFNLENBQUMsT0FBTyxHQUFZLEtBQUssQ0FBQyxDQUFPLGtCQUFrQjtJQUV6RCxNQUFNLENBQUMsYUFBYSxDQUFDLFVBQW1CO1FBQzdDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFFTSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQWU7UUFDckMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVNLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBZ0I7UUFDdkMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQyJ9