import { useEffect, useRef, useState } from 'react'

export type TimerStopReason = 'interrupted' | 'done'

export const useWait = (callback: (reason: TimerStopReason) => void) => {
  const intervalRef = useRef<number>()
  const [timeLeft, setTimeLeft] = useState<number>()

  const start = (waitTime: number) => {
    setTimeLeft(waitTime)
    const interval = setInterval(() => {
      setTimeLeft((time) => time && time - 1000)
    }, 1000)
    intervalRef.current = interval
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    callback('interrupted')
  }

  useEffect(() => {
    if (timeLeft !== undefined && timeLeft <= 0) {
      clearInterval(intervalRef.current)
      callback('done')
    }
  }, [timeLeft])

  return { start, stop, timeLeft }
}
