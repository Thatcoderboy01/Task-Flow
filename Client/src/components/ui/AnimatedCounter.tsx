import React, { useEffect, useRef, useState } from 'react';

/* ============================================================
 * AnimatedCounter — smoothly animates from 0 → target value
 * ============================================================ */

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  target,
  duration = 800,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const prevTarget = useRef(target);

  useEffect(() => {
    const from = prevTarget.current !== target ? current : 0;
    prevTarget.current = target;
    startRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // EaseOutExpo for a snappy feel
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.round(from + (target - from) * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return (
    <span className={className}>
      {prefix}
      {current}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
