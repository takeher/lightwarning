#define INTERVAL_SENSOR   17000             //���崫��������ʱ����  597000
#define INTERVAL_NET      17000             //���巢��ʱ��
//����������================================   
#include <Wire.h>                                  //���ÿ�  
#include "./ESP8266.h"
#include "I2Cdev.h"                                //���ÿ�  
//��ʪ��   
#define humanHotSensor 4
bool humanHotState = false;
//����
#define  sensorPin_1  A0

#define SSID           "abc"                   // cannot be longer than 32 characters!
#define PASSWORD       "13572468"

#define IDLE_TIMEOUT_MS  3000      // Amount of time to wait (in milliseconds) with no data 
                                   // received before closing the connection.  If you know the server
                                   // you're accessing is quick to respond, you can reduce this value.

//WEBSITE     
#define HOST_NAME   "api.heclouds.com"
#define DEVICEID   "23368337"//�ĳ��Լ���
#define PROJECTID "113899"//�ĳ��Լ���
#define HOST_PORT   (80)
String apiKey="hOLSXll3NjDSg6SJFIhjIxfYsfg=";//�ĳ��Լ���
char buf[10];

#define INTERVAL_sensor 2000
unsigned long sensorlastTime = millis();

float humanOLED, lightnessOLED,warningOLED;

#define INTERVAL_OLED 1000-

String mCottenData;
String jsonToSend;

//3,������ֵ������ 
int sensor_hum=0,sensor_warning=1;
float  sensor_lux;                    //����������   
char   sensor_hum_c[7], sensor_lux_c[7],sensor_warning_c[7] ;    //����char���鴫��
#include <SoftwareSerial.h>
SoftwareSerial mySerial(2, 3); /* RX:D3, TX:D2 */
ESP8266 wifi(mySerial);
//ESP8266 wifi(Serial1);                                      //����һ��ESP8266��wifi���Ķ���
unsigned long net_time1 = millis();                          //�����ϴ�������ʱ��
unsigned long sensor_time = millis();                        //����������ʱ���ʱ��

//int SensorData;                                   //���ڴ洢����������
String postString;                                //���ڴ洢�������ݵ��ַ���
//String jsonToSend;                                //���ڴ洢���͵�json��ʽ����

void setup(void)     //��ʼ������  
{       
  //��ʼ�����ڲ�����  
    Wire.begin();
    Serial.begin(115200);   
    while(!Serial);
    pinMode(sensorPin_1, INPUT);
pinMode(humanHotSensor, INPUT);

   //ESP8266��ʼ��
    Serial.print("setup begin\r\n");   

  Serial.print("FW Version:");
  Serial.println(wifi.getVersion().c_str());

  if (wifi.setOprToStationSoftAP()) {
    Serial.print("to station + softap ok\r\n");
  } else {
    Serial.print("to station + softap err\r\n");
  }

  if (wifi.joinAP(SSID, PASSWORD)) {      //����������
    Serial.print("Join AP success\r\n");  
    Serial.print("IP: ");
    Serial.println(wifi.getLocalIP().c_str());
  } else {
    Serial.print("Join AP failure\r\n");
  }

  if (wifi.disableMUX()) {
    Serial.print("single ok\r\n");
  } else {
    Serial.print("single err\r\n");
  }

  Serial.print("setup end\r\n");
    
  
}
void loop(void)     //ѭ������  
{   
  if (sensor_time > millis())  sensor_time = millis();  
    
  if(millis() - sensor_time > INTERVAL_SENSOR)              //����������ʱ����  
  {  
    getSensorData();                                        //�������еĴ���������
    sensor_time = millis();
  }  

    
  if (net_time1 > millis())  net_time1 = millis();
  
  if (millis() - net_time1 > INTERVAL_NET)                  //��������ʱ����
  {                
    updateSensorData();                                     //�������ϴ����������ĺ���
    net_time1 = millis();
  }
  
}

void getSensorData(){ 
  humanHotState=digitalRead(humanHotSensor);
  if (humanHotState) {    
    sensor_hum = 1;  } 
    //��ȡ����
    sensor_lux = analogRead(A0); 
    if(sensor_lux>500.00){
      sensor_warning=0+sensor_hum   ; }
    delay(1000);
    dtostrf(sensor_hum, 2, 1, sensor_hum_c);
    dtostrf(sensor_lux, 3, 1, sensor_lux_c);
     dtostrf(sensor_warning, 3, 1, sensor_lux_c);
}
void updateSensorData() {
  if (wifi.createTCP(HOST_NAME, HOST_PORT)) { //����TCP���ӣ����ʧ�ܣ����ܷ��͸�����
    Serial.print("create tcp ok\r\n");


    jsonToSend+=",\"Humanhot\":";
    dtostrf(sensor_hum,1,2,buf);
    jsonToSend+="\""+String(buf)+"\"";
    jsonToSend+=",\"Light\":";
    dtostrf(sensor_lux,1,2,buf);
    jsonToSend+="\""+String(buf)+"\"";
    jsonToSend+=",\"warning\":";
    dtostrf(sensor_warning,1,2,buf);
    jsonToSend+="\""+String(buf)+"\"";
    jsonToSend+="}";



    postString="POST /devices/";
    postString+=DEVICEID;
    postString+="/datapoints?type=3 HTTP/1.1";
    postString+="\r\n";
    postString+="api-key:";
    postString+=apiKey;
    postString+="\r\n";
    postString+="Host:api.heclouds.com\r\n";
    postString+="Connection:close\r\n";
    postString+="Content-Length:";
    postString+=jsonToSend.length();
    postString+="\r\n";
    postString+="\r\n";
    postString+=jsonToSend;
    postString+="\r\n";
    postString+="\r\n";
    postString+="\r\n";

  const char *postArray = postString.c_str();                 //��strת��Ϊchar����
  Serial.println(postArray);
  wifi.send((const uint8_t*)postArray, strlen(postArray));    //send����������������������ָ�ʽ��������(const uint8_t*)
  Serial.println("send success");   
     if (wifi.releaseTCP()) {                                 //�ͷ�TCP����
        Serial.print("release tcp ok\r\n");
        } 
     else {
        Serial.print("release tcp err\r\n");
        }
      postArray = NULL;                                       //������飬�ȴ��´δ�������
  
  } else {
    Serial.print("create tcp err\r\n");
  }
  
}