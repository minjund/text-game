// 사운드 재생을 위한 composable
export const useSound = () => {
  // 클릭 사운드 재생
  const playClickSound = () => {
    if (process.client) {
      const config = useRuntimeConfig();
      const audio = new Audio(config.app.baseURL + 'bgm/uiMouseClick.mp3');
      audio.volume = 0.3 // 볼륨 30%
      audio.play().catch(error => {
        console.log('Click sound play failed:', error)
      })
    }
  }

  return {
    playClickSound
  }
}
