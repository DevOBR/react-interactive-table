import './App.css'
import { useEffect, useState, useRef, useMemo, type ChangeEvent } from 'react'
import { type User } from './types.d'

const API_URL = import.meta.env.VITE_API_URL
function App() {
  const [users, setUsers] = useState<User[]>([])
  const [sortByCountry, setsortByCountry] = useState(false)
  const [filterCountry, setFilterCountry] = useState<string | null>(null)
  const [bgColor, setBgColor] = useState(false)

  const usersRef = useRef<User[]>([])
  const filteredUsersRef = useRef<User[]>([])

  useEffect(() => {
    const storeUsers = (result: User[]) => {
      setUsers(result)
      usersRef.current = result
    }
    fetch(API_URL)
      .then((data) => data.json())
      .then(({ results }) => storeUsers(results))
      .catch((e) => console.log(e))
  }, [])

  const filteredUsers = useMemo(() => {
    console.warn('filter')

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
    console.warn('sorted')
    return sortByCountry
      ? filteredUsers.toSorted((a: User, b: User) =>
          a.location.country.localeCompare(b.location.country)
        )
      : filteredUsers
  }, [sortByCountry, filteredUsers])

  const handleSortUsers = () => {
    setsortByCountry(!sortByCountry)
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

  return (
    <>
      <header>
        <h1>React Interactive form</h1>
      </header>
      <main>
        <section>
          <button onClick={handleSetBg}>Set color rows</button>
          <button onClick={handleSortUsers}>Sort by country</button>
          <button onClick={handleResetUsers}>Resotre Data</button>
          <input
            type='text'
            placeholder='Enter country'
            onChange={handleOnCountryChange}
          />
        </section>

        <table>
          <thead>
            <tr>
              <th>Picture</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Country</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers &&
              sortedUsers.map((x: User, index: number) => {
                const background =
                  (bgColor && index % 2) != 0 ? 'grey' : 'transparent'
                return (
                  <tr key={x.email} style={{ background: background }}>
                    <td>
                      <img src={x.picture.thumbnail} alt='' />{' '}
                    </td>
                    <td> {x.name.first} </td>
                    <td> {x.gender} </td>
                    <td> {x.location.country} </td>
                    <td>
                      <button onClick={() => handleDeleteUser(x.email)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </main>
    </>
  )
}

export default App
