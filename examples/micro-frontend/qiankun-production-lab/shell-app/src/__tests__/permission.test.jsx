import { describe, expect, it } from 'vitest'

import { buildMenusForRole, canAccessRoute } from '../config/menuConfig'

describe('menu permission', () => {
  it('shows finance menus only for finance_auditor', () => {
    const menus = buildMenusForRole('finance_auditor')

    expect(menus.map((item) => item.key)).toEqual([
      'dashboard',
      'approvals',
      'customer360',
    ])
  })

  it('blocks customer route for finance_auditor', () => {
    expect(canAccessRoute('finance_auditor', '/customers/list')).toBe(false)
  })
})
