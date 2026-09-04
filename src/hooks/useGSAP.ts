import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useGSAP<T extends HTMLElement = HTMLElement>(
  callback: (ctx: gsap.Context) => void,
  deps: React.DependencyList = []
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => callback(ctx), ref.current);
    return () => ctx.revert();
  }, deps);

  return ref;
}
