import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { FAB } from 'react-native-paper';
import { BarCodeScanner, PermissionResponse } from 'expo-barcode-scanner';
import { WebView } from 'react-native-webview';

interface ScannerInfo {
  scannerOn : boolean
  error : string
  scanData : string | undefined
}

const QRBrowserScreen: React.FC = () : React.ReactElement => {
    const [scannerInfo, setScannerInfo] = useState<ScannerInfo>({
                                                                  scannerOn : false,
                                                                  error : "",
                                                                  scanData : undefined
                                                                });
  
    const startScanner = async () : Promise<void> => {

      const scannerPermission : PermissionResponse = await BarCodeScanner.requestPermissionsAsync();

      console.log(`Status: ${scannerPermission.status}, Granted: ${scannerPermission.granted}`);

      setScannerInfo({
        ...scannerInfo,
        scannerOn : scannerPermission.granted,
        error : (!scannerPermission.granted) ? "Ei lupaa kameran käyttöön" : ""
      })

    }

    return (
        (scannerInfo.scanData)
        ?   <>
              <WebView
                  style={styles.container}
                  source={{ uri: scannerInfo.scanData }}
              />
              <Button 
                title={'Skannaa uudelleen'} 
                onPress={() => setScannerInfo({
                                                ...scannerInfo,
                                                scanData: undefined
                                              })
                } 
              />
            </>
        :   (scannerInfo.scannerOn)
              ? <BarCodeScanner
                  onBarCodeScanned={({ data }) => {
                    try {
                        (data.startsWith('https://') || data.startsWith('http://'))
                          ? setScannerInfo({
                                              ...scannerInfo,
                                              scanData: data,
                                              error: ""
                                            })
                          : setScannerInfo({
                                              ...scannerInfo,
                                              error: `Osoitetta ${data} ei voida avata`
                                            })
                          
                    } catch (error) {
                        console.error(error);
                    }
                }}
                  style={styles.container}
                >
                  {(Boolean(scannerInfo.error))
                    ? <Text style={styles.error}>{scannerInfo.error}</Text>
                    : null
                  }
                </BarCodeScanner>
              : <View style={styles.container}>

                <FAB 
                  style={styles.launchButton}
                  icon='qrcode-scan'
                  label='Skannaa QR-koodi' 
                  onPress={startScanner} 
                />

                {(Boolean(scannerInfo.error))
                    ? <Text style={styles.error}>{scannerInfo.error}</Text>
                    : null
                }

                </View>
    );
  }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    error: {
      color: 'red',
      marginBottom: 100
    },
    launchButton: {
      position: 'absolute',
      margin: 'auto'
    }
});

export default QRBrowserScreen;