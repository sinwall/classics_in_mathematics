import {Vector3} from 'three'
// import {Vector3} from '../node_modules/three'


class TracedScalar {
    static addCount = 0;
    static subCount = 0;
    static mulCount = 0;
    constructor(name, parents=null, func=null) {
        this.name = name;
        this.parents = [];
        this.children = [];
        if (!parents) {parents = [];}
        this.registerParents(...parents);
        if (!func) {func = null;}
        this.eval = func;
    }

    add(val) {
        val = ensureTraced(val);
        let result = new TracedScalar(
            `add-${TracedScalar.addCount++}`,
            [this, val],
            function (parents) {return parents[0].value + parents[1].value;}
        );
        return result;
    }

    sub(val) {
        val = ensureTraced(val);
        let result = new TracedScalar(
            `sub-${TracedScalar.subCount++}`,
            [this, val],
            function (parents) {return parents[0].value - parents[1].value;}
        );
        return result;
    }

    mul(val) {
        val = ensureTraced(val);
        let result = new TracedScalar(
            `mul-${TracedScalar.mulCount++}`,
            [this, val],
            function (parents) {return parents[0].value * parents[1].value;}
        );
        return result;
    }

    registerParents(...parents) {
        this.parents.push(...parents);
        let that = this;
        parents.forEach(function (el) {el.children.push(that)});
    }

}

function ensureTraced(val) {
    if (!(val instanceof TracedScalar)) {
        val = Constant(val);
    }
    return val;
}

class Constant extends TracedScalar{
    static count = 0;
    constructor (value, name=null) {
        this.value = value;
        if (!name) {
            name = `constant-${Constant.count}`
            Constant.count ++;
        }
        this.name = name;
    }
}

class Parameter extends TracedScalar{
    static noname = 0;
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.referredBy = [];
    }
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
    angleTo(vec) {
        return (180/Math.PI)* Math.acos(this.dot(vec) / (this.norm()*vec.norm()))
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

class CircleData {
    constructor (origin, radius, start=0, end=360, rotAngle=0, xAxis=null, yAxis=null) {
        this.origin = origin;
        this.radius = radius;
        this.start = start;
        this.end = end;
        this.rotAngle = rotAngle;
        if (!xAxis) {xAxis = newVector(1,0,0); }
        if (!yAxis) {yAxis = newVector(0,1,0); }
        this.xAxis = xAxis;
        this.yAxis = yAxis;
    }
    pick(angle) {
        return this.origin
            .add(this.xAxis.dilate(this.radius*degCos(angle+this.rotAngle)))
            .add(this.yAxis.dilate(this.radius*degSin(angle+this.rotAngle)));
        // (this.origin.shiftPolar(this.radius, angle+this.rotAngle));
    }
    asarray() {
        return [this.origin, this.radius, this.start, this.end, this.rotAngle, this.rotAxis];
    }
}

function newCircle(origin, radius, start=0, end=360, rotAngle=0, xAxis=null, yAxis=null) {
    return new CircleData(origin, radius, start, end, rotAngle, xAxis, yAxis);
}

class SpiralData {
    constructor (origin, radius, start, end, rotAngle=0, xAxis=null, yAxis=null) {
        this.origin = origin;
        this.radius = radius;
        this.start = start;
        this.end = end;
        this.rotAngle = rotAngle;
        if (!xAxis) {xAxis = newVector(1,0,0); }
        if (!yAxis) {yAxis = newVector(0,1,0); }
        this.xAxis = xAxis;
        this.yAxis = yAxis;
    }
    pick(angle) {
        return this.origin
            .add(this.xAxis.dilate(this.radius*(angle/360)*degCos(angle+this.rotAngle)))
            .add(this.yAxis.dilate(this.radius*(angle/360)*degSin(angle+this.rotAngle)));
        // return this.origin.shiftPolar(this.radius*(angle/360), angle+this.rotAngle);
    }
    asarray() {
        return [this.origin, this.radius, this.start, this.end, this.rotAngle, this.rotAxis];
    }
}

function newSpiral(origin, radius, start, end, rotAngle=0, xAxis=null, yAxis=null) {
    return new SpiralData(origin, radius, start, end, rotAngle, xAxis, yAxis);
}

// class CustomList {
//     constructor (...entries) {
//         this.entries = entries;
//     }
//     asArray() {
//         return this.entries;
//     }
//     push (...entries) {
//         return this.entries.push(...entries);
//     }
// }

// function newList(...entries) {
//     return new CustomList(...entries);
// }

// function iterate(func, from=0, to=1) {
//     let result = [];
//     for (let i=from; i<to; i++) {
//         result.push(func(i))
//     }
//     return result;
// }

export {newVector, Vector, newCircle, newSpiral};