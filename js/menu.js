//
// Menu event handler
//

import StageEventHandler from './stage.js'
import CanvasEventHandler from './canvas.js'

export default {
    init(world) {
        //
        // Save as png
        //
        document.querySelector('#save-as-png').addEventListener('click', (e) => {
            const dataURL = world.stage.toDataURL({ pixelRatio: 3 });
            setTimeout(() => {
                this.downloadURI(dataURL, 'stage.png');
            }, 1000)
        })


        //
        // Save as JSON
        //
        document.querySelector('#save-as-json').addEventListener('click', (e) => {
            const dataURL = `data:text/json;charset=utf-8,${world.stage.toJSON()}`
            setTimeout(() => {
                this.downloadURI(dataURL, 'stage.json');
            }, 1000)
        })


        //
        // Load
        //
        document.querySelector('#load').addEventListener('click', (e) => {
            const jsonStr = '{"attrs":{"width":1440,"height":532},"className":"Stage","children":[{"attrs":{"name":"layer"},"className":"Layer","children":[{"attrs":{"fill":"rgba(0,0,255,0.5)","name":"selector_rect","visible":false},"className":"Rect"},{"attrs":{"x":385,"y":194.5,"stroke":"black","strokeWidth":4,"strokeScaleEnabled":false,"fill":"","radius":71.58784877498204,"draggable":true,"name":"myObject"},"className":"Circle"},{"attrs":{"name":"transformer","ignoreStroke":true,"padding":5,"keepRatio":false},"className":"Transformer"},{"attrs":{"name":"group","draggable":true},"className":"Group","children":[{"attrs":{"x":574,"y":276,"stroke":"black","strokeWidth":4,"strokeScaleEnabled":false,"fill":"","width":194,"height":105,"name":"myObject"},"className":"Rect"},{"attrs":{"x":649,"y":326,"text":"New Text","fontSize":18,"name":"textNode","fill":"black"},"className":"Text"}]},{"attrs":{"points":[1324,112,1324,112],"stroke":"black","strokeWidth":4,"strokeScaleEnabled":false,"fill":"","draggable":true,"name":"myObject"},"className":"Line"}]}]}'
            world.stage = Konva.Node.create(jsonStr, 'container');
            world.layer = world.stage.children[0]
            world.transformer = world.layer.children.find(c => c.name() == 'transformer')
            world.selectionRectangle = world.layer.children.find(c => c.name() == 'selector_rect')

            const canvas = document.querySelector('#container canvas')
            const ctx = canvas.getContext('2d')
            world.canvas = canvas
            world.ctx = ctx

            CanvasEventHandler.init(world)
            StageEventHandler.init(world)
        })
    },

    downloadURI(uri, name) {
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}