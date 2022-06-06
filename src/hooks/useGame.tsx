// to fix a speech recognition bug
// recommended by library author
import 'regenerator-runtime'
import { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import config from '../config'
import { TimerStopReason, useWait } from './useWait'
import {
  GAME_OVER_REASONS,
  getRandomWord,
  getWordWithFirstLetter,
  isWordValid,
  NameObjectType,
  randRange,
  speak,
} from '../util'

type PlayerType = 'cpu' | 'player'

type StateType = {
  turn: PlayerType
  usedNames: Array<string>
  latestName?: string
  winner?: PlayerType
  gameOverReason?: GAME_OVER_REASONS
}

const initialState: StateType = {
  turn: 'cpu',
  usedNames: [],
}

const useGame = (indexedNames: NameObjectType) => {
  const [{ turn, usedNames, gameOverReason, latestName, winner }, setState] =
    useState<StateType>(initialState)

  const { browserSupportsSpeechRecognition, finalTranscript, listening, transcript } =
    useSpeechRecognition()

  const cpuTurn = (firstLetter: string): { word?: string; gameOver?: GAME_OVER_REASONS } => {
    let word: string | undefined

    const shouldCpuLose = randRange(99) < config.cpuLoseRatePercent

    if (!shouldCpuLose) {
      word = getWordWithFirstLetter(indexedNames, usedNames, firstLetter)
    }
    if (!word || shouldCpuLose) {
      return { word, gameOver: GAME_OVER_REASONS.cpu_lost }
    }
    speak(word)

    return { word }
  }

  const onTimerStopped = (reason: TimerStopReason) => {
    if (!latestName || winner || reason === 'interrupted') {
      return
    }

    let shouldGameOver: GAME_OVER_REASONS

    let currentWord: string | undefined

    switch (turn) {
      case 'cpu': {
        const { gameOver: cpuGameOver, word: cpuWord } = cpuTurn(
          latestName.charAt(latestName.length - 1),
        )
        cpuWord && (currentWord = cpuWord)
        cpuGameOver && (shouldGameOver = cpuGameOver)
        break
      }
      case 'player':
      default:
        shouldGameOver = GAME_OVER_REASONS.player_timeout
        break
    }

    if (!currentWord) {
      setState((s) => ({
        ...s,
        winner: s.turn === 'cpu' ? 'player' : 'cpu',
        gameOverReason: shouldGameOver,
      }))
    } else {
      const tempCurrentWord = currentWord // typescript doesn't understand that currentWord can't be undefined in the line below :/
      setState((s) => ({
        ...s,
        usedNames: [...s.usedNames, tempCurrentWord],
        latestName: tempCurrentWord,
        turn: s.turn === 'cpu' ? 'player' : 'cpu',
      }))
    }
  }

  const { start: startTimer, stop: stopTimer, timeLeft } = useWait(onTimerStopped)

  const startGame = (names: Array<string>) => {
    const starterName = getRandomWord(names)
    speak(starterName)
    setState({ turn: 'player', latestName: starterName, usedNames: [starterName] })
  }

  const listenToPlayer = () => {
    SpeechRecognition.startListening({ language: 'tr-TR' })
  }

  useEffect(() => {
    if (!latestName) {
      return
    }
    if (transcript !== '') {
      // player started talking
      stopTimer()
    }
    if (finalTranscript !== '') {
      // player finished talking
      SpeechRecognition.stopListening()
      const playerAnswer = finalTranscript.toLowerCase()
      const isPlayerAnswerValid = isWordValid(
        indexedNames,
        playerAnswer,
        latestName.charAt(latestName.length - 1),
        usedNames,
      )

      if (!isPlayerAnswerValid.isValid) {
        setState((s) => ({ ...s, winner: 'cpu', gameOverReason: isPlayerAnswerValid.reason }))
      } else {
        setState((s) => ({
          ...s,
          turn: 'cpu',
          latestName: playerAnswer,
          usedNames: [...s.usedNames, playerAnswer],
        }))
      }
    }
  }, [listening, transcript])

  useEffect(() => {
    if (winner || !latestName) {
      return
    }

    let { waitTime } = config

    switch (turn) {
      case 'cpu':
        waitTime = randRange(config.waitTime)
        break

      case 'player':
        listenToPlayer()
        break
      default:
        break
    }

    startTimer(waitTime)
  }, [turn])

  return {
    startGame,
    turn,
    usedNames,
    gameOverReason,
    latestName,
    winner,
    browserSupportsSpeechRecognition,
    timeLeft: timeLeft && timeLeft / 1000,
    listening: transcript !== '',
  }
}

export default useGame
