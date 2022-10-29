import {View} from '/views/View.js';

class ToolsView extends View{
    constructor(){
        super();
    }

    connectedCallback(){
        this.classList.add('view');
        this.napco_tool_button = window.Builder.createElement('custom-input', {type: 'button', text:'NAPCO', icon:'info', onclick:'window.history.pushState("","","/Tools/Napco")'}, {});
        this.serial_monitor_tool_button = window.Builder.createElement('custom-input', {type: 'button', text:'Serial Monitor', icon:'info', onclick:'window.history.pushState("","","/Tools/SerialMonitor")'}, {});
        this.append(this.napco_tool_button, this.serial_monitor_tool_button)
        window.DP.dispatch("VIEW_LOAD");
    }


}
window.customElements.define('tools-view', ToolsView);
export{ToolsView};