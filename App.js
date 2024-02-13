import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

const LocationInfo = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [addressInfo, setAddressInfo] = useState(null);
  const[hora, setHora]= useState('');
  const [fecha, setFecha] = useState('');


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addressResponse.length > 0) {
        let address = addressResponse[0];
        setAddressInfo(address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  useEffect(() => {
    if (location) {
      getAddressFromCoordinates(location.coords.latitude, location.coords.longitude);
    }
  }, [location]);

  let content = (
    <Text style={styles.text}>Waiting for location...</Text>
  );

  if (errorMsg) {
    content = (
      <Text style={styles.text}>{errorMsg}</Text>
    );
  } else if (location) {
    content = (
      <View>
        
         <Text style={styles.title}>Su Ubicación</Text>
       
        {addressInfo && (
          <View>
            <Text style={styles.text}>Calle:  {addressInfo.street}</Text>
            <Text style={styles.text}>Número:  {addressInfo.streetNumber}</Text>
            <Text style={styles.text}>Barrio:  {addressInfo.district}</Text>
            <Text style={styles.text}>Comuna:  {addressInfo.subregion}</Text>
            <Text style={styles.text}>Código Postal:  {addressInfo.postalCode}</Text>
            <Text style={styles.text}>Ciudad:  {addressInfo.region}</Text>
            <Text style={styles.text}>País:  {addressInfo.country}</Text>
          </View>
        )}
         <Text style={styles.titulos}>Coordenadas Geográficas</Text>
         <Text style={styles.text}>Latitud: {location.coords.latitude}</Text>
        <Text style={styles.text}>Longitud: {location.coords.longitude}</Text>
        <Text style={styles.titulosHora}>Hora y Fecha Actual</Text>
        <Text style={styles.locationHora}>{hora}</Text>
        <Text style={styles.locationFecha}>{fecha}</Text>
      </View>
    );
  }

  useEffect(()=>{
    const startTime =()=>{
      const today = new Date();
      let hr = today.getHours();
      const min = today.getMinutes();
      const sec = today.getSeconds();
      hr = checkTime(hr);
      const formattedTime = `${hr} :  ${checkTime(min)} :  ${checkTime(sec)}`;
      setHora(formattedTime);
      const formattedDate = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      setFecha(formattedDate);
    
      setTimeout(startTime, 500);
    };

    const checkTime = (i) => {
      if (i < 10) {
        return `0${i}`; 
      }
      return i;
    };

    startTime();
  },[]);

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d8f5d1',
  },
  title: {
    marginBottom: 20,
    marginLeft: 60,
    fontSize: 30,
    color: 'blue',
  },
  titulos:{
    fontSize: 25,
    marginTop: 2,
    marginVertical: 20,
    color: 'blue',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  locationHora:{
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 75,
    color: 'red',
  },
  locationFecha: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 110,
    color: 'red',
  },
  titulosHora: {
    marginLeft: 40,
    fontSize: 25,
    marginTop: 2,
    marginVertical: 20,
    color: 'blue',
  }
  
});

export default LocationInfo;
