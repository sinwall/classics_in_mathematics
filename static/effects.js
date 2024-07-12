import * as THREE from 'three'

class BaseFX {
    constructor(duration) {
        this.duration = duration;
    }
    
    attachGeometer(geometer) {
        this.geometer = geometer;
    }

    hasGeometer(geometer) {
        return ('geometer' in this);
    }

    callbackToGeometer(t) {
        if (this.needCamset(t) && this.hasGeometer())  { 
            this.geometer.cameraReady(); 
            this.geometer.attachCaption();
        }
        if (this.needBuild(t) && this.hasGeometer()) { 
            this.geometer.build(); 
            this.geometer.attachCaption();
        }
        if (this.needRender(t) && this.hasGeometer()) {
            this.geometer.render(); 
        }

    }

    needCamset(t) {return false;}

    needBuild(t) {return false;}

    needRender(t) {return this.needCamset(t) || this.needBuild(t) || false;}

    onBegin() { return 0; }

    onAction(t) { return t; }

    onEnd() {return this.onAction(1); }

    action(interval, onBegin=null, onAction=null, onEnd=null) {
        if (onEnd === null) {onEnd = onAction;}
        this.onBegin();
        if (onBegin) {onBegin();}
        let that = this;
        let epoch = Date.now();
        let timer = setInterval(
            function () {
                let progress = (Date.now() - epoch) / that.duration;
                if ((progress >= 1)) {
                    clearInterval(timer);
                    that.onEnd();
                    if (onEnd) { onEnd(); }
                    that.geometer.cameraReady();
                    that.geometer.build();
                    that.geometer.attachCaption();
                    that.geometer.render();
                    return;
                }
                that.onAction(progress);
                if (onAction) {onAction();}
                that.callbackToGeometer(progress);
            }, 
            interval
        );
        this.timer = timer;
    }

    terminate() {
        clearInterval(this.timer);
        this.onEnd();
        this.geometer.cameraReady();
        this.geometer.build();
        this.geometer.attachCaption();
        this.geometer.render();
    }
}

class SequentialFX extends BaseFX {
    constructor(duration, fxs, timing) {
        super(duration);

        this.fxs = fxs;
        this.timing = timing;
        let durationTotal = 0;
        fxs.forEach(function (fx) { durationTotal += fx.duration; })
        if (!duration) {
            this.duration = durationTotal;
        }
        this.durationTotal = durationTotal;
    }

    attachGeometer(geometer) {
        this.geometer = geometer;
        this.fxs.forEach(function (fx) {fx.attachGeometer(geometer);})
    }

    needCamset(t) {
        return this.fxs[this._cursor].needCamset((t*this.durationTotal - this._tcumsum)/this.fxs[this._cursor].duration);
    }

    needBuild(t) {
        return this.fxs[this._cursor].needBuild((t*this.durationTotal - this._tcumsum)/this.fxs[this._cursor].duration);
    }

    needRender(t) {
        return (
            this.needCamset(t) 
            || this.needBuild(t) 
            || this.fxs[this._cursor].needRender((t*this.durationTotal - this._tcumsum)/this.fxs[this._cursor].duration)
        );
    }

    onBegin() {
        this._cursor = 0;
        this._tcumsum = 0;
        this.fxs[0].onBegin();
    }

    onAction(t) {
        let elapsed = t*this.durationTotal;
        while (elapsed >= this._tcumsum + this.fxs[this._cursor].duration) {
            this.fxs[this._cursor].onEnd();
            this._tcumsum += this.fxs[this._cursor].duration;
            this._cursor ++;
            this.fxs[this._cursor].onBegin();
        }
        this.fxs[this._cursor].onAction((elapsed - this._tcumsum)/this.fxs[this._cursor].duration);
    }

    onEnd() {
        while (this._cursor < this.fxs.length-1) {
            this.fxs[this._cursor].onEnd();
            this._tcumsum += this.fxs[this._cursor].duration;
            this._cursor ++;
            this.fxs[this._cursor].onBegin();
        }
        this.fxs.at(-1).onEnd();
        // this._cursor = undefined;
        // this._tcumsum = undefined;
    }
    
    reversed(state) {
        let fxs = [];
        for (let i=1; i<=this.fxs.length; i++) {
            fxs.push(this.fxs.at(-i).reversed(state));
        }
        return new SequentialFX(this.duration, fxs, this.timing);
    }

    summary() {
        let result = new AllParamsSummary();
        for (let i=0; i<this.fxs.length; i++) {
            result.update(this.fxs[i].summary());
        }
        return result;
    }
}

function newSequentialFX(...fxs) {
    return new SequentialFX(null, fxs);
}

class ParallelFX extends BaseFX {
    constructor(fxs, duration) {
        super(duration);
        this.fxs = fxs;
        let durationMax = 0;
        fxs.forEach(function (fx) {durationMax = Math.max(durationMax, fx.duration);});
        if (!duration) { duration = durationMax; }
        this.duration = duration;
    }

