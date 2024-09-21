import {
    CameraSetting, DynamicDiagramConfiguration
} from '/static/structures.js'
import {newVector, newPoints as Points, newLine as Line, newCircle as Circle, newSpiral as Spiral} from "/static/construction.js"
import { bisectionSolver, degCos, degSin, degTan } from "/static/analysis.js";
import {
    newSequentialFX as Sequential, 
    newParallelFX as Parallel, 
    newShowingFX as Show,
    newHidingFX as Hide,
    newDrawingFX as Draw,
    newStyleChangeFX as ChangeStyle, 
    newParamChangeFX as ChangeParams,
    newCameraChangeFX as ChangeCamera,
} from '/static/effects.js'

let ddcs = {
    Prop01: new DynamicDiagramConfiguration(
        5,
        new CameraSetting(
            5, 
            0, -0.5, 0
        ),
        {
            lengthGD: 1.2,
            lengthDE: 0.7,
            ratioAD: 2.4,
            ratioBD: 1.5,
            ratioLH: 3.2,
            ratioHK: 2,
            posHx: 0.3,
            posHy: -1.3,
            inverseVelocity:0.75, 
            lockLK: 0,
        },
        function (params) {
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
            ticksAD = Points(ticksAD);
            let ticksLH = [];
            for (let i=1; i<ratioLH; i++) {
                ticksLH.push(H.toward(Z, i));
            }
            ticksLH = Points(ticksLH);
            let ticksDB = [];
            for (let i=1; i<ratioBD; i++) {
                ticksDB.push(D.toward(E, i));
            }
            ticksDB = Points(ticksDB);
            let ticksHK = [];
            for (let i=1; i<ratioHK; i++) {
                ticksHK.push(H.toward(Q, i));
            }
            ticksHK = Points(ticksHK);
        
            let datas = {
                A, B, G, D, E, Z, H, Q, K, L, 
                AG:[A,G], GD:[G,D], DE:[D,E], EB:[E,B], AB:[A,B],
                LZ:[L,Z], ZH:[Z,H], HQ:[H,Q], QK:[Q,K],
                ticksAD, ticksDB, ticksLH, ticksHK
            };
            return datas;
        },
         (e) => Sequential(
            Show(1, e.A),
            Draw(400, e.AB),
            Show(1, e.B),
            Show(200, e.G),
            Show(200, e.D),
            Show(200, e.E),
            Parallel(
                Show(200, e.L),
                Show(200, e.LZ),
                Show(200, e.ZH),
                Show(200, e.HQ),
                Show(200, e.QK),
                Show(200, e.K),
                Show(200, e.Z)
            ),
            Show(200, e.H),
            Show(200, e.Q),
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                ChangeParams(500, {ratioAD:3, ratioBD:4, ratioLH: 3, ratioHK: 4}),
                Parallel(
                    Show(200, e.ticksAD),
                    Show(200, e.ticksDB),
                ),
                Show(1, e.AG),
                Show(1, e.GD),
                Show(1, e.DE),
                Show(1, e.EB),
                Hide(1, e.AB),
                Parallel(
                    ChangeStyle(200, e.AG, 'red', 1.5),
                    ChangeStyle(200, e.GD, 'red', 1.5),
                    ChangeStyle(200, e.DE, 'blue', 1.5),
                    ChangeStyle(200, e.EB, 'blue', 1.5),
                )
            ),
            // 1 -> 2
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.AG, 'black', 1),
                    ChangeStyle(200, e.GD, 'black', 1),
                    ChangeStyle(200, e.DE, 'black', 1),
                    ChangeStyle(200, e.EB, 'black', 1),
                ),
                Show(200, e.ticksLH),
                Parallel(
                    ChangeStyle(200, e.ticksAD, 'red', 1.5),
                    ChangeStyle(200, e.ticksLH, 'red', 1.5),
                ),
                Show(200, e.ticksHK),
                Parallel(
                    ChangeStyle(200, e.ticksDB, 'blue', 1.5),
                    ChangeStyle(200, e.ticksHK, 'blue', 1.5),
                )
            ),
            // 2 -> 3
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.ticksAD, 'black', 1),
                    ChangeStyle(200, e.ticksLH, 'black', 1),
                    ChangeStyle(200, e.ticksDB, 'black', 1),
                    ChangeStyle(200, e.ticksHK, 'black', 1),
                ),
                Parallel(
                    ChangeStyle(200, e.LZ, 'red', 1.5),
                    ChangeStyle(200, e.ZH, 'red', 1.5),
                    ChangeStyle(200, e.HQ, 'blue', 1.5),
                    ChangeStyle(200, e.QK, 'blue', 1.5),
                )
            ),
            // 3 -> 4
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.LZ, 'black', 1),
                    ChangeStyle(200, e.ZH, 'black', 1),
                    ChangeStyle(200, e.HQ, 'black', 1),
                    ChangeStyle(200, e.QK, 'black', 1),
                ),
                Parallel(
                    ChangeParams(500, {ratioAD: 2.4, ratioBD: 1.5, ratioLH: 2, ratioHK: 5}),
                    Hide(200, e.ticksAD),
                    Hide(200, e.ticksDB)
                ),
                Parallel(
                    ChangeStyle(200, e.LZ, 'blue', 1.5),
                    ChangeStyle(200, e.ZH, 'blue', 1.5),
                    ChangeStyle(200, e.HQ, 'red', 1.5),
                    ChangeStyle(200, e.QK, 'red', 1.5),
                )
            ),
            // 4 -> 5
            (e) => Sequential(
                Parallel(
                    ChangeParams(500, {ratioAD: 2, ratioBD: 5}),
                    Show(200, e.ticksAD),
                    Show(200, e.ticksDB)
                ),
                Parallel(
                    ChangeStyle(200, e.ticksAD, 'red', 1.5),
                    ChangeStyle(200, e.ticksLH, 'red', 1.5),
                    ChangeStyle(200, e.ticksDB, 'blue', 1.5),
                    ChangeStyle(200, e.ticksHK, 'blue', 1.5),
                ),
                Parallel(
                    ChangeStyle(200, e.ticksAD, 'black', 1),
                    ChangeStyle(200, e.ticksLH, 'black', 1),
                    ChangeStyle(200, e.ticksDB, 'black', 1),
                    ChangeStyle(200, e.ticksHK, 'black', 1),
                ),
                Parallel(
                    ChangeStyle(200, e.AG, 'blue', 1.5),
                    ChangeStyle(200, e.GD, 'blue', 1.5),
                    ChangeStyle(200, e.DE, 'red', 1.5),
                    ChangeStyle(200, e.EB, 'red', 1.5),
                )
            )
        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', K:'Κ', L:'Λ', Z:'Ζ', H:'Η', Q:'Θ', 
        },
    ),
    Prop02: new DynamicDiagramConfiguration(
        4,
        new CameraSetting(
            5,
            2.5, -0.5, 0
        ),
        {
            aspectRatio: 3,
            lengthAB: 5,
            ratioLength: 1.2,
            ratioPosD: 0.5,
            ratioPosH: 0.7,
            ratioLengthGD: 0.3,
            ratioLengthDE: 0.3,
            velocityInverse: 1.3,
        },
        function (params) {
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
         (e) => Sequential(
            Parallel(
                Show(1, e.A),
                Show(1, e.K)
            ),
            Parallel(
                Draw(500, e.AB),
                Draw(500, e.KL),
            ),
            Parallel(
                Show(1, e.B),
                Show(1, e.L),
            ),
            Parallel(Show(200, e.G), Show(200, e.Z)),
            Parallel(Show(200, e.D), Show(200, e.H)),
            Parallel(Show(200, e.E), Show(200, e.Q)),
            Show(1, e.GD),
            Show(1, e.ZH),
            Parallel(
                ChangeStyle(500, e.GD, 'red', 1.5),
                ChangeStyle(500, e.ZH, 'red', 1.5),
            ),
            Parallel(
                ChangeStyle(500, e.GD, 'black', 1),
                ChangeStyle(500, e.ZH, 'black', 1),
            ),
            Show(1, e.DE),
            Show(1, e.HQ),
            Parallel(
                ChangeStyle(500, e.DE, 'blue', 1.5),
                ChangeStyle(500, e.HQ, 'blue', 1.5),
            ),
            Parallel(
                ChangeStyle(500, e.DE, 'black', 1),
                ChangeStyle(500, e.HQ, 'black', 1),
            ),
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Hide(1, e.GD),
                Hide(1, e.ZH),
                ChangeStyle(1, e.GD, 'red', 1.5),
                ChangeStyle(1, e.ZH, 'red', 1.5),
                Show(1, e.M),
                ChangeStyle(1, e.MN, 'red', 1.5),
                Parallel(
                    Draw(300, e.GD),
                    Draw(300, e.ZH),
                    Draw(300, e.MN),
                ),
                Show(1, e.N),
            ),
            // 1 -> 2
            (e) => Sequential(
                Hide(1, e.DE),
                Hide(1, e.HQ),
                ChangeStyle(1, e.DE, 'blue', 1.5),
                ChangeStyle(1, e.HQ, 'blue', 1.5),
                Show(1, e.N),
                ChangeStyle(1, e.NC, 'blue', 1.5),
                Parallel(
                    Draw(300, e.DE),
                    Draw(300, e.HQ),
                    Draw(300, e.NC)
                ),
                Show(1, e.C)
            ),
            // 2 -> 3
            (e) => Sequential(
                Parallel(
                    ChangeStyle(500, e.GD, 'black', 1),
                    ChangeStyle(500, e.ZH, 'black', 1),
                    ChangeStyle(500, e.MN, 'black', 1),
                    ChangeStyle(500, e.DE, 'black', 1),
                    ChangeStyle(500, e.HQ, 'black', 1),
                    ChangeStyle(500, e.NC, 'black', 1),
                ),
                Parallel(
                    ChangeStyle(500, e.GD, 'red', 1.5),
                    ChangeStyle(500, e.DE, 'DarkRed', 1.5),
                    ChangeStyle(500, e.MN, 'blue', 1.5),
                    ChangeStyle(500, e.NC, 'DarkBlue', 1.5),
                ),
            ),
            // 3 -> 4
            (e) => Sequential(
                Parallel(
                    ChangeStyle(500, e.GD, 'black', 1),
                    ChangeStyle(500, e.DE, 'black', 1),
                ),
                Parallel(
                    ChangeStyle(500, e.ZH, 'red', 1.5),
                    ChangeStyle(500, e.HQ, 'DarkRed', 1.5),
                ),
            ),

        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', K:'Κ', L:'Λ', Z:'Ζ', H:'Η', Q:'Θ', M:'Μ', C:'Ξ', N:'Ν',
        },
    ),
    Prop05: new DynamicDiagramConfiguration(
        4,
        new CameraSetting(
            6.3,
            1, 0, 0
        ),
        {
            radius: 2,
            angleAKB: 78,
            angleGivenArc: 120,
            ratioBD: 0.9,
            ratioBZ: 1.2,
            ratioLengthE: 3,
            ratioLongerPos: 2,
            switchZ: 0,
        },
        function (params) {
            let {
                radius, angleAKB, angleGivenArc, ratioBD, ratioBZ,
                ratioLengthE, ratioLongerPos, switchZ
            } = params;
            let K = newVector();
            let B = K.shift(0, radius);
            let A = K.shift(-radius*Math.sin(angleAKB*Math.PI/180), radius*Math.cos(angleAKB*Math.PI/180));
            let G = K.shift(radius);
            let D = B.shift(-radius*ratioBD);
            let Z = B.shift(radius*ratioBZ);
            let givenArcEnd = K.shiftPolar(radius, 90+angleGivenArc);
            let givenArc = Circle(K, radius, 90, 90+angleGivenArc);
    
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
                K, A,B,G,D, Z, H, Q, givenArcEnd,
                E, DZ:[D,Z], AH:[A,H], BQ:[B,Q], QH:[Q,H], KQ:[K,Q], QZ:[Q,Z],
                ABG: Circle(K, radius), 
                givenArc,
                BQarc: Circle(K, radius, G.sub(K).angleTo(Q.sub(K)), 90)
            };
            return entityDatas;   
        },
        (e) => Sequential(
            Show(200, e.A), 
            Show(200, e.B),
            Show(200, e.G),
            Draw(500, e.ABG),
            Show(200, e.K),
            Show(1, e.D),
            Draw(400, e.DZ),
            Show(1, e.Z),
            ChangeStyle(1, e.givenArc, 'green', 1.5),
            Draw(300, e.givenArc),
            Show(1, e.givenArcEnd),
            // Draw(400, e.E)
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Draw(400, e.E),
                Parallel(
                    ChangeStyle(200, e.E, 'red', 1.5),
                    ChangeStyle(200, e.givenArc, 'blue', 1.5),
                )
            ),
            // 1 -> 2
            (e) => Sequential(
                ChangeStyle(200, e.givenArc, 'green', 1.5),
                ChangeParams(400, {angleAKB: 90}),
                Draw(400, e.AH),
                Show(1, e.H),
                Draw(400, e.QH),
                Show(1, e.Q),
                Draw(200, e.BQ),
                Parallel(
                    ChangeStyle(200, e.E, 'red', 1.5),
                    ChangeStyle(200, e.QH, 'red', 1.5),
                )
            ),
            // 2 -> 3
            (e) => Sequential(
                Parallel(
                    ChangeParams(400, {switchZ: 1}),
                    Draw(400, e.KQ), 
                    ChangeStyle(200, e.E, 'black', 1),
                    ChangeStyle(200, e.QH, 'black', 1),
                ),
                Draw(200, e.QZ),
                Parallel(
                    ChangeStyle(200, e.QZ, 'red', 1.5),
                    ChangeStyle(200, e.KQ, 'DarkRed', 1.5),
                    ChangeStyle(200, e.BQ, 'blue', 1.5),
                    ChangeStyle(200, e.QH, 'DarkBlue', 1.5),
                )
            ),
            // 3 -> 4
            (e) => Sequential(
                Show(1, e.BQarc),
                Parallel(
                    ChangeStyle(200, e.BQ, 'black', 1),
                    ChangeStyle(200, e.BQarc, 'blue', 1.5),
                ),
                Parallel(
                    ChangeStyle(200, e.QH, 'black', 1),
                    ChangeStyle(200, e.givenArc, 'DarkBlue', 1.5)
                )
            )
        ],
        {
            K:'Κ', A:'Α', B:'Β', G:'Γ', D:'Δ', Z:'Ζ', H:'Η', Q:'Θ', E:'Ε', 
        },
    ),
    Prop06: new DynamicDiagramConfiguration(
        6,
        new CameraSetting(
            5,
            0, 0, 0
        ),
        {
            radius: 2,
            angleAKQ: 63,
            angleBKQ: 25,
            ratioPosQ: 0.5,
            ratioLengthZ: 4,
            ratioPosZ: 2,
            ratioLengthH: 3,
            ratioPosH: 1.5,
            ratioPosN: 2,
            ratioLeftTail: 0,
            switchN: 0,
            ratioBNmagn: 1,
        },
        function (params) {
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
                ABG:Circle(K, radius),
            }
            return result;
        
        },
        (e) => Sequential(
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            Draw(500, e.ABG),
            Show(200, e.K),
            Draw(200, e.AQ),
            Draw(200, e.GQ),
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Parallel(
                    Draw(400, e.Z),
                    Draw(400, e.H),
                ),
                Draw(200, e.KQ),
                Show(1, e.Q),
                Parallel(
                    ChangeStyle(200, e.Z, 'red', 1.5),
                    ChangeStyle(200, e.H, 'DarkRed', 1.5),
                    ChangeStyle(200, e.GQ, 'blue', 1.5),
                    ChangeStyle(200, e.KQ, 'DarkBlue', 1.5),
                ),
            ),
            // 1 -> 2
            (e) => Sequential(
                Parallel(
                    Sequential(
                        Draw(300, e.KN),
                        Show(1, e.N),
                        Draw(300, e.GL),
                        Show(1, e.L)
                    ),
                    ChangeStyle(200, e.Z, 'black', 1),
                    ChangeStyle(200, e.H, 'black', 1),
                    ChangeStyle(200, e.GQ, 'black', 1),
                    ChangeStyle(200, e.KQ, 'black', 1),
                    
                )
            ),
            // 2 -> 3
            (e) => Sequential(
                Draw(400, e.KG),
                Parallel(
                    ChangeStyle(200, e.GQ, 'red', 1.5),
                    ChangeStyle(200, e.KQ, 'DarkRed', 1.5),
                ),
                Parallel(
                    ChangeStyle(200, e.KG, 'blue', 1.5),
                    ChangeStyle(200, e.GL, 'DarkBlue', 1.5),
                )
            ),
            // 3 -> 4
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.GQ, 'black', 1),
                    ChangeStyle(200, e.KQ, 'black', 1),
                ),
                Parallel(
                    ChangeStyle(200, e.Z, 'red', 1),
                    ChangeStyle(200, e.H, 'DarkRed', 1),
                ),
                Parallel(
                    ChangeStyle(200, e.KG, 'blue', 1.5),
                    ChangeStyle(200, e.GL, 'DarkBlue', 1.5),
                )
            ),
            // 4 -> 5
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.GQ, 'black', 1),
                    ChangeStyle(200, e.KQ, 'black', 1),
                ),
                Parallel(
                    ChangeStyle(200, e.Z, 'red', 1.5),
                    ChangeStyle(200, e.H, 'DarkRed', 1.5),
                ),
                ChangeStyle(200, e.GL, 'black', 1),
                ChangeParams(400, {switchN: 1}),
                ChangeStyle(1, e.BN, 'DarkBlue', 1.5),
                Draw(500, e.BN),
                ChangeStyle(400, e.KG, 'black', 1),
                ChangeStyle(1, e.KB, 'blue', 1.5),
                Draw(400, e.KB),
            ),
            // 5 -> 6
            (e) => Sequential(
                Show(200, e.E),
                Parallel(
                    ChangeStyle(200, e.KB, 'black', 1),
                    ChangeStyle(200, e.BN, 'black', 1)
                ),
                Show(1, e.EB),
                Show(1, e.GB),
                Parallel(
                    ChangeStyle(200, e.EB, 'blue', 1.5),
                    ChangeStyle(200, e.GB, 'DarkBlue', 1.5)
                )

            )
        ],
        {
            K:'Κ', A:'Α', B:'Β', G:'Γ', Q:'Θ', N:'Ν', L:'Λ', E:'Ε', Z:'Ζ', H:'Η',
        },
    ),
    Prop07: new DynamicDiagramConfiguration(
        4,
        new CameraSetting(
            5,
            0, 0, 0
        ),
        {
            radius: 2,
            angleAKQ: 45,
            posPerp: 0.5,
            ratioLengthZ: 4,
            ratioPosZ: 2,
            ratioLengthH: 2.5,
            ratioPosH: 1.5,
            ratioL: 1,
            switchIN: 0,
            ratioAngleI: 0.25,
            ratioN: 1.,
            ratioRightEnd: 2,
            ratioLeftTail: 0,
        },
        function (params) {
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
                ABG:Circle(K,radius),
            }
            return result;
        },
         (e) => Sequential(
            Show(200, e.A),
            Show(200, e.G),
            Draw(500, e.ABG),
            Show(200, e.K),
            Draw(200, e.AQ),
            Draw(200, e.GQ),
            // Draw(200, e.GE),
            Draw(400, e.KL),
            Draw(400, e.GL),
            Show(1, e.L),
            Draw(400, e.KG)
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Parallel(
                    Draw(400, e.Z),
                    Draw(400, e.H),
                ),
                Draw(200, e.QK),
                Show(1, e.Q),
                Parallel(
                    ChangeStyle(200, e.Z, 'red', 1.5),
                    ChangeStyle(200, e.H, 'DarkRed', 1.5),
                    ChangeStyle(200, e.GQ, 'blue', 1.5),
                    ChangeStyle(200, e.QK, 'DarkBlue', 1.5),
                ),
            ),
            // 1 -> 2
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.GQ, 'black', 1),
                    ChangeStyle(200, e.QK, 'black', 1)
                ),
                Parallel(
                    ChangeStyle(200, e.KG, 'blue', 1.5),
                    ChangeStyle(200, e.GL, 'DarkBlue', 1.5)
                )
            ),
            // 2 -> 3
            (e) => Sequential(
                ChangeParams(300, {switchIN: 1}),
                Show(1, e.I),
                Draw(300, e.IG),
                Draw(300, e.IN),
                Show(1, e.N),
                ChangeStyle(200, e.GL, 'black', 1),
                ChangeStyle(200, e.IN, 'DarkBlue', 1.5)
            ),
            // 3 -> 4
            (e) => Sequential(
                Draw(300, e.GE),
                Show(1, e.E),
                Draw(400, e.KE),
                Show(1, e.EI),
                Show(1, e.IG),
                Parallel(
                    ChangeStyle(200, e.EI, 'blue', 1.5),
                    ChangeStyle(200, e.IG, 'DarkBlue', 1.5),
                ),
                Parallel(
                    ChangeStyle(200, e.KG, 'black', 1),
                    ChangeStyle(200, e.IN, 'black', 1)
                )
            ),

        ],
        {
            K:'Κ', A:'Α', G:'Γ', Q:'Θ', L:'Λ', I:'Ι', N:'Ν', E:'Ε', Z:'Ζ', H:'Η',
        },
    ),
    Prop08: new DynamicDiagramConfiguration(
        6,
        new CameraSetting(
            5,
            0, 0, 0
        ),
        {
            radius: 2,
            angleAKQ: 60,
            angleBKQ: 36,
            ratioLengthCG: 1.1,
            ratioPosZ: 2,
            ratioLengthZ: 4,
            ratioPosH: 1.5,
            ratioLengthH: 3.2,
            ratioSmallerRatio: 0.99,
            switchKLleft: 0,
            switchC: 0,
            ratioDistortIN: 1,
            switchB: 0,
        },
        function (params) {
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
                ABGD:Circle(K, radius), KLC:Circle(centerKLC, radiusKLC)
            }
            return result;
        },
        (e) => Sequential(
            Show(200, e.K),
            Draw(400, e.ABGD),
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            // Show(200, e.D),
            Draw(300, e.AG),
            Show(1, e.C),
            Draw(300, e.CL),
            // Show(1, e.L),
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Parallel(
                    Draw(300, e.Z),
                    Draw(300, e.H),
                ),
                Parallel(
                    ChangeStyle(200, e.Z, 'red', 1.5),
                    ChangeStyle(200, e.H, 'DarkRed', 1.5),
                ),
                Show(1, e.Q),
                Draw(200, e.QK),
                Show(1, e.GQ),
                Parallel(
                    ChangeStyle(200, e.GQ, 'blue', 1.5),
                    ChangeStyle(200, e.QK, 'DarkBlue', 1.5),
                ),
            ),
            // 1 -> 2
            (e) => Sequential(
                Draw(300, e.KL),
                Show(1, e.L),
                Draw(300, e.GK),
                Show(1, e.GL),
                Parallel(
                    ChangeStyle(200, e.GQ, 'black', 1),
                    ChangeStyle(200, e.QK, 'black', 1),
                    ChangeStyle(200, e.GK, 'blue', 1.5),
                    ChangeStyle(200, e.GL, 'DarkBlue', 1.5),
                ),
            ),
            // 2 -> 3
            (e) => Sequential(
                ChangeParams(300, {switchC: 1}),
                Show(1, e.CG),
                Parallel(
                    ChangeStyle(200, e.GL, 'black', 1),
                    ChangeStyle(200, e.CG, 'DarkBlue', 1.5),
                )
            ),
            // 3 -> 4
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.Z, 'black', 1),
                    ChangeStyle(200, e.H, 'black', 1),
                    ChangeStyle(200, e.GK, 'black', 1),
                    ChangeStyle(200, e.CG, 'black', 1)
                ),
                Draw(500, e.KLC), 
            ),
            // 4 -> 5
            (e) => Sequential(
                Draw(300, e.GM),
                Show(1, e.M),
                Draw(300, e.KI),
                Show(1, e.I),
                Draw(200, e.IN),
                Show(1, e.N),
                Parallel(
                    ChangeStyle(200, e.GM, 'red', 1.5),
                    ChangeStyle(200, e.IN, 'red', 1.5)
                )
            ),
            // 5 -> 6
            (e) => Sequential(
                Show(200, e.E),

            )
        ],
        {
            K:'Κ', A:'Α', B:'Β', G:'Γ', Q:'Θ', L:'Λ', C:'Ξ', M:'Μ', I:'Ι', N:'Ν', E:'Ε', Z:'Ζ', H:'Η'
        }
    ),
    Prop09: new DynamicDiagramConfiguration(
        5,
        new CameraSetting(
            5, 
            0, 0, 0
        ),
        {
            radiusABGD: 2,
            angleAKQ: 42,
            angleBKQ: 36,
            ratioLengthCG: 1.1,
            ratioPosZ: 2,
            ratioLengthZ: 4,
            ratioPosH: 1.5,
            ratioLengthH: 1.8,
            ratioBiggerRatio: 1.01,
            switchKLleft: 0,
            switchC: 0,
            ratioDistortIN: 1,
            switchB: 0,
        },
        function (params) {
            let {
                radiusABGD, angleAKQ, angleBKQ, ratioLengthCG, 
                ratioPosZ, ratioLengthZ, ratioPosH, ratioLengthH, ratioBiggerRatio,
                switchKLleft, switchC, ratioDistortIN, switchB
            } = params;
            let K = newVector();
            let A = K.shiftPolar(radiusABGD, 90+angleAKQ);
            let G = K.shiftPolar(radiusABGD, 90-angleAKQ);
            let ABGD = Circle(K, radiusABGD);
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
            let KLC = Circle(centerKLC, radiusKLC);
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
        (e) => Sequential(
            Show(200, e.K),
            Draw(400, e.ABGD),
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            // Show(200, e.D),
            Draw(300, e.AG),
            Show(1, e.C),
            Draw(300, e.CL),
            // Show(1, e.L),
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Parallel(
                    Draw(300, e.Z),
                    Draw(300, e.H),
                ),
                Parallel(
                    ChangeStyle(200, e.Z, 'red', 1.5),
                    ChangeStyle(200, e.H, 'DarkRed', 1.5),
                ),
                Show(1, e.Q),
                Draw(200, e.QK),
                Show(1, e.GQ),
                Parallel(
                    ChangeStyle(200, e.GQ, 'blue', 1.5),
                    ChangeStyle(200, e.QK, 'DarkBlue', 1.5),
                ),
            ),
            // 1 -> 2
            (e) => Sequential(
                Draw(300, e.KL),
                Show(1, e.L),
                Draw(300, e.GK),
                Show(1, e.GL),
                Parallel(
                    ChangeStyle(200, e.GQ, 'black', 1),
                    ChangeStyle(200, e.QK, 'black', 1),
                    ChangeStyle(200, e.GK, 'blue', 1.5),
                    ChangeStyle(200, e.GL, 'DarkBlue', 1.5),
                ),
            ),
            // 2 -> 3
            (e) => Sequential(
                ChangeParams(300, {switchC: 1}),
                Show(1, e.CG),
                Parallel(
                    ChangeStyle(200, e.GL, 'black', 1),
                    ChangeStyle(200, e.CG, 'DarkBlue', 1.5),
                )
            ),
            // 3 -> 4
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.Z, 'black', 1),
                    ChangeStyle(200, e.H, 'black', 1),
                    ChangeStyle(200, e.GK, 'black', 1),
                    ChangeStyle(200, e.CG, 'black', 1)
                ),
                Draw(500, e.KLC), 
            ),
            // 4 -> 5
            (e) => Sequential(
                Draw(300, e.GM),
                Show(1, e.M),
                Draw(300, e.KI),
                Show(1, e.I),
                Draw(200, e.IN),
                Show(1, e.N),
                Parallel(
                    ChangeStyle(200, e.GM, 'red', 1.5),
                    ChangeStyle(200, e.IN, 'red', 1.5)
                )
            ),
            // 5 -> 6
            (e) => Sequential(
                Show(200, e.E),

            )
        ],
        {
            K:'Κ', A:'Α', B:'Β', G:'Γ', Q:'Θ', L:'Λ', C:'Ξ', M:'Μ', I:'Ι', N:'Ν', E:'Ε', Z:'Ζ', H:'Η'
        }
    ),
    Prop10: new DynamicDiagramConfiguration(
        0,
        new CameraSetting(
            5,
            3.5, 4, 0
        ),
         {
            lengthA: 8,
            lengthBetweenLines: 1,
        },
        function(params) {
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
            let Ctop = Ntop.shift(lengthBetweenLines);
            let Otop = Ctop.shift(lengthBetweenLines);
    
            let Btop = Itop.shift(0, -lengthQ);
            let Gtop = Btop.shift(lengthBetweenLines, -lengthQ);
            let Dtop = Gtop.shift(lengthBetweenLines, -lengthQ);
            let Etop = Dtop.shift(lengthBetweenLines, -lengthQ);
            let Ztop = Etop.shift(lengthBetweenLines, -lengthQ);
            let Htop = Ztop.shift(lengthBetweenLines, -lengthQ);
            let Qtop = Htop.shift(lengthBetweenLines, -lengthQ);
    
            let result = {A:[Abot,Atop], 
                B:[Bbot,Btop], G:[Gbot,Gtop], D:[Dbot,Dtop], E:[Ebot,Etop], Z:[Zbot,Ztop], H:[Hbot,Htop], Q:[Qbot,Qtop],
                I:[Btop,Itop], K:[Gtop,Ktop], L:[Dtop,Ltop], M:[Etop,Mtop], N:[Ztop,Ntop], C:[Htop,Ctop], O:[Qtop,Otop],
                Btop, Gtop, Dtop, Etop, Ztop, Htop, Qtop
            };
            return result;
        },
         (e) => Sequential(
            Draw(300, e.A),
            Draw(300, e.B),
            Show(1, e.Btop),
            Draw(300, e.G),
            Show(1, e.Gtop),
            Draw(300, e.D),
            Show(1, e.Dtop),
            Draw(300, e.E),
            Show(1, e.Etop),
            Draw(300, e.Z),
            Show(1, e.Ztop),
            Draw(300, e.H),
            Show(1, e.Htop),
            Draw(300, e.Q),
            Show(1, e.Qtop),

            Draw(300, e.I),
            Draw(300, e.K),
            Draw(300, e.L),
            Draw(300, e.M),
            Draw(300, e.N),
            Draw(300, e.C),
            Draw(300, e.O),

        ),
         [

        ],
         {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', 
            Z:'Ζ', H:'Η', Q:'Θ', I:'Ι', K:'Κ',
            L:'Λ', M:'Μ', N:'Ν', C:'Ξ', O:'Ο'
        }
    ),
    Prop12: new DynamicDiagramConfiguration(
        1,
        new CameraSetting(
            5, 
            0, 0, 0
        ),
         {
            radius: 4,
            angleSpiralEnd: -360,
            angleSpiralRotation: -90,
            angleB: -95,
            angleG: -145,
            angleCursor: -95,
        },
        function(params) {
            let {
                radius, angleSpiralEnd, angleSpiralRotation, angleB, angleG, angleCursor, 
            } = params;
            let A = newVector();
            let spiral = Spiral(A, radius, 0, angleSpiralEnd, angleSpiralRotation);
            let B = spiral.pick(angleB);
            let G = spiral.pick(angleG);
            let angleD = angleG + (angleG - angleB);
            let D = spiral.pick(angleD);
            let angleE = angleG + 2*(angleG-angleB);
            let E = spiral.pick(angleE);
            let angleZ = angleG + 3*(angleG-angleB);
            let Z = spiral.pick(angleZ);
    
            let rotEnd = A.shiftPolar(radius*Math.sign(angleSpiralEnd), angleCursor+angleSpiralRotation);
            let cursor = spiral.pick(angleCursor);
            let rotB = A.shiftPolar(radius*angleB/360, angleCursor+angleSpiralRotation);
            let rotG = A.shiftPolar(radius*angleG/360, angleCursor+angleSpiralRotation);
            let rotD = A.shiftPolar(radius*angleD/360, angleCursor+angleSpiralRotation);
            let rotE = A.shiftPolar(radius*angleE/360, angleCursor+angleSpiralRotation);
            let rotZ = A.shiftPolar(radius*angleZ/360, angleCursor+angleSpiralRotation);
            
            let result = {
                A, B, G, D, E, Z,
                AB:[A,B], AG:[A,G], AD:[A,D], AE:[A,E], AZ:[A,Z],
                spiral,
                rotB, rotG, rotD, rotE, rotZ,
                rod:[A, rotEnd]
            };
            return result;
        },
         (e) => Sequential(
            Show(200, e.A),
            Draw(500, e.spiral),
            Draw(300, e.AB),
            Show(1, e.B),
            Draw(300, e.AG),
            Show(1, e.G),
            Draw(300, e.AD),
            Show(1, e.D),
            Draw(300, e.AE),
            Show(1, e.E),
            Draw(300, e.AZ),
            Show(1, e.Z),
        ),
         [
            // 0 -> 1
            (e) => Sequential(
                ChangeStyle(1, e.rod, 'red', 1),
                Draw(400, e.rod),
                ChangeStyle(1, e.rotB, 'red', 1),
                Show(200, e.rotB), 
                ChangeParams(400, {angleCursor: -145}),
                ChangeStyle(1, e.rotG, 'red', 1),
                Show(200, e.rotG), 
                ChangeParams(400, {angleCursor: -195}),
                ChangeStyle(1, e.rotD, 'red', 1),
                Show(200, e.rotD), 
                ChangeParams(400, {angleCursor: -245}),
                ChangeStyle(1, e.rotE, 'red', 1),
                Show(200, e.rotE), 
                ChangeParams(400, {angleCursor: -295}),
                ChangeStyle(1, e.rotZ, 'red', 1),
                Show(200, e.rotZ), 
                // Hide(200, e.rod),
            )
        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', Z:'Ζ'
        }
    ),
    Prop13: new DynamicDiagramConfiguration(
        3,
        new CameraSetting(
            5,
            0, 0, 0
        ),
        {
            radius: 4, 
            angleSpiralEnd: -360,
            angleSpiralRotation: -90,
            angleG: -240,
            angleH: -270,
            lengthZE: 6,
            switchFake: 0,
        },
        function(params) {
            let {
                radius, angleSpiralEnd, angleSpiralRotation, angleG, angleH,
                lengthZE, switchFake,
            } = params;
            let A = newVector();
            let spiral = Spiral(A, radius, 0, angleSpiralEnd, angleSpiralRotation);
            let B = A.shiftPolar(radius*0.5*angleG/360, (0.5*angleG+angleSpiralRotation));
            let G = A.shiftPolar(radius*angleG/360, (angleG+angleSpiralRotation));
            let D = A.shiftPolar(radius*1.5*angleG/360, (1.5*angleG+angleSpiralRotation));
            let H = A.shiftPolar(radius*angleH/360, (angleH+angleSpiralRotation));
            let angleQ = (angleG + angleH)/2
            let Q = A.shiftPolar(radius*angleQ/360, (angleQ+angleSpiralRotation));
            
            let ptOnTangent = G.shiftPolar(radius/(2*Math.PI), angleG+angleSpiralRotation)
                .shiftPolar(radius*angleG/360, angleG+90+angleSpiralRotation);
            let E = G.toward(ptOnTangent, -0.5*lengthZE/G.distTo(ptOnTangent));
            let Z = E.toward(G, 2);
    
            // let angleFake = E.sub(G).angleTo(H.sub(G));
            let EfakeInter = E.toward(H, switchFake);
            let Efake = G.toward(EfakeInter, E.distTo(G)/EfakeInter.distTo(G));
            let Zfake = Efake.toward(G, 2);
    
            // let Z = G.toward(H, 0.5+0.5*lengthZE/G.distTo(H));
            // let E = H.toward(G, 0.5+0.5*lengthZE/G.distTo(H));
            let ratioCut = 4*(angleG*angleH)*degCos(angleQ-angleG) / ((angleG + angleH)**2);
            let cut = A.toward(Q, ratioCut);
            let result = {
                A, B, G, D, H, Z, E, Q, cut, Efake, Zfake,
                AG:[A,G], AH:[A,H], ZE:[Z,E], AQ:[A,Q], ZfEf:[Zfake,Efake],
                spiral,
            };
            return result;
        }, 
        (e) => Sequential(
            Draw(500, e.spiral),
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            Show(200, e.D),
            Show(1, e.Z),
            Draw(400, e.ZE),
            Show(1, e.E),
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Hide(1, e.E),
                Hide(1, e.Z),
                Show(1, e.Efake),
                Show(1, e.Zfake),
                Parallel(
                    ChangeStyle(500, e.ZE, 'grey'),
                    Show(500, e.ZfEf),
                    ChangeParams(500, {switchFake: 1}),
                ),
                Show(200, e.H),
            ),
            // 1 -> 2
            (e) => Sequential(
                Parallel(
                    Draw(300, e.AG),
                    Draw(300, e.AH),
                ),
                Draw(300, e.AQ),
                Show(1, e.Q),
            ),
            // 2 -> 3
            (e) => Sequential(
                ChangeStyle(1, e.cut, 'red', 1.5),
                Show(200, e.cut),
            )
        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', Z:'Ζ', H:'Η', Q:'Θ',
            Efake:'Ε?', Zfake:'Ζ?'
        }
    ),
    Prop14: new DynamicDiagramConfiguration(
        3,
        new CameraSetting(
            5,
            0, 0, 0
        ),
        {
            radius: 4,
            angleSpiralRotation: -90,
            angleB: -90,
            angleG: -150,
            angleD: -240,
            angleE: -270,
            angleCursor: 0
        },
        function (params) {
            let {
                radius, angleSpiralRotation, angleB, angleG, angleD, angleE, angleCursor,
            } = params;
            let A = newVector();
            let spiral = Spiral(A, radius, 0, -360, angleSpiralRotation);
            let circle = Circle(A, radius, 0, 360, 180+angleSpiralRotation);
            let B = spiral.pick(angleB);
            let G = spiral.pick(angleG);
            let D = spiral.pick(angleD);
            let H = circle.pick(angleD);
            let E = spiral.pick(angleE);
            let angleEm = Math.max(angleE, angleCursor);
            let Em = spiral.pick(angleEm);
            let Z = circle.pick(angleE);
            let angleDm = Math.max(angleD, angleCursor+360);
            let Dm = spiral.pick(angleDm);
            let Q = spiral.pick(-360);
            let QKZ = Circle(A, radius, 0, angleEm, -angleSpiralRotation);
            let QKH = Circle(A, radius, 0, angleDm, -angleSpiralRotation);
    
            let Qcursor = A.shiftPolar(radius, -angleSpiralRotation+angleCursor);
            let Acursor = spiral.pick(-(-angleCursor % 360));
            let arm = [A, Qcursor];
            let armPart = [A, Acursor];
            let arcCursor = Circle(A, radius, -angleSpiralRotation, -angleSpiralRotation+angleCursor);
    
            let result = {
                A, B, G, D, E, Z, H, Q, Acursor, Qcursor,
                AQ: [A, Q], AZ:[A,Z], AH:[A,H], AEm:[A,Em], ADm:[A,Dm], arm, armPart,
                circle, QKZ, QKH, arcCursor,
                spiral,
            };
            return result;
        },
         (e) => Sequential(
            Draw(500, e.spiral),
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            Show(200, e.D),
            Show(200, e.E),
            Show(200, e.Q),
            Draw(300, e.AQ),
            Show(1, e.Q),
            Draw(500, e.circle),
            Parallel(
                Draw(300, e.AZ),
                Draw(300, e.AH),
            ),
            Show(1, e.Z),
            Show(1, e.H)
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                ChangeStyle(1, e.Acursor, 'blue', 1.5),
                ChangeStyle(1, e.armPart, 'blue', 1.5),
                ChangeStyle(1, e.Qcursor, 'red', 1.5),
                ChangeStyle(1, e.arcCursor, 'red', 1.5),
                Show(1, e.Acursor),
                Show(1, e.Qcursor),
                Show(1, e.arm),
                Show(1, e.armPart),
                Show(1, e.arcCursor),
                ChangeParams(10000, {angleCursor:-360}),
                Hide(1, e.Acursor),
                Hide(1, e.Qcursor),
                Hide(1, e.arm),
            ),
            // 1 -> 2
            (e) => Sequential(
                Hide(1, e.armPart),
                Hide(1, e.arcCursor),
                Show(1, e.Acursor),
                Show(1, e.Qcursor),
                ChangeParams(1, {angleCursor:0}),
                ChangeStyle(1, e.AEm, 'blue', 1.5),
                ChangeStyle(1, e.QKZ, 'red', 1.5),
                Show(1, e.AEm),
                Show(1, e.QKZ),
                ChangeParams(10000, {angleCursor:-360}),
                Hide(1, e.Acursor),
                Hide(1, e.Qcursor),
            ),
            // 2 -> 3
            (e) => Sequential(
                Show(1, e.Acursor),
                Show(1, e.Qcursor),
                ChangeStyle(1, e.ADm, 'DarkBlue', 1.5),
                ChangeStyle(1, e.QKH, 'DarkRed', 1.5),
                Show(1, e.ADm),
                Show(1, e.QKH),
                ChangeParams(10000, {angleCursor:-720}),
                Hide(1, e.Acursor),
                Hide(1, e.Qcursor),
            ),
        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', Z:'Ζ', H:'Η', Q:'Θ',
            Acursor: 'Α', Qcursor: 'Θ'
        }
    ),
    Prop15: new DynamicDiagramConfiguration(
        2,
        new CameraSetting(
            5,
            0, 0, 0
        ),
        {
            radius: 2,
            angleSpiralRotation: -90,
            angleB: -40,
            angleG: -90,
            angleD: -240,
            angleQ: -360,
            angleL: -570,
            angleE: -660,
            angleCursor: 0
        },
        function (params) {
            let {
                radius, angleSpiralRotation, angleB, angleG, angleD, angleL, angleE, angleQ,
                angleCursor,
            } = params;
    
            let A = newVector();
            let circle = Circle(A, radius, 0, 360, 180+angleSpiralRotation);
            let spiral = Spiral(A, radius, 0, -720, angleSpiralRotation);
            let B = spiral.pick(angleB);
            let G = spiral.pick(angleG);
            let D = spiral.pick(angleD);
            let Q = circle.pick(angleQ);
            let Z = circle.pick(angleL);
            let H = circle.pick(angleE);
            let M = spiral.pick(-720);
            let L = spiral.pick(angleL);
            let E = spiral.pick(angleE);
    
            let Qcursor = A.shiftPolar(radius, -angleSpiralRotation+angleCursor);
            let Acursor = spiral.pick(-(-angleCursor % 720));
            
            let angleEm = Math.max(angleE, angleCursor+720);
            let Em = spiral.pick(angleEm);
            let angleLm = Math.max(angleL, angleCursor);
            let Lm = spiral.pick(angleLm);
    
    
            let QKH = Circle(A, radius, 0, angleEm, -angleSpiralRotation);
            let QKHaddon = Circle(A, radius*1.08, 0, -0.1+Math.min(0, angleEm+360), -angleSpiralRotation);
            let QKZ = Circle(A, radius, 0, angleLm, -angleSpiralRotation);
            let QKZaddon = Circle(A, radius*1.04, 0, -0.1+Math.min(0, angleLm+360), -angleSpiralRotation);
    
            let result = {
                A, B, G, D, M, L, E, Z, H, Q, 
                Acursor, Qcursor,
                AE:[A,E], AL:[A,L],
                AQ: [A, Q], AZ:[A,Z], AH:[A,H], AEm:[A,Em], ALm:[A,Lm],
                circle, QKZ, QKH, QKHaddon, QKZaddon,
                spiral,
            };
            return result;
        },
         (e) => Sequential(
            Draw(1000, e.spiral),
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            Show(200, e.D),
            Show(200, e.Q),
            Show(200, e.L),
            Show(200, e.E),
            Show(200, e.M),
            Draw(300, e.AQ),
            Draw(500, e.circle),
            Parallel(
                Draw(300, e.AE),
                Draw(300, e.AL),
            ),
            Parallel(
                Show(200, e.H),
                Show(200, e.Z)
            )
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Show(1, e.Acursor),
                Show(1, e.Qcursor),
                ChangeStyle(1, e.ALm, 'blue', 1.5),
                ChangeStyle(1, e.QKZ, 'red', 1.5),
                ChangeStyle(1, e.QKZaddon, 'red', 1.5),
                Show(1, e.ALm),
                Show(1, e.QKZ),
                Show(1, e.QKZaddon),
                ChangeParams(20000, {angleCursor:-720}),
                Hide(1, e.Acursor),
                Hide(1, e.Qcursor),
            ),
            // 1 -> 2
            (e) => Sequential(
                Show(1, e.Acursor),
                Show(1, e.Qcursor),
                ChangeStyle(1, e.AEm, 'DarkBlue', 1.5),
                ChangeStyle(1, e.QKH, 'DarkRed', 1.5),
                ChangeStyle(1, e.QKHaddon, 'DarkRed', 1.5),
                Show(1, e.AEm),
                Show(1, e.QKH),
                Show(1, e.QKHaddon),
                ChangeParams(20000, {angleCursor:-1440}),
                Hide(1, e.Acursor),
                Hide(1, e.Qcursor),
            ),
        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', M:'Μ', L:'Λ', E:'Ε', Z:'Ζ', H:'Η', Q:'Θ',
            Acursor: 'Α', Qcursor: 'Θ'
        }
    ),
    Prop16: new DynamicDiagramConfiguration(
        5,
        new CameraSetting(
            5,
            0, 0, 0
        ),
        {
            radius: 4,
            angleSpiralRotation: -90,
            angleB: -95,
            angleG: -145,
            angleD: -195,
            angleT: 70,
            angleN: -15,
            angleDAI: 15,
            ratioLengthDE: 2, 
            ratioLengthDZ: 2,
            switchFake: 0,
            switchT: 0,
        },
        function (params) {
            let {
                radius, angleSpiralRotation, angleB, angleG, angleD, angleT, angleN, angleDAI,
                ratioLengthDE, ratioLengthDZ, 
                switchFake, switchT,
            } = params;
            let A = newVector();
            let spiral = Spiral(A, radius, 0, -360, angleSpiralRotation);
            let B = spiral.pick(angleB);
            let G = spiral.pick(angleG);
            let D = spiral.pick(angleD);
            let Q = spiral.pick(-360);
            let QKH = Circle(A, radius, 0, 360);
    
            let ptOnTangent = D.shiftPolar(radius/(2*Math.PI), angleD+angleSpiralRotation)
                .shiftPolar(radius*angleD/360, angleD+90+angleSpiralRotation);
            let E = D.toward(ptOnTangent, -1*Math.sign(angleSpiralRotation));
            let Z = D.toward(ptOnTangent, 1*Math.sign(angleSpiralRotation));
            let radiusSmall = A.distTo(D);
            let DTN = Circle(A, radiusSmall, 0, 360);
            let T = A.shiftPolar(radiusSmall, (1-switchT)*angleT+switchT*(-angleSpiralRotation));
            let N = A.shiftPolar(radiusSmall, angleN);
    
            let angleFakeTangent = (switchFake)*90+ (1-switchFake)*E.sub(D).angleTo(A.sub(D))
            let Efake = D.shiftPolar(D.distTo(E), angleD+angleSpiralRotation-angleFakeTangent);
            let Zfake = D.shiftPolar(D.distTo(E), angleD+angleSpiralRotation+180-angleFakeTangent);
    
            let R = A.shiftPolar(radiusSmall, 180+angleD+angleSpiralRotation-angleDAI);
            let I = A.toward(R, 1/degCos(angleDAI));
            let L = A.toward(R, 1+angleDAI/(-angleD));
            let DNT = Circle(A, radiusSmall, -angleSpiralRotation+angleD, -angleSpiralRotation);
            let DRarc = Circle(A, radiusSmall, -angleSpiralRotation+angleD-angleDAI, -angleSpiralRotation+angleD);
    
            let S = A.toward(R, radius/radiusSmall);
            let H = A.toward(D, radius/radiusSmall);
            let K = A.toward(N, radius/radiusSmall);
            let HKQ = Circle(A, radius, -angleSpiralRotation+angleD, -angleSpiralRotation);
            let SHarc = Circle(A, radius, -angleSpiralRotation+angleD-angleDAI, -angleSpiralRotation+angleD);
    
            let result = {
                A, B, G, D, Q, E, Z, T, N, Efake, Zfake, R, I, L, S, H, K,
                AQ:[A,Q], EZ:[E,Z], AD:[A,D], EfZf:[Efake,Zfake], AL:[A,L],
                RI:[R,I], AR:[A,R], LS:[L,S], DH:[D,H], RL:[R,L],
                QKH, DTN, DNT, DRarc, HKQ, SHarc,
                spiral,
            };
            return result;
        },
         (e) => Sequential(
            Draw(500, e.spiral),
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            Show(200, e.D),
            Show(200, e.Q),
            Draw(400, e.AQ),
            Draw(500, e.QKH),
            Show(1, e.E),
            Draw(300, e.EZ),
            Show(1, e.Z),
            Draw(300, e.AD),
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                ChangeStyle(1, e.DTN, 'brown', 1),
                Draw(400, e.DTN),
                Show(200, e.T),
                Show(200, e.N),
            ),
            // 1 -> 2
            (e) => Sequential(
                Hide(1, e.E),
                Hide(1, e.Z),
                Parallel(
                    // ChangeStyle(400, e.E, 'grey', 1),
                    // ChangeStyle(400, e.Z, 'grey', 1),
                    ChangeStyle(400, e.EZ, 'grey', 1),
                    Show(400, e.EfZf),
                    Show(400, e.Efake),
                    Show(400, e.Zfake),
                    ChangeParams(400, {switchFake: 1}),
                )
            ),
            // 2 -> 3
            (e) => Sequential(
                Parallel(
                    ChangeCamera(500, {scale:2.5, centerX:0, centerY:0})
                ),
                Draw(300, e.AL),
                Show(200, e.R),
                Show(200, e.I),
                // Show(200, e.L),
                Show(1, e.RI),
                Show(1, e.AR),
                Show(1, e.DRarc),
                Show(1, e.DNT),
                Parallel(
                    ChangeParams(200, {switchT: 1}), 
                    ChangeStyle(200, e.RI, 'red', 1.5),
                    ChangeStyle(200, e.AR, 'DarkRed', 1.5),
                    ChangeStyle(200, e.DRarc, 'blue', 1.5),
                    ChangeStyle(200, e.DNT, 'DarkBlue', 1.5),
                )
            ),
            // 3 -> 4
            (e) => Sequential(
                ChangeCamera(500, {scale:5, centerX:0, centerY:0}),
                Show(1, e.SHarc),
                Show(1, e.HKQ),
                ChangeStyle(1, e.LS, 'grey'),
                ChangeStyle(1, e.DH, 'grey'),
                Show(200, e.S),
                Show(200, e.H),
                Show(200, e.K),
                Parallel(
                    // ChangeStyle(200, e.DRarc, 'black', 1),
                    // ChangeStyle(200, e.DNT, 'black', 1),
                    Hide(200, e.DRarc),
                    Hide(200, e.DNT), 
                    Show(200, e.LS),
                    Show(200, e.DH),
                    ChangeStyle(200, e.SHarc, 'blue', 1.5),
                    ChangeStyle(200, e.HKQ, 'DarkBlue', 1.5)
                )
            ),
            // 4 -> 5
            (e) => Sequential(
                ChangeCamera(500, {scale: 2.5, centerX:-1, centerY:-1}),
                Hide(200, e.I),
                Show(200, e.L),
                Hide(200, e.RI),
                ChangeStyle(1, e.RL, 'red', 1.5),
                Show(200, e.RL),
                ChangeCamera(500, {scale: 5, centerX:0, centerY:0}),
            )
        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', Z:'Ζ', Q:'Θ', T:'Τ', N:'Ν',
            R:'Ρ', I:'Ι', L:'Λ', S:'Σ', H:'Η', K:'Κ',
            Efake: 'Ε?', Zfake: 'Ζ?', 
        }
    ),
    Prop17: new DynamicDiagramConfiguration(
        6,
        new CameraSetting(
            5,
            0, 0, 0
        ),
        {
            radius: 2,
            angleSpiralRotation: -90,
            angleB: -95,
            angleG: -145,
            angleD: -435,
            angleT: 70,
            angleR: -90,
            angleN: 55,
            angleDAI: 10,
            ratioLengthDE: 2, 
            ratioLengthDZ: 2,
            switchFake: 0,
            switchT: 0,
            switchR: 0,
        },
        function (params) {
            let {
                radius, angleSpiralRotation, angleB, angleG, angleD, angleT, angleR, angleN, angleDAI,
                ratioLengthDE, ratioLengthDZ, 
                switchFake, switchT, switchR
            } = params;
            let A = newVector();
            let spiral = Spiral(A, radius, 0, -720, angleSpiralRotation);
            let B = spiral.pick(angleB);
            let G = spiral.pick(angleG);
            let D = spiral.pick(angleD);
            let Q = spiral.pick(-720);
            let QKH = Circle(A, radius, 0, 360);
    
            let ptOnTangent = D.shiftPolar(radius/(2*Math.PI), angleD+angleSpiralRotation)
                .shiftPolar(radius*angleD/360, angleD+90+angleSpiralRotation);
            let E = D.toward(ptOnTangent, -1*Math.sign(angleSpiralRotation));
            let Z = D.toward(ptOnTangent, 1*Math.sign(angleSpiralRotation));
            let radiusSmall = A.distTo(D);
            let RND = Circle(A, radiusSmall, 0, 360);
            let angleFakeTangent = (switchFake)*90+ (1-switchFake)*E.sub(D).angleTo(A.sub(D))
            let Efake = D.shiftPolar(D.distTo(E), angleD+angleSpiralRotation-angleFakeTangent);
            let Zfake = D.shiftPolar(D.distTo(E), angleD+angleSpiralRotation+180-angleFakeTangent);

            let R = A.shiftPolar(radiusSmall, (1-switchR)*angleR + switchR*(angleD-angleDAI)-angleSpiralRotation);
            let T = A.shiftPolar(radiusSmall, -angleSpiralRotation);
            let N = A.shiftPolar(radiusSmall, angleN);        
    
            let I = A.toward(R, 1/degCos(angleDAI));
            let DNT = Circle(A, radiusSmall*1.06, -angleSpiralRotation+angleD+360, -angleSpiralRotation);
            let DRarc = Circle(A, radiusSmall, -angleSpiralRotation+angleD-angleDAI, -angleSpiralRotation+angleD);
            let DRN = Circle(A, radiusSmall*1.04, 0, 360);

            let AIshift = [A.shift(0.03, -0.03), I.shift(0.03, -0.03)];
            let DNTinner = Circle(A, radiusSmall, -angleSpiralRotation+angleD+360, -angleSpiralRotation);
            let DRNinner = Circle(A, radiusSmall*0.98, 0, 360);
            let S = A.toward(R, 2*radius/radiusSmall);
            let H = A.toward(D, 2*radius/radiusSmall);
            let K = A.toward(N, 2*radius/radiusSmall);
            let HKQ = Circle(A, 2*radius, 0, 360);
            let SHKQ = Circle(A, 2*radius, -angleSpiralRotation+angleD+360-angleDAI, -angleSpiralRotation);
            let QSHKinner = Circle(A, 2*radius*0.98, 0, 360);
            let QSHKouter = Circle(A, 2*radius*1.04, 0, 360);
            let HKQouter = Circle(A, 2*radius*1.06, -angleSpiralRotation+angleD+360, -angleSpiralRotation);
            
            let X = A.toward(R, 1+angleDAI/(-angleD));
    
            let result = {
                A, B, G, D, Q, E, Z, T, N, Efake, Zfake, R, I, X, S, H, K,
                AQ:[A,Q], EZ:[E,Z], AD:[A,D], EfZf:[Efake,Zfake], AL:[A,R],
                RI:[R,I], AR:[A,R], LS:[R,S], DH:[D,H], RX:[R,X], AIshift, AX:[A,X],
                QKH, RND, DRN, DNT, DRarc, DNTinner, DRNinner, 
                HKQ, SHKQ, QSHKinner, QSHKouter, HKQouter, 
                spiral,
            };
            return result;
        },
         (e) => Sequential(
            Draw(500, e.spiral),
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            Show(200, e.D),
            Show(200, e.Q),
            Draw(400, e.AQ),
            // Draw(500, e.QKH),
            Show(1, e.E),
            Draw(300, e.EZ),
            Show(1, e.Z),
            Draw(300, e.AD),
            ChangeStyle(1, e.RND, 'brown', 1),
            Draw(400, e.RND),
            Show(200, e.T),
            Show(200, e.N),
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Hide(1, e.E),
                Hide(1, e.Z),
                Parallel(
                    ChangeStyle(400, e.EZ, 'grey', 1),
                    Show(400, e.EfZf),
                    Show(400, e.Efake),
                    Show(400, e.Zfake),
                    ChangeParams(400, {switchFake: 1}),
                ),
                ChangeParams(200, {switchR:1}),
            ),
            // 1 -> 2
            (e) => Sequential(
                ChangeCamera(500, {scale:1.6, centerX:1.2, centerY:0}),
                Draw(300, e.AL),
                Show(200, e.R),
                Show(200, e.I),
                Show(1, e.AR),
                Show(1, e.RI),
                Hide(1, e.AL),
                ChangeCamera(500, {scale:0.7, centerX:1.8, centerY:0}),
            ),
            // 2 -> 3
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.RI, 'red', 1.5),
                    ChangeStyle(200, e.AR, 'DarkRed', 1.5)
                ),
                Show(200, e.DRarc),
                ChangeCamera(500, {scale:3.3, centerX:0, centerY:0}),
                // ChangeCamera(500, {scale:1.6, centerX:1.2, centerY:0}),
                ChangeStyle(1, e.DRarc, 'blue', 1.5),
                ChangeStyle(1, e.DNT, 'DarkBlue', 1.5),
                ChangeStyle(1, e.DRN, 'DarkBlue', 1.5),
                Draw(500, e.DRN),
                Draw(200, e.DNT),
            ),
            // 3 -> 4
            (e) => Sequential(
                ChangeCamera(500, {scale:0.7, centerX:1.8, centerY:0}),
                ChangeStyle(200, e.RI, 'black', 1),
                ChangeStyle(1, e.AIshift, 'red', 1.5),
                Show(200, e.AIshift),
                ChangeCamera(500, {scale:3.3, centerX:0, centerY:0}),
                ChangeStyle(1, e.DRNinner, 'blue', 1.5),
                ChangeStyle(1, e.DNTinner, 'blue', 1.5),
                Draw(200, e.DNTinner),
                Draw(500, e.DRNinner),
            ),
            // 4 -> 5
            (e) => Sequential(
                Hide(200, e.AIshift),
                ChangeStyle(200, e.AR, 'black', 1),
                ChangeCamera(500, {scale:5, centerX:0, centerY:0}),
                ChangeStyle(1, e.SHKQ, 'red', 1.5),
                ChangeStyle(1, e.QSHKinner, 'red', 1.5),
                ChangeStyle(1, e.QSHKouter, 'DarkRed', 1.5),
                ChangeStyle(1, e.HKQouter, 'DarkRed', 1.5),
                ChangeStyle(1, e.LS, 'grey'),
                ChangeStyle(1, e.DH, 'grey'),
                Show(200, e.S),
                Show(200, e.H),
                Show(200, e.K),
                Parallel(
                    Hide(200, e.DRarc),
                    Hide(200, e.DNT), 
                    Show(200, e.LS),
                    Show(200, e.DH),
                    Draw(200, e.HKQ),
                ),
                Draw(500, e.QSHKinner),
                Draw(200, e.SHKQ),
                Draw(500, e.QSHKouter),
                Draw(200, e.HKQouter),
            ),
            // 5 -> 6
            (e) => Sequential(
                Parallel(
                    Hide(200, e.DNT),
                    Hide(200, e.DRN),
                    Hide(200, e.DRNinner),
                    Hide(200, e.DNTinner)
                    // ChangeStyle(200, e.DNT, 'black', 1),
                    // ChangeStyle(200, e.DRN, 'black', 1),
                    // ChangeStyle(200, e.DRNinner, 'black', 1),
                    // ChangeStyle(200, e.DNTinner, 'black', 1),
                ),
                ChangeCamera(500, {scale:3.3, centerX:0, centerY:0}),
                // ChangeCamera(500, {scale:0.7, centerX:1.8, centerY:0}),
                Hide(200, e.I),
                Hide(200, e.R),
                Show(200, e.X),
                Hide(200, e.RI),
                Show(1, e.AX),
                ChangeStyle(1, e.AX, 'blue', 1.5),
                Show(200, e.RX),
                ChangeStyle(200, e.AD, 'DarkBlue', 1.5),
                ChangeCamera(500, {scale: 4.5, centerX:0, centerY:0}),
            )
        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', Z:'Ζ', Q:'Θ', T:'Τ', N:'Ν',
            R:'Ρ', I:'Ι', X:'Χ', S:'Σ', H:'Η', K:'Κ',
            Efake: 'Ε?', Zfake: 'Ζ?', 
        }
    ),
    Prop18: new DynamicDiagramConfiguration(
        15,
        new CameraSetting(
            4.2,
            -3, 0, 0
        ),
        {
            radius: 1,
            angleSpiralRotation: -90,
            angleB: -120,
            angleG: -210,
            angleD: -240,
            angleQ: -360,
            angleH: 135,
            ratioLA: 0.9,
            ratioQN: 0.05,
            ratioMQ: 1.05,
            caseNum: 0,
        },
        function (params) {
            let {
                radius, angleSpiralRotation, angleB, angleG, angleD, angleH, 
                ratioLA, ratioQN, ratioMQ, caseNum,
            } = params;
            let A = newVector();
    
            let circle = Circle(A, radius, 0, 360, 180+angleSpiralRotation);
            let spiral = Spiral(A, radius, 0, -400, angleSpiralRotation);
            let B = spiral.pick(angleB);
            let G = spiral.pick(angleG);
            let D = spiral.pick(angleD);
            let Q = spiral.pick(-360);
    
            let H = A.shiftPolar(radius, angleH);
            let Z = A.shiftPolar(-radius*2*Math.PI, angleSpiralRotation+90);
            let N = Z.toward(Q, 1+ratioQN);
    
            let L = A.toward(Z, ratioLA);
            let ZLmid = L.toward(Z, 0.5);
            let QHmid = Q.toward(H, 0.5);
    
            let P = newVector();
            N = Z.toward(Q, 1+ratioQN);
            if (caseNum >= 1) {
                N = QHmid;
            }
            let R = A.toward(N, radius/A.distTo(N));
            let angleQAR = Q.sub(A).angleTo(R.sub(A));
            let QRarc = Circle(A, radius, 90-angleQAR, 90);
            let X = A.shiftPolar(radius*(-360-angleQAR)/360, -angleQAR+angleSpiralRotation);
    
            let M = Q.add(Z.sub(A).dilate(ratioMQ))
            if (caseNum >= 1) {
                P = A.toward(R, (radius/A.distTo(N)));
            }
    
            let result = {
                A,B,G,D,H,Q,Z,L, N,R, X, M, P, 
                AZ:[A,Z], AQ:[A,Q], ZN:[Z,N], LA:[A,L], ZL:[Z,L], QQHmid:[Q,QHmid], AQHmid:[A,QHmid],
                NR:[N,R], AR:[A,R], QR:[Q,R], XR:[X,R],
                MP:[M,P], QP:[Q,P], ZQ:[Z,Q], AZLmid:[A,ZLmid],
                QRarc, 
                circle, spiral,
            };
            return result;
        },
        (e) => Sequential(
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            Show(200, e.D),
            Show(200, e.Q),
            Draw(500, e.spiral),
            Draw(500, e.AQ),
            Show(200, e.H),
            Draw(500, e.circle),
            Draw(500, e.ZN),
            Draw(500, e.AZ),
            Show(1, e.Z),
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Show(1, e.L),
                Show(1, e.AZLmid),
                Parallel(
                    ChangeStyle(200, e.AZLmid, 'red', 1.5),
                    ChangeStyle(200, e.circle, 'red', 1.5),
                )
            ), 
            // 1 -> 2
            (e) => Sequential(
                Parallel(
                    Hide(200, e.AZLmid),
                    ChangeStyle(200, e.AZ, 'black', 1),
                    ChangeStyle(200, e.circle, 'black', 1),
                    ChangeParams(500, {angleH: 108.086}),
                    Show(200, e.AQHmid),
                ),
                Show(1, e.LA),
                Show(1, e.ZL),
                Hide(1, e.AZ),
                Show(1, e.QQHmid),
                Parallel(
                    ChangeStyle(200, e.AQ, 'red', 1.5),
                    ChangeStyle(200, e.LA, 'DarkRed', 1.5),
                ),
                Parallel(
                    ChangeStyle(200, e.QQHmid, 'blue', 1.5),
                    ChangeStyle(200, e.AQHmid, 'DarkBlue', 1.5),
                )
            ),
            // 2 -> 3
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.AQ, 'black', 1),
                    ChangeStyle(200, e.LA, 'black', 1),
                    ChangeStyle(200, e.QQHmid, 'black', 1),
                    ChangeStyle(200, e.AQHmid, 'black', 1),
                ),
                Parallel(
                    ChangeParams(200, {ratioQN: 0.1}),
                    Show(200, e.N),
                    Show(200, e.R),
                    Show(200, e.NR),
                    Show(200, e.AR),
                    Show(200, e.QR),
                ),
                Parallel(
                    ChangeStyle(200, e.NR, 'red', 1.5),
                    ChangeStyle(200, e.QR, 'DarkRed', 1.5),
                ),
                Parallel(
                    ChangeStyle(200, e.AQ, 'blue', 1.5),
                    ChangeStyle(200, e.LA, 'DarkBlue', 1.5),
                )
            ),
            // 3 -> 4
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.QR, 'black', 1),
                    ChangeStyle(200, e.AQ, 'black', 1),
                ),
                Parallel(
                    ChangeStyle(200, e.AR, 'DarkRed', 1.5),
                    ChangeStyle(200, e.QR, 'blue', 1.5),
                )
            ),
            // 4 -> 5 
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.NR, 'black', 1),
                    ChangeStyle(200, e.LA, 'black', 1),
                    ChangeStyle(200, e.AR, 'black', 1),
                    ChangeStyle(200, e.QR, 'black', 1),
                ),
                Parallel(
                    ChangeStyle(200, e.QR, 'red', 1.5),
                    ChangeStyle(200, e.LA, 'DarkRed', 1.5),
                ),
                Parallel(
                    ChangeStyle(200, e.QRarc, 'blue', 1.5),
                    ChangeStyle(200, e.circle, 'DarkBlue', 1.5),
                )
            ),
            // 5 -> 6
            (e) => Sequential(
                ChangeCamera(500, {scale: 1.3, centerX:0}),
                Parallel(
                    ChangeStyle(200, e.QR, 'black', 1),
                    ChangeStyle(200, e.LA, 'black', 1),
                ),
                Parallel(
                    ChangeStyle(200, e.NR, 'red', 1.5),
                    ChangeStyle(200, e.AR, 'DarkRed', 1.5),
                ),
            ),
            // 6-> 7 
            (e) => Sequential(
                Parallel(
                    Show(200, e.X),
                    ChangeStyle(200, e.NR, 'black', 1),
                    ChangeStyle(200, e.AR, 'black', 1),
                ),
                Show(1, e.XR),
                Parallel(
                    ChangeStyle(200, e.XR, 'red', 1.5),
                    ChangeStyle(200, e.AR, 'red', 1.5),
                    ChangeStyle(200, e.AQ, 'DarkRed', 1.5),
                )
            )
        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', Q:'Θ', Z:'Ζ', H:'Η', L:'Λ', N:'Ν', R:'Ρ', X:'Χ', M:'Μ', P:'Π',
        }
    )
}

export {ddcs};