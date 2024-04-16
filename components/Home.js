import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";

export default function Home() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../pexels-tima-miroshnichenko-6234623.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={styles.text}>
            Have you encountered an injured animal?
          </Text>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("Report");
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                REPORT AN INJURY
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.text2}>Check on your rescue</Text>

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate("Rescue check");
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 17,
                  fontWeight: "bold",
                }}
              >
                TRACK
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
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
    marginTop: "30%",
  },
  text2: {
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 15,
  },
  button: {
    width: 210,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: "sandybrown",
    paddingBottom: 3,
  },
  backgroundImage: {
    position: "absolute",
    left: 0,
    top: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    resizeMode: "cover",
  },
});
