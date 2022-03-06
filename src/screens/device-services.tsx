import React, { useState, useEffect } from "react";
import { Headline, Card, Title, Paragraph, Button, Avatar, Colors, ProgressBar, List, RadioButton } from 'react-native-paper';
import { DeviceServicesPropsType } from './screen-params';
import { BleComms } from '../models/ble-comms';
import { Switch, View } from "react-native";

export function DeviceServices(props: DeviceServicesPropsType): React.ReactNode {
    const deviceInfo = BleComms.SingletonInstance?.info;
    return (
        <View style={{ flex: 1 }} >
            <Card>
                <Card.Title title={deviceInfo?.advertising.localName} subtitle={`${deviceInfo?.name}-${deviceInfo?.id}`}
                    left={props => <Avatar.Icon {...props} icon="cube" />}
                    right={props => <Avatar.Icon {...props} icon="beta" />}
                />
                <Card.Content>
                    <ProgressBar progress={(100 + (deviceInfo?.rssi || 0)) / 100} />
                    <Paragraph>{`Exposes ${deviceInfo?.services?.length} functions`}</Paragraph>
                </Card.Content>
            </Card>
            {
                (deviceInfo?.services?.length || 0) < 0 ? null : deviceInfo?.services?.map((s) => {
                    return <List.Item
                        title={`${s.uuid}`}
                        description={`None`}
                        left={props => <List.Icon {...props} icon="pulse" />}
                        right={props => <Switch value={true} />}
                        onPress={() => console.log(s.uuid)}
                        key={s.uuid}
                    />
                })
            }
        </View>
    );
}