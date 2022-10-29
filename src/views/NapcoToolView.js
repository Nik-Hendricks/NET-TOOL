import {View} from '/views/View.js';

class NapcoToolView extends View{
    constructor(){
        super();
    }

    connectedCallback(){
        this.classList.add('view');
        this.innerHTML = `scan`;
        window.DP.dispatch("VIEW_LOAD");
    }


}
window.customElements.define('napco-tool-view', NapcoToolView);
export{NapcoToolView};