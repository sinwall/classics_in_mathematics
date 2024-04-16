import * as THREE from 'three'
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js'
import {StyleSheet} from "./styler.js"
import {Vector, CustomList} from "./construction.js"


class GeometricEntity {
    constructor(type, name, color=0x000000, size=1., pixelSize=1,) {
        this.type = type;
        this.name = name;
        this.color = color;
        this.size = size;
        this.pixelSize = pixelSize;

        this.resolution = 128;
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
                this._unitCircle = (new THREE.CircleGeometry(1, this.resolution))
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
            case 'spiral':
                this._obj3d = new THREE.Line(
                    new THREE.BufferGeometry(),
                    new THREE.LineBasicMaterial({color: color, linewidth: 1.5*size})
                )
                break;
        }
    }
    attachCaption (renderer) {
        renderer.domElement.parentNode.appendChild(this._caption);
    }
    get captionPosition3d() {
        let ary;
        switch (this.type) {
            case "point":
                return (new THREE.Vector3(...this._obj3d.geometry.getAttribute("position").array));
            case "points":
                return (new THREE.Vector3(...this._obj3d.geometry.getAttribute("position").array));
            case "line":
                ary = this._obj3d.geometry.getAttribute("position").array;
                return (new THREE.Vector3(0.5*(ary[0]+ary[3]), 0.5*(ary[1]+ary[4]), 0.5*(ary[2]+ary[5])));
            case "circle":
                return this._center;
            case 'spiral':
                ary = this._obj3d.geometry.getAttribute("position").array;
                return (new THREE.Vector3(ary[0], ary[1], ary[2]));
        }
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
            case 'spiral':
                let origin = value[0];
                let radius = value[1];
                let angleStart = value[2] || 0;
                let angleEnd = value[3] || 2*Math.PI;
                let rotation = value[4] || 0;
                let points = [];
                for (let i=0; i<=this.resolution; i++) {
                    let theta = (angleStart + (i/this.resolution)*(angleEnd-angleStart))*(Math.PI/180);
                    let r = radius*(theta/(2*Math.PI));
                    let point = new THREE.Vector3(
                        r*Math.cos(theta+rotation*(Math.PI/180)), 
                        r*Math.sin(theta+rotation*(Math.PI/180)));
                    points.push(point.add(origin));
                }
                this._obj3d.geometry.setFromPoints(points);
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
            case 'spiral':
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
            }
            callback();
        }).catch(function() {
            console.log('loading rejected');
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
        // if (!this._loaded) {return;}
        this.build();
        this.render();
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
        this.step++;
        this.buildAndRenderIfLoaded();
    }
    toggleOriginal() {
        this.original = !this.original;
        this.buildAndRenderIfLoaded();
    }
}

export {Geometer};