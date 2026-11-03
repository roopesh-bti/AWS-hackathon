import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { cognitoConfig, groupRoles, rolePriority, roleHomeRoutes } from "../config/cognito";
import { verifyIdToken } from "./tokenVerifier";

// The user pool object talks to AWS Cognito for us
const userPool = new CognitoUserPool(cognitoConfig);

// Register a new user. The pool uses an email alias, so the username must not
// look like an email: we generate a unique one and store the email as an attribute.
export function signUpUser(name, email, password) {
  const username = crypto.randomUUID();
  const attributes = [
    new CognitoUserAttribute({ Name: "name", Value: name }),
    new CognitoUserAttribute({ Name: "email", Value: email }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, attributes, null, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function saveSession(session) {
  const token = session.getIdToken().getJwtToken();
  localStorage.setItem("token", token);
  return token;
}

// Resolves { status: "SUCCESS", token } or, for a first login with a temporary
// password, { status: "NEW_PASSWORD_REQUIRED", user, requiredAttributes }.
export function loginUser(email, password) {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session) => resolve({ status: "SUCCESS", token: saveSession(session) }),
      onFailure: (err) => reject(err),
      newPasswordRequired: (userAttributes, requiredAttributes) =>
        resolve({ status: "NEW_PASSWORD_REQUIRED", user, requiredAttributes }),
    });
  });
}

// Answers the challenge; must use the same CognitoUser that loginUser returned.
export function completeNewPassword(user, newPassword, requiredAttributeData = {}) {
  return new Promise((resolve, reject) => {
    user.completeNewPasswordChallenge(newPassword, requiredAttributeData, {
      onSuccess: (session) => resolve(saveSession(session)),
      onFailure: (err) => reject(err),
    });
  });
}

// Log out: sign out of Cognito and clear localStorage (except the "Remember me" email)
export function logoutUser() {
  const currentUser = userPool.getCurrentUser();
  if (currentUser) currentUser.signOut();
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  localStorage.clear();
  if (rememberedEmail) localStorage.setItem("rememberedEmail", rememberedEmail);
}

// Read the user's name from the JWT payload (falls back to the email)
export function getUserName() {
  try {
    const payload = localStorage.getItem("token").split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const claims = JSON.parse(json);
    return claims.name || claims.email || "User";
  } catch {
    return "User";
  }
}

// Helper used by the protected route: is a token stored?
export function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

// Role from the `cognito:groups` claim, or null when there is no recognised group
export function getRoleFromClaims(claims) {
  const groups = Array.isArray(claims?.["cognito:groups"]) ? claims["cognito:groups"] : [];
  const roles = groups
    .filter((group) => Object.hasOwn(groupRoles, group))
    .map((group) => groupRoles[group]);
  return rolePriority.find((role) => roles.includes(role)) || null;
}

// Signature-checked ID token claims for the current Cognito session, or null.
// getSession refreshes an expired token with the refresh token when it can.
function getVerifiedClaims() {
  return new Promise((resolve) => {
    const user = userPool.getCurrentUser();
    if (!user) return resolve(null);

    user.getSession(async (err, session) => {
      if (err || !session || !session.isValid()) return resolve(null);
      try {
        const token = session.getIdToken().getJwtToken();
        const claims = await verifyIdToken(token);
        localStorage.setItem("token", token); // keeps the display helpers current after a refresh
        resolve(claims);
      } catch {
        resolve(null);
      }
    });
  });
}

// { authenticated, role } derived from the verified token, never from app-stored values
export async function getSessionAccess() {
  const claims = await getVerifiedClaims();
  return { authenticated: Boolean(claims), role: claims ? getRoleFromClaims(claims) : null };
}

// Where to send the user right after login
export async function getHomeRoute() {
  const { role } = await getSessionAccess();
  return role ? roleHomeRoutes[role] : "/access-denied";
}
