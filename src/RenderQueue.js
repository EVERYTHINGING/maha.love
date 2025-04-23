class RenderQueue {
    constructor(){ this.queue = []; }

    loop(){
        let i = 0;
        let length = this.queue.length;
        for(i = 0; i < length; i++){ this.queue[i](); }
        window.requestAnimationFrame(this.loop.bind(this));
    }

    start(){ this.loop(); }

    add(fn){ 
        this.queue.push(fn);
        return this.queue.length - 1; // Return the index as an ID
    }
    
    remove(id) {
        if (id >= 0 && id < this.queue.length) {
            // Replace with a no-op function to maintain indices
            this.queue[id] = function() {};
            return true;
        }
        return false;
    }
}

export const renderQueue = new RenderQueue();