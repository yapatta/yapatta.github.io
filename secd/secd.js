var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function () {
    var ENTER_KEY = 13;
    var MySECD = function () {
        var id = 1;
        var txtInput = document.getElementById("txtInput");
        var divResults = document.getElementById("divResults");
        var codeDetails = {
            author: "Yujiro Yahata",
            course: "Computational Model Theory",
            sem: "Spring 2020",
            date: "31th August, 2020",
            college: "Keio University"
        };
        var DomOperations = function () {
            txtInput.onkeypress = function (e) {
                if (e.keyCode === ENTER_KEY) {
                    console.log("--- Begin SECD ---");
                    console.log(txtInput.value);
                    var code = parseCode(txtInput.value);
                    var result = executeSECD(code, {});
                    divResults.innerHTML = result;
                    console.log("--- End SECD ---");
                }
            };
            var sideBar = document.getElementById("divSidebar");
            Array.from(sideBar.getElementsByTagName("span")).forEach(function (element) {
                element.onclick = function () {
                    console.log(element.innerHTML);
                    txtInput.value = element.innerHTML;
                    txtInput.focus();
                };
            });
        };
        var parseCode = function (inputCode) {
            console.log("input val: ", inputCode);
            var strAst = "return {" + inputCode + "};";
            var astObject = Function(strAst)();
            console.log("input ast: ", astObject);
            return astObject;
        };
        var executeSECD = function (code, env) {
            var secd = { S: new Array(), E: env, C: [code], D: new Array() };
            while (!(secd.S.length === 1 &&
                Object.keys(secd.E).length === 0 &&
                secd.C.length === 0 &&
                secd.D.length === 0)) {
                while (secd.C.length) {
                    // define2: if head C is variable
                    if (secd.C[secd.C.length - 1]["var"] !== undefined) {
                        console.log("Def2");
                        secd = executeDefTwo(secd);
                    }
                    else if (secd.C[secd.C.length - 1].func !== undefined) {
                        console.log("Def3");
                        secd = executeDefThree(secd);
                    }
                    else if (secd.C[secd.C.length - 1] === "ap") {
                        if (secd.S[secd.S.length - 1].closure !== undefined) {
                            console.log("Def4");
                            secd = executeDefFour(secd);
                        }
                        else {
                            console.log("Def5");
                            secd = executeDefFive(secd);
                        }
                    }
                    else {
                        console.log("Def6");
                        secd = executeDefSix(secd);
                    }
                    secdLogger(secd);
                }
                // C is Empty
                // Define1: (S, E, [], (S1, E1, C1, D1)) -> (S.pop():S1, E1, C1, D1)
                while (secd.D.length) {
                    console.log("Def1");
                    secd = executeDefOne(secd);
                    secdLogger(secd);
                }
            }
            return JSON.stringify(secd.S.pop());
        };
        // (S, E, C, D) -> (hs:S', E', C, D')
        // where S', E', C, D' = D
        var executeDefOne = function (secd) {
            var d = secd.D.pop();
            var newS = Array.from(d.S);
            var newE = Object.create(d.E);
            var newC = Object.create(d.C);
            var newD = Array.from(d.D);
            newS.push(secd.S.pop());
            return { S: newS, E: newE, C: newC, D: newD };
        };
        // hd C is variable
        // (location EXE:S, E, tC, D)
        var executeDefTwo = function (secd) {
            var newS = Array.from(secd.S);
            var newE = Object.create(secd.E);
            var newD = Array.from(secd.D);
            // S -> location EXE:S
            // C -> tl C
            // ex: headC = {var: {name: 'a', val: 2}}
            var headC = secd.C.pop();
            var newC = Array.from(secd.C);
            if (headC["var"].name in secd.E) {
                var newHeadC = { "var": secd.E[headC["var"].name] };
                newS.push(newHeadC);
            }
            else {
                newS.push(headC);
            }
            return { S: newS, E: newE, C: newC, D: newD };
        };
        // hd C is lambda expression
        var executeDefThree = function (secd) {
            var newS = Array.from(secd.S);
            var newE = Object.create(secd.E);
            var newD = Array.from(secd.D);
            // C -> tl C
            // ex: headC = {func: {arg: 'x', body: 'x'}}
            var headC = secd.C.pop();
            var newC = Array.from(secd.C);
            // closureをpush: {func, env}
            newS.push({
                closure: {
                    func: __assign({}, headC.func),
                    env: __assign({}, secd.E)
                }
            });
            return { S: newS, E: newE, C: newC, D: newD };
        };
        // hd C is 'ap' and hd S is a closure having env and bv X
        var executeDefFour = function (secd) {
            // ex: firstS = {closure: {func: {arg: 'x', body: 'x'}, env: {}}
            var firstS = secd.S.pop();
            var e1 = Object.create(firstS.closure.env);
            var arg = firstS.closure.func.arg;
            var body = firstS.closure.func.body;
            // derive(assoc(bv X, 2nd S)) :E1
            // ex: secondS = {var: {name: 'a', val: 2}}
            var secondS = secd.S.pop();
            var newE = Object.create(e1);
            newE[arg] = secondS["var"];
            secd.C.pop();
            var newS = [];
            var newC = typeof body === "string"
                ? [{ "var": { name: body, val: undefined } }]
                : [__assign({}, body)];
            var newD = [
                {
                    S: Array.from(secd.S),
                    E: Object.create(secd.E),
                    C: Array.from(secd.C),
                    D: Array.from(secd.D)
                },
            ];
            return { S: newS, E: newE, C: newC, D: newD };
        };
        // hd C is 'ap' and hd S is not a closure
        // (S, E, C, D) -> (((1st S)(2nd S):tl(tl S)), E, tl C, D)
        var executeDefFive = function (secd) {
            // ((1st S)(2nd S):tl(tl S)) is same as S
            var newS = Array.from(secd.S);
            var newE = Object.create(secd.E);
            secd.C.pop();
            var newC = Array.from(secd.C);
            var newD = Array.from(secd.D);
            return { S: newS, E: newE, C: newC, D: newD };
        };
        var executeDefSix = function (secd) {
            var newS = Array.from(secd.S);
            var newE = Object.create(secd.E);
            var newD = Array.from(secd.D);
            // ex: headC = {app: [{func: {}}, {var: {}}]}
            var headC = secd.C.pop();
            secd.C.push("ap");
            // left
            if (headC.app[0].func !== undefined) {
                secd.C.push({ func: headC.app[0].func });
            }
            else if (headC.app[0].app !== undefined) {
                secd.C.push({ app: headC.app[0].app });
            }
            else if (headC.app[0]["var"] !== undefined) {
                secd.C.push({ "var": headC.app[0]["var"] });
            }
            // right
            if (headC.app[1].func !== undefined) {
                secd.C.push({ func: headC.app[1].func });
            }
            else if (headC.app[1].app !== undefined) {
                secd.C.push({ app: headC.app[1].app });
            }
            else if (headC.app[1]["var"] !== undefined) {
                secd.C.push({ "var": headC.app[1]["var"] });
            }
            var newC = Array.from(secd.C);
            return { S: newS, E: newE, C: newC, D: newD };
        };
        var secdLogger = function (secd) {
            console.log("------ SECD Logger Start ------");
            // Stack
            console.log("--- S Start ---");
            secd.S.forEach(function (element) { return console.log(JSON.stringify(element)); });
            console.log("--- S End ---");
            // Environment
            console.log("--- E Start ---");
            console.log(JSON.stringify(secd.E));
            console.log("--- E End ---");
            // Control
            console.log("--- C Start ---");
            secd.C.forEach(function (element) { return console.log(JSON.stringify(element)); });
            console.log("--- C End ---");
            // Dump
            console.log("--- D Start ---");
            secd.D.forEach(function (element) { return console.log(JSON.stringify(element)); });
            console.log("--- D End ---");
            console.log("------ SECD Logger End ------");
        };
        return {
            init: DomOperations,
            credit: codeDetails
        };
    };
    window.onload = function () {
        var secd = MySECD();
        secd.init();
        console.log(secd.credit);
    };
})();
