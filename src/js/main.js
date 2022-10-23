import Dispatcher from '/js/dispatcher.js';
import API2 from '/js/API2.js'
import ViewManager from '/js/viewManager.js';
import Builder from '/js/Builder.js';
import Utils from '/js/Utils.js';

//import all components
import {MenuBarBottom} from '/components/MenuBarBottom.js';
import {MenuBarTop} from '/components/MenuBarTop.js';
import {MainContent} from '/components/MainContent.js';
import {LoadingSpinner} from '/components/loadingSpinner.js';
import {SideScroller} from '/components/sidescroller.js';
import {Card} from '/components/Card.js';
import {IconButton} from '/components/iconbutton.js';
import {GridContainer} from '/components/GridContainer.js';
import {ImageSlider} from '/components/ImageSlider.js';
import {ListItem} from '/components/ListItem.js';
import {PostCard} from '/components/PostCard.js';
import {ContextMenu} from '/components/ContextMenu.js';
import {CodeFormat} from '/components/CodeFormat.js';
import {MusicPlayer} from '/components/MusicPlayer.js';
import {SliderInput} from '/components/SliderInput.js';
import {SQLEditor} from '/components/SQLEditor.js';
import {Calculator} from '/components/Calculator.js';
import {Calendar} from '/components/Calendar.js';
import {PostCardHeader} from '/components/PostCardHeader.js';
import {PostCardFooter} from '/components/PostCardFooter.js';
import {CustomInput} from '/components/CustomInput.js';
import {PieChart} from '/components/PieChart.js';
import {Text} from '/components/Text.js';
//import all views
import {SettingsView} from '/views/SettingsView.js';
import {ScanView} from '/views/ScanView.js';
import {ToolsView} from '/views/ToolsView.js';


window.onload = () => {
    window.API2.register_service_worker();
    register_views();
    window.API2.new_db('app_data');

    window.DP.on("VIEW_LOAD", () => {
        console.log("VIEW LOAD")
        window.VM.resize_components();
        window.loadingSpinner.hide();
    })

    window.DP.on('API_LOAD', () => {
            console.log("API LOAD")
            window.VM.begin();
            append_bottom_buttons();
    })

    window.DP.on('NO_AUTH', () => {
    })

    
}

function append_bottom_buttons(){
    window.VM.add_bottom_button('settings', '/Settings');
    window.VM.add_bottom_button('wifi', '/Scan')
    window.VM.add_bottom_button('handyman','/Tools');
}

function track_events(){
    let date = new Date(), sec = date.getSeconds();
    setTimeout(()=>{
        setInterval(()=>{
            // get events and check if any match current date
            window.API2.events_db.then(events => {
                console.log(events)
                var d = new Date(); 
                var st = d.getHours()+""+d.getMinutes()
                console.log(st)
                events.forEach(event => {
                    if(event.start_time == String(st)){
                        console.log(event.alarm_sound)
                        new Audio(event.alarm_sound).play();
                    }
                })

            })
        }, 60 * 1000);
    }, (60 - sec) * 1000);
}

function register_views(){
    var last_visited_view = (window.localStorage.lastView !== undefined) ? window.localStorage.lastView: `<scan-view></scan-view>`;
    var routes = {
        "":{
            title: 'Net Tool',
            view: last_visited_view
        },
        "Scan":{
            title: 'Net Tool > Scan',
            view: '<scan-view></scan-view>'
        },
        "Tools":{
            title: 'Net Tool > Tools',
            view: `<tools-view></tools-view>`
        },
        "Settings":{
            title: 'Net Tool > Settings',
            view: `<settings-view></settings-view>`
        }
    }
    
    window.VM.register(routes)

    
}


