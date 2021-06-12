function FontainParams() {
    this.animationSpeed = 15;
    this.power = 100;
    this.itemsNumber = 15;
    this.spreadAngle = 180;
    this.gravity = 10;
    this.minItemsSize = 100;
    this.maxItemsSize = 380;
    this.rotationSpeed = 7;
};

window.onload = function() {
    var params = new FontainParams();
    var gui = new dat.GUI();

    var controllerAnimationSpeed = gui.add(params, 'animationSpeed', 0, 100);
    var controllerPower = gui.add(params, 'power', 0, 300);
    var controllerItemsNumber = gui.add(params, 'itemsNumber', 0, 100);
    var controllerSpreadAngle = gui.add(params, 'spreadAngle', 0, 180);
    var controllerGravity = gui.add(params, 'gravity', 0, 20);
    var controllerMinItemsSize = gui.add(params, 'minItemsSize', 0, 1000);
    var controllerMaxItemsSize = gui.add(params, 'maxItemsSize', 0, 1000);
    var controllerRotationSpeed = gui.add(params, 'rotationSpeed', 0, 100);

    controllerAnimationSpeed.onChange((value) => {
        animationSpeed = value
    })
    controllerPower.onChange((value) => {
        power = value
    })
    controllerItemsNumber.onChange((value) => {
        itemsNumber = value;
        initCanvasItems();
    })
    controllerSpreadAngle.onChange((value) => {
        spreadAngle = value
    })
    controllerGravity.onChange((value) => {
        g = value
    })
    controllerMinItemsSize.onChange((value) => {
        itemsSize[0] = value;
        if (value > itemsSize[1]) {
            itemsSize.reverse()
        }
    })
    controllerMaxItemsSize.onChange((value) => {
        itemsSize[1] = value;
        if (value < itemsSize[0]) {
            itemsSize.reverse()
        }
    })
    controllerRotationSpeed.onChange((value) => {
    	rotationSpeed = value;
    })
};
