/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  PermissionsAndroid,
  TouchableOpacity
} from 'react-native'
import { RNCamera } from 'react-native-camera'
import TopBarCommon from './src/components/TopBarCommon'
import LButton from './src/components/LButton'
import { BleManager } from 'react-native-ble-plx';

const { width } = Dimensions.get('window');
const serviceID = '6D:55:44:33:22:11';
// const serviceID = '0C:F3:EE:3A:0C:DC';
const mainServiceUUID = '0000fff0-0000-1000-8000-00805f9b34fb';
// const mainServiceUUID = '21a54000-4c86-11e2-bcfd-0800200c9a66';
const mainCharacteridticUUID = '21a54001-4c86-bcfd-0800200c9a66';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hint: [
        '手机蓝牙未开启,请开启后重试',
        '身份核验中...',
        '正在开锁...'
      ],
      devices: new Map(),
      isOpenLock: false,
    };

    this.manager = new BleManager();
    this.subscription = null;
  }
  async takePicture() {
    try {
      return await this.camera.takePictureAsync();
    } catch (err) {
      // console.log('err: ', err);
    }
  };

  render() {
    const {hint} = this.state;
    return (
      <View style={styles.container}>
        <TopBarCommon
          renderLeft={() => this._renderLeftItem()}
          renderTitle={() => this._renderTitleItem()}
        />
        <View style={styles.info}>
          <View style={styles.infoLine}>
            <View style={styles.infoLineLeft}>
              <Text style={[styles.infoTxt, styles.infoLineLeftTitle]}>房屋信息</Text>
            </View>
            <View style={styles.infoLineRight}>
              <Text style={[styles.infoTxt, styles.infoLineRightTitle]}>钱江世纪公寓2-2-103</Text>
              <Image
                style={{ width: 15, marginStart: 8 }}
                resizeMode='contain'
                source={require('./src/assets/images/icon_true_circle.png')}
              />
            </View>
          </View>

          <View style={styles.infoLine}>
            <View style={styles.infoLineLeft}>
              <Text style={[styles.infoTxt, styles.infoLineLeftTitle]}>门锁信息</Text>
            </View>
            <View style={styles.infoLineRight}>
              <Text style={[styles.infoTxt, styles.infoLineRightTitle]}>LS-L1001</Text>
              <Image
                style={{ width: 15, marginStart: 8 }}
                resizeMode='contain'
                source={require('./src/assets/images/icon_true_circle.png')}
              />
            </View>
          </View>

          <View style={styles.infoLine}>
            <View style={styles.infoLineLeft}>
              <Text style={[styles.infoTxt, styles.infoLineLeftTitle]}>用户信息</Text>
            </View>
            <View style={styles.infoLineRight}>
              <Text style={[styles.infoTxt, styles.infoLineRightTitle]}>花开不败</Text>
              <Image
                style={{ width: 15, marginStart: 8 }}
                resizeMode='contain'
                source={require('./src/assets/images/icon_true_circle.png')}
              />
            </View>
          </View>
        </View>

        <View style={styles.cameraWrap}>
          <RNCamera
            ref={cam => {
              this.camera = cam;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.front}
            androidCameraPermissionOptions={{
              title: '相机授权',
              message: '需要授权使用相机',
              buttonPositive: '授权',
              buttonNegative: '拒绝',
            }}
          />
        </View>

        <View style={styles.tip}>
          <Text style={{ color: '#333' }}>请把正脸放在圆圈里</Text>
          <Text style={{ color: '#333' }}>同时开启手机和只能门锁蓝牙</Text>
        </View>

        <LButton
          title='刷脸开锁'
          width='80%'
          marginLeft={0.1 * width}
          pressFun={() => this.startOpenLock()}
        />

        <View style={styles.hint}>
          {hint.map((item, index) => <Text key={index} style={styles.hintTxt}>{item}</Text>)}
        </View>
      </View>
    )
  }

  componentDidMount(): void {
    this.subscription = this.manager.onStateChange((state) => {
      if(state === 'PoweredOn') {
        console.log('可以开启扫描了');
        this.requestBluetoothPermission().then(data => {
          this.scanningDevices()
        });
      }
    });
    // this.connectSubscription = this.manager.onDeviceDisconnected()
    this._checkBluetoothStatus().then(flag => {
      console.log(flag);
      if(flag) {
        console.log('蓝牙已经在打开状态');
        this.requestBluetoothPermission().then(data => {
          this.scanningDevices()
        });
      }else {
        console.log('蓝牙处于关闭');
        this.requestOpenBluetooth();
      }
    });
  }

  componentWillUnmount() {
    if(this.subscription) {
      this.subscription.remove();
    }
  }

  _renderLeftItem() {
    return <Image
      style={{ height: 18 }}
      resizeMode='contain'
      source={require('./src/assets/images/back.png')}
    />;
  }

  _renderTitleItem() {
    return <Text>刷脸开锁</Text>;
  }

  _initBluetooth() {
    this._checkBluetoothStatus().then(flag => {
      if(!flag) this.requestOpenBluetooth()
    })
  }

  // 申请蓝牙授权
  async requestBluetoothPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: '获取位置权限',
          message: '该功能需要位置权限，否则功能不可用',
          buttonNeutral: '稍后询问',
          buttonNegative: '拒绝',
          buttonPositive: '同意'
        });
      if(granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('同意授权');
        return true
      }
      console.log(granted);
      return false
    } catch (e) {
      console.log('拒绝授权');
      // TODO 返回上一级页面
      console.log(e);
    }
  }

  // 检测蓝牙是否打开
  async _checkBluetoothStatus() {
    const state = await this.manager.state();
    return state === 'PoweredOn'
  }

  // 请求打开蓝牙
  requestOpenBluetooth() {
    this.manager.enable().then(data=> {
      console.log('蓝牙已打开');
      console.log(data);
    }).catch(err => {
      alert('未打开蓝牙，无法使用该功能')
    });

  }

  // 开始扫描设别
  scanningDevices() {
    this.manager.startDeviceScan(null, null, (err, device) => {
      if(err) {
        alert('扫描设备错误');
        console.log(err);
        return;
      }
      // console.log(device.id);
      this.setState(state => {
        const devices = new Map(state.devices);
        if(!devices.has(device.id)) {
          // console.log('添加设备', device.id);
          // console.log('当前扫描的的设备', devices);
          devices.set(device.id, device);
        }
        return {devices}
      }, () => {
        // 当扫描的时候已经开始开锁
        if(this.state.isOpenLock && device.id === serviceID) {
          // 开始连接蓝牙
          this.startConnect();
        }
      })
    })
  }

  // 开始开锁
  async startOpenLock() {
    const {devices} = this.state;
    const picture = await this.takePicture();
    this.setState({
      isOpenLock: true
    });
    console.log(picture);
    console.log(devices);
    // 检测是否扫描到门锁蓝牙 6C:55:44:33:22:11
    if(devices.has(serviceID)) {
      // 检测是否已经连接
      const device = devices.get(serviceID);
      const isConnected = device.isConnected();
      if(isConnected) {
        console.log('设备已经连接');
      }else {
        this.startConnect();
      }

    }else {
      console.log('未扫描到蓝牙');
    }
  }

  // 开始连接
  async startConnect() {
    console.log('进入连接状态');
    const { devices } = this.state;
    let lockBluetooth = null;
    this.manager.stopDeviceScan();
    // 开始连接
    lockBluetooth = devices.get(serviceID);

    let connectedDevice = await this.manager.connectToDevice(lockBluetooth['id'], {autoConnect: true, refreshGatt: true});

    let connectedDevicesAllCharacteristics = await connectedDevice.discoverAllServicesAndCharacteristics();
    console.log('特征', connectedDevicesAllCharacteristics);
    let services = await connectedDevicesAllCharacteristics.services();
    for(const service of services) {
      const serviceUUID = service.uuid;
      if(serviceUUID === mainServiceUUID) {
        const characteristics = await service.characteristics();
        console.log(characteristics);
        for(const characteristic of characteristics) {
          const characteristicUUID = characteristic.uuid;
          console.log(characteristicUUID);
        }

      }
    }
    console.log(123456);
    console.log('设备', services);
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  txt: {
    fontSize: 20,
    color: "red",
    fontWeight: 'bold'
  },
  cameraWrap: {
    alignItems: 'center',
    height: 0.6 * width,
  },
  preview: {
    width: 0.5 * width,
    height: 0.5 * width,
    borderWidth: 0.5,
    borderColor: '#e8e8e8',
    borderRadius: 0.5 * width,
    overflow: 'hidden'
  },
  captureContainer: {
    width: 0.75 * width,
    height: 0.75 * width,
    borderRadius: 100,
  },
  capture: {
    height: 45,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    width: 0.8 * width,
    marginLeft: 0.1 * width,
    marginTop: 15,
  },
  infoLine: {
    marginBottom: 6,
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#666'
  },
  infoTxt: {
    color: '#666',
  },
  infoLineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLineRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tip: {
    marginBottom: 15,
    alignItems: 'center'
  },
  hint: {
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 0.15 * width,
  },
  hintTxt: {
    color: 'green'
  }

});

export default App;
