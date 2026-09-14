import { describe, expect, it } from 'vitest'

import { getAvailableAppsForRole } from '../config/microApps'

describe('micro app registry', () => {
  it('hides analytics app for finance_auditor', () => {
    const apps = getAvailableAppsForRole('finance_auditor')

    expect(apps.find((item) => item.name === 'analytics-vue3')).toBeUndefined()
  })
})
