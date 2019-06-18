import {FlatList} from "react-native";
import {Body, Left, ListItem, Right, Text} from "native-base";
import React from "react";

const DeviceList = props => {
    const {data, onPress} = props;
    return <FlatList
        data={data}
        extraData={data}
        keyExtractor={({id = null})=>id}
        ListHeaderComponent={
            <ListItem itemHeader first>
                <Left>
                    <Text>ID</Text>
                </Left>
                <Body>
                    <Text>Name</Text>
                </Body>
                <Right>
                    <Text>RSSI</Text>
                </Right>
            </ListItem>
        }
        renderItem={({item:{id = "N/A", name = "N/A", rssi = "N/A"}})=>{
            return <ListItem onPress={()=>onPress(id)}>
                <Left>
                    <Text>{id}</Text>
                </Left>
                <Body>
                    <Text>{name || "N/A"}</Text>
                </Body>
                <Right>
                    <Text>{rssi}</Text>
                </Right>
            </ListItem>
        }}
    />
};

export default DeviceList;