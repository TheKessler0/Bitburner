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
        var opts = { returnReward: true };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJhY3RTb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiaHR0cDovL2xvY2FsaG9zdDo4MDAwL3NvdXJjZXMvIiwic291cmNlcyI6WyJwcm9ncmFtcy9Db250cmFjdFNvbHZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFNO0lBQ2hDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNWLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2QsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ2xCLE9BQU8sSUFBSSxFQUFFO1FBQ1osS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNkLE1BQU0sR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xELHNEQUFzRDtRQUN0RCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDckI7SUFFRCxLQUFLLFVBQVUsR0FBRyxDQUFDLEVBQU0sRUFBRSxNQUFZLEVBQUUsT0FBZSxFQUFFLENBQTBHLEVBQUUsS0FBYSxFQUFFLEdBQUcsSUFBaUI7UUFDeE0sSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7WUFDbkIsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDZixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN2QjtTQUNEO1FBRUQsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENB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