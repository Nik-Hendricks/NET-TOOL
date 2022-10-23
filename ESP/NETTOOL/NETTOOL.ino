#include <ESPAsyncTCP.h>
#include <SyncClient.h>
#include <async_config.h>
#include <tcp_axtls.h>
#include <AsyncPrinter.h>
#include <DebugPrintMacros.h>
#include <ESPAsyncTCPbuffer.h>
#include <Arduino_JSON.h>
#include <ESP8266WiFi.h>
#include <FS.h>
#include <ESP8266mDNS.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFSEditor.h>
#include <EEPROM.h>
#include "data.h"

#include "Settings.h"

#define BAUD_RATE 9600
#define bufferSize 600
#define debug true

/* ============= CHANGE WIFI CREDENTIALS ============= */
const char *ssid = "NETTOOL";
const char *password = "password"; //min 8 chars
/* ============= ======================= ============= */

AsyncWebServer server(80);
FSInfo fs_info;

Settings settings;

bool shouldReboot = false;

//Web stuff
extern const uint8_t data_indexHTML[] PROGMEM;
extern const uint8_t data_CSS[] PROGMEM;
extern const uint8_t data_mainJS[] PROGMEM;
extern const uint8_t data_NCache[] PROGMEM;
extern const uint8_t data_NEDB[] PROGMEM;
extern const int current_version PROGMEM;

extern String formatBytes(size_t bytes);

//Script stuff
bool runLine = false;
bool runScript = false;
File script;

uint8_t scriptBuffer[bufferSize];
uint8_t scriptLineBuffer[bufferSize];
int bc = 0; //buffer counter
int lc = 0; //line buffer counter


int available_networks;
String networks;

void handleUpload(AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final){
  File f;
  
  if(!filename.startsWith("/")) filename = "/" + filename;
  
  if(!index) f = SPIFFS.open(filename, "w"); //create or trunicate file
  else f = SPIFFS.open(filename, "a"); //append to file (for chunked upload)
  
  if(debug) Serial.write(data, len);
  f.write(data, len);
  
  if(final){ //upload finished
	  if(debug) Serial.printf("UploadEnd: %s, %u B\n", filename.c_str(), index+len);
	  f.close();
  }
}



void sendToIndex(AsyncWebServerRequest *request){
  AsyncWebServerResponse *response = request->beginResponse(302, "text/plain", "");
  response->addHeader("Location","/");
  request->send(response);
}

