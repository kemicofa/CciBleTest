import React, { Component } from "react";
import { Container, Content } from "native-base";
import Scanner from "../components/smart/Scanner";

class ScannerScreen extends Component {

    static navigationOptions = {
        title: "Scanner      ",
    };

    constructor(props) {
        super(props);
    }

    onDeviceSelected(id) {
        const { navigation } = this.props;
        navigation.navigate("Device", { id})
    }

    toFavorites() {
        const { navigation } = this.props;
        navigation.navigate("Favorites")
    }

    render() {
        return <Container>
            <Content>
                <Scanner onSelect={(id) => this.onDeviceSelected(id)} toFavorites={() => this.toFavorites()} />
            </Content>
        </Container>
    }
}

export default ScannerScreen;