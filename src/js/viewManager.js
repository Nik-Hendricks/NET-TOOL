var main_content_div = document.getElementsByTagName('main-content')[0]
var top_nav_bar = document.getElementsByTagName('menu-bar-top')[0]
var bottom_nav_bar = document.getElementsByTagName('menu-bar-bottom')[0]
var routes = {};
var current_url = location.href;
var global_el_division = 24;
var current_view;
var _url_offset = 2 // or 2 for prod mode;


function setTheme(){
    //_set_theme_property('--theme-primary-color', '#706fd3');
    //_set_theme_property('--theme-secondary-color', '#c0392b')
}

function _set_theme_property(property, value){
    document.documentElement.style.setProperty(property, value);
}

function _set_title(title){
    top_nav_bar.setAttribute('title', title)
    document.getElementsByTagName('title')[0].textContent = title
}

function _set_view(view_path){
    var view;
    var title;
    if(view_path.length == 1){
        //first level route
        if(!routes[view_path[0]]){
            window.history.back();
        }else{

            view = routes[view_path[0]].view;
            title = routes[view_path[0]].title;
            _set_title(title)
        }
    }else{
        var entry = routes[view_path[0]]
        var entry_stack = [];
        var previous_entry;
        for(var i = 0; i < view_path.length; i++){
            previous_entry = entry;
            if(i == 0){
                entry = previous_entry;
            }else{
                if(entry == undefined){
                    entry = entry_stack[1].subViews['*'].subViews[view_path[i]]
                }else{
                    entry = entry.subViews[view_path[i]]
                }
            }
            entry_stack.push(entry)
        }

        if(entry == undefined){
            if(previous_entry.subViews['*']){
                view = previous_entry.subViews['*'].view;
                title = previous_entry.subViews['*'].title;
            }else if(previous_entry.subViews['*']){
                
            }else{
                window.history.back();
            }
        }else{
            view = entry.view;
            title = entry.title;
        }


    }
    _set_title(title)
    main_content_div.innerHTML = view;
    
    _cache_last_view(view);
    if(window.API2.getMobileOperatingSystem() == "iOS"){
        if(window.navigator.standalone == true){
            document.body.style.paddingTop = "40px";
            main_content_div.style.marginTop = "40px";
        }
    }

}

function _cache_last_view(view){
    window.localStorage.lastView = view;
}

function _url_listener(){
    // Store the current page URL on load
    current_url = location.href;
    // listen for changes
    setInterval(function(){
        if (current_url != location.href){
            _unfocus_view();
            window.loadingSpinner.show();
            current_url = location.href;
            _get_view_from_url(_url_offset);
            _focus_view();
        }
    }, 100)
}

function _get_view_from_url(url_offset){
    var view_path = current_url.slice(current_url.indexOf('/') + 1, current_url.length).split('/');
    var final_paths = [];

    for(var i = url_offset; i < view_path.length; i++){
        final_paths.push(view_path[i])
    }

    _set_view(final_paths);
}

function _add_bottom_button(icon, url){
    bottom_nav_bar.add_item(icon, url);
}

function _resize_components(){
    document.getElementsByClassName('view')[0].resizeComponents()
}

function _focus_view(){
    main_content_div.style.left = `calc(50% - ${window.VM.main_content_div.offsetWidth / 2}px)`
    main_content_div.style.transition = `ease-in .2s`
    main_content_div.style['-webkit-transition'] = `ease-in .2s`
}

function _unfocus_view(){
    main_content_div.style.left = `100%`;
    main_content_div.style.transition = ``;
    main_content_div.style['-webkit-transition'] = ``;
}

function _get_data_containers(context){
    var d = (context) ? context: main_content_div;
    var e = d.getElementsByTagName('*');
    var data_content_containers = [];
        if(e.length <= 0){
            return false
        }
        for(var i = 0; i < e.length; i++){
            if(e[i].hasAttribute('data_content')){
                var d_c = e[i].getAttribute('data_content')
                data_content_containers[d_c] = {...data_content_containers[d_c], ...[e[i]]}
            }
            if(i == e.length -1){
                return data_content_containers;
            }
        }
}

const ViewManager = {
    main_content_div: main_content_div,
    global_el_division: global_el_division,
    current_view: current_view,
    context_menu: document.getElementsByTagName('context-menu')[0],
    get routes(){
        return routes;

    },
    
    register(_routes){
        routes = _routes;
        console.log(routes)
    },

    _setView(view, sub_view){
         _set_view(view, sub_view)
    },

    _URL_LISTENER(){
        _url_listener();
    },

    get_view_from_url(){ 
        _get_view_from_url(_url_offset);
    },

    set_title(title){
        _set_title(title)
    },

    set_theme_property(property, value){
        _set_theme_property(property, value)
    },

    add_bottom_button(icon, url){
        _add_bottom_button(icon, url);
    },

    begin(){
        _url_listener();
        _get_view_from_url(_url_offset);
        setTheme();
        _focus_view();
        window.onresize = () => {
            _resize_components()
        };


    },

    resize_components(){
        _resize_components();
    },

    focus_view(){
        _focus_view();
    },

    unfocus_view(){
        _unfocus_view();
    },
    getDataContainers(){
        return(_get_data_containers())
    }
}

const VMSingleton = ViewManager;

window.VM = VMSingleton // web

export default window.VM // this will initialise the singleton instantly