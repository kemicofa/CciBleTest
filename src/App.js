import React, {Component} from 'react';
import AppContainer from "./config";
import Bluetooth from "./components/smart/Bluetooth";

type Props = {};
export default class App extends Component<Props> {
  render() {
    return <Bluetooth>
        <AppContainer/>
    </Bluetooth>;
  }
}
