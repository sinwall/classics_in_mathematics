import * as THREE from 'three'
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js'
import {StyleSheet} from "./styler.js"
import {Vector} from "./construction.js"


function newGeometricEntity(type, name, color=0x000000, size=1., pixelSize=1) {
    // return new GeometricEntity(type, name, color, size, pixelSize);

    switch (type) {
        case "point":
            return new PointEntity(type, name, color, size, pixelSize);
        case "points":
            return new PointsEntity(type, name, color, size, pixelSize);
        case "line":
            return new LineEntity(type, name, color, size, pixelSize);
        case "circle":
            return new CircleEntity(type, name, color, size, pixelSize);
        case "spiral":
            return new SpiralEntity(type, name, color, size, pixelSize);
        default:
            Error();
    }
}

class GeometricEntity {
    constructor(type, name, color=0x000000, size=1., pixelSize=1,) {
        this.type = type;
        this.name = name;
        this.color = color;
        this.size = size;
        this.pixelSize = pixelSize;

        this.resolution = 360;
        this._caption = document.createElement('div');
        this._caption.classList.add('unselectable');
        this._caption.style.position = 'absolute';
        this._caption.textContent = name;

        // switch (this.type) {
        //     case "point":
        //         this._obj3d = new THREE.Points(
        //             new THREE.BufferGeometry(),
        //             new THREE.PointsMaterial({color: color, size: 4*size*pixelSize})
        //         )
        //         break;
        //     case "points":
        //         this._obj3d = new THREE.Points(
        //             new THREE.BufferGeometry(),
        //             new THREE.PointsMaterial({color: color, size: 4*size*pixelSize})
        //         )
        //         break;
        //     case "line":
        //         this._obj3d = new THREE.LineSegments(
        //             new THREE.BufferGeometry(),
        //             new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size})
        //         )
        //         break;
        //     case "circle":
        //         this._unitCircle = (new THREE.CircleGeometry(1, this.resolution))
        //             .getAttribute("position")
        //             .array
        //             .slice(3)
        //         let g = new THREE.BufferGeometry()
        //         g.setAttribute(
        //             "position", 
        //             new THREE.BufferAttribute(this._unitCircle, 3)
        //         );
        //         this._obj3d = new THREE.LineLoop(
        //             g,
        //             new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size})
        //         );
        //         this._center = new THREE.Vector3();
        //         break;
        //     case 'spiral':
        //         this._obj3d = new THREE.Line(
        //             new THREE.BufferGeometry(),
        //             new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size})
        //         )
        //         break;
        // }
    }
    attachCaption (renderer) {
        renderer.domElement.parentNode.appendChild(this._caption);
    }
    // get captionPosition3d() {
    //     let ary;
    //     switch (this.type) {
    //         case "point":
    //             return (new THREE.Vector3(...this._obj3d.geometry.getAttribute("position").array));
    //         case "points":
    //             return (new THREE.Vector3(...this._obj3d.geometry.getAttribute("position").array));
    //         case "line":
    //             ary = this._obj3d.geometry.getAttribute("position").array;
    //             return (new THREE.Vector3(0.5*(ary[0]+ary[3]), 0.5*(ary[1]+ary[4]), 0.5*(ary[2]+ary[5])));
    //         case "circle":
    //             return this._center;
    //         case 'spiral':
    //             ary = this._obj3d.geometry.getAttribute("position").array;
    //             return (new THREE.Vector3(ary[0], ary[1], ary[2]));
    //     }
    // }
    get visible() {
        return this._obj3d.visible;
    }
    setCaptionPosition(top, left) {
        this._caption.style.top = top;
        this._caption.style.left = left;
    }
    // setData(value) {
    //     if (value instanceof Vector) {
    //         value = value.asTHREE();
    //     } else if (value instanceof Array) {
    //         let value_new = [];
    //         for (let i=0; i<value.length; i++) {
    //             if (value[i] instanceof Vector) {
    //                 value_new.push(value[i].asTHREE());
    //             } else {
    //                 value_new.push(value[i]);
    //             }
    //         }
    //         value = value_new;
    //     }
    //     switch (this.type) {
    //         case "point":
    //             this._obj3d.geometry.setFromPoints([value]);
    //             break;
    //         case "points":
    //             this._obj3d.geometry.setFromPoints(value);
    //             break;
    //         case "line":
    //             this._obj3d.geometry.setFromPoints(value);
    //             break;
    //         case "circle":
    //             let pointsOnCircle = [];
    //             let resolution = Math.ceil(this.resolution*Math.abs(value.end-value.start)/360)
    //             for (let i=0; i<=resolution; i++) {
    //                 let theta = value.start + (i/resolution)*(value.end-value.start);
    //                 pointsOnCircle.push(value.pick(theta));
    //             }
    //             this._obj3d.geometry.setFromPoints(pointsOnCircle);
    //             break;
    //         case 'spiral':
    //             let pointsOnSpiral = [];
    //             for (let i=0; i<=this.resolution; i++) {
    //                 let theta = value.start + (i/this.resolution)*(value.end-value.start);
    //                 pointsOnSpiral.push(value.pick(theta));
    //             }
    //             this._obj3d.geometry.setFromPoints(pointsOnSpiral);
    //             // console.log(this._obj3d.geometry)
    //             break;
    //     }
    // }

