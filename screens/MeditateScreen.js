import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, PanResponder } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  withSpring,
  Easing,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { Smile } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const meditationPrompts = [
  { text: "Breathe in deeply...", color: "#FF6B6B" },
  { text: "Feel the calm...", color: "#4ECDC4" },
  { text: "Let go of thoughts...", color: "#45B7D1" },
  { text: "Stay present...", color: "#96CEB4" },
  { text: "Find your center...", color: "#FFEEAD" },
];

export default function MeditateScreen() {
  const [isTouching, setIsTouching] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [meditationTime, setMeditationTime] = useState(0);

  const scale = useSharedValue(1);
  const hueRotation = useSharedValue(0);
  const textOpacity = useSharedValue(1);
  const progress = useSharedValue(0);

  const updatePrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % meditationPrompts.length);
  };

  useEffect(() => {
    const promptInterval = setInterval(() => {
      textOpacity.value = withTiming(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      );
      runOnJS(updatePrompt)();
    }, 3000);

    return () => clearInterval(promptInterval);
  }, []);

  useEffect(() => {
    if (isTouching && !isComplete) {
      const timer = setInterval(() => {
        setMeditationTime(prev => {
          if (prev >= 60) {
            clearInterval(timer);
            setIsComplete(true);
            scale.value = withSpring(2.5);
            return prev;
          }
          progress.value = withTiming((prev + 1) / 60);
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTouching, isComplete]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsTouching(true);
    },
    onPanResponderRelease: () => {
      if (!isComplete) {
        setIsTouching(false);
        setMeditationTime(0);
        progress.value = withTiming(0);
        scale.value = withSpring(1);
      }
    },
  });

  const blobStyle = useAnimatedStyle(() => {
    const currentHue = hueRotation.value;
    const currentScale = interpolate(
      progress.value,
      [0, 1],
      [1, 1.5]
    );

    return {
      transform: [{ scale: isComplete ? scale.value : currentScale }],
      backgroundColor: `hsl(${currentHue}, 100%, 50%)`,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [{ scale: interpolate(textOpacity.value, [0, 1], [0.9, 1]) }],
    };
  });

  useEffect(() => {
    hueRotation.value = withRepeat(
      withTiming(360, {
        duration: 10000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={[
          styles.meditationText,
          { color: meditationPrompts[currentPromptIndex].color }
        ]}>
          {!isComplete 
            ? meditationPrompts[currentPromptIndex].text
            : "Yay! You did it! 🎉"}
        </Text>
        {!isComplete && !isTouching && (
          <Text style={styles.instructionText}>
            Touch and hold the circle to begin
          </Text>
        )}
        {!isComplete && isTouching && (
          <Text style={styles.timerText}>
            {`${meditationTime} seconds`}
          </Text>
        )}
      </Animated.View>

      <View {...panResponder.panHandlers}>
        <Animated.View style={[styles.blob, blobStyle]}>
          {isComplete && (
            <Smile size={100} color="#FFF" style={styles.smiley} />
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  textContainer: {
    alignItems: 'center',
    padding: 20,
  },
  meditationText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  instructionText: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.7,
  },
  timerText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
  },
  blob: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  smiley: {
    opacity: 0.9,
  },
});

