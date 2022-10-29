var fs = require('fs');
var file_names = ['index.html', 'main.js', 'NCache.js', 'nedb.js', 'css.js', 'manifest.json', 'icons-512.png', 'icons-192.png', 'apple-touch-icon.png']
var files = ['data_indexHTML', 'data_mainJS', 'data_NCache', 'data_NEDB', 'data_CSS', 'data_manifest', 'data_icon_512', 'data_icon_192', 'data_icon_apple']


String.prototype.convertToHex = function (delim) {
    return this.split("").map(function(c) {
        return ("0" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(delim || "");
};




function get_data_lines(){
    var data_lines = ``
    for(var i = 0; i < file_names.length; i++){
        var input_name = file_names[i];
        var output_name = files[i]
    
        var file_data = fs.readFileSync(`dist/${input_name}`, {encoding: 'utf8', flag:'r'})
        data_lines += `const uint8_t ${output_name}[] PROGMEM = {${compile(file_data)}};\n`
        if(i == file_names.length - 1){
            return data_lines
        }
    }

}

function get_version(){
  console.log('get_version')
  return new Promise(resolve => {
    fs.readFile(`update_version`,  (e, d) => {
      var latest_version = Number(d.toString());
      fs.writeFile('update_version', String(latest_version + 1), (e) => {
        console.log(e)
        if(e == null){
          resolve(`const int current_version PROGMEM = ${latest_version + 1};`);
        }
      })
    })
  })
}

function get_template(){
  return new Promise(resolve => {
    get_version().then(version_line => {
      var template = `#ifndef data_h
              #define data_h
              ${version_line}
              ${get_data_lines()}
                
              String formatBytes(size_t bytes){
                if (bytes < 1024) return String(bytes)+" B";
                else if(bytes < (1024 * 1024)) return String(bytes/1024.0)+" KB";
                else if(bytes < (1024 * 1024 * 1024)) return String(bytes/1024.0/1024.0)+" MB";
                else return String(bytes/1024.0/1024.0/1024.0)+" GB";
              }
              
              //source: https://forum.arduino.cc/index.php?topic=38107.0
              void PrintHex8(uint8_t *data, uint8_t length){
                Serial.print("0x");
                for (int i=0; i<length; i++) {
                  if (data[i]<0x10) {Serial.print("0");}
                  Serial.print(data[i],HEX);
                  Serial.print(" ");
                }
              }
              
              //source: http://shelvin.de/eine-integer-zahl-in-das-arduiono-eeprom-schreiben/
              void eepromWriteInt(int adr, int val) {
                byte low, high;
                low = val & 0xFF;
                high = (val >> 8) & 0xFF;
                EEPROM.write(adr, low);
                EEPROM.write(adr+1, high);
                return;
              }
              
              int eepromReadInt(int adr) {
                byte low, high;
                low = EEPROM.read(adr);
                high = EEPROM.read(adr+1);
                return low + ((high << 8) & 0xFF00);
              }
              #endif`

              resolve(template)
    })
  })
}

function compile(data){
    return "0x" + data.replace(/\r\n|\r|\n/g," ").replace( /\s\s+/g, ' ' ).convertToHex(",0x");
}

get_template().then(res => {
  fs.writeFileSync('ESP/NETTOOL/data.h', res)
})
