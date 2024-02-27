import {e_x, e_y, origin} from "/static/construction.js"

function calculateGeometry(params) {
    let {
        aspectRatio, lengthUpperInit, lengthRatioInit, 
        posMiddleUpper, posMiddleLower, ratioLeftInit, ratioRightInit,
        velocityInverse} = params;
    let A = origin();
    let B = A.clone().addScaledVector(e_x, lengthUpperInit);
    let D = A.clone().addScaledVector(e_x, (lengthUpperInit*posMiddleUpper));
    let G = D.clone().addScaledVector(e_x, -ratioLeftInit*D.distanceTo(A));
    let E = D.clone().addScaledVector(e_x, ratioRightInit*D.distanceTo(B));

    let K = A.clone().addScaledVector(e_y, -lengthUpperInit / aspectRatio);
    let L = K.clone().addScaledVector(e_x, lengthUpperInit);
    let H = K.clone().addScaledVector(e_x, lengthUpperInit*posMiddleLower);
    let Z = H.clone().addScaledVector(e_x, -lengthRatioInit*G.distanceTo(D));
    let Q = H.clone().addScaledVector(e_x, lengthRatioInit*E.distanceTo(D));

    let midpt = A.clone()
        .add(B)
        .multiplyScalar(0.5)
        .addScaledVector(e_y, -2*lengthUpperInit/aspectRatio);
    let M = midpt.clone().addScaledVector(e_x, -G.distanceTo(E)*velocityInverse/2);
    let C = M.clone().addScaledVector(e_x, G.distanceTo(E)*velocityInverse);
    let N = M.clone().addScaledVector(e_x, M.distanceTo(C)*G.distanceTo(D)/G.distanceTo(E));

    let datas = {
        A,B,G,D,E, K,L,Z,H,Q, M,C,N,
        AB: [A,B], GD: [G,D], DE: [D,E], KL: [K,L], ZH: [Z,H], HQ: [H,Q], MC: [M, C], MN: [M, N], NC:[N,C]
    }
    return datas;
}
export {calculateGeometry}