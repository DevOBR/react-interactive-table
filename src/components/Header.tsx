import { useUsers } from '../hooks/useUsers'

export function Heaeder() {
  const { users } = useUsers()
  return (
    <header>
      <h1>React Interactive form: {users?.length}</h1>
    </header>
  )
}