    setColor(value) {
        // return;
        if (this._obj3d.material.color.getHex() == value) {return;}
        this._obj3d.material.color.set( value );
    }

    setPixelSize(value) {
        this.pixelSize = value;
        if (this.type == 'point' || this.type == 'points') {
            this._obj3d.material.size = 4*this.size*value;
        }
    }

    // setSize(value) {
    //     switch (this.type) {
    //         case "point":
    //             this._obj3d.material.size = 4*value*this.pixelSize;
    //             break;
    //         case "points":
    //             this._obj3d.material.size = 4*value*this.pixelSize;
    //             break;
    //         case "line":
    //             this._obj3d.material.linewidth = 1.5*value;
    //             break;
    //         case "circle":
    //             this._obj3d.material.linewidth = 1.5*value;
    //             break;
    //         case 'spiral':
    //             this._obj3d.material.linewidth = 1.5*value;
    //             break;

    //     }
    // }

    setVisibility(value) {
        if (typeof(value) == "number") { value = (value == 1); }
        this._obj3d.visible = value;
        if (value) { this._caption.style.visibility = "visible"; }
        else {this._caption.style.visibility = "hidden"; }
    }

}

class PointEntity extends GeometricEntity {
    constructor(type, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, name, color, size, pixelSize);
        this._obj3d = new THREE.Points(
            new THREE.BufferGeometry(),
            new THREE.PointsMaterial({color: color, size: 4*size*pixelSize})
        )
    }

    get captionPosition3d() {
        return (new THREE.Vector3(...this._obj3d.geometry.getAttribute("position").array));
    }

    setData(value) {
        this._obj3d.geometry.setFromPoints([value]);
    }

    setSize(value) {
        this._obj3d.material.size = 4*value*this.pixelSize;
    }

}

class PointsEntity extends GeometricEntity {
    constructor(type, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, name, color, size, pixelSize);
        this._obj3d = new THREE.Points(
            new THREE.BufferGeometry(),
            new THREE.PointsMaterial({color: color, size: 4*size*pixelSize})
        )
    }

    get captionPosition3d() {
        return (new THREE.Vector3(...this._obj3d.geometry.getAttribute("position").array));
    }

    setData(value) {
        this._obj3d.geometry.setFromPoints(value);
    }

    setSize(value) {
        this._obj3d.material.size = 4*value*this.pixelSize;
    }

}

