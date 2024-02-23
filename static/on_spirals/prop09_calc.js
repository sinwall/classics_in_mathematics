import {e_x, e_y, origin} from "/static/construction.js"
import { bisectionSolver } from "/static/analysis.js";

function calculateGeometry(params) {
    let {
        radiusABGD, angleAKQ, angleBKQ, ratioLengthCG, 
        ratioPosZ, ratioLengthZ, ratioPosH, ratioLengthH, ratioBiggerRatio,
        switchKLleft, switchC, ratioDistortIN, switchB
    } = params;
    angleAKQ *= Math.PI/180;
    angleBKQ *= Math.PI/180;
    let K = origin.clone();
    let A = K.clone()
        .addScaledVector(e_x, -radiusABGD*Math.sin(angleAKQ))
        .addScaledVector(e_y, radiusABGD*Math.cos(angleAKQ));
    let G = K.clone()
        .addScaledVector(e_x, radiusABGD*Math.sin(angleAKQ))
        .addScaledVector(e_y, radiusABGD*Math.cos(angleAKQ));
    let AG = [A, G];
    let ABGD = [K, radiusABGD];
    let L = K.clone()
        .addScaledVector(e_x, radiusABGD/Math.sin(angleAKQ));
    let Q = A.clone()
        .addScaledVector(G.clone().sub(A), 0.5);
    ratioLengthZ = Math.max(ratioLengthZ, Math.tan(angleAKQ)*ratioLengthH*ratioBiggerRatio);
    let Zbottom = K.clone()
        .addScaledVector(e_x, -radiusABGD*ratioPosZ)
        .addScaledVector(e_y, -0.5*radiusABGD*ratioLengthZ);
    let Ztop = Zbottom.clone()
        .addScaledVector(e_y, radiusABGD*ratioLengthZ);
    let Hbottom = K.clone()
        .addScaledVector(e_x, -radiusABGD*ratioPosH)
        .addScaledVector(e_y, -0.5*radiusABGD*ratioLengthH);
    let Htop = Hbottom.clone()
        .addScaledVector(e_y, radiusABGD*ratioLengthH);
    let Z = [Zbottom, Ztop];
    let H = [Hbottom, Htop]; 
    let GQ = [G, Q];
    let QK = [Q, K];
    let GK = [G, K];
    let GL = [G, L];
    let KLleft = K.clone()
        .addScaledVector(e_x, -radiusABGD*switchKLleft);
    let KL = [KLleft, L];
    let ratioLengthGL = 1/Math.tan(angleAKQ);
    ratioLengthCG = (1-switchC)*ratioLengthCG + (switchC)*(ratioLengthH/ratioLengthZ);
    let C = G.clone()
        .addScaledVector(e_x, -radiusABGD*ratioLengthCG*Math.cos(angleAKQ))
        .addScaledVector(e_y, radiusABGD*ratioLengthCG*Math.sin(angleAKQ));
    let CL = [C, L];
    let CLmid = L.clone()
        .addScaledVector(C.clone().sub(L), 0.5);
    let ratioLengthGM = ratioLengthGL*ratioLengthCG;
    let ratioDistCLToCenter = (ratioLengthGM - 1) / 2;
    let centerKLC = CLmid.clone()
        .addScaledVector(G.clone().sub(K), ratioDistCLToCenter);
    let KLC = [centerKLC, centerKLC.distanceTo(K)];
    let M = G.clone()
        .addScaledVector(G.clone().sub(K), ratioLengthGM);
    let GM = [G, M];
    let angleGKI = 0;
    function getINlength(angleGKI) {
        let ratioLengthCI = ratioLengthCG + Math.tan(angleGKI);
        let ratioLengthIL = ratioLengthGL - Math.tan(angleGKI);
        return ratioLengthCI*ratioLengthIL - ratioDistortIN*ratioLengthGM/Math.cos(angleGKI);
    }
    let bsRefPt = centerKLC.clone()
        .addScaledVector(G.clone().sub(K), KLC[1]);
    let bsRefAngle0 = M.clone().sub(K).angleTo(bsRefPt.clone().sub(K));
    let bsRefAngle1 = M.clone().sub(K).angleTo(L.clone().sub(K));
    // console.log(bsRefAngle0, bsRefAngle1, getINlength(bsRefAngle0), getINlength(bsRefAngle1))
    if (switchC) {
        angleGKI = bisectionSolver(getINlength, bsRefAngle0, bsRefAngle1); // Neusis
    }
    let I = K.clone()
        .addScaledVector(e_x, (radiusABGD/Math.cos(angleGKI))*Math.sin(angleAKQ+angleGKI))
        .addScaledVector(e_y, (radiusABGD/Math.cos(angleGKI))*Math.cos(angleAKQ+angleGKI));
    let N = I.clone()
        .addScaledVector(I.clone().sub(K), ratioDistortIN*ratioLengthGM*Math.cos(angleGKI));
    let IN = [I, N];
    let KN = [K, N];
    let E = K.clone()
        .addScaledVector(I.clone().sub(K), Math.cos(angleGKI)*Math.cos(angleAKQ)/Math.cos(angleAKQ+angleGKI));
    let GE = [G, E];
    let CI = [C, I]; let KE = [K, E]; let IL = [I, L];
    let KI = [K, I];
    angleBKQ = (1-switchB)*angleBKQ + switchB*(angleAKQ-angleGKI);
    let CG = [C, G];
    let B = K.clone()
        .addScaledVector(e_x, radiusABGD*Math.sin(angleBKQ))
        .addScaledVector(e_y, radiusABGD*Math.cos(angleBKQ));
    let KB = [K, B];
    let IG = [I, G];
    let BE = [B, E];
    let result = [
        K, A, B, G, Q, L, C, M, I, N, E,
        Z, H, AG, GQ, QK, GK, GL, KL, CL, GM, IN, KN, CI, KE, GE, IL, KI, CG, KB, IG, BE, 
        ABGD, KLC
    ]
    return result;
}

export {calculateGeometry};