import { describe, expect, it } from 'vitest'

import { buildWidgetProps } from '../qiankun/widgetBus'

describe('customer360 widget props', () => {
  it('builds the same customer payload for two widgets', async () => {
    const props = await buildWidgetProps('CUST-1001')

    expect(props.customerId).toBe('CUST-1001')
    expect(props.customerName).toBe('华东医械集团')
  })
})
