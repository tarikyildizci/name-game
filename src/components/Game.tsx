import React, { useEffect, useMemo, useState } from 'react'
import { useGame } from '../hooks'
import { askMicPermission, indexArrayOfWordsByFirstLetter } from '../util'
import names from '../data/names.json'
import './styles.css'
import GameOver from './GameOver'

const Game: React.FC = () => {
  const indexedNames = useMemo(() => indexArrayOfWordsByFirstLetter(names), [names])

  const [permission, setPermission] = useState(false)

  const {
    startGame,
    turn,
    usedNames,
    latestName,
    winner,
    gameOverReason,
    timeLeft,
    browserSupportsSpeechRecognition,
    listening,
  } = useGame(indexedNames)

  const handleGameStart = () => {
    startGame(names)
  }

  useEffect(() => {
    askMicPermission().then((val) => setPermission(val))
  }, [])

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="container">
        <h1>Your browser does not support this game, would ou like to try Chrome?</h1>
      </div>
    )
  }
  if (!permission) {
    return (
      <div className="container">
        <h1>Allow microphone usage to play.</h1>
      </div>
    )
  }

  if (gameOverReason && winner) {
    return <GameOver winner={winner} usedNames={usedNames} reason={gameOverReason} />
  }

  return (
    <div className="container">
      <h1>{latestName ?? 'Name Game'}</h1>

      {!latestName && (
        <button type="button" onClick={handleGameStart}>
          Start Game
        </button>
      )}

      {turn === 'cpu' && timeLeft && <p>Thinking...</p>}
      {turn === 'player' &&
        (listening ? <p>Listening...</p> : timeLeft && <p>Time Left: {timeLeft}</p>)}
    </div>
  )
}

export default Game
