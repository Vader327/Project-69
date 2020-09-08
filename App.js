import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';

export default class App extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermisson: null,
            scanned: false,
            scannedData: "",
            buttonState: "normal",
            pressed: false,
        }
    }

    getCameraPermission=async()=>{
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({scanned: false, buttonState: "clicked", hasCameraPermisson: status === "granted"})
    }

    handleScanned=async({type, data})=>{
        this.setState({
            scanned: true,
            scannedData: data,
            buttonState: "normal",
        })
    }

    render(){
        const hasCameraPermisson = this.state.hasCameraPermisson;

        if(this.state.buttonState == "clicked" && hasCameraPermisson){
            return(
                <BarCodeScanner onBarCodeScanned={this.state.scanned ? undefined : this.handleScanned}
                style={StyleSheet.absoluteFillObject}>
                    <View style={styles.scanTextBg}><Text style={styles.scanText}>Find a Code to Scan</Text></View>
                </BarCodeScanner>                  
            )
        }
        else if(this.state.buttonState == "normal"){
            return(
                <View>
                    <StatusBar style="dark" />
                    <Text style={{alignSelf: 'center', marginTop: 30, fontSize: 28, fontWeight: '600',}}>Barcode Scanner</Text>
                    <Image source={require("./assets/scanner.jpg")} style={styles.img} />
                    
                    <TouchableHighlight style={styles.openScanner} onPress={this.getCameraPermission} 
                    underlayColor="#1a82f8" activeOpacity={1} onShowUnderlay={()=>{this.setState({pressed:true})}}
                    onHideUnderlay={()=>{this.setState({pressed:false})}} >
                        <Text style={this.state.pressed==false
                        ? styles.buttonText
                        : [styles.buttonText, {color: 'white'}]
                    }>Scan QR Code</Text>
                    </TouchableHighlight>

                    <Text style={{alignSelf: 'center', marginTop: 20, fontSize: 18, fontWeight: '600',}}>
                        {hasCameraPermisson
                        ? this.state.scannedData
                        : "Please allow camera permission"}
                    </Text>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    openScanner:{
        borderColor: '#1a82f8',
        borderWidth: 3,
        width: 200,
        height: 40,
        alignSelf: 'center',
        marginTop: 60,
        justifyContent: 'center',
        borderRadius: 20,
    },
    buttonText:{
        fontSize: 20,
        fontWeight: '600',
        color: '#1a82f8',
        alignSelf:'center',
    },
    img:{
      marginTop: 20,
      alignSelf: 'center',
    },
    scanTextBg:{
        position: "absolute",
        alignSelf: 'center',
        bottom: 40,
        backgroundColor: 'white',
        borderRadius: 13,
        width: 200,
        height: 40,
        justifyContent: 'center'
    },
    scanText:{
        alignSelf: 'center',
        fontWeight: '600',
        fontSize: 15,
    }
})