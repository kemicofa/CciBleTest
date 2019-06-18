import React, {Component} from "react";
import {withBluetooth} from "./Bluetooth";
import {Button, Text, View} from "native-base";
import DeviceList from "../dummy/DeviceList";

class Scanner extends Component {

  render(){
      const {startScan, peripherals, onSelect} = this.props;
      const devices = Array.from(peripherals.values());
      return <View>
          <Button primary full onPress={startScan}>
              <Text>Start Scan</Text>
          </Button>
          <DeviceList data={devices} onPress={onSelect}/>
      </View>
  }
}

export default withBluetooth(Scanner);