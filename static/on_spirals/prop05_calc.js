import {e_x, e_y, origin} from "/static/construction.js"

function calculateGeometry(params) {
    let {
        radius, angleLeftInit, ratioTangentLeft, ratioTangentRight,
        ratioLongerLength, ratioLongerPos, switchZ
    } = params;
    let K = origin();
    let B = K.clone().addScaledVector(e_y, radius);
    let A = K.clone()
        .addScaledVector(e_y, radius*Math.cos(angleLeftInit*Math.PI))
        .addScaledVector(e_x, -radius*Math.sin(angleLeftInit*Math.PI));
    let G = K.clone().addScaledVector(e_x, radius);
    let D = B.clone().
        addScaledVector(e_x, -radius*ratioTangentLeft);
    let Z = B.clone().
        addScaledVector(e_x, radius*ratioTangentRight);
    let DZ = [D, Z];
    let ECenter = K.clone()
        .addScaledVector(e_x, -radius*ratioLongerPos);
    let EBottom = ECenter.clone()
        .addScaledVector(e_y, -ratioLongerLength*radius/2);
    let ETop = ECenter.clone()
        .addScaledVector(e_y, +ratioLongerLength*radius/2);
    let E = [EBottom, ETop]; 
    let hxRatio = Math.sqrt(
        0.5*(2+(ratioLongerLength**2)+Math.sqrt(8*(ratioLongerLength**2)+(ratioLongerLength**4)))
    );
    let H = K.clone()
        .addScaledVector(e_x, radius*hxRatio);
    // let qyRatio = (hxRatio**2-1)/(hxRatio**2+1)
    let qyRatio = ratioLongerLength / Math.sqrt(1+hxRatio**2);
    let Q = K.clone()
        .addScaledVector(e_x, Math.sqrt(1-qyRatio**2)*radius)
        .addScaledVector(e_y, qyRatio*radius);
    let AH = [A, H];
    let BH = [B, H];
    let QHred = [Q, H];
    let Zafter = K.clone()
        .addScaledVector(e_x, Q.getComponent(0)/qyRatio)
        .addScaledVector(e_y, radius);
    Z = Z.addScaledVector(Zafter.sub(Z), switchZ);
    let KZ = [K, Z];
    let ABG = [K, radius];

    let entityDatas = {
        K, A,B,G,D, Z, H, Q,
        E, DZ, AH, BH, QHred, KZ,
        ABG, 
    };
    return entityDatas;

}

export {calculateGeometry};