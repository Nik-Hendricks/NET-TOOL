import {View} from '/views/View.js';

class ScanView extends View{
    constructor(){
        super();
    }
    connectedCallback(){
        this.classList.add('view');
        window.DP.dispatch("VIEW_LOAD");
        this.append_networks();
        this.resizeComponents(true);
        
    }


    append_networks(){
        this.network_items_card = window.Builder.createElement('card-item', {width:'24'}, {paddingTop:'0px'})
        window.API2.get_networks().then(networks => {
            for(var network in networks){
                var n = networks[network];
                this.network_items_card.append(this.network_element(n.ssid, n.signal_strength, n.mac_address, n.enc_type));
            }
            this.network_items_card.resizeComponents(true)
        })
        this.append(this.network_items_card);
        
    }

    network_element(ssid, signal_strength, mac_address, enc_type){
        var el = window.Builder.createElement("card-item", {nomargin:true}, {background:'var(--theme-card-color)', margin:'0px', borderRadius:'0px'});
        var ssid_el = window.Builder.createElement('custom-text', {nomargin:true, text: ssid, width: '8', align:'center'}, {});
        var signal_strength_el = window.Builder.createElement('custom-text', {nomargin:true, text: signal_strength, width: '4', align: 'center'}, {});
        var mac_address_el = window.Builder.createElement('custom-text', {nomargin:true, text: mac_address, width:'12', align: 'center'})
        el.append(signal_strength_el, ssid_el, mac_address_el);
        return el
    }


}
window.customElements.define('scan-view', ScanView);
export{ScanView};