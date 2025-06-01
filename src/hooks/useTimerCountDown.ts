// hooks/useResendTimer.ts
import { useEffect, useState } from "react";

const TIMER_KEY = "resend_timer_target";

export default function useTimerCountDown() {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const storedTarget = localStorage.getItem(TIMER_KEY);
    if (storedTarget) {
      const targetTime = parseInt(storedTarget, 10);
      const timeLeft = Math.floor((targetTime - Date.now()) / 1000);
      if (timeLeft > 0) setTimer(timeLeft);
    }
  }, []);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(TIMER_KEY);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const startTimer = (defaultSeconds: number = 60) => {
    const targetTime = Date.now() + defaultSeconds * 1000;
    localStorage.setItem(TIMER_KEY, targetTime.toString());
    setTimer(defaultSeconds);
  };


  const isTimerStarted = timer > 0;

  return { timer, startTimer, isTimerStarted };
}
