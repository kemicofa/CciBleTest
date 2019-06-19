import React, { Component } from "react";
import { NativeAppEventEmitter, NativeEventEmitter, NativeModules, AppState, Platform, PermissionsAndroid } from "react-native";
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const BluetoothContext = React.createContext();

const BLUETOOTH_SIG = {
    BATTERY: {
        SERVICE: "180D",
        CHARACTERISTIC: "00002A39-0000-1000-8000-00805F9B34FB"
    }
};

export const withBluetooth = SomeComponent => props => <BluetoothContext.Consumer>
    {(bluetoothProps) => <SomeComponent {...props} {...bluetoothProps} />}
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
    constructor(props) {
        super(props);
        /// Code expected here
        BleManager.start()
            .then(() => {
                console.log('Module initialized');
            });

        this.state = {
            peripherals: new Map(),
            appState: "",
            scanning: false
        };

        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
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
        // (1)
        AppState.addEventListener('change', this.handleAppStateChange);
        // (3)
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
        // (5)
        if (Platform.OS === 'android') {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                }
                else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }
    }

    handleAppStateChange(nextAppState) {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
                console.log('Connected peripherals: ' + peripheralsArray.length);
            });
        }
        this.setState({ appState: nextAppState });
    }

    /**
     * TODO: (1 pts)
     *      Remove the three handlers added in the componentDidMount (3)
     */
    componentWillUnmount() {
        /// code expected
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerDisconnect.remove();
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
        this.setState({ scanning: false });
        console.log("Scan stopped");
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
        // (1)
        if (!this.state.scanning) {
            // (2)
            BleManager.scan([], 10, true).then((results) => {
                console.log('Scan started ...');
                this.setState({ scanning: true });
            });
        } else {
            console.log("error")
        }
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
    handleDiscoverPeripheral(peripheral) {
        /// code expected
        // (1)
        const peripherals = this.state.peripherals;
        // (2)
        if (!peripherals.has(peripheral.id)) {
            peripherals.set(peripheral.id, peripheral);
            // (3)
            this.setState({ peripherals })
        }
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
    async readBattery(id) {
        /// code expected
        try {
            // (1)
            const batteryAkaHeartRate = await BleManager.read(id, BLUETOOTH_SIG.BATTERY.SERVICE, BLUETOOTH_SIG.BATTERY.CHARACTERISTIC);
            console.log(batteryAkaHeartRate);
            // (2)
            return batteryAkaHeartRate;
            // (3)
        } catch(error){
            console.log("fuck that");
            throw new Error(error);
        }
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
    async connect(id) {
        try {
            // (1)
            await BleManager.connect(id);
            console.log('Connected')
            // (2)
            const servicesData = await BleManager.retrieveServices(id)
            // (3)
            return  servicesData;
            // (4)
        } catch(error){
            console.log(error);
            throw new Error(error);
        }
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
    async disconnect(id) {
        try {
            // (1)
            await BleManager.disconnect(id);
            // await BleManager.removePeripheral(id);
        } catch(error){
            console.log(error);
            throw new Error(error);
        }
    }


    render() {
        const { children } = this.props;
        return <BluetoothContext.Provider value={{
            startScan: () => this.startScan(),
            connect: (id) => this.connect(id),
            disconnect: (id) => this.disconnect(id),
            readBattery: (id) => this.readBattery(id),
            ...this.state
        }}>
            {children}
        </BluetoothContext.Provider>
    }
}