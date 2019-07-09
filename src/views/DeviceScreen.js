import React, {Component} from "react";
import {Container, Content} from "native-base";
import Device from "../components/smart/Device";

class DeviceScreen extends Component {

    static navigationOptions = {
        title: "Device      "
    };

    render(){

        const {navigation} = this.props;
        const id = navigation.getParam("id");

        return <Container>
            <Content>
                <Device id={id}/>
            </Content>
        </Container>
    }
}

export default DeviceScreen;