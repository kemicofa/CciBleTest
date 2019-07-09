import React, {Component} from "react";
import {NativeAppEventEmitter, NativeEventEmitter, NativeModules, AppState, Platform, PermissionsAndroid} from "react-native";
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
    {(bluetoothProps)=><SomeComponent {...props} {...bluetoothProps}/>}
</BluetoothContext.Consumer>;

export default class Bluetooth extends Component {

    constructor(props){
        super(props);

        
        BleManager.start({showAlert: false})
            .then(() => {
            // Success code
                console.log('Module initialized');
            });

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

    componentDidMount() {
        bleManagerEmitter.addListener('BleManagerDidUpdateState', this.handleAppStateChange );
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral',  this.handleDiscoverPeripheral );
        this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral',  this.handleDisconnectedPeripheral );
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan',  this.handleStopScan );

        this.requestPermission()
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

    componentWillUnmount() {
        bleManagerEmitter.removeListener(this.handlerDiscover)
        bleManagerEmitter.removeListener(this.handlerDisconnect)
        bleManagerEmitter.removeListener(this.handlerStop)
    }

    handleDisconnectedPeripheral(data) {
        console.log('Disconnected from ' + data.peripheral);
    }

    handleStopScan() {
        this.setState({scanning: false})
    }

    startScan() {
        if (this.state.scanning) return; 

        BleManager.scan([], 3, true)
            .then(() => {
                // Success code
                this.setState({scanning: true})
                console.log('Scan started');
            }).catch((error) => {
                // Failure code
                console.log('Errorscan', error);
            });
    }

    handleDiscoverPeripheral(peripheral){

        const {id} = peripheral;
        const {peripherals} = this.state;

        if (!peripherals.has(id)) {
            peripherals.set(id, peripheral)
        };

        this.setState({peripherals});
    }

    async readBattery(id){
        try {
            const value = await BleManager.read(id, BLUETOOTH_SIG.BATTERY.SERVICE, BLUETOOTH_SIG.BATTERY.CHARACTERISTIC)
            console.log('Read: ' + value);
            return value
        } catch (error) {
            console.log('Errorread', error);
            return {}
        }
    }


    async connect(id){
        try {
            await BleManager.connect(id)
            console.log('Connected');
            const peripheralInfo = await BleManager.retrieveServices(id)
            console.log('Peripheral info:', peripheralInfo);
    
            return peripheralInfo
        } catch (error) {
            console.log('Error', error);
            return {}
        }

    }

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