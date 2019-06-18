import {createAppContainer, createStackNavigator} from "react-navigation";
import DeviceScreen from "./views/DeviceScreen";
import ScannerScreen from "./views/ScannerScreen";


const bleStackNavigator = createStackNavigator({
    Device: DeviceScreen,
    Scanner: ScannerScreen
}, {
    initialRouteName: "Scanner"
});

export default createAppContainer(bleStackNavigator);