//
// Keyboard Event Handler
//

export default {
    init(world) {
        window.addEventListener('keyup', (e) => {
            if (e.code == 'Backspace' || e.code == 'Delete') {
                world.transformer.nodes().forEach(node => node.destroy())
                world.transformer.nodes([])
            }
        })
    }
}