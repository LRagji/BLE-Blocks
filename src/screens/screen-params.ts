
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type ScreenParamList = {
    "device-services": undefined;
    "search-devices": undefined;
};

export type SearcDevicePropsType = NativeStackScreenProps<ScreenParamList, "search-devices">;

export type DeviceServicesPropsType = NativeStackScreenProps<ScreenParamList, "device-services">;