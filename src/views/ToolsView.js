import {View} from '/views/View.js';

class ToolsView extends View{
    constructor(){
        super();
    }

    connectedCallback(){
        this.classList.add('view')
        this.innerHTML = `scan`
        window.DP.dispatch("VIEW_LOAD");
    }


}
window.customElements.define('tools-view', ToolsView);
export{ToolsView};