    attachGeometer(geometer) {
        this.geometer = geometer;
        this.fxs.forEach(function (fx) {fx.attachGeometer(geometer);})
    }

    needCamset(t) {
        let duration = this.duration;
        return this.fxs.some(function (fx) {return fx.needCamset(t*duration/fx.duration);});
    }

    needBuild(t) {
        let duration = this.duration;
        return this.fxs.some(function (fx) {return fx.needBuild(t*duration/fx.duration);});
    }

    needRender(t) {
        let duration = this.duration;
        return (
            this.needCamset(t) 
            || this.needBuild(t) 
            || this.fxs.some(function (fx) {return fx.needRender(t*duration/fx.duration);})
        );
    }

    onBegin() {
        this.fxs.forEach((fx) => (fx.onBegin()));
    }

    onAction(t) {
        for (let i=0; i<this.fxs.length; i++) {
            let fx = this.fxs[i];
            fx.onAction(Math.min(1, t*this.duration/fx.duration));
        }
    }

    onEnd() {
        this.fxs.forEach((fx) => (fx.onEnd()));
    }
    
    reversed(state) {
        let fxs = [];
        for (let i=0; i<this.fxs.length; i++) {
            fxs.push(this.fxs[i].reversed(state));
        }
        return new ParallelFX(fxs, this.duration);
    }

    summary() {
        let result = new AllParamsSummary();
        for (let i=0; i<this.fxs.length; i++) {
            result.update(this.fxs[i].summary());
        }
        return result;
    }
}

function newParallelFX(...fxs) {
    return new ParallelFX(fxs);
}

class DrawingFX extends BaseFX{
    constructor(duration, entity, timing) {
        super(duration);
        this.entity = entity;
        this.timing = timing;
    }

    needRender(t) {return (t >= 0);}

    onBegin() {
        this._array = this.entity._obj3d.geometry.getAttribute('position').array;
        this.entity._obj3d.geometry.setAttribute(
            'position', 
            new THREE.BufferAttribute()
        );
        this.entity.setVisibility(true);
    }

    onAction(t) {
        this.entity._obj3d.geometry.setAttribute(
            'position', 
            new THREE.BufferAttribute(this.entity.atIntermediate(this._array, t), 3)
        );
    }

    onEnd() {
        this.entity._obj3d.geometry.setAttribute(
            'position', 
            new THREE.BufferAttribute(this._array, 3)
        );
        this._array = undefined;
    }

    reversed(state) {
        return new HidingFX(this.duration, this.entity, this.timing);
    }

    summary() {
        let entityDict = {};
        entityDict[this.entity.key] = {
            visibility: true
        };
        return new AllParamsSummary(null, null, entityDict);
    }
}

function newDrawingFX(duration, entity, timing) {
    return new DrawingFX(duration, entity, timing);
}

class ShowingFX extends BaseFX {
    constructor(duration, entity, timing) {
        super(duration);
        this.entity = entity;
        this.timing = timing;
    }
    
    needRender(t) {return (t >= 0);}

    onBegin() {
        this._transparent = this.entity._obj3d.material.transparent;
        this._opacity = this.entity._obj3d.material.opacity;
        this.entity._obj3d.material.transparent = true;
        this.entity._obj3d.material.opacity = 0;
        this.entity.setVisibility(true);
    }

    onAction(t) {
        this.entity._obj3d.material.opacity = t*this._opacity;
    }

    onEnd() {
        this.entity._obj3d.material.opacity = this._opacity;
        this.entity._obj3d.material.transparent = this._transparent;
        this._transparent = undefined;
        this._opacity = undefined;
    }

    reversed(state) {
        return new HidingFX(this.duration, this.entity, this.timing);
    }

    summary() {
        let entityDict = {};
        entityDict[this.entity.key] = {
            visibility: true
        };
        return new AllParamsSummary(null, null, entityDict);
    }
}

function newShowingFX(duration, entity, timing) {
    return new ShowingFX(duration, entity, timing);
}

class HidingFX extends BaseFX {
    constructor(duration, entity, timing) {
        super(duration);
        this.entity = entity;
        this.timing = timing;
    }

    needRender(t) {return (t >= 0);}

    onBegin() {
        this._transparent = this.entity._obj3d.material.transparent;
        this._opacity = this.entity._obj3d.material.opacity;
        this.entity.setVisibility(true);
        this.entity._obj3d.material.transparent = true;
    }

    onAction(t) {
        this.entity._obj3d.material.opacity = (1-t)*this._opacity;
    }

    onEnd() {
        this.entity.setVisibility(false);
        this.entity._obj3d.material.opacity = this._opacity;
        this.entity._obj3d.material.transparent = this._transparent;
        this._transparent = undefined;
        this._opacity = undefined;
    }

