/** @param {NS} ns **/
export async function main(ns) {
    ns.tail();
    ns.disableLog('ALL');
    ns.clearLog();
    let found = false;
    while (true) {
        found = false;
        await dfs(ns, null, "home", trySolveContracts, 0);
        // if(!found) ns.print("INFO: No contracts found\n ");
        await ns.sleep(60000);
    }
    /** @param {NS} ns **/
    async function dfs(ns, parent, current, f, depth, ...args) {
        var hosts = ns.scan(current);
        if (parent != null) {
            const index = hosts.indexOf(parent);
            if (index > -1) {
                hosts.splice(index, 1);
            }
        }
        await f(ns, current, depth, ...args);
        for (let index = 0, len = hosts.length; index < len; ++index) {
            const host = hosts[index];
            await dfs(ns, current, host, f, depth + 1, ...args);
        }
    }
    /** @param {NS} ns **/
    async function trySolveContracts(ns, host, depth) {
        var contracts = ns.ls(host, "cct");
        for (var contract of contracts) {
            found = true;
            solveContract(ns, host, contract, 0);
        }
    }
    function solveContract(ns, host, filename, logLevel = 0) {
        var type = ns.codingcontract.getContractType(filename, host);
        var desc = ns.codingcontract.getDescription(filename, host);
        var data = ns.codingcontract.getData(filename, host);
        ns.print(host + " " + filename);
        ns.print(type);
        if (logLevel >= 1) {
            ns.print(desc);
            ns.print(data);
        }
        var answer;
        switch (type) {
            case "Minimum Path Sum in a Triangle":
                answer = minPathSumInTriangle(ns, data);
                break;
            case "Find Largest Prime Factor":
                answer = largestPrimeFactor(ns, data);
                break;
            case "Unique Paths in a Grid I":
                answer = uniquePathInGrid1(ns, data);
                break;
            case "Unique Paths in a Grid II":
                answer = uniquePathInGrid2(ns, data);
                break;
            case "Spiralize Matrix":
                answer = spiralizeMatrix(ns, data);
                break;
            case "Total Ways to Sum":
                answer = totalWayToSum(ns, data);
                break;
            case "Algorithmic Stock Trader I":
                answer = algorithmicStockTrader1(ns, data);
                break;
            case "Algorithmic Stock Trader II":
                answer = algorithmicStockTrader2(ns, data);
                break;
            case "Algorithmic Stock Trader III":
                answer = algorithmicStockTrader3(ns, data);
                break;
            case "Algorithmic Stock Trader IV":
                answer = algorithmicStockTrader4(ns, data);
                break;
            case "Array Jumping Game":
                answer = arrayJumpingGame(ns, data);
                break;
            case "Subarray with Maximum Sum":
                answer = subarrayWithMaxSum(ns, data);
                break;
            case "Generate IP Addresses":
                answer = generateIpAddresses(ns, data);
                break;
            case "Merge Overlapping Intervals":
                answer = mergeOverlappingIntervals(ns, data);
                break;
            case "Find All Valid Math Expressions":
                answer = findAllValidMathExpr(ns, data);
                break;
            case "Sanitize Parentheses in Expression":
                answer = sanitizeParentheses(ns, data);
                break;
            // ns.print("unsupported type: " + type);
            // return;
            default:
                ns.print("unknown type: " + type);
                return;
        }
        if (answer && !(answer instanceof String) && Object.keys(answer).length > 20) {
            ns.print("answer size too large to print: " + Object.keys(answer).length);
        }
        else {
            ns.print(answer);
        }
        var opts = {};
        opts.returnReward = true;
        var reward = ns.codingcontract.attempt(answer, filename, host, opts);
        if (reward) {
            ns.print(reward + '\n ');
        }
        else {
            ns.print("failed!");
        }
    }
    /** @param {NS} ns **/
    function sanitizeParentheses(ns, data) {
        var context = { "maxLeftLength": 0 };
        var exprs = findSanitized(ns, data, 0, context);
        exprs = exprs.filter((e) => e.length >= context["maxLeftLength"]).sort();
        for (var i = 0; i < exprs.length - 1; i++) {
            while (exprs[i] == exprs[i + 1]) {
                exprs.splice(i + 1, 1);
            }
        }
        return exprs;
    }
    function findSanitized(ns, s, pos, context) {
        if (s.length < context["maxLeftLength"]) {
            return [];
        }
        if (pos == s.length) {
            if (validateParentheses(s)) {
                if (s.length > context["maxLeftLength"]) {
                    context["maxLeftLength"] = s.length;
                }
                return [s];
            }
            else {
                return [];
            }
        }
        var results = [];
        var c = s[pos];
        if (c == "(" || c == ")") {
            results = results.concat(findSanitized(ns, s, pos + 1, context), findSanitized(ns, s.slice(0, pos) + s.slice(pos + 1), pos, context));
        }
        else {
            results = results.concat(findSanitized(ns, s, pos + 1, context));
        }
        return results;
    }
    function validateParentheses(s) {
        var n = 0;
        for (var i = 0; i < s.length; i++) {
            if (s[i] == "(") {
                n++;
            }
            if (s[i] == ")") {
                n--;
            }
            if (n < 0) {
                return false;
            }
        }
        return n == 0;
    }
    /** @param {NS} ns **/
    function findAllValidMathExpr(ns, data) {
        var s = data[0];
        var n = data[1];
        return findExpr(s, n, "");
    }
    function findExpr(s, n, expr) {
        if (s.length == 0) {
            if (eval(expr) == n) {
                return [expr];
            }
            else {
                return [];
            }
        }
        var results = [];
        if (s.startsWith("0")) {
            var sliced = s.slice(1);
            if (expr.length == 0) {
                return findExpr(sliced, n, expr + "0");
            }
            results = results.concat(findExpr(sliced, n, expr + "+0"), findExpr(sliced, n, expr + "-0"), findExpr(sliced, n, expr + "*0"));
            return results;
        }
        var maxLength = s.length;
        var ops = [];
        if (expr.length == 0) {
            ops = ["", "-"];
        }
        else {
            ops = ["-", "+", "*"];
        }
        for (var op of ops) {
            for (var i = 1; i <= maxLength; i++) {
                results = results.concat(findExpr(s.slice(i), n, expr + op + s.slice(0, i)));
            }
        }
        return results;
    }
    /** @param {NS} ns **/
    function mergeOverlappingIntervals(ns, data) {
        var intervals = data.slice();
        for (var i = 0; i < intervals.length; i++) {
            for (var j = i + 1; j < intervals.length;) {
                var merged = mergeInterval(intervals[i], intervals[j]);
                if (merged !== null) {
                    intervals[i] = merged;
                    intervals.splice(j, 1);
                    j = i + 1;
                }
                else {
                    j++;
                }
            }
        }
        intervals.sort((a, b) => a[0] - b[0]);
        return intervals;
    }
    function mergeInterval(a, b) {
        if (a[1] < b[0] || a[0] > b[1]) {
            return null;
        }
        return [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
    }
    /** @param {NS} ns **/
    function generateIpAddresses(ns, data) {
        return parseIpNum(ns, data, []);
    }
    /** @param {String} s
     * @Param {Array} parts**/
    function parseIpNum(ns, s, parts) {
        if (parts.length == 4) {
            if (s.length == 0) {
                return [parts[0] + "." + parts[1] + "." + parts[2] + "." + parts[3]];
            }
            else {
                return [];
            }
        }
        if (s.length == 0) {
            return [];
        }
        var results = [];
        if (s.startsWith("0")) {
            parts.push(0);
            results = parseIpNum(ns, s.slice(1), parts);
            parts.pop();
            return results;
        }
        for (var i = 1; i <= 3 && i <= s.length; i++) {
            var n = parseInt(s.slice(0, i));
            if (n > 255) {
                break;
            }
            parts.push(n);
            results = results.concat(parseIpNum(ns, s.slice(i), parts));
            parts.pop();
        }
        return results;
    }
    /** @param {NS} ns **/
    function uniquePathInGrid2(ns, data) {
        var maxY = data.length;
        var maxX = data[0].length;
        var c = Array(maxY);
        for (var y = 0; y < maxY; y++) {
            var row = data[y];
            c[y] = Array(maxX);
            for (var x = 0; x < row.length; x++) {
                var s = 0;
                if (row[x] == 0) {
                    if (x == 0 && y == 0) {
                        s = 1;
                    }
                    if (y > 0) {
                        s += c[y - 1][x];
                    }
                    if (x > 0) {
                        s += c[y][x - 1];
                    }
                }
                c[y][x] = s;
            }
        }
        return c[maxY - 1][maxX - 1];
    }
    function countPathInGrid(data, x, y) {
        var obstacle = data[y][x];
        if (obstacle == 1) {
            return 0;
        }
        if (x == data[y].length - 1 && y == data.length) {
            return 1;
        }
        var count = 0;
        if (x < data[y].length - 1) {
            count += countPathInGrid(data, x + 1, y);
        }
        if (y < data.length - 1) {
            count += countPathInGrid(data, x, y + 1);
        }
    }
    /** @param {NS} ns **/
    function subarrayWithMaxSum(ns, data) {
        return findMaxSubArraySum(data);
    }
    function findMaxSubArraySum(arr) {
        if (arr.length == 0) {
            return 0;
        }
        if (arr.length == 1) {
            return arr[0];
        }
        var sum = findMaxSubArraySum(arr.slice(1));
        var s = 0;
        for (var i = 0; i < arr.length; i++) {
            s += arr[i];
            if (s > sum) {
                sum = s;
            }
        }
        return sum;
    }
    /** @param {NS} ns **/
    function arrayJumpingGame(ns, data) {
        return findJump(data, 0);
    }
    function findJump(data, pos) {
        var maxJump = data[pos];
        if (pos + maxJump >= data.length - 1) {
            return 1;
        }
        for (var i = 1; i <= maxJump; i++) {
            if (findJump(data, pos + i) == 1) {
                return 1;
            }
        }
        return 0;
    }
    /** @param {NS} ns **/
    function algorithmicStockTrader1(ns, data) {
        if (data.length == 0) {
            return 0;
        }
        var chances = findProfitChances(data);
        var mergedChances = mergeChances(chances);
        var profit = Math.max(...(mergedChances.map(cs => Math.max(...(cs.map((c) => c[1] - c[0]))))));
        return profit;
    }
    /** @param {NS} ns **/
    function algorithmicStockTrader2(ns, data) {
        if (data.length == 0) {
            return 0;
        }
        var chances = findProfitChances(data);
        var profit = chances.map(c => c[1] - c[0]).reduce((a, b) => a + b, 0);
        return profit;
    }
    /** @param {NS} ns **/
    function algorithmicStockTrader3(ns, data) {
        if (data.length == 0) {
            return 0;
        }
        var chances = findProfitChances(data);
        // var mergedChances = mergeChances(chances);
        // var mp = mergedChances.map(cs=>cs.map(c=>c[1]-c[0]));
        return maxProfit(chances, 2);
    }
    /** @param {NS} ns **/
    function algorithmicStockTrader4(ns, data) {
        if (data[1].length == 0) {
            return 0;
        }
        var chances = findProfitChances(data[1]);
        // var mergedChances = mergeChances(chances);
        // var mp = mergedChances.map(cs=>cs.map(c=>c[1]-c[0]));
        return maxProfit(chances, data[0]);
    }
    function maxProfit(chances, k) {
        if (k == 0 || chances.length == 0) {
            return 0;
        }
        var c0 = chances[0];
        if (chances.length == 1) {
            return c0[1] - c0[0];
        }
        var profit = maxProfit(chances.slice(1), k);
        for (var i = 0; i < chances.length; i++) {
            var p = chances[i][1] - chances[0][0] + maxProfit(chances.slice(i + 1), k - 1);
            if (p > profit) {
                profit = p;
            }
        }
        return profit;
    }
    function findProfitChances(data) {
        var start = data[0];
        var end = start;
        var chances = [];
        for (var i = 1; i < data.length; i++) {
            var now = data[i];
            if (end < now) {
                end = now;
            }
            if (end > now) {
                if (end > start) {
                    chances.push([start, end]);
                }
                start = now;
                end = start;
            }
        }
        if (end > start) {
            chances.push([start, end]);
        }
        return chances;
    }
    function mergeChances(chances) {
        var n = chances.length;
        var mc = [];
        var cs = chances.slice();
        mc.push(cs);
        while (cs.length > 1) {
            var ncs = [];
            for (var i = 0; i < cs.length - 1; i++) {
                ncs.push([cs[i][0], cs[i + 1][1]]);
            }
            mc.push(ncs);
            cs = ncs;
        }
        mc.reverse();
        return mc;
    }
    /** @param {NS} ns **/
    function minPathSumInTriangle(ns, data) {
        var length = data.length;
        if (length == 1) {
            return data[0][0];
        }
        var r = data[length - 1].slice();
        for (var i = length - 2; i >= 0; i--) {
            var row = data[i];
            var nr = [];
            for (var j = 0; j < i + 1; j++) {
                nr.push(Math.min(r[j] + row[j], r[j + 1] + row[j]));
            }
            r = nr;
        }
        return r[0];
    }
    /** @param {NS} ns **/
    function largestPrimeFactor(ns, data) {
        var factor = 0;
        var k = data;
        var rk = Math.sqrt(k);
        for (var i = 2; i < rk;) {
            if (k % i == 0) {
                factor = i;
                k /= i;
                rk = Math.sqrt(k);
            }
            else {
                i++;
            }
        }
        if (k > factor) {
            factor = k;
        }
        return factor;
    }
    function uniquePathInGrid1(ns, data) {
        var a = data[0];
        var b = data[1];
        if (a > b) {
            a = data[1];
            b = data[0];
        }
        a = a - 1;
        b = b - 1;
        var n = a + b;
        var c = 1;
        for (var i = 1; i <= a; i++) {
            c = c * n / i;
            n--;
        }
        return c;
    }
    function spiralizeMatrix(ns, data) {
        var s = 0;
        var m = [];
        for (var i = 0; i < data.length; i++) {
            m.push(data[i].slice());
        }
        var a = [];
        while (m.length > 0 && m[0].length > 0) {
            switch (s) {
                case 0:
                    a = a.concat(m[0]);
                    m = m.slice(1);
                    s = 1;
                    break;
                case 1:
                    for (var i = 0; i < m.length; i++) {
                        a.push(m[i].pop());
                    }
                    s = 2;
                    break;
                case 2:
                    a = a.concat(m.pop().reverse());
                    s = 3;
                    break;
                case 3:
                    for (var i = m.length - 1; i >= 0; i--) {
                        a.push(m[i][0]);
                        m[i] = m[i].slice(1);
                    }
                    s = 0;
                    break;
            }
        }
        return a;
    }
    function totalWayToSum(ns, data) {
        var cache = {};
        var n = data;
        return twts(n, n, cache) - 1;
    }
    function twts(limit, n, cache) {
        if (n < 1) {
            return 1;
        }
        if (limit == 1) {
            return 1;
        }
        if (n < limit) {
            return twts(n, n, cache);
        }
        if (n in cache) {
            var c = cache[n];
            if (limit in c) {
                return c[limit];
            }
        }
        var s = 0;
        for (var i = 1; i <= limit; i++) {
            s += twts(i, n - i, cache);
        }
        if (!(n in cache)) {
            cache[n] = {};
        }
        cache[n][limit] = s;
        return s;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJhY3RTb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3NvdXJjZXMvIiwic291cmNlcyI6WyJwcm9ncmFtcy9Db250cmFjdFNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBa0g7SUFDNUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ1YsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDZCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDbEIsT0FBTyxJQUFJLEVBQUU7UUFDWixLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2QsTUFBTSxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEQsc0RBQXNEO1FBQ3RELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUNyQjtJQUdELHNCQUFzQjtJQUN0QixLQUFLLFVBQVUsR0FBRyxDQUFDLEVBQWlDLEVBQUUsTUFBWSxFQUFFLE9BQWUsRUFBRSxDQUEwRyxFQUFFLEtBQWEsRUFBRSxHQUFHLElBQWlCO1FBQ25PLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0IsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ25CLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2YsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDdkI7U0FDRDtRQUVELE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFP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