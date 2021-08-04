import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Button,
  Image,
  Dimensions,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: '',
      lon: '',
      uri: '',
      weatherName: '',
      aqi: '',
      locdata: '',
      weatherData:''
    };
  }
  componentDidMount() {
    this.findCoordinates();
  }
  findCoordinates = async () => {
    await Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        this.setState({
          lat: currentLatitude,
          lon: currentLongitude,
          uri:
            'https://api.nasa.gov/planetary/earth/imagery?lon=' +
            currentLongitude +
            '&lat=' +
            currentLatitude +
            '&api_key=bAJiGVQjcc7zfp0WthmVLD5gYLyBcX8IADei5LcM',
        });
        //console.log(this.state.uri);
        this.initialiseAPIS();
      },
      (error) => {
        alert('Internal Error: ' + error.message);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };
  initialiseAPIS = () => {
    var uri = '';
    axios
      .get(
        'https://api.openweathermap.org/geo/1.0/reverse?lat=' +
          this.state.lat.toString() +
          '&lon=' +
          this.state.lon.toString() +
          '&appid=3c91f2ad78ccc17451c13dd68f107148'
      )
      .then((data) => {
        uri =
          'https://api.openweathermap.org/data/2.5/weather?q=' +
          data.data[0].name +
          '&appid=3c91f2ad78ccc17451c13dd68f107148';
        //console.log(url);
        this.setState({ locdata: data.data[0] });
        axios
          .get(uri)
          .then((data) => {
            this.setState({ weatherName: data.data.weather[0] });
            this.setState({ weatherData: data.data.main});
          })
          .catch((error) => console.log(error.message));
          axios.get('https://api.weatherbit.io/v2.0/current/airquality?lat='+this.state.lat.toString()+'&lon='+this.state.lon.toString()+'&key='+'978a4a3ab08b41e3a738c596d2303a3b') 
      .then((data) => {
        this.setState({aqi:data.data.data[0].aqi });
        //console.log(data.data.data[0].aqi);
      })
      .catch(error=>alert('error: '+error.message)) 
      })
      .catch((err) => alert('an error occoured:' + err.message));
  };
  render() {
    return (
      <View>
        <ImageBackground
          source={this.state.uri}
          style={{ width: '100%', height: Dimensions.get('window').height }}>
          <Button
            title={
              'Lat: ' +
              this.state.lat.toString() +
              ' Lon: ' +
              this.state.lon.toString() +
              '\n(Click here to refresh details)'
            }
            onPress={() => {
              this.findCoordinates();
              this.initialiseAPIS();
            }}
          />
          <Text style={styles.cityName}>{this.state.locdata.name}</Text>
          <Text style={styles.others}>
            {'Country: ' + this.state.locdata.country}
          </Text>
          <Text style={styles.others}>
            {'AQI: ' + this.state.aqi}
          </Text>
          <Text style={styles.others}>
            {'Weather: ' + this.state.weatherName.description}
          </Text>
          <Text style={styles.others}>
            {'Humidity: ' + this.state.weatherData.humidity}
          </Text>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cityName: {
    alignSelf: 'center',
    fontSize: 20,
    color: '#ffffff',
    marginTop: Dimensions.get('window').height / 2 + 50,
  },
  others: {
    alignSelf: 'center',
    fontSize: 15,
    color: '#ffffff',
  },
});
