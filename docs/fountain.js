const canvas = document.querySelector('#fountain')
const context = canvas.getContext('2d')
const imgSkins = document.querySelectorAll('#fountainImgs img')

let animationSpeed = 2
let power = 100
let itemsNumber = 15
let spreadAngle = 180
let itemsSize = [100, 380]
let g = 10
let rotationSpeed = 1

let x_0
let y_0
let canvasItems
let period = 0 // period = 1/fps
setCanvasSize()

const randomFromInterval = (interval) =>
  Math.random() * (interval[1] - interval[0]) + interval[0]
const dispersion = () => [
  (Math.PI * (180 - spreadAngle)) / 360,
  (Math.PI * (180 + spreadAngle)) / 360,
]

function setCanvasSize() {
  canvas.width = document.body.clientWidth
  canvas.height = document.body.clientHeight
  x_0 = canvas.width / 2
  y_0 = canvas.height
}

class CanvasItem {
  constructor(shotAngle, width, id) {
    this.t = 0
    this.shotAngle = shotAngle
    this.width = width
    this.x = canvas.width - width / 2
    this.y = canvas.height
    this.id = id
  }

  incrementTime() {
    this.t += (animationSpeed * period) / 1000
  }

  move() {
    this.incrementTime()
    this.x = x_0 + power * this.t * Math.cos(this.shotAngle) - this.width / 2
    this.y =
      y_0 -
      power * this.t * Math.sin(this.shotAngle) +
      (g * this.t * this.t) / 2
    if (
      this.y > y_0 + 2 * this.width ||
      this.y < -2 * this.width ||
      this.x > canvas.width + 2 * this.width ||
      this.x < -2 * this.width
    ) {
      this.resetParams()
    }
  }

  resetParams() {
    this.t = 0
    this.shotAngle = randomFromInterval(dispersion())
    this.width = randomFromInterval(itemsSize)
    this.x = canvas.width - this.width / 2
    this.y = canvas.height
  }

  render() {
    context.save()
    context.translate(this.x + this.width / 2, this.y + this.width / 2)
    context.rotate(this.t * rotationSpeed * (2 * (this.id % 2) - 1))
    context.translate(-this.x - this.width / 2, -this.y - this.width / 2)
    context.drawImage(
      imgSkins[this.id % imgSkins.length],
      this.x,
      this.y,
      this.width,
      this.width,
    )
    context.restore()
    this.move()
  }
}

const initCanvasItems = () => {
  canvasItems = []
  for (let i = 0; i < itemsNumber; i++) {
    canvasItems.push(
      new CanvasItem(
        randomFromInterval(dispersion()),
        randomFromInterval(itemsSize),
        i,
      ),
    )
  }
}

initCanvasItems()

const getPeriodCalculator = () => {
  let prevTimestamp = 0
  return (timestamp) => {
    period = timestamp < 500 ? 0 : timestamp - prevTimestamp
    prevTimestamp = timestamp
  }
}

const calculatePeriod = getPeriodCalculator()

const startFountain = () => {
  requestAnimationFrame(tick)
  function tick(timestamp) {
    requestAnimationFrame(tick)
    calculatePeriod(timestamp)
    context.clearRect(0, 0, canvas.width, canvas.height)
    canvasItems.forEach((item) => item.render())
  }
}

window.addEventListener('resize', setCanvasSize)
window.addEventListener('load', startFountain)
