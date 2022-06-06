import React from 'react'
import { GAME_OVER_REASONS } from '../util'
import './styles.css'

type GameOverProps = {
  reason: GAME_OVER_REASONS
  usedNames: Array<string>
  winner: string
}

const refresh = () => window.location.reload()

const GameOver: React.FC<GameOverProps> = ({ reason, usedNames, winner }) => (
  <div className="container">
    <h3>Winner: {winner}</h3>
    <h1>{reason}</h1>
    <p>Total Words Guessed: {Math.floor(usedNames.length / 2)}</p>
    <button type="button" onClick={refresh}>
      Play Again
    </button>
  </div>
)

export default GameOver
