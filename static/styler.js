function parseColor(color) {
    let result;
    switch(color) {
        case "r":
            result = 0xff0000;
            break;
        case "g":
            result = 0x00ff00;
            break;
        case "b":
            result = 0x0000ff;
            break;
        case "k":
            result = 0x000000;
            break;
        default:
            result = color;
            break;
    }
    return result;
}


function parseStyleCode(code) {
    let v = null; let c; let s;
    c = code.search(/[rgbk]/g);
    if (c == -1) {c = null;}
    else {c = parseColor(code[c]); v = 1;}
    s = (/[0-9.]+/g).exec(code);
    if (s) {
        if (s == 0) { v = 0; s = null;}
        else { v = 1; s = +s[0];}
    }
    // let m = code.search(/--|-/g);
    // if (m == -1) {m = null;}
    return {
        visible: v,
        color: c,
        size: s
    }
}

function parseStyle(line) {
    let result = {
        name: line[0],
        caption: line[1],
        type: line[2],
    };
    if (result.type == "hparam" || result.type == "param") {
        result.values = line.slice(4);
        result.valueOrig = line[3];
        if (result.color == "") {result.color = "k";}
        if (result.size == "") {result.size = 1;}
        else {result.size = +result.size;}
        if (result.values[0] == "") {result.values[0] = 1;}
        result.values[0] = +result.values[0];
        let val0 = result.values[0];
        if (result.valueOrig == "") {result.valueOrig = val0;}
        else {result.valueOrig = +result.valueOrig; }
        for (let i=1; i<result.values.length; i++) {
            if (result.values[i] == "") { result.values[i] = +result.values[i-1]; }
            else { result.values[i] = +result.values[i]; }
        }
    }
    else {
        result.styles = line.slice(4);
        result.styleOrig = line[3];
        let sty0 = parseStyleCode(result.styles[0]);
        if (sty0.visible == null) {sty0.visible = 1;}
        if (sty0.color == null) {sty0.color = 0x000000;}
        if (sty0.size == null) {sty0.size = 1.;}
        result.styles[0] = sty0;
        for (let i=1; i<result.styles.length; i++) {
            let sty = parseStyleCode(result.styles[i]);
            result.styles[i] = sty;
            for (let key in sty0) {
                if (sty[key] == null) { sty[key] = result.styles[i-1][key]; }
            }
        }
        result.styleOrig = parseStyleCode(result.styleOrig);
        for (let key in sty0) {
            if (result.styleOrig[key] == null) { result.styleOrig[key] = result.styles[0][key]; }
        }
    }
    return result
}

class StyleSheet {
    constructor(responseText) {
        this.hparams = {};
        this.paramTrend = [];
        this.paramOrig = {};
        this.objStyleTrend = [];
        this.objStyleOrig = [];
        this.objNames = []
        this.objCaptions = [];
        this.objTypes = [];
        this.nObjs = 0;

        let styleTable = responseText.split("\n").slice(1);
        for (let i=0; i<styleTable.length; i++) {
            let line = styleTable[i].trim().split(",");
            let parsed = parseStyle(line);
            if (parsed.type == "hparam") {
                this[parsed.name] = parsed.valueOrig;
                this.hparams[parsed.name] = parsed.valueOrig;
                if (parsed.name == "stepMax") {
                    for (let j=0; j<=parsed.valueOrig; j++) {
                        this.paramTrend.push( {} );
                        this.objStyleTrend.push( [] );
                    }
                }
            }
            else if (parsed.type == "param") {
                for (let j=0; j<=this.hparams.stepMax; j++) {
                    this.paramTrend[j][parsed.name] = parsed.values[j];
                }
                this.paramOrig[parsed.name] = parsed.valueOrig;
            }
            else {
                this.nObjs ++;
                for (let j=0; j<=this.hparams.stepMax; j++) {
                    this.objStyleTrend[j].push( parsed.styles[j] );
                }
                this.objStyleOrig.push( parsed.styleOrig );
                this.objNames.push (parsed.name );
                this.objCaptions.push( parsed.caption );
                this.objTypes.push( parsed.type );
            }
        }
        if (!('centerZ' in this.hparams)) {
            this.hparams.centerZ = 0;
            this.centerZ = 0;
        }
    }

    getParams(step=0, original=false) {
        if (original) { return this.paramOrig; }
        else { return this.paramTrend[step]; }
    }

    getStyles(step=0, original=false) {
        if (original) { return this.objStyleOrig; }
        else { return this.objStyleTrend[step]; }
    }
}

export {StyleSheet};