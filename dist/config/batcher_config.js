export async function main(ns) {
    ns.tprint("ERROR: \nTHIS IS NOT MEANT TO BE RUN, DUMMY!");
}
export function getUserland() {
    let USERLAND = {
        //Attacking Scripts (ALL need to take the same time to execute as the Weakenfile)
        HCK: '/programs/dependencies/1hack.js',
        GRW: '/programs/dependencies/1grow.js',
        WKN: '/programs/dependencies/1weaken.js',
        //Other scripts that should be Started at Startup
        StartOnce: ['/programs/tools/watcher.js', '/programs/tools/servinf.js', '/programs/ContractSolver.js'],
        //Integers
        batchtime: 50,
        batchcountTresh: 25,
        sleeptime: 10000,
        tresh: 500,
        //Booleans
        PSERV_ONLY: false,
        server: true,
        hacknet: false //upgrade Hacknet?
    };
    return USERLAND; //TODO somebody fix this shit  ;P
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmF0Y2hlcl9jb25maWcuanMiLCJzb3VyY2VSb290IjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3NvdXJjZXMvIiwic291cmNlcyI6WyJjb25maWcvYmF0Y2hlcl9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBTztJQUM5QixFQUFFLENBQUMsTUFBTSxDQUFDLDhDQUE4QyxDQUFDLENBQUE7QUFDN0QsQ0FBQztBQUVELE1BQU0sVUFBVSxXQUFXO0lBRXZCLElBQUksUUFBUSxHQUFHO1FBRVgsaUZBQWlGO1FBRWpGLEdBQUcsRUFBRSxpQ0FBaUM7UUFDdEMsR0FBRyxFQUFFLGlDQUFpQztRQUN0QyxHQUFHLEVBQUUsbUNBQW1DO1FBRXhDLGlEQUFpRDtRQUVqRCxTQUFTLEVBQUUsQ0FBQyw0QkFBNEIsRUFBQyw0QkFBNEIsRUFBQyw2QkFBNkIsQ0FBQztRQUVwRyxVQUFVO1FBRVYsU0FBUyxFQUFFLEVBQUU7UUFDYixlQUFlLEVBQUUsRUFBRTtRQUNuQixTQUFTLEVBQUUsS0FBSztRQUNoQixLQUFLLEVBQUUsR0FBRztRQUVWLFVBQVU7UUFFVixVQUFVLEVBQUUsS0FBSztRQUNqQixNQUFNLEVBQUUsSUFBSTtRQUNaLE9BQU8sRUFBRSxLQUFLLENBQWMsa0JBQWtCO0tBQ2pELENBQUM7SUFFRixPQUFPLFFBQVEsQ0FBQSxDQUFLLGlDQUFpQztBQUV6RCxDQUFDIn0=