class LineEntity extends GeometricEntity {
    constructor(type, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, name, color, size, pixelSize);
        this._obj3d = new THREE.Line(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size})
        )
    }

    get captionPosition3d() {
        let ary = this._obj3d.geometry.getAttribute("position").array;
        return (new THREE.Vector3(0.5*(ary[0]+ary[3]), 0.5*(ary[1]+ary[4]), 0.5*(ary[2]+ary[5])));
    }

    atIntermediate(ary, t) {
        let result = ary.slice(0, 6);
        for (let i=0; i<3; i++) {
            result[i+3] = (1-t)*ary[i] + t*ary[i+3];
        }
        return result;
    }

    setData(value) {
        this._obj3d.geometry.setFromPoints(value);
    }

    setSize(value) {
        this._obj3d.material.linewidth = 1.5*value;
    }

}

class CircleEntity extends GeometricEntity {
    constructor(type, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, name, color, size, pixelSize);
        let g = new THREE.BufferGeometry()
        g.setAttribute(
            "position", 
            new THREE.BufferAttribute(this._unitCircle, 3)
        );
        this._obj3d = new THREE.LineLoop(
            g,
            new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size})
        );
        this._center = new THREE.Vector3();
    }

    get captionPosition3d() {
        return this._center;
    }

    setData(value) {
        let pointsOnCircle = [];
        let resolution = Math.ceil(this.resolution*Math.abs(value.end-value.start)/360)
        for (let i=0; i<=resolution; i++) {
            let theta = value.start + (i/resolution)*(value.end-value.start);
            pointsOnCircle.push(value.pick(theta));
        }
        this._obj3d.geometry.setFromPoints(pointsOnCircle);
    }

    setSize(value) {
        this._obj3d.material.linewidth = 1.5*value;
    }
}

class SpiralEntity extends GeometricEntity {
    constructor(type, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, name, color, size, pixelSize);
        this._obj3d = new THREE.Line(
            new THREE.BufferGeometry(),
            new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size})
        );
    }

    get captionPosition3d() {
        let ary = this._obj3d.geometry.getAttribute("position").array;
        return (new THREE.Vector3(ary[0], ary[1], ary[2]));
    }

    atIntermediate(ary, t) {
        return ary.slice(0, 3*Math.floor(ary.length*t/3));
    }

    setData(value) {
        let pointsOnSpiral = [];
        for (let i=0; i<=this.resolution; i++) {
            let theta = value.start + (i/this.resolution)*(value.end-value.start);
            pointsOnSpiral.push(value.pick(theta));
        }
        this._obj3d.geometry.setFromPoints(pointsOnSpiral);
    }

    setSize(value) {
        this._obj3d.material.linewidth = 1.5*value;
    }
}

class BaseFX {

    setAfter(after) {
        this.after = after;
    }
}

class DrawingFX extends BaseFX{
    constructor(entity, duration, interval, timing) {
        super();
        this.entity = entity;
        this.duration = duration;
        this.interval = interval;
        this.timing = timing;
        
        this.after = null;
    }

    action(callback) {
        let tmp = this.entity._obj3d.geometry.getAttribute('position').array;
        let epoch = Date.now();
        let that = this;
        let timer = setInterval(
            function () {
                let progress = (Date.now() - epoch) / that.duration;
                if ((progress >= 1)) {
                    clearInterval(timer);
                    that.entity._obj3d.geometry.setAttribute(
                        'position', 
                        new THREE.BufferAttribute(that.entity.atIntermediate(tmp, progress), 3)
                    );
                    if (callback) { callback(); }
                    if (this.after) { this.after(); }
                    return;
                }
                
                that.entity._obj3d.geometry.setAttribute(
                    'position', 
                    new THREE.BufferAttribute(that.entity.atIntermediate(tmp, progress), 3)
                );
                if (callback) { callback(); }
            }, 
            this.interval
        );
    }

}

class Geometer {
    constructor(box, width=null, height=null) {
        this.box = box;
        if (!width) { width = +box.style.width.replace("px", ""); }
        if (!height) { height = +box.style.height.replace("px", ""); }
        this.width = width;
        this.height = height;

        let renderer = new SVGRenderer();
        // let renderer = new THREE.WebGLRenderer();
        // const renderer = new CSS3DRenderer();
        renderer.setSize(width, height, false);
        box.appendChild(renderer.domElement);
        
        let scene = new THREE.Scene();
        let camera = new THREE.OrthographicCamera();
    // constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this.stepMin = 0;
        this.step = 0;
        this.original = false;

        this.currentAnimation = null;
    }

