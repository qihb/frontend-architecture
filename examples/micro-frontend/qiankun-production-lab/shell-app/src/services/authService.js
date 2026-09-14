import { buildMenusForRole, ROLE_LABELS } from '../config/menuConfig'
import { mockBusinessRequest } from './mockRequest'

export function getUserProfile(role) {
  return mockBusinessRequest({
    id: 'u_001',
    name: '李晨',
    role,
    roleLabel: ROLE_LABELS[role],
    tenantId: 'tenant-east',
    orgId: 'org-east-01',
  })
}

export function getMenuPermissions(role) {
  return mockBusinessRequest({
    role,
    menus: buildMenusForRole(role),
  })
}
