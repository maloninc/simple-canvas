import KeyboardEventHandler from './keyboard.js'
import CanvasEventHandler from './canvas.js'
import StageEventHandler from './stage.js'
import MenuEventHandler from './menu.js'

const winWidth = window.innerWidth
const winHeight = window.innerHeight

// create Konva stage
const stage = new Konva.Stage({
    container: 'container',
    width: winWidth,
    height: winHeight,
})
const layer = new Konva.Layer({
    name: 'layer'
})
stage.add(layer)

// add transformer object
const transformer = new Konva.Transformer({
    name: 'transformer',
    ignoreStroke: true,
    padding: 5,
    keepRatio: false
})
layer.add(transformer)

// add a new feature, lets add ability to draw selection rectangle
const selectionRectangle = new Konva.Rect({
    fill: 'rgba(0,0,255,0.5)',
    name: 'selector_rect',
    visible: false,
})
layer.add(selectionRectangle)

// get canvas and context
const canvas = document.querySelector('#container canvas')
const ctx = canvas.getContext('2d')


const world = {
    stage: stage,
    layer: layer,
    transformer: transformer,
    selectionRectangle: selectionRectangle,
    canvas: canvas,
    ctx: ctx,
}

KeyboardEventHandler.init(world)
CanvasEventHandler.init(world)
StageEventHandler.init(world)
MenuEventHandler.init(world)

window.world = world
