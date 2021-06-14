const canvas = document.querySelector("#fountain");
const imgSkins = document.querySelectorAll("#fountainImgs img");

let animationSpeed = 2;
let power = 100;
let itemsNumber = 15;
let spreadAngle = 180;
let itemsSize = [100, 380];
let g = 10;
let rotationSpeed = 1;

const context = canvas.getContext("2d");
let x_0;
let y_0;
let canvasItems;
setCanvasSize();

const randomFromInterval = (interval) => Math.random() * (interval[1] - interval[0]) + interval[0];
const dispersion = () => [Math.PI * (180 - spreadAngle) / 360, Math.PI * (180 + spreadAngle) / 360];

function setCanvasSize() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    x_0 = canvas.width / 2;
    y_0 = canvas.height;
}

window.addEventListener("resize", setCanvasSize);

class CanvasItem {
    constructor(speed_x, speed_y, alpha, skin, width, id) {
        this.t = 0;
        this.x = canvas.width - width / 2;
        this.y = canvas.height;
        this.v_0x = speed_x;
        this.v_0y = speed_y;
        this.alpha = alpha;
        this.skin = skin;
        this.width = width;
        this.id = id;
    }

    incrementTime() {
        this.t += animationSpeed * period / 1000;
    }

    move() {
        this.x = x_0 + this.v_0x * this.t * Math.cos(this.alpha) - this.width / 2;
        this.y =
            y_0 - this.v_0y * this.t * Math.sin(this.alpha) +
            (g * this.t * this.t) / 2;
        this.incrementTime();
        if ((this.y > y_0 + 2 * this.width) || (this.y < -2 * this.width) || (this.x > canvas.width + 2 * this.width) || (this.x < -2 * this.width)) {
            this.resetParams();
        }
    }

    resetParams() {
        this.t = 0;
        this.v_0x = power;
        this.v_0y = power;
        this.alpha = randomFromInterval(dispersion());
        this.width = randomFromInterval(itemsSize);
    }

    render(timestamp) {
    	context.save();
        context.translate(this.x + this.width / 2, this.y + this.width / 2);
        context.rotate(timestamp / 1000 * rotationSpeed * (2 * (this.id % 2) - 1));
        context.translate(-this.x - this.width / 2, -this.y - this.width / 2);
        context.drawImage(imgSkins[this.skin], this.x, this.y, this.width, this.width);
        context.restore();
        this.move();
    }
}

const initCanvasItems = () => {
    canvasItems = [];
    for (let i = 0; i < itemsNumber; i++) {
        canvasItems.push(new CanvasItem(power, power, randomFromInterval(dispersion()), i % imgSkins.length, randomFromInterval(itemsSize), i));
    }
}

initCanvasItems();

let period = 0;

const getPeriodCalculator = () => {
	let prevTimestamp = 0;
	return (timestamp) => {
		period = (timestamp < 500) ? 0 : timestamp - prevTimestamp;
		prevTimestamp = timestamp;
	}
}

const calculatePeriod = getPeriodCalculator();

const startFountain = () => {
	requestAnimationFrame(tick);
	function tick(timestamp) {
    	requestAnimationFrame(tick);
    	calculatePeriod(timestamp);
    	context.clearRect(0, 0, canvas.width, canvas.height);
    	canvasItems.forEach(item => item.render(timestamp));
	}
}

window.addEventListener("load", startFountain);
