import axios from 'axios'
import { AccountInput, Service } from '../../db/models/account'

const GOOGLE_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'
const TWITCH_URL = 'https://api.twitch.tv/helix/users'
const MICROSOFT_URL = 'https://graph.microsoft.com/v1.0/me'

export async function google (token: string): Promise<AccountInput> {
  const { data: googleUser } = await axios.get(`${GOOGLE_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const {
    id,
    name,
    picture,
    locale,
    email
  } = googleUser

  return {
    id,
    name,
    picture,
    locale,
    email,
    service: Service.GOOGLE
  }
}

export async function twitch (token: string): Promise<AccountInput> {
  const { data: { data } } = await axios.get(TWITCH_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': process.env.TWITCH_AUTH_CLIENT_ID ?? 'client-id'
    }
  })
  const [twitchUser] = data

  const {
    id,
    display_name: name,
    profile_image_url: picture,
    locale = 'en',
    email
  } = twitchUser

  return {
    id,
    name,
    picture,
    locale,
    email,
    service: Service.TWITCH
  }
}

export async function microsoft (token: string): Promise<AccountInput> {
  const { data: microsoftUser } = await axios.get(MICROSOFT_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const {
    id,
    displayName: name,
    locale = 'en',
    mail: email
  } = microsoftUser

  return {
    id,
    name,
    locale,
    email,
    service: Service.MICROSOFT
  }
}
