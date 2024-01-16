import React, { useState, useEffect } from 'react';
import { BottomNavigation } from 'react-native-paper';

//screens
import QRBrowserScreen from './screens/QRBrowserScreen';
import ATMFinderScreen from './screens/ATMFinderScreen';

//screen routes
const QRBrowserRoute = () => <QRBrowserScreen />;
const ATMFinderRoute = () => <ATMFinderScreen />;

interface IRoute {
    key : string 
    title : string 
    focusedIcon : string 
    unfocusedIcon : string
}

const MainContainer: React.FC = () : React.ReactElement => {

    const [index, setIndex] = useState<number>(0);
    const [routes] = useState<IRoute[]>([
      { key: 'QRScanner', title: 'QR-selain', focusedIcon: 'qrcode-scan', unfocusedIcon: 'qrcode'},
      { key: 'ATMFinder', title: 'Lähin Otto-automaatti', focusedIcon: 'piggy-bank', unfocusedIcon: 'piggy-bank-outline' },
    ]);
  
    const renderScene = BottomNavigation.SceneMap({
      QRScanner: QRBrowserRoute,
      ATMFinder: ATMFinderRoute,
    });
  
    return (
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    );
  };

export default MainContainer;