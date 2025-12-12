import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";
import { createAccessControl } from "better-auth/plugins/access";

const pages = {
  ...defaultStatements,
  Dashboard: ["view"],
  Projects: ["create", "read", "update", "delete"],
  "Cost Codes": ["create", "read", "update", "delete"],
  Schedules: ["create", "read", "update", "delete"],
  "Task Management": ["create", "read", "update", "delete"],
  Comments: ["create", "read", "update", "delete"],
  Issues: ["create", "read", "update", "delete"],
  "Overall Schedule": ["create", "read", "update", "delete"],
  "AI Assist": ["use"],
  "Company Management": ["create", "read", "update", "delete", "impersonate"],
  "User Management": adminAc.statements.user,
  "Subscription Management": ["create", "read", "update", "delete"],
  Inbox: ["view", "create", "read", "update", "delete"],
  Settings: ["view", "read", "update"],
} as const;

export const ac = createAccessControl(pages);

// Admin: Business owner - can only manage companies
export const admin = ac.newRole({
  Dashboard: ["view"],
  "Company Management": ["create", "read", "update", "delete", "impersonate"],
  "User Management": adminAc.statements.user,
  "Subscription Management": ["create", "read", "update", "delete"],
  Inbox: ["view", "create", "read", "update", "delete"],
  Settings: ["view", "read", "update"],
  ...adminAc.statements,
});

// Company Admin: Can manage users (managers, field personnel, subcontractors)
export const companyAdmin = ac.newRole({
  Dashboard: ["view"],
  Projects: ["create", "read", "update", "delete"],
  "Cost Codes": ["create", "read", "update", "delete"],
  Schedules: ["create", "read", "update", "delete"],
  "Task Management": ["create", "read", "update", "delete"],
  Comments: ["create", "read", "update", "delete"],
  Issues: ["create", "read", "update", "delete"],
  "AI Assist": ["use"],
  "Overall Schedule": ["create", "read", "update", "delete"],
  "User Management": adminAc.statements.user,
  Inbox: ["view"],
  Settings: ["view", "read", "update"],
});

// Manager: Can manage users (field personnel, subcontractors)
export const manager = ac.newRole({
  Dashboard: ["view"],
  Projects: ["create", "read", "update", "delete"],
  "Cost Codes": ["create", "read", "update", "delete"],
  Schedules: ["create", "read", "update", "delete"],
  "Task Management": ["create", "read", "update", "delete"],
  Comments: ["create", "read", "update", "delete"],
  Issues: ["create", "read", "update", "delete"],
  "Overall Schedule": ["create", "read", "update", "delete"],
  "AI Assist": ["use"],
  "User Management": adminAc.statements.user,
  Inbox: ["view", "create", "read", "update", "delete"],
  Settings: ["view", "read", "update"],
});

// Field Personnel: No user management privileges
export const fieldPersonnel = ac.newRole({
  Dashboard: ["view"],
  Schedules: ["create", "read", "update", "delete"],
  "Task Management": ["create", "read", "update", "delete"],
  Comments: ["create", "read", "update", "delete"],
  Issues: ["create", "read", "update", "delete"],
  "Overall Schedule": ["read"],
  Inbox: ["view", "create", "read", "update", "delete"],
  "AI Assist": ["use"],
  Settings: ["view", "read", "update"],
});

// Subcontractor: No user management privileges
export const subContractor = ac.newRole({
  Issues: ["create", "read", "update", "delete"],
  Dashboard: ["view"],
  Projects: ["read"],
  Schedules: ["read"],
  "Task Management": ["read"], // Subcontractors can view their assigned tasks
  "Overall Schedule": ["read"],
  Inbox: ["view", "create", "read", "update", "delete"],
  Settings: ["view", "read"],
});
