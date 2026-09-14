import { describe, expect, it, vi } from 'vitest'

import { mockBusinessRequest } from '../services/mockRequest'

describe('mockBusinessRequest', () => {
  it('resolves with delay metadata', async () => {
    vi.useFakeTimers()

    const task = mockBusinessRequest({ ok: true }, { min: 200, max: 200 })
    vi.advanceTimersByTime(200)

    const result = await task

    expect(result.success).toBe(true)
    expect(result.delay).toBe(200)
    expect(result.data).toEqual({ ok: true })

    vi.useRealTimers()
  })
})
