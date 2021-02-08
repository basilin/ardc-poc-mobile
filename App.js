import React, { Component } from 'react';
import { FlatList, PermissionsAndroid, Platform, Button, Text, View } from 'react-native';
import {
  BleManager,
  BleError,
  Device,
  State,
  LogLevel,
} from 'react-native-ble-plx';

class App extends Component {
  state = {
    devices: []
  };
  bleManager = new BleManager();
  selectedDevice = null;
  deviceList = [];
  constructor() {
    super();
    this.checkPermissions();
  }

  setupBluetooth() {
    this.scanBluetooth();
  }

  scanBluetooth() {
    this.bleManager.startDeviceScan(null, null, (err, device) => {
      if (err) console.log(err);
      else {
        if (device) {
          console.log(device.name, device.id);
          this.selectedDevice = device;
          var hasItem = this.deviceList.filter(x=>x.id != device.id)
          this.deviceList.push(device);
        }
      }
    });
  }

  connectBluetooth() {
    if (this.selectedDevice) {
      this.selectedDevice.connect()
        .then(x => {
          return x.discoverAllServicesAndCharacteristics()
        })
        .then(x => {
          console.log(x);
        })
    }
  }

  stopScan() {
    this.bleManager.stopDeviceScan();
    this.deviceList = [...new Map(this.deviceList.map(item => [item['id'], item])).values()]
    this.setState({
      devices: this.deviceList
    });
    console.log(this.state);
  }

  checkPermissions() {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(hasPermission => {
      if (!hasPermission) {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(status => {
        });
      }
    });
  }

  render() {
    return (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Text>Hello, world!</Text>
        <Button
          onPress={() => {
            this.setupBluetooth()
          }}
          title="Start Scan"
        />
        <Button
          onPress={() => {
            this.stopScan()
          }}
          title="Stop Scan"
        />
        <Button
          onPress={() => {
            this.connectBluetooth()
          }}
          title="Connect"
        />
        <FlatList data={this.state.devices} renderItem={({item})=><Text>{item.name}:{item.id}</Text>} />
      </View>
    );
  }
}

export default App;