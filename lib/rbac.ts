export const roleRank = {
  USER: 1,
  STUDENT: 2,
  INSTRUCTOR: 3,
  ADMIN: 4,
} as const;

export type Role = keyof typeof roleRank;

export function hasAtLeastRole(userRole: Role, requiredRole: Role) {
  return roleRank[userRole] >= roleRank[requiredRole];
}
