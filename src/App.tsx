import './App.css'
import { useState, useRef, useMemo, type ChangeEvent } from 'react'
import { SortByColumn, type User, type UserResult } from './types.d'
import { ActionButtonBar } from './components/ActionButtonBar'
import { UserList } from './components/UsersList'
import { getUsers } from './services/users'
import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData
} from '@tanstack/react-query'

function App() {
  const [sortByColumn, setSortByColumn] = useState(SortByColumn.None)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState(false)
  const filteredUsersRef = useRef<User[]>([])
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
    getNextPageParam: (lastPage, s, lpp, app) => {
      console.log({ lpp, app, lastPage, s })
      return lastPage.nextCursor
    }
    // maxPages: 3 // -> limit cached data
  })

  const queryClient = useQueryClient()

  const users: User[] = usersResult?.pages.flatMap((x) => x.users) ?? []

  if (
    usersResult &&
    usersResult?.pages?.length === 1 &&
    usersResult?.pages?.[0].users.length === 8 &&
    usersResult?.pages?.[0].nextCursor === 2
  ) {
    storedUsers.current = usersResult?.pages
  }

  const filteredUsers = useMemo(() => {
    const newFilteredUsers = filterCountry
      ? users.filter((x) =>
          x.location.country.toLowerCase().includes(filterCountry)
        )
      : users
    const isDiferent =
      newFilteredUsers.some(
        (x, index) => x !== filteredUsersRef.current[index]
      ) || filteredUsersRef.current.length !== newFilteredUsers.length

    if (isDiferent) {
      filteredUsersRef.current = newFilteredUsers
      return newFilteredUsers
    }

    return filteredUsersRef.current
  }, [users, filterCountry])

  const sortedUsers: User[] = useMemo(() => {
    const sorts = {
      [SortByColumn.Name]: (a: User, b: User) =>
        a.name.first.localeCompare(b.name.first),
      [SortByColumn.Gender]: (a: User, b: User) =>
        a.gender.localeCompare(b.gender),
      [SortByColumn.Country]: (a: User, b: User) =>
        a.location.country.localeCompare(b.location.country)
    }

    return sortByColumn !== SortByColumn.None
      ? filteredUsers.toSorted(sorts[sortByColumn])
      : filteredUsers
  }, [sortByColumn, filteredUsers])

  const handleSortUsers = () => {
    const sortBy =
      sortByColumn === SortByColumn.Country
        ? SortByColumn.None
        : SortByColumn.Country
    setSortByColumn(sortBy)
  }

  const handleDeleteUser = (uuid: string) => {
    const newUsersList = usersResult?.pages.map((page) => {
      return {
        ...page,
        users: page.users.filter((x) => x.login.uuid !== uuid)
      }
    })

    queryClient.setQueryData(
      ['usersData'],
      (oldData: InfiniteData<UserResult, unknown>) => {
        if (!oldData) return oldData
        return {
          pages: newUsersList,
          pageParams: oldData.pageParams
        }
      }
    )
  }

  const handleResetUsers = () => {
    console.log(storedUsers.current)
    if (storedUsers.current.length > 0) {
      queryClient.setQueryData(
        ['usersData'],
        (oldData: InfiniteData<UserResult, unknown>) => {
          if (!oldData) return oldData
          return {
            pages: storedUsers.current,
            pageParams: [-199]
          }
        }
      )
    }
  }

  const handleOnCountryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterCountry(e.currentTarget.value)
  }

  const handleSetBg = () => {
    setBgColor(!bgColor)
  }

  const handleSortBy = (sortByColumn: SortByColumn) => {
    setSortByColumn((prev) =>
      prev === sortByColumn ? SortByColumn.None : sortByColumn
    )
  }

  function handleLoadMore(): void {
    if (!isFetching && hasNextPage) fetchNextPage()
  }

  return (
    <>
      <header>
        <h1>React Interactive form: {users?.length}</h1>
      </header>
      <main>
        <ActionButtonBar
          handleSetBg={handleSetBg}
          handleSortUsers={handleSortUsers}
          handleResetUsers={handleResetUsers}
          handleOnCountryChange={handleOnCountryChange}
        />

        {sortedUsers.length > 0 && (
          <UserList
            users={sortedUsers}
            isColoredTable={bgColor}
            handleSortBy={handleSortBy}
            handleDeleteUser={handleDeleteUser}
          />
        )}

        {hasNextPage && !isLoading && !Error && hasNextPage && (
          <button onClick={handleLoadMore} className='message'>
            Load more
          </button>
        )}

        {/* TODO: Lets create a component for this */}
        {isLoading && <strong className='message'>Loading..</strong>}

        {sortedUsers.length <= 0 && !Error && !isLoading && !hasNextPage && (
          <strong className='message'>There's no data</strong>
        )}
        {!isLoading && Error && (
          <strong className='message'>
            Error fetching data {Error.message}
          </strong>
        )}
      </main>
    </>
  )
}

export default App
