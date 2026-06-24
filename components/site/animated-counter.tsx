"use client";

import * as React from "react";
import { useInView, animate } from "framer-motion";

export function AnimatedCounter({
  to,
  suffix = "",
  duration = 1.8,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  React.useEffect(() => {
    if (!isInView || !ref.current) return;
    const node = ref.current;

    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = `${Math.round(value)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [isInView, to, suffix, duration]);

  return <span ref={ref}>0{suffix}</span>;
}
