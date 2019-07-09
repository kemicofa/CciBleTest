import React, { Component } from "react";
import { Container, Content } from "native-base";
import Favorites from "../components/smart/Favorites";

class FavoriteScreen extends Component {

    static navigationOptions = {
        title: "Favorites      ",
    };

    constructor(props) {
        super(props);
    }

    render() {
        return <Container>
            <Content>
                <Favorites/>
            </Content>
        </Container>
    }
}

export default FavoriteScreen;