void setup() {
  
  Serial.begin(BAUD_RATE);
  delay(2000);
  if(debug) Serial.println("\nstarting...\nSSID: "+ (String)ssid +"\nPassword: "+ (String)password);

  EEPROM.begin(4096);
  SPIFFS.begin();

  settings.load();
  if(debug) settings.print();

  if(settings.autoExec) {
	  String _name = (String)settings.autostart;
	  script = SPIFFS.open("/" + _name, "r");
	  runScript = true;
	  runLine = true;
  }
  
  WiFi.mode(WIFI_STA);
  WiFi.softAP(settings.ssid, settings.password, settings.channel, settings.hidden);
  
  // ===== WebServer ==== //
  MDNS.addService("http","tcp",80);

  server.on("/css.js", HTTP_GET, [](AsyncWebServerRequest *request) {
	  AsyncWebServerResponse *response = request->beginResponse_P(200, "text/javascript", data_CSS, sizeof(data_CSS));
	  request->send(response);
  });
  
  server.on("/main.js", HTTP_GET, [](AsyncWebServerRequest *request) {
	  AsyncWebServerResponse *response = request->beginResponse_P(200, "text/javascript", data_mainJS, sizeof(data_mainJS));
	  request->send(response);
  });

   server.on("/nedb.js", HTTP_GET, [](AsyncWebServerRequest *request) {
    AsyncWebServerResponse *response = request->beginResponse_P(200, "text/javascript", data_NEDB, sizeof(data_NEDB));
    request->send(response);
  });

  server.on("/NCache.js", HTTP_GET, [](AsyncWebServerRequest *request) {
    AsyncWebServerResponse *response = request->beginResponse_P(200, "text/javascript", data_NCache, sizeof(data_NCache));
    request->send(response);
  });

  server.on("/scan_network", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", networks);
  });

  server.on("/upload", HTTP_POST, [](AsyncWebServerRequest *request){
    sendToIndex(request);
  }, handleUpload);
  
  server.on("/restart", HTTP_GET, [](AsyncWebServerRequest *request) {
	  shouldReboot = true;
  });

  server.on("/reset", HTTP_GET, [](AsyncWebServerRequest *request) {
	  settings.reset();
	  request->send(200, "text/plain", "true");
	  sendToIndex(request);
  });

  //update
  server.on("/update", HTTP_POST, [](AsyncWebServerRequest *request){
    shouldReboot = !Update.hasError();
    AsyncWebServerResponse *response = request->beginResponse(200, "text/plain", shouldReboot?"OK":"FAIL");
    response->addHeader("Connection", "close");
    request->send(response);
  },[](AsyncWebServerRequest *request, String filename, size_t index, uint8_t *data, size_t len, bool final){
    if(!index){
      if(debug) Serial.printf("Update Start: %s\n", filename.c_str());
      Update.runAsync(true);
      if(!Update.begin((ESP.getFreeSketchSpace() - 0x1000) & 0xFFFFF000)){
		  if(debug) Update.printError(Serial);
      }
    }
    if(!Update.hasError()){
      if(Update.write(data, len) != len){
        Update.printError(Serial);
      }
    }
    if(final){
      if(Update.end(true)){
		if(debug) Serial.printf("Update Success: %uB\n", index+len);
      } else {
		if(debug) Update.printError(Serial);
      }
    }
  });

  server.on("*", HTTP_GET, [](AsyncWebServerRequest *request) {
	  AsyncWebServerResponse *response = request->beginResponse_P(200, "text/html", data_indexHTML, sizeof(data_indexHTML));
	  request->send(response);
  });

  
  server.begin();
  
  if(debug) Serial.println("started");
}

void sendBuffer(){
  for(int i=0;i<bc;i++) Serial.write((char)scriptBuffer[i]);
  runLine = false;
  bc = 0;
}

void addToBuffer(){
  if(bc + lc > bufferSize) sendBuffer();
  for(int i=0;i<lc;i++){
    scriptBuffer[bc] = scriptLineBuffer[i];
    bc++;
  }
  lc = 0;
}

String network_JSON(int n){
    String json = "{";
    for (int i = 0; i < n; ++i)
    {
      String ssid = WiFi.SSID(i); //SSID
      int signal_strength = WiFi.RSSI(i); //Signal Strength
      String mac_address = WiFi.BSSIDstr(i); //mac address
      String enc_type = (WiFi.encryptionType(i) == ENC_TYPE_NONE)?" Unsecured":" Secured";
      json += "\n{ssid:'" + ssid + "', signal_strength:" + String(signal_strength) + ", mac_address:'" + mac_address + "', enc_type:'" + enc_type+"'},";
      delay(10);
    }
    json += "}";
    return json;
}

void scan_networks(){
    // WiFi.scanNetworks will return the number of networks found
  int n = WiFi.scanNetworks();
  networks = network_JSON(n);

  // Wait a bit before starting New scanning again
  delay(5000);
}

void loop() {
  if(shouldReboot) ESP.restart();
  
  if(Serial.available()) {
    uint8_t answer = Serial.read();
    if(answer == 0x99) {
      if(debug) Serial.println("done");
      runLine = true;
	}
	else {
		String command = (char)answer + Serial.readStringUntil('\n');
		command.replace("\r", "");
		if(command == "reset") {
			settings.reset();
			shouldReboot = true;
		}
	}
  }

  if(runScript && runLine){
    if(script.available()){
      uint8_t nextChar = script.read();
	  if(debug) Serial.write(nextChar);
      scriptLineBuffer[lc] = nextChar;
      lc++;
      if(nextChar == 0x0D || lc == bufferSize) addToBuffer();
    }else{
      addToBuffer();
      if(bc > 0) sendBuffer();
      runScript = false;
      script.close();
    }
  }

  scan_networks();

}
