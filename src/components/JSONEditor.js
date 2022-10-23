import {Component} from '/components/Component.js';

class JSONEditor extends Component{

    constructor(){
        super();
        this.innerHTML = `<card-item width="12" contenteditable="true">
                            </card-item>`


        this.size = [30, 40]

        this.card = this.getElementsByTagName('card-item')[0]

        this.style.display = 'block';
        this.style.height = 19 * this.size[1] + "px";
        this.style.width = 11.41 * this.size[0] + "px";
        this.card.style.display = 'block';
        this.card.style.height = 19 * this.size[1] + "px";
        //this.card.style.width = 11.41 * this.size[0] + "px";



        this.resizeComponents(true)
    }

    connectedCallback(){
        console.log(this.find_matching("{'test':'asdf'}", 0))
        window.API2.ESP_get_client({ip: window.location.href.split("/")[4]}).then(res => {
            console.log(res)
            this.init(res);
        })
        this.highlight(3);
    }

    init(code){
        var str = JSON.stringify(code).split("");
        console.log(str)
        var tab_count = 0;
        var tab_width = 4;
        //var char_width = 
        var x = 0;
        var y = 0;
        for(var i = 0; i < str.length; i++){
                
                if(str[i] == "}"){
                    tab_count--;
                    x = tab_count * tab_width;
                    this.getElementsByTagName('card-item')[0].innerHTML += '</br>'
                    this.getElementsByTagName('card-item')[0].innerHTML += this.char_el({'char':'TAB', 'tab_count':tab_count});
                    this.getElementsByTagName('card-item')[0].innerHTML += this.char_el({'char':str[i], x: x, y: y});
                    
                }else if(str[i] == "{"){
                    this.getElementsByTagName('card-item')[0].innerHTML += this.char_el({'char':str[i], x: x, y: y});
                    tab_count++;
                    x = tab_count * tab_width;
                    this.getElementsByTagName('card-item')[0].innerHTML += '</br>'
                    this.getElementsByTagName('card-item')[0].innerHTML += this.char_el({'char':'TAB', 'tab_count':tab_count});
                }else if(str[i] == ","){
                    this.getElementsByTagName('card-item')[0].innerHTML += this.char_el({'char':str[i], x: x, y: y});
                    x = tab_count * tab_width;
                    this.getElementsByTagName('card-item')[0].innerHTML += '</br>'
                    this.getElementsByTagName('card-item')[0].innerHTML += this.char_el({'char':'TAB', 'tab_count':tab_count});
                }
                else{
                    this.getElementsByTagName('card-item')[0].innerHTML += this.char_el({'char':str[i], x: x, y: y});
                }
                
                

                x++;
        }
    }

    highlight(pos, color){
        console.log(this.card.children[pos])
    }

    char_el(props){
        var width = (props.char == 'TAB') ? 40 * props.tab_count + 'px': 'auto';
        var value = (props.char == 'TAB') ? '' : props.char;
        return `<span style="float:left; margin:0px; padding:0px; display:block; width:${width}; color:white;">${value}</span>`
    }

    find_matching(text, pos){
        var char = text.split('')[pos];
        console.log(char)
        if(char == "{"){
            //find closing
                var counter = 1;    
                while (counter > 0) {
                    var c = text.split('')[++pos];
                    if (c == '{') {
                        counter++;
                    }
                    else if (c == '}') {
                        counter--;
                    }
                }
                return pos;
            
            
        }
        if(char == "}"){
            //find opening
            var counter = 1;
            while (counter > 0) {
                var c = text.split('')[--pos];
                if (c == '}') {
                    counter--;
                }
                else if (c == '}') {
                    counter++;
                }
            }
            return pos;
        }
    }
}

window.customElements.define('json-editor', JSONEditor);
export {JSONEditor}
