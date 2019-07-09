import React, { Component } from "react";
import { View } from "native-base";
import FavoriteList from "../dummy/FavoriteList";
import Realm from "realm";

class Scanner extends Component {

    constructor(props) {
        super(props);
        realm = new Realm({
            path: 'MacAddressDB.realm',
            schema: [
                {
                    name: 'favorite_macs',
                    properties: {
                        id: { type: 'int', default: 0 },
                        mac_address: 'string'
                    },
                },
            ]
        });
    }

    render() {
        const favorites = Array.from(realm.objects('favorite_macs').values())

        return <View>
            <FavoriteList
                data={favorites}
                onPress={(id) => {
                    console.log("Pressed a Fav")
                    realm.write(() => {
                        if (
                            realm.objects('favorite_macs').filtered('id =' + id)
                                .length > 0
                        ) {
                            realm.delete(
                                realm.objects('favorite_macs').filtered('id =' + id)
                            );
                        }
                    })
                    this.setState({forceRefresh : ''})
                }}
            />

        </View>
    }

}

export default Scanner;