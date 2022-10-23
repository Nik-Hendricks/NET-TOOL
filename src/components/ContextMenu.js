import {Component} from '/components/Component.js';

class ContextMenu extends Component {
    constructor() {
        super();
    }

    connectedCallback(){
        this.classList.add('context-menu')
        this.style = "padding-top: 10px; display:none;position:absolute; width:150px; height:auto; background:var(--theme-card-color); border-radius:var(--global-border-radius);z-index:99;"

        window.onclick = (ev) => {
            var show = false;
            console.log(ev)
            for(var key in ev.path){
                if(String(ev.path[key].nodeName) != '#document' && String(ev.path[key].nodeName) != 'undefined'){
                    if(ev.path[key].tagName.toLowerCase() == 'context-menu'){
                        show = true;   
                    }               
                }
            }
            if(show == false){
                this.hide()
            }
        }
    }

    destroy(){
        this.innerHTML = ''
    }

    hide(){
        this.style.display = "none"
        this.destroy()
    }

    show(x, y, html){
        this.hide();
        setTimeout(() => {
            this.style.left = `${x}px`;
            this.style.top = `${y}px`;
            this.style.display = "block"            
            this.innerHTML = /*html*/ html
            this.resizeComponents(true)
        }, 100);
        
    }

}

window.customElements.define('context-menu', ContextMenu);
export{ContextMenu};