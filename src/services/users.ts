import type { User } from '../types'

const API_URL = import.meta.env.VITE_API_URL
export const getUsers = async () => {
  return fetch(API_URL)
    .then((data) => {
      if (!data.ok) throw new Error('Error with endpoint.')

      return data.json()
    })
    .then(({ results }: { results: User[] }) => results)
}
