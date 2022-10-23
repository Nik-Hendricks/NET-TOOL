import {Component} from '/components/Component.js';

class ListItem extends Component {
    constructor(){
        super();
    }

    connectedCallback(){
        this.classList.add('list-item','global-resize');
        this.setAttribute('nomargin',true)
        this.icon = this.getAttribute('icon');
        this.text = this.getAttribute('text')
        this.font_size = (this.hasAttribute('font-size')) ? this.getAttribute('font-size') : 20;
        this.secondary_font_size = (this.hasAttribute('secondary-font-size')) ? this.getAttribute('secondary-font-size'): 15;
        this.icon_color = (this.hasAttribute('icon-color')) ? this.getAttribute('icon-color') : `var(--theme-primary-color)`;
        this.style.width = this.parentElement.offsetWidth + 'px'
        this.style.display = 'block'

        var icon = (this.hasAttribute('icon')) ? this.getAttribute('icon') : 'info';
        var icon_color = (this.hasAttribute('icon_color')) ? this.getAttribute('icon_color') : 'var(--theme-primary-color)';
        var icon_el = (icon.includes('fa-')) ? this._fontawesome_icon(icon) : this._material_icon(icon);
    
        var text = (this.hasAttribute('text')) ? this.getAttribute('text') : '';
        var text_el = this._button_text_el(text)
        var text_color = (this.hasAttribute('text_color')) ? this.getAttribute('text_color') : 'var(--theme-text-primary-color)';
    
        var right_text = (this.hasAttribute('right_text')) ? this.getAttribute('right_text'):'';
        var right_text_el = this._button_right_text_el(right_text)
        var right_text_color = (this.hasAttribute('right_text_color')) ? this.getAttribute('right_text_color') : ''; 
    
        text_el.style.color = text_color;
        icon_el.style.color = icon_color
        right_text_el.style.color = right_text_color;
        this.append(icon_el, text_el, right_text_el);



    }

    _material_icon(icon, color){
        var e = document.createElement('card-item');
        e.setAttribute('width', 2);
        e.setAttribute('blank', true)
        e.classList.add('material-icons')
        e.textContent = icon;
        
        return e
    }

    _fontawesome_icon(icon, color){
        var e = document.createElement('i');
        e.classList.add(icon);
    }

    _button_text_el(text){
        var e = document.createElement('card-item')
        e.setAttribute('width', 10);
        e.setAttribute('blank', true)
        e.style.padding = '0px'
        e.innerHTML = `<p style="text-align:center; padding:0; margin:0;">${text}</p>`;
        return e
    }

    _button_right_text_el(text){
        var e = document.createElement('b')
        e.style.position = 'absolute';
        e.style.right = 'var(--global-margin)';
        e.style.top = 'var(--global-margin)';
        e.textContent = text;
        return e;
    }


    get_max_height(){
        var max_height = 0;
        var e = this.getElementsByTagName('card-item')
        for(var i = 0; i < e.length; i++){
            var o_h = e[i].offsetHeight;
            if(max_height < o_h){
                max_height = o_h
            }
            if(i == e.length -1){
                return max_height;
            }
        }
    }
}

window.customElements.define('list-item', ListItem);
export{ListItem};