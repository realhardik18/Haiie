import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const hueRotation = useSharedValue(0);
  const glowIntensity = useSharedValue(0.6);

  useEffect(() => {
    hueRotation.value = withRepeat(
      withTiming(360, {
        duration: 10000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    glowIntensity.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.6, {
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, []);

  const semicircleStyle = useAnimatedStyle(() => {
    const currentHue = hueRotation.value;
    return {
      opacity: glowIntensity.value,
      backgroundColor: `hsl(${currentHue}, 100%, 50%)`,
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.meditateButton}
        onPress={() => navigation.navigate('Meditate')}
      >
        <Text style={styles.buttonText}>Begin</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.semicircle, semicircleStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  semicircle: {
    width: width,
    height: width / 2,
    borderTopLeftRadius: width / 2,
    borderTopRightRadius: width / 2,
    position: 'absolute',
    bottom: 0,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  meditateButton: {
    position: 'absolute',
    bottom: width / 4,
    zIndex: 1,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
});

