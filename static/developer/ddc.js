import {
    CameraSetting, DynamicDiagramConfiguration
} from '/static/structures.js'
import {
    newVector as Vector, newPoints as Points, newLine as Line, newCircle as Circle, newSpiral as Spiral,
    newCylinder as Cylinder, newCone as Cone,
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
} from '/static/effects.js'

let ddcs = {
    Intro: new DynamicDiagramConfiguration(
        5,
        new CameraSetting(
            5,
            0, 0, 0,
            30, 30
        ),
        {
            coneRadius: 2,
            coneHeight: 4
        },
        function (params) {
            let {
                coneRadius, coneHeight,
            } = params;

            let A = Vector(3, 0, 0);
            let B = Vector(0, 3, 0);
            let G = Vector(0, 0, 3);
            let K = Vector();
            let cyl1 = Cylinder(Vector(5, 0, 0), coneRadius, coneHeight);
            let cyl2 = Cylinder(Vector(0, 5, 0), 2*coneRadius, coneHeight);
            let cyl3 = Cylinder(Vector(0, 0, 5), coneRadius, 2*coneHeight);
            let datas = {
                A, B, G,K,
                KA:[K,A], KB:[K,B], KG:[K,G],
                cyl1, cyl2, cyl3
            };
            return datas;
        },
         (e) => Sequential(
            ChangeStyle(1, e.cyl1, 0x99ccff),
            ChangeStyle(1, e.cyl2, 0xccff99),
            ChangeStyle(1, e.cyl3, 0xff99cc),
            Show(200, e.K),
            Show(200, e.A),
            Show(200, e.B),
            Show(200, e.G),
            Show(200, e.KA),
            Show(200, e.KB),
            Show(200, e.KG),
            Show(200, e.cyl1),
        ),
        [
            (e) => Sequential(
                Show(200, e.cyl2)
            ),
            (e) => Sequential(
                Show(200, e.cyl3)
            ),
        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', K:'Κ', L:'Λ', Z:'Ζ', H:'Η', Q:'Θ', 
        },
    )
};

export {ddcs};