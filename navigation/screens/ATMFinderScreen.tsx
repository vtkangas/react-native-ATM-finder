import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { FAB, ActivityIndicator } from 'react-native-paper';
import * as Location from 'expo-location';
import { LocationObject, PermissionResponse } from 'expo-location';
import automaatit, {Automaatti} from '../../models/automaatit';

interface ATMInfo {
  streetAddress : string,
  postalCode : string,
  city : string,
  distance : number
}

const ATMFinderScreen: React.FC = () : React.ReactElement => {
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");
  const [nearestATM, setNearestATM] = useState<ATMInfo | undefined>(undefined)

  const findNearestATM = async () : Promise<void> => {

    setInfo("Haetaan sijaintia...")

    const locationPermission : PermissionResponse = await Location.requestForegroundPermissionsAsync();
    
    if (locationPermission.status !== 'granted') {
      setInfo("");
      setError("Ei lupaa sijaintitietoihin");
    } else {
      setError("");
      setInfo("Etsitään lähintä automaattia...");
    }

    let location : LocationObject = await Location.getCurrentPositionAsync({});

    let nearestATM : ATMInfo | undefined = automaatit.map((atm : Automaatti) => {
      return {
        streetAddress : atm.katuosoite,
        postalCode : atm.postinumero,
        city : atm.postitoimipaikka,
        distance : calcCoordsDistance(location.coords.latitude, location.coords.longitude, atm.koordinaatti_LAT, atm.koordinaatti_LON)
      }
    }).reduce((prev, current) => { return (prev.distance < current.distance) ? prev : current });

    setNearestATM(nearestATM);
   
    setInfo("");

  }

  const degreesToRadians = (degrees: number) => {

    var radians = (degrees * Math.PI)/180;

    return radians;

  }

  const calcCoordsDistance = (lat1:number, lon1:number, lat2:number, lon2:number) =>  {

      const startingLat = degreesToRadians(lat1);
      const startingLong = degreesToRadians(lon1);
      const destinationLat = degreesToRadians(lat2);
      const destinationLong = degreesToRadians(lon2);

      // Radius of the Earth in kilometers
      const radius: number = 6371;

      // Haversine equation
      const distanceInKilometers: number = Math.acos(Math.sin(startingLat) * Math.sin(destinationLat) +

      Math.cos(startingLat) * Math.cos(destinationLat) *
      Math.cos(startingLong - destinationLong)) * radius;

      return Math.floor(distanceInKilometers * 100) / 100;

  }

  return (
    (nearestATM)
    ? <>
        <View style={styles.container}>
          <Text style={styles.header}>Lähin Otto-automaatti</Text>
          
          <Text style={{marginBottom: 3}}>Katuosoite: {nearestATM.streetAddress}</Text>
          <Text style={{marginBottom: 3}}>Postinumero: {nearestATM.postalCode}</Text>
          <Text style={{marginBottom: 3}}>Postitoimipaikka: {nearestATM.city}</Text>
          <Text style={{marginBottom: 3}}>Etäisyys: {nearestATM.distance} km</Text>
                  
        </View>
        <Button 
            title='Etsi uudelleen' 
            onPress={ () => { setNearestATM(undefined), findNearestATM() } } 
        />
      </>
    : <View style={styles.container}>

        {(Boolean(!info))
          ? <FAB 
              style={styles.launchButton}
              icon='magnify'
              label='Etsi lähin automaatti' 
              onPress={ () => findNearestATM()} 
            />
          : <>
              <ActivityIndicator size='small'/>
              <Text style={styles.info}>{info}</Text>
            </>
            
        }    

        {(Boolean(error))
            ? <Text style={styles.error}>{error}</Text>
            : null
        }

    </View>

  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      marginBottom: 13,
      fontWeight: 'bold'
    },
    info: {
      marginTop: 12,
      fontWeight: 'bold'
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

export default ATMFinderScreen;