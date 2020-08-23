import React from "react";
import { StyleSheet } from "react-native";
import AnimatedLoader from "react-native-animated-loader";
import LottieView from 'lottie-react-native';

import LoadingAnimation from './loader.json';
import MaskOnAnimation from './maskon.json';

const LottieLoader = ({ visible, animation }) => (
  <AnimatedLoader
    visible={visible}
    overlayColor="rgba(255,255,255,1)"
    source={animation}
    animationStyle={styles.lottie}
  />
);
const styles = StyleSheet.create({
  lottie: {
    width: 150,
    height: 150,
  },
});

export const Loader = (props) => <LottieLoader animation={LoadingAnimation} {...props} />
export const MaskOn = (props) => <LottieView source={MaskOnAnimation} {...props} autoPlay />