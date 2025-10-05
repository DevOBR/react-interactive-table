import type { ChangeEvent } from 'react'

export interface ActionButtonBar {
  handleSetBg: () => void
  handleSortUsers: () => void
  handleResetUsers: () => void
  handleOnCountryChange: (e: ChangeEvent<HTMLInputElement>) => void
}
export function ActionButtonBar({
  handleSetBg,
  handleSortUsers,
  handleResetUsers,
  handleOnCountryChange
}: ActionButtonBar) {
  return (
    <section>
      <button onClick={handleSetBg}>Set color rows</button>
      <button onClick={handleSortUsers}>Sort by country</button>
      <button onClick={handleResetUsers}>Resotre data</button>
      <input
        type='text'
        placeholder='Enter country'
        onChange={handleOnCountryChange}
      />
    </section>
  )
}
