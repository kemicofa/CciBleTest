import React, { Component } from "react";
import { withBluetooth } from "./Bluetooth";
import { Button, Text, View } from "native-base";
import DeviceList from "../dummy/DeviceList";

class Scanner extends Component {

    render() {
        const { startScan, peripherals, onSelect, toFavorites } = this.props;
        const devices = Array.from(peripherals.values());

        return <View>
            <Button primary style={{margin:8}} full onPress={toFavorites}>
                <Text>See Favorites</Text>
            </Button>

            <Button primary full onPress={startScan} style={{marginTop:32, margin:8}}>
                <Text>Start Scan</Text>
            </Button>
            <DeviceList data={devices} onPress={onSelect} />

        </View>
    }

}

export default withBluetooth(Scanner);