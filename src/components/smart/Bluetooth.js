import React, {Component} from "react";
import {NativeAppEventEmitter, NativeEventEmitter, NativeModules, AppState, Platform, PermissionsAndroid} from "react-native";
import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const BluetoothContext = React.createContext();

const BLUETOOTH_SIG = {
    BATTERY: {
        SERVICE: "180D",
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
        BleManager.start({showAlert: false}).then(() => {
            console.log('BLE Started');
        })
            .catch((Error)=>{
                throw new Error("BLE fail to start");
            });

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
        BleManager.start();

        this.handlediscover = bleManagerEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            () => {
                // Scanning is stopped
            }
        );
        this.handlestop = bleManagerEmitter.addListener(
            'BleManagerStopScan',
            () => {
                // Scanning is stopped
            }
        );
        this.handledisconect = bleManagerEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            () => {
                // Scanning is stopped
            }
        );
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
        BleManager.stopScan()
            .then(() => {
                // Success code
                console.log('Scan stopped');
            })
            .catch((Error)=> {
                throw new Error ("ERROR : Scan can't be stopped");
            });
    }

    /**
     * TODO: (4 pts)
     *  (1) If already scanning, do nothing
     *  (2) Start the scan for a duration of 10 seconds
     *  (3) Search and memorize devices that have the Battery Level Service
     *  (4) Correctly handle possible exceptions
     */
    startScan() {

        BleManager.scan([], 10, true)
            .then(() => {
                // Success code
                console.log('Scan started');
            });
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
        BleManager.read(id, BLUETOOTH_SIG.BATTERY.SERVICE, BLUETOOTH_SIG.BATTERY.CHARACTERISTIC)
            .then((readData) => {
                // Success code
                console.log('Read: ' + readData);

                const buffer = Buffer.Buffer.from(readData);
                const sensorData = buffer.readUInt8(1, true);
                return sensorData;
            })
            .catch((Error) => {
                // Failure code
                throw new Error("Bluetooth: read battery fail");
            });

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

        BleManager.connect(id)
            .then(() => {
                // Success code
                console.log('Connected');
                BleManager.retrieveServices(id)
                    .then((peripheralInfo) => {
                        // Success code
                        console.log('Peripheral info:', peripheralInfo);
                        return peripheralInfo;
                    })
                    .catch((Error) => {
                        throw new Error("Bluetooth: error retrieving infos");
                    });
            })
            .catch((Error) => {
                // Failure code
                throw new Error("Bluetooth: error connecting to device");
            });
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
        BleManager.disconnect(id)
            .then(() => {
                BleManager.removePeripheral(id).then(() => {
                    console.log('Periphal removed');
                })
                    .catch((Error)=>{
                        throw new Error("Bluetooth: fail removing peripheral")
                    });

            })
            .catch((error) => {
                // Failure code
                throw new Error("Bluetooth: fail disconnecting from device")
            });

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