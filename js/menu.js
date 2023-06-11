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
        document.querySelector('#file').addEventListener('change', (e) => {
            UIkit.modal(document.querySelector('#load-modal')).hide();
            const input = e.target;
            if (input.files.length == 0) {
                return;
            }

            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const jsonStr = reader.result;
                try {
                    world.stage = Konva.Node.create(jsonStr, 'container');
                } catch {
                    UIkit.notification({
                        message: `Can't load this JSON file.`,
                        status: 'danger',
                        timeout: 5000,
                    });
                    input.value = null
                    return
                }
                world.layer = world.stage.children[0]
                world.transformer = world.layer.children.find(c => c.name() == 'transformer')
                world.selectionRectangle = world.layer.children.find(c => c.name() == 'selector_rect')

                const canvas = document.querySelector('#container canvas')
                const ctx = canvas.getContext('2d')
                world.canvas = canvas
                world.ctx = ctx

                CanvasEventHandler.init(world)
                StageEventHandler.init(world)

                input.value = null
            };

            reader.readAsText(file);
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