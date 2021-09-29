function LogError(message = '', stack = '') {
    console.log(`%c Icon element: %c ${message}`, 'background-color: crimson; color: whitesmoke; font-weight: bold;', 'color: crimson;', '\n', stack);
}

function IconCore (Base) {
    class Icon extends Base {

        #_size = null;
        #_src = null;

        abortSignal = null;

        set size (val = 20) {
            if(['string', 'number'].includes(typeof val)) {
                this.#_size = val;
            }
        }

        get size () {
            return this.#_size;
        }

        set src (val = '') {
            this.#_src = `${val.replace(/(\.svg)/i, '')}.svg`;
        }

        get src () {
            return this.#_src;
        }

        constructor(size, src) {
            super();
            this.#_size = size;
            this.#_src = src;
        }

        async fetchIcon () {
            const abortController = new AbortController();
            this.abortSignal = abortController.signal;

            return fetch(this.src, {
                signal: this.abortSignal,
            })
            .then(res => {
                if(res.status !== 200) {
                    LogError(`Server responded with code: ${res.status}.`, res.statusText);
                }
                return res;
            })
            .then(res => res.text())
            .catch(err => LogError('Error while fetching an icon.', err));
        }
    }
    return Icon;
}

const creatorClass = (classAcc, classItem) => classItem(classAcc);
const extenderClass = (...parts) => parts.reduce(creatorClass, HTMLElement);



class Icon extends extenderClass(IconCore) {

    #_svg = null;
    #_sealed = false;

    #_root = null;
    #_style = null;

    // element created
    constructor () {
        super();
    }

    async #fetch () {
        const data = await this.fetchIcon();
        this.#replaceSVG(data);
    }

    #replaceSVG (data) {
        const svg = this.#_root.querySelector('svg');
        this.#_svg = document.createRange().createContextualFragment(data).firstElementChild;
        this.#updateSVG();

        svg !== null ? this.#_root.replaceChild(this.#_svg, svg) : this.#_root.appendChild(this.#_svg);
    }

    #updateSVG () {
        if(this.#_svg) {
            this.#_svg.setAttribute('width', parseInt(this.size));
            this.#_svg.setAttribute('height', parseInt(this.size));
            this.#_svg.setAttribute('fill', 'currentColor');
        }
    }

    #createShadow () {
        this.#_root = this;

        if(this.#_sealed) {
            this.#_root = this.attachShadow({ mode: 'closed' });
            this.#_style = document.createElement('style');
            this.#_style.setAttribute('type', 'text/css');
            this.#_style.textContent = `:host{display:inline-flex;align-items:center;justify-content:center;}svg{fill:currentColor;}`;
            this.#_root.appendChild(this.#_style);
        }
    }

    async connectedCallback() {
        this.src = this.getAttribute('src');
        this.size = this.getAttribute('size');
        this.#_sealed = this.hasAttribute('hollow') ? true : false;
        
        this.#_sealed = this.hasAttribute('sealed') ? true : false;
        this.#createShadow();
        // browser calls this method when the element is added to the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    disconnectedCallback() {
        this.abortSignal.abort();
        // browser calls this method when the element is removed from the document
        // (can be called many times if an element is repeatedly added/removed)
    }

    static get observedAttributes() {
        return ['size', 'src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'size':
                // Change the size
                this.size = newValue;
                this.#updateSVG();
                break;
            case 'src':
                this.src = newValue;
                this.#fetch();
                break;
            default:
                break;
        }

        // called when one of attributes listed above is modified
    }

    adoptedCallback() {
        LogError('Moving icon to new document is not implemented!');
        // called when the element is moved to a new document
        // (happens in document.adoptNode, very rarely used)
    }
}

customElements.define('svg-icon', Icon);