const doc = Function('"use strict"; return document')(); // Saves some memory
const f = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z", "w0r1d_d43m0n"];
const css = `<style id="scanCSS">
        .sc {white-space:pre; color:#ccc; font:14px monospace; line-height: 16px; }
        .sc .s {color:#080;cursor:pointer;text-decoration:underline}
        .sc .f {color:#088}
        .sc .r {color:#6f3}
        .sc .r.f {color:#0ff}
        .sc .r::before {color:#6f3}
        .sc .hack {display:inline-block; font:12px monospace}
        .sc .red {color:red;}
        .sc .green {color:green;}
    </style>`;
function tprint(html) {
    return doc.getElementById("terminal").insertAdjacentHTML('beforeend', `<li>${html}</li>`);
}
/** @param {import("C:/Users/lfrit/Desktop/Birburner/Bitburner/NetscriptDefinitions").NS } ns */
export function main(ns) {
    const terminalInput = doc.getElementById("terminal-input");
    doc.head.insertAdjacentHTML('beforeend', doc.getElementById("scanCSS") ? '' : css);
    const s = ["home"];
    const p = [""];
    const r = { home: "home" };
    const myHack = ns.getHackingLevel();
    function fName(id) {
        const reqHack = ns.getServerRequiredHackingLevel(id);
        return `<a class="s${f.includes(id) ? " f" : ""}${ns.hasRootAccess(id) ? " r" : ""}">${id}</a>` +
            ` <span class="hack ${(reqHack <= myHack ? 'green' : 'red')}">(${reqHack})</span>` +
            `${' @'.repeat(ns.ls(id, ".cct").length)}`;
    }
    const addSc = (x = s[0], p1 = ["\n"], o = p1.join("") + fName(x)) => {
        for (let i = 0; i < s.length; i++) {
            if (p[i] != x) {
                continue;
            }
            const p2 = p1.slice();
            p2[p2.length - 1] = p2[p2.push(p.slice(i + 1).includes(p[i]) ? "├╴" : "└╴") - 2].replace("├╴", "│ ").replace("└╴", "  ");
            o += addSc(s[i], p2);
        }
        return o;
    };
    for (let i = 0, j; i < s.length; i++)
        for (j of ns.scan(s[i]))
            if (!s.includes(j))
                s.push(j), p.push(s[i]), r[j] = r[s[i]] + ";connect " + j;
    for (const [key, value] of Object.entries(r))
        r[key] = value + ";backdoor";
    tprint(`<div class="sc new">${addSc()}</div>`);
    doc.querySelectorAll(".sc.new .s").forEach(q => q.addEventListener('click', () => terminal(r[q.childNodes[0].nodeValue])));
    doc.querySelector(".sc.new").classList.remove("new");
}
function terminal(command) {
    const terminalInput = doc.getElementById('terminal-input');
    if (!terminalInput || terminalInput.disabled) {
        return;
    }
    terminalInput.value = command; // Insert command
    const handler = Object.keys(terminalInput)[1];
    terminalInput[handler].onChange({ target: terminalInput });
    terminalInput[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}