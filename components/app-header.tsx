import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import React from "react";
import { Appbar } from 'react-native-paper';
export class AppHeader extends React.Component<NativeStackHeaderProps> {

    render(): React.ReactNode {
        return (
            <Appbar.Header>
                {this.props.back ? <Appbar.BackAction onPress={this.props.navigation.goBack} /> : null}
                <Appbar.Content title="BLE Blocks" subtitle={this.props.options.title} />
            </Appbar.Header>
        );
    }
}