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
    Prop05: {
        stepMax: 4,
        initialCamSet: {
            scale: 6.3,
            centerX: 1,
            centerY: 0,
            centerZ: 0
        },
        captions: {
            K:'Κ', A:'Α', B:'Β', G:'Γ', D:'Δ', Z:'Ζ', H:'Η', Q:'Θ', E:'Ε', 
        },
        initialParams: {
            radius: 2,
            angleAKB: 78,
            angleGivenArc: 120,
            ratioBD: 0.9,
            ratioBZ: 1.2,
            ratioLengthE: 3,
            ratioLongerPos: 2,
            switchZ: 0,
        },
        setup: (e) => Sequential(
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
        forward: [
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
        ]
    },
    Prop06: {
        stepMax: 6,
        initialCamSet: {
            scale: 5,
            centerX: 0,
            centerY: 0,
            centerZ: 0
        },
        captions: {
            K:'Κ', A:'Α', B:'Β', G:'Γ', Q:'Θ', N:'Ν', L:'Λ', E:'Ε', Z:'Ζ', H:'Η',
        },
        initialParams: {
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
        setup: (e) => Sequential(
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            Draw(500, e.ABG),
            Show(200, e.K),
            Draw(200, e.AQ),
            Draw(200, e.GQ),
        ),
        forward: [
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
        ]
    },
    Prop07: {
        stepMax: 4,
        initialCamSet: {
            scale: 5,
            centerX: 0,
            centerY: 0,
            centerZ: 0,
        },
        captions: {
            K:'Κ', A:'Α', G:'Γ', Q:'Θ', L:'Λ', I:'Ι', N:'Ν', E:'Ε', Z:'Ζ', H:'Η',
        },
        initialParams: {
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
        setup: (e) => Sequential(
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
        forward: [
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

        ]
    },
    Prop08: {
        stepMax: 6,
        initialCamSet: {
            scale: 5,
            centerX: 0,
            centerY: 0,
            centerZ: 0
        },
        captions: {
            K:'Κ', A:'Α', B:'Β', G:'Γ', Q:'Θ', L:'Λ', C:'Ξ', M:'Μ', I:'Ι', N:'Ν', E:'Ε', Z:'Ζ', H:'Η'
        },
        initialParams: {
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
        setup: (e) => Sequential(
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
        forward: [
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
        ]
    },
    Prop09: {
        stepMax: 5,
        initialCamSet: {
            scale: 5,
            centerX: 0,
            centerY: 0,
            centerZ: 0
        },
        captions: {
            K:'Κ', A:'Α', B:'Β', G:'Γ', Q:'Θ', L:'Λ', C:'Ξ', M:'Μ', I:'Ι', N:'Ν', E:'Ε', Z:'Ζ', H:'Η'
        },
        initialParams: {
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
        setup: (e) => Sequential(
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
        forward: [
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
        ]
    },
    Prop10: {
        stepMax: 0,
        initialCamSet: {
            scale: 5,
            centerX: 3.5,
            centerY: 4,
            centerZ: 0,
        },
        captions: {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', 
            Z:'Ζ', H:'Η', Q:'Θ', I:'Ι', K:'Κ',
            L:'Λ', M:'Μ', N:'Ν', C:'Ξ', O:'Ο'
        },
        initialParams: {
            lengthA: 8,
            lengthBetweenLines: 1,
        },
        setup: (e) => Sequential(
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
        forward: [

        ]
    },
    Prop12: {
        stepMax: 1,
        initialCamSet: {
            scale: 5,
            centerX: 0,
            centerY: 0,
            centerZ: 0
        },
        captions: {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', Z:'Ζ'
        },
        initialParams: {
            radius: 4,
            angleSpiralEnd: -360,
            angleSpiralRotation: -90,
            angleB: -95,
            angleG: -145,
            angleCursor: -95,
        },
        setup: (e) => Sequential(
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
        forward: [
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
        ]
    },
    Prop13: {
        stepMax: 3,
        initialCamSet: {
            scale: 5,
            centerX: 0,
            centerY: 0,
            centerZ: 0,
        },
        captions: {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', Z:'Ζ', H:'Η', Q:'Θ',
            Efake:'Ε?', Zfake:'Ζ?'
        },
        initialParams: {
            radius: 4, 
            angleSpiralEnd: -360,
            angleSpiralRotation: -90,
            angleG: -240,
            angleH: -270,
            lengthZE: 6,
            switchFake: 0,
        },
        setup: (e) => Sequential(
            Draw(500, e.spiral),
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            Show(200, e.D),
            Show(1, e.Z),
            Draw(400, e.ZE),
            Show(1, e.E),
        ),
        forward: [
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
        ]
    },
    Prop14: {
        stepMax: 3,
        initialCamSet: {
            scale: 5,
            centerX: 0,
            centerY: 0,
            centerZ: 0
        },
        captions: {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', Z:'Ζ', H:'Η', Q:'Θ',
            Acursor: 'Α', Qcursor: 'Θ'
        },
        initialParams: {
            radius: 4,
            angleSpiralRotation: -90,
            angleB: -90,
            angleG: -150,
            angleD: -240,
            angleE: -270,
            angleCursor: 0
        },
        setup: (e) => Sequential(
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
        forward: [
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

        ]
    },
    Prop15: {
        stepMax: 2,
        initialCamSet: {
            scale: 5,
            centerX: 0,
            centerY: 0,
            centerZ: 0
        },
        captions: {
            A:'Α', B:'Β', G:'Γ', D:'Δ', M:'Μ', L:'Λ', E:'Ε', Z:'Ζ', H:'Η', Q:'Θ',
            Acursor: 'Α', Qcursor: 'Θ'
        },
        initialParams: {
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
        setup: (e) => Sequential(
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
        forward: [
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
        ]
    },
    Prop16: {
        stepMax: 5,
        initialCamSet: {
            scale: 5,
            centerX: 0,
            centerY: 0,
            centerZ: 0
        },
        captions: {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', Z:'Ζ', Q:'Θ', T:'Τ', N:'Ν',
            R:'Ρ', I:'Ι', L:'Λ', S:'Σ', H:'Η', K:'Κ',
            Efake: 'Ε?', Zfake: 'Ζ?', 
        },
        initialParams: {
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
        setup: (e) => Sequential(
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
        forward: [
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