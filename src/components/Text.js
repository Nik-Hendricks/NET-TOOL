import {Component} from '/components/Component.js'
class Text extends Component{
    constructor(){
        super();
    }

    connectedCallback(){
        this.classList.add('global-resize');
        this.innerHTML = this.getAttribute('text')
        this.style.marginLeft = 'var(--global-margin)'
        this.style.float = 'left'
        this.style.textAlign = this.getAttribute('align')
        this.style.color = this.getAttribute('color')
    }

}
window.customElements.define('custom-text', Text);
export {Text}
