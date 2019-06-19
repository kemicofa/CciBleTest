import React, {Component} from "react";
import {NativeAppEventEmitter, NativeEventEmitter, NativeModules, AppState, Platform, PermissionsAndroid} from "react-native";
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const BluetoothContext = React.createContext();

const BLUETOOTH_SIG = {
    BATTERY: {
        SERVICE: "0000180D-0000-1000-8000-00805F9B34FB",
        CHARACTERISTIC: "00002A39-0000-1000-8000-00805F9B34FB"
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
     * NOT TODO: (1pts)
     *  Start the BleManager
     * @param props
     */
    constructor(props){
        super(props);

        
        BleManager.start({showAlert: false})
            .then(() => {
            // Success code
                console.log('Module initialized');
            });
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
     * NOT TODO: (4 pts)
     *  (1) Add "change" event listener to AppState
     *  (3) Add "BleManagerDiscoverPeripheral", "BleManagerStopScan", "BleManagerDisconnectPeripheral", listeners to the bleManagerEmitter
     *  (4) The listeners in (3) should be memorized so that they can be removed on componentWillUnmount
     *  (5) Request Android Permission to access COARSE LOCATION
     *
     *  You can assume that this method does not throw any errors and does not return any information
     */
    componentDidMount() {
        /// code expected

        bleManagerEmitter.addListener('BleManagerDidUpdateState', this.handleAppStateChange );
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',  this.handleDiscoverPeripheral );
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral',  this.handleDisconnectedPeripheral );
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan',  this.handleStopScan );

        this.requestPermission()

        console.log("Bluetooth: Component will mount IS implemented");
    }

    async requestPermission() {
        if(!Platform.OS === "android") return;
        const resultCheck = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        if (resultCheck) return;
        const resultPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        if (resultPermission) return;

        throw new Error("User refused Bluetooth Permission");
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
     * NOT TODO: (1 pts)
     *      Remove the three handlers added in the componentDidMount (3)
     */
    componentWillUnmount() {
        /// code expected
        bleManagerEmitter.removeListener(this.handlerDiscover)
        bleManagerEmitter.removeListener(this.handlerDisconnect)
        bleManagerEmitter.removeListener(this.handlerStop)


        console.log("Bluetooth: Component will unmount IS implemented");
    }

    handleDisconnectedPeripheral(data) {
        console.log('Disconnected from ' + data.peripheral);
    }

    /**
     * MAYBE NOT TODO: (1 pts)
     *      Set "scanning" to false
     */
    handleStopScan() {
        /// code expected
        this.setState({scanning: false})
        console.log("Bluetooth: Handle stop scan IS implemented");
    }

    /**
     * MAYBE NOT TODO: (4 pts)
     *  (1) If already scanning, do nothing
     *  (2) Start the scan for a duration of 10 seconds
     *  (3) Search and memorize devices that have the Battery Level Service
     *  (4) Correctly handle possible exceptions
     */
    startScan() {
        if (this.state.scanning) return; 

        BleManager.scan([], 10, true)
            .then(() => {
                // Success code
                this.setState({scanning: true})
                console.log('Scan started');
            }).catch((error) => {
                // Failure code
                console.log('Errorscan', error);
            });

        /// code expected
        console.log("Bluetooth: Start scan IS implemented");

    }

    /**
     * NOT TODO: (3 pts)
     *
     *  (1) Check to see if the new peripheral already exists in peripherals
     *  (2) If it doesn't exist then add the new peripheral to the peripherals Map object
     *  (3) Update the state with peripherals
     *
     * @param peripheral
     */
    handleDiscoverPeripheral(peripheral){
        /// code expected

        const {id} = peripheral;
        const {peripherals} = this.state;

        const itemAlreadyInList = Array.from(peripherals).find((listItem) => {listItem.id === id});
        if (itemAlreadyInList === undefined) {
            peripherals.set(id, peripheral)
        };

        this.setState({peripherals});

        console.log("Bluetooth: handle discover peripheral IS implemented");
    }

    /**
     *
     * NOT TODO: (3 pts)
     *  (1) Read the battery level characteristic of the battery level service of the currently connected bluetooth device
     *  (2) Return the battery level
     *  (3) Correctly handle possible exceptions
     *
     * @param id
     * @returns {Promise<number>}
     */
    async readBattery(id){
        /// code expected

        try {
            const value = await BleManager.read(id, BLUETOOTH_SIG.BATTERY.SERVICE, BLUETOOTH_SIG.BATTERY.CHARACTERISTIC)
            console.log('Read: ' + value);
            return value
        } catch (error) {
            console.log('Errorread', error);
            return {}
        }
    }

    /**
     *
     * Method that connects to a device with a given identifier (id)
     *
     * NOT TODO: (4 pts)
     *  (1) Connect to the device
     *  (2) Retrieve services and characteristics
     *  (3) Return data from (2)
     *  (4) Correctly handle possible exceptions
     *
     * @param id
     * @returns {Promise<"react-native-ble-manager".PeripheralInfo>}
     */
    async connect(id){
        try {
            await BleManager.connect(id)
            console.log('Connected');
            const peripheralInfo = await BleManager.retrieveServices(id)
            console.log('Peripheral info:', peripheralInfo);
            console.log("Bluetooth: connect to device IS implemented");
    
            return peripheralInfo
        } catch (error) {
            console.log('Error', error);
            return {}
        }

    }

    /**
     *
     * Method that disconnects from a device with a given identifier
     *
     * NOT TODO: (3 pts)
     *  (1) Disconnect from device
     *  (2) Remove peripheral (hint: Check BleManager source code)
     *  (3) Correctly handle possible exceptions
     *
     * @param id
     * @returns {Promise<void>}
     */
    async disconnect(id){

        BleManager.disconnect(id)
            .then(() => {
                // Success code
                console.log('Disconnected');
            })
            .catch((error) => {
                // Failure code
                console.log('Errordisconnect', error);
            });

        BleManager.removePeripheral(id).catch((error) => {
            console.log('ErrorremovePeripheral', error);
        })

        console.log("Bluetooth: disconnect from device IS implemented")
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