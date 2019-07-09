import {createAppContainer, createStackNavigator} from "react-navigation";
import DeviceScreen from "./views/DeviceScreen";
import ScannerScreen from "./views/ScannerScreen";
import FavoriteScreen from "./views/FavoriteScreen";


const bleStackNavigator = createStackNavigator({
    Device: DeviceScreen,
    Scanner: ScannerScreen,
    Favorites: FavoriteScreen
}, {
    initialRouteName: "Scanner"
});

export default createAppContainer(bleStackNavigator);