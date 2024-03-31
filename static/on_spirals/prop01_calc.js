import {newVector, newList} from "/static/construction.js"

function calculateGeometry(params) {
    let {
        lengthGD, lengthDE, ratioAD, ratioBD,
        ratioLH, ratioHK,
        posHx, posHy, inverseVelocity, lockLK
    } = params;

    let D = newVector();
    let G = D.shift(-lengthGD);
    let E = D.shift(lengthDE);
    let A = D.toward(G, ratioAD);
    let B = D.toward(E, ratioBD);

    let H = D.shift(posHx, posHy);
    let Z = H.shift(-lengthGD*inverseVelocity);
    let Q = H.shift(lengthDE*inverseVelocity);
    let L = H.shift(-ratioLH*lengthGD*inverseVelocity)
        .toward(
            H.toward(Z, ratioAD),
            lockLK
        );
    let K = H.shift(ratioHK*lengthDE*inverseVelocity)
        .toward(
            H.toward(Q, ratioBD),
            lockLK
        );

    let ticksAD = [];
    for (let i=1; i<ratioAD; i++) {
        ticksAD.push(D.toward(G, i));
    }
    let ticksLH = [];
    for (let i=1; i<ratioLH; i++) {
        ticksLH.push(H.toward(Z, i));
    }
    let ticksDB = [];
    for (let i=1; i<ratioBD; i++) {
        ticksDB.push(D.toward(E, i));
    }
    let ticksHK = [];
    for (let i=1; i<ratioHK; i++) {
        ticksHK.push(H.toward(Q, i));
    }

    let datas = {
        A, B, G, D, E, Z, H, Q, K, L, 
        AG:[A,G], GD:[G,D], DE:[D,E], EB:[E,B],
        LZ:[L,Z], ZH:[Z,H], HQ:[H,Q], QK:[Q,K],
        ticksAD, ticksDB, ticksLH, ticksHK
    }

    return datas
}

export {calculateGeometry};