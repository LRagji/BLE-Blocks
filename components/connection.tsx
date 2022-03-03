import React from "react";
import { View, RefreshControl, ScrollView, Platform, PermissionsAndroid } from 'react-native';
import { List, Paragraph } from 'react-native-paper';
import { BleComms, Device } from '../models/ble-comms';

interface IAppState {
    discoveryToken: string,
    devices: Array<Device>,
    command: string,
    connectedDevice: BleComms | null,
    response: string,
    searching: boolean,
    snackBarErrorMessage: string | null
}

export class Connections extends React.Component<any, IAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            discoveryToken: "",
            devices: new Array<Device>(),
            command: '',
            connectedDevice: null,
            response: '',
            searching: false,
            snackBarErrorMessage: null
        }

        this.startDiscovery = this.startDiscovery.bind(this);
        this.connectDevice = this.connectDevice.bind(this);

    }

    async startDiscovery(): Promise<void> {
        const token = await BleComms.discover(30, (newDevice: Device | null, timedOut: boolean) => {
            if (newDevice != null) {
                this.setState({ ...this.state, "devices": new Array<Device>(...this.state.devices, newDevice) });
            }

            if (timedOut === true) {
                this.setState({ ...this.state, "searching": false });
            }
        });
        this.setState({ ...this.state, "searching": true, "devices": new Array<Device>(), "discoveryToken": token });
    }

    async connectDevice(device: Device) {
        if (this.state.connectedDevice != null) {
            this.disconnect();
        }
        const connectedDevice = await BleComms.connect(device);
        this.setState({ "connectedDevice": connectedDevice })
    }

    async disconnect() {
        await this.state.connectedDevice?.disconnect();
        this.setState({ "connectedDevice": null })
    }

    async componentDidMount() {
        if (Platform.OS === 'android') {
            let result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (result !== true) {
                const reqResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            }
            result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
            if (result !== true) {
                const reqResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            }
            result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
            if (result !== true) {
                const reqResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
            }
            result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE);
            if (result !== true) {
                const reqResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE);
            }
            result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            if (result !== true) {
                const reqResult = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
            }
        }
        else if (Platform.OS === 'ios') {
            //Not sure
        }
    }

    render(): React.ReactNode {
        return (
            <View style={{ flex: 1 }} >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} refreshControl={<RefreshControl refreshing={this.state.searching} onRefresh={this.startDiscovery} />} >
                    {
                        this.state.devices.length > 0 ? null : <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}><Paragraph>Pull down to scan nearby devices.</Paragraph></View>
                    }
                    {
                        this.state.devices.length < 0 ? null : this.state.devices.map((d, index) => {
                            return <List.Item
                                title={`${d.name}`}
                                description={`Id:${d.id} RSSI:${d.rssi})`}
                                left={props => <List.Icon {...props} icon="bluetooth" />}
                                onPress={() => this.connectDevice(d)}
                                key={d.id}
                            />
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}