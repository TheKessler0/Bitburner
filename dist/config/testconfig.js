export async function main(ns) {
    ns.tprint('ERROR: this is only a example, not meant to be executed!');
    ns.exit();
    let config = await parseConfig();
    ns.tprint(typeof config, +'\n');
    ns.tprint(config);
    async function parseConfig() {
        let filepath = '/config/batcher_config.txt';
        if (!ns.fileExists(filepath)) {
            let standardconfigArray = [
                '{\n',
                '\n',
                '//* Vital executables for the batcher to work                                                                                   */\n',
                '\n',
                '"HCK":"/programs/dependencies/1hack.js",        //* hack-file                                                                   */\n',
                '"GRW":"/programs/dependencies/1grow.js",        //* grow-file                                                                   */\n',
                '"WKN":"/programs/dependencies/1weaken.js",      //* weaken-file                                                                 */\n',
                '\n',
                '\n',
                '\n',
                '//* other scripts that should be run at startup                                                                                 */\n',
                '\n',
                '"StartOnce":["/programs/tools/watcher.js","/programs/tools/servinf.js","/programs/ContractSolver.js"],\n',
                '\n',
                '\n',
                '\n',
                '//* times and threshholds                                                                                                       */\n',
                '\n',
                '"batchtime":50,                                 //* delay between constituent parts of a batch                                  */\n',
                '"batchcountTresh":25,                           //* number of batches between sleeping (to avoid batch fragmenting)             */\n',
                '"sleeptime":10000,                              //* time to sleep for (to avoid batch fragmenting)                              */\n',
                '"tresh":500,                                    //* threshhold of threads on player-servers before switch to only using those   */\n',
                '\n',
                '\n',
                '\n',
                '//* boolean settings                                                                                                            */\n',
                '\n',
                '"PSERV_ONLY":false,                             //* only use player-servers from the get-go?                                    */\n',
                '"server":true,                                  //* upgrade/buy player-servers?                                                 */\n',
                '"hacknet":false                                 //* upgrade/buy hacknet nodes?                                                  */\n',
                '}'
            ];
            let standardconfig = '';
            standardconfigArray.forEach(function (a) { standardconfig += a; });
            await ns.write(filepath, standardconfig);
            ns.tprint('ERROR: created missing config at:\n' + filepath + '\n\nadjust values if needed, then start this script again!');
            ns.exit();
            return {};
        }
        else {
            let raw = ns.read(filepath);
            return JSON.parse(raw.replace(/( *\/\/\*.*\*\/)| *\n */gm, ''));
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbImNvbmZpZy90ZXN0Y29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQU87SUFFOUIsRUFBRSxDQUFDLE1BQU0sQ0FBQywwREFBMEQsQ0FBQyxDQUFBO0lBQ3JFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUdULElBQUksTUFBTSxHQUFHLE1BQU0sV0FBVyxFQUFFLENBQUE7SUFDaEMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLE1BQU0sRUFBRSxDQUFFLElBQUksQ0FBQyxDQUFBO0lBQ2hDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFakIsS0FBSyxVQUFVLFdBQVc7UUFFdEIsSUFBSSxRQUFRLEdBQUcsNEJBQTRCLENBQUE7UUFFM0MsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFFMUIsSUFBSSxtQkFBbUIsR0FBYztnQkFDakMsS0FBSztnQkFDTCxJQUFJO2dCQUNKLHNJQUFzSTtnQkFDdEksSUFBSTtnQkFDSixzSUFBc0k7Z0JBQ3RJLHNJQUFzSTtnQkFDdEksc0lBQXNJO2dCQUN0SSxJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixzSUFBc0k7Z0JBQ3RJLElBQUk7Z0JBQ0osMEdBQTBHO2dCQUMxRyxJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixzSUFBc0k7Z0JBQ3RJLElBQUk7Z0JBQ0osc0lBQXNJO2dCQUN0SSxzSUFBc0k7Z0JBQ3RJLHNJQUFzSTtnQkFDdEksc0lBQXNJO2dCQUN0SSxJQUFJO2dCQUNKLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixzSUFBc0k7Z0JBQ3RJLElBQUk7Z0JBQ0osc0lBQXNJO2dCQUN0SSxzSUFBc0k7Z0JBQ3RJLHNJQUFzSTtnQkFDdEksR0FBRzthQUNOLENBQUM7WUFFRixJQUFJLGNBQWMsR0FBWSxFQUFFLENBQUE7WUFDaEMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFHLGNBQWMsSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFDLENBQUMsQ0FBQztZQUVoRSxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFDLGNBQWMsQ0FBQyxDQUFBO1lBQ3ZDLEVBQUUsQ0FBQyxNQUFNLENBQUMscUNBQXFDLEdBQUcsUUFBUSxHQUFHLDREQUE0RCxDQUFDLENBQUE7WUFDMUgsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ1QsT0FBTyxFQUFFLENBQUE7U0FDWjthQUNJO1lBQ0QsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUMzQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1NBQ2pFO0lBQ0wsQ0FBQztBQUNMLENBQUMifQ==