    loadSource(bookName, sectionName, callback) {
        // let styleFileName = sourcePath + "_fig_param.csv";
        // let calcFileName = sourcePath + "_calc.js";
        let camera = this.camera;
        let that = this;
        return Promise.all([
            this.loadStyle(bookName, sectionName),
            this.loadGeometryCalculator(bookName, sectionName)
        ]).then(function () {
            let style = that.style;
            let renderer = that.renderer;
            if (style) {
                that.pixelSize = (2*style.hparamTrend[0].scale) / renderer.getSize().width;
                
        
                that.stepMax = style.stepMax;
                that._objects = []
        
                let objTypes = style.objTypes;
                let objCaptions = style.objCaptions;
                let objColors = style.objStyleTrend[0];
                let objSizes = style.objStyleTrend[0];
                for (let i=0; i<style.nObjs; i++) {
                    let gObj = newGeometricEntity(objTypes[i], objCaptions[i], objColors[i].color, objSizes[i].size, that.pixelSize);
                    gObj.attachCaption(renderer);
                    that._objects.push(gObj);
                    that.scene.add(gObj._obj3d)
                }
                that.buildAndRenderIfLoaded();
                
                // let fx = new DrawingFX(that._objects.at(-1), 500, 50);
                // let fx2 = new DrawingFX(that._objects.at(13), 500, 50);

                // fx.action(function() {that.render();});
                // fx2.action();
            }
            callback();
        }).catch(function(reason) {
            console.log('loading rejected', reason);
            // that.renderer.domElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            let text = document.createElement('div');
            text.classList.add('diagram-warning');
            text.style.setProperty('position', 'absolute');
            text.style.setProperty('text-align', 'center');
            text.style.setProperty('width', that.renderer.domElement.parentNode.style.width);
            text.innerHTML = '그림이 없는 문서거나<br>그림이 준비되지 않았습니다.';
            that.renderer.domElement.parentNode.prepend(text);
            // console.error(reason);
        })
    }

    build(params=null) {
        if (params === null) {params = this.params;}
        let entityDatas = this.calculateGeometry(params);

        let objStyles;
        if (this.original) { objStyles = this.style.objStyleOrig; }
        else { objStyles = this.style.objStyleTrend[this.step]; }
        for (let i=0; i<this._objects.length; i++) {
            let gObj = this._objects[i];
            let sty = objStyles[i];
            gObj.setData(entityDatas[this.style.objNames[i]]);
            gObj.setVisibility(sty.visible);
            gObj.setColor(sty.color);
            gObj.setSize(sty.size);
            gObj.setPixelSize(this.pixelSize);
        }
    }

    attachCaption(camSet) {
        if (!camSet) { camSet = this.camSetting; }
        for (let i=0; i<this._objects.length; i++) {
            let gObj = this._objects[i];

            let [cx, cy, cz] = gObj.captionPosition3d.clone().project(this.camera);
            let [dx, dy, dz] = (new THREE.Vector3(
                camSet.centerX, 
                camSet.centerY,
                camSet.centerZ
            )).project(this.camera);
            let renderSize = this.renderer.getSize();
            gObj.setCaptionPosition(
                renderSize.height*0.5*(-cy+dy+1) - this.renderer.domElement.parentNode.offsetTop,
                renderSize.width*0.5*(cx-dx+1) + this.renderer.domElement.parentNode.offsetLeft
            )
        }
    }

    buildAndRenderIfLoaded() {
        // if (!this._loaded) {return;}
        this.cameraReady();
        this.build();
        this.attachCaption();
        this.render();
    }

