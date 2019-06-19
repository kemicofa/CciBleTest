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
     *  (1) Transform the peripherals Map object to an array of devices x
     *  (2) Pass the devices array to DeviceList x
     *
      * @returns {*}
     */
    render(){
          const {startScan, peripherals, onSelect} = this.props;
          const devices = [];
          renderItem = ({ devices }) => (<View key={devices.key}><Text>{devices.title}</Text></View>);
           /// code expected here

          return <View>
              <Button primary full onPress={startScan}>
                  <Text>Start Scan</Text>
              </Button>
              <DeviceList data={renderItem} onPress={onSelect}/>
          </View>
      }
}

export default withBluetooth(Scanner);
