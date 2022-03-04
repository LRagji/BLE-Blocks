import React from "react";
import { View, RefreshControl, ScrollView, Platform, PermissionsAndroid } from 'react-native';
import { List, Paragraph, Dialog, Portal, ActivityIndicator, Title, Avatar, Button } from 'react-native-paper';
import { BleComms, Device } from '../models/ble-comms';
import { ParamList } from './common-types/screen-params';
import { Blocks } from './blocks';
import { NativeStackScreenProps } from "@react-navigation/native-stack";

interface IAppState {
    discoveryToken: string,
    devices: Array<Device>,
    connectedDevice: BleComms | null,
    searching: boolean,
    connecting: boolean,
    connectionError: string | null,
    snackBarErrorMessage: string | null
}
type propsType = NativeStackScreenProps<ParamList, "BConnection">;
export class Connections extends React.Component<propsType, IAppState> {

    constructor(props: propsType) {
        super(props);
        this.state = {
            discoveryToken: "",
            devices: new Array<Device>(),
            connectedDevice: null,
            connecting: false,
            searching: false,
            connectionError: null,
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
        try {
            this.setState({ "connecting": true });
            if (this.state.connectedDevice != null) {
                this.disconnect();
            }
            const connectedDevice = await BleComms.connect(device);
            this.setState({ "connectedDevice": connectedDevice });
            this.setState({ "connecting": false });
            this.props.navigation.navigate("Discovery");
        }
        catch (err) {
            const msg = `Connection failed, Please retry after sometime: ${(err as Error).message}`;
            this.setState({ "connectionError": msg });
        }
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
        const sucessDialogContent = <View>
            <ActivityIndicator animating={true} />
            <Title>Connecting...</Title>
        </View>;

        const failedDialogContent = <View>
            <Paragraph>{this.state.connectionError}</Paragraph>
        </View>;
        return (
            <View style={{ flex: 1 }} >
                <Portal>
                    <Dialog dismissable={false} visible={this.state.connecting}>
                        <Dialog.Content>
                            {this.state.connectionError != null ? failedDialogContent : sucessDialogContent}
                        </Dialog.Content>
                        <Dialog.Actions>
                            {this.state.connectionError == null ? null : <Button onPress={() => console.log('Ok')}>Ok</Button>}
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
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