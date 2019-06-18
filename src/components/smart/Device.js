import React, {Component} from "react";
import {withBluetooth} from "./Bluetooth";
import {Button, Text, View} from "native-base";
import {StyleSheet, Alert} from "react-native";
import ServicesList from "../dummy/ServicesList";

const styles = StyleSheet.create({
    error: {
        color: "red",
        textAlign: "center"
    }
});

class Device extends Component {

    constructor(props){
        super(props);

        this.state = {
            errorMessage: "",
            services: []
        }
    }

    /**
     * On Mount, Connect to Device and Fetch Services
     */
    componentDidMount(){
        const {id, connect} = this.props;
        connect(id)
            .then(data=>this.handleServicesAndCharacteristics(data))
            .catch(err=>this.setState({errorMessage: err}));
    }

    /**
     * Transform A List of Characteristics into something more human readable
     * @param characteristics
     */
    handleServicesAndCharacteristics({characteristics}){
        const services = Array.from(characteristics.reduce((a, {properties, characteristic, service})=>{
            return a.set(service, (a.get(service) || []).concat({characteristic, properties: Object.keys(properties)}));
        }, new Map())
            .entries())
            .map(([service, data])=>({service, data}));
        this.setState({services});
    }

    /**
     * Method that initiates a read on the battery level
     * Alerts the final outcome
     */
    handleCheckBatteryLevel(){
        const {readBattery, id} = this.props;
        readBattery(id)
            .then(percentage=>Alert.alert(`Battery ${percentage} %`))
            .catch(err=>this.setState({errorMessage: err}))
    }

    /**
     * On Unmount, disconnect from device
     */
    componentWillUnmount(){
        const {disconnect, id} = this.props;
        disconnect(id)
            .catch(err=>console.log(err));
    }

    render(){
        const {errorMessage, services} = this.state;
        console.log(services);
        return <View>
            <Text style={styles.error}>{errorMessage}</Text>
            <Button full primary onPress={()=>this.handleCheckBatteryLevel()}>
                <Text>Check Battery Level</Text>
            </Button>
            <ServicesList data={services}/>
        </View>
    }
}

export default withBluetooth(Device);