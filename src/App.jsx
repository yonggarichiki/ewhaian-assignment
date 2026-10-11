import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

function App() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  const toggleTimer = useCallback(() => {
    setIsRunning((running) => !running)
  }, [])

  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setSeconds(0)
  }, [])

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setSeconds((sec) => sec + 1)
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
    const secs = String(seconds % 60).padStart(2, '0')
    return `${minutes}:${secs}`
  }, [seconds])

  return (
    <div className="container">
      <div className="timer">
        <h1>타이머</h1>
        <div className="display">{formattedTime}</div>
        <div className="controls">
          <button
            type="button"
            onClick={toggleTimer}
            className={isRunning ? 'stop' : 'start'}
          >
            {isRunning ? '정지' : '시작'}
          </button>
          <button type="button" onClick={resetTimer} className="reset">
            리셋
          </button>
        </div>
      </div>
    </div>
  )
}

export default App