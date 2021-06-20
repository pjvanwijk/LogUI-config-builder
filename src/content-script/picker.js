/**
 * Simple element picker that highlights DOM elements when hovered.
 */
export default class Picker {
    constructor () {
        this.initListeners();
        this.highlight = document.createElement('div');
        this.highlight.style.position = 'absolute';

        // The highlight itself can not be selected
        this.highlight.style.pointerEvents = 'none';
        
        this.highlight.style.background = '#46509E';
        this.highlight.style.opacity = '0.5'
        this.highlight.id = 'logui-highlight';

        document.body.appendChild(this.highlight);
        console.log('New element picker created');
    }

    /**
     * Set the pick callback that will be invoked when an element is picked. 
     * Must be a function that takes 1 argument.
     * The callback will be called with the event target element
     */
    set onPickListener(fn) {
        this.onPickCallback = fn;
    }

    initListeners() {
        this.mouseMoveListener = (event) => {
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
        };

        this.clickListener = (event) => {
            event.preventDefault();
            if (this.onPickCallback) {
                this.onPickCallback(event.target);
            }
        };
    }

    highlightBySelector(selector) {
        if (selector === '*') {
            // Putting a highlight over each and every element in the DOM is a bad idea, 
            // so we just highlight the body as that reaches over the whole page.
            this.highlightBySelector('body');
        } else {
            //Remove all logui-highlight class elements and replace them with new ones defined by the selector
            document.querySelectorAll('.logui-highlight').forEach(element => element.remove());
            document.querySelectorAll(selector).forEach((element) => {
                const elHighlight = document.createElement('div');
                elHighlight.style.position = 'absolute';

                elHighlight.style.background = '#46509E';
                elHighlight.style.opacity = '0.5'
                elHighlight.classList.add('logui-highlight');
                document.body.appendChild(elHighlight);
                const box = element.getBoundingClientRect();
                elHighlight.style.width = `${box.width}px`;
                elHighlight.style.height = `${box.height}px`;
                elHighlight.style.top = `${box.top + window.scrollY}px`;
                elHighlight.style.left = `${box.left + window.scrollX}px`;
            });
        }
    }

    start() {
        console.log('Adding picker event listeners to document body');
        // Highlight the current element's bounding box on mouse over
        document.body.addEventListener('mousemove', this.mouseMoveListener);

        // Change the current selected element on a click 
        document.body.addEventListener('click', this.clickListener);
    }

    pause() {
        console.log('Removing picker event listeners');
        document.body.removeEventListener('mousemove', this.mouseMoveListener);
        document.body.removeEventListener('click', this.clickListener);
        this.highlight.remove();
    }

    stop() {
        console.log('Destroying picker');
        document.querySelectorAll('.logui-highlight').forEach(element => element.remove());
    }
}
 