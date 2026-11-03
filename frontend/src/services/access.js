import { roleHomeRoutes } from "../config/cognito";

// Decides what a route guard should do for the current session.
// `access` is { authenticated, role } from getSessionAccess(), or null while it is loading.
export function resolveAccess(access, allowedRoles) {
  if (!access) return { action: "wait" };
  if (!access.authenticated) return { action: "redirect", to: "/login" };
  if (!access.role) return { action: "redirect", to: "/access-denied" };
  if (!allowedRoles.includes(access.role)) {
    return { action: "redirect", to: roleHomeRoutes[access.role] };
  }
  return { action: "allow" };
}
