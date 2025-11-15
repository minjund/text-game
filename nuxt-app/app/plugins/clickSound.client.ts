// 모든 버튼 클릭 시 사운드를 재생하는 플러그인
export default defineNuxtPlugin(() => {
  if (process.client) {
    // 클릭 사운드 재생 함수
    const playClickSound = () => {
      const audio = new Audio('/bgm/uiMouseClick.mp3')
      audio.volume = 0.3 // 볼륨 30%
      audio.play().catch(error => {
        // 에러 무시 (브라우저 자동재생 정책 등)
      })
    }

    // 페이지 로드 후 모든 버튼에 클릭 이벤트 리스너 추가
    const addClickSoundToButtons = () => {
      // 전역 클릭 이벤트 리스너 (이벤트 위임 방식)
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement

        // 버튼이거나 버튼 내부 요소를 클릭한 경우
        const button = target.closest('button')
        if (button && !button.disabled) {
          playClickSound()
        }
      }, { passive: true })
    }

    // DOM이 준비되면 이벤트 리스너 추가
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addClickSoundToButtons)
    } else {
      addClickSoundToButtons()
    }
  }
})
