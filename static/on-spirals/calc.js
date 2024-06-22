import {newVector, newCircle, newSpiral} from "/static/construction.js"
// import {e_x, e_y, origin} from "/static/construction.js"
import { bisectionSolver, degCos, degSin, degTan } from "/static/analysis.js";

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
            ABG: newCircle(K, radius), 
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
            ABG:newCircle(K, radius),
        }
        return result;
    
    },
    Prop07: function (params) {
        let {
            radius, angleAKQ, posPerp, 
            ratioLengthZ, ratioPosZ, ratioLengthH, ratioPosH,
            ratioL, switchIN, ratioAngleI, ratioN, ratioRightEnd, ratioLeftTail
        } = params;
        let K = newVector();
        let A = K.shiftPolar(radius, 90+angleAKQ);
        let G = K.shiftPolar(radius, 90-angleAKQ);
        let Q = A.toward(G, posPerp);
        let Zbot = K.shift(-radius*ratioPosZ, -0.5*radius*ratioLengthZ);
        let Ztop = Zbot.shift(0, radius*ratioLengthZ);
        let Hbot = K.shift(-radius*ratioPosH, -0.5*radius*ratioLengthH);
        let Htop = Hbot.shift(0, radius*ratioLengthH);
        let L = K.shift(ratioL*radius/degSin(angleAKQ));

        let halfGKI = 0;
        let INlength = radius*(ratioLengthH/ratioLengthZ);
        function getINlength(halfGKI) {
            return degCos(angleAKQ)/degSin(angleAKQ+halfGKI) - 2*degSin(halfGKI) - INlength/radius;
        }
        if (switchIN) {halfGKI = bisectionSolver(getINlength, 0, 90-angleAKQ);}
        halfGKI = (1-switchIN)*ratioAngleI*angleAKQ + switchIN*halfGKI

        let I = K.shiftPolar(radius, 90-(angleAKQ + halfGKI*2));
        let N = K.shift((ratioN*(1-switchIN) + switchIN)*radius*(degSin(angleAKQ) + degCos(angleAKQ)/degTan(angleAKQ+halfGKI)));
        let leftTail = K.shift(-radius*ratioLeftTail);
        let E = K.toward(I, A.y/I.y);
        let result = {
            K, A, G, Q, L, I, N, E,
            Z:[Zbot,Ztop], H:[Hbot,Htop], AQ:[A,Q], GQ:[G,Q], QK:[Q,K], KG:[K,G], GL:[G,L], GN:[G,N], IN:[I,N], 
            KL:[leftTail, L], KE:[K,E], GE:[G,E], EI:[E,I], IG:[I,G],
            ABG:newCircle(K,radius),
        }
        return result;
    
    },
    Prop08: function (params) {
        let {
            radius, angleAKQ, angleBKQ, ratioLengthCG, 
            ratioPosZ, ratioLengthZ, ratioPosH, ratioLengthH, ratioSmallerRatio,
            switchKLleft, switchC, ratioDistortIN, switchB
        } = params;
        let K = newVector();
        let A = K.shiftPolar(radius, 90+angleAKQ);
        let G = K.shiftPolar(radius, 90-angleAKQ);
        let L = K.shift(radius/degSin(angleAKQ));
        let Q = A.toward(G, 0.5);
        
        ratioLengthZ = Math.min(ratioLengthZ, degTan(angleAKQ)*ratioLengthH*ratioSmallerRatio);
        let Zbot = K.shift(-radius*ratioPosZ, -0.5*radius*ratioLengthZ);
        let Ztop = Zbot.shift(0, radius*ratioLengthZ);
        let Hbot = K.shift(-radius*ratioPosH, -0.5*ratioLengthH*radius);
        let Htop = Hbot.shift(0, radius*ratioLengthH);
        let KLleft = K.shift(-radius*switchKLleft);

        let ratioLengthGL = 1/degTan(angleAKQ);
        ratioLengthCG = (1-switchC)*ratioLengthCG + (switchC)*(ratioLengthH/ratioLengthZ);
        let C = G.shiftPolar(radius*ratioLengthCG, 180-angleAKQ);
        let CLmid = L.toward(C, 0.5);

        let ratioLengthGM = ratioLengthGL*ratioLengthCG;
        let ratioDistCLToCenter = (ratioLengthGM - 1) / 2;
        let centerKLC = CLmid.add(G.sub(K).dilate(ratioDistCLToCenter));
        let radiusKLC = centerKLC.distTo(K);
        let M = G.toward(K, -ratioLengthGM);

        let angleGKI = 0;
        function getINlength(angleGKI) {
            let ratioLengthCI = ratioLengthCG - degTan(angleGKI);
            let ratioLengthIL = ratioLengthGL + degTan(angleGKI);
            return ratioLengthCI*ratioLengthIL - ratioDistortIN*ratioLengthGM/degCos(angleGKI);
        }
        let bsRefPt = centerKLC.add(G.sub(K).dilate(radiusKLC))
        let bsRefAngle0 = M.sub(K).angleTo(bsRefPt.sub(K));
        let bsRefAngle1 = M.sub(K).angleTo(C.sub(K));
        if (switchC) {
            angleGKI = bisectionSolver(getINlength, bsRefAngle0, bsRefAngle1); // Neusis
        }
        let I = K.shiftPolar(radius/degCos(angleGKI), 90-(angleAKQ-angleGKI));
        let N = I.toward(K, -ratioDistortIN*ratioLengthGM*degCos(angleGKI));
        let E = K.toward(I, degCos(angleGKI)*degCos(angleAKQ)/degCos((angleAKQ-angleGKI)));
        angleBKQ = (1-switchB)*angleBKQ + switchB*(angleAKQ-angleGKI);
        let B = K.shiftPolar(radius, 90-angleBKQ);
        let result = {
            K, A, B, G, Q, L, C, M, I, N, E,
            Z:[Zbot,Ztop], H:[Hbot,Htop], AG:[A,G], GQ:[G,Q], QK:[Q,K], GK:[G,K], GL:[G,L], 
            KL:[KLleft,L], CL:[C,L], GM:[G,M], IN:[I,N], KN:[K,N], CI:[C,I], KE:[K,E], IL:[I,L], KI:[K,I], 
            CG:[C,G], KB:[K,B], IG:[I,G], BE:[B,E], 
            ABGD:newCircle(K, radius), KLC:newCircle(centerKLC, radiusKLC)
        }
        return result;
    },
    Prop09: function (params) {
        let {
            radiusABGD, angleAKQ, angleBKQ, ratioLengthCG, 
            ratioPosZ, ratioLengthZ, ratioPosH, ratioLengthH, ratioBiggerRatio,
            switchKLleft, switchC, ratioDistortIN, switchB
        } = params;
        let K = newVector();
        let A = K.shiftPolar(radiusABGD, 90+angleAKQ);
        let G = K.shiftPolar(radiusABGD, 90-angleAKQ);
        let ABGD = newCircle(K, radiusABGD);
        let L = K.shift(radiusABGD/degSin(angleAKQ));
        let Q = A.toward(G, 0.5);
        ratioLengthZ = Math.max(ratioLengthZ, degTan(angleAKQ)*ratioLengthH*ratioBiggerRatio);
        let Zbot = K.shift(-radiusABGD*ratioPosZ, -0.5*radiusABGD*ratioLengthZ);
        let Ztop = Zbot.shift(0, radiusABGD*ratioLengthZ);
        let Hbot = K.shift(-radiusABGD*ratioPosH, -0.5*radiusABGD*ratioLengthH);
        let Htop = Hbot.shift(0, radiusABGD*ratioLengthH);
        let KLleft = K.shift(-radiusABGD*switchKLleft);
        let KL = [KLleft, L];
        let ratioLengthGL = 1/degTan(angleAKQ);
        ratioLengthCG = (1-switchC)*ratioLengthCG + (switchC)*(ratioLengthH/ratioLengthZ);
        let C = G.shiftPolar(radiusABGD*ratioLengthCG, 180-angleAKQ);
        let CLmid = L.toward(C, 0.5);
        let ratioLengthGM = ratioLengthGL*ratioLengthCG;
        let ratioDistCLToCenter = (ratioLengthGM - 1) / 2;
        let centerKLC = CLmid.add(G.sub(K).dilate(ratioDistCLToCenter));
        let radiusKLC = centerKLC.distTo(K)
        let KLC = newCircle(centerKLC, radiusKLC);
        let M = G.toward(K, -ratioLengthGM);

        let angleGKI = 0;
        function getINlength(angleGKI) {
            let ratioLengthCI = ratioLengthCG + degTan(angleGKI);
            let ratioLengthIL = ratioLengthGL - degTan(angleGKI);
            return ratioLengthCI*ratioLengthIL - ratioDistortIN*ratioLengthGM/degCos(angleGKI);
        }
        let bsRefPt = centerKLC.add(G.sub(K).dilate(radiusKLC));
        let bsRefAngle0 = M.sub(K).angleTo(bsRefPt.sub(K));
        let bsRefAngle1 = M.sub(K).angleTo(L.sub(K));
        if (switchC) {
            angleGKI = bisectionSolver(getINlength, bsRefAngle0, bsRefAngle1); // Neusis
        }
        let I = K.shiftPolar((radiusABGD/degCos(angleGKI)), 90-(angleAKQ+angleGKI));
        let N = I.toward(K, -ratioDistortIN*ratioLengthGM*degCos(angleGKI));
        let E = K.toward(I, degCos(angleGKI)*degCos(angleAKQ)/degCos(angleAKQ+angleGKI));
        angleBKQ = (1-switchB)*angleBKQ + switchB*(angleAKQ-angleGKI);
        let B = K.shiftPolar(radiusABGD, 90-angleBKQ);

        let result = {
            K, A, B, G, Q, L, C, M, I, N, E,
            Z:[Zbot,Ztop], H:[Hbot,Htop], AG:[A,G], GQ:[G,Q], QK:[Q,K], GK:[G,K], GL:[G,L], KL, CL:[C,L], GM:[G,M], 
            IN:[I,N], KN:[K,N], CI:[C,I], KE:[K,E], GE:[G,E], IL:[I,L], KI:[K,I], CG:[C,G], KB:[K,B], IG:[I,G], BE:[B,E], 
            ABGD, KLC
        };
        return result;
    },

    Prop10: function(params) {
        let {
            lengthA, lengthBetweenLines
        } = params;
        let lengthQ = lengthA / 8;
        let Abot = newVector();
        let Bbot = Abot.shift(lengthBetweenLines);
        let Gbot = Bbot.shift(lengthBetweenLines);
        let Dbot = Gbot.shift(lengthBetweenLines);
        let Ebot = Dbot.shift(lengthBetweenLines);
        let Zbot = Ebot.shift(lengthBetweenLines);
        let Hbot = Zbot.shift(lengthBetweenLines);
        let Qbot = Hbot.shift(lengthBetweenLines);

        let Atop = Abot.shift(0, lengthA);
        let Itop = Atop.shift(lengthBetweenLines);
        let Ktop = Itop.shift(lengthBetweenLines);
        let Ltop = Ktop.shift(lengthBetweenLines);
        let Mtop = Ltop.shift(lengthBetweenLines);
        let Ntop = Mtop.shift(lengthBetweenLines);
        let Xtop = Ntop.shift(lengthBetweenLines);
        let Otop = Xtop.shift(lengthBetweenLines);

        let Btop = Itop.shift(0, -lengthQ);
        let Gtop = Btop.shift(lengthBetweenLines, -lengthQ);
        let Dtop = Gtop.shift(lengthBetweenLines, -lengthQ);
        let Etop = Dtop.shift(lengthBetweenLines, -lengthQ);
        let Ztop = Etop.shift(lengthBetweenLines, -lengthQ);
        let Htop = Ztop.shift(lengthBetweenLines, -lengthQ);
        let Qtop = Htop.shift(lengthBetweenLines, -lengthQ);

        let result = {A:[Abot,Atop], 
            B:[Bbot,Btop], G:[Gbot,Gtop], D:[Dbot,Dtop], E:[Ebot,Etop], Z:[Zbot,Ztop], H:[Hbot,Htop], Q:[Qbot,Qtop],
            I:[Btop,Itop], K:[Gtop,Ktop], L:[Dtop,Ltop], M:[Etop,Mtop], N:[Ztop,Ntop], X:[Htop,Xtop], O:[Qtop,Otop],
            Btop, Gtop, Dtop, Etop, Ztop, Htop, Qtop
        };
        return result;
    },

    Prop12: function(params) {
        let {
            radius, angleSpiralEnd, angleSpiralRotation, angleB, angleG
        } = params;
        let A = newVector();
        let spiral = newSpiral(A, radius, 0, angleSpiralEnd, angleSpiralRotation);
        let B = A.shiftPolar(radius*angleB/360, angleB+angleSpiralRotation);
        let G = A.shiftPolar(radius*angleG/360, angleG+angleSpiralRotation);
        let angleD = angleG + (angleG - angleB);
        let D = A.shiftPolar(radius*angleD/360, angleD+angleSpiralRotation);
        let angleE = angleG + 2*(angleG-angleB);
        let E = A.shiftPolar(radius*angleE/360, angleE+angleSpiralRotation);
        let angleZ = angleG + 3*(angleG-angleB);
        let Z = A.shiftPolar(radius*angleZ/360, angleZ+angleSpiralRotation);

        let result = {
            A, B, G, D, E, Z,
            AB:[A,B], AG:[A,G], AD:[A,D], AE:[A,E], AZ:[A,Z],
            spiral,
        };
        return result;
    },

    Prop13: function(params) {
        let {
            radius, angleSpiralEnd, angleSpiralRotation, angleG, angleH,
            lengthZE
        } = params;
        let A = newVector();
        let spiral = newSpiral(A, radius, 0, angleSpiralEnd, angleSpiralRotation);
        let B = A.shiftPolar(radius*0.5*angleG/360, (0.5*angleG+angleSpiralRotation));
        let G = A.shiftPolar(radius*angleG/360, (angleG+angleSpiralRotation));
        let D = A.shiftPolar(radius*1.5*angleG/360, (1.5*angleG+angleSpiralRotation));
        let H = A.shiftPolar(radius*angleH/360, (angleH+angleSpiralRotation));
        let angleQ = (angleG + angleH)/2
        let Q = A.shiftPolar(radius*angleQ/360, (angleQ+angleSpiralRotation));
        let Z = G.toward(H, 0.5+0.5*lengthZE/G.distTo(H));
        let E = H.toward(G, 0.5+0.5*lengthZE/G.distTo(H));
        let ratioCut = 4*(angleG*angleH)*degCos(angleQ-angleG) / ((angleG + angleH)**2);
        let cut = A.toward(Q, ratioCut);
        let result = {
            A, B, G, D, H, Z, E, Q, cut,
            AG:[A,G], AH:[A,H], ZE:[Z,E], AQ:[A,Q],
            spiral,
        };
        return result;
    }, 
    Prop14: function (params) {
        let {
            radius, angleSpiralRotation, angleD, angleE, angleQ,
        } = params;
        let A = newVector();
        let spiral = newSpiral(A, radius, 0, -360, angleSpiralRotation);
        let circle = newCircle(A, radius, 0, 360, 180+angleSpiralRotation);
        let D = spiral.pick(angleD);
        let H = circle.pick(angleD);
        let E = spiral.pick(angleE);
        let angleEm = Math.max(angleE, angleQ+360);
        let Em = spiral.pick(angleEm);
        let Z = circle.pick(angleE);
        let angleDm = Math.max(angleD, angleQ+720);
        let Dm = spiral.pick(angleDm);
        let Q = spiral.pick(-360);
        let QKZ = newCircle(A, radius, 0, angleEm, angleSpiralRotation);
        let QKH = newCircle(A, radius, 0, angleDm, angleSpiralRotation);

        let result = {
            A, D, E, Z, H, Q, 
            AQ: [A, Q], AZ:[A,Z], AH:[A,H], AEm:[A,Em], ADm:[A,Dm],
            circle, QKZ, QKH,
            spiral,
        };
        return result;
    },
    Prop15: function (params) {
        let {
            radius, angleSpiralRotation, angleG, angleD, angleL, angleE, angleQ,
        } = params;

        let A = newVector();
        let circle = newCircle(A, radius, 0, 360, 180+angleSpiralRotation);
        let spiral = newSpiral(A, radius, 0, -720, angleSpiralRotation);
        let G = spiral.pick(angleG);
        let D = spiral.pick(angleD);
        let Q = circle.pick(angleQ);
        let Z = circle.pick(angleL);
        let H = circle.pick(angleE);
        let M = spiral.pick(-720);
        let L = spiral.pick(angleL);
        let E = spiral.pick(angleE);
        
        let angleEm = Math.max(angleE+360, angleQ+360);
        let Em = spiral.pick(angleEm);
        let angleLm = Math.max(angleL+360, angleQ+720);
        let Lm = spiral.pick(angleLm);

        let QKZ = newCircle(A, radius, 0, angleEm, angleSpiralRotation)
        let QKH = newCircle(A, radius, 0, angleLm, angleSpiralRotation)

        let result = {
            A, G, D, M, L, E, Z, H, Q, 
            AQ: [A, Q], AZ:[A,Z], AH:[A,H], AEm:[A,Em], ALm:[A,Lm],
            circle, QKZ, QKH,
            spiral,
        };
        return result;
    },
    Prop18: function (params) {
        let {
            radius, angleSpiralRotation, angleB, angleG, angleD, angleH, 
            ratioLA, ratioQN, ratioMQ, caseNum,
        } = params;
        let A = newVector();

        let circle = newCircle(A, radius, 0, 360, 180+angleSpiralRotation);
        let spiral = newSpiral(A, radius, 0, -400, angleSpiralRotation);
        let B = spiral.pick(angleB);
        let G = spiral.pick(angleG);
        let D = spiral.pick(angleD);
        let Q = spiral.pick(-360);

        let H = A.shiftPolar(radius, angleH);
        let Z = A.shiftPolar(-radius*2*Math.PI, angleSpiralRotation+90);
        let N = Z.toward(Q, 1+ratioQN);

        let L = A.toward(Z, ratioLA);
        let QHmid = Q.toward(H, 0.5);

        let P = newVector();
        N = Z.toward(Q, 1+ratioQN);
        if (caseNum >= 1) {
            N = QHmid;
        }
        let R = A.toward(N, radius/A.distTo(N));
        let angleQAR = Q.sub(A).angleTo(R.sub(A));
        let QRarc = newCircle(A, radius, 90-angleQAR, 90);
        let X = A.shiftPolar(radius*(-360-angleQAR)/360, -angleQAR+angleSpiralRotation);

        let M = Q.add(Z.sub(A).dilate(ratioMQ))
        if (caseNum >= 1) {
            P = A.toward(R, (radius/A.distTo(N)));
        }

        let result = {
            A,B,G,D,H,Q,Z,L, N,R, X, M, P,
            AZ:[A,Z], AQ:[A,Q], ZN:[Z,N], LA:[A,L], ZL:[Z,L], QQHmid:[Q,QHmid], AQHmid:[A,QHmid],
            NR:[N,R], AR:[A,R], QR:[Q,R], XR:[X,R],
            MP:[M,P], QP:[Q,P], ZQ:[Z,Q],
            QRarc, 
            circle, spiral,
        };
        return result;
    }
}

export {calculations};