// AudioController.js
import { Audio } from 'expo-av';

let sound;

export const playMusic = async (volume = 1.0) => {
  try {
    
    if (!sound) {
      sound = new Audio.Sound();
      await sound.loadAsync(require('./../../../assets/music/UEFA Champions League Anthem (Full Version).mp3'));
      await sound.setIsLoopingAsync(true);
    }
    await sound.setVolumeAsync(volume);
    await sound.playAsync();
  } catch (error) {
    console.error('Lỗi phát nhạc:', error);
  }
};

export const stopMusic = async () => {
  if (sound) {
    await sound.stopAsync();
  }
};

export const setMusicVolume = async (volume) => {
  if (sound) {
    await sound.setVolumeAsync(volume);
  }
};
export default {
  playMusic,
  stopMusic,
  setMusicVolume,
};