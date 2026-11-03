// Cognito configuration - replace the placeholders with your own values
// (AWS Console -> Cognito -> User pools -> your pool)
export const cognitoConfig = {
  UserPoolId: "eu-north-1_UXP8ridRt", // e.g. eu-central-1_AbCdEfGhI
  ClientId: "41aqf8e3p69sbobslqmssdlm5a", // App client ID (client without a secret)
};

// Roles used by the app
export const ROLES = {
  CUSTOMER: "CUSTOMER",
  ADVISOR: "ADVISOR",
};

// Exact (case-sensitive) Cognito group name -> role. Change group names only here.
export const groupRoles = {
  customers: ROLES.CUSTOMER,
  advisors: ROLES.ADVISOR,
};

// If a user has several roles, the first one listed here wins
export const rolePriority = [ROLES.ADVISOR, ROLES.CUSTOMER];

// Landing page after login for each role
export const roleHomeRoutes = {
  [ROLES.CUSTOMER]: "/dashboard",
  [ROLES.ADVISOR]: "/advisor",
};
