import {View} from '/views/View.js';

class SettingsView extends View{
    constructor(){
        super();
    }

    connectedCallback(){
        this.classList.add('view')
        this.tabs_el = window.Builder.createElement('card-item', {nomargin:true, blank:true},{marginLeft:'0px'})
        this.tab_content_el = window.Builder.createElement('card-item', {nomargin:true, blank:true},{marginLeft:'0px'})
        this.clear_db_button = window.Builder.createElement('custom-input', {type:'button', icon:'info', text:'Clear DB'}, {});
        this.clear_script_cache_button = window.Builder.createElement('custom-input', {type: 'button', icon:'clear', text:'Clear Script Cache', onclick:'NCache._clear()'},{})
        this.network_ssid_input = window.Builder.createElement('custom-input', {type: 'text', placeholder:'SSID'}, {});
        this.network_password_input = window.Builder.createElement('custom-input', {type:'text', placeholder:'Password'}, {});
        this.network_submit = window.Builder.createElement('custom-input', {type:'button', icon:'info', text:'Connect'}, {})

        this.general_settings = [this.clear_db_button, this.clear_script_cache_button];
        this.network_settings = [this.network_ssid_input, this.network_password_input, this.network_submit];

        this.tabs = {'General':this.general_settings, 'Network': this.network_settings, "RAW":[]};
        this.tab = "General"
        this.update();
        window.DP.dispatch("VIEW_LOAD");
    }

    update(){
        //append_tabs
        this.innerHTML = ''
        this.tabs_el.innerHTML = '';
        this.tab_content_el.innerHTML = '';
        for(var tab in this.tabs){
            var width = '8';
            var e = window.Builder.createElement('custom-input', {type:'button', width: width, text: tab, icon:'info'},{})
            e.onclick = (e) => {
                this.tab = e.target.parentNode.getAttribute('text')
                this.update();
            }
            if(tab == this.tab){
                this.tabs[this.tab].forEach(element => {
                    this.tab_content_el.append(element);
                }); 
            }
            this.tabs_el.append(e)
        }
       
        this.append(this.tabs_el, this.tab_content_el)
        this.tabs_el.resizeComponents(true);    
        this.tab_content_el.resizeComponents(true);    

        this.network_submit.onclick = () => {
            console.log('connect')
        }
    }

}
window.customElements.define('settings-view', SettingsView);
export{SettingsView};