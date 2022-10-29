import {View} from '/views/View.js';

class SerialMonitorView extends View{
    constructor(){
        super();
    }

    connectedCallback(){
        this.classList.add('view');
        var height = 'calc(calc(100% - calc(var(--global-input-height) * 2)) - calc(var(--global-margin) * 4))'
        this.serial_monitor_output = window.Builder.createElement('card-item', {}, {height: height});
        this.serial_monitor_input = window.Builder.createElement('custom-input', {type: 'text', placeholder: '...', width: '20'}, {});
        this.serial_monitor_input_submit = window.Builder.createElement('custom-input', {type: 'button', icon:'info', text: 'Send', width: '4'}, {})
        this.baud_rate_dropdown = window.Builder.createElement('custom-input', {type:'dropdown', icon:'info', text:'Baud Rate', width: '12'},{});
        this.other_dropdown = window.Builder.createElement('custom-input', {type:'dropdown', icon:'info', text:'Baud Rate', width: '12'},{});
        this.append(this.baud_rate_dropdown, this.other_dropdown, this.serial_monitor_output, this.serial_monitor_input, this.serial_monitor_input_submit);
        this.baud_rate_dropdown.items = ['300', '1200', '2400', '4800', '9600', '19200', '38400', '57600', '74880','115200', '230400', '250000'];

        this.serial_monitor_input_submit.onclick = () => {
            this.sendSerial();
        }
        this.start_listener();
        window.DP.dispatch("VIEW_LOAD");
    }

    start_listener(){
        setInterval(() => {
            this.readSerial().then(res => {
                console.log(JSON.stringify(res));
                this.serial_monitor_output.innerHTML = JSON.stringify(res)
            })
        }, 500);
    }

    sendSerial(){
        var command = this.serial_monitor_input.value;
        window.API2.send_serial(command)
    }

    readSerial(){
        return new Promise(resolve => {
            window.API2.read_serial().then(data => {
                resolve(data)
            })
        })
    }


}
window.customElements.define('serial-monitor-view', SerialMonitorView);
export{SerialMonitorView};