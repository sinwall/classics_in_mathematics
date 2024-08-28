class CameraSetting {
    constructor (scale, centerX, centerY, centerZ, elev, azim, dist, yIsUp) {
        this.scale = scale || 1;
        this.centerX = centerX || 0;
        this.centerY = centerY || 0;
        this.centerZ = centerZ || 0;
        if (elev === undefined) {elev = 90;}
        this.elev = elev;
        this.azim = azim || 0;
        this.dist = dist || 10;
        if (yIsUp === undefined) {yIsUp = true;}
        this.yIsUp = yIsUp;
    }
}


class DynamicDiagramConfiguration {
    constructor (stepMax, initialCamSet, initialParams, calculation, setupActions, forwardActions, captions) {
        this.stepMax = stepMax;
        this.initialCamSet = initialCamSet;
        this.initialParams = initialParams;
        this.calculation = calculation;
        this.setupActions = setupActions;
        this.forwardActions = forwardActions;
        this.captions = captions;
    }
}

export {CameraSetting, DynamicDiagramConfiguration};