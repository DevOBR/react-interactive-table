import './App.css'
import { useEffect, useState, useRef, useMemo, type ChangeEvent } from 'react'
import { SortByColumn, type User } from './types.d'
import { ActionButtonBar } from './components/ActionButtonBar'
import { UserList } from './components/UsersList'
import { getUsers } from './services/users'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [sortByColumn, setSortByColumn] = useState(SortByColumn.None)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState(false)
  const usersRef = useRef<User[]>([])
  const filteredUsersRef = useRef<User[]>([])

  //TODO: Pending to refactor with react query
  const [isLoading, setIsLoading] = useState(false)
  const [Error, setError] = useState<object | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    // storeUsers set ref to presist and restor later
    const storeUsers = (data: User[]) => {
      console.log(users)
      setUsers((prevState) => {
        return prevState?.length === 0
          ? (prevState = data)
          : prevState.concat(data)
      })
      usersRef.current = users
    }

    setIsLoading(true)

    getUsers(page)
      .then((usersResult) => {
        storeUsers(usersResult)
      })
      .catch(setError)
      .finally(() => {
        setIsLoading(false)
      })
  }, [page])

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

  const handleDeleteUser = (email: string) => {
    const newUsersList = users.filter(
      (x) => x.email.toLowerCase() !== email.toLowerCase()
    )
    setUsers(newUsersList)
  }

  const handleResetUsers = () => {
    setUsers(usersRef.current)
  }

  const handleOnCountryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterCountry(e.currentTarget.value)
  }

  const handleSetBg = () => {
    setBgColor(!bgColor)
  }

  const handleSortBy = (sortByColumn: SortByColumn) => {
    setSortByColumn(sortByColumn)
  }

  function handleLoadMore(): void {
    setPage((prevState) => prevState + 1)
  }

  return (
    <>
      <header>
        <h1>React Interactive form</h1>
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

        {!isLoading && !Error && sortedUsers?.length >= 8 && (
          <button onClick={handleLoadMore}>Load more</button>
        )}

        {/* TODO: Lets create a component for this */}
        {isLoading && <strong className='message'>Loading..</strong>}

        {sortedUsers.length <= 0 && !Error && !isLoading && (
          <strong className='message'>There's no data</strong>
        )}
        {!isLoading && Error && (
          <strong className='message'>Error fetching data</strong>
        )}
      </main>
    </>
  )
}

export default App
