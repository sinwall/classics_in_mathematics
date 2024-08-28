import * as THREE from 'three'
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js'
import {Vector, isEntityData, isMultiObjectsData} from "./construction.js"
import { AllParamsSummary } from './effects.js'


function newGeometricEntity(type, key, name, color=0x000000, size=1., pixelSize=1, subtype=null) {
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
        case "cylinder":
            return new CylinderEntity(type, key, name, color, size, pixelSize);
        case "cone":
            return new ConeEntity(type, key, name, color, size, pixelSize);
        case "generalCylinder":
            return new GeneralConeEntity(type, key, name, color, size, pixelSize);
        case "generalCone":
            return new GeneralCylinderEntity(type, key, name, color, size, pixelSize);
        case "multi":
            return new MultiObjectsEntity(type, key, name, color, size, pixelSize, subtype)
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
    }

    addToScene(scene) {
        scene.add(this._obj3d);
    }

    attachCaption (renderer) {
        renderer.domElement.parentNode.appendChild(this._caption);
    }
    getMaterial() {
        return this.material;
    }
    get visible() {
        return this._obj3d.visible;
    }
    setCaptionPosition(top, left) {
        this._caption.style.top = top;
        this._caption.style.left = left;
    }

    setColor(value) {
        this.color = value;
        if (this._obj3d.material.color.getHex() == value) {return;}
        this._obj3d.material.color.set( value );
    }

    setPixelSize(value) {
        this.pixelSize = value;
        if (this.type == 'point' || this.type == 'points') {
            this._obj3d.material.size = 4*this.size*value;
        }
    }

    setVisibility(value) {
        if (typeof(value) == "number") { value = (value == 1); }
        this._obj3d.visible = value;
        if (value) { this._caption.style.visibility = "visible"; }
        else {this._caption.style.visibility = "hidden"; }
    }

}

class MultiObjectsEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1, subtype) {
        super(type, key, name, color, size, pixelSize);
        this.subtype = subtype;
        this.children = [];
        
        if (['point', 'points'].includes(this.subtype)) {
            this.commonMaterial = new THREE.PointsMaterial({color: color, size: 4*size*pixelSize});
        } else if (['line', 'circle', 'spiral'].includes(this.subtype)) {
            this.commonMaterial = new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size});
        } else {
            this.commonMaterial = new THREE.MeshBasicMaterial({color: color, opacity: 0.5, transparent: true});
        }
    }

    addToScene(scene) {
        this.scene = scene;
        this.children.forEach(function (x) {x.addToScene(scene);});
    }

    getMaterial() {
        return this.commonMaterial;
    }

    get visible() {
        if (this.children.length > 0) {
            return this.children[0].visible;
        } else {
            return false;
        }
    }

    get captionPosition3d() {
        return new THREE.Vector3();
    }

    setColor(value) {
        this.color = value;
        this.children.forEach(function (x) {x.setColor(value);});
    }

    setPixelSize(value) {
        this.pixelSize = value;
        this.children.forEach(function (x) {x.setPixelSize(value);});
    }

    setVisibility(value) {
        this.children.forEach(function (x) {x.setVisibility(value);});
    }

    setData(value) {
        // this.children = [];
        let valueLength = value.data.length;
        for (let i=0; i<Math.min(valueLength, this.children.length); i++) {
            // this.children.push(
            //     newGeometricEntity(
            //         value.subtype, this.key, `${this.name}_${i}`, 
            //         this.color, this.size, this.pixelSize
            //     )
            // )
            this.children[i].setData(value.data[i]);
            // this.children[i]._obj3d.material = this.commonMaterial;
        }
        if (valueLength > this.children.length) {
            for (let i=this.children.length; i<valueLength; i++) {
                let newEntity = newGeometricEntity(
                    value.subtype, this.key, `${this.name}_${i}`, 
                    this.color, this.size, this.pixelSize
                )
                newEntity.setData(value.data[i]);
                newEntity._obj3d.material = this.commonMaterial;
                newEntity.addToScene(this.scene);
                newEntity.setVisibility(false);
                this.children.push(newEntity);
            }
        } else {
            for (let i=this.children.length-1; i>=valueLength; i--) {
                this.children[i].geometry.dispose();
                this.scene.remove(this.children[i]._obj3d);
                this.children.pop();
            }
        }
    }

    setSize(value) {
        this.children.forEach(function (x) {x.setSize(value);});
    }

}

class PointEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
        this.material = new THREE.PointsMaterial({color: color, size: 4*size*pixelSize});
        this._obj3d = new THREE.Points(
            new THREE.BufferGeometry(),
            this.material
        );
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
        this.material = new THREE.PointsMaterial({color: color, size: 4*size*pixelSize});
        this._obj3d = new THREE.Points(
            new THREE.BufferGeometry(),
            this.material
        );
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
        this.material = new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size});
        this._obj3d = new THREE.Line(
            new THREE.BufferGeometry(),
            this.material
        );
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
        this.material = new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size});
        let g = new THREE.BufferGeometry()
        g.setAttribute(
            "position", 
            new THREE.BufferAttribute(this._unitCircle, 3)
        );
        this._obj3d = new THREE.LineLoop(
            g,
            this.material
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
        this.material = new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size});
        this._obj3d = new THREE.Line(
            new THREE.BufferGeometry(),
            this.material
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

class CylinderEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
        color = 0x88ccff;
        this.material = new THREE.MeshBasicMaterial({color: color, opacity: 0.5, transparent: true})
        this._obj3d = new THREE.Mesh(
            new THREE.BufferGeometry(),
            this.material
        );
        // this._center = new THREE.Vector3();
    }

    get captionPosition3d() {
        return this._obj3d.position;
    }

    setData(value) {
        let g = new THREE.CylinderGeometry(
            value.radius, value.radius, value.height, 
            90, 6, false, 
            value.start, value.end
        );
        g.translate(value.center.x, value.center.y, value.center.z);
        this._obj3d.geometry = g;
    }

    setSize(value) {
        this.size = value;
        // this._obj3d.material.linewidth = 1.5*value;
    }
}

class ConeEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
        color = 0x88ccff;
        this.material = new THREE.MeshBasicMaterial({color: color, opacity: 0.5, transparent: true});
        this._obj3d = new THREE.Mesh(
            new THREE.BufferGeometry(),
            this.material
        );
        // this._center = new THREE.Vector3();
    }

    get captionPosition3d() {
        return new THREE.Vector3();
    }

    setData(value) {
        let g = new THREE.ConeGeometry(
            value.radius, value.height, 
            90, 6, false, 
            value.start, value.end
        );
        g.translate(value.center.x, value.center.y, value.center.z);
        this._obj3d.geometry = g;
    }

    setSize(value) {
        this.size = value;
        // this._obj3d.material.linewidth = 1.5*value;
    }
}

class GeneralCylinderEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
        color = 0x88ccff;
        this.material = new THREE.MeshBasicMaterial({color: color, opacity: 0.5, transparent: true});
        this._obj3d = new THREE.Mesh(
            new THREE.BufferGeometry(),
            this.material
        );
    }

    get captionPosition3d() {
        return new THREE.Vector3();
    }

    setData(value) {
        let points = [value.baseCenter, value.apex];
        let angularResolution = 120;
        let indices = [
            0, 2, 2*angularResolution, 
            1, 2*angularResolution+1, 3,
            2*angularResolution, 2, 2*angularResolution+1,
            2*angularResolution+1, 2, 3
        ];
        let dt = 2*Math.PI/angularResolution
        for (let i=0; i<angularResolution; i++) {
            let added1 = value.baseCenter.toward(value.baseRadialPt, Math.cos(i*dt)).add(
                value._baseCoRadialVec.dilate(Math.sin(i*dt))
            )
            let added2 = added1.add(value.apex.sub(value.baseCenter));
            points.push(added1, added2);
        }
        for (let i=1; i<angularResolution; i++) {
            indices.push(0, 2*i+2, 2*i,  1, 2*i+1, 2*i+3,  2*i, 2*i+2, 2*i+1,  2*i+1, 2*i+2, 2*i+3);
        }
        let g = new THREE.BufferGeometry();
        g.setFromPoints(points);
        g.setIndex(indices);
        this._obj3d.geometry = g;
    }

    setSize(value) {
        this.size = value;
    }
}

class GeneralConeEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
        color = 0x88ccff;
        this.material = new THREE.MeshBasicMaterial ({color: color, opacity: 0.5, transparent: true});
        this._obj3d = new THREE.Mesh(
            new THREE.BufferGeometry(),
            this.material
        );
    }

    get captionPosition3d() {
        return new THREE.Vector3();
    }

    setData(value) {
        let points = [value.baseCenter, value.apex];
        let angularResolution = 120;
        let indices = [0, 2, angularResolution+1, 1, angularResolution+1, 2];
        let dt = 2*Math.PI/angularResolution
        for (let i=0; i<angularResolution; i++) {
            points.push(
                value.baseCenter.toward(value.baseRadialPt, Math.cos(i*dt)).add(
                    value._baseCoRadialVec.dilate(Math.sin(i*dt))
                )
            );
        }
        for (let i=1; i<angularResolution; i++) {
            indices.push(0, i+2, i+1, 1, i+1, i+2);
        }
        let g = new THREE.BufferGeometry();
        g.setFromPoints(points);
        g.setIndex(indices);
        this._obj3d.geometry = g;
    }

    setSize(value) {
        this.size = value;
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
    }

    setup() {
        let renderer = this.renderer;
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
            let subtype;
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
                if (isMultiObjectsData(builtData)) {
                    subtype = builtData.subtype;
                }
            }
            if (key in this.ddc.captions) {caption = this.ddc.captions[key];}
            else {caption = '';}
            let gObj = newGeometricEntity(type, key, caption, undefined, undefined, undefined, subtype);
            gObj.setVisibility(false);
            gObj.attachCaption(this.renderer);
            this._objectsDict[key] = gObj;
            gObj.addToScene(this.scene);
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

    }

    build(params=null) {
        if (params === null) {params = this.params;}
        let entityDatas = this.ddc.calculation(params);

        for (let key in this._objectsDict) {
            let gObj = this._objectsDict[key];
            gObj.setData(entityDatas[key]);
            gObj.setPixelSize(this.pixelSize);
        }
    }

    attachCaption(camSet) {
        if (!camSet) { camSet = this.camSetting; }
        for (let key in this._objectsDict) {
            let gObj = this._objectsDict[key];
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
        camera.position.set(
            centerX + camSet.dist*Math.cos(camSet.elev*Math.PI/180)*Math.cos(camSet.azim*Math.PI/180), 
            centerY + camSet.dist*Math.cos(camSet.elev*Math.PI/180)*Math.sin(camSet.azim*Math.PI/180), 
            centerZ + camSet.dist*Math.sin(camSet.elev*Math.PI/180)
        );
        camera.lookAt(centerX, centerY, centerZ);
        if (camSet.yIsUp) {camera.up.set(0, 1, 0);}
        else {camera.up.set(0, 0, 1);}
        camera.updateProjectionMatrix();
        this.pixelSize = (2*camSet.scale) / this.renderer.getSize().width;
        for (let key in this._objectsDict) {
            let gObj = this._objectsDict[key];
            gObj.setPixelSize(this.pixelSize);
        }
    }

    clear() {
        for (let i=this.scene.children.length-1; i>=0; i--) {
            this.scene.children[0].geometry.dispose();
            this.scene.children[0].material.dispose();
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

    get domElement() {
        return this.renderer.domElement
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        // console.log(this.scene);
    }

    stepBack() {
        if (this.step <= this.stepMin) {return;}
        if (this.original) {return;}
        this.step--;
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
    stepForward() {
        if (this.step >= this.stepMax) {return;}
        if (this.original) {return;}
        this.step++;
        
        this._fx.terminate();
        this._fx = this.ddc.forwardActions[this.step-1](this._objectsDict);
        this._fx.attachGeometer(this);
        let that = this;
        this._fx.action(50);
        this.currentAllParams.update(this._fx.summary());
    }

    // toggleOriginal() {
    //     this.original = !this.original;
    //     this.buildAndRenderIfLoaded();
    // }
}

export {Geometer};