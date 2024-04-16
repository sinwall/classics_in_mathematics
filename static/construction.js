import {Vector3} from 'three'
// import {Vector3} from '../node_modules/three'

let _origin = new Vector3();
let e_x = new Vector3(1);
let e_y = new Vector3(0, 1);
let e_z = new Vector3(0, 0, 1);

function origin() {
    return _origin.clone();
}

function newVector(x=0, y=0, z=0) {
    return new Vector(x, y, z);
}

function degCos(x) {
    return Math.cos(x*Math.PI/180);
}

function degSin(x) {
    return Math.sin(x*Math.PI/180);
}

class Vector {
    constructor(x=0, y=0, z=0) {
        this._x = x;
        this._y = y;
        this._z = z;
    }
    add(vec) {
        return this.shift(vec.x, vec.y, vec.z);
    }
    asTHREE() {
        return new Vector3(this.x, this.y, this.z);
    }
    clone() {
        return new Vector(this.x, this.y, this.z);
    }
    dilate(t) {
        let result = this.clone();
        result.x *= t;
        result.y *= t;
        result.z *= t;
        return result;
    }
    distTo(vec) {
        let dist = 0;
        dist += (this.x - vec.x) ** 2;
        dist += (this.y - vec.y) ** 2;
        dist += (this.z - vec.z) ** 2;
        dist = Math.sqrt(dist);
        return dist;
    }
    dot(vec) {
        let result = 0;
        result += this.x*vec.x;
        result += this.y*vec.y;
        result += this.z*vec.z;
        return result;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get z() {
        return this._z;
    }
    norm () {
        let result = 0;
        result += this.x ** 2;
        result += this.y ** 2;
        result += this.z ** 2;
        result = Math.sqrt(result);
        return result;
    }
    set x(value) {
        this._x = value;
    }
    set y(value) {
        this._y = value;
    }
    set z(value) {
        this._z = value;
    }
    shift(dx=0, dy=0, dz=0) {
        let result = this.clone();
        result.x += dx;
        result.y += dy;
        result.z += dz;
        // result.x = result.x + dx;
        // result.y = result.y + dy;
        // result.z = result.z + dz;
        return result;
    }
    shiftPolar(r=0, azim=0, lat=0) {
        return this.shift(
            r*degCos(lat)*degCos(azim),
            r*degCos(lat)*degSin(azim),
            r*degSin(lat)
        );
    }
    sub(vec) {
        return this.subCoords(vec.x, vec.y, vec.z);
    }
    subCoords(dx=0, dy=0, dz=0) {
        let result = this.clone();
        result.x -= dx;
        result.y -= dy;
        result.z -= dz;
        return result;
    }
    toward(vec, t=1) {
        let result = this.clone();
        result.x = result.x + t*(vec.x-this.x);
        result.y = result.y + t*(vec.y-this.y);
        result.z = result.z + t*(vec.z-this.z);
        return result;
    }
}

class CustomList {
    constructor (...entries) {
        this.entries = entries;
    }
    asArray() {
        return this.entries;
    }
    push (...entries) {
        return this.entries.push(...entries);
    }
}

function newList(...entries) {
    return new CustomList(...entries);
}

function iterate(func, from=0, to=1) {
    let result = [];
    for (let i=from; i<to; i++) {
        result.push(func(i))
    }
    return result;
}

export {origin, e_x, e_y, e_z, newVector, Vector, iterate, newList, CustomList};