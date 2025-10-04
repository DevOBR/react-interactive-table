import './App.css'
import { useEffect, useState, useRef, useMemo, type ChangeEvent } from 'react'
import { SortByColumn, type User } from './types.d'
import { UserList } from './components/UsersList'
import { ActionButtonBar } from './components/ActionButtonBar'
import { getUsers } from './services/users'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [sortByColumn, setSortByColumn] = useState(SortByColumn.None)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState(false)

  const usersRef = useRef<User[]>([])
  const filteredUsersRef = useRef<User[]>([])

  useEffect(() => {
    const storeUsers = (users: User[]) => {
      setUsers(users)
      usersRef.current = users
    }

    getUsers()
      .then((users) => storeUsers(users))
      .catch((e) => console.log(e))
  }, [])

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

        <UserList
          users={sortedUsers}
          isColoredTable={bgColor}
          handleSortBy={handleSortBy}
          handleDeleteUser={handleDeleteUser}
        />
      </main>
    </>
  )
}

export default App
