export async function main(ns) {
    let config = await parseConfig();
    ns.tprint(typeof config);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvc291cmNlcy8iLCJzb3VyY2VzIjpbImNvbmZpZy90ZXN0Y29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQU87SUFFOUIsSUFBSSxNQUFNLEdBQUcsTUFBTSxXQUFXLEVBQUUsQ0FBQTtJQUVoQyxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sTUFBTSxDQUFDLENBQUE7SUFDeEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVqQixLQUFLLFVBQVUsV0FBVztRQUV0QixJQUFJLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQTtRQUUzQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUUxQixJQUFJLG1CQUFtQixHQUFjO2dCQUNqQyxLQUFLO2dCQUNMLElBQUk7Z0JBQ0osc0lBQXNJO2dCQUN0SSxJQUFJO2dCQUNKLHNJQUFzSTtnQkFDdEksc0lBQXNJO2dCQUN0SSxzSUFBc0k7Z0JBQ3RJLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLHNJQUFzSTtnQkFDdEksSUFBSTtnQkFDSiwwR0FBMEc7Z0JBQzFHLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLHNJQUFzSTtnQkFDdEksSUFBSTtnQkFDSixzSUFBc0k7Z0JBQ3RJLHNJQUFzSTtnQkFDdEksc0lBQXNJO2dCQUN0SSxzSUFBc0k7Z0JBQ3RJLElBQUk7Z0JBQ0osSUFBSTtnQkFDSixJQUFJO2dCQUNKLHNJQUFzSTtnQkFDdEksSUFBSTtnQkFDSixzSUFBc0k7Z0JBQ3RJLHNJQUFzSTtnQkFDdEksc0lBQXNJO2dCQUN0SSxHQUFHO2FBQ04sQ0FBQztZQUVGLElBQUksY0FBYyxHQUFZLEVBQUUsQ0FBQTtZQUNoQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUcsY0FBYyxJQUFJLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO1lBRWhFLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUMsY0FBYyxDQUFDLENBQUE7WUFDdkMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxxQ0FBcUMsR0FBRyxRQUFRLEdBQUcsNERBQTRELENBQUMsQ0FBQTtZQUMxSCxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDVCxPQUFPLEVBQUUsQ0FBQTtTQUNaO2FBQ0k7WUFDRCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzNCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLDJCQUEyQixFQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7U0FDakU7SUFDTCxDQUFDO0FBQ0wsQ0FBQyJ9