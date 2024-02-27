import {e_x, e_y, origin} from "/static/construction.js"
import { bisectionSolver } from "/static/analysis.js";

function calculateGeometry(params) {
    let {
        radius, angleAKQ, angleBKQ, ratioLengthCG, 
        ratioPosZ, ratioLengthZ, ratioPosH, ratioLengthH, ratioSmallerRatio,
        switchKLleft, switchC, ratioDistortIN, switchB
    } = params;
    angleAKQ *= Math.PI / 180;
    angleBKQ *= Math.PI / 180;
    let K = origin();
    let A = K.clone()
        .addScaledVector(e_x, -radius*Math.sin(angleAKQ))
        .addScaledVector(e_y, radius*Math.cos(angleAKQ));
    let G = K.clone()
        .addScaledVector(e_x, radius*Math.sin(angleAKQ))
        .addScaledVector(e_y, radius*Math.cos(angleAKQ));
    let AG = [A, G];
    let ABGD = [K, radius];
    let L = K.clone()
        .addScaledVector(e_x, radius*(1/Math.sin(angleAKQ)));
    let Q = A.clone()
        .addScaledVector(G.clone().sub(A), 0.5);
    ratioLengthZ = Math.min(ratioLengthZ, Math.tan(angleAKQ)*ratioLengthH*ratioSmallerRatio);
    let Zbottom = K.clone()
        .addScaledVector(e_x, -radius*ratioPosZ)
        .addScaledVector(e_y, -0.5*radius*ratioLengthZ);
    let Ztop = Zbottom.clone()
        .addScaledVector(e_y, radius*ratioLengthZ);
    let Hbottom = K.clone()
        .addScaledVector(e_x, -radius*ratioPosH)
        .addScaledVector(e_y, -0.5*radius*ratioLengthH);
    let Htop = Hbottom.clone()
        .addScaledVector(e_y, radius*ratioLengthH);
    let Z = [Zbottom, Ztop];
    let H = [Hbottom, Htop]; 
    let GQ = [G, Q];
    let QK = [Q, K];
    let GK = [G, K];
    let GL = [G, L];
    let KLleft = K.clone()
        .addScaledVector(e_x, -radius*switchKLleft);
    let KL = [KLleft, L];
    let ratioLengthGL = 1/Math.tan(angleAKQ);
    ratioLengthCG = (1-switchC)*ratioLengthCG + (switchC)*(ratioLengthH/ratioLengthZ);
    let C = G.clone()
        .addScaledVector(e_x, -radius*ratioLengthCG*Math.cos(angleAKQ))
        .addScaledVector(e_y, radius*ratioLengthCG*Math.sin(angleAKQ));
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
        let ratioLengthCI = ratioLengthCG - Math.tan(angleGKI);
        let ratioLengthIL = ratioLengthGL + Math.tan(angleGKI);
        return ratioLengthCI*ratioLengthIL - ratioDistortIN*ratioLengthGM/Math.cos(angleGKI);
    }
    let bsRefPt = centerKLC.clone()
        .addScaledVector(G.clone().sub(K), KLC[1]);
    let bsRefAngle0 = M.clone().sub(K).angleTo(bsRefPt.clone().sub(K));
    let bsRefAngle1 = M.clone().sub(K).angleTo(C.clone().sub(K));
    if (switchC) {
        angleGKI = bisectionSolver(getINlength, bsRefAngle0, bsRefAngle1); // Neusis
    }
    let I = K.clone()
        .addScaledVector(e_x, (radius/Math.cos(angleGKI))*Math.sin((angleAKQ-angleGKI)))
        .addScaledVector(e_y, (radius/Math.cos(angleGKI))*Math.cos((angleAKQ-angleGKI)));
    let N = I.clone()
        .addScaledVector(I.clone().sub(K), ratioDistortIN*ratioLengthGM*Math.cos(angleGKI));
    let IN = [I, N];
    let KN = [K, N];
    let E = K.clone()
        .addScaledVector(I.clone().sub(K), Math.cos(angleGKI)*Math.cos(angleAKQ)/Math.cos((angleAKQ-angleGKI)));
    let CI = [C, I]; let KE = [K, E]; let IL = [I, L];
    let KI = [K, I];
    angleBKQ = (1-switchB)*angleBKQ + switchB*(angleAKQ-angleGKI);
    let CG = [C, G];
    let B = K.clone()
        .addScaledVector(e_x, radius*Math.sin(angleBKQ))
        .addScaledVector(e_y, radius*Math.cos(angleBKQ));
    let KB = [K, B];
    let IG = [I, G];
    let BE = [B, E];
    let result = {
        K, A, B, G, Q, L, C, M, I, N, E,
        Z, H, AG, GQ, QK, GK, GL, KL, CL, GM, IN, KN, CI, KE, IL, KI, CG, KB, IG, BE, 
        ABGD, KLC
    }
    return result;
}

export {calculateGeometry};