import * as THREE from 'three'
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js'
import {StyleSheet} from "./styler.js"
import {Vector, CustomList} from "./construction.js"


class GeometricEntity {
    constructor(type, name, color=0x000000, size=1., pixelSize=1,) {
        this.type = type;
        this.color = color;
        this.size = size;
        this.pixelSize = pixelSize;

        this._caption = document.createElement('div');
        this._caption.classList.add('unselectable');
        this._caption.style.position = 'absolute';
        this._caption.textContent = name;

        switch (this.type) {
            case "point":
                this._obj3d = new THREE.Points(
                    new THREE.BufferGeometry(),
                    new THREE.PointsMaterial({color: color, size: 4*size*pixelSize})
                )
                break;
            case "points":
                this._obj3d = new THREE.Points(
                    new THREE.BufferGeometry(),
                    new THREE.PointsMaterial({color: color, size: 4*size*pixelSize})
                )
                break;
            case "line":
                this._obj3d = new THREE.LineSegments(
                    new THREE.BufferGeometry(),
                    new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size})
                )
                break;
            case "circle":
                this._unitCircle = (new THREE.CircleGeometry(1, 128))
                    .getAttribute("position")
                    .array
                    .slice(3)
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
                break;
        }
    }
    attachCaption (renderer) {
        renderer.domElement.parentNode.appendChild(this._caption);
    }
    get captionPosition3d() {
        switch (this.type) {
            case "point":
                return (new THREE.Vector3(...this._obj3d.geometry.getAttribute("position").array));
            case "points":
                return (new THREE.Vector3(...this._obj3d.geometry.getAttribute("position").array));
            case "line":
                let ary = this._obj3d.geometry.getAttribute("position").array
                return (new THREE.Vector3(0.5*(ary[0]+ary[3]), 0.5*(ary[1]+ary[4]), 0.5*(ary[2]+ary[5])));
            case "circle":
                return this._center;
        }
    }
    get name() {
        return this._caption.textContent;
    }
    get visible() {
        return this._obj3d.visible;
    }
    setCaptionPosition(top, left) {
        this._caption.style.top = top;
        this._caption.style.left = left;
    }
    setData(value) {
        if (value instanceof Vector) {
            value = value.asTHREE();
        } else if (value instanceof CustomList) {
            value = value.asArray().map(v => v.asTHREE());
        } else if (value instanceof Array) {
            let value_new = [];
            for (let i=0; i<value.length; i++) {
                if (value[i] instanceof Vector) {
                    value_new.push(value[i].asTHREE());
                } else {
                    value_new.push(value[i]);
                }
            }
            value = value_new;
        }
        switch (this.type) {
            case "point":
                this._obj3d.geometry.setFromPoints([value]);
                break;
            case "points":
                this._obj3d.geometry.setFromPoints(value);
                break;
            case "line":
                this._obj3d.geometry.setFromPoints(value);
                break;
            case "circle":
                let g = new THREE.BufferGeometry()
                g.setAttribute(
                    "position", 
                    new THREE.BufferAttribute(this._unitCircle.slice(), 3)
                );
                g.scale(value[1], value[1], value[1]);
                this._obj3d.geometry.translate(
                    -this._center.getComponent(0), -this._center.getComponent(1), -this._center.getComponent(2)
                );
                this._obj3d.geometry.setAttribute(
                    "position", 
                    g.getAttribute("position"))
                this._center.copy(value[0])
                this._obj3d.geometry.translate(
                    this._center.getComponent(0), this._center.getComponent(1), this._center.getComponent(2)
                )
                break;
        }
    }

    setColor(value) {
        if (this._obj3d.material.color.getHex() == value) {return;}
        this._obj3d.material.color.set( value );
    }

    setSize(value) {
        switch (this.type) {
            case "point":
                this._obj3d.material.size = 4*value*this.pixelSize;
                break;
            case "points":
                this._obj3d.material.size = 4*value*this.pixelSize;
                break;
            case "line":
                this._obj3d.material.linewidth = 1.5*value;
                break;
            case "circle":
                this._obj3d.material.linewidth = 1.5*value;
                break;
        }
    }

    setVisibility(value) {
        if (typeof(value) == "number") { value = (value == 1); }
        this._obj3d.visible = value;
        if (value) { this._caption.style.visibility = "visible"; }
        else {this._caption.style.visibility = "hidden"; }
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
        // const renderer = new THREE.WebGLRenderer();
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

        this._loaded = false;
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
            
            camera.left = -style.scale;
            camera.right = style.scale;
            camera.top = style.scale;
            camera.bottom = -style.scale;
            camera.near = 1; camera.far = 1000;
            camera.position.set(style.centerX, style.centerY, style.centerZ+10);
            camera.lookAt(style.centerX, style.centerY, style.centerZ);
            camera.updateProjectionMatrix();
    
            let pixelSize = (2*style.scale) / renderer.getSize().width;
    
            that.stepMax = style.stepMax;
            that._objects = []
    
            let objTypes = style.objTypes;
            let objCaptions = style.objCaptions;
            let objColors = style.objStyleTrend[0];
            let objSizes = style.objStyleTrend[0];
            for (let i=0; i<style.nObjs; i++) {
                let gObj = new GeometricEntity(objTypes[i], objCaptions[i], objColors[i].color, objSizes[i].size, pixelSize);
                gObj.attachCaption(renderer);
                that._objects.push(gObj);
                that.scene.add(gObj._obj3d)
            }
            that.buildAndRenderIfLoaded();
            callback();
        })
    }

    build() {
        let entityDatas = this.calculateGeometry(this.params);
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
            
            let [cx, cy, cz] = gObj.captionPosition3d.clone().project(this.camera);
            let [dx, dy, dz] = (new THREE.Vector3(
                this.style.centerX, 
                this.style.centerY,
                this.style.centerZ
            )).project(this.camera);
            let renderSize = this.renderer.getSize();
            gObj.setCaptionPosition(
                renderSize.height*0.5*(-cy+dy+1) - this.renderer.domElement.parentNode.offsetTop,
                renderSize.width*0.5*(cx-dx+1) + this.renderer.domElement.parentNode.offsetLeft
            )
        }
    }

    buildAndRenderIfLoaded() {
        if (!this._loaded) {return;}
        this.build();
        this.render();
    }

    clear() {
        if (!this._loaded) {return;}
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

    async loadStyle(bookName, sectionName) {
        let that = this
        this._loaded = await new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", `/diagram-parameters/${bookName}/${sectionName}`);
            xhr.onload = function () {
                if ((xhr.status >= 200) && (xhr.status < 400)) {
                    that.style = new StyleSheet(xhr.responseText);
                    resolve(true);
                }
                else {
                    console.log("rejected;")
                    resolve(false);
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
        this.step++;
        this.buildAndRenderIfLoaded();
    }
    toggleOriginal() {
        this.original = !this.original;
        this.buildAndRenderIfLoaded();
    }
}

export {Geometer};