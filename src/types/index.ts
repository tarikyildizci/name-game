export type NameObjectType = { [key in string]?: Array<string> }

export enum GAME_OVER_REASONS {
  player_timeout = 'You are out of time!',
  no_match = "We couldn't find your word in our list :(",
  already_used = 'Your word is already used!',
  invalid_first_letter = "Your word doesn't start with the correct letter!",
  cpu_lost = "The computer couldn't find a new word!",
}

export type PlayerType = 'cpu' | 'player'
