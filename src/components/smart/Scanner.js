import React, {Component} from "react";
import {withBluetooth} from "./Bluetooth";
import {Button, Text, View} from "native-base";
import DeviceList from "../dummy/DeviceList";

/**
 * Total of 2 pts available
 */
class Scanner extends Component {

    /**
     * TODO: (2 pts)
     *  (1) Transform the peripherals Map object to an array of devices
     *  (2) Pass the devices array to DeviceList
     *
      * @returns {*}
     */
    render(){
          const {startScan, peripherals, onSelect} = this.props;
          const devices = []; /// code expected here
          return <View>
              <Button primary full onPress={startScan}>
                  <Text>Start Scan</Text>
              </Button>
              <DeviceList data={[]} onPress={onSelect}/>
          </View>
      }
}

export default withBluetooth(Scanner);