import { mockBusinessRequest } from './mockRequest'

export function getApprovalBootstrapData(role) {
  const riskCount = role === 'finance_auditor' ? 4 : 2

  return mockBusinessRequest({
    stats: [
      { title: '待处理审批', value: 18, desc: '合同、退款、授信审批待办' },
      { title: '超时预警', value: riskCount, desc: '超过 SLA 的审批流程' },
      { title: '本周已完成', value: 67, desc: '已完成审批单据' },
    ],
    filters: {
      defaultTab: role === 'finance_auditor' ? 'finance' : 'todo',
    },
  })
}
