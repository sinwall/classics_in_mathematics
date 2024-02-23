import {e_x, e_y, origin} from "/static/construction.js"

function calculateGeometry(params) {
    let {
        aspectRatio, lengthUpperInit, lengthRatioInit, 
        posMiddleUpper, posMiddleLower, ratioLeftInit, ratioRightInit,
        velocityInverse} = params;
    let A = origin.clone();
    let B = A.clone().addScaledVector(e_x, lengthUpperInit);
    let D = A.clone().addScaledVector(e_x, (lengthUpperInit*posMiddleUpper));
    let C = D.clone().addScaledVector(e_x, -ratioLeftInit*D.distanceTo(A));
    let E = D.clone().addScaledVector(e_x, ratioRightInit*D.distanceTo(B));

    let F = A.clone().addScaledVector(e_y, -lengthUpperInit / aspectRatio);
    let G = F.clone().addScaledVector(e_x, lengthUpperInit);
    let I = F.clone().addScaledVector(e_x, lengthUpperInit*posMiddleLower);
    let H = I.clone().addScaledVector(e_x, -lengthRatioInit*C.distanceTo(D));
    let J = I.clone().addScaledVector(e_x, lengthRatioInit*E.distanceTo(D));

    let midpt = A.clone()
        .add(B)
        .multiplyScalar(0.5)
        .addScaledVector(e_y, -2*lengthUpperInit/aspectRatio);
    let M = midpt.clone().addScaledVector(e_x, -C.distanceTo(E)*velocityInverse/2);
    let X = M.clone().addScaledVector(e_x, C.distanceTo(E)*velocityInverse);
    let N = M.clone().addScaledVector(e_x, M.distanceTo(X)*C.distanceTo(D)/C.distanceTo(E));

    let datas = [
        A,B,C,D,E, F,G,H,I,J, M,X,N,
        [A,B], [C,D], [D,E],  [F,G], [H,I], [I,J],  [M, X], [M, N], [N,X]
    ]
    return datas;
}
export {calculateGeometry}