/** @param {NS} ns **/

export async function main(ns) {
    const wss = await new WebSocket('wss://bitburn.ampeer.tk');
    ns.atExit(() => wss.close());
    await wss.addEventListener('open', async (event) => {
        globalThis.sendMessage = async (message) => {
            await wss.send(`{"message": "${message}"}`);
        }
    });
    await wss.addEventListener('message', async (event) => {
        let event_obj = JSON.parse(event.data);
        if (event_obj.keepAlive) return;
        let message = event_obj.username + " >> " + event_obj.message;
        ns.toast(message);
        ns.print(message);        
    });
    
    ns.tail('ws.js');
    while (true) {
        await ns.asleep(10000);
        await wss.send('{"keepAlive":true}');
    }

}