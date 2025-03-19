/**
 * Example "dynamic" config specifying what roles can access which path patterns.
 * You might load this from a DB or environment in a more complex scenario.
 */
export const routePermissions = [
  {
    // e.g., "/admin" and anything beneath it
    pattern: /^\/admin/,
    allowedRoles: ["Admin"], // must have "Admin" role
  },
  {
    pattern: /^\/editor/,
    allowedRoles: ["Editor"], // must have "Editor" role
  },
  // You can add more, or even have multiple roles, e.g. ["Editor", "Admin"]
];
