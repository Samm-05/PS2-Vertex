import gsap from 'gsap';

export const animatePanelMount = (element: HTMLElement) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
  );
};

export const animateStepPulse = (element: HTMLElement) => {
  return gsap.fromTo(
    element,
    { boxShadow: '0 0 0px rgba(99,102,241,0.0)' },
    {
      boxShadow: '0 0 24px rgba(99,102,241,0.35)',
      duration: 0.28,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut',
    }
  );
};
