import './App.css'
import { useState, useRef, useMemo, type ChangeEvent } from 'react'
import { SortByColumn, type User } from './types.d'
import { ActionButtonBar } from './components/ActionButtonBar'
import { UserList } from './components/UsersList'
import { useUsers } from './hooks/useUsers'
import { Heaeder } from './components/Header'

function App() {
  const [sortByColumn, setSortByColumn] = useState(SortByColumn.None)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState(false)
  const filteredUsersRef = useRef<User[]>([])

  const {
    isLoading,
    users,
    Error,
    isFetching,
    hasNextPage,
    fetchNextPage,
    deleteUserBy,
    resetScrollAndData
  } = useUsers()

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
    deleteUserBy(uuid)
  }

  const handleResetUsers = () => {
    resetScrollAndData()
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
      <Heaeder />
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
