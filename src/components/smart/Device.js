import React, { Component } from "react";
import { withBluetooth } from "./Bluetooth";
import { Button, Text, View } from "native-base";
import { StyleSheet, Alert } from "react-native";
import ServicesList from "../dummy/ServicesList";
import Realm from "realm";

const styles = StyleSheet.create({
    error: {
        color: "red",
        textAlign: "center"
    }
});


class Device extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errorMessage: "",
            services: []
        };
        realm = new Realm({
            path: 'MacAddressDB.realm'
        });
    }

    componentDidMount() {
        const { id, connect } = this.props;
        connect(id)
            .then(data => this.handleServicesAndCharacteristics(data))
            .catch(err => this.setState({ errorMessage: err }));
    }

    handleServicesAndCharacteristics({ characteristics }) {
        const services = Array.from(characteristics.reduce((a, { properties, characteristic, service }) => {
            return a.set(service, (a.get(service) || []).concat({ characteristic, properties: Object.keys(properties) }));
        }, new Map())
            .entries())
            .map(([service, data]) => ({ service, data }));
        this.setState({ services });
    }

    handleCheckBatteryLevel() {
        const { readBattery, id } = this.props;
        readBattery(id)
            .then(percentage => Alert.alert(`Battery ${percentage} %`))
            .catch(err => this.setState({ errorMessage: err }))
    }

    putIntoFavorite() {
        const { id } = this.props;
        const { onDatabaseUpdate } = this.props;

        realm.write(() => {
            var ID = realm.objects('favorite_macs').sorted('id', true).length > 0
                ? realm.objects('favorite_macs').sorted('id', true)[0]
                    .id + 1
                : 1;

            const device = {
                id: ID,
                mac_address: id
            }
            
            realm.create('favorite_macs', device);
        });

    }

    componentWillUnmount() {
        const { disconnect, id } = this.props;
        disconnect(id)
            .catch(err => console.log(err));
    }

    render() {
        const { errorMessage, services } = this.state;
        const { id } = this.props;
        console.log(services);
        return <View>
            <Text style={styles.error}>{errorMessage}</Text>
            <Text>{id}</Text>
            <Button full primary style={{margin:8}} onPress={() => this.handleCheckBatteryLevel()}>
                <Text>Check Battery Level</Text>
            </Button>
            <Button full primary style={{margin:8}} onPress={() => this.putIntoFavorite()}>
                <Text>Put Into Favorite</Text>
            </Button>
            <ServicesList data={services} />
        </View>
    }
}

export default withBluetooth(Device);