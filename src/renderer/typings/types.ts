export interface TwitchMessage {
  id?: string | number
  createdAt?: string
  userName?: string
  color?: string
  type?: string
  message: string
  redeemCode?: string
  emotes?: string[]
}
