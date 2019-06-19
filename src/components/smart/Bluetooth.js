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
     * FAIT
     * TODO: (1pts)
     *  Start the BleManager
     * @param props
     */
    constructor(props){
        super(props);

        /// Code expected here

        this.state = {
            scanning: false,
            peripherals: new Map(),
            appState: "",
        };

        this.handleDiscoverPeripheral           = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan                     = this.handleStopScan.bind(this);
        this.handleDisconnectedPeripheral       = this.handleDisconnectedPeripheral.bind(this);
        this.handleAppStateChange               = this.handleAppStateChange.bind(this);

    }

    /**
     * FAIT
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
        //console.log("Bluetooth: Component will mount not implemented");

        AppState.addEventListener('change', this.handleAppStateChange);

        BleManager.start({showAlert: false})
            .then(() => {
                console.log('BleManager started');
            });

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
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
        this.setState({appState: nextAppState});
    }

    /**
     * FAIT
     * TODO: (1 pts)
     *      Remove the three handlers added in the componentDidMount (3)
     */
    componentWillUnmount() {
        /// code expected
        //console.log("Bluetooth: Component will unmount not implemented");
        this.handlerDiscover.remove();
        this.handlerStop.remove();
        this.handlerDisconnect.remove();
    }

    handleDisconnectedPeripheral(data) {
        console.log('Disconnected from ' + data.peripheral);
    }

    /**
     * FAIT
     * TODO: (1 pts)
     *      Set "scanning" to false
     */
    handleStopScan() {
        /// code expected
        //console.log("Bluetooth: Handle stop scan not implemented");
        this.setState({ scanning: false });
    }

    /**
     * FAIT
     * TODO: (4 pts)
     *  (1) If already scanning, do nothing
     *  (2) Start the scan for a duration of 10 seconds
     *  (3) Search and memorize devices that have the Battery Level Service
     *  (4) Correctly handle possible exceptions
     */
    startScan() {
        /// code expected
        //console.log("Bluetooth: Start scan not implemented");
        if (!this.state.scanning) {
            this.setState({peripherals: new Map()});
            BleManager.scan([], 10, true).then((results) => {
                console.log('Scanning...');
                this.setState({scanning:true});
            });
        }
    }

    /**
     * FAIT
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
        //console.log("Bluetooth: handle discover peripheral not implemented")
        const peripherals = this.state.peripherals;
        if (!peripherals.has(peripheral.id)){
            console.log(peripheral);
            peripherals.set(peripheral.id, peripheral);
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
    async readBattery(id){
        /// code expected
        //throw new Error("Bluetooth: read battery level not implemented");

        await BleManager.read(id, "0x180D", "2A39")
            .then((readData) => {
                // Success code
                console.log('Read : ' + readData);
                const buffer = Buffer.Buffer.from(readData);
                const sensorData = buffer.readUInt8(1, true);
            })

        //Je veux lire la valeur du service Battery et de la caractéristique correspondante
    }

    /**
     *
     * Method that connects to a device with a given identifier (id)
     *
     * FAIT PARTIELLEMENT
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
        //throw new Error("Bluetooth: connect to device not implemented");

        await BleManager.connect(id)
            .then(() => {
                console.log('Connected');
                BleManager.retrieveServices(id)
                    .then((peripheralInfo) => {
                        console.log('Peripheral info :', peripheralInfo);
                    });

                //Je veux récupérer les services du device pour obtenir le code du service Battery et l'utiliser dans le read
            });
    }

    /**
     *
     * Method that disconnects from a device with a given identifier
     * FAIT
     * TODO: (3 pts)
     *  (1) Disconnect from device
     *  (2) Remove peripheral (hint: Check BleManager source code)
     *  (3) Correctly handle possible exceptions
     *
     * @param id
     * @returns {Promise<void>}
     */
    async disconnect(id){
        //throw new Error("Bluetooth: disconnect from device not implemented")

        await BleManager.disconnect(id)
            .then(() => {
                console.log('Disconnected');
                BleManager.removePeripheral(id)
                    .then(() => {
                        console.log('Peripheral removed');
                    });
            });
    };


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