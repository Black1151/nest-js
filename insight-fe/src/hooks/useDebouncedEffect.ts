"use client";
import { useEffect, useRef } from "react";

export default function useDebouncedEffect(
  effect: () => void,
  deps: React.DependencyList,
  delay: number
) {
  const handler = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (handler.current) clearTimeout(handler.current);
    handler.current = setTimeout(effect, delay);
    return () => {
      if (handler.current) clearTimeout(handler.current);
    };
  }, [...deps, delay]);
}
