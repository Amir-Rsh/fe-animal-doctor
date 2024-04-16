import RNPickerSelect from "react-native-picker-select";
import axios from "axios";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useEffect, useState } from "react";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { useNavigation } from "@react-navigation/native";

export default function Report() {
  const [reportSubmited, setReportSubmited] = useState(false);
  const navigation = useNavigation();
  const [mapActive, setMapActive] = useState(false);
  const [initialRegion, setInitialRegion] = useState(null);
  const [locationSelected, setLocationSelected] = useState(false);
  const [locationReceived, setLocationReceived] = useState(false);
  const [details, setDetails] = useState({});
  const [submitError, setSubmitError] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await getCurrentPositionAsync({});
      const { coords } = location;
      setInitialRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);
  const handleMarkerDrag = (event) => {
    const { coordinate } = event.nativeEvent;
    setLocationSelected(true);
    setDetails((currentDetails) => {
      const newDetails = { ...currentDetails };
      newDetails.location = coordinate;
      return newDetails;
    });
  };
  function handleSubmit() {
    if (
      details.name &&
      details.email &&
      details.location &&
      details.animal &&
      details.injury
    ) {
      setSubmitError(false);
      setLocationReceived(false);
      setReportSubmited(true);
      axios
        .post("https://be-animal-rescue.onrender.com/rescues", {
          name: details.name,
          injury: details.injury,
          animal: details.animal,
          email: details.email,
          number: details.number,
          location: details.location,
        })
        .then(() => {
          setDetails({});
        });
    } else {
      setSubmitError(true);
    }
  }
  return (
    <>
      <KeyboardAvoidingView style={styles.container}>
        <ImageBackground
          source={require("../teddy-teddy-bear-association-ill-42230.jpeg")}
          style={styles.backgroundImage}
          imageStyle={{ opacity: 0.3 }}
        >
          {!reportSubmited ? (
            <View style={styles.container}>
              <Text style={styles.text}>Full name</Text>
              <TextInput
                id="name"
                style={styles.input}
                placeholder="e.g. John Doe"
                placeholderTextColor="grey"
                onChangeText={(input) => {
                  setDetails((currentDetails) => {
                    const newDetails = { ...currentDetails };
                    newDetails.name = input;
                    return newDetails;
                  });
                }}
              ></TextInput>
              <Text style={styles.text2}> Email address</Text>

              <TextInput
                id="email"
                style={styles.input}
                placeholder="e.g. John@Doe.com"
                placeholderTextColor="grey"
                onChangeText={(input) => {
                  setDetails((currentDetails) => {
                    const newDetails = { ...currentDetails };
                    newDetails.email = input;
                    return newDetails;
                  });
                }}
              />
              <Text style={styles.text2}> Contact number {"(optional)"}</Text>

              <TextInput
                id="number"
                style={styles.input}
                placeholder="e.g. +44 20 7123 4567"
                keyboardType="phone-pad"
                placeholderTextColor="grey"
                onChangeText={(input) => {
                  setDetails((currentDetails) => {
                    const newDetails = { ...currentDetails };
                    newDetails.number = input;
                    return newDetails;
                  });
                }}
              />
              <Text style={styles.text3}>Type of injury</Text>

              <View
                style={{
                  width: 250,
                  backgroundColor: "sandybrown",
                  borderRadius: 10,
                }}
              >
                <RNPickerSelect
                  onValueChange={(value) => {
                    setDetails((currentDetails) => {
                      const newDetails = { ...currentDetails };
                      newDetails.injury = value;
                      return newDetails;
                    });
                  }}
                  items={[
                    {
                      label: "Minor: impaired movement",
                      value: "Minor",
                    },
                    { label: "Major: visible bleeding", value: "Major" },
                    {
                      label: "Severe: immobile or severe bleeding",
                      value: "Severe",
                    },
                  ]}
                />
              </View>
              <Text style={styles.text4}>Type of animal</Text>

              <View
                style={{
                  width: 250,
                  backgroundColor: "sandybrown",
                  borderRadius: 10,
                }}
              >
                <RNPickerSelect
                  onValueChange={(value) => {
                    setDetails((currentDetails) => {
                      const newDetails = { ...currentDetails };
                      newDetails.animal = value;
                      return newDetails;
                    });
                  }}
                  items={[
                    { label: "Mammal", value: "Mammal" },
                    { label: "Reptile", value: "Reptile" },
                    { label: "Bird", value: "Bird" },
                  ]}
                />
              </View>
              {!mapActive ? (
                <View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      alert("please drag the marker to the animals location");
                      setMapActive(true);
                      setLocationReceived(false);
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 17,
                        fontWeight: "bold",
                      }}
                    >
                      PIN LOCATION
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={{ marginTop: 10, position: "absolute" }}>
                    <TouchableOpacity
                      style={{
                        width: 210,
                        height: 40,
                        paddingTop: 5,
                        borderRadius: 10,
                        backgroundColor: "sandybrown",

                        zIndex: 12,
                      }}
                      onPress={() => {
                        setMapActive(false);
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 17,
                          fontWeight: "bold",
                        }}
                      >
                        GO BACK
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <MapView
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={initialRegion}
                    showsUserLocation={true}
                    followsUserLocation={true}
                  >
                    <Marker
                      draggable
                      onDragEnd={(event) => handleMarkerDrag(event)}
                      coordinate={initialRegion}
                      onDragStart={() => {
                        setLocationSelected(false);
                      }}
                    />
                  </MapView>
                </>
              )}
              {locationSelected ? (
                <View style={{ marginTop: 10, position: "absolute" }}>
                  <TouchableOpacity
                    style={{
                      width: 210,
                      height: 40,
                      paddingTop: 5,
                      borderRadius: 10,
                      backgroundColor: "lightgreen",

                      zIndex: 15,
                    }}
                    onPress={() => {
                      setMapActive(false);
                      setLocationSelected(false);
                      setLocationReceived(true);
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 17,
                        fontWeight: "bold",
                      }}
                    >
                      PIN HERE
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {locationReceived ? (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 17,
                    color: "green",
                  }}
                >
                  location received successfully. press again to change
                </Text>
              ) : null}
              <View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 17,
                      fontWeight: "bold",
                    }}
                  >
                    SUBMIT REPORT
                  </Text>
                </TouchableOpacity>
              </View>
              {submitError ? (
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 17,
                    // fontWeight: "bold",
                    color: "red",
                  }}
                >
                  Please fill all the details
                </Text>
              ) : null}
            </View>
          ) : (
            <>
              <View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 17,
                    fontWeight: "bold",
                    marginTop: 40,
                  }}
                >
                  We have received your report
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 17,
                    fontWeight: "bold",
                  }}
                >
                  Thank you for your kindness
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setReportSubmited(false);
                    navigation.navigate("Home");
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 17,
                      fontWeight: "bold",
                    }}
                  >
                    RETURN HOME
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ImageBackground>
      </KeyboardAvoidingView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    height: "100%",
  },

  text: {
    color: "black",
    fontWeight: "bold",
    marginTop: "10%",
  },
  text2: {
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
  },
  text3: {
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
  },
  text4: {
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    width: 210,
    height: 40,
    paddingTop: 5,
    borderRadius: 10,
    backgroundColor: "sandybrown",
    marginTop: 40,
    alignSelf: "center",
  },
  backgroundImage: {
    position: "absolute",
    left: 0,
    top: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "cover",
  },
  input: {
    backgroundColor: "sandybrown",
    width: 250,
    height: 55,
    margin: 10,
    borderRadius: 10,
    paddingLeft: 15,
  },
  map: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 10,
  },
});
