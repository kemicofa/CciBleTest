import {SectionList} from "react-native";
import {Body, Left, ListItem, Right, Text} from "native-base";
import React from "react";

const ServicesList = props => {
    const {data} = props;
    return <SectionList
        renderItem={({item:{characteristic, properties}, index}) => <ListItem key={index}>
            <Left>
                <Text>Characteristic: {characteristic}</Text>
            </Left>
            <Body>
                <Text>{properties.join(", ")}</Text>
            </Body>
        </ListItem>}
        renderSectionHeader={({section: {service}}) => (
            <ListItem itemHeader>
                <Text>Service: {service}</Text>
            </ListItem>
        )}
        sections={data}
        keyExtractor={({characteristic}, index) => characteristic + index}
    />
};

export default ServicesList;