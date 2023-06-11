//
// Stage Event Handler
//
export default {
    init(world) {
        /*world.stage.on('mousedown touchstart', (e) => {
            // do nothing if we mousedown on any shape
            if (e.target !== stage) {
                return
            }
            e.evt.preventDefault()
            x1 = world.stage.getPointerPosition().x
            y1 = world.stage.getPointerPosition().y
            x2 = world.stage.getPointerPosition().x
            y2 = world.stage.getPointerPosition().y

            world.selectionRectangle.visible(true)
            world.selectionRectangle.width(0)
            world.selectionRectangle.height(0)
            console.log('touchstart')
        })

        world.stage.on('mousemove touchmove', (e) => {
            // do nothing if we didn't start selection
            if (!world.selectionRectangle.visible()) {
                return
            }
            e.evt.preventDefault()
            x2 = world.stage.getPointerPosition().x
            y2 = world.stage.getPointerPosition().y

            world.selectionRectangle.setAttrs({
                x: Math.min(x1, x2),
                y: Math.min(y1, y2),
                width: Math.abs(x2 - x1),
                height: Math.abs(y2 - y1),
            })
        })

        world.stage.on('mouseup touchend', (e) => {
            // do nothing if we didn't start selection
            if (!world.selectionRectangle.visible()) {
                return
            }
            e.evt.preventDefault()
            // update visibility in timeout, so we can check it in click event
            setTimeout(() => {
                world.selectionRectangle.visible(false)
            })

            const shapes = world.stage.find('.rect')
            const box = world.selectionRectangle.getClientRect()
            const selected = shapes.filter((shape) =>
                Konva.Util.haveIntersection(box, shape.getClientRect())
            )
            world.transformer.nodes(selected)
        })*/

        // clicks should select/deselect shapes
        world.stage.on('click tap', (e) => {
            // if we are selecting with rect, do nothing
            if (world.selectionRectangle.visible()) {
                return
            }

            // if click on empty area - remove all selections
            if (e.target === world.stage) {
                world.transformer.nodes([])
                world.layer.children.forEach(node => {
                    if (node.name() == 'group') {
                        node.children.forEach(c => c.draggable(false))
                    }
                })
                return
            }

            // do we pressed shift or ctrl?
            const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey
            const isSelected = world.transformer.nodes().indexOf(e.target) >= 0

            if (!metaPressed && !isSelected) {
                // if no key pressed and the node is not selected
                // select just one
                e.target.draggable(true)
                world.transformer.nodes([e.target])
            } else if (metaPressed && isSelected) {
                // if we pressed keys and node was selected
                // we need to remove it from selection:
                const nodes = world.transformer.nodes().slice() // use slice to have new copy of array
                // remove node from array
                nodes.splice(nodes.indexOf(e.target), 1)
                world.transformer.nodes(nodes)
            } else if (metaPressed && !isSelected) {
                // add the node into selection
                const nodes = world.transformer.nodes().concat([e.target])
                world.transformer.nodes(nodes)
            }
            world.transformer.zIndex(world.layer.children.length - 1) // get world.transformer front
        })
    }
}