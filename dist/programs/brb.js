/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
export async function main(ns) {
    ns.tail();
    ns.disableLog('ALL');
    const flags = ns.flags([
        ['minutes', 0]
    ]);
    let msg = '';
    let msg_cnt = 0;
    flags._.forEach(function (a) {
        if (a == '\\n') {
            msg += '\n[MSG_' + ++msg_cnt + ']: ';
        }
        else {
            msg += a + ' ';
        }
    });
    if (msg != '') {
        msg = '[MSG_0]: ' + msg + '\n';
    }
    const divisions = 60;
    const delay = (flags.minutes * 60 * 1000) / divisions;
    let loadingbar = [];
    for (let i = 0; i < divisions; i++) {
        loadingbar.push('[');
        loadingbar[i] = loadingbar[i].padEnd(i + 1, '|');
        loadingbar[i] = loadingbar[i].padEnd(divisions, '-') + ']';
        loadingbar[i] = 'I´ll be back in aprox ' + (((delay / (1000 * 60)) * (divisions - i)).toFixed(2)).padStart(5, '0') + ' minutes!\n' + msg + loadingbar[i] + '\n';
    }
    for (let i = 0; i < loadingbar.length; i++) {
        ns.clearLog();
        ns.print(loadingbar[i]);
        await ns.sleep(delay);
    }
    loadingbar = [];
    for (let i = 0; i < divisions; i++) {
        loadingbar.push('[');
        loadingbar[i] = loadingbar[i].padEnd(i, '|') + '.';
        loadingbar[i] = loadingbar[i].padEnd(divisions, '|') + ']';
        if (flags.minutes != 0) {
            loadingbar[i] = 'I´ll be back in just a few secs...\n' + msg + loadingbar[i] + '\n';
        }
        else {
            loadingbar[i] = '\n' + msg;
        }
    }
    for (let i = 0; i < loadingbar.length; i++) {
        ns.clearLog();
        ns.print(loadingbar[i]);
        await ns.sleep(1000);
        if (i == loadingbar.length - 1) {
            i = 0;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJiLmpzIiwic291cmNlUm9vdCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zb3VyY2VzLyIsInNvdXJjZXMiOlsicHJvZ3JhbXMvYnJiLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdHQUFnRztBQUVoRyxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBRXpCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNULEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFcEIsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNuQixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7S0FDakIsQ0FBQyxDQUFDO0lBRUgsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFBO0lBQ1osSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBRWYsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRTtZQUNaLEdBQUcsSUFBSSxTQUFTLEdBQUcsRUFBRSxPQUFPLEdBQUcsS0FBSyxDQUFBO1NBQ3ZDO2FBQ0k7WUFDRCxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQTtTQUNqQjtJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxHQUFHLElBQUksRUFBRSxFQUFFO1FBQUUsR0FBRyxHQUFHLFdBQVcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFBO0tBQUU7SUFFakQsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFBO0lBQ3BCLE1BQU0sS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO0lBRXRELElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQTtJQUVuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBRWhDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDcEIsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUNoRCxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBO1FBQzFELFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyx3QkFBd0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxHQUFHLEdBQUcsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFBO0tBRWpLO0lBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFFeEMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ2IsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2QixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7S0FFeEI7SUFFRCxVQUFVLEdBQUcsRUFBRSxDQUFBO0lBRWYsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUVoQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3BCLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7UUFDbEQsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtRQUMxRCxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFO1lBQ3BCLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxzQ0FBc0MsR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQTtTQUN0RjthQUNJO1lBQ0QsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUE7U0FDN0I7S0FFSjtJQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBRXhDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNiLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdkIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRXBCLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzVCLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDUjtLQUVKO0FBRUwsQ0FBQyJ9