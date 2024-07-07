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

let specialEffects = {
    Prop01: {
        stepMax: 5,
        initialCamSet: {
            scale: 5,
            centerX: 0,
            centerY: -0.5,
            centerZ: 0,
        },
        captions: {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', K:'Κ', L:'Λ', Z:'Ζ', H:'Η', Q:'Θ', 
        },
        initialParams: {
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
        setup: (e) => Sequential(
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
        forward: [
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
        ]
    }, 
    Prop02: {
        stepMax: 4,
        initialCamSet: {
            scale: 5,
            centerX: 2.5,
            centerY: -0.5,
            centerZ: 0,
        },
        captions: {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', K:'Κ', L:'Λ', Z:'Ζ', H:'Η', Q:'Θ', M:'Μ', C:'Ξ', N:'Ν',
        },
        initialParams: {
            aspectRatio: 3,
            lengthAB: 5,
            ratioLength: 1.2,
            ratioPosD: 0.5,
            ratioPosH: 0.7,
            ratioLengthGD: 0.3,
            ratioLengthDE: 0.3,
            velocityInverse: 1.3,
        },
        setup: (e) => Sequential(
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
        forward: [
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

        ]
    },
    Prop18: {
        stepMax: 15,
        initialCamSet: {
            scale: 4.2,
            centerX: -3,
            centerY: 0,
            centerZ: 0,
        },
        captions: {
            A:'Α', B:'Β', G:'Γ', D:'Δ', Q:'Θ', Z:'Ζ', H:'Η', L:'Λ', N:'Ν', R:'Ρ', X:'Χ', M:'Μ', P:'Π',
        },
        initialParams: {
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
        setup: (e) => Sequential(
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
        forward: [
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
    },
};

export {specialEffects};