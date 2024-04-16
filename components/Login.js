import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ImageBackground,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import RNPickerSelect from "react-native-picker-select";
import axios from "axios";

export default function Login() {
  const [signup, setSignup] = useState(false);
  const [rescues, setRescues] = useState();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [error, setError] = useState(false);
  const [inputError, setInputError] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <ImageBackground
          source={require("../pexels-photo-5733423.webp")}
          style={styles.backgroundImage}
          imageStyle={{ opacity: 0.3 }}
        >
          {!signup ? (
            <View style={styles.container}>
              <Text style={styles.text}>Full name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. John Doe"
                placeholderTextColor="grey"
                onChangeText={(name) => {
                  setDetails((currentDetails) => {
                    const newDetails = { ...currentDetails };
                    newDetails.name = name;
                    return newDetails;
                  });
                }}
              ></TextInput>
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
              <View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setLoading(true);
                    setInputError(false);
                    setError(false);
                    if (details.animal && details.name) {
                      axios
                        .get(
                          `https://be-animal-rescue.onrender.com/rescues?animal=${details.animal}&name=${details.name}`
                        )
                        .then((response) => {
                          setRescues(response.data.rescues);
                          setSignup(true);
                          setLoading(false);
                          setDetails({});
                        })
                        .catch((err) => {
                          setLoading(false);
                          setError(true);
                        });
                    } else if (details.name) {
                      axios
                        .get(
                          `https://be-animal-rescue.onrender.com/rescues?name=${details.name}`
                        )
                        .then((response) => {
                          setRescues(response.data.rescues);
                          setSignup(true);
                          setLoading(false);
                          setDetails({});
                        })
                        .catch((err) => {
                          setLoading(false);
                          setError(true);
                        });
                    } else if (details.animal) {
                      axios
                        .get(
                          `https://be-animal-rescue.onrender.com/rescues?animal=${details.animal}`
                        )
                        .then((response) => {
                          setRescues(response.data.rescues);
                          setSignup(true);
                          setLoading(false);
                          setDetails({});
                        })
                        .catch((err) => {
                          setLoading(false);
                          setError(true);
                        });
                    } else {
                      setInputError(true);
                      setLoading(false);
                      console.log("error occured in searching");
                    }
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 17,
                      fontWeight: "bold",
                    }}
                  >
                    SEARCH
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 17,
                  marginTop: 10,
                }}
              >
                Could not find your rescue?{"  "}
                <Text
                  style={{
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                  onPress={() => {
                    setInputError(false);
                    setLoading(true);
                    setError(false);
                    axios
                      .get("https://be-animal-rescue.onrender.com/rescues")
                      .then((response) => {
                        setRescues(response.data.rescues);
                        setSignup(true);
                        setLoading(false);
                      })
                      .catch((err) => {
                        setLoading(false);
                        setError(true);
                      });
                  }}
                >
                  all animals
                </Text>
              </Text>
              {loading ? (
                <Text style={{ fontSize: 14, marginTop: 20, color: "green" }}>
                  Please wait while we retrieve the animals{" "}
                </Text>
              ) : null}
              {error ? (
                <Text style={{ fontSize: 14, marginTop: 20, color: "red" }}>
                  Requested animals not found{" "}
                </Text>
              ) : null}
              {inputError ? (
                <Text style={{ fontSize: 14, marginTop: 20, color: "red" }}>
                  Please fill in at least one of the fields{" "}
                </Text>
              ) : null}
            </View>
          ) : (
            <>
              <View style={styles.container}>
                <ScrollView>
                  <Icon
                    style={{
                      marginTop: 10,
                      alignSelf: "flex-start",
                      marginLeft: 10,
                    }}
                    onPress={() => {
                      setSignup(false);
                    }}
                    name="arrow-circle-left"
                    size={60}
                    color="sandybrown"
                  />
                  {rescues.map((rescue, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          backgroundColor: "sandybrown",
                          padding: 20,
                          borderRadius: 15,
                          marginTop: 10,
                          marginBottom: 10,
                          marginLeft: 3,
                          marginRight: 3,
                        }}
                      >
                        <Image
                          source={{ uri: rescue.img }}
                          style={{
                            height: 200,
                            borderRadius: 15,
                          }}
                        />
                        <Text
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            marginTop: 30,
                          }}
                        >
                          This {rescue.animal} was reported by {rescue.name} for{" "}
                          {rescue.injury} injuries and is being treated at the
                          clinic
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </>
          )}
        </ImageBackground>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
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
