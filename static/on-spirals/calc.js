import {newVector} from "/static/construction.js"
import {e_x, e_y, origin} from "/static/construction.js"
import { bisectionSolver } from "/static/analysis.js";

let calculations = {
    Prop01: function (params) {
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
    },
    Prop02: function (params) {
        let {
            aspectRatio, lengthAB, ratioLength, 
            ratioPosD, ratioPosH, ratioLengthGD, ratioLengthDE,
            velocityInverse} = params;
        let A = newVector();
        let B = A.shift(lengthAB);
        let D = A.shift(lengthAB*ratioPosD);
        let G = D.shift(-ratioLengthGD*D.distTo(A));
        let E = D.shift(ratioLengthDE*D.distTo(B));
    
        let K = A.shift(0, -lengthAB / aspectRatio);
        let L = K.shift(lengthAB);
        let H = K.shift(lengthAB*ratioPosH);
        let Z = H.shift(-ratioLength*G.distTo(D));
        let Q = H.shift(ratioLength*E.distTo(D));
    
        let midpt = A.toward(B, 0.5)
            .shift(0, -2*lengthAB/aspectRatio);
        let M = midpt.shift(-G.distTo(E)*velocityInverse/2);
        let C = M.shift(G.distTo(E)*velocityInverse);
        let N = M.shift(M.distTo(C)*G.distTo(D)/G.distTo(E));
    
        let datas = {
            A,B,G,D,E, K,L,Z,H,Q, M,C,N,
            AB: [A,B], GD: [G,D], DE: [D,E], KL: [K,L], ZH: [Z,H], HQ: [H,Q], MC: [M, C], MN: [M, N], NC:[N,C]
        }
        return datas;
    },
    Prop05: function (params) {
        let {
            radius, angleAKB, ratioBD, ratioBZ,
            ratioLengthE, ratioLongerPos, switchZ
        } = params;
        let K = newVector();
        let B = K.shift(0, radius);
        let A = K.shift(-radius*Math.sin(angleAKB*Math.PI/180), radius*Math.cos(angleAKB*Math.PI/180));
        let G = K.shift(radius);
        let D = B.shift(-radius*ratioBD);
        let Z = B.shift(radius*ratioBZ);
        let ECenter = K.shift(-radius*ratioLongerPos);
        let EBottom = ECenter.shift(0, -ratioLengthE*radius/2);
        let ETop = ECenter.shift(0, +ratioLengthE*radius/2);
        let E = [EBottom, ETop]; 
        let hxRatio = Math.sqrt(
            0.5*(2+(ratioLengthE**2)+Math.sqrt(8*(ratioLengthE**2)+(ratioLengthE**4)))
        );
        let H = K.shift(radius*hxRatio);
        // let qyRatio = (hxRatio**2-1)/(hxRatio**2+1)
        let qyRatio = ratioLengthE / Math.sqrt(1+hxRatio**2);
        let Q = K.shift(Math.sqrt(1-qyRatio**2)*radius, qyRatio*radius);
        let Zafter = K.shift(Q.x/qyRatio, radius);
        Z = Z.toward(Zafter, switchZ);
    
        let entityDatas = {
            K, A,B,G,D, Z, H, Q,
            E, DZ:[D,Z], AH:[A,H], BQ:[B,Q], QH:[Q,H], KQ:[K,Q], QZ:[Q,Z],
            ABG: [K, radius], 
        };
        return entityDatas;   
    },
    Prop06: function (params) {
        let {
            radius, angleBKQ, angleAKQ, ratioPosQ, 
            ratioLengthZ, ratioPosZ, ratioLengthH, ratioPosH,
            ratioPosN, ratioLeftTail, switchN, ratioBNmagn
        } = params;
        let K = newVector();
        let A = K.shift(-radius*Math.sin(angleAKQ*Math.PI/180), radius*Math.cos(angleAKQ*Math.PI/180));
        let bnLength = ratioBNmagn*radius/(ratioLengthZ/ratioLengthH)
        function getBNlength(halfBKG) {
            return radius*Math.cos((angleAKQ-2*halfBKG)*Math.PI/180)/Math.sin((angleAKQ-halfBKG)*Math.PI/180) - bnLength
        }
        let halfBKG = 0;
        if (switchN) { halfBKG = bisectionSolver(getBNlength, 0, 0.9*angleAKQ); }
        let B = K.shift(
            radius*Math.sin(((1-switchN)*angleBKQ + switchN*(angleAKQ-2*halfBKG))*Math.PI/180), 
            radius*Math.cos(((1-switchN)*angleBKQ + switchN*(angleAKQ-2*halfBKG))*Math.PI/180)
        );
        let G = K.shift(radius*Math.sin(angleAKQ*Math.PI/180), radius*Math.cos(angleAKQ*Math.PI/180));
        let Q = A.toward(G, ratioPosQ)
        let Zbottom = K.shift(-radius*ratioPosZ, -0.5*radius*ratioLengthZ);
        let Ztop = Zbottom.shift(0, radius*ratioLengthZ);
        let Hbottom = K.shift(-radius*ratioPosH, -0.5*radius*ratioLengthH);
        let Htop = Hbottom.shift(0, radius*ratioLengthH);
        let N = K.shift((1-switchN)*radius*ratioPosN + switchN*radius*Math.cos(halfBKG*Math.PI/180)/Math.sin((angleAKQ-halfBKG)*Math.PI/180))
        let leftTail = K.shift(-radius*ratioLeftTail)
        let L = K.shift(radius*(1/Math.sin(angleAKQ*Math.PI/180)))
        let E = K.toward(B, G.y/B.y);
        let result = {
            K, A, B, G, Q, N, L, E,
            Z:[Zbottom, Ztop], H:[Hbottom, Htop], KQ:[K,Q], GQ:[G,Q], AQ:[A,Q], KN:[leftTail, N], 
            KG:[K,G], GL:[G,L], BN:[B,N], KB:[K,B], EB:[E,B], GB:[G,B],
            ABG:[K, radius],
        }
        return result;
    
    },
    Prop07: function (params) {
        let {
            radius, angleSecant, posPerp, 
            ratioLongerLength, ratioLongerPos, ratioShorterLength, ratioShorterPos,
            ratioL, switchIN, ratioAngleI, ratioN, ratioRightEnd, ratioLeftTail
        } = params;
        let K = origin();
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
        let result = {
            K, A, G, Q, L, I, N, E,
            Z, H, GQ, QK, KG, GL, AG, GN, IN, KL, KE, GE, EI, IG,
            ABG,
        }
        return result;
    
    },
    Prop08: function (params) {
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
    },
    Prop09: function (params) {
        let {
            radiusABGD, angleAKQ, angleBKQ, ratioLengthCG, 
            ratioPosZ, ratioLengthZ, ratioPosH, ratioLengthH, ratioBiggerRatio,
            switchKLleft, switchC, ratioDistortIN, switchB
        } = params;
        angleAKQ *= Math.PI/180;
        angleBKQ *= Math.PI/180;
        let K = origin();
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
        let result = {
            K, A, B, G, Q, L, C, M, I, N, E,
            Z, H, AG, GQ, QK, GK, GL, KL, CL, GM, IN, KN, CI, KE, GE, IL, KI, CG, KB, IG, BE, 
            ABGD, KLC
        };
        return result;
    }
}

export {calculations};