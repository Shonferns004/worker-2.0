import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;
let isPlaying = false;

export const startJobAlert = async () => {
  try {
    if (isPlaying) return;

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeIOS: 1,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    sound = new Audio.Sound();

    await sound.loadAsync(
      require("@/assets/audio/job.mp3"),
      { isLooping: true, volume: 1.0 },
      true
    );

    await sound.playAsync();
    isPlaying = true;
  } catch (e) {
    console.log("sound start error", e);
  }
};

export const stopJobAlert = async () => {
  try {
    if (!sound) return;

    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
    isPlaying = false;
  } catch (e) {
    console.log("sound stop error", e);
  }
};