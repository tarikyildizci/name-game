import { GAME_OVER_REASONS, NameObjectType } from '../types'

export const indexArrayOfWordsByFirstLetter = (arrayOfWords: Array<string>): NameObjectType => {
  const resultObject: NameObjectType = {}

  for (let index = 0; index < arrayOfWords.length; index += 1) {
    const word = arrayOfWords[index]
    const firstLetter = word.charAt(0)

    resultObject[firstLetter] = [...(resultObject[firstLetter] ?? []), word]
  }
  return resultObject
}

export const randRange = (max: number, min: number = 0) =>
  Math.floor(Math.random() * max - min) + min

export const getWordWithFirstLetter = (
  wordList: NameObjectType,
  usedWordList: Array<string>,
  firstLetter: string,
): string | undefined => {
  let word: string | undefined

  const validWordsArray = wordList[firstLetter]

  do {
    word = validWordsArray && validWordsArray[randRange(validWordsArray.length - 1)]
  } while (word && usedWordList.includes(word))

  return word
}

export const getRandomWord = (wordList: Array<string>) => wordList[randRange(wordList.length - 1)]

export const isWordValid = (
  wordList: NameObjectType,
  word: string,
  firstLetter: string,
  usedWordList: Array<string>,
): { isValid: boolean; reason?: GAME_OVER_REASONS } => {
  if (word.charAt(0) !== firstLetter) {
    return { isValid: false, reason: GAME_OVER_REASONS.invalid_first_letter }
  }

  if (usedWordList.includes(word)) {
    return { isValid: false, reason: GAME_OVER_REASONS.already_used }
  }

  if (wordList[firstLetter] && !wordList[firstLetter]?.includes(word)) {
    return { isValid: false, reason: GAME_OVER_REASONS.no_match }
  }

  return { isValid: true }
}

export const askMicPermission = async (): Promise<boolean> => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true })
    return true
  } catch {
    return false
  }
}

export const speak = (msg: string) => {
  const utterence = new SpeechSynthesisUtterance(msg)
  utterence.lang = 'tr-TR'
  utterence.rate = 1
  utterence.volume = 2
  window.speechSynthesis.speak(utterence)
}
