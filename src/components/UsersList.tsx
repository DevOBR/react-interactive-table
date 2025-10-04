import { SortByColumn, type User } from '../types.d'

export interface UsersListProps {
  users: User[]
  isColoredTable: boolean
  handleSortBy: (sortByColumn: SortByColumn) => void
  handleDeleteUser: (email: string) => void
}

export function UserList({
  users,
  isColoredTable,
  handleSortBy,
  handleDeleteUser
}: UsersListProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Picture</th>
          <th onClick={() => handleSortBy(SortByColumn.Name)}>Name</th>
          <th onClick={() => handleSortBy(SortByColumn.Gender)}>Gender</th>
          <th onClick={() => handleSortBy(SortByColumn.Country)}>Country</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users &&
          users.map((x: User, index: number) => {
            const background =
              (isColoredTable && index % 2) != 0 ? 'grey' : 'transparent'
            return (
              <tr key={x.login.uuid} style={{ background: background }}>
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
  )
}
