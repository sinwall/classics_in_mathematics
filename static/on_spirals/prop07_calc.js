import {e_x, e_y, origin} from "/static/construction.js"
import { bisectionSolver } from "/static/analysis.js";

function calculateGeometry(params) {
    let {
        radius, angleSecant, posPerp, 
        ratioLongerLength, ratioLongerPos, ratioShorterLength, ratioShorterPos,
        ratioL, switchIN, ratioAngleI, ratioN, ratioRightEnd, ratioLeftTail
    } = params;
    let K = origin.clone();
    let A = K.clone()
        .addScaledVector(e_x, -radius*Math.sin(angleSecant*0.5*Math.PI))
        .addScaledVector(e_y, radius*Math.cos(angleSecant*0.5*Math.PI));
    // let B = K.clone()
    //     .addScaledVector(e_x, radius*Math.sin(angleSecant*(ratioAngleInter-0.5)*Math.PI))
    //     .addScaledVector(e_y, radius*Math.cos(angleSecant*(ratioAngleInter-0.5)*Math.PI));
    let G = K.clone()
        .addScaledVector(e_x, radius*Math.sin(angleSecant*0.5*Math.PI))
        .addScaledVector(e_y, radius*Math.cos(angleSecant*0.5*Math.PI));
    let AG = [A, G]
    let ABG = [K, radius]
    let Q = A.clone()
        .addScaledVector(G.clone().sub(A), posPerp)
    let longerBottom = K.clone()
        .addScaledVector(e_x, -radius*ratioLongerPos)
        .addScaledVector(e_y, -0.5*radius*ratioLongerLength);
    let longerTop = longerBottom.clone()
        .addScaledVector(e_y, radius*ratioLongerLength);
    let shorterBottom = K.clone()
        .addScaledVector(e_x, -radius*ratioShorterPos)
        .addScaledVector(e_y, -0.5*radius*ratioShorterLength);
    let shorterTop = shorterBottom.clone()
        .addScaledVector(e_y, radius*ratioShorterLength);
    let Z = [longerBottom, longerTop];
    let H = [shorterBottom, shorterTop]; 
    let GQ = [G, Q];
    let QK = [Q, K];
    let KG = [K, G];
    let L = K.clone()
        .addScaledVector(e_x, ratioL*radius*(1/Math.sin(angleSecant*0.5*Math.PI)))
    let GL = [G, L];
    let halfAKG = angleSecant*0.5*Math.PI;
    let halfGKI = 0;
    let INlength = radius*(ratioShorterLength/ratioLongerLength);
    function getINlength(halfGKI) {
        return Math.cos(halfAKG)/Math.sin(halfAKG+halfGKI) - 2*Math.sin(halfGKI) - INlength/radius;
    }
    if (switchIN) {halfGKI = bisectionSolver(getINlength, 0, 0.5*Math.PI-halfAKG);}
    halfGKI = (1-switchIN)*ratioAngleI*halfAKG + switchIN*halfGKI
    let I = K.clone()
        .addScaledVector(e_x, radius*Math.sin(halfAKG+halfGKI*2))
        .addScaledVector(e_y, radius*Math.cos(halfAKG+halfGKI*2));
    let N = K.clone()
        .addScaledVector(e_x, (ratioN*(1-switchIN) + switchIN)*radius*(Math.sin(halfAKG) + Math.cos(halfAKG)/Math.tan(halfAKG+halfGKI)));
    // let N = K.clone()
    //     .addScaledVector(e_x, radius*ratioRightEnd)
    let GN = [G, N];
    let leftTail = K.clone()
        .addScaledVector(e_x, -radius*ratioLeftTail)
    let KL = [leftTail, L];
    let IN = [I, N];
    let E = I.clone().multiplyScalar(A.getComponent(1)/I.getComponent(1));
    let KE = [K, E]; 
    let GE = [G, E];
    let EI = [E, I];
    let IG = [I, G];
    let result = [
        K, A, G, Q, L, I, N, E,
        Z, H, GQ, QK, KG, GL, AG, GN, IN, KL, KE, GE, EI, IG,
        ABG,
    ]
    return result;

}

export {calculateGeometry};