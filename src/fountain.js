const randomFromInterval = (interval) =>
  Math.random() * (interval[1] - interval[0]) + interval[0]

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
  })

const loadImages = (arrayOfSrc) =>
  Promise.all(arrayOfSrc.map((src) => loadImage(src)))

// Period = ms / fps
const getPeriodCalculator = () => {
  let prevTimestamp = 0
  return (timestamp) => {
    const res = timestamp < 500 ? 0 : timestamp - prevTimestamp
    prevTimestamp = timestamp
    return res
  }
}

const periodCalculator = getPeriodCalculator()

class FountainItem {
  constructor(props) {
    this.animationSpeed = props.animationSpeed
    this.power = props.power
    this.spreadAngle = props.spreadAngle
    this.g = props.gravity
    this.itemsSize = [props.minItemsSize, props.maxItemsSize]
    this.rotationSpeed = props.rotationSpeed
    this.skin = props.skin
    this.canvas = props.canvasRef
    this.id = props.id
    this.resetParams()
    this.t = randomFromInterval([-10, 0])
  }

  resetParams() {
    this.t = 0
    this.shotAngle = randomFromInterval([
      (Math.PI * (180 - this.spreadAngle)) / 360,
      (Math.PI * (180 + this.spreadAngle)) / 360,
    ])
    this.width = randomFromInterval(this.itemsSize)
    this.x = (this.canvas.current.width - this.width) / 2
    this.y = this.canvas.current.height
  }

  incrementTime() {
    this.t += (this.animationSpeed * FountainItem.period) / 1000
  }

  hidden() {
    const canvas = this.canvas.current
    return (
      this.y > canvas.height + 2 * this.width ||
      this.y < -2 * this.width ||
      this.x > canvas.width + 2 * this.width ||
      this.x < -2 * this.width
    )
  }

  move() {
    const canvas = this.canvas.current
    this.incrementTime()
    this.x =
      (canvas.width - this.width) / 2 +
      this.power * this.t * Math.cos(this.shotAngle)
    this.y =
      canvas.height -
      this.power * this.t * Math.sin(this.shotAngle) +
      (this.g * this.t * this.t) / 2
    if (this.hidden()) {
      this.resetParams()
    }
  }

  render() {
    const context = this.canvas.current.getContext('2d')
    context.save()
    context.translate(this.x + this.width / 2, this.y + this.width / 2)
    context.rotate(this.t * this.rotationSpeed * (2 * (this.id % 2) - 1))
    context.translate(-this.x - this.width / 2, -this.y - this.width / 2)
    context.drawImage(this.skin, this.x, this.y, this.width, this.width)
    context.restore()
    this.move()
  }
}

class FountainAnimator {
  constructor(props) {
    this.state = props
    this.canvas = props.canvasRef
    this.context = props.canvasRef.current.context
    this.setCanvasSize()
    window.addEventListener('resize', () => this.setCanvasSize())
  }

  setCanvasSize() {
    this.canvas.current.width = window.innerWidth
    this.canvas.current.height = window.innerHeight
  }

  createItems() {
    return loadImages(this.state.imgSkins).then((skins) => {
      const items = []
      for (let i = 0; i < this.state.itemsNumber; i++) {
        items.push(
          new FountainItem({
            ...this.state,
            skin: skins[i % skins.length],
            id: i,
          }),
        )
      }
      return items
    })
  }

  start() {
    this.createItems().then(
      (items) => {
        const context = this.canvas.current.getContext('2d')
        const tick = (timestamp) => {
          requestAnimationFrame(tick)
          FountainItem.period = periodCalculator(timestamp)
          context.clearRect(
            0,
            0,
            this.canvas.current.width,
            this.canvas.current.height,
          )
          items.forEach((item) => item.render())
        }
        requestAnimationFrame(tick)
      },
      () => console.log('Images loading error'),
    )
  }
}

export default FountainAnimator
