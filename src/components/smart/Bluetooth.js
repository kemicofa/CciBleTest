import React, {Component} from "react";
import {NativeAppEventEmitter, NativeEventEmitter, NativeModules, AppState, Platform, PermissionsAndroid} from "react-native";
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const BluetoothContext = React.createContext();

const BLUETOOTH_SIG = {
    BATTERY: {
        SERVICE: "180F",
        CHARACTERISTIC: "00002A19-0000-1000-8000-00805F9B34FB"
    }
};

export const withBluetooth = SomeComponent => props => <BluetoothContext.Consumer>
    {(bluetoothProps)=><SomeComponent {...props} {...bluetoothProps}/>}
</BluetoothContext.Consumer>;

/**
 * Total of 24 pts available
 */
export default class Bluetooth extends Component {

    /**
     * TODO: (1pts)
     *  Start the BleManager
     * @param props
     */
    constructor(props){
        super(props);

        /// Code expected here

        this.state = {
            peripherals: new Map(),
            appState: "",
        };

        this.handleDiscoverPeripheral           = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan                     = this.handleStopScan.bind(this);
        this.handleDisconnectedPeripheral       = this.handleDisconnectedPeripheral.bind(this);
        this.handleAppStateChange               = this.handleAppStateChange.bind(this);

    }

    /**
     * TODO: (4 pts)
     *  (1) Add "change" event listener to AppState
     *  (3) Add "BleManagerDiscoverPeripheral", "BleManagerStopScan", "BleManagerDisconnectPeripheral", listeners to the bleManagerEmitter
     *  (4) The listeners in (3) should be memorized so that they can be removed on componentWillUnmount
     *  (5) Request Android Permission to access COARSE LOCATION
     *
     *  You can assume that this method does not throw any errors and does not return any information
     */
    componentDidMount() {
        /// code expected
        console.log("Bluetooth: Component will mount not implemented");

    }

    handleAppStateChange(nextAppState) {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
                console.log('Connected peripherals: ' + peripheralsArray.length);
            });
        }
        this.setState({appState: nextAppState});
    }

    /**
     * TODO: (1 pts)
     *      Remove the three handlers added in the componentDidMount (3)
     */
    componentWillUnmount() {
        /// code expected
        console.log("Bluetooth: Component will unmount not implemented");
    }

    handleDisconnectedPeripheral(data) {
        console.log('Disconnected from ' + data.peripheral);
    }

    /**
     * TODO: (1 pts)
     *      Set "scanning" to false
     */
    handleStopScan() {
        /// code expected
        console.log("Bluetooth: Handle stop scan not implemented");
    }

    /**
     * TODO: (4 pts)
     *  (1) If already scanning, do nothing
     *  (2) Start the scan for a duration of 10 seconds
     *  (3) Search and memorize devices that have the Battery Level Service
     *  (4) Correctly handle possible exceptions
     */
    startScan() {
        /// code expected
        console.log("Bluetooth: Start scan not implemented");

    }

    /**
     * TODO: (3 pts)
     *
     *  (1) Check to see if the new peripheral already exists in peripherals
     *  (2) If it doesn't exist then add the new peripheral to the peripherals Map object
     *  (3) Update the state with peripherals
     *
     * @param peripheral
     */
    handleDiscoverPeripheral(peripheral){
        /// code expected
        console.log("Bluetooth: handle discover peripheral not implemented")
    }

    /**
     *
     * TODO: (3 pts)
     *  (1) Read the battery level characteristic of the battery level service of the currently connected bluetooth device
     *  (2) Return the battery level
     *  (3) Correctly handle possible exceptions
     *
     * @param id
     * @returns {Promise<number>}
     */
    async readBattery(id){
        /// code expected
        throw new Error("Bluetooth: read battery level not implemented");
    }

    /**
     *
     * Method that connects to a device with a given identifier (id)
     *
     * TODO: (4 pts)
     *  (1) Connect to the device
     *  (2) Retrieve services and characteristics
     *  (3) Return data from (2)
     *  (4) Correctly handle possible exceptions
     *
     * @param id
     * @returns {Promise<"react-native-ble-manager".PeripheralInfo>}
     */
    async connect(id){
        throw new Error("Bluetooth: connect to device not implemented");
    }

    /**
     *
     * Method that disconnects from a device with a given identifier
     *
     * TODO: (3 pts)
     *  (1) Disconnect from device
     *  (2) Remove peripheral (hint: Check BleManager source code)
     *  (3) Correctly handle possible exceptions
     *
     * @param id
     * @returns {Promise<void>}
     */
    async disconnect(id){
        throw new Error("Bluetooth: disconnect from device not implemented")
    }


    render(){
        const {children} = this.props;
        return <BluetoothContext.Provider value={{
            startScan: ()=>this.startScan(),
            connect: (id)=>this.connect(id),
            disconnect: (id)=>this.disconnect(id),
            readBattery: (id)=>this.readBattery(id),
            ...this.state
        }}>
            {children}
        </BluetoothContext.Provider>
    }
}