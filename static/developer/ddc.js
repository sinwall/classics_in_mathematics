import {
    CameraSetting, DynamicDiagramConfiguration
} from '/static/structures.js'
import {
    newVector as Vector, 
    newMultiObjects as MultiObjects,
    newPoints as Points, newLine as Line, newCircle as Circle, newSpiral as Spiral,
    newCylinder as Cylinder, newCone as Cone, newGeneralCone as GeneralCone, newGeneralCylinder as GeneralCylinder
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
            30, 30, 10, false
        ),
        {
            coneRadius: 2,
            coneHeight: 4,
            nDivision: 10
        },
        function (params) {
            let {
                coneRadius, coneHeight, nDivision
            } = params;

            // let A = Vector(3, 0, 0);
            // let B = Vector(0, 3, 0);
            // let G = Vector(0, 0, 3);
            // let K = Vector();
            // let cyl1 = Cylinder(Vector(0, 0, 0), coneRadius, coneHeight);
            // let cyl2 = Cylinder(Vector(0, 5, 0), 2*coneRadius, coneHeight);
            // let cyl3 = Cylinder(Vector(0, 0, 5), coneRadius, 2*coneHeight);
            // let con1 = Cone(Vector(0, 0, 0), coneRadius, coneHeight, 0, 4.71);
            // let con2 = Cone(Vector(0, 0, 0), coneRadius, coneHeight, 4.71, 1.57);
            let genCon = GeneralCone(
                Vector(0, 0, -coneHeight/2), Vector(coneRadius, 0, -coneHeight/2), 
                Vector(0, 0, 1), Vector(0, 0, coneHeight/2), 
                0, 90
            );
            let genCyl = GeneralCylinder(
                Vector(0, 0, -coneHeight/2), Vector(coneRadius, 0, -coneHeight/2), 
                Vector(0, 0, 1), Vector(0, 0, coneHeight/2), 
                0, 90
            );
            let smallCones = [];
            let smallCylinders = [];
            for (let i=0; i<nDivision; i++) {
                smallCones.push(
                    GeneralCylinder(
                        Vector(0, 0, -coneHeight/2+i*coneHeight/nDivision), 
                        Vector(
                            (1-i/nDivision)*coneRadius*degCos(-360*i/nDivision), 
                            (1-i/nDivision)*coneRadius*degSin(-360*i/nDivision), 
                            -coneHeight/2+i*coneHeight/nDivision), 
                        Vector(0, 0, 1), Vector(0, 0, -coneHeight/2+(i+1)*coneHeight/nDivision), 
                        0, 360
                    )
                )
                smallCylinders.push(
                    GeneralCylinder(
                        Vector(0, 0, -coneHeight/2+i*coneHeight/nDivision), 
                        Vector(
                            coneRadius*degCos(-360*i/nDivision), coneRadius*degSin(-360*i/nDivision), 
                            -coneHeight/2+i*coneHeight/nDivision), 
                        Vector(0, 0, 1), Vector(0, 0, -coneHeight/2+(i+1)*coneHeight/nDivision), 
                        0, 360
                    )
                )
            }
            let datas = {
                // A, B, G,K,

                // KA:[K,A], KB:[K,B], KG:[K,G],
                // cyl1, cyl2, cyl3, con1, con2, 
                genCon, genCyl, 
                cons: MultiObjects('generalCone', smallCones),
                cyls: MultiObjects('generalCylinder', smallCylinders)
            };
            return datas;
        },
         (e) => Sequential(
            ChangeStyle(1, e.genCyl, 0x99ccff),
            ChangeStyle(1, e.cyls, 0x99ccff),
            ChangeStyle(1, e.genCon, 0xff99cc),
            ChangeStyle(1, e.cons, 0xff99cc),
            Show(200, e.genCon),
            Show(200, e.genCyl),
        ),
        [
            (e) => Sequential(
                Hide(200, e.genCon),
                Hide(200, e.genCyl),
                Show(200, e.cons),
                Show(200, e.cyls),
            ),
        ],
        {
            A:'Α', B:'Β', G:'Γ', D:'Δ', E:'Ε', K:'Κ', L:'Λ', Z:'Ζ', H:'Η', Q:'Θ', 
        },
    )
};

export {ddcs};