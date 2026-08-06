import { RefObject, useLayoutEffect } from 'react';
import gsap from 'gsap';

export const useHeroAnimation = (containerRef: RefObject<HTMLElement>) => {
  useLayoutEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-fade]',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [containerRef]);
};