    reversed(state) {
        return new ShowingFX(this.duration, this.entity, this.timing);
    }
    
    summary() {
        let entityDict = {};
        entityDict[this.entity.key] = {
            visibility: false
        };
        return new AllParamsSummary(null, null, entityDict);
    }
}

function newHidingFX(duration, entity, timing) {
    return new HidingFX(duration, entity, timing);
}

class StyleChangeFX extends BaseFX {
    constructor(duration, entity, color, size, timing) {
        super(duration);
        this.entity = entity;
        this.color = new THREE.Color(color);
        this.size = size;
        this.timing = timing;
    }

    needRender(t) {return (t >= 0);}

    onBegin() {
        this._colorBefore = this.entity._obj3d.material.color;
        this._sizeBefore = this.entity.size;
    }

    onAction(t) {
        this.entity._obj3d.material.color = this.color.clone().multiplyScalar(t).add(this._colorBefore.clone().multiplyScalar(1-t));
        this.entity.setSize(this.size*t + this._sizeBefore*(1-t));
    }

    onEnd() {
        this.entity._obj3d.material.color = this.color;
        this.entity.setSize(this.size);
        this._colorBefore = undefined;
        this._sizeBefore = undefined;
    }

    reversed(state) {
        let color = state.entities[this.entity.key].color;
        let size = state.entities[this.entity.key].size;
        return new StyleChangeFX(this.duration, this.entity, color, size, this.timing);
    }
    
    summary() {
        let entityDict = {};
        entityDict[this.entity.key] = {
            color: this.color,
            size: this.size
        };
        return new AllParamsSummary(null, null, entityDict);
    }
}

function newStyleChangeFX(duration, entity, color, size, timing) {
    return new StyleChangeFX(duration, entity, color, size, timing);
}

class ParamChangeFX extends BaseFX {
    constructor(duration, params, timing) {
        super(duration);
        this.params = params;
        this.timing = timing;
    }

    needBuild(t) {
        return (t >= 0);
    }

    onBegin() {
        this._paramsBefore = this.geometer.params;
    }

    onAction(t) {
        for (let key in this.params) {
            this.geometer.params[key] = t*this.params[key] + (1-t)*this._paramsBefore[key];
        }
    }

    onEnd() {
        for (let key in this.params) {
            this.geometer.params[key] = this.params[key];
        }
        this._paramsBefore = undefined;
    }

    reversed(state) {
        let params = {};
        for (let key in this.params) {
            params[key] = state.params[key];
        }
        return new ParamChangeFX(this.duration, params, this.timing);
    }
    
    summary() {
        return new AllParamsSummary(null, this.params, null);
    }
}

function newParamChangeFX(duration, params, timing) {
    return new ParamChangeFX(duration, params, timing);
}

class CameraChangeFX extends BaseFX {
    constructor(duration, camSetting, timing) {
        super(duration);
        this.camSetting = camSetting;
        this.timing = timing;
    }
    needCamset(t) {
        return (t >= 0);
    }

    onBegin() {
        this._camsetsBefore = this.geometer.camSetting;
    }

    onAction(t) {
        for (let key in this.camSetting) {
            this.geometer.camSetting[key] = t*this.camSetting[key] + (1-t)*this._camsetsBefore[key];
        }
    }

    onEnd() {
        for (let key in this.camSetting) {
            this.geometer.camSetting[key] = this.camSetting[key];
        }
        this._camsetsBefore = undefined;
    }

    reversed(state) {
        let camSetting = {};
        for (let key in this.camSetting) {
            camSetting[key] = state.camSetting[key];
        }
        return new CameraChangeFX(this.duration, camSetting, this.timing);
    }
    
    summary() {
        return new AllParamsSummary(this.camSetting);
    }

}

function newCameraChangeFX(duration, camsets, timing) {
    return new CameraChangeFX(duration, camsets, timing);
}

class AllParamsSummary {
    constructor(camSetting, params, entities) {
        this.camSetting = Object.assign({}, camSetting);
        this.params = Object.assign({}, params);
        this.entities = {};
        if (entities) {
            for (let key in entities) {
                this.entities[key] = Object.assign({}, entities[key]);
            }
        }
    }

    update(another) {
        Object.assign(this.camSetting, another.camSetting);
        Object.assign(this.params, another.params);
        for (let key in another.entities) {
            if (!(key in this.entities)) {this.entities[key] = another.entities[key];}
            else {
                Object.assign(this.entities[key], another.entities[key]);
            }
        }
        return this;
    }
}

export {
    newShowingFX, newHidingFX, newDrawingFX, newStyleChangeFX, 
    newSequentialFX, newParallelFX, newParamChangeFX, newCameraChangeFX,
    AllParamsSummary
};