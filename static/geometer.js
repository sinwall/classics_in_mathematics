import * as THREE from 'three'
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js'
import {StyleSheet} from "./styler.js"
import {Vector, isEntityData} from "./construction.js"
import { AllParamsSummary } from './effects.js'


function newGeometricEntity(type, key, name, color=0x000000, size=1., pixelSize=1) {
    // return new GeometricEntity(type, name, color, size, pixelSize);

    switch (type) {
        case "point":
            return new PointEntity(type, key, name, color, size, pixelSize);
        case "points":
            return new PointsEntity(type, key, name, color, size, pixelSize);
        case "line":
            return new LineEntity(type, key, name, color, size, pixelSize);
        case "circle":
            return new CircleEntity(type, key, name, color, size, pixelSize);
        case "spiral":
            return new SpiralEntity(type, key, name, color, size, pixelSize);
        default:
            Error();
    }
}

class GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        this.type = type;
        this.key = key;
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
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
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
        this.size = value;
        this._obj3d.material.size = 4*value*this.pixelSize;
    }

}

class PointsEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
        this._obj3d = new THREE.Points(
            new THREE.BufferGeometry(),
            new THREE.PointsMaterial({color: color, size: 4*size*pixelSize})
        )
    }

    get captionPosition3d() {
        return (new THREE.Vector3(...this._obj3d.geometry.getAttribute("position").array));
    }

    setData(value) {
        this._obj3d.geometry.setFromPoints(value.points);
    }

    setSize(value) {
        this.size = value;
        this._obj3d.material.size = 4*value*this.pixelSize;
    }

}

class LineEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
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
        this.size = value;
        this._obj3d.material.linewidth = 1.5*value;
    }

}

class CircleEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
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

    atIntermediate(ary, t) {
        return ary.slice(0, 3*Math.floor(ary.length*t/3));
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
        this.size = value;
        this._obj3d.material.linewidth = 1.5*value;
    }
}

class SpiralEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
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
        this.size = value;
        this._obj3d.material.linewidth = 1.5*value;
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
        
        return import(`/static/${bookName}/ddc.js`)
            .then( function(result) {
                that.ddc = result.ddcs[sectionName];
                that.setup();
                callback();
            }).catch( function(reason) {
                that.ddc = null;
                console.log('Dynamic diagram configuration lot loaded');
                console.log(reason);
                let text = document.createElement('div');
                text.classList.add('diagram-warning');
                text.style.setProperty('position', 'absolute');
                text.style.setProperty('text-align', 'center');
                text.style.setProperty('width', that.renderer.domElement.parentNode.style.width);
                text.innerHTML = '그림이 없는 문서거나<br>그림이 준비되지 않았습니다.';
                that.renderer.domElement.parentNode.prepend(text);            
            });
        // return Promise.all([
        //     this.loadStyle(bookName, sectionName),
        //     this.loadGeometryCalculator(bookName, sectionName),
        //     this.loadSE(bookName, sectionName)
        // ]).then(function () {
        //     that.setup();
        //     callback();
        // }).catch(function(reason) {
        //     console.log('loading rejected', reason);
        //     // that.renderer.domElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        //     let text = document.createElement('div');
        //     text.classList.add('diagram-warning');
        //     text.style.setProperty('position', 'absolute');
        //     text.style.setProperty('text-align', 'center');
        //     text.style.setProperty('width', that.renderer.domElement.parentNode.style.width);
        //     text.innerHTML = '그림이 없는 문서거나<br>그림이 준비되지 않았습니다.';
        //     that.renderer.domElement.parentNode.prepend(text);
        //     // console.error(reason);
        // })
    }

    setup() {
        let style = this.style;
        let renderer = this.renderer;
        if (this.ddc) {
            this.camSetting = Object.assign({}, this.ddc.initialCamSet);
            this.params = Object.assign({}, this.ddc.initialParams);
            this.pixelSize = (2*this.ddc.initialCamSet.scale) / renderer.getSize().width;
            this.stepMax = this.ddc.stepMax;
            this.cameraReady(this.ddc.initialCamSet);
            let built = this.ddc.calculation(this.ddc.initialParams);
            this._objectsDict = {};
            for (let key in built) {
                let type;
                let caption;
                let builtData = built[key];
                if (! isEntityData(builtData)) {
                    if (builtData instanceof Vector) {
                        type = 'point';
                    } else if ((builtData instanceof Array) && (builtData.length == 2)) {
                        type = 'line';
                    } else {
                        type = 'points';
                    }
                } else {
                    type = builtData.getType();
                }
                if (key in this.ddc.captions) {caption = this.ddc.captions[key];}
                else {caption = '';}
                let gObj = newGeometricEntity(type, key, caption);
                gObj.setVisibility(false);
                gObj.attachCaption(this.renderer);
                this._objectsDict[key] = gObj;
                this.scene.add(gObj._obj3d);
            }
            this.build(this.ddc.initialParams);
            this.attachCaption(this.ddc.initialCamSet);

            this._fx = this.ddc.setupActions(this._objectsDict);
            this._fx.attachGeometer(this);
            let that = this;
            this._fx.action(50);

            this.currentAllParams = new AllParamsSummary(
                this.ddc.initialCamSet,
                this.ddc.initialParams,
                null
            )
            this.currentAllParams.update(this._fx.summary());
            // this._fx.action(50, null, function() {that.render();});
            this._useStyler = false;
        }
        // else if (this.specialEffects) {
        //     this.camSetting = Object.assign({}, this.specialEffects.initialCamSet);
        //     this.params = Object.assign({}, this.specialEffects.initialParams);

        //     this.pixelSize = (2*this.specialEffects.initialCamSet.scale) / renderer.getSize().width;
        //     // for (let i=0; i<this._objects.length; i++) {
        //     //     this._objects[i].setVisibility(false);
        //     // }
        //     this.stepMax = this.specialEffects.stepMax;
        //     this.cameraReady(this.specialEffects.initialCamSet);
        //     let built = this.calculateGeometry(this.specialEffects.initialParams);

        //     this._objectsDict = {};
        //     for (let key in built) {
        //         let type;
        //         let caption;
        //         let builtData = built[key];
        //         if (! isEntityData(builtData)) {
        //             if (builtData instanceof Vector) {
        //                 type = 'point';
        //             } else if ((builtData instanceof Array) && (builtData.length == 2)) {
        //                 type = 'line';
        //             } else {
        //                 type = 'points';
        //             }
        //         } else {
        //             type = builtData.getType();
        //         }
        //         if (key in this.specialEffects.captions) {caption = this.specialEffects.captions[key];}
        //         else {caption = '';}
        //         let gObj = newGeometricEntity(type, key, caption);
        //         gObj.setVisibility(false);
        //         gObj.attachCaption(this.renderer);
        //         this._objectsDict[key] = gObj;
        //         this.scene.add(gObj._obj3d);
        //     }
        //     this.build(this.specialEffects.initialParams);
        //     this.attachCaption(this.specialEffects.initialCamSet);

        //     this._fx = this.specialEffects.setup(this._objectsDict);
        //     this._fx.attachGeometer(this);
        //     let that = this;
        //     this._fx.action(50);

        //     this.currentAllParams = new AllParamsSummary(
        //         this.specialEffects.initialCamSet,
        //         this.specialEffects.initialParams,
        //         null
        //     )
        //     this.currentAllParams.update(this._fx.summary());
        //     // this._fx.action(50, null, function() {that.render();});
        //     this._useStyler = false;

        // } else if (style) {
        //     this._useStyler = true;
        //     this.pixelSize = (2*style.hparamTrend[0].scale) / renderer.getSize().width;
        //     this.camSetting = this.style.getCamSetting();
        //     this.params = this.style.getParams(0, false);

        //     this.stepMax = style.stepMax;
        //     this._nameToIdx = {};
        //     this._objectsDict = {};
    
        //     let objTypes = style.objTypes;
        //     let objNames = style.objNames;
        //     let objCaptions = style.objCaptions;
        //     let objColors = style.objStyleTrend[0];
        //     let objSizes = style.objStyleTrend[0];
        //     for (let i=0; i<style.nObjs; i++) {
        //         let gObj = newGeometricEntity(objTypes[i], objNames[i], objCaptions[i], objColors[i].color, objSizes[i].size, this.pixelSize);
        //         gObj.attachCaption(renderer);
        //         this._nameToIdx[objNames[i]] = i;
        //         this._objectsDict[objNames[i]] = gObj;
        //         this.scene.add(gObj._obj3d);
        //     }
        //     this.buildAndRenderIfLoaded();
            
        // }

    }

    build(params=null) {
        if (params === null) {params = this.params;}
        let entityDatas = this.ddc.calculation(params);

        for (let key in this._objectsDict) {
            let gObj = this._objectsDict[key];
            gObj.setData(entityDatas[key]);
            gObj.setPixelSize(this.pixelSize);
        }
        if (this._useStyler) {
            for (let i=0; i<this.style.nObjs; i++) {
                let key = this.style.objNames[i];
                let gObj = this._objectsDict[key];
                gObj.setColor(this.style.objStyleTrend[this.step][i].color);
                gObj.setSize(this.style.objStyleTrend[this.step][i].size);
            }
        }
    }

    attachCaption(camSet) {
        if (!camSet) { camSet = this.camSetting; }
        for (let key in this._objectsDict) {
            let gObj = this._objectsDict[key];
        // }
        // for (let i=0; i<this._objects.length; i++) {
        //     let gObj = this._objects[i];

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
        for (let key in this._objectsDict) {
            let gObj = this._objectsDict[key];
            gObj.setPixelSize(this.pixelSize);
        }
    }

    clear() {
        for (let i=this.scene.children.length-1; i>=0; i--) {
            this.scene.remove(this.scene.children[0]);
        }
        for (let key in this._objectsDict) {
            this._objectsDict[key]._caption.remove();
        }
        this.render();
        if (this._fx) {this._fx.terminate();this._fx = null;}
        this._objectsDict = {};
        this.step = 0;
        this.original = false;

        let warnBox = this.renderer.domElement.parentNode.querySelector('.diagram-warning');
        if (warnBox) {warnBox.remove();}
    }

    // get camSetting() {
    //     return this.style.getCamSetting(this.step, this.original);
    // }

    get domElement() {
        return this.renderer.domElement
    }

    // get params() {
    //     return this.style.getParams(this.step, this.original);
    // }

    getEntity(name) {
        return this._objects[this._nameToIdx[name]];
    }

    // async loadGeometryCalculator(bookName, sectionName) {
    //     // let {calculateGeometry} = await import(fileName);
    //     // this.calculateGeometry = calculateGeometry;
    //     if (!('calculations' in this)) {
    //         let {calculations} = await import(`/static/${bookName}/calc.js`);
    //         this.calculations = calculations;
    //     }
    //     this.calculateGeometry = this.calculations[sectionName];
    // }

    async loadSE(bookName, sectionName) {
        if (!('specialEffectsBundle' in this)) {
            let {specialEffects} = await import(`/static/${bookName}/SEs.js`);
            this.specialEffectsBundle = specialEffects;
        }
        if (sectionName in this.specialEffectsBundle) {
            this.specialEffects = this.specialEffectsBundle[sectionName];
        } else {
            this.specialEffects = null;
        }
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
        if (this._useStyler) {
            this.params = this.style.getParams(this.step);
            this.buildAndRenderIfLoaded();
        } else {
            this._fx.terminate();
            let entities = {};
            for (let key in this._objectsDict) {
                entities[key] = {
                    size: 1,
                    visibility: false,
                    color: 'black'
                };
            }
            let tempAllParams = new AllParamsSummary(
                this.ddc.initialCamSet,
                this.ddc.initialParams,
                entities
            );
            tempAllParams.update(this.ddc.setupActions(this._objectsDict).summary());
            for (let i=0; i<this.step; i++) {
                tempAllParams.update(this.ddc.forwardActions[i](this._objectsDict).summary());
            }
            this._fx.terminate();
            this._fx = this.ddc.forwardActions[this.step](this._objectsDict).reversed(tempAllParams);
            this._fx.attachGeometer(this);
            let that = this;
            this._fx.action(50);
            this.currentAllParams.update(this._fx.summary());

        }

    }
    stepForward() {
        if (this.step >= this.stepMax) {return;}
        if (this.original) {return;}
        this.step++;
        if (this._useStyler) {
            this.params = this.style.getParams(this.step);
            this.buildAndRenderIfLoaded();
        } else {
            this._fx.terminate();
            this._fx = this.ddc.forwardActions[this.step-1](this._objectsDict);
            this._fx.attachGeometer(this);
            let that = this;
            this._fx.action(50);
            this.currentAllParams.update(this._fx.summary());

        }
    }

    toggleOriginal() {
        this.original = !this.original;
        this.buildAndRenderIfLoaded();
    }
}

export {Geometer};