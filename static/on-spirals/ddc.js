import {
    CameraSetting, DynamicDiagramConfiguration
} from '/static/structures.js'
import {
    newMultiObjects as MultiObjects,
    newVector as Vector, 
    newPoints as Points, 
    newLine as Line, 
    newCircle as Circle, 
    newSpiral as Spiral,
    newPolygon as Polygon,
    newGridRectangle as GridRectangle,
    newSector as Sector,
    newSpiralCircularSector as SpiralCircularSector,
} from "/static/construction.js"
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
    newIdleFX as Wait,
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
        
            let D = Vector();
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
            let A = Vector();
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
            let K = Vector();
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
            let K = Vector();
            let A = K.shift(-radius*Math.sin(angleAKQ*Math.PI/180), radius*Math.cos(angleAKQ*Math.PI/180));
            let bnLength = ratioBNmagn*radius/(ratioLengthZ/ratioLengthH)
            function getBNlength(halfBKG) {
                return (
                    radius*Math.cos((angleAKQ-2*halfBKG)*Math.PI/180)/Math.sin((angleAKQ-halfBKG)*Math.PI/180) 
                    - bnLength
                );
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
            let N = (
                K.shift((1-switchN)*radius*ratioPosN 
                + switchN*radius*Math.cos(halfBKG*Math.PI/180)/Math.sin((angleAKQ-halfBKG)*Math.PI/180))
            );
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
            let K = Vector();
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
            let N = K.shift(
                (ratioN*(1-switchIN) + switchIN)*radius
                *(degSin(angleAKQ) + degCos(angleAKQ)/degTan(angleAKQ+halfGKI))
            );
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
            let K = Vector();
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
            let K = Vector();
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
                Z:[Zbot,Ztop], H:[Hbot,Htop], AG:[A,G], GQ:[G,Q], 
                QK:[Q,K], GK:[G,K], GL:[G,L], KL, CL:[C,L], GM:[G,M], 
                IN:[I,N], KN:[K,N], CI:[C,I], KE:[K,E], GE:[G,E], 
                IL:[I,L], KI:[K,I], CG:[C,G], KB:[K,B], IG:[I,G], BE:[B,E], 
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
        4,
        new CameraSetting(
            5,
            3.5, 4, 0
        ),
         {
            lengthA: 8,
            lengthBetweenLines: 1,
            offsetRectX: -11,
            offsetRectY: -3,
            gapRect: 0.25,
            offsetSqX: 0,
            offsetSqY: -2,
            offsetLongX: 10,
            offsetLongY: -2,
            offsetRhsX: -2,
            offsetRhsY: -14,
            gapRhs1: 0.25,
            gapRhs1X: 0.25,
            gapRhs2: 0.25,
            offsetMidX: -2,
            offsetMidY: -2,
            gapMid1: 1,
            gapMid2: 0.25,
            switchFlipSq3: 0,
        },
        function(params) {
            let {
                lengthA, lengthBetweenLines,
                offsetRectX, offsetRectY, gapRect,
                offsetSqX, offsetSqY,
                offsetLongX, offsetLongY, 
                offsetRhsX, offsetRhsY, gapRhs1, gapRhs1X, gapRhs2,
                offsetMidX, offsetMidY, gapMid1, gapMid2,
                switchFlipSq3
            } = params;
            let numLines = 8
            let lengthQ = lengthA / numLines;
            let Abot = Vector();
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
    
            let rectAA = GridRectangle(offsetRectX, offsetRectY-lengthA, lengthA, lengthA, 0);

            let lengthB = lengthA*(numLines-1)/numLines;
            let rectBB = GridRectangle(offsetRectX+gapRect, offsetRectY+gapRect-lengthA, lengthB, lengthB, -1);
            let rectIB = GridRectangle(offsetRectX+gapRect+lengthB, offsetRectY+gapRect-lengthA, lengthQ, lengthB, -1);
            let rectBI = GridRectangle(offsetRectX+gapRect, offsetRectY+gapRect-lengthQ, lengthB, lengthQ, -1);
            let rectII = GridRectangle(offsetRectX+gapRect+lengthB, offsetRectY+gapRect-lengthQ, lengthQ, lengthQ, -1);

            let lengthG = lengthB*(numLines-2)/(numLines-1);
            let lengthH = lengthQ*2;
            let rectGG = GridRectangle(offsetRectX+2*gapRect, offsetRectY+2*gapRect-lengthA, lengthG, lengthG, -2);
            let rectKG = GridRectangle(offsetRectX+2*gapRect+lengthG, offsetRectY+2*gapRect-lengthA, lengthH, lengthG, -2);
            let rectGK = GridRectangle(offsetRectX+2*gapRect, offsetRectY+2*gapRect-lengthH, lengthG, lengthH, -2);
            let rectKK = GridRectangle(offsetRectX+2*gapRect+lengthG, offsetRectY+2*gapRect-lengthH, lengthH, lengthH, -2);

            let lengthD = lengthG*(numLines-3)/(numLines-2);
            let lengthZ = lengthH*(3/2);
            let rectDD = GridRectangle(offsetRectX+3*gapRect, offsetRectY+3*gapRect-lengthA, lengthD, lengthD, -3);
            let rectLD = GridRectangle(offsetRectX+3*gapRect+lengthD, offsetRectY+3*gapRect-lengthA, lengthZ, lengthD, -3);
            let rectDL = GridRectangle(offsetRectX+3*gapRect, offsetRectY+3*gapRect-lengthZ, lengthD, lengthZ, -3);
            let rectLL = GridRectangle(offsetRectX+3*gapRect+lengthD, offsetRectY+3*gapRect-lengthZ, lengthZ, lengthZ, -3);

            let lengthE = lengthD*(numLines-4)/(numLines-3);
            let rectEE = GridRectangle(offsetRectX+4*gapRect, offsetRectY+4*gapRect-lengthA, lengthE, lengthE, -4);
            let rectME = GridRectangle(offsetRectX+4*gapRect+lengthE, offsetRectY+4*gapRect-lengthA, lengthE, lengthE, -4);
            let rectEM = GridRectangle(offsetRectX+4*gapRect, offsetRectY+4*gapRect-lengthE, lengthE, lengthE, -4);
            let rectMM = GridRectangle(offsetRectX+4*gapRect+lengthE, offsetRectY+4*gapRect-lengthE, lengthE, lengthE, -4);
            
            let rectZZ = GridRectangle(offsetRectX+5*gapRect, offsetRectY+5*gapRect-lengthA, lengthZ, lengthZ, -5);
            let rectNZ = GridRectangle(offsetRectX+5*gapRect+lengthZ, offsetRectY+5*gapRect-lengthA, lengthD, lengthZ, -5);
            let rectZN = GridRectangle(offsetRectX+5*gapRect, offsetRectY+5*gapRect-lengthD, lengthZ, lengthD, -5);
            let rectNN = GridRectangle(offsetRectX+5*gapRect+lengthZ, offsetRectY+5*gapRect-lengthD, lengthD, lengthD, -5);
            
            let rectHH = GridRectangle(offsetRectX+6*gapRect, offsetRectY+6*gapRect-lengthA, lengthH, lengthH, -6);
            let rectCH = GridRectangle(offsetRectX+6*gapRect+lengthH, offsetRectY+6*gapRect-lengthA, lengthG, lengthH, -6);
            let rectHC = GridRectangle(offsetRectX+6*gapRect, offsetRectY+6*gapRect-lengthG, lengthH, lengthG, -6);
            let rectCC = GridRectangle(offsetRectX+6*gapRect+lengthH, offsetRectY+6*gapRect-lengthG, lengthG, lengthG, -6);
            
            let rectQQ = GridRectangle(offsetRectX+7*gapRect, offsetRectY+7*gapRect-lengthA, lengthQ, lengthQ, -7);
            let rectOQ = GridRectangle(offsetRectX+7*gapRect+lengthQ, offsetRectY+7*gapRect-lengthA, lengthB, lengthQ, -7);
            let rectQO = GridRectangle(offsetRectX+7*gapRect, offsetRectY+7*gapRect-lengthB, lengthQ, lengthB, -7);
            let rectOO = GridRectangle(offsetRectX+7*gapRect+lengthQ, offsetRectY+7*gapRect-lengthB, lengthB, lengthB, -7);
            
            let sqA = GridRectangle(offsetSqX, offsetSqY-lengthA, lengthA, lengthA, 0);

            let longAQ = GridRectangle(offsetLongX, offsetLongY-lengthA, lengthQ, lengthA, 0);
            let longBQ = GridRectangle(offsetLongX+lengthQ, offsetLongY-lengthA, lengthQ, lengthB, 0);
            let longGQ = GridRectangle(offsetLongX+2*lengthQ, offsetLongY-lengthA, lengthQ, lengthG, 0);
            let longDQ = GridRectangle(offsetLongX+3*lengthQ, offsetLongY-lengthA, lengthQ, lengthD, 0);
            let longEQ = GridRectangle(offsetLongX+4*lengthQ, offsetLongY-lengthA, lengthQ, lengthE, 0);
            let longZQ = GridRectangle(offsetLongX+5*lengthQ, offsetLongY-lengthA, lengthQ, lengthZ, 0);
            let longHQ = GridRectangle(offsetLongX+6*lengthQ, offsetLongY-lengthA, lengthQ, lengthH, 0);
            let longQQ = GridRectangle(offsetLongX+7*lengthQ, offsetLongY-lengthA, lengthQ, lengthQ, 0);

            let sqQ1 = GridRectangle(offsetRhsX, offsetRhsY-lengthQ, lengthQ, lengthQ, 0);
            let sqH1 = GridRectangle(offsetRhsX+gapRhs1X, offsetRhsY+gapRhs1-lengthH, lengthH, lengthH, -1);
            let sqZ1 = GridRectangle(offsetRhsX+2*gapRhs1, offsetRhsY+2*gapRhs1-lengthZ, lengthZ, lengthZ, -2);
            let sqE1 = GridRectangle(offsetRhsX+3*gapRhs1, offsetRhsY+3*gapRhs1-lengthE, lengthE, lengthE, -3);
            let sqD1 = GridRectangle(offsetRhsX+4*gapRhs1, offsetRhsY+4*gapRhs1-lengthD, lengthD, lengthD, -4);
            let sqG1 = GridRectangle(offsetRhsX+5*gapRhs1, offsetRhsY+5*gapRhs1-lengthG, lengthG, lengthG, -5);
            let sqB1 = GridRectangle(offsetRhsX+6*gapRhs1, offsetRhsY+6*gapRhs1-lengthB, lengthB, lengthB, -6);
            let sqA1 = GridRectangle(offsetRhsX+7*gapRhs1, offsetRhsY+7*gapRhs1-lengthA, lengthA, lengthA, -7);
            
            let offsetRhsX2 = offsetRhsX - gapRhs2;
            let offsetRhsY2 = offsetRhsY + gapRhs2;
            let sqQ2 = GridRectangle(offsetRhsX2, offsetRhsY2-lengthQ, lengthQ, lengthQ, 0-numLines);
            let sqH2 = GridRectangle(offsetRhsX2+gapRhs1, offsetRhsY2+gapRhs1-lengthH, lengthH, lengthH, -1-numLines);
            let sqZ2 = GridRectangle(offsetRhsX2+2*gapRhs1, offsetRhsY2+2*gapRhs1-lengthZ, lengthZ, lengthZ, -2-numLines);
            let sqE2 = GridRectangle(offsetRhsX2+3*gapRhs1, offsetRhsY2+3*gapRhs1-lengthE, lengthE, lengthE, -3-numLines);
            let sqD2 = GridRectangle(offsetRhsX2+4*gapRhs1, offsetRhsY2+4*gapRhs1-lengthD, lengthD, lengthD, -4-numLines);
            let sqG2 = GridRectangle(offsetRhsX2+5*gapRhs1, offsetRhsY2+5*gapRhs1-lengthG, lengthG, lengthG, -5-numLines);
            let sqB2 = GridRectangle(offsetRhsX2+6*gapRhs1, offsetRhsY2+6*gapRhs1-lengthB, lengthB, lengthB, -6-numLines);
            let sqA2 = GridRectangle(offsetRhsX2+7*gapRhs1, offsetRhsY2+7*gapRhs1-lengthA, lengthA, lengthA, -7-numLines);

            let offsetRhsX3 = offsetRhsX - 2*gapRhs2;
            let offsetRhsY3 = offsetRhsY + 2*gapRhs2;
            let zoffset3 = -numLines*2;
            let sgn3 = (2*switchFlipSq3 - 1);
            let sqQ3 = GridRectangle(offsetRhsX3, offsetRhsY3-lengthQ, lengthQ, lengthQ, sgn3*0+zoffset3);
            let sqH3 = GridRectangle(offsetRhsX3+gapRhs1X, offsetRhsY3+gapRhs1-lengthH, lengthH, lengthH, sgn3*1+zoffset3);
            let sqZ3 = GridRectangle(offsetRhsX3+2*gapRhs1X, offsetRhsY3+2*gapRhs1-lengthZ, lengthZ, lengthZ, sgn3*2+zoffset3);
            let sqE3 = GridRectangle(offsetRhsX3+3*gapRhs1X, offsetRhsY3+3*gapRhs1-lengthE, lengthE, lengthE, sgn3*3+zoffset3);
            let sqD3 = GridRectangle(offsetRhsX3+4*gapRhs1X, offsetRhsY3+4*gapRhs1-lengthD, lengthD, lengthD, sgn3*4+zoffset3);
            let sqG3 = GridRectangle(offsetRhsX3+5*gapRhs1X, offsetRhsY3+5*gapRhs1-lengthG, lengthG, lengthG, sgn3*5+zoffset3);
            let sqB3 = GridRectangle(offsetRhsX3+6*gapRhs1X, offsetRhsY3+6*gapRhs1-lengthB, lengthB, lengthB, sgn3*6+zoffset3);
            let sqA3 = GridRectangle(offsetRhsX3+7*gapRhs1X, offsetRhsY3+7*gapRhs1-lengthA, lengthA, lengthA, sgn3*7+zoffset3);

            let midAQ = GridRectangle(offsetMidX, offsetMidY-lengthA, lengthQ, lengthA, 0);
            let midBQ = [];
            for (let i=0; i<3; i++) {
                midBQ.push(
                    GridRectangle(offsetMidX+gapMid1+gapMid2*i, offsetMidY-lengthA+gapMid2*i, lengthQ, lengthB, -i)
                );
            }
            midBQ = MultiObjects('polygon', midBQ);
            let midGQ = [];
            for (let i=0; i<5; i++) {
                midGQ.push(
                    GridRectangle(offsetMidX+gapMid1*2+gapMid2*i, offsetMidY-lengthA+gapMid2*i, lengthQ, lengthG, -i)
                );
            }
            midGQ = MultiObjects('polygon', midGQ);
            let midDQ = [];
            for (let i=0; i<7; i++) {
                midDQ.push(
                    GridRectangle(offsetMidX+gapMid1*3+gapMid2*i, offsetMidY-lengthA+gapMid2*i, lengthQ, lengthD, -i)
                );
            }
            midDQ = MultiObjects('polygon', midDQ);
            let midEQ = [];
            for (let i=0; i<9; i++) {
                midEQ.push(
                    GridRectangle(offsetMidX+gapMid1*4+gapMid2*i, offsetMidY-lengthA+gapMid2*i, lengthQ, lengthE, -i)
                );
            }
            midEQ = MultiObjects('polygon', midEQ);
            let midZQ = [];
            for (let i=0; i<11; i++) {
                midZQ.push(
                    GridRectangle(offsetMidX+gapMid1*5+gapMid2*i, offsetMidY-lengthA+gapMid2*i, lengthQ, lengthZ, -i)
                );
            }
            midZQ = MultiObjects('polygon', midZQ);
            let midHQ = [];
            for (let i=0; i<13; i++) {
                midHQ.push(
                    GridRectangle(offsetMidX+gapMid1*6+gapMid2*i, offsetMidY-lengthA+gapMid2*i, lengthQ, lengthH, -i)
                );
            }
            midHQ = MultiObjects('polygon', midHQ);
            let midQQ = [];
            for (let i=0; i<15; i++) {
                midQQ.push(
                    GridRectangle(offsetMidX+gapMid1*7+gapMid2*i, offsetMidY-lengthA+gapMid2*i, lengthQ, lengthQ, -i)
                );
            }
            midQQ = MultiObjects('polygon', midQQ);

            let inRhsAQ = GridRectangle(offsetRhsX3+7*gapRhs1X, offsetRhsY3+7*gapRhs1-lengthA, lengthQ, lengthA, sgn3*7+zoffset3);
            let inRhsBQ = MultiObjects(
                'polygon',[
                GridRectangle(offsetRhsX3+7*gapRhs1X+1*lengthQ, offsetRhsY3+7*gapRhs1-lengthA, lengthQ, lengthB, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+7*gapRhs1X+7*lengthQ, offsetRhsY3+7*gapRhs1-lengthB, lengthQ, lengthB, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X, offsetRhsY3+6*gapRhs1-lengthB, lengthQ, lengthB, sgn3*6+zoffset3)
            ]);
            let inRhsGQ = MultiObjects(
                'polygon',[
                GridRectangle(offsetRhsX3+7*gapRhs1X+2*lengthQ, offsetRhsY3+7*gapRhs1-lengthA, lengthQ, lengthG, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+7*gapRhs1X+6*lengthQ, offsetRhsY3+7*gapRhs1-lengthG, lengthQ, lengthG, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+1*lengthQ, offsetRhsY3+6*gapRhs1-lengthB, lengthQ, lengthG, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+6*lengthQ, offsetRhsY3+6*gapRhs1-lengthG, lengthQ, lengthG, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+5*gapRhs1X, offsetRhsY3+5*gapRhs1-lengthG, lengthQ, lengthG, sgn3*5+zoffset3),
            ]);
            let inRhsDQ = MultiObjects(
                'polygon',[
                GridRectangle(offsetRhsX3+7*gapRhs1X+3*lengthQ, offsetRhsY3+7*gapRhs1-lengthA, lengthQ, lengthD, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+7*gapRhs1X+5*lengthQ, offsetRhsY3+7*gapRhs1-lengthD, lengthQ, lengthD, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+2*lengthQ, offsetRhsY3+6*gapRhs1-lengthB, lengthQ, lengthD, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+5*lengthQ, offsetRhsY3+6*gapRhs1-lengthD, lengthQ, lengthD, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+5*gapRhs1X+1*lengthQ, offsetRhsY3+5*gapRhs1-lengthG, lengthQ, lengthD, sgn3*5+zoffset3),
                GridRectangle(offsetRhsX3+5*gapRhs1X+5*lengthQ, offsetRhsY3+5*gapRhs1-lengthD, lengthQ, lengthD, sgn3*5+zoffset3),
                GridRectangle(offsetRhsX3+4*gapRhs1X, offsetRhsY3+4*gapRhs1-lengthD, lengthQ, lengthD, sgn3*4+zoffset3),
            ]);
            let inRhsEQ = MultiObjects(
                'polygon',[
                GridRectangle(offsetRhsX3+7*gapRhs1X+4*lengthQ, offsetRhsY3+7*gapRhs1-lengthA, lengthQ, lengthE, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+7*gapRhs1X+4*lengthQ, offsetRhsY3+7*gapRhs1-lengthE, lengthQ, lengthE, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+3*lengthQ, offsetRhsY3+6*gapRhs1-lengthB, lengthQ, lengthE, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+4*lengthQ, offsetRhsY3+6*gapRhs1-lengthE, lengthQ, lengthE, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+5*gapRhs1X+2*lengthQ, offsetRhsY3+5*gapRhs1-lengthG, lengthQ, lengthE, sgn3*5+zoffset3),
                GridRectangle(offsetRhsX3+5*gapRhs1X+4*lengthQ, offsetRhsY3+5*gapRhs1-lengthE, lengthQ, lengthE, sgn3*5+zoffset3),
                GridRectangle(offsetRhsX3+4*gapRhs1X+1*lengthQ, offsetRhsY3+4*gapRhs1-lengthD, lengthQ, lengthE, sgn3*4+zoffset3),
                GridRectangle(offsetRhsX3+4*gapRhs1X+4*lengthQ, offsetRhsY3+4*gapRhs1-lengthE, lengthQ, lengthE, sgn3*4+zoffset3),
                GridRectangle(offsetRhsX3+3*gapRhs1X, offsetRhsY3+3*gapRhs1-lengthE, lengthQ, lengthE, sgn3*3+zoffset3),
            ]);
            let inRhsZQ = MultiObjects(
                'polygon',[
                GridRectangle(offsetRhsX3+7*gapRhs1X+5*lengthQ, offsetRhsY3+7*gapRhs1-lengthA, lengthQ, lengthZ, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+7*gapRhs1X+3*lengthQ, offsetRhsY3+7*gapRhs1-lengthZ, lengthQ, lengthZ, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+4*lengthQ, offsetRhsY3+6*gapRhs1-lengthB, lengthQ, lengthZ, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+3*lengthQ, offsetRhsY3+6*gapRhs1-lengthZ, lengthQ, lengthZ, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+5*gapRhs1X+3*lengthQ, offsetRhsY3+5*gapRhs1-lengthG, lengthQ, lengthZ, sgn3*5+zoffset3),
                GridRectangle(offsetRhsX3+5*gapRhs1X+3*lengthQ, offsetRhsY3+5*gapRhs1-lengthZ, lengthQ, lengthZ, sgn3*5+zoffset3),
                GridRectangle(offsetRhsX3+4*gapRhs1X+2*lengthQ, offsetRhsY3+4*gapRhs1-lengthD, lengthQ, lengthZ, sgn3*4+zoffset3),
                GridRectangle(offsetRhsX3+4*gapRhs1X+3*lengthQ, offsetRhsY3+4*gapRhs1-lengthZ, lengthQ, lengthZ, sgn3*4+zoffset3),
                GridRectangle(offsetRhsX3+3*gapRhs1X+1*lengthQ, offsetRhsY3+3*gapRhs1-lengthE, lengthQ, lengthZ, sgn3*3+zoffset3),
                GridRectangle(offsetRhsX3+3*gapRhs1X+3*lengthQ, offsetRhsY3+3*gapRhs1-lengthZ, lengthQ, lengthZ, sgn3*3+zoffset3),
                GridRectangle(offsetRhsX3+2*gapRhs1X, offsetRhsY3+2*gapRhs1-lengthZ, lengthQ, lengthZ, sgn3*2+zoffset3),
            ]);
            let inRhsHQ = MultiObjects(
                'polygon',[
                GridRectangle(offsetRhsX3+7*gapRhs1X+6*lengthQ, offsetRhsY3+7*gapRhs1-lengthA, lengthQ, lengthH, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+7*gapRhs1X+2*lengthQ, offsetRhsY3+7*gapRhs1-lengthH, lengthQ, lengthH, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+5*lengthQ, offsetRhsY3+6*gapRhs1-lengthB, lengthQ, lengthH, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+2*lengthQ, offsetRhsY3+6*gapRhs1-lengthH, lengthQ, lengthH, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+5*gapRhs1X+4*lengthQ, offsetRhsY3+5*gapRhs1-lengthG, lengthQ, lengthH, sgn3*5+zoffset3),
                GridRectangle(offsetRhsX3+5*gapRhs1X+2*lengthQ, offsetRhsY3+5*gapRhs1-lengthH, lengthQ, lengthH, sgn3*5+zoffset3),
                GridRectangle(offsetRhsX3+4*gapRhs1X+3*lengthQ, offsetRhsY3+4*gapRhs1-lengthD, lengthQ, lengthH, sgn3*4+zoffset3),
                GridRectangle(offsetRhsX3+4*gapRhs1X+2*lengthQ, offsetRhsY3+4*gapRhs1-lengthH, lengthQ, lengthH, sgn3*4+zoffset3),
                GridRectangle(offsetRhsX3+3*gapRhs1X+2*lengthQ, offsetRhsY3+3*gapRhs1-lengthE, lengthQ, lengthH, sgn3*3+zoffset3),
                GridRectangle(offsetRhsX3+3*gapRhs1X+2*lengthQ, offsetRhsY3+3*gapRhs1-lengthH, lengthQ, lengthH, sgn3*3+zoffset3),
                GridRectangle(offsetRhsX3+2*gapRhs1X+1*lengthQ, offsetRhsY3+2*gapRhs1-lengthZ, lengthQ, lengthH, sgn3*2+zoffset3),
                GridRectangle(offsetRhsX3+2*gapRhs1X+2*lengthQ, offsetRhsY3+2*gapRhs1-lengthH, lengthQ, lengthH, sgn3*2+zoffset3),
                GridRectangle(offsetRhsX3+gapRhs1X, offsetRhsY3+gapRhs1-lengthH, lengthQ, lengthH, sgn3*1+zoffset3),
            ]);
            let inRhsQQ = MultiObjects(
                'polygon',[
                GridRectangle(offsetRhsX3+7*gapRhs1X+7*lengthQ, offsetRhsY3+7*gapRhs1-lengthA, lengthQ, lengthQ, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+7*gapRhs1X+1*lengthQ, offsetRhsY3+7*gapRhs1-lengthQ, lengthQ, lengthQ, sgn3*7+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+6*lengthQ, offsetRhsY3+6*gapRhs1-lengthB, lengthQ, lengthQ, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+6*gapRhs1X+1*lengthQ, offsetRhsY3+6*gapRhs1-lengthQ, lengthQ, lengthQ, sgn3*6+zoffset3),
                GridRectangle(offsetRhsX3+5*gapRhs1X+5*lengthQ, offsetRhsY3+5*gapRhs1-lengthG, lengthQ, lengthQ, sgn3*5+zoffset3),
                GridRectangle(offsetRhsX3+5*gapRhs1X+1*lengthQ, offsetRhsY3+5*gapRhs1-lengthQ, lengthQ, lengthQ, sgn3*5+zoffset3),
                GridRectangle(offsetRhsX3+4*gapRhs1X+4*lengthQ, offsetRhsY3+4*gapRhs1-lengthD, lengthQ, lengthQ, sgn3*4+zoffset3),
                GridRectangle(offsetRhsX3+4*gapRhs1X+1*lengthQ, offsetRhsY3+4*gapRhs1-lengthQ, lengthQ, lengthQ, sgn3*4+zoffset3),
                GridRectangle(offsetRhsX3+3*gapRhs1X+3*lengthQ, offsetRhsY3+3*gapRhs1-lengthE, lengthQ, lengthQ, sgn3*3+zoffset3),
                GridRectangle(offsetRhsX3+3*gapRhs1X+1*lengthQ, offsetRhsY3+3*gapRhs1-lengthQ, lengthQ, lengthQ, sgn3*3+zoffset3),
                GridRectangle(offsetRhsX3+2*gapRhs1X+2*lengthQ, offsetRhsY3+2*gapRhs1-lengthZ, lengthQ, lengthQ, sgn3*2+zoffset3),
                GridRectangle(offsetRhsX3+2*gapRhs1X+1*lengthQ, offsetRhsY3+2*gapRhs1-lengthQ, lengthQ, lengthQ, sgn3*2+zoffset3),
                GridRectangle(offsetRhsX3+1*gapRhs1X+1*lengthQ, offsetRhsY3+1*gapRhs1-lengthH, lengthQ, lengthQ, sgn3*1+zoffset3),
                GridRectangle(offsetRhsX3+1*gapRhs1X+1*lengthQ, offsetRhsY3+1*gapRhs1-lengthQ, lengthQ, lengthQ, sgn3*1+zoffset3),
                GridRectangle(offsetRhsX3, offsetRhsY3-lengthQ, lengthQ, lengthQ, sgn3*0+zoffset3),
            ]);

            let result = {A:[Abot,Atop], 
                B:[Bbot,Btop], G:[Gbot,Gtop], D:[Dbot,Dtop], 
                E:[Ebot,Etop], Z:[Zbot,Ztop], H:[Hbot,Htop], Q:[Qbot,Qtop],
                I:[Btop,Itop], K:[Gtop,Ktop], L:[Dtop,Ltop], 
                M:[Etop,Mtop], N:[Ztop,Ntop], C:[Htop,Ctop], O:[Qtop,Otop],
                Btop, Gtop, Dtop, Etop, Ztop, Htop, Qtop,
                rectAA, 
                rectBB, rectIB, rectBI, rectII,  rectGG, rectKG, rectGK, rectKK,
                rectDD, rectLD, rectDL, rectLL,  rectEE, rectME, rectEM, rectMM,
                rectZZ, rectNZ, rectZN, rectNN,  rectHH, rectCH, rectHC, rectCC,
                rectQQ, rectOQ, rectQO, rectOO,
                sqA,
                longAQ, longBQ, longGQ, longDQ, longEQ, longZQ, longHQ, longQQ,
                sqQ1, sqH1, sqZ1, sqE1, sqD1, sqG1, sqB1, sqA1,
                sqQ2, sqH2, sqZ2, sqE2, sqD2, sqG2, sqB2, sqA2,
                sqQ3, sqH3, sqZ3, sqE3, sqD3, sqG3, sqB3, sqA3,
                midAQ, midBQ, midGQ, midDQ, midEQ, midZQ, midHQ, midQQ,
                inRhsAQ, inRhsBQ, inRhsGQ, inRhsDQ, inRhsEQ, inRhsZQ, inRhsHQ, inRhsQQ,
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

            Parallel(
                ChangeStyle(0, e.rectAA, 0xdddddd),
    
                ChangeStyle(0, e.rectBB, 0xdddddd),
                ChangeStyle(0, e.rectIB, 0xdddddd),
                ChangeStyle(0, e.rectBI, 0xdddddd),
                ChangeStyle(0, e.rectII, 0xdddddd),
    
                ChangeStyle(0, e.rectGG, 0xdddddd),
                ChangeStyle(0, e.rectKG, 0xdddddd),
                ChangeStyle(0, e.rectGK, 0xdddddd),
                ChangeStyle(0, e.rectKK, 0xdddddd),
    
                ChangeStyle(0, e.rectDD, 0xdddddd),
                ChangeStyle(0, e.rectLD, 0xdddddd),
                ChangeStyle(0, e.rectDL, 0xdddddd),
                ChangeStyle(0, e.rectLL, 0xdddddd),
    
                ChangeStyle(0, e.rectEE, 0xdddddd),
                ChangeStyle(0, e.rectME, 0xdddddd),
                ChangeStyle(0, e.rectEM, 0xdddddd),
                ChangeStyle(0, e.rectMM, 0xdddddd),
    
                ChangeStyle(0, e.rectZZ, 0xdddddd),
                ChangeStyle(0, e.rectNZ, 0xdddddd),
                ChangeStyle(0, e.rectZN, 0xdddddd),
                ChangeStyle(0, e.rectNN, 0xdddddd),
    
                ChangeStyle(0, e.rectHH, 0xdddddd),
                ChangeStyle(0, e.rectCH, 0xdddddd),
                ChangeStyle(0, e.rectHC, 0xdddddd),
                ChangeStyle(0, e.rectCC, 0xdddddd),
    
                ChangeStyle(0, e.rectQQ, 0xdddddd),
                ChangeStyle(0, e.rectOQ, 0xdddddd),
                ChangeStyle(0, e.rectQO, 0xdddddd),
                ChangeStyle(0, e.rectOO, 0xdddddd),

                ChangeStyle(0, e.sqA, 0xdddddd),
                
                ChangeStyle(0, e.longAQ, 0xdddddd),
                ChangeStyle(0, e.longBQ, 0xdddddd),
                ChangeStyle(0, e.longGQ, 0xdddddd),
                ChangeStyle(0, e.longDQ, 0xdddddd),
                ChangeStyle(0, e.longEQ, 0xdddddd),
                ChangeStyle(0, e.longZQ, 0xdddddd),
                ChangeStyle(0, e.longHQ, 0xdddddd),
                ChangeStyle(0, e.longQQ, 0xdddddd),

                ChangeStyle(0, e.sqA1, 0xdddddd),
                ChangeStyle(0, e.sqB1, 0xdddddd),
                ChangeStyle(0, e.sqG1, 0xdddddd),
                ChangeStyle(0, e.sqD1, 0xdddddd),
                ChangeStyle(0, e.sqE1, 0xdddddd),
                ChangeStyle(0, e.sqZ1, 0xdddddd),
                ChangeStyle(0, e.sqH1, 0xdddddd),
                ChangeStyle(0, e.sqQ1, 0xdddddd),

                ChangeStyle(0, e.sqA2, 0xdddddd),
                ChangeStyle(0, e.sqB2, 0xdddddd),
                ChangeStyle(0, e.sqG2, 0xdddddd),
                ChangeStyle(0, e.sqD2, 0xdddddd),
                ChangeStyle(0, e.sqE2, 0xdddddd),
                ChangeStyle(0, e.sqZ2, 0xdddddd),
                ChangeStyle(0, e.sqH2, 0xdddddd),
                ChangeStyle(0, e.sqQ2, 0xdddddd),
                
                ChangeStyle(0, e.sqA3, 0xdddddd),
                ChangeStyle(0, e.sqB3, 0xdddddd),
                ChangeStyle(0, e.sqG3, 0xdddddd),
                ChangeStyle(0, e.sqD3, 0xdddddd),
                ChangeStyle(0, e.sqE3, 0xdddddd),
                ChangeStyle(0, e.sqZ3, 0xdddddd),
                ChangeStyle(0, e.sqH3, 0xdddddd),
                ChangeStyle(0, e.sqQ3, 0xdddddd),
            )
        ),
        [
            (e) => Sequential(
                ChangeCamera(400, {scale: 16, centerY: -6}),
                Parallel(
                    Show(200, e.rectQQ),
                    Show(200, e.rectOQ),
                    Show(200, e.rectQO),
                    Show(200, e.rectOO),
                ),
                Parallel(
                    Show(200, e.rectHH),
                    Show(200, e.rectCH),
                    Show(200, e.rectHC),
                    Show(200, e.rectCC),
                ),
                Parallel(
                    Show(200, e.rectZZ),
                    Show(200, e.rectNZ),
                    Show(200, e.rectZN),
                    Show(200, e.rectNN),
                ),
                Parallel(
                    Show(200, e.rectEE),
                    Show(200, e.rectME),
                    Show(200, e.rectEM),
                    Show(200, e.rectMM),
                ),
                Parallel(
                    Show(200, e.rectDD),
                    Show(200, e.rectLD),
                    Show(200, e.rectDL),
                    Show(200, e.rectLL),
                ),
                Parallel(
                    Show(200, e.rectGG),
                    Show(200, e.rectKG),
                    Show(200, e.rectGK),
                    Show(200, e.rectKK),
                ),
                Parallel(
                    Show(200, e.rectBB),
                    Show(200, e.rectIB),
                    Show(200, e.rectBI),
                    Show(200, e.rectII),
                ),
                Show(200, e.rectAA),
                Show(200, e.sqA),
                Parallel(
                    Show(200, e.longAQ),
                    Show(200, e.longBQ),
                    Show(200, e.longGQ),
                    Show(200, e.longDQ),
                    Show(200, e.longEQ),
                    Show(200, e.longZQ),
                    Show(200, e.longHQ),
                    Show(200, e.longQQ),
                ),
                Show(200, e.sqA3),
                Show(200, e.sqB3),
                Show(200, e.sqG3),
                Show(200, e.sqD3),
                Show(200, e.sqE3),
                Show(200, e.sqZ3),
                Show(200, e.sqH3),
                Show(200, e.sqQ3),
                
                Show(200, e.sqA2),
                Show(200, e.sqB2),
                Show(200, e.sqG2),
                Show(200, e.sqD2),
                Show(200, e.sqE2),
                Show(200, e.sqZ2),
                Show(200, e.sqH2),
                Show(200, e.sqQ2),

                Show(200, e.sqA1),
                Show(200, e.sqB1),
                Show(200, e.sqG1),
                Show(200, e.sqD1),
                Show(200, e.sqE1),
                Show(200, e.sqZ1),
                Show(200, e.sqH1),
                Show(200, e.sqQ1),
            ),
            // 1 -> 2
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.rectAA, 'red'),
                    ChangeStyle(200, e.sqA, 'red'),
                    ChangeStyle(200, e.sqA1, 'red'),
                    ChangeStyle(200, e.sqA2, 'red')
                ),
                Parallel(
                    Hide(200, e.rectAA),
                    Hide(200, e.sqA),
                    Hide(200, e.sqA1),
                    Hide(200, e.sqA2),
                ),
                Parallel(
                    ChangeStyle(200, e.rectBB, 'red'),
                    ChangeStyle(200, e.rectII, 'red'),
                    ChangeStyle(200, e.sqB1, 'red'),
                    ChangeStyle(200, e.sqQ1, 'red')
                ),
                Parallel(
                    Hide(200, e.rectBB),
                    Hide(200, e.rectII),
                    Hide(200, e.sqB1),
                    Hide(200, e.sqQ1),
                ),
                Parallel(
                    ChangeStyle(200, e.rectGG, 'red'),
                    ChangeStyle(200, e.rectKK, 'red'),
                    ChangeStyle(200, e.sqG1, 'red'),
                    ChangeStyle(200, e.sqH1, 'red')
                ),
                Parallel(
                    Hide(200, e.rectGG),
                    Hide(200, e.rectKK),
                    Hide(200, e.sqG1),
                    Hide(200, e.sqH1),
                ),
                Parallel(
                    ChangeStyle(200, e.rectDD, 'red'),
                    ChangeStyle(200, e.rectLL, 'red'),
                    ChangeStyle(200, e.sqD1, 'red'),
                    ChangeStyle(200, e.sqZ1, 'red')
                ),
                Parallel(
                    Hide(200, e.rectDD),
                    Hide(200, e.rectLL),
                    Hide(200, e.sqD1),
                    Hide(200, e.sqZ1),
                ),
                Parallel(
                    ChangeStyle(200, e.rectEE, 'red'),
                    ChangeStyle(200, e.rectMM, 'red'),
                    ChangeStyle(200, e.sqE1, 'red'),
                    ChangeStyle(200, e.sqE2, 'red')
                ),
                Parallel(
                    Hide(200, e.rectEE),
                    Hide(200, e.rectMM),
                    Hide(200, e.sqE1),
                    Hide(200, e.sqE2),
                ),
                Parallel(
                    ChangeStyle(200, e.rectZZ, 'red'),
                    ChangeStyle(200, e.rectNN, 'red'),
                    ChangeStyle(200, e.sqZ2, 'red'),
                    ChangeStyle(200, e.sqD2, 'red')
                ),
                Parallel(
                    Hide(200, e.rectZZ),
                    Hide(200, e.rectNN),
                    Hide(200, e.sqZ2),
                    Hide(200, e.sqD2),
                ),
                Parallel(
                    ChangeStyle(200, e.rectHH, 'red'),
                    ChangeStyle(200, e.rectCC, 'red'),
                    ChangeStyle(200, e.sqH2, 'red'),
                    ChangeStyle(200, e.sqG2, 'red')
                ),
                Parallel(
                    Hide(200, e.rectHH),
                    Hide(200, e.rectCC),
                    Hide(200, e.sqH2),
                    Hide(200, e.sqG2),
                ),
                Parallel(
                    ChangeStyle(200, e.rectQQ, 'red'),
                    ChangeStyle(200, e.rectOO, 'red'),
                    ChangeStyle(200, e.sqQ2, 'red'),
                    ChangeStyle(200, e.sqB2, 'red')
                ),
                Parallel(
                    Hide(200, e.rectQQ),
                    Hide(200, e.rectOO),
                    Hide(200, e.sqQ2),
                    Hide(200, e.sqB2),
                ),
            ),
            // 2 -> 3
            (e) => Sequential(
                ChangeParams(500, {offsetRectY: 8, offsetLongY: 8}),

                ChangeStyle(0, e.midAQ, 'red'),
                Parallel(
                    ChangeStyle(200, e.longAQ, 'red'),
                    Show(200, e.midAQ)
                ),
                Parallel(
                    Hide(200, e.longAQ),
                    ChangeStyle(200, e.midAQ, 0xdddddd),
                ),
                
                ChangeStyle(0, e.midBQ, 'red'),
                Parallel(
                    ChangeStyle(200, e.rectBI, 'red'),
                    ChangeStyle(200, e.rectIB, 'red'),
                    ChangeStyle(200, e.longBQ, 'red'),
                    Show(200, e.midBQ)
                ),
                Parallel(
                    Hide(200, e.rectBI),
                    Hide(200, e.rectIB),
                    Hide(200, e.longBQ),
                    ChangeStyle(200, e.midBQ, 0xdddddd),
                ),
                
                ChangeStyle(0, e.midGQ, 'red'),
                Parallel(
                    ChangeStyle(200, e.rectGK, 'red'),
                    ChangeStyle(200, e.rectKG, 'red'),
                    ChangeStyle(200, e.longGQ, 'red'),
                    Show(200, e.midGQ)
                ),
                Parallel(
                    Hide(200, e.rectGK),
                    Hide(200, e.rectKG),
                    Hide(200, e.longGQ),
                    ChangeStyle(200, e.midGQ, 0xdddddd),
                ),
                
                ChangeStyle(0, e.midDQ, 'red'),
                Parallel(
                    ChangeStyle(200, e.rectDL, 'red'),
                    ChangeStyle(200, e.rectLD, 'red'),
                    ChangeStyle(200, e.longDQ, 'red'),
                    Show(200, e.midDQ)
                ),
                Parallel(
                    Hide(200, e.rectDL),
                    Hide(200, e.rectLD),
                    Hide(200, e.longDQ),
                    ChangeStyle(200, e.midDQ, 0xdddddd),
                ),
                
                ChangeStyle(0, e.midEQ, 'red'),
                Parallel(
                    ChangeStyle(200, e.rectEM, 'red'),
                    ChangeStyle(200, e.rectME, 'red'),
                    ChangeStyle(200, e.longEQ, 'red'),
                    Show(200, e.midEQ)
                ),
                Parallel(
                    Hide(200, e.rectEM),
                    Hide(200, e.rectME),
                    Hide(200, e.longEQ),
                    ChangeStyle(200, e.midEQ, 0xdddddd),
                ),
                
                ChangeStyle(0, e.midZQ, 'red'),
                Parallel(
                    ChangeStyle(200, e.rectZN, 'red'),
                    ChangeStyle(200, e.rectNZ, 'red'),
                    ChangeStyle(200, e.longZQ, 'red'),
                    Show(200, e.midZQ)
                ),
                Parallel(
                    Hide(200, e.rectZN),
                    Hide(200, e.rectNZ),
                    Hide(200, e.longZQ),
                    ChangeStyle(200, e.midZQ, 0xdddddd),
                ),
                
                ChangeStyle(0, e.midHQ, 'red'),
                Parallel(
                    ChangeStyle(200, e.rectHC, 'red'),
                    ChangeStyle(200, e.rectCH, 'red'),
                    ChangeStyle(200, e.longHQ, 'red'),
                    Show(200, e.midHQ)
                ),
                Parallel(
                    Hide(200, e.rectHC),
                    Hide(200, e.rectCH),
                    Hide(200, e.longHQ),
                    ChangeStyle(200, e.midHQ, 0xdddddd),
                ),
                
                ChangeStyle(0, e.midQQ, 'red'),
                Parallel(
                    ChangeStyle(200, e.rectQO, 'red'),
                    ChangeStyle(200, e.rectOQ, 'red'),
                    ChangeStyle(200, e.longQQ, 'red'),
                    Show(200, e.midQQ)
                ),
                Parallel(
                    Hide(200, e.rectQO),
                    Hide(200, e.rectOQ),
                    Hide(200, e.longQQ),
                    ChangeStyle(200, e.midQQ, 0xdddddd),
                ),

                Parallel(
                    ChangeStyle(0, e.rectBI, 0xdddddd),
                    ChangeStyle(0, e.rectIB, 0xdddddd),
                    ChangeStyle(0, e.rectGK, 0xdddddd),
                    ChangeStyle(0, e.rectKG, 0xdddddd),
                    ChangeStyle(0, e.rectDL, 0xdddddd),
                    ChangeStyle(0, e.rectLD, 0xdddddd),
                    ChangeStyle(0, e.rectEM, 0xdddddd),
                    ChangeStyle(0, e.rectME, 0xdddddd),
                    ChangeStyle(0, e.rectZN, 0xdddddd),
                    ChangeStyle(0, e.rectNZ, 0xdddddd),
                    ChangeStyle(0, e.rectHC, 0xdddddd),
                    ChangeStyle(0, e.rectCH, 0xdddddd),
                    ChangeStyle(0, e.rectQO, 0xdddddd),
                    ChangeStyle(0, e.rectOQ, 0xdddddd),

                    ChangeStyle(0, e.longAQ, 0xdddddd),
                    ChangeStyle(0, e.longBQ, 0xdddddd),
                    ChangeStyle(0, e.longGQ, 0xdddddd),
                    ChangeStyle(0, e.longDQ, 0xdddddd),
                    ChangeStyle(0, e.longEQ, 0xdddddd),
                    ChangeStyle(0, e.longZQ, 0xdddddd),
                    ChangeStyle(0, e.longHQ, 0xdddddd),
                    ChangeStyle(0, e.longQQ, 0xdddddd),
                ),

                Parallel(
                    Show(200, e.rectBI),
                    Show(200, e.rectIB),
                    Show(200, e.rectGK),
                    Show(200, e.rectKG),
                    Show(200, e.rectDL),
                    Show(200, e.rectLD),
                    Show(200, e.rectEM),
                    Show(200, e.rectME),
                    Show(200, e.rectZN),
                    Show(200, e.rectNZ),
                    Show(200, e.rectHC),
                    Show(200, e.rectCH),
                    Show(200, e.rectQO),
                    Show(200, e.rectOQ),

                    Show(200, e.longAQ),
                    Show(200, e.longBQ),
                    Show(200, e.longGQ),
                    Show(200, e.longDQ),
                    Show(200, e.longEQ),
                    Show(200, e.longZQ),
                    Show(200, e.longHQ),
                    Show(200, e.longQQ),
                )
            ),
            // 3 -> 4
            (e) => Sequential(
                Parallel(
                    ChangeStyle(0, e.inRhsAQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsBQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsGQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsDQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsEQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsZQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsHQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsQQ, 0xdddddd),
                ),
                // ChangeParams(500, {gapRhs1X: 6, offsetRhsX: -20}),
                ChangeParams(0, {switchFlipSq3: 1}),
                Parallel(
                    ChangeParams(500, {gapRhs1X: 3, offsetRhsX: -10}),
                    Hide(500, e.sqA3),
                    Hide(500, e.sqB3),
                    Hide(500, e.sqG3),
                    Hide(500, e.sqD3),
                    Hide(500, e.sqE3),
                    Hide(500, e.sqZ3),
                    Hide(500, e.sqH3),
                    Hide(500, e.sqQ3),

                    Show(500, e.inRhsAQ),
                    Show(500, e.inRhsBQ),
                    Show(500, e.inRhsGQ),
                    Show(500, e.inRhsDQ),
                    Show(500, e.inRhsEQ),
                    Show(500, e.inRhsZQ),
                    Show(500, e.inRhsHQ),
                    Show(500, e.inRhsQQ),
                ),

                Parallel(
                    ChangeStyle(500, e.inRhsAQ, 'red'),
                    ChangeStyle(500, e.midAQ, 'red')
                ),
                Parallel(
                    Hide(500, e.inRhsAQ),
                    ChangeStyle(500, e.midAQ, 0xdddddd)
                ),

                Parallel(
                    ChangeStyle(500, e.inRhsBQ, 'red'),
                    ChangeStyle(500, e.midBQ, 'red')
                ),
                Parallel(
                    Hide(500, e.inRhsBQ),
                    ChangeStyle(500, e.midBQ, 0xdddddd)
                ),

                Parallel(
                    ChangeStyle(500, e.inRhsGQ, 'red'),
                    ChangeStyle(500, e.midGQ, 'red')
                ),
                Parallel(
                    Hide(500, e.inRhsGQ),
                    ChangeStyle(500, e.midGQ, 0xdddddd)
                ),

                Parallel(
                    ChangeStyle(500, e.inRhsDQ, 'red'),
                    ChangeStyle(500, e.midDQ, 'red')
                ),
                Parallel(
                    Hide(500, e.inRhsDQ),
                    ChangeStyle(500, e.midDQ, 0xdddddd)
                ),

                Parallel(
                    ChangeStyle(500, e.inRhsEQ, 'red'),
                    ChangeStyle(500, e.midEQ, 'red')
                ),
                Parallel(
                    Hide(500, e.inRhsEQ),
                    ChangeStyle(500, e.midEQ, 0xdddddd)
                ),

                Parallel(
                    ChangeStyle(500, e.inRhsZQ, 'red'),
                    ChangeStyle(500, e.midZQ, 'red')
                ),
                Parallel(
                    Hide(500, e.inRhsZQ),
                    ChangeStyle(500, e.midZQ, 0xdddddd)
                ),

                Parallel(
                    ChangeStyle(500, e.inRhsHQ, 'red'),
                    ChangeStyle(500, e.midHQ, 'red')
                ),
                Parallel(
                    Hide(500, e.inRhsHQ),
                    ChangeStyle(500, e.midHQ, 0xdddddd)
                ),

                Parallel(
                    ChangeStyle(500, e.inRhsQQ, 'red'),
                    ChangeStyle(500, e.midQQ, 'red')
                ),
                Parallel(
                    Hide(500, e.inRhsQQ),
                    ChangeStyle(500, e.midQQ, 0xdddddd)
                ),

                Parallel(
                    ChangeStyle(0, e.inRhsAQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsBQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsGQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsDQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsEQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsZQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsHQ, 0xdddddd),
                    ChangeStyle(0, e.inRhsQQ, 0xdddddd),
                ),
                Parallel(
                    Show(200, e.inRhsAQ),
                    Show(200, e.inRhsBQ),
                    Show(200, e.inRhsGQ),
                    Show(200, e.inRhsDQ),
                    Show(200, e.inRhsEQ),
                    Show(200, e.inRhsZQ),
                    Show(200, e.inRhsHQ),
                    Show(200, e.inRhsQQ),
                )
            )
        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', 
            Z:'Ζ', H:'Η', Q:'Θ', I:'Ι', K:'Κ',
            L:'Λ', M:'Μ', N:'Ν', C:'Ξ', O:'Ο'
        }
    ),
    Prop11: new DynamicDiagramConfiguration(
        4,
        new CameraSetting(
            5,
            3.5, 3.6, 0
        ),
        {
            lengthNC: 2,
            lengthAF: 4,
            lengthBetweenLines: 1.2,
            offsetXlhsUp: -10, offsetYlhsUp: -2, 
            offsetXmidUp: -0.5, offsetYmidUp:-2, 
            offsetXrhsUp: 9, offsetYrhsUp:-2,

            offsetXlhsDown: -10, offsetYlhsDown: -12,
            offsetXmidDown: -0.5, offsetYmidDown: -12, 
            offsetXrhsDown: 9, offsetYrhsDown: -12,

            gapBtwSquares: 0.25,
            gapInMid: 2,

            shiftXrhsPt1:0, shiftXmidPt1: 0, shiftXlhsPt1: 0,
            shiftYPt2:0,
            shiftXrhsPt2: 0, shiftXmidPt2: 0, shiftXlhsPt2: 0,
            switchPt2: 0,
            switch1to3: 0
        },
        function (params) {
            let {
                lengthNC, lengthAF, lengthBetweenLines,
                offsetXlhsUp, offsetYlhsUp,  offsetXmidUp, offsetYmidUp,  offsetXrhsUp, offsetYrhsUp,
                offsetXlhsDown, offsetYlhsDown,  offsetXmidDown, offsetYmidDown,  offsetXrhsDown, offsetYrhsDown,
                gapBtwSquares, gapInMid,
                shiftXrhsPt1, shiftXmidPt1, shiftXlhsPt1,
                shiftYPt2,
                shiftXrhsPt2, shiftXmidPt2, shiftXlhsPt2,
                switchPt2,
                switch1to3,
            } = params;

            let a = lengthNC;
            let b = lengthBetweenLines;
            let nLines = 7;
            let d = lengthAF/(nLines-1);
            let lengthAB = lengthNC+lengthAF;

            let B = Vector();
            let bottoms = [B];
            for (let i=1; i<nLines; i++) {
                bottoms.push( B.shift(i*b) );
            }
            let tops = [];
            for (let i=0; i<nLines; i++) {
                tops.push( bottoms[i].shift(0, a+(nLines-1)*d) );
            }
            let diags = [tops[0]];
            for (let i=1; i<nLines; i++) {
                diags.push( bottoms[i].shift(0, a+(nLines-1-i)*d) );
            }
            let mids = [];
            for (let i=0; i<nLines; i++) {
                mids.push( bottoms[i].shift(0, a) );
            }

            let [A, O, P, R, S, T, Y] = tops;
            let    [G, E, H, I, L, N] = diags.slice(1);
            let [F, X, Ps,W, Sm,Qp  ] = mids.slice(0, -1);
            let    [D, Z, Q, K, M, C] = bottoms.slice(1);

            let lhsUps = [];
            let lhsUpDots = [];
            for (let i=0; i<nLines; i++) {
                lhsUps.push(
                    GridRectangle(offsetXlhsUp+i*gapBtwSquares, offsetYlhsUp-i*gapBtwSquares-lengthAB, lengthAB, lengthAB, -i)
                );
                lhsUpDots.push(
                    Vector(offsetXlhsUp+i*gapBtwSquares+lengthAF, offsetYlhsUp-i*gapBtwSquares, -i),
                    Vector(offsetXlhsUp+i*gapBtwSquares, offsetYlhsUp-i*gapBtwSquares-lengthAF, -i)
                );
            }
            lhsUps = MultiObjects('polygon', lhsUps);
            lhsUpDots = MultiObjects('point', lhsUpDots);
            
            let midIdx=  (nLines-(nLines%2))/2;
            let midUps = [];
            let midUpDots = [];
            for (let i=0; i<nLines; i++) {
                midUps.push(
                    GridRectangle(offsetXmidUp+i*gapBtwSquares, offsetYmidUp-i*gapBtwSquares-lengthAB, lengthAB, lengthAB, -i)
                );
                midUpDots.push(
                    Vector(offsetXmidUp+i*gapBtwSquares+lengthAF, offsetYmidUp-i*gapBtwSquares, -i),
                    Vector(offsetXmidUp+i*gapBtwSquares, offsetYmidUp-i*gapBtwSquares-lengthAF, -i)
                )
            }
            let midUp = midUps[midIdx]; midUps.splice(midIdx, 1)
            midUps = MultiObjects('polygon', midUps);
            midUpDots = MultiObjects('point', midUpDots);

            let rhsUps = [];
            let rhsUpDots = [];
            for (let i=0; i<nLines; i++) {
                rhsUps.push(
                    GridRectangle(offsetXrhsUp+i*gapBtwSquares, offsetYrhsUp-i*gapBtwSquares-lengthAB, lengthAB, lengthAB, -i)
                );
                rhsUpDots.push(
                    Vector(offsetXrhsUp+i*gapBtwSquares+lengthAF, offsetYrhsUp-i*gapBtwSquares, -i),
                    Vector(offsetXrhsUp+i*gapBtwSquares, offsetYrhsUp-i*gapBtwSquares-lengthAF, -i)
                );
            }
            rhsUps = MultiObjects('polygon', rhsUps);
            rhsUpDots = MultiObjects('point', rhsUpDots);

            let lhsDowns00 = [];
            let lhsDowns01 = [];
            let lhsDowns10 = [];
            let lhsDowns11 = [];
            let lhsDownDots = [];
            let lhsDownCmpls = [];
            let lhsDown2of3 = [];
            for (let i=1; i<nLines; i++) {
                lhsDowns00.push(
                    GridRectangle(
                        offsetXlhsDown+i*gapBtwSquares +(nLines-1)*d,
                        offsetYlhsDown-i*gapBtwSquares -lengthAB,
                        a, a, -i
                    )
                );
                lhsDowns01.push(
                    GridRectangle(
                        offsetXlhsDown+i*gapBtwSquares +(nLines-1)*d   +shiftXlhsPt1,
                        offsetYlhsDown-i*gapBtwSquares -(nLines-1)*d,
                        a, i*d, -i
                    )
                );
                lhsDowns10.push(
                    GridRectangle(
                        offsetXlhsDown+i*gapBtwSquares +(nLines-1-i)*d    +shiftXlhsPt1,
                        offsetYlhsDown-i*gapBtwSquares -lengthAB,
                        i*d, a, -i
                    )
                );
                lhsDowns11.push(
                    GridRectangle(
                        offsetXlhsDown+((1-switchPt2)*i + switchPt2*(2*nLines-i))*gapBtwSquares +(nLines-1-i)*d   +shiftXlhsPt2,
                        offsetYlhsDown-i*gapBtwSquares -(nLines-1)*d    +shiftYPt2,
                        i*d, i*d, -i
                    )
                );
                lhsDownDots.push(
                    Vector(offsetXlhsDown+i*gapBtwSquares+(nLines-1)*d, offsetYlhsDown-i*gapBtwSquares-(nLines-1-i)*d, -i),
                    Vector(offsetXlhsDown+i*gapBtwSquares+(nLines-1-i)*d, offsetYlhsDown-i*gapBtwSquares -(nLines-1)*d, -i)
                );
                lhsDownCmpls.push(
                    GridRectangle(
                        offsetXlhsDown+i*gapBtwSquares +(nLines-1)*d   +shiftXlhsPt1,
                        offsetYlhsDown-i*gapBtwSquares -(nLines-1-i)*d,
                        a, (nLines-i)*d, -i
                    )
                );
                lhsDown2of3.push(
                    GridRectangle(
                        offsetXlhsDown+((1-switchPt2)*i + switchPt2*(2*nLines-i))*gapBtwSquares
                            +(nLines-1-i)*d   +shiftXlhsPt2  + gapBtwSquares,
                        offsetYlhsDown-i*gapBtwSquares -(nLines-1)*d    +shiftYPt2 + 3*gapBtwSquares,
                        i*d, i*d, -i  - nLines
                    ),
                    GridRectangle(
                        offsetXlhsDown+((1-switchPt2)*i + switchPt2*(2*nLines-i))*gapBtwSquares
                            +(nLines-1-i)*d   +shiftXlhsPt2  + 2*gapBtwSquares,
                        offsetYlhsDown-i*gapBtwSquares -(nLines-1)*d    +shiftYPt2 + 6*gapBtwSquares,
                        i*d, i*d, -i  - 2*nLines
                    ),

                )
            }
            lhsDowns00 = MultiObjects('polygon', lhsDowns00);
            lhsDowns01 = MultiObjects('polygon', lhsDowns01);
            lhsDowns10 = MultiObjects('polygon', lhsDowns10);
            lhsDowns11 = MultiObjects('polygon', lhsDowns11);
            lhsDownDots = MultiObjects('point', lhsDownDots);
            lhsDownCmpls = MultiObjects('polygon', lhsDownCmpls);
            lhsDown2of3 = MultiObjects('polygon', lhsDown2of3);
            
            let midDowns00 = [];
            let midDowns01 = [];
            let midDowns1of3 = [];
            let midDowns2of3 = [];
            for (let i=0; i<nLines; i++) {
                midDowns00.push(
                    GridRectangle(
                        offsetXmidDown+i*gapBtwSquares,
                        offsetYmidDown-i*gapBtwSquares -lengthAB,
                        a, a, -i
                    )
                );
                midDowns01.push(
                    GridRectangle(
                        offsetXmidDown+i*gapBtwSquares    +shiftXmidPt1,
                        offsetYmidDown-i*gapBtwSquares -lengthAF,
                        a, lengthAF, -i
                    )
                );
                midDowns1of3.push(
                    GridRectangle(
                        offsetXmidDown+i*gapBtwSquares+gapInMid  +shiftXmidPt2,
                        offsetYmidDown-i*gapBtwSquares -lengthAF +shiftYPt2,
                        lengthAF*(switch1to3+(1-switch1to3)/3), lengthAF, -i
                    )
                );
                midDowns2of3.push(
                    GridRectangle(
                        offsetXmidDown+i*gapBtwSquares+gapInMid+lengthAF/3 +shiftXmidPt2,
                        offsetYmidDown-i*gapBtwSquares -lengthAF + shiftYPt2,
                        lengthAF/3, lengthAF, -i
                    ),
                    GridRectangle(
                        offsetXmidDown+i*gapBtwSquares+gapInMid+2*lengthAF/3  +shiftXmidPt2,
                        offsetYmidDown-i*gapBtwSquares -lengthAF + shiftYPt2,
                        lengthAF/3, lengthAF, -i
                    )
                );
            }
            let midDown00 = midDowns00[midIdx]; midDowns00.splice(midIdx, 1);
            midDowns00 = MultiObjects('polygon', midDowns00);
            let midDown01 = midDowns01[midIdx]; midDowns01.splice(midIdx, 1);
            midDowns01 = MultiObjects('polygon', midDowns01);
            let midDown1of3 = midDowns1of3[midIdx]; midDowns1of3.splice(midIdx, 1);
            midDowns1of3 = MultiObjects('polygon', midDowns1of3);
            let midDown2of3 = MultiObjects('polygon', midDowns2of3.splice(2*midIdx, 2));
            midDowns2of3 = MultiObjects('polygon', midDowns2of3);

            let rhsDowns00 = [];
            let rhsDowns01 = [];
            let rhsDowns10 = [];
            let rhsDowns11 = [];
            let rhsDownDots = [];
            let rhsDownCmpls = [];
            let rhsDown2of3 = [];
            for (let i=0; i<nLines-1; i++) {
                rhsDowns00.push(
                    GridRectangle(
                        offsetXrhsDown+i*gapBtwSquares +(nLines-1)*d,  offsetYrhsDown-i*gapBtwSquares -lengthAB,
                        a, a, -i
                    )
                );
                rhsDownCmpls.push(
                    GridRectangle(
                        offsetXrhsDown+i*gapBtwSquares +(nLines-1)*d   +shiftXrhsPt1,
                        offsetYrhsDown-i*gapBtwSquares -(nLines-i-1)*d,
                        a, (nLines-i-1)*d, -i
                    )
                );
                if (i == 0) {continue;}
                rhsDowns01.push(
                    GridRectangle(
                        offsetXrhsDown+i*gapBtwSquares +(nLines-1)*d + shiftXrhsPt1,
                        offsetYrhsDown-i*gapBtwSquares -(nLines-1)*d,
                        a, i*d, -i
                    )
                );
                rhsDowns10.push(
                    GridRectangle(
                        offsetXrhsDown+i*gapBtwSquares +(nLines-1-i)*d + shiftXrhsPt1,
                        offsetYrhsDown-i*gapBtwSquares -lengthAB,
                        i*d, a, -i
                    )
                );
                rhsDowns11.push(
                    GridRectangle(
                        offsetXrhsDown+(((1-switchPt2)*i + switchPt2*(2*nLines-i))*gapBtwSquares) +(nLines-1-i)*d + shiftXrhsPt2,
                        offsetYrhsDown-i*gapBtwSquares -(nLines-1)*d + shiftYPt2,
                        i*d, i*d, -i
                    )
                );
                rhsDownDots.push(
                    Vector(offsetXrhsDown+i*gapBtwSquares+(nLines-1)*d, offsetYrhsDown-i*gapBtwSquares-(nLines-1-i)*d, -i),
                    Vector(offsetXrhsDown+i*gapBtwSquares+(nLines-1-i)*d, offsetYrhsDown-i*gapBtwSquares -(nLines-1)*d, -i)
                );
                rhsDown2of3.push(
                    GridRectangle(
                        offsetXrhsDown+(((1-switchPt2)*i + switchPt2*(2*nLines-i))*gapBtwSquares)
                            +(nLines-1-i)*d + shiftXrhsPt2 + gapBtwSquares,
                        offsetYrhsDown-i*gapBtwSquares -(nLines-1)*d + shiftYPt2 + 3*gapBtwSquares,
                        i*d, i*d, -i - nLines
                    ),
                    GridRectangle(
                        offsetXrhsDown+(((1-switchPt2)*i + switchPt2*(2*nLines-i))*gapBtwSquares)
                            +(nLines-1-i)*d + shiftXrhsPt2 + 2*gapBtwSquares,
                        offsetYrhsDown-i*gapBtwSquares -(nLines-1)*d + shiftYPt2 +6*gapBtwSquares,
                        i*d, i*d, -i - 2*nLines
                    ),
                )
            }
            rhsDowns00 = MultiObjects('polygon', rhsDowns00);
            rhsDowns01 = MultiObjects('polygon', rhsDowns01);
            rhsDowns10 = MultiObjects('polygon', rhsDowns10);
            rhsDowns11 = MultiObjects('polygon', rhsDowns11);
            rhsDownDots = MultiObjects('point', rhsDownDots);
            rhsDownCmpls = MultiObjects('polygon', rhsDownCmpls);
            rhsDown2of3 = MultiObjects('polygon', rhsDown2of3);

            let result = {
                A, O, P, R, S, T, Y,
                   G, E, H, I, L, N,
                F, X, Ps,W, Sm,Qp,
                B, D, Z, Q, K, M, C,
                AB:[A,B], GO:[G,O], EP:[E,P], HR:[H,R], IS:[I,S], LT:[L,T], NY:[N,Y],
                          GD:[G,D], EZ:[E,Z], HQ:[H,Q], IK:[I,K], LM:[L,M], NC:[N,C],
                lhsUps, lhsUpDots,  midUp, midUps, midUpDots,  rhsUps, rhsUpDots,
                lhsDowns00, lhsDowns01, lhsDowns11, lhsDowns10,  lhsDownDots,
                midDowns00, midDowns01, midDowns1of3, midDowns2of3,
                midDown00, midDown01, midDown1of3, midDown2of3,
                rhsDowns00, rhsDowns01, rhsDowns10, rhsDowns11, rhsDownDots,

                lhsDownCmpls, rhsDownCmpls,
                lhsDown2of3, rhsDown2of3,
            };
            return result;
        },
        (e) => Sequential(
            Show(0, e.A),
            Show(0, e.G),
            Show(0, e.E),
            Show(0, e.H),
            Show(0, e.I),
            Show(0, e.L),
            Show(0, e.N),
            Parallel(
                Draw(300, e.AB),
                Draw(300, e.GD),
                Draw(300, e.EZ),
                Draw(300, e.HQ),
                Draw(300, e.IK),
                Draw(300, e.LM),
                Draw(300, e.NC),
            ),
            Show(0, e.B),
            Show(0, e.D),
            Show(0, e.Z),
            Show(0, e.Q),
            Show(0, e.K),
            Show(0, e.M),
            Show(0, e.C),
            Parallel(
                Draw(300, e.GO),
                Draw(300, e.EP),
                Draw(300, e.HR),
                Draw(300, e.IS),
                Draw(300, e.LT),
                Draw(300, e.NY),
            ),
            Show(0, e.O),
            Show(0, e.P),
            Show(0, e.R),
            Show(0, e.S),
            Show(0, e.T),
            Show(0, e.Y),
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Parallel(
                    ChangeStyle(0, e.lhsUps, 0xdddddd),
                    ChangeStyle(0, e.midUp, 0xdddddd),
                    ChangeStyle(0, e.rhsUps, 0xdddddd),

                    ChangeStyle(0, e.lhsDowns00, 0xdddddd),
                    ChangeStyle(0, e.lhsDowns01, 0xdddddd),
                    ChangeStyle(0, e.lhsDowns10, 0xdddddd),
                    ChangeStyle(0, e.lhsDowns11, 0xdddddd),
                    
                    ChangeStyle(0, e.midDown00, 0xdddddd),
                    ChangeStyle(0, e.midDown01, 0xdddddd),
                    ChangeStyle(0, e.midDown1of3, 0xdddddd),
                    ChangeStyle(0, e.midDown2of3, 0x000000),

                    ChangeStyle(0, e.rhsDowns00, 0xdddddd),
                    ChangeStyle(0, e.rhsDowns01, 0xdddddd),
                    ChangeStyle(0, e.rhsDowns10, 0xdddddd),
                    ChangeStyle(0, e.rhsDowns11, 0xdddddd),
                ),
                ChangeCamera(500, {centerY: -8, scale: 15}),
                Show(200, e.lhsUps),
                Show(200, e.lhsUpDots),
                Parallel(
                    Show(200, e.lhsDowns00),
                    Show(200, e.lhsDowns01),
                    Show(200, e.lhsDowns10),
                    Show(200, e.lhsDowns11),
                    Show(200, e.lhsDownDots)
                ),
    
                Show(200, e.midUp),
                Parallel(
                    Show(200, e.midDown00),
                    Show(200, e.midDown01),
                ),
                Show(200, e.midDown1of3),
                Show(200, e.midDown2of3),
    
                Show(200, e.rhsUps),
                Show(200, e.rhsUpDots),
                Parallel(
                    Show(200, e.rhsDowns00),
                    Show(200, e.rhsDowns01),
                    Show(200, e.rhsDowns10),
                    Show(200, e.rhsDowns11),
                    Show(200, e.rhsDownDots)
                ),
                Show(200, e.F),
                Show(200, e.X),
                Show(200, e.Ps),
                Show(200, e.W),
                Show(200, e.Sm),
                Show(200, e.Qp),
            ),
            // 1 -> 2
            (e) => Sequential(
                Parallel(
                    ChangeStyle(0, e.midUps, 0xdddddd),
                    ChangeStyle(0, e.midDowns00, 0xdddddd),
                    ChangeStyle(0, e.midDowns01, 0xdddddd),
                    ChangeStyle(0, e.midDowns1of3, 0xdddddd),
                    ChangeStyle(0, e.midDowns2of3, 0x000000),
                ),
                Show(200, e.midUps),
                Show(200, e.midUpDots),
        
                Parallel(
                    Show(200, e.midDowns00),
                    Show(200, e.midDowns01),
                ),
                Parallel(
                    Show(200, e.midDowns1of3),
                    Show(200, e.midDowns2of3),
                )
            ),
            // 2 -> 3
            (e) => Sequential(
                Parallel(
                    Hide(200, e.lhsUps),
                    Hide(200, e.lhsUpDots),
                    Hide(200, e.midUps),
                    Hide(200, e.midUpDots),
                    Hide(200, e.midUp),
                    Hide(200, e.rhsUps),
                    Hide(200, e.rhsUpDots),
                ),
                ChangeParams(
                    500, {
                        offsetXrhsDown: -10, offsetXmidDown:-0.5, offsetXlhsDown:9,
                        offsetYrhsDown: -2, offsetYmidDown: -2, offsetYlhsDown: -2,
                    }
                )
            ),
            // 3 -> 4
            (e) => Sequential(
                Parallel(
                    ChangeStyle(400, e.lhsDowns00, 'red'),
                    ChangeStyle(400, e.midDowns00, 'red'),
                    ChangeStyle(400, e.midDown00, 'red'),
                    ChangeStyle(400, e.rhsDowns00, 'red'),
                ),
                Parallel(
                    Hide(400, e.lhsDowns00),
                    Hide(400, e.midDowns00),
                    Hide(400, e.midDown00),
                    Hide(400, e.rhsDowns00),
                ),
                Parallel(
                    Hide(200, e.lhsDownDots),
                    Hide(200, e.rhsDownDots)
                ),
                ChangeParams(400, {
                    shiftXrhsPt1:2, shiftXmidPt1: 2, shiftXlhsPt1: -6,
                    shiftYPt2:-8,
                    shiftXrhsPt2: 0, shiftXmidPt2: -1, shiftXlhsPt2: -2,
                    switchPt2: 1,
                }),
                Parallel(
                    ChangeStyle(400, e.lhsDowns10, 0xdddddd),
                    ChangeStyle(400, e.rhsDowns10, 0xdddddd),
                    ChangeStyle(400, e.lhsDownCmpls, 'red'),
                    ChangeStyle(400, e.rhsDownCmpls, 'red'),
                    Hide(400, e.lhsDowns10),
                    Hide(400, e.rhsDowns10),
                    Show(400, e.lhsDownCmpls),
                    Show(400, e.rhsDownCmpls),
                ),
                Parallel(
                    ChangeStyle(400, e.lhsDownCmpls, 0xdddddd),
                    ChangeStyle(400, e.rhsDownCmpls, 0xdddddd),
                ),
                ChangeStyle(0, e.lhsDown2of3, 0xdddddd),
                ChangeStyle(0, e.rhsDown2of3, 0xdddddd),
                Parallel(
                    Show(400, e.lhsDown2of3),
                    Show(400, e.rhsDown2of3),
                    ChangeStyle(400, e.midDowns2of3, 0xdddddd),
                    ChangeStyle(400, e.midDown2of3, 0xdddddd),
                ),
                Hide(0, e.midDown2of3),
                Hide(0, e.midDowns2of3),
                ChangeParams(0, {switch1to3: 1}),
            )

        ],
        {
            A:'Α', O:'Ο', P:'Π', R:'Ρ', S:'Σ', T:'Τ', Y:'Υ',
                   G:'Γ', E:'Ε', H:'Η', I:'Ι', L:'Λ', 
            F:'Φ', X:'Χ', Ps:'Ψ',W:'Ω', Sm:'Ϡ',Qp:'Ϙ',N:'Ν', 
            B:'Β', D:'Δ', Z:'Ζ', Q:'Θ', K:'Κ', M:'Μ', C:'Ξ', 
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
            let A = Vector();
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
            let A = Vector();
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
            let A = Vector();
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
                ChangeParams(2000, {angleCursor:-360}),
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
                ChangeParams(2000, {angleCursor:-360}),
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
                ChangeParams(2000, {angleCursor:-720}),
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
    
            let A = Vector();
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
                ChangeParams(2000, {angleCursor:-720}),
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
                ChangeParams(2000, {angleCursor:-1440}),
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
            let A = Vector();
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
            let A = Vector();
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
            let A = Vector();
    
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
    
            let P = Vector();
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
    ),
    Prop21: new DynamicDiagramConfiguration(
        4,
        new CameraSetting(
            5.5, 
            0, 0, 0
        ),
        {
            radius: 4,
            angleSpiralEnd: -360,
            angleSpiralRotation: -90,
            bisectionDepth: 3,
            switchRadial: 0,
            switchArc: 0,
            switchSector: 0
        },
        function (params) {
            let {
                radius, angleSpiralEnd, angleSpiralRotation, bisectionDepth,
                switchRadial, switchArc, switchSector
            } = params;
            let Q = Vector();
            let ZHIA = Circle(Q, radius);
            let ABGD = Spiral(Q, radius, 0, angleSpiralEnd, angleSpiralRotation);
            let A = Q.shiftPolar(radius, -angleSpiralRotation);
            let Z = Q.shiftPolar(radius, -angleSpiralRotation+90);
            let H = Q.toward(A, -1);
            let I = Q.toward(Z, -1);

            let bisector1 = Q.shiftPolar(radius, -angleSpiralRotation+90/2);
            let bisector2 = Q.shiftPolar(radius, -angleSpiralRotation+90/4);
            let bisector3 = Q.shiftPolar(radius, -angleSpiralRotation+90/8);
            let K = bisector3;

            let given = Polygon(
                [Vector(4, 3.6, 0), Vector(5, 4, 0), 
                    Vector(5.4, 5, 0), Vector(3.8, 5.3, 0)], true);
            let AQK = Sector(Q, radius, -angleSpiralRotation, -angleSpiralRotation+90/8, true);
            
            let angleAQK = 90/8;

            let radials = [];
            for (let i=1; i<=30; i++) {
                let localSwitch = Math.min(1, Math.max(0, i-30+30*switchRadial));
                radials.push(Line(Q, Q.toward(ABGD.pick(-angleAQK*i), localSwitch*(i+1)/i)));
            }
            radials = MultiObjects('line', radials);

            let L = ABGD.pick(-360+angleAQK);
            let O = Q.toward(A, 1-angleAQK/360);
            let M = Q.shiftPolar(radius*(1-angleAQK/360), -angleSpiralRotation+2*angleAQK);
            let OM = Circle(Q, radius*(1-angleAQK/360), -angleSpiralRotation, -angleSpiralRotation+2*angleAQK);

            let N = ABGD.pick(-360+2*angleAQK);
            let P = K.toward(L, 2);
            let R = Q.shiftPolar(radius*(1-2*angleAQK/360), -angleSpiralRotation+3*angleAQK);
            let PR = Circle(
                Q, radius*(1-2*angleAQK/360), 
                -angleSpiralRotation+angleAQK, -angleSpiralRotation+3*angleAQK
            );

            let X = ABGD.pick(-360+3*angleAQK);
            let S = M.toward(N, 2);
            let T = Q.shiftPolar(radius*(1-3*angleAQK/360), -angleSpiralRotation+4*angleAQK);
            let ST = Circle(
                Q, radius*(1-3*angleAQK/360), 
                -angleSpiralRotation+2*angleAQK, -angleSpiralRotation+4*angleAQK
            );

            let arcs = [];
            for (let i=1; i<=29; i++) {
                let localSwitch = Math.min(1, Math.max(0, i-29+29*switchArc));
                arcs.push(
                    Circle(
                        Q, radius*i*(angleAQK/360), 
                        -angleSpiralRotation-(i+1-2*localSwitch)*angleAQK, -angleSpiralRotation-(i+1)*angleAQK)
                );
            }
            arcs = MultiObjects('circle', arcs);

            let sectors = [];
            for (let i=1; i<=31; i++) {
                let localSwitch = Math.min(1, Math.max(0, 1-i+31*switchSector));
                sectors.push(
                    Sector(
                        Q, radius*i*(angleAQK/360),
                        -angleSpiralRotation-(i+1-localSwitch)*angleAQK, 
                        -angleSpiralRotation-(i-localSwitch)*angleAQK
                    )
                );
            }
            sectors = MultiObjects('sector', sectors);

            let result = {
                Q, A, Z, H, I, K,
                L, O, M,  N, P, R, X, S, T,
                QA:[Q,A], AH:[A,H], ZI:[Z,I], 
                QB1:[Q,bisector1], QB2:[Q,bisector2], QB3:[Q,bisector3],
                given, AQK,
                ZHIA, ABGD, OM, PR, ST,
                radials, arcs, sectors
            };
            return result;
        },
        (e) => Sequential(
            Draw(500, e.ABGD),
            Show(1, e.Q),
            Draw(300, e.QA),
            Show(1, e.A),
            Draw(500, e.ZHIA),
            Draw(400, e.AH),
            Show(1, e.H),
            Show(1, e.Z),
            Draw(400, e.ZI),
            Show(1, e.I),
            ChangeStyle(1, e.given, 0xdddddd),
            Show(400, e.given)
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Draw(400, e.QB1),
                Wait(400),
                Draw(400, e.QB2),
                Hide(400, e.QB1),
                Draw(400, e.QB3),
                Hide(400, e.QB2),
                Show(1, e.K),
                ChangeStyle(1, e.AQK, 'blue'),
                Parallel(
                    Show(200, e.AQK),
                    ChangeStyle(200, e.given, 'red')
                )
            ),
            // 1 -> 2
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.given, 'white'),
                    ChangeStyle(200, e.AQK, 'white'),
                ),
                Show(1, e.radials),
                ChangeStyle(1, e.radials, 'grey'),
                ChangeParams(3000, {switchRadial: 1})
            ),
            // 2 -> 3
            (e) => Sequential(
                Show(200, e.L),
                Show(1, e.O),
                Draw(200, e.OM),
                Show(1, e.M),

                Wait(200),

                Show(200, e.N),
                Show(1, e.P), 
                Draw(200, e.PR),
                Show(1, e.R),

                Wait(200),
                Draw(200, e.ST),

                Wait(200),
                Show(1, e.arcs),
                ChangeStyle(1, e.arcs, 'grey'),
                ChangeParams(3000, {switchArc: 1})
            ),
            // 3 -> 4
            (e) => Sequential(
                ChangeStyle(1, e.sectors, 'grey'),
                Parallel(
                    Show(200, e.X),
                    Show(200, e.S),
                    Show(200, e.T),
                    Show(200, e.sectors)
                ),
                ChangeParams(4000, {switchSector: 1}),
                ChangeStyle(200, e.AQK, 'blue')
            )
        ],
        {
            A:'Α', Q:'Θ', Z:'Ζ', H:'Η', I:'Ι', K:'Κ', 
            L:'Λ', O:'Ο', M:'Μ',
            N:'Ν', P:'Π', R:'Ρ',
            X:'Χ', S:'Σ', T:'Τ'
        }
    ),
    Prop22: new DynamicDiagramConfiguration(
        3,
        new CameraSetting(
            11, 
            0, 0, 0
        ),
        {
            radius: 4,
            angleSpiralEnd: -720,
            angleSpiralRotation: -90,
            bisectionDepth: 3,
            switchRadial: 0,
            switchArc: 0,
            switchSector: 0
        },
        function (params) {
            let {
                radius, angleSpiralEnd, angleSpiralRotation, bisectionDepth,
                switchRadial, switchArc, switchSector
            } = params;
            let Q = Vector();
            let AZH = Circle(Q, 2*radius);
            let ABGDE = Spiral(Q, radius, 0, angleSpiralEnd, angleSpiralRotation);
            let A = ABGDE.pick(-720);
            let E = ABGDE.pick(-360);
            let Z = Q.shiftPolar(2*radius, -angleSpiralRotation+90);
            let H = Q.toward(A, -1);
            let I = Q.toward(Z, -1);

            let bisector1 = Q.shiftPolar(2*radius, -angleSpiralRotation+90/2);
            let bisector2 = Q.shiftPolar(2*radius, -angleSpiralRotation+90/4);
            let bisector3 = Q.shiftPolar(2*radius, -angleSpiralRotation+90/8);
            let K = bisector3;

            let given = Polygon(
                [Vector(8, 7.2, 0), Vector(10, 8, 0), 
                    Vector(10.8, 10, 0), Vector(7.6, 10.6, 0)], true);
            let QKA = Sector(Q, 2*radius, -angleSpiralRotation, -angleSpiralRotation+90/8, true);
            
            let angleAQK = 90/8;
            let R = ABGDE.pick(-360-angleAQK);
            let QER = Sector(Q, radius, -angleSpiralRotation-90/8, -angleSpiralRotation, true)

            let radials = [];
            for (let i=1; i<=32; i++) {
                let localSwitch = Math.min(1, Math.max(0, i-31+31*switchRadial));
                radials.push(Line(Q, Q.toward(ABGDE.pick(-360-angleAQK*i), localSwitch*(i+33)/(i+32))));
            }
            radials = MultiObjects('line', radials);

            let arcs = [];
            for (let i=1; i<=31; i++) {
                let localSwitch = Math.min(1, Math.max(0, i-30+30*switchArc));
                arcs.push(
                    Circle(
                        Q, radius*(32+i)*(angleAQK/360), 
                        -angleSpiralRotation-(i+1-2*localSwitch)*angleAQK, -angleSpiralRotation-(i+1)*angleAQK)
                );
            }
            arcs = MultiObjects('circle', arcs);


            let sectors = [];
            for (let i=1; i<=31; i++) {
                let localSwitch = Math.min(1, Math.max(0, 1-i+32*switchSector));
                sectors.push(
                    Sector(
                        Q, radius*(i+32)*(angleAQK/360),
                        -angleSpiralRotation-(i+1-localSwitch)*angleAQK, 
                        -angleSpiralRotation-(i-localSwitch)*angleAQK
                    )
                );
            }
            sectors = MultiObjects('sector', sectors);

            let result = {
                Q, A, Z, H, I, K, E, R,
                QA:[Q,A], EA:[E,A], AH:[A,H], ZI:[Z,I], 
                QB1:[Q,bisector1], QB2:[Q,bisector2], QB3:[Q,bisector3],
                given, QKA, QER,
                AZH, ABGDE,
                radials, arcs, sectors
            };
            return result;
        },
        (e) => Sequential(
            Draw(500, e.ABGDE),
            Show(1, e.Q),
            Draw(300, e.QA),
            Show(1, e.A),
            Show(1, e.E),
            Draw(300, e.EA),
            Draw(500, e.AZH),
            Draw(400, e.AH),
            Show(1, e.H),
            Show(1, e.Z),
            Draw(400, e.ZI),
            Show(1, e.I),
            ChangeStyle(1, e.given, 0xdddddd),
            Show(400, e.given)
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Draw(400, e.QB1),
                Wait(400),
                Draw(400, e.QB2),
                Hide(400, e.QB1),
                Draw(400, e.QB3),
                Hide(400, e.QB2),
                Show(0, e.K),
                ChangeStyle(0, e.QKA, 'blue'),
                Parallel(
                    Show(200, e.QKA),
                    ChangeStyle(200, e.given, 'red')
                )
            ),
            // 1 -> 2
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.given, 'white'),
                    ChangeStyle(200, e.QKA, 'white'),
                ),
                Show(0, e.radials),
                ChangeStyle(0, e.radials, 'grey'),
                ChangeParams(3000, {switchRadial: 1}),
                Show(0, e.arcs),
                ChangeStyle(0, e.arcs, 'grey'),
                ChangeParams(3000, {switchArc: 1})
            ),
            // 2 -> 3
            (e) => Sequential(
                ChangeStyle(0, e.sectors, 'grey'),
                ChangeStyle(0, e.QER, 'red'),
                Parallel(
                    Show(200, e.sectors),
                    Show(200, e.QER)
                ),
                Wait(200),
                Hide(200, e.QER),
                ChangeParams(4000, {switchSector: 1}),
                ChangeStyle(200, e.QKA, 'blue')
            )
        ],
        {
            A:'Α', Q:'Θ', Z:'Ζ', H:'Η', I:'Ι', K:'Κ', E:'Ε',
            R:'Ρ',
        }
    ),
    Prop23: new DynamicDiagramConfiguration(
        3,
        new CameraSetting(
            5.5, 
            0, 0, 0
        ),
        {
            radius: 4,
            angleSpiralStart: -60,
            angleSpiralEnd: -330,
            angleSpiralRotation: -90,
            bisectionDepth: 3,
            switchRadial: 0,
            switchArc: 0,
            switchSector: 0
        },
        function (params) {
            let {
                radius, angleSpiralStart, angleSpiralEnd, angleSpiralRotation, bisectionDepth,
                switchRadial, switchArc, switchSector
            } = params;
            let Q = Vector();
            let radiusA = radius*(-angleSpiralEnd/360)
            let AZH = Circle(Q, radiusA);
            let ABGDE = Spiral(Q, radius, angleSpiralStart, angleSpiralEnd, angleSpiralRotation);
            let A = ABGDE.pick(angleSpiralEnd);
            let E = ABGDE.pick(angleSpiralStart);
            let Z = Q.toward(E, angleSpiralEnd/angleSpiralStart);
            // let H = Q.toward(A, -1);
            // let I = Q.toward(Z, -1);
            let angleAQK = (angleSpiralStart-angleSpiralEnd)/32;
            let bisector1 = Q.shiftPolar(radiusA, -angleSpiralRotation+angleSpiralEnd+angleAQK*16);
            let bisector2 = Q.shiftPolar(radiusA, -angleSpiralRotation+angleSpiralEnd+angleAQK*8);
            let bisector3 = Q.shiftPolar(radiusA, -angleSpiralRotation+angleSpiralEnd+angleAQK*4);
            let bisector4 = Q.shiftPolar(radiusA, -angleSpiralRotation+angleSpiralEnd+angleAQK*2);
            let bisector5 = Q.shiftPolar(radiusA, -angleSpiralRotation+angleSpiralEnd+angleAQK);
            let K = bisector5;

            let given = Polygon(
                [Vector(4, 3.6, 0), Vector(5, 4, 0), 
                    Vector(5.4, 5, 0), Vector(3.8, 5.3, 0)], true);
            let QAK = Sector(
                Q, radiusA, 
                -angleSpiralRotation+angleSpiralEnd, -angleSpiralRotation+angleSpiralEnd+angleAQK, 
                true);
            
            let R = ABGDE.pick(angleSpiralStart-angleAQK);
            let QER = Sector(
                Q, radiusA*(angleSpiralStart/angleSpiralEnd), 
                -angleSpiralRotation+angleSpiralStart-angleAQK, 
                -angleSpiralRotation+angleSpiralStart, 
                true)

            let radials = [];
            for (let i=1; i<=31; i++) {
                let localSwitch = Math.min(1, Math.max(0, i-31+31*switchRadial));
                radials.push(
                    Line(
                        Q, 
                        Q.toward(
                            ABGDE.pick(angleSpiralStart-angleAQK*i), 
                            localSwitch*(i+1+(-angleSpiralStart/angleAQK))/(i+(-angleSpiralStart/angleAQK))
                        )
                    )
                );
            }
            radials = MultiObjects('line', radials);

            let arcs = [];
            for (let i=1; i<=31; i++) {
                let localSwitch = Math.min(1, Math.max(0, i-31+31*switchArc));
                arcs.push(
                    Circle(
                        Q, radius*(-angleSpiralStart+i*angleAQK)/360, 
                        -angleSpiralRotation+angleSpiralStart-(i+1-2*localSwitch)*angleAQK, 
                        -angleSpiralRotation+angleSpiralStart-(i+1)*angleAQK
                    )
                );
            }
            arcs = MultiObjects('circle', arcs);

            let sectors = [];
            for (let i=1; i<=31; i++) {
                let localSwitch = Math.min(1, Math.max(0, 1-i+32*switchSector));
                sectors.push(
                    Sector(
                        Q, radius*(-angleSpiralStart+i*angleAQK)/360,
                        -angleSpiralRotation+angleSpiralStart-(i+1-localSwitch)*angleAQK, 
                        -angleSpiralRotation+angleSpiralStart-(i-localSwitch)*angleAQK
                    )
                );
            }
            sectors = MultiObjects('sector', sectors);

            let result = {
                Q, A, Z, K, E, R,
                QA:[Q,A], QE:[Q,E], EZ:[E,Z],
                QB1:[Q,bisector1], QB2:[Q,bisector2], QB3:[Q,bisector3], QB4:[Q,bisector4], QB5:[Q,bisector5],
                given, QAK, QER,
                ABGDE, AZH,
                radials, arcs, sectors
            };
            return result;
        },
        (e) => Sequential(
            Draw(500, e.ABGDE),
            Show(1, e.Q),
            Draw(300, e.QA),
            Show(1, e.A),
            Draw(300, e.QE),
            Show(1, e.E),
            Draw(300, e.EZ),
            Draw(500, e.AZH),
            Show(1, e.Z),
            ChangeStyle(1, e.given, 0xdddddd),
            Show(400, e.given)
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                Draw(200, e.QB1),
                Wait(200),
                Draw(200, e.QB2),
                Hide(200, e.QB1),
                Draw(200, e.QB3),
                Hide(200, e.QB2),
                Draw(200, e.QB4),
                Hide(200, e.QB3),
                Draw(200, e.QB5),
                Hide(200, e.QB4),
                Show(0, e.K),
                ChangeStyle(1, e.QAK, 'blue'),
                Parallel(
                    Show(200, e.QAK),
                    ChangeStyle(200, e.given, 'red')
                )
            ),
            // 1 -> 2
            (e) => Sequential(
                Parallel(
                    ChangeStyle(200, e.given, 'white'),
                    ChangeStyle(200, e.QAK, 'white'),
                ),
                Show(1, e.radials),
                ChangeStyle(1, e.radials, 'grey'),
                ChangeParams(3000, {switchRadial: 1}),
                Show(1, e.arcs),
                ChangeStyle(1, e.arcs, 'grey'),
                ChangeParams(3000, {switchArc: 1})
            ),
            // 2 -> 3
            (e) => Sequential(
                ChangeStyle(0, e.sectors, 'grey'),
                ChangeStyle(0, e.QER, 'red'),
                Parallel(
                    Show(200, e.sectors),
                    Show(200, e.QER)
                ),
                Wait(200),
                Hide(200, e.QER),
                ChangeParams(4000, {switchSector: 1}),
                ChangeStyle(200, e.QAK, 'blue')
            )
        ],
        {
            A:'Α', Q:'Θ', Z:'Ζ', H:'Η', I:'Ι', K:'Κ', E:'Ε',
        }
    ),
    Prop24: new DynamicDiagramConfiguration(
        9,
        new CameraSetting(
            6.8,
            2, 0, 0,
        ),
        {
            radius: 3,
            angleSpiralRotation: -90,
            angleSpiralStart: 0,
            angleSpiralEnd: -360,

            XqpCenter: 5.5,
            YqpCenter: 0,

            qpGap: .5,
            ratioRAA: 1.1,
            nDivision: 32,
            gapBtwCopies: 0.25,
            switchSpokes: 0,
            shiftXcircleCopy: 1,
            shiftYcircleCopy: -6.5,

            switchSmallToLarge: 0
        },
        function (params) {
            let {
                radius, angleSpiralRotation, angleSpiralStart, angleSpiralEnd,
                XqpCenter, YqpCenter,
                qpGap,
                ratioRAA,
                nDivision,
                gapBtwCopies, 
                switchSpokes,
                shiftXcircleCopy, shiftYcircleCopy,
                switchSmallToLarge,
            } = params;

            let Q = Vector();
            let ABGDEQ = Spiral(Q, radius, angleSpiralStart, angleSpiralEnd, angleSpiralRotation);
            let A = ABGDEQ.pick(angleSpiralEnd);
            let AKZHI = Circle(Q, radius, 0, 360);
            let disk = Sector(Q, radius, 0, 360, false);

            let qpCenter = Q.shift(XqpCenter, YqpCenter);
            let qpRadius = radius/Math.sqrt(3);
            let qp = Sector(qpCenter, qpRadius, 0, 360, true);
            let qp1 = Sector(qpCenter.shift(qpGap, qpGap, qpGap), qpRadius, 0, 360, true);
            let qp2 = Sector(qpCenter.shift(-qpGap, -qpGap, -qpGap), qpRadius, 0, 360, true);
            let qpSmall = Sector(
                qpCenter.shift(0,0,1+switchSmallToLarge), 
                (ratioRAA**(2*switchSmallToLarge-1))*qpRadius, 0, 360, false);
            let qpSmaller = Sector(
                qpCenter.shift(0,0,2-switchSmallToLarge), 
                (ratioRAA**(4*switchSmallToLarge-2))*qpRadius, 0, 360, false);
            let qmark1 = qpCenter.shift(qpRadius/Math.sqrt(2), qpRadius/Math.sqrt(2));

            let spiralSector = SpiralCircularSector(
                Q, 0, 
                -angleSpiralRotation+angleSpiralStart, -angleSpiralRotation+angleSpiralEnd, 
                radius,
                false
            );

            let outerSectors = MultiObjects('sector');
            let outerSectors2of3 = MultiObjects('sector');
            for (let i=1; i<=nDivision; i++) {
                outerSectors.push(
                    Sector(
                        Q.shift(0,0,(2*switchSmallToLarge-1)), 
                        radius*((i-switchSmallToLarge)/nDivision),
                        -angleSpiralRotation+angleSpiralStart + ((i-1)/nDivision)*(angleSpiralEnd-angleSpiralStart),
                        -angleSpiralRotation+angleSpiralStart + (i/nDivision)*(angleSpiralEnd-angleSpiralStart),
                        true,
                    )
                );
                outerSectors2of3.push(
                    Sector(
                        Q.shift(-gapBtwCopies,gapBtwCopies,(2*switchSmallToLarge-1)*2), 
                        radius*((i-switchSmallToLarge)/nDivision),
                        -angleSpiralRotation+angleSpiralStart + ((i-1)/nDivision)*(angleSpiralEnd-angleSpiralStart),
                        -angleSpiralRotation+angleSpiralStart + (i/nDivision)*(angleSpiralEnd-angleSpiralStart),
                        true,
                    ),
                    Sector(
                        Q.shift(-2*gapBtwCopies,2*gapBtwCopies,(2*switchSmallToLarge-1)*3), 
                        radius*((i-switchSmallToLarge)/nDivision),
                        -angleSpiralRotation+angleSpiralStart + ((i-1)/nDivision)*(angleSpiralEnd-angleSpiralStart),
                        -angleSpiralRotation+angleSpiralStart + (i/nDivision)*(angleSpiralEnd-angleSpiralStart),
                        true,
                    )
                );
            }

            let spokes = MultiObjects('line');
            for (let i=1; i<nDivision; i++) {
                spokes.push(
                    Line(Q.shift(0,0,-4), 
                        Q.shift(0,0,-4).shiftPolar(
                        radius*switchSpokes,
                        -angleSpiralRotation+angleSpiralStart+(i/nDivision)*(angleSpiralEnd-angleSpiralStart)
                    ))
                )
            }
            let equalSectors = MultiObjects('sector');
            for (let i=0; i<nDivision; i++) {
                equalSectors.push(
                    Sector(
                        Q.shift(shiftXcircleCopy,shiftYcircleCopy), radius,
                        -angleSpiralRotation+angleSpiralStart + ((i-1)/nDivision)*(angleSpiralEnd-angleSpiralStart),
                        -angleSpiralRotation+angleSpiralStart + ((i)/nDivision)*(angleSpiralEnd-angleSpiralStart),
                        true,
                    )
                )
            }

            let residueVertices = [
                Vector(shiftXcircleCopy+(1-switchSmallToLarge)*radius+0.5, shiftYcircleCopy, switchSmallToLarge),
                Vector(shiftXcircleCopy+(1-switchSmallToLarge)*radius+1.5, shiftYcircleCopy, switchSmallToLarge),
                Vector(shiftXcircleCopy+(1-switchSmallToLarge)*radius+0.9, shiftYcircleCopy-1.3, switchSmallToLarge),
            ];
            let residueAll = Polygon(residueVertices, true);
            let residue2of3 = MultiObjects('polygon');
            for (let i=0; i<3; i++) {
                residue2of3.push(
                    Polygon([
                        residueVertices[0],
                        residueVertices[1].toward(residueVertices[2], i/3),
                        residueVertices[1].toward(residueVertices[2], (i+1)/3),
                    ], true)
                )
            }
            let residue1of3 = residue2of3.expel(1);

            let qpCopies2of3 = MultiObjects('sector');
            for (let i=-1; i<=1; i++) {
                qpCopies2of3.push(
                    Sector(
                        Q.shift(shiftXcircleCopy-i*gapBtwCopies,shiftYcircleCopy+i*gapBtwCopies, i),
                        qpRadius, 0, 360,
                        true
                    )
                );
            }
            let qpCopy = qpCopies2of3.expel(1);
            let qmark2 = Q.shift(shiftXcircleCopy+qpRadius+1,shiftYcircleCopy);

            let result = {
                Q, A,
                QA:[Q,A],

                AKZHI, ABGDEQ,
                spiralSector, qp, qp1, qp2, disk,
                qpSmall, qpSmaller, qmark1,
                outerSectors, outerSectors2of3, spokes, equalSectors,
                qpCopy, qpCopies2of3,
                residueAll, residue1of3, residue2of3, qmark2
            };
            return result;
        },
        (e) => Sequential(
            Show(200, e.Q),
            Show(200, e.A),
            Draw(500, e.ABGDEQ),
            Draw(300, e.QA),
            Draw(500, e.AKZHI),
            Show(200, e.disk),
            Parallel(
                Show(200, e.qp),
                Show(200, e.qp1),
                Show(200, e.qp2),
            ),
            Parallel(
                Hide(200, e.qp1),
                Hide(200, e.qp2),
                Hide(200, e.disk),
            ),
            Show(200, e.spiralSector),
        ),
        [
            // 0 -> 1
            (e) => Sequential(
                ChangeStyle(200, e.qp, 0xffffff),
                ChangeStyle(0, e.qpSmaller, 'red'),
                Parallel(
                    ChangeStyle(200, e.spiralSector, 'red'),
                    Show(200, e.qpSmaller),
                    Show(200, e.qmark1)
                )
            ),
            // 1 -> 2
            (e) => Sequential(
                ChangeStyle(0, e.qpSmall, 'blue'),
                ChangeStyle(0, e.outerSectors, 'blue'),
                Parallel(
                    Show(200, e.qpSmall),
                    Show(200, e.outerSectors)
                )
            ),
            // 2 -> 3
            (e) => Sequential(
                ChangeStyle(0, e.outerSectors2of3, 'green'),
                Parallel(
                    Hide(200, e.qpSmaller),
                    Hide(200, e.spiralSector),
                    Hide(200, e.ABGDEQ)
                ),
                Show(0, e.spokes),
                ChangeStyle(0, e.spokes, 0xdddddd),
                ChangeStyle(0, e.equalSectors, 'green'),
                ChangeStyle(0, e.residueAll, 'green'),
                ChangeParams(400, {switchSpokes: 1}),
                ChangeCamera(500, {centerY: -3}),
                Parallel(
                    ChangeStyle(200, e.outerSectors, 'green'),
                    Show(200, e.outerSectors2of3),
                    Show(200, e.equalSectors),
                    Show(200, e.residueAll)
                )
            ),
            // 3 -> 4
            (e) => Sequential(
                ChangeStyle(0, e.qpCopies2of3, 'green'),
                ChangeStyle(0, e.qpCopy, 'green'),
                ChangeStyle(0, e.residue1of3, 'green'),
                ChangeStyle(0, e.residue2of3, 'green'),
                Parallel(
                    Hide(200, e.equalSectors),
                    Show(200, e.qpCopies2of3),
                    Show(200, e.qpCopy),
                    
                    Hide(200, e.residueAll),
                    Show(200, e.residue1of3),
                    Show(200, e.residue2of3),
                ),
                Parallel(
                    Hide(200, e.outerSectors2of3),
                    Hide(200, e.qpCopies2of3),
                    Hide(200, e.residue2of3),

                    ChangeStyle(200, e.outerSectors, 'blue'),
                    ChangeStyle(200, e.qpCopy, 'blue'),
                    ChangeStyle(200, e.residue1of3, 'blue'),

                ),
                Show(200, e.qmark2)
            ),
            // 4 -> 5
            (e) => Sequential(
                Parallel(
                    Hide(200, e.qpCopy),
                    Hide(200, e.qmark1),
                    Hide(200, e.qmark2),
                    Hide(200, e.residue1of3),
                    Hide(200, e.outerSectors),
                    Hide(200, e.qpSmall),
                    Hide(200, e.spokes),
                    ChangeParams(200, {switchSpokes:0}),
                    Draw(200, e.ABGDEQ),
                ),
                ChangeCamera(400, {centerY: 0}),
                ChangeParams(0, {switchSmallToLarge: 1}),
                Parallel(
                    Show(200, e.spiralSector),
                    Show(200, e.qpSmaller),
                    Show(200, e.qmark1)
                )
            ),
            // 5 -> 6
            (e) => Sequential(
                Parallel(
                    Show(200, e.outerSectors),
                    Show(200, e.qpSmall),
                )
            ),
            // 6 -> 7
            (e) => Sequential(
                ChangeStyle(0, e.outerSectors2of3, 'green'),
                Parallel(
                    Hide(200, e.qpSmaller),
                    Hide(200, e.spiralSector),
                    Hide(200, e.ABGDEQ)
                ),
                Show(0, e.spokes),
                ChangeParams(0, {shiftYcircleCopy: 6.5}),
                ChangeStyle(0, e.spokes, 0xdddddd),
                ChangeStyle(0, e.residueAll, 'white'),
                ChangeParams(400, {switchSpokes: 1}),
                ChangeCamera(500, {centerY: 3}),
                Parallel(
                    ChangeStyle(200, e.outerSectors, 'green'),
                    Show(200, e.outerSectors2of3),
                    Show(200, e.equalSectors),
                    Show(200, e.residueAll)
                ),
            ),
            // 7 -> 8
            (e) => Sequential(
                ChangeStyle(0, e.qpCopies2of3, 'green'),
                ChangeStyle(0, e.qpCopy, 'green'),
                ChangeStyle(0, e.residue1of3, 'white'),
                ChangeStyle(0, e.residue2of3, 'white'),
                Parallel(
                    Hide(200, e.equalSectors),
                    Show(200, e.qpCopies2of3),
                    Show(200, e.qpCopy),
                    
                    Hide(200, e.residueAll),
                    Show(200, e.residue1of3),
                    Show(200, e.residue2of3),
                ),
                Parallel(
                    Hide(200, e.outerSectors2of3),
                    Hide(200, e.qpCopies2of3),
                    Hide(200, e.residue2of3),

                    ChangeStyle(200, e.outerSectors, 'blue'),
                    ChangeStyle(200, e.qpCopy, 'blue'),
                    // ChangeStyle(200, e.residue1of3, 'blue'),

                ),
                Show(200, e.qmark2)
            ),
            // 8 -> 9
            (e) => Sequential(
                Parallel(
                    ChangeCamera(400, {centerY: 0}),
                    Hide(200, e.residue1of3),
                    Hide(200, e.outerSectors),
                    Hide(200, e.qpSmall),
                    Hide(200, e.qmark1),
                    Hide(200, e.qmark2),
                    Hide(200, e.spokes),
                    Hide(200, e.qpCopy),
                ),
                ChangeStyle(0, e.qp, 'red'),
                Parallel(
                    Show(200, e.spiralSector),
                    Show(200, e.ABGDEQ),
                    // Show(200, e.qp)
                )
            )
        ],
        {
            A:'Α', Q:'Θ', qp:'Ϙ',
            qmark1: '?', qmark2: '???'
        },
    )
}

export {ddcs};