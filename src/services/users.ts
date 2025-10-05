import type { UserResult } from '../types.d'

const API_URL = import.meta.env.VITE_API_URL

export const getUsers = async ({
  pageParam
}: {
  pageParam: number
}): Promise<UserResult> => {
  return fetch(`${API_URL}&page=${pageParam}`)
    .then((data) => {
      if (!data.ok) throw new Error('Error with endpoint.')

      return data.json()
    })
    .then((data) => {
      const resp: UserResult = {
        users: data?.results,
        nextCursor: pageParam + 1
      }

      if (pageParam <= 2) {
        resp.nextCursor = resp?.nextCursor ? pageParam + 1 : undefined
        return resp
      } else {
        resp.nextCursor = undefined
        return resp
      }
    })
}
