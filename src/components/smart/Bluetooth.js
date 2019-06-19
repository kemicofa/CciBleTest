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

        BleManager.start({showAlert: false})
            .then(() => {
                console.log('Module initialized');
            });

        this.state = {
            peripherals: new Map(),
            appState: "",
            scanning:null,
            data:null,
            peripheralInfo:null
        };

        this.handleDiscoverPeripheral           = this.handleDiscoverPeripheral.bind(this);
        this.handleStopScan                     = this.handleStopScan.bind(this);
        this.handleDisconnectedPeripheral       = this.handleDisconnectedPeripheral.bind(this);
        this.handleAppStateChange               = this.handleAppStateChange.bind(this);

    }
    async requestPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                {
                    title: 'bluetooth Permission',
                    message:
                        'bluetooth ' ,
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the bluettoooth');
            } else {
                console.log('bluetooth denied');
            }
        } catch (err) {
            console.warn(err);
        }
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

        const handlerChange = bleManagerEmitter.addListener('BleManagerAppStateChange', this.handleAppStateChange);
        const handlerDiscoverPeripheral =  bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',(data) => {
            this.handleDiscoverPeripheral,
                data
        });
        const handlerStopScan =  bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        const handlerDisconnectPeripheral =  bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
        this.requestPermission().then(console.log("permission ok "))
        this.startScan()
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
        this.handleDiscoverPeripheral().remove();
        this.handleStopScan().remove();
        this.handleDisconnectedPeripheral().remove();
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
        this.setState({scanning:false})
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
        if (this.state.scanning){
            return;
        }
        this.state.scanning = true;
        BleManager.scan([BLUETOOTH_SIG.BATTERY.SERVICE], 10, true)
            .then(() => {



                console.log('Scan started');
            });
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

        const {id} = peripheral;
        console.log("periphs: " + id);
        const {peripherals} = this.state;
        if (peripherals.id === peripheral){
            return;
        }

        peripherals.set(id, peripheral);
        this.setState({peripherals});
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
                this.setState({data:readData})

            })
            .catch((error) => {
                // Failure code
                console.log(error);
            });
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
        try {
            BleManager.connect(id)
                .then(() => {
                    BleManager.retrieveServices(id, [BLUETOOTH_SIG.BATTERY.SERVICE])
                        .then((peripheralInfo) => {
                            this.setState({peripheralInfo:peripheralInfo})
                            console.log('Peripheral info:', peripheralInfo);
                            return peripheralInfo;

                        });
                    console.log('Connected');
                })
                .catch((error) => {
                    // Failure code
                    console.log(error);
                });
            throw new Error("Bluetooth: connect to device not implemented");
        }
        catch (e) {
            console.error(e)
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
    async disconnect(id){
        BleManager.disconnect(id)
            .then(() => {

                console.log('Disconnected');
            })
            .catch((error) => {
                // Failure code
                console.log(error);
            });
        BleManager.removePeripheral(id).then('Device was removed')

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