import {View} from '/views/View.js';

class ScanView extends View{
    constructor(){
        super();
    }

    connectedCallback(){
        this.classList.add('view')

        window.API2.get_networks().then(res => {
            console.log(res)
        })

        window.DP.dispatch("VIEW_LOAD");
    }


}
window.customElements.define('scan-view', ScanView);
export{ScanView};