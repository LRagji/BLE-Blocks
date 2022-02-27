#include <ArduinoBLE.h>
#include <Arduino_HTS221.h>

#define BLEBlocksServiceId "68469193-dec1-4953-920d-8a0953a9229c"
#define TemperatureCharId "68469193-dec2-4953-920d-8a0953a9229c"
#define HumidityCharId "68469193-dec3-4953-920d-8a0953a9229c"
#define ADC1CharId "68469193-dec4-4953-920d-8a0953a9229c"
#define UserDescriptorID "2901"
#define PresentationFormatDescriptorID "2904"
#define TemperatureEpsillion 0.20
#define HumidityEpsillion 0.20
#define ADCEpsillion 1

//For some unknown bug, Services,Chars,Descriptors have to be declared globally https://github.com/arduino-libraries/ArduinoBLE/issues/222
// Custom BLE Service
BLEService BLEBlocksService(BLEBlocksServiceId);

// Custom BLE Chars
BLEFloatCharacteristic TempChar(TemperatureCharId, BLERead | BLENotify);
BLEFloatCharacteristic HumidityChar(HumidityCharId, BLERead | BLENotify);
BLEIntCharacteristic ADC1Char(ADC1CharId, BLERead | BLENotify);

//Descriptors
byte DegreeCelsiusGATTUnit[7] = {0x14, 0x00, 0x2F, 0x27, 0x01, 0x00, 0x00};
BLEDescriptor TemperatureFormatDescriptor(PresentationFormatDescriptorID, DegreeCelsiusGATTUnit, 7);
BLEDescriptor TemperatureUserDescriptor(UserDescriptorID, "Temperature");
byte PercentageGATTUnit[7] = {0x14, 0x00, 0xAD, 0x27, 0x01, 0x00, 0x00};
BLEDescriptor HumidityFormatDescriptor(PresentationFormatDescriptorID, PercentageGATTUnit, 7);
BLEDescriptor HumidityUserDescriptor(UserDescriptorID, "Humidity");
byte Singed32IntUnitlessGATTUnit[7] = {0x10, 0x00, 0x00, 0x27, 0x01, 0x00, 0x00};
BLEDescriptor ADC1FormatDescriptor(PresentationFormatDescriptorID, Singed32IntUnitlessGATTUnit, 7);
BLEDescriptor ADC1UserDescriptor(UserDescriptorID, "ADC1-Counts");

void setup() {
  //Indicate Setup started
  digitalWrite(LED_BUILTIN, HIGH);

  // initialize serial communication
  Serial.begin(9600);
  //  while (!Serial);

  // initialize Temp/Humidity sensor
  if (!HTS.begin()) {
    Serial.println("TH sensor init failed!!,Program Halted");
    while (1);
  }

  //initialize BLE communication
  if (!BLE.begin()) {
    Serial.println("BLE init failed!!,Program Halted");
    while (1);
  }
  BLEService BLEBlocksService(BLEBlocksServiceId);
  BLE.setAppearance(0x0540);//Generic Sensor
  BLE.setLocalName("BLE-Blocks");
  BLE.setDeviceName("BLE-Blocks");
  BLE.setConnectable(true);
  BLE.setAdvertisingInterval(800);//500ms to save battery
  TempChar.addDescriptor(TemperatureUserDescriptor);
  TempChar.addDescriptor(TemperatureFormatDescriptor);
  HumidityChar.addDescriptor(HumidityUserDescriptor);
  HumidityChar.addDescriptor(HumidityFormatDescriptor);
  ADC1Char.addDescriptor(ADC1UserDescriptor);
  ADC1Char.addDescriptor(ADC1FormatDescriptor);
  BLEBlocksService.addCharacteristic(TempChar);
  BLEBlocksService.addCharacteristic(HumidityChar);
  BLEBlocksService.addCharacteristic(ADC1Char);
  BLE.addService(BLEBlocksService);
  BLE.setAdvertisedService(BLEBlocksService);
  BLE.advertise();


  //Defaulting values
  float defaultValue = HTS.readTemperature();
  TempChar.writeValue(defaultValue);
  defaultValue = HTS.readHumidity();
  HumidityChar.writeValue(defaultValue);
  int adc = analogRead(A0);
  ADC1Char.writeValue(adc);

  //Indicate Setup completed
  digitalWrite(LED_BUILTIN, LOW);
}

void loop() {
  BLEDevice client = BLE.central();
  while (client && client.connected())
  {
    if (TempChar.subscribed())
    {
      float temperature = HTS.readTemperature();
      float exisitingTemp = float(TempChar.value());
      exisitingTemp = exisitingTemp - temperature;
      if (abs(exisitingTemp) > float(TemperatureEpsillion))
      {
        TempChar.writeValue(temperature);
      }
    }
    delay(50);
    if (HumidityChar.subscribed())
    {
      //float temperature = HTS.readTemperature();//not sure if we need it here
      float humidity = HTS.readHumidity();
      float existingHumidity = float(HumidityChar.value());
      existingHumidity = existingHumidity - humidity;
      if (abs(existingHumidity) > float(HumidityEpsillion))
      {
        HumidityChar.writeValue(humidity);
      }
    }
    delay(50);
    if (ADC1Char.subscribed())
    {
      int adcCounts = analogRead(A0);
      int existingAdcCounts = int(ADC1Char.value());
      existingAdcCounts = existingAdcCounts - adcCounts;
      if (abs(existingAdcCounts) > int(ADCEpsillion))
      {
        ADC1Char.writeValue(adcCounts);
      }
    }
  }
  delay(100);
}