    cameraReady (camSet) {
        if (!camSet) { camSet = this.camSetting; }
        let camera = this.camera;
        let scale = camSet.scale;
        let centerX = camSet.centerX;
        let centerY = camSet.centerY;
        let centerZ = camSet.centerZ;
        camera.left = -scale;
        camera.right = scale;
        camera.top = scale;
        camera.bottom = -scale;
        camera.near = 1; camera.far = 1000;
        camera.position.set(centerX, centerY, centerZ+10);
        camera.lookAt(centerX, centerY, centerZ);
        camera.updateProjectionMatrix();
        this.pixelSize = (2*camSet.scale) / this.renderer.getSize().width;
    }

    clear() {
        for (let i=this.scene.children.length-1; i>=0; i--) {
            this.scene.remove(this.scene.children[0]);
        }
        if ('_objects' in this) {
            for (let i=0; i<this._objects.length; i++) {
                this._objects[i]._caption.remove();
            }
        }
        this.render();
        this._objects = [];
        this.step = 0;
        this.original = false;

        let warnBox = this.renderer.domElement.parentNode.querySelector('.diagram-warning');
        if (warnBox) {warnBox.remove();}
    }

    get camSetting() {
        return this.style.getCamSetting(this.step, this.original);
    }

    get domElement() {
        return this.renderer.domElement
    }

    get params() {
        return this.style.getParams(this.step, this.original);
    }

    async loadGeometryCalculator(bookName, sectionName) {
        // let {calculateGeometry} = await import(fileName);
        // this.calculateGeometry = calculateGeometry;
        if (!('calculations' in this)) {
            let {calculations} = await import(`/static/${bookName}/calc.js`);
            this.calculations = calculations;
        }
        this.calculateGeometry = this.calculations[sectionName];
    }

    loadStyle(bookName, sectionName) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `/diagram-parameters/${bookName}/${sectionName}`);
            xhr.onload = function () {
                if ((xhr.status >= 200) && (xhr.status < 400)) {
                    if (xhr.responseText) {
                        that.style = new StyleSheet(xhr.responseText);
                        resolve();
                    } else {
                        that.style = null;
                        console.log("style loading rejected;")
                        reject();
                    }
                }
                else {
                    that.style = null;
                    console.log("style loading rejected;")
                    reject();
                }
            }
            xhr.send();
        })
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }

    stepBack() {
        if (this.step <= this.stepMin) {return;}
        if (this.original) {return;}
        this.step--;
        this.buildAndRenderIfLoaded();
    }
    stepForward() {
        if (this.step >= this.stepMax) {return;}
        if (this.original) {return;}
        // this.step++;
        // this.buildAndRenderIfLoaded();

        let paramsBf = this.params;
        let camSetBf = this.camSetting;
        this.step++;
        let paramsAf = this.params;
        let camSetAf = this.camSetting;
        let fps = 20;
        let duration = 1;
        let that = this;
        let epoch = Date.now();
        if (this.currentAnimation) {
            clearInterval(this.currentAnimation);
        }
        let timer = setInterval(
            function () {
                let timePassed = Date.now() - epoch;
                if ((timePassed >= duration*1000)) {
                    clearInterval(timer);
                    that.buildAndRenderIfLoaded();
                    that.currentAnimation = null;
                    return;
                }
            that.animate(camSetBf, paramsBf, camSetAf, paramsAf, timePassed / (duration*1000))
            }, 
            duration*1000/fps
        );
        this.currentAnimation = timer;


    }
    animate(camSetBf, paramsBf, camSetAf, paramsAf, progress) {
        let camSet = {};
        for (let key in camSetBf) {
            camSet[key] = progress*camSetAf[key] + (1-progress)*camSetBf[key];
        }
        let params = {};
        for (let key in paramsBf) {
            params[key] = progress*paramsAf[key] + (1-progress)*paramsBf[key];
        }
        this.cameraReady(camSet);
        this.build(params);
        this.attachCaption(camSet);
        this.render();
    }
    toggleOriginal() {
        this.original = !this.original;
        this.buildAndRenderIfLoaded();
    }
}

export {Geometer};