import * as THREE from 'three'
import {WebGLRenderer} from 'three'
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js'
import {CSS3DRenderer} from 'three/addons/renderers/CSS3DRenderer.js'
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
        case 'polygon':
            return new PolygonEntity(type, key, name, color, size, pixelSize);
        case 'sector':
            return new SectorEntity(type, key, name, color, size, pixelSize);
        case "spiral-circular-sector": 
            return new SpiralCircularSectorEntity(type, key, name, color, size, pixelSize);
        case "cylinder":
            return new CylinderEntity(type, key, name, color, size, pixelSize);
        case "cone":
            return new ConeEntity(type, key, name, color, size, pixelSize);
        case "generalCylinder":
            return new GeneralCylinderEntity(type, key, name, color, size, pixelSize);
        case "generalCone":
            return new GeneralConeEntity(type, key, name, color, size, pixelSize);
        case "multi":
            return new MultiObjectsEntity(type, key, name, color, size, pixelSize, subtype)
        default:
            console.log(`Warning: unknown type ${type}`)
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

        this.hasSubObject = false;
    }

    addToScene(scene) {
        scene.add(this._obj3d);
        if (this.hasSubObject) {
            scene.add(this._subObj);
        }
    }

    attachCaption (renderer) {
        renderer.domElement.parentNode.appendChild(this._caption);
    }
    getMaterial() {
        return this.material;
    }
    getSubMaterial() {
        if (this.hasSubObject) {
            return this.subMaterial;
        }
    }
    get visible() {
        return this._obj3d.visible;
    }
    newDefaultMaterial(dim, color, size, pixelSize) {
        color = color || this.color;
        size = size || this.size;
        pixelSize = pixelSize || this.pixelSize;
        switch (dim) {
            case 0:
                return new THREE.PointsMaterial({color: color, size: 4*size*pixelSize});
            case 1:
                return new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size});
            case 2:
                let material = new THREE.MeshBasicMaterial({
                    color: color, 
                    opacity: 0.5, 
                    transparent: true,
                    side: THREE.DoubleSide,
                    // wireframe: true
                    // polygonOffset: true,
                    // polygonOffsetFactor: 0,
                    // polygonOffsetUnits: 1,
                });

                return material;
        }
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

    setDataIfRenewed(data) {
        if (isEntityData(data) && ('_oldData' in this) && (data.isEqualTo(this._oldData))) {
            return;
        }
        this.setData(data);
        this._oldData = data;
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
        if (this.hasSubObject) {
            this._subObj.visible = value;
        }
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
            this.commonMaterial = this.newDefaultMaterial(0);
        } else if (['line', 'circle', 'spiral'].includes(this.subtype)) {
            this.commonMaterial = this.newDefaultMaterial(1);
        } else {
            this.commonMaterial = this.newDefaultMaterial(2);
            this.commonSubMaterial = this.newDefaultMaterial(1);
            this.hasSubObject = true;
        }
    }

    addToScene(scene) {
        this.scene = scene;
        this.children.forEach(function (x) {x.addToScene(scene);});
    }

    getMaterial() {
        return this.commonMaterial;
    }

    getSubMaterial() {
        return this.commonSubMaterial;
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
            this.children[i].setData(value.data[i]);
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
                if (this.hasSubObject) {
                    newEntity._subObj.material = this.commonSubMaterial;
                }
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
        this.material = this.newDefaultMaterial(0);
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
        this.material = this.newDefaultMaterial(0);
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
        this.material = this.newDefaultMaterial(1);
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
        if (value instanceof Array) {
            this._obj3d.geometry.setFromPoints(value);
        } else {
            this._obj3d.geometry.setFromPoints([value.begin, value.end]);
        }
    }

    setSize(value) {
        this.size = value;
        this._obj3d.material.linewidth = 1.5*value;
    }

}

class CircleEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
        this.material = this.newDefaultMaterial(1);
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
        let dt = 1;
        // let resolution = Math.ceil(this.resolution*Math.abs(value.end-value.start)/360)
        if (value.start <= value.end) {
            for (let i=0; i*dt+value.start<=value.end; i++) {
                let theta = value.start + i*dt;
                pointsOnCircle.push(value.pick(theta));
            }
        } else {
            for (let i=0; i*dt+value.start>=value.end; i--) {
                let theta = value.start + i*dt;
                pointsOnCircle.push(value.pick(theta));
            }
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
        this.material = this.newDefaultMaterial(1);
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

class PolygonEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1) {
        super(type, key, name, color, size, pixelSize);
        this.material = this.newDefaultMaterial(2);
        this._obj3d = new THREE.Mesh(
            new THREE.BufferGeometry(),
            this.material
        );
        this.hasSubObject = true;
        this.subMaterial = this.newDefaultMaterial(1);
        this._subObj = new THREE.LineSegments(
            new THREE.BufferGeometry(),
            this.subMaterial
        );

