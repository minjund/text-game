/**
 * 게임 애니메이션 유틸리티
 * GSAP, VueUse Motion, Auto Animate를 사용한 다양한 애니메이션 효과
 */

import { gsap } from 'gsap'

/**
 * 모달 줌인/줌아웃 애니메이션
 * @param element - 애니메이션할 DOM 요소
 * @param isOpening - true면 열기, false면 닫기
 */
export const useModalZoom = () => {
  const openModal = (element: HTMLElement) => {
    gsap.fromTo(
      element,
      {
        scale: 0.5,
        opacity: 0,
        filter: 'blur(10px)',
      },
      {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.4,
        ease: 'back.out(1.7)',
      }
    )
  }

  const closeModal = (element: HTMLElement, onComplete?: () => void) => {
    gsap.to(element, {
      scale: 0.5,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.3,
      ease: 'power2.in',
      onComplete,
    })
  }

  return { openModal, closeModal }
}

/**
 * 양피지 펼치기/접기 애니메이션
 * @param element - 양피지 요소
 */
export const useParchmentUnfold = () => {
  const unfold = (element: HTMLElement) => {
    const tl = gsap.timeline()

    tl.fromTo(
      element,
      {
        scaleY: 0,
        transformOrigin: 'top center',
        opacity: 0,
      },
      {
        scaleY: 1,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      }
    ).fromTo(
      element.querySelectorAll('.parchment-content'),
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
      },
      '-=0.2'
    )

    return tl
  }

  const fold = (element: HTMLElement, onComplete?: () => void) => {
    const tl = gsap.timeline({ onComplete })

    tl.to(element.querySelectorAll('.parchment-content'), {
      opacity: 0,
      y: -20,
      duration: 0.2,
      stagger: 0.05,
    }).to(element, {
      scaleY: 0,
      transformOrigin: 'top center',
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    })

    return tl
  }

  return { unfold, fold }
}

/**
 * 버튼 클릭 펄스 효과
 */
export const useButtonPulse = () => {
  const pulse = (element: HTMLElement) => {
    gsap.fromTo(
      element,
      { scale: 1 },
      {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      }
    )
  }

  const shine = (element: HTMLElement) => {
    const shine = document.createElement('div')
    shine.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      pointer-events: none;
    `
    element.style.position = 'relative'
    element.style.overflow = 'hidden'
    element.appendChild(shine)

    gsap.to(shine, {
      left: '100%',
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => shine.remove(),
    })
  }

  return { pulse, shine }
}

/**
 * 카드 뒤집기 애니메이션
 */
export const useCardFlip = () => {
  const flip = (element: HTMLElement, onHalfway?: () => void) => {
    const tl = gsap.timeline()

    tl.to(element, {
      rotationY: 90,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onHalfway,
    }).to(element, {
      rotationY: 180,
      duration: 0.3,
      ease: 'power2.out',
    })

    return tl
  }

  const flipBack = (element: HTMLElement, onHalfway?: () => void) => {
    const tl = gsap.timeline()

    tl.to(element, {
      rotationY: 90,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onHalfway,
    }).to(element, {
      rotationY: 0,
      duration: 0.3,
      ease: 'power2.out',
    })

    return tl
  }

  return { flip, flipBack }
}

/**
 * 텍스트 타이핑 효과 (개선된 버전)
 */
export const useTypewriter = () => {
  const type = async (
    element: HTMLElement,
    text: string,
    speed: number = 30
  ): Promise<void> => {
    element.textContent = ''

    return new Promise((resolve) => {
      let index = 0
      const interval = setInterval(() => {
        if (index < text.length) {
          element.textContent += text[index]
          index++
        } else {
          clearInterval(interval)
          resolve()
        }
      }, speed)
    })
  }

  return { type }
}

/**
 * 리소스 카운터 애니메이션
 */
export const useCounterAnimation = () => {
  const animateValue = (
    element: HTMLElement,
    from: number,
    to: number,
    duration: number = 1
  ) => {
    const obj = { value: from }

    gsap.to(obj, {
      value: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.floor(obj.value).toLocaleString()
      },
    })
  }

  return { animateValue }
}

/**
 * 전투 이펙트 애니메이션
 */
export const useBattleEffects = () => {
  const shake = (element: HTMLElement) => {
    gsap.fromTo(
      element,
      { x: 0 },
      {
        x: -10,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        ease: 'power1.inOut',
      }
    )
  }

  const flash = (element: HTMLElement, color: string = '#ff0000') => {
    gsap.fromTo(
      element,
      { backgroundColor: color, opacity: 0.5 },
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(element, { backgroundColor: 'transparent', opacity: 1 })
        },
      }
    )
  }

  const criticalHit = (element: HTMLElement) => {
    const tl = gsap.timeline()

    tl.to(element, {
      scale: 1.2,
      duration: 0.1,
      ease: 'power2.out',
    })
      .to(element, {
        scale: 1,
        duration: 0.2,
        ease: 'elastic.out(1, 0.5)',
      })
      .to(
        element,
        {
          textShadow: '0 0 20px #ffff00, 0 0 40px #ff0000',
          duration: 0.3,
          yoyo: true,
          repeat: 1,
        },
        0
      )

    return tl
  }

  return { shake, flash, criticalHit }
}

/**
 * 페이지 전환 애니메이션
 */
export const usePageTransition = () => {
  const fadeIn = (element: HTMLElement) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
  }

  const fadeOut = (element: HTMLElement, onComplete?: () => void) => {
    gsap.to(element, {
      opacity: 0,
      y: -50,
      duration: 0.4,
      ease: 'power2.in',
      onComplete,
    })
  }

  const slideIn = (element: HTMLElement, direction: 'left' | 'right' = 'right') => {
    const x = direction === 'right' ? '100%' : '-100%'
    gsap.fromTo(
      element,
      { x, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    )
  }

  return { fadeIn, fadeOut, slideIn }
}

/**
 * 알림/토스트 애니메이션
 */
export const useNotificationAnimation = () => {
  const bounceIn = (element: HTMLElement) => {
    gsap.fromTo(
      element,
      {
        y: -100,
        opacity: 0,
        scale: 0.5,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'bounce.out',
      }
    )
  }

  const slideOut = (element: HTMLElement, onComplete?: () => void) => {
    gsap.to(element, {
      x: 400,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete,
    })
  }

  return { bounceIn, slideOut }
}

/**
 * 스크롤 트리거 페이드인 (섹션별 애니메이션)
 */
export const useScrollReveal = () => {
  const reveal = (elements: HTMLElement[]) => {
    elements.forEach((element, index) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
  }

  return { reveal }
}
