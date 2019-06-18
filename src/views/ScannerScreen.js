import React, {Component} from "react";
import {Container, Content} from "native-base";
import Scanner from "../components/smart/Scanner";

class ScannerScreen extends Component {

    static navigationOptions = {
        title: "Scanner"
    };

    onDeviceSelected(id){
        const {navigation} = this.props;
        navigation.navigate("Device", { id })
    }

    render(){
        return <Container>
            <Content>
                <Scanner onSelect={(id)=>this.onDeviceSelected(id)}/>
            </Content>
        </Container>
    }
}

export default ScannerScreen;