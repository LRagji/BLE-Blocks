# BLE-Blocks

This is an academic open source project, which the author develops in his free time, the idea is to design & develop BLE Blocks adhering to BLE 4.2 version or greater which can be integrated with the companion app to visualize and derive information from the data.

## 1. Voltmeter Block
 Idea is to use [Ardunio Nano 33](http://store.arduino.cc/products/arduino-nano-33-ble) to measure voltage and broadcast it over BLE to the companion app to display it.


## Refrences
1. [BLE Intro & Arduino APIs](https://www.arduino.cc/en/Reference/ArduinoBLE)
2. [BLE Profile Specs](https://www.bluetooth.com/specifications/specs/)
3. [BLE UUIDs](https://www.bluetooth.com/specifications/assigned-numbers/#:~:text=Details-,16%2Dbit%20UUIDs,-The%2016%2Dbit)
4. [BLE Appreance](https://specificationrefs.bluetooth.com/assigned-values/Appearance%20Values.pdf)
5. BluetoothBaseUUID : 00000000-0000-1000-8000-00805F9B34FB
6. [GIST For Presentation Format Descriptor](https://gist.github.com/heiko-r/f284d95141871e12ca0164d9070d61b4) 7 bytes divided into 5 parts format, exponent, unit, name space and description
7. [Nice documentation on all aspects BLE but old](https://github.com/oesmith/gatt-xml/blob/master/org.bluetooth.descriptor.gatt.characteristic_presentation_format.xml)
8. [MBed Docs](https://os.mbed.com/docs/mbed-os/v6.15/mbed-os-api-doxy/struct_gatt_characteristic_1_1_presentation_format__t.html#ae556940a3f863dbd5ffd135801ade996)
9. [React CheatSheet Typescript](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/class_components/)
10. [React Native navigation](https://reactnavigation.org/docs/getting-started)
11. [React Native Paper](https://callstack.github.io/react-native-paper/getting-started.html)
  

## Run Local
1. Android App is configured for OpenJDK 17
2. .zprofile contents

```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.0.2.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
3. [Optional] npm install -g ios-deploy to work with react native cli for direct iphone deploy `npx react-native run-ios --udid 00008101-000275DE0C00001F`
4. For pod installs `npx pod-install ios`
## TODO
1. Change bundle id for IOS & Android App
2. Change App Icon and App name for IOS & Android