import {e_x, e_y, origin} from "/static/construction.js"
import { bisectionSolver } from "/static/analysis.js";

function calculateGeometry(params) {
    let {
        radius, ratioAngleInter, angleSecant, posPerp, 
        ratioLongerLength, ratioLongerPos, ratioShorterLength, ratioShorterPos,
        ratioRightEnd, ratioLeftTail, switchN, ratioBNmagn
    } = params;
    let K = origin.clone();
    let halfAKG = angleSecant*0.5*Math.PI
    let A = K.clone()
        .addScaledVector(e_x, -radius*Math.sin(halfAKG))
        .addScaledVector(e_y, radius*Math.cos(halfAKG));
    let bnLength = ratioBNmagn*radius/(ratioLongerLength/ratioShorterLength)
    function getBNlength(halfBKG) {
        return radius*Math.cos(halfAKG-2*halfBKG)/Math.sin(halfAKG-halfBKG) - bnLength
    }
    let halfBKG = 0;
    if (switchN) { halfBKG = bisectionSolver(getBNlength, 0, 0.9*halfAKG); }
    let B = K.clone()
        .addScaledVector(e_x, radius*Math.sin((1-switchN)*angleSecant*(ratioAngleInter-0.5)*Math.PI + switchN*(halfAKG-2*halfBKG)))
        .addScaledVector(e_y, radius*Math.cos((1-switchN)*angleSecant*(ratioAngleInter-0.5)*Math.PI + switchN*(halfAKG-2*halfBKG)));
    let G = K.clone()
        .addScaledVector(e_x, radius*Math.sin(halfAKG))
        .addScaledVector(e_y, radius*Math.cos(halfAKG));
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
    let GQred = [G, Q]; let KQ = [K, Q];
    // let bx = B.getComponent(0); let by = B.getComponent(1);
    // let gx = G.getComponent(0); let gy = G.getComponent(1);
    // let nx = gx + (gx-bx)*gy/(by-gy);
    let N = K.clone()
        .addScaledVector(e_x, (1-switchN)*radius*ratioRightEnd + switchN*radius*Math.cos(halfBKG)/Math.sin(halfAKG-halfBKG))
    let leftTail = K.clone()
        .addScaledVector(e_x, -radius*ratioLeftTail)
    let KN = [leftTail, N];
    let L = K.clone().
        addScaledVector(e_x, radius*(1/Math.sin(angleSecant*0.5*Math.PI)))
    let KG = [K, G];
    let GL = [G, L]; 
    let BN = [B, N];
    let KB = [K, B];
    let E = B.clone().multiplyScalar(G.getComponent(1)/B.getComponent(1));
    let EBred = [E, B]; let GBblue = [G, B];
    let result = [
        K, A, B, G, Q, N, L, E,
        Z, H, KQ, GQred, AG, KN, KG, GL, BN, KB, EBred, GBblue,
        ABG,
    ]
    return result;

}

export {calculateGeometry};