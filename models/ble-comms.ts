import BleManager from 'react-native-ble-manager';
import { EmitterSubscription, NativeEventEmitter, NativeModules, Platform } from "react-native";

const CustomBLEAdvertiseServiceID: string = "68469193-dec1-4953-920d-8a0953a9229c";//Has to be changed in arduino also
const deviceFoundEventName = "BleManagerDiscoverPeripheral";
const BleActivatedEventName = "BleManagerDidUpdateState";

export type DeviceInfo = BleManager.PeripheralInfo;
export type Device = BleManager.Peripheral;
interface bleState { state: string; }

export class BleComms {

    public static isDiscoveryActive: boolean = false;
    private static _activeToken?: string;
    private static _emitterForEvents = new NativeEventEmitter(NativeModules.BleManager);
    private static _deviceScanHandle: EmitterSubscription | null = null;
    private static _initialized: boolean = false;
    private static _timeoutHandle: any;

    public info?: DeviceInfo;
    private _activeDevice?: Device;

    private static async BLEInit() {
        let bleReadyHandle: EmitterSubscription | undefined = undefined;
        const bleStatePromise = new Promise<bleState>((acc, rej) => {
            try {
                bleReadyHandle = BleComms._emitterForEvents.addListener(BleActivatedEventName, (bleState: bleState) => {
                    acc(bleState);
                });
            }
            catch (err) {
                rej(err);
            }
        })
            .finally(() => bleReadyHandle?.remove());
        await BleManager.start({ showAlert: true });//Just call once according to docs(https://github.com/innoveit/react-native-ble-manager#startoptions)
        if (Platform.OS == 'android') {
            BleManager.checkState();//Since this pattern is forced by ios only andriod needs a push with this method.
        }
        const currentState = await bleStatePromise;
        if (currentState.state !== "on") {
            throw new Error(`Please re-enable bluetooth or permissions as currently it is in ${currentState.state} state.`)
        }
    }

    static async discover(searchForSeconds: number, deviceFoundCallback: (device: Device | null, timedOut: boolean) => void): Promise<string> {
        if (BleComms.isDiscoveryActive === true) {
            throw new Error("Previous discovery is still active, please try after sometime.")
        }
        else {
            BleComms.isDiscoveryActive = true;
            if (BleComms._initialized === false) {
                await BleComms.BLEInit();
                BleComms._initialized = true;
            }
            const devicesFoundInthisCall = new Set<string>();
            BleComms._activeToken = Date.now().toString();
            BleComms._deviceScanHandle = BleComms._emitterForEvents.addListener(deviceFoundEventName, ((device: Device) => {
                if (BleComms._activeToken != null && device != null) {
                    if (!devicesFoundInthisCall.has(device.id)) {
                        deviceFoundCallback(device, false);
                        devicesFoundInthisCall.add(device.id);
                    }
                }
            }).bind(this));
            BleComms._timeoutHandle = setTimeout(() => {
                deviceFoundCallback(null, true);
                BleComms.stopDiscover(BleComms._activeToken as string);
            }, searchForSeconds * 1000);
            await BleManager.scan([CustomBLEAdvertiseServiceID], searchForSeconds, false);
            return BleComms._activeToken;
        }
    }

    static async stopDiscover(token: string): Promise<boolean> {
        if (BleComms._activeToken === token) {
            BleComms._activeToken = undefined;
            clearTimeout(BleComms._timeoutHandle)
            BleComms._timeoutHandle = undefined;
            BleComms._deviceScanHandle?.remove();
            BleComms._deviceScanHandle = null;
            await BleManager.stopScan()
            BleComms.isDiscoveryActive = false;
            return true;
        }
        else {
            return false;
        }
    }

    static async connect(device: Device, retryAttempts = 3): Promise<BleComms> {
        if (device.advertising.isConnectable === false) {
            return Promise.reject(new Error("Selected device doesnot support connection, please select another device."));
        }
        let connected = false;
        do {
            await BleManager.connect(device.id);
            if (Platform.OS == 'ios') {
                await new Promise((accept) => setTimeout(accept, 300));// This is as stupid as this code gets its some known issue for IOS https://github.com/innoveit/react-native-ble-manager/blob/f8672eb05a9ca5ae0d3d059b4a62e6d2c29c646d/ios/BleManager.m#:~:text=may%20be%20called-,dispatch_after,-(dispatch_time(DISPATCH_TIME_NOW%2C%200.002
            }
            connected = await BleManager.isPeripheralConnected(device.id, [CustomBLEAdvertiseServiceID]);
            retryAttempts--;
        }
        while (connected == false && retryAttempts > 0)
        if (connected === false) {
            return Promise.reject(new Error("Failed to connect to the device, please try again."));
        }
        const gatProfile = await BleManager.retrieveServices(device.id)
        return new BleComms(device, gatProfile);
    }

    private constructor(device: BleManager.Peripheral, deviceInfo: DeviceInfo) {
        this._activeDevice = device;
        this.info = deviceInfo;
    }

    async disconnect()
    {
        await BleManager.disconnect(this._activeDevice?.id as string);
        this.info = undefined;
    }
}