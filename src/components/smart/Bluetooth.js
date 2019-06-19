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
     *  (1) Add "change" event listener to AppState x
     *  (3) Add "BleManagerDiscoverPeripheral", "BleManagerStopScan", "BleManagerDisconnectPeripheral", listeners to the bleManagerEmitter x
     *  (4) The listeners in (3) should be memorized so that they can be removed on componentWillUnmount x
     *  (5) Request Android Permission to access COARSE LOCATION x
     *
     *  You can assume that this method does not throw any errors and does not return any information
     */
    componentDidMount() {
        /// code expected
        AppState.addEventListener('change', this.handleAppStateChange);
        const {bleStore} = this.props;
        this.handleDiscoverPeripheral = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
        this.handleStopScan = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
        this.handleDisconnectedPeripheral = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
        this.handleAppStateChange = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleAppStateChange );

        if (Platform.OS === 'android' && Platform.Version >= 23) {
              PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                  if (result) {
                    console.log("Permission is OK");
                  } else {
                    PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
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
          BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
            console.log('Connected peripherals: ' + peripheralsArray.length);
          });
        }
        this.setState({appState: nextAppState});
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
     * TODO: (1 pts) x
     *      Remove the three handlers added in the componentDidMount (3) x
     */
    componentWillUnmount() {
        /// code expected
        this.handleDiscoverPeripheral.remove();
        this.handleStopScan.remove();
        this.handleDisconnectedPeripheral.remove();
        this.handleAppStateChange.remove();

        console.log("Bluetooth: Component will unmount not implemented");
    }

    handleDisconnectedPeripheral(data) {
        console.log('Disconnected from ' + data.peripherals);
    }

    /**
     * TODO: (1 pts) x
     *      Set "scanning" to false x
     */
    handleStopScan() {
        /// code expected
        console.log('Scan is stopped');
         this.setState({ scanning: false });
    }

    /**
     * TODO: (4 pts)
     *  (1) If already scanning, do nothing x
     *  (2) Start the scan for a duration of 10 seconds x
     *  (3) Search and memorize devices that have the Battery Level Service
     *  (4) Correctly handle possible exceptions
     */
    startScan() {
        /// code expected
        if (!this.state.scanning) {
              this.setState({peripherals: new Map()});
              BleManager.scan([], 10, true).then((results) => {
                console.log('Scanning...');
                this.setState({scanning:true});
              });
        }
        console.log("Bluetooth: Start scan not implemented");

    }

    /**
     * TODO: (3 pts)
     *
     *  (1) Check to see if the new peripheral already exists in peripherals x
     *  (2) If it doesn't exist then add the new peripheral to the peripherals Map object x
     *  (3) Update the state with peripherals x
     *
     * @param peripheral
     */
    handleDiscoverPeripheral(peripheral){
        /// code expected
        peripherals: new Map()
        if (!peripherals.has(peripheral.id)){
          peripherals.set(peripheral.id, peripheral);
          this.setState({ peripherals })
        }
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
     *  (1) Connect to the device x
     *  (2) Retrieve services and characteristics x
     *  (3) Return data from (2) x
     *  (4) Correctly handle possible exceptions x
     *
     * @param id
     * @returns {Promise<"react-native-ble-manager".PeripheralInfo>}
     */
    async connect(id){
      if (peripheral.connected){
        BleManager.disconnect(peripheral.id);
      }else{
        BleManager.connect(peripheral.id).then(() => {
          let peripherals = this.state.peripherals;
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            this.setState({peripherals});
            }
            BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
              console.log(peripheralInfo);
              const service = '13333333-3333-3333-3333-333333333337';
              const bakeCharacteristic = '13333333-3333-3333-3333-333333330003';
              const crustCharacteristic = '13333333-3333-3333-3333-333333330001';

            setTimeout(() => {
              BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(() => {
                console.log('Started notification on ' + peripheral.id);
                setTimeout(() => {
                  BleManager.write(peripheral.id, service, crustCharacteristic, [0]).then(() => {
                  BleManager.write(peripheral.id, service, bakeCharacteristic, [1,95]).then(() => {
                    });
                  });
                }, 1000);
              });
            },  500);
          });
        }).catch((error) => {
        throw new Error("Bluetooth: error on connecting device");
      });
    }
  }

    /**
     *
     * Method that disconnects from a device with a given identifier
     *
     * TODO: (3 pts)
     *  (1) Disconnect from device x
     *  (2) Remove peripheral (hint: Check BleManager source code) x
     *  (3) Correctly handle possible exceptions x
     *
     * @param id
     * @returns {Promise<void>}
     */
    async disconnect(id, force=true){
      if (peripheral.connected){
        BleManager.disconnect(peripheral.id, force, (error) => {
          if (error) {
            throw new Error("Bluetooth: disconnect from device not implemented")
          } else {
            fulfill();
          }
        });
      }

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
