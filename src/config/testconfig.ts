export async function main(ns : NS) {

    ns.tprint('ERROR: this is only a example, not meant to be executed!')
    ns.exit()


    let config = await parseConfig()
    ns.tprint(typeof config, + '\n')
    ns.tprint(config)

    async function parseConfig(): Promise < object >{

        let filepath = '/config/batcher_config.txt'

        if (!ns.fileExists(filepath)) {
            
            let standardconfigArray : string[] = [
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
            
            let standardconfig : string = ''
            standardconfigArray.forEach(function (a) {standardconfig += a});
            
            await ns.write(filepath,standardconfig)
            ns.tprint('ERROR: created missing config at:\n' + filepath + '\n\nadjust values if needed, then start this script again!')
            ns.exit()
            return {}
        }
        else {
            let raw = ns.read(filepath)
            return JSON.parse(raw.replace(/( *\/\/\*.*\*\/)| *\n */gm,''))
        }
    }
}