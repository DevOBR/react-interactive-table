import type { User } from '../types'

const API_URL = import.meta.env.VITE_API_URL
export const getUsers = async (page: number = 1) => {
  return fetch(`${API_URL}&page=${page}`)
    .then((data) => {
      if (!data.ok) throw new Error('Error with endpoint.')

      return data.json()
    })
    .then(({ results }: { results: User[] }) => results)
}
