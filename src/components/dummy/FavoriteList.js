import {FlatList} from "react-native";
import {Body, Left, ListItem, Text} from "native-base";
import React from "react";

const DeviceList = props => {
    const {data, onPress} = props;
    return <FlatList
        data={data}
        extraData={data}
        keyExtractor={({id})=>''+id}
        ListHeaderComponent={
            <ListItem itemHeader first>
                <Left>
                    <Text>ID</Text>
                </Left>
                <Body>
                    <Text>MAC</Text>
                </Body>
            </ListItem>
        }
        renderItem={({item:{id = "N/A", mac_address = "N/A"}})=>{
            return <ListItem onPress={()=>onPress(id)}>
                <Left>
                    <Text>{id}</Text>
                </Left>
                <Body>
                    <Text>{mac_address || "N/A"}</Text>
                </Body>
            </ListItem>
        }}
    />
};

export default DeviceList;