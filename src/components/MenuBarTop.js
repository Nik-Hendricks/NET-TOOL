import {Component} from '/components/Component.js';

class MenuBarTop extends Component{
    static get observedAttributes() { return ['title']; }
    constructor(){
        super(); 
    }

    connectedCallback(){
        this.title = this.getAttribute('title')
        this.init();
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if(attr == 'title'){
            this.init();
        }
    }

    init(){
        this.style.width = "100%";
        this.style.height = '60px';
        this.style.display = 'block'

        this.back_button = window.Builder.createElement('custom-input', {type: 'button', icon: 'arrow_back_ios', width: '4', blank: true}, {marginTop: '12.5px'})
        this.title_el = window.Builder.createElement('custom-text', {text: this.title, width: '16', align: 'center', color: 'var(--theme-text-primary-color)'}, {height: '60px', lineHeight: '60px'})
        this.search_button = window.Builder.createElement('custom-input', {type: 'button', icon: 'search', width: '4', blank: true}, {marginTop: '12.5px'})
        this.search_textbox = window.Builder.createElement('custom-input', {type: 'text', placeholder: 'Search Anything...', width: '20', blank: true}, {marginTop: '12.5px'})
        this.back_button.innerHTML = 'arrow_back_ios'
        this.search_button.innerHTML = 'search'
        this.append_state('title');
        setTimeout(() => {this.resizeComponents(true)}, 10)

    }

    append_state(type){
        this.innerHTML = ''
        if(type == 'search'){
            this.append(this.back_button, this.search_textbox)
            this.search_textbox.focus();
            this.search_textbox.onkeydown = (ev) => {
    
            }
    
            this.back_button.onclick = () => {
                this.append_state('title');
            }
        }
        if(type == 'title'){
            this.append(this.back_button, this.title_el, this.search_button)
            this.back_button.onclick = () => {
                window.history.back();
            }
    
            this.search_button.onclick = () => {
                this.append_state('search');
                setTimeout(() => {this.resizeComponents(true)}, 10)
            }
        }
    }
}

window.customElements.define('menu-bar-top', MenuBarTop);
export {MenuBarTop}
