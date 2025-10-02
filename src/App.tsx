import './App.css'
import { useEffect, useState } from 'react'
import { type User } from './types.d'
const API_URL = 'YOUR API HERE'
function App() {
  const [users, setUsers] = useState<User[]>([])
  const [sortByCountry, setsortByCountry] = useState(false)

  useEffect(() => {
    fetch(API_URL)
      .then((data) => data.json())
      .then((data) => setUsers(data.results))
  }, [])

  const sortedUsers = sortByCountry
    ? users.toSorted((a: User, b: User) =>
        a.location.country.localeCompare(b.location.country)
      )
    : users

  const handleSortUsers = () => {
    setsortByCountry(!sortByCountry)
  }

  const handleDeleteUser = (email: string) => {
    const newUsersList = users.filter(
      (x) => x.email.toLowerCase() !== email.toLowerCase()
    )
    setUsers(newUsersList)
  }

  return (
    <>
      <header>
        <h1>React Interactive form</h1>
      </header>
      <main>
        <section>
          <button onClick={handleSortUsers}>Sort by country</button>
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
                const background = index % 2 != 0 ? 'grey' : 'transparent'
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
