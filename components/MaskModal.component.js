import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { MaskOn } from "./Lottie.component";

export const MaskModal = () => (
  <View style={styles.messageContainer}>
    <Text style={styles.messageTitle}>Mask on !</Text>
    <View style={styles.messageCore}>
      <MaskOn visible={true} />
      <Text style={styles.message}>
        Le port du masque est obligatoire dans cette zone.
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    padding: 25,
  },
  messageCore: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  message: {
    fontSize: 17,
    lineHeight: 24,
    marginVertical: 20,
  },
});
