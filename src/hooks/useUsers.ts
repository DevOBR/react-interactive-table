import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData
} from '@tanstack/react-query'
import { getUsers } from '../services/users'
import type { UserResult } from '../types'
import { useRef } from 'react'

export const useUsers = () => {
  const storedUsers = useRef<UserResult[]>([])
  const {
    isLoading,
    data: usersResult,
    error: Error,
    isFetching,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['usersData'],
    queryFn: getUsers,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor
    // maxPages: 3 // -> limit cached data
  })

  const queryClient = useQueryClient()

  if (
    usersResult &&
    usersResult?.pages?.length === 1 &&
    usersResult?.pages?.[0].users.length === 8 &&
    usersResult?.pages?.[0].nextCursor === 2
  ) {
    storedUsers.current = usersResult?.pages
  }

  const deleteUserBy = (uuid: string) => {
    const newList = usersResult?.pages.map((page) => ({
      ...page,
      users: page.users.filter((x) => x.login.uuid !== uuid)
    }))
    queryClient.setQueryData(
      ['usersData'],
      (oldData: InfiniteData<UserResult, unknown>) => {
        if (!oldData) return oldData
        return {
          pages: newList,
          pageParams: oldData.pageParams
        }
      }
    )
  }

  const resetScrollAndData = () => {
    if (storedUsers?.current.length > 0) {
      queryClient.setQueryData(
        ['usersData'],
        (oldData: InfiniteData<UserResult, unknown>) => {
          if (!oldData) return oldData
          return {
            pages: storedUsers.current,
            pageParams: [storedUsers?.current?.[0].nextCursor]
          }
        }
      )
    }
  }

  return {
    isLoading,
    users: usersResult?.pages.flatMap((x) => x.users) ?? [],
    Error,
    isFetching,
    hasNextPage,
    fetchNextPage,
    deleteUserBy,
    resetScrollAndData
  }
}
