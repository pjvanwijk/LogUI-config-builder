/**
 * Simple element picker.
 */
export default class Picker {
    constructor () {
        console.log('New element picker created');
        this.highlight = document.createElement('div');
        this.highlight.style.position = 'absolute';

        // The highlight itself can not be selected
        this.highlight.style.pointerEvents = 'none';
        
        this.highlight.style.background = '#46509E';
        this.highlight.style.opacity = '0.5'
        this.highlight.id = 'logui-highlight';

        document.body.appendChild(this.highlight);

        document.addEventListener('mousemove', (event) => {
            /* 
            * Highlight the element by finding its bounding box and filling it with a semi-transparent div
            * The DOMRect from getBoundingClientRect returns "the smallest rectangle which contains 
            * the entire element.
            * (https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
            */
            const box = event.target.getBoundingClientRect();
            this.highlight.style.width = `${box.width}px`;
            this.highlight.style.height = `${box.height}px`;
            this.highlight.style.top = `${box.top + window.scrollY}px`;
            this.highlight.style.left = `${box.left + window.scrollX}px`;
        });
    }
}
 