// import * as THREE from "../../show2d.html"
import * as THREE from "https://unpkg.com/three@0.160.0/src/Three.js"


var pointSize = 2;
var pointColor = "#000000";
var lineWidth = 1;
var lineColor = "#444444";

// var Vector3 = THREE.Vector3

class Geometer {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.name = "prop1"
        this.step_min = 0;
        this.step_max = 2;
        this.step = 0;
        this.original = false;

        this.figureScale = 5.;
        this.figureCenter = [2.5, -0.5];
        
        this.camera.left = -this.figureScale;
        this.camera.right = this.figureScale;
        this.camera.top = this.figureScale;
        this.camera.bottom = -this.figureScale;
        this.camera.near = 1; this.camera.far = 1000;
        this.camera.position.set(...this.figureCenter, 10);
        this.camera.lookAt(...this.figureCenter, 0);
        // this.camera.up.set(0, 1, 0);
        this.camera.updateProjectionMatrix()

        this.setParams();
        this.build(false);
        this.render();
    }

    build(rebuild=true) {
        let params = this.params;
    
        let e_x = new THREE.Vector3(1, 0);
        let e_y = new THREE.Vector3(0, 1);
    
        let A0 = new THREE.Vector3(0, 0);
        let B0 = new THREE.Vector3();
        let A = new THREE.Vector3();
        let B = new THREE.Vector3();
        let C = new THREE.Vector3();
        let D = new THREE.Vector3();
        let E = new THREE.Vector3();
    
        let F0 = new THREE.Vector3();
        let G0 = new THREE.Vector3();
        let F = new THREE.Vector3();
        let G = new THREE.Vector3();
        let H = new THREE.Vector3();
        let I = new THREE.Vector3();
        let J = new THREE.Vector3();
    
        B0.copy(A0).addScaledVector(e_x, params.lengthUpperInit);
        D.copy(A0).addScaledVector(e_x, (params.lengthUpperInit*params.posMiddleUpper));
        C.copy(D).addScaledVector(e_x, -params.ratioLeftInit*D.distanceTo(A0));
        E.copy(D).addScaledVector(e_x, params.ratioRightInit*D.distanceTo(B0));
    
        F0.copy(A0).addScaledVector(e_y, -params.lengthUpperInit / params.aspectRatio);
        G0.copy(F0).addScaledVector(e_x, params.lengthUpperInit);
        I.copy(F0).addScaledVector(e_x, params.lengthUpperInit*params.posMiddleLower);
        H.copy(I).addScaledVector(e_x, -params.lengthRatioInit*C.distanceTo(D));
        J.copy(I).addScaledVector(e_x, params.lengthRatioInit*E.distanceTo(D));
    
        A.copy(D).addScaledVector(e_x, -params.multipleLeft*C.distanceTo(D))
            .multiplyScalar(1-params.initial)
            .addScaledVector(A0, params.initial);
        B.copy(D).addScaledVector(e_x, params.multipleRight*E.distanceTo(D))
            .multiplyScalar(1-params.initial)
            .addScaledVector(B0, params.initial);
        F.copy(I).addScaledVector(e_x, -params.lengthRatioInit*A.distanceTo(D))
            .multiplyScalar(1-params.initial)
            .addScaledVector(F0, params.initial);
        G.copy(I).addScaledVector(e_x, params.lengthRatioInit*B.distanceTo(D))
            .multiplyScalar(1-params.initial)
            .addScaledVector(G0, params.initial);
        
    
        let pointVectors = [A,B,C,D,E,F,G,H,I,J];
        let lineVectors = [[A,B], [F,G]];
        let tickVectors = [];
        for (let i=1; i<params.multipleLeft-1; i++) {
            tickVectors.push(new THREE.Vector3().copy(C).addScaledVector(new THREE.Vector3().copy(C).sub(D), i));
            tickVectors.push(new THREE.Vector3().copy(H).addScaledVector(new THREE.Vector3().copy(H).sub(I), i));
        }
        for (let i=1; i<params.multipleRight-1; i++) {
            tickVectors.push(new THREE.Vector3().copy(E).addScaledVector(new THREE.Vector3().copy(E).sub(D), i));
            tickVectors.push(new THREE.Vector3().copy(J).addScaledVector(new THREE.Vector3().copy(J).sub(I), i));
        }
        if (!rebuild) {
            this.pointObjects = [];
            let pointNames = ['Α','Β','Γ','Δ','Ε','Λ','Κ','Ζ','Η','Θ', '', '', '', ''];
            for (let i=0; i<pointVectors.length; i++) {
                let point = new THREE.Points(
                    new THREE.BufferGeometry(),
                    new THREE.PointsMaterial({color: 0x000000, size: 0.1})
                )
                point.name = pointNames[i];

                let caption = document.createElement("div");
                caption.style.position = "absolute";
                caption.textContent = point.name;
                this.renderer.domElement.parentNode.appendChild(caption);
                point.userData.caption = caption;
                this.pointObjects.push(point);
            }

            this.lineObjects = [];
            for (let i=0; i<lineVectors.length; i++) {
                let line = new THREE.LineSegments(
                    new THREE.BufferGeometry(),
                    new THREE.LineBasicMaterial({color: 0x000000, linewidth: 1})
                )
                this.lineObjects.push(line);
            }
            this.tickObjects = [];
            for (let i=0; i<tickVectors.length; i++) {
                let tick = new THREE.Points(
                    new THREE.BufferGeometry().setFromPoints(tickVectors),
                    new THREE.PointsMaterial({color: 0xaaaaaa, size: 0.1})
                );
                this.tickObjects.push(tick);
            }
            this.scene.add(...this.pointObjects, ...this.lineObjects, ...this.tickObjects);
            
        }

        let pointObjects = this.pointObjects;
        let lineObjects = this.lineObjects;
        let tickObjects = this.tickObjects;
        for (let i=0; i<pointVectors.length; i++) {
            let point = pointObjects[i];
            point.geometry.setFromPoints([pointVectors[i]]);

            let [cx, cy, cz] = (new THREE.Vector3()).copy(pointVectors[i]).project(this.camera);
            let [dx, dy, dz] = (new THREE.Vector3(...this.figureCenter)).project(this.camera);
            let renderSize = this.renderer.getSize();
            cx = renderSize.width*0.5*(cx-dx+1); cy = renderSize.height*0.5*(-cy+dy+1);
            let caption = point.userData.caption;
            // caption.style.top = cy;
            // caption.style.left = cx;
            caption.style.top = cy-this.renderer.domElement.parentNode.offsetTop;
            caption.style.left = cx+this.renderer.domElement.parentNode.offsetLeft;
        }
        for (let i=0; i<lineVectors.length; i++) {
            let line = lineObjects[i];
            line.geometry.setFromPoints(lineVectors[i]);
        }
        for (let i=0; i<tickVectors.length; i++) {
            let tick = tickObjects[i];
            tick.geometry.setFromPoints([tickVectors[i]]);
            tick.visible = (this.step >= 1)
        }
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    setParams() {
        this.params = {
            aspectRatio: 2.1,
            lengthUpperInit: 5,
            lengthRatioInit: 1.2,
            posMiddleUpper: 0.5,
            posMiddleLower: 0.7,
            ratioLeftInit: 0.3,
            ratioRightInit: 0.3,
            initial: 1,
            multipleLeft: 4.,
            multipleRight: 3.
        };
    }

    stepBack() {
        if (this.step <= this.step_min) {return;}
        if (this.original) {return;}
        if (this.step == 1) {
            this.params.initial = 1;
        }
        else if (this.step == 2) {
            this.params.multipleLeft = 4.;
            this.params.multipleRight = 3.;
        }
        this.step--;
        this.build();
        this.render();
    }
    stepForward() {
        if (this.step >= this.step_max) {return;}
        if (this.original) {return;}
        if (this.step == 0) {
            this.params.initial = 0;
        }
        else if (this.step == 1) {
            this.params.multipleLeft = 3.;
            this.params.multipleRight = 4.;
        }
        this.step++;
        this.build();
        this.render();
    }
    toggleOriginal() {
        if (this.original) {
            this.setParams();
        }
        else {
            this.params = {
                aspectRatio: 2.1,
                lengthUpperInit: 5,
                lengthRatioInit: 1.,
                posMiddleUpper: 0.5,
                posMiddleLower: 0.5,
                ratioLeftInit: 0.5,
                ratioRightInit: 0.5,
                initial: 1,
                multipleLeft: 2.,
                multipleRight: 2.
            };
        }
        this.original = !this.original;
        this.build();
        this.render();
    }
}

export {Geometer};