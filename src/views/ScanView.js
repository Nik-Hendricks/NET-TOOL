import {View} from '/views/View.js';

class ScanView extends View{
    constructor(){
        super();
    }
    connectedCallback(){
        this.classList.add('view');
        this.network_items_card = window.Builder.createElement('card-item', {width:'24'}, {paddingTop:'0px'})
        this.network_items_container = window.Builder.createElement('div',{},{})
        this.network_items_card.append(this.network_element('SSID', '-', 'MAC Address', 'ENC Type', 'header'), this.network_items_container);
        
        this.append(this.network_items_card);
        window.DP.dispatch("VIEW_LOAD");
        setInterval(() => {
            this.append_networks();
            this.resizeComponents(true);
        }, 1000)
        
    }


    append_networks(){
        window.API2.get_networks().then(networks => {
            if(networks !== '}'){
                this.network_items_container.innerHTML = '';
                for(var network in networks){
                    var n = networks[network];
                    this.network_items_container.append(this.network_element(n.ssid, n.signal_strength, n.mac_address, n.enc_type, 'item'));
                }
                this.network_items_card.resizeComponents(true);
            }
        })        
    }

    network_element(ssid, signal_strength, mac_address, enc_type, type){
        var el = window.Builder.createElement("card-item", {nomargin:true}, {background:'var(--theme-card-color)', margin:'0px', borderRadius:'0px'}); 
        var style = (type == "header") ? {fontWeight:'bold', color: 'var(--theme-primary-color)'} : {};
        var ssid_el = window.Builder.createElement('custom-text', {text: ssid, width: '6'}, style);
        var signal_strength_el = window.Builder.createElement('custom-text', {text: signal_strength, width: '4', align: 'center'}, style);
        var mac_address_el = window.Builder.createElement('custom-text', {text: mac_address, width:'14', align: 'center'}, style)
        
        ssid_el.onclick = () => {
            console.log(ssid)
        }
        el.append(signal_strength_el, ssid_el, mac_address_el);
        return el
    }


}
window.customElements.define('scan-view', ScanView);
export{ScanView};