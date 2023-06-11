//
// Canvas Event Handler
//
let drawing = false
let points = []

const defaultStrokeWidth = 4
const defaultFill = ''
const recognizer = new DollarRecognizer()

export default {
    init(world) {
        world.canvas.addEventListener('mousedown', (e) => {
            const children = world.layer.getChildren()
            if (this.intersects(children, {x:e.x, y:e.y})) {
                return false
            }

            points.push(new Point(e.clientX - world.canvas.offsetLeft, e.clientY - world.canvas.offsetTop))
            drawing = true
        })

        world.canvas.addEventListener('mousemove', (e) => {
            if (!drawing) return

            points.push(new Point(e.clientX - world.canvas.offsetLeft, e.clientY - world.canvas.offsetTop))

            world.ctx.beginPath()
            world.ctx.moveTo(points[0].X, points[0].Y)
            for (let i = 1; i < points.length; i++) {
                world.ctx.lineTo(points[i].X, points[i].Y)
            }
            world.ctx.stroke()
        })

        world.canvas.addEventListener('mouseup', (e) => {
            if (!drawing) return
            drawing = false

            const minX = Math.min(...points.map(p => p.X))
            const maxX = Math.max(...points.map(p => p.X))
            const minY = Math.min(...points.map(p => p.Y))
            const maxY = Math.max(...points.map(p => p.Y))

            const width = maxX - minX
            const height = maxY - minY

            const centerX = minX + width / 2
            const centerY = minY + height / 2
            const distances = points.map(p => Math.sqrt(Math.pow(p.X - centerX, 2) + Math.pow(p.Y - centerY, 2)))
            const averageDistance = distances.reduce((a, b) => a + b, 0) / distances.length
            
            const result = recognizer.Recognize(points)
            console.log(result)

            world.ctx.beginPath()
            if (result.Score > 0.7) {
                if (result.Name == 'rectangle') {
                    world.layer.add(new Konva.Rect({
                        x: minX,
                        y: minY,
                        stroke: 'black',
                        strokeWidth: defaultStrokeWidth,
                        strokeScaleEnabled: false,
                        fill: defaultFill,
                        fill: defaultFill,
                        width: width,
                        height: height,
                        draggable: true,
                        name: 'myObject',
                    }))
                } else if (result.Name == 'circle') {
                    world.layer.add(new Konva.Circle({
                        x: centerX,
                        y: centerY,
                        stroke: 'black',
                        strokeWidth: defaultStrokeWidth,
                        strokeScaleEnabled: false,
                        fill: defaultFill,
                        radius: averageDistance,
                        draggable: true,
                        name: 'myObject',
                    }))
                } else if (result.Name == 'arrow') {
                    world.layer.add(new Konva.Arrow({
                        points: [points[0].X, points[0].Y, points[points.length - 1].X, points[points.length - 1].Y],
                        stroke: 'black',
                        strokeWidth: defaultStrokeWidth,
                        strokeScaleEnabled: false,
                        fill: defaultFill,
                        draggable: true,
                        name: 'myObject',
                    }))
                }
            } else {
                world.layer.add(new Konva.Line({
                    points: [points[0].X, points[0].Y, points[points.length - 1].X, points[points.length - 1].Y],
                    stroke: 'black',
                    strokeWidth: defaultStrokeWidth,
                    strokeScaleEnabled: false,
                    fill: defaultFill,
                    draggable: true,
                    name: 'myObject',
                }))
            }
            world.ctx.stroke()

            this.setMouseCursor(world.layer)
            points = []
        })

        world.canvas.addEventListener('dblclick', (e) => {
            const children = world.layer.getChildren()
            const found = this.intersects(children, { x: e.x, y: e.y })

            if (found) {
                if (found.name() == 'group' || found.name() == 'textNode') {
                    return
                }
            }

            const textNode = new Konva.Text({
                x: e.x,
                y: e.y,
                text: 'New Text',
                fontSize: 18,
                name: 'textNode',
            })
            if (found) {
                const group = new Konva.Group({
                    name: 'group',
                    draggable: true,
                });
                found.draggable(false)
                group.add(found)
                group.add(textNode)
                world.layer.add(group)
            } else {
                world.layer.add(textNode)
            }
            this.setMouseCursor(world.layer)

            textNode.on('transform', function () {
                // reset scale, so only with is changing by transformer
                textNode.setAttrs({
                    width: textNode.width() * textNode.scaleX(),
                    scaleX: 1,
                    scaleY: 1,
                })
            })

            textNode.on('dblclick dbltap', (node) => {
                // create textarea over canvas with absolute position

                // first we need to find position for textarea
                // how to find it?

                // at first lets find position of text node relative to the stage:
                const textPosition = textNode.getAbsolutePosition()

                // then lets find position of stage container on the page:
                const stageBox = world.stage.container().getBoundingClientRect()

                // so position of textarea will be the sum of positions above:
                const areaPosition = {
                    x: stageBox.left + textPosition.x,
                    y: stageBox.top + textPosition.y,
                }

                // create textarea and style it
                const textarea = document.createElement('textarea')
                document.body.appendChild(textarea)

                textarea.value = textNode.text()
                textarea.style.fontSize = '20px'
                textarea.style.position = 'absolute'
                textarea.style.top = areaPosition.y + 'px'
                textarea.style.left = areaPosition.x + 'px'
                textarea.style.width = textNode.width()

                textarea.focus()

                textarea.addEventListener('keydown', (e) => {
                    // hide on enter
                    if (e.keyCode === 13) {
                        textNode.text(textarea.value)
                        document.body.removeChild(textarea)
                    }
                })
                textarea.addEventListener('blur', (e) => {
                    textNode.text(textarea.value)
                    document.body.removeChild(textarea)
                })

            })
        })
    },

    //
    // find intersecting object
    //
    intersects(children, point) {
        if (!children) { return false }
        for (let c of children) {
            if (c.intersects && c.intersects(point)) {
                return c
            } else {
                if (this.intersects(c.children, point)) {
                    return c
                }
            }
        }
        return null
    },

    //
    // set mouse cursor
    //
    setMouseCursor(layer) {
        layer.children.forEach(node => {
            if (node.draggable()) {
                node.on('mouseover', function () {
                    document.body.style.cursor = 'grab';
                });
                node.on('mouseup', function () {
                    document.body.style.cursor = 'grab';
                });
                node.on('mousedown', function () {
                    document.body.style.cursor = 'grabbing';
                });
                node.on('mouseout', function () {
                    document.body.style.cursor = 'default';
                });
            }
        })
    }
}
