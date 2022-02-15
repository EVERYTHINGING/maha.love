class RenderQueue {
    constructor(){ this.queue = []; }

    loop(){
        let i = 0;
        let length = this.queue.length;
        for(i = 0; i < length; i++){ this.queue[i](); }
        window.requestAnimationFrame(this.loop.bind(this));
    }

    start(){ this.loop(); }

    add(fn){ this.queue.push(fn) }
}

export let renderQueue = new RenderQueue();