        this._indicesMesh = [];
    }

    get captionPosition3d() {
        return (new THREE.Vector3());
    }

    setData(value) {
        let g = this._obj3d.geometry;
        let points = value.vertices;
        let n = points.length;
        g.setFromPoints(points);
        let indices = [n-1, 0, 1];
        for (let i=1; 2*i+1<n; i++) {
            indices.push(n-i, i, i+1);
            if (2*i != n-2) {
                indices.push(n-i-1, n-i, i+1);
            }
        }
        g.setIndex(indices);
        g.computeBoundingBox();
        g.computeBoundingSphere();
        if (value.boundary) {
            g = this._subObj.geometry;
            g.setFromPoints(points);
            let indices = [n-1, 0];
            for (let i=1; i<n; i++) {
                indices.push(i-1, i);
            }
            g.setIndex(indices);
            g.computeBoundingBox();
            g.computeBoundingSphere();
        } else {
            g = this._subObj.geometry;
            g.setFromPoints(points);
            g.setIndex([]);
        }
    }

    setSize(value) {
        this.size = value;
    }
}

class SectorEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1) {
        super(type, key, name, color, size, pixelSize);
        this.material = this.newDefaultMaterial(2);
        this._obj3d = new THREE.Mesh(
            new THREE.BufferGeometry(),
            this.material
        );
        this.hasSubObject = true;
        this.subMaterial = this.newDefaultMaterial(1);
        this._subObj = new THREE.LineSegments(
            new THREE.BufferGeometry(),
            this.subMaterial
        );
    }

    get captionPosition3d() {
        if ('_oldData' in this) {
            return this._oldData.center.asTHREE();
        } else {
            return (new THREE.Vector3());
        }
    }

    setData(value) {
        let dt = 1;
        let points = [value.center];
        let sign = value.end > value.start? 1 : -1;
        
        for (let t=value.start; sign*t<=sign*value.end; t+=sign*dt) {
            points.push( value.center.shiftPolar(value.radius, t) );
        }
        let indices = [];
        for (let i=1; sign*value.start+i*dt<=sign*value.end; i++) {
            indices.push( 0, i, i+1);
        }
        let g = this._obj3d.geometry;
        g.setFromPoints(points);
        g.setIndex(indices);
        g.computeBoundingBox();
        g.computeBoundingSphere();
        if (value.boundary) {
            g = this._subObj.geometry;
            g.setFromPoints(points);
            indices = [];
            for (let i=1; sign*value.start+i*dt<=sign*value.end; i++) {
                indices.push( i, i+1 )
            }
            if (value.end < value.start+360) {
                indices.push( 0, 1,  points.length-1, 0 )
            }
            g.setIndex(indices);
            g.computeBoundingBox();
            g.computeBoundingSphere();
        } else {g = this._subObj.geometry;
            g.setFromPoints(points);
            g.setIndex([]);
        }
    }

    setSize(value) {
        this.size = value;
    }
}

class SpiralCircularSectorEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1) {
        super(type, key, name, color, size, pixelSize);
        this.material = this.newDefaultMaterial(2);
        this._obj3d = new THREE.Mesh(
            new THREE.BufferGeometry(),
            this.material
        );
        this.hasSubObject = true;
        this.subMaterial = this.newDefaultMaterial(1);
        this._subObj = new THREE.LineSegments(
            new THREE.BufferGeometry(),
            this.subMaterial
        );
    }

    get captionPosition3d() {
        return (new THREE.Vector3());
    }

    setData(value) {
        let dt = 1;
        let points = [];
        let sign = value.end > value.start? 1 : -1;
        for (let t=value.start; sign*t<=sign*value.end; t+=sign*dt) {
            points.push( value.center.shiftPolar(value.radius, t) );
        }
        for (let t=value.start; sign*t<=sign*value.end; t+=sign*dt) {
            points.push( value.center.shiftPolar(
                value.radius+(t-value.start)/(value.end-value.start)*value.radiusDelta,
                t) 
            );
        }

        let n = points.length / 2;
        let indices = [];
        for (let i=0; sign*(value.start+sign*(i+1)*dt)<=sign*value.end; i++) {
            indices.push( i+1, i, n+i+1, i, n+i, n+i+1 );
        }
        let g = this._obj3d.geometry;
        g.setFromPoints(points);
        g.setIndex(indices);
        if (value.boundary) {
            g = this._subObj.geometry;
            g.setFromPoints(points);
            indices = [];
            for (let i=1; value.start+i*dt<=value.end; i++) {
                indices.push( i-1,  i );
                indices.push( i+n-1, i+n );
            }
            if (value.end < value.start+360) {
                indices.push( 0, n,  n-1, 2*n-1 );
            }
            g.setIndex(indices)
        } else {g = this._subObj.geometry;
            g.setFromPoints(points);
            g.setIndex([]);
        }
    }

    setSize(value) {
        this.size = value;
    }
}

class CylinderEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
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
        this.material = this.newDefaultMaterial(2);
        this._obj3d = new THREE.Mesh(
            new THREE.BufferGeometry(),
            this.material
        );
        this.hasSubObject = true;
        this.subMaterial = this.newDefaultMaterial(1);
        this._subObj = new THREE.LineSegments(
            new THREE.BufferGeometry(),
            this.subMaterial
        );
    }

    get captionPosition3d() {
        return new THREE.Vector3();
    }

    setData(value) {
        let points = [value.baseCenter, value.apex];
        // let angularResolution = 120;
        let indices = [];
        let dt = 6;
        for (let i=0; i*dt<=(value.end-value.start); i++) {
            let angle = (value.start + i*dt)*Math.PI/180;
            let added1 = value.baseCenter.toward(value.baseRadialPt, Math.cos(angle)).add(
                value._baseCoRadialVec.dilate(Math.sin(angle))
            )
            let added2 = added1.add(value.apex.sub(value.baseCenter));
            points.push(added1, added2);
        }
        for (let i=0; i<(points.length-4)/2; i++) {
            if (value.upper) {
                indices.push(1, 2*i+3, 2*i+5);
            }
            if (value.lower) {
                indices.push(0, 2*i+4, 2*i+2);    
            }
            indices.push(2*i+2, 2*i+4, 2*i+3,  2*i+3, 2*i+4, 2*i+5);
        }
        if (value.end < value.start + 360) {
            indices.push(0, 2, 1,  1, 2, 3,  0, 1, points.length-2, 1, points.length-1, points.length-2);
        }
        let g = this._obj3d.geometry;
        g.setFromPoints(points);
        g.setIndex(indices);
        if (value.boundary) {
            g = this._subObj.geometry;
            g.setFromPoints(points);
            let indices_sub = [];
            for (let i=0; i<(points.length-4)/2; i++) {
                indices_sub.push(2*i+2, 2*i+4,  2*i+3, 2*i+5);
            }
            if (value.end < value.start + 360) {
                indices.push(0, 1,  0, 2,  1, 3,  0, points.length-2,  1, points.length-1);
            }
            g.setIndex(indices_sub)
        } else {
            this._subObj.geometry.setFromPoints([]);
            this._subObj.geometry.setIndex([]);
        }
    }

    setSize(value) {
        this.size = value;
    }
}

class GeneralConeEntity extends GeometricEntity {
    constructor(type, key, name, color=0x000000, size=1., pixelSize=1,) {
        super(type, key, name, color, size, pixelSize);
        color = 0x88ccff;
        this.material = this.newDefaultMaterial(2);
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
        // let angularResolution = 120;
        let indices = [];
        let dt = 3;
        for (let i=0; i*dt<=(value.end-value.start); i++) {
            let angle = (value.start + i*dt)*Math.PI/180;
            points.push(
                value.baseCenter.toward(value.baseRadialPt, Math.cos(angle)).add(
                    value._baseCoRadialVec.dilate(Math.sin(angle))
                )
            );
        }
        for (let i=0; i<points.length-3; i++) {
            indices.push(0, i+3, i+2, 1, i+2, i+3);
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


function getRendererSize(renderer) {
    let result = {width:0, height:0};
    if (renderer instanceof SVGRenderer) {
        result = renderer.getSize();
    } else if (renderer instanceof WebGLRenderer) {
        let temp = new THREE.Vector2();
        renderer.getSize(temp);
        result.width = temp.x;
        result.height = temp.y;
    } 
    return result;
}

class Geometer {
    constructor(box, width=null, height=null) {
        this.box = box;
        if (!width) { width = +box.style.width.replace("px", ""); }
        if (!height) { height = +box.style.height.replace("px", ""); }
        this.width = width;
        this.height = height;

        
        this.renderer = new SVGRenderer();
        this.renderer.overdraw = 0;
        this.box.appendChild(this.renderer.domElement);

        let scene = new THREE.Scene();
        let camera = new THREE.OrthographicCamera();
    // constructor(renderer, scene, camera) {
        this.scene = scene;
        this.camera = camera;

        this.stepMin = 0;
        this.step = 0;
        this.original = false;

        this.currentAnimation = null;
        this._objectsDict = {};
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
                // text.style.setProperty('position', 'absolute');
                text.style.setProperty('text-align', 'center');
                text.style.setProperty('width', that.box.style.width);
                text.innerHTML = '그림이 없는 문서거나<br>그림이 준비되지 않았습니다.';
                that.box.prepend(text);            
            });
    }

    setup() {
        if (this.renderer) {
            this.renderer.domElement.remove();
            this.renderer = undefined;
        }
        if (this.ddc.renderer == 'SVGRenderer') {
            this.renderer = new SVGRenderer();
            this.renderer.overdraw = 0;
        }
        if (this.ddc.renderer == 'WebGLRenderer') {
            this.renderer = new WebGLRenderer({ preserveDrawingBuffer: true });
            this.scene.background = new THREE.Color(0xffffff);
        }
        this.box.prepend(this.renderer.domElement);
        this.renderer.setSize(this.width, this.height, false);

        this.camSetting = Object.assign({}, this.ddc.initialCamSet);
        this.params = Object.assign({}, this.ddc.initialParams);
        this.pixelSize = (2*this.ddc.initialCamSet.scale) / getRendererSize(this.renderer).width;
        this.stepMax = this.ddc.stepMax;
        this.cameraReady(this.ddc.initialCamSet);
        let built = this.ddc.calculation(this.ddc.initialParams);
        this._previousBuiltData = built;
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
        // this.attachCaption(this.ddc.initialCamSet);

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
            gObj.setDataIfRenewed(entityDatas[key]);
            gObj.setPixelSize(this.pixelSize);
            // if (key == 'equalSectors') {
            //     for (let i=0; i<32; i++) {
            //         gObj.children[i]._obj3d.updateMatrixWorld(true);
            //         gObj.children[i]._obj3d.parent.updateMatrixWorld(true);
            //     }
            // }
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
            let renderSize = getRendererSize(this.renderer);
            gObj.setCaptionPosition(
                renderSize.height*0.5*(-cy+dy+1) - this.renderer.domElement.parentNode.offsetTop,
                renderSize.width*0.5*(cx-dx+1) + this.renderer.domElement.parentNode.offsetLeft
            )
        }
    }

    // buildAndRenderIfLoaded() {
    //     this.cameraReady();
    //     this.build();
    //     this.attachCaption();
    //     this.render();
    // }

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
        camera.near = 1; camera.far = 50;
        camera.position.set(
            centerX + camSet.dist*Math.cos(camSet.elev*Math.PI/180)*Math.cos(camSet.azim*Math.PI/180), 
            centerY + camSet.dist*Math.cos(camSet.elev*Math.PI/180)*Math.sin(camSet.azim*Math.PI/180), 
            centerZ + camSet.dist*Math.sin(camSet.elev*Math.PI/180)
        );
        camera.lookAt(centerX, centerY, centerZ);
        camera.up.set(0, Math.cos(camSet.upAngleFromY*Math.PI/180), Math.sin(camSet.upAngleFromY*Math.PI/180));
        camera.updateProjectionMatrix();
        this.pixelSize = (2*camSet.scale) / getRendererSize(this.renderer).width;
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
        if (this.renderer) {
            this.render();
        }
        if (this._fx) {this._fx.terminate();this._fx = null;}
        this._objectsDict = {};
        this.step = 0;
        this.original = false;

        let warnBox = this.box.querySelector('.diagram-warning');
        if (warnBox) {warnBox.remove();}
    }

    get domElement() {
        return this.renderer.domElement
    }

    render() {
        this.renderer.render(this.scene, this.camera);
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