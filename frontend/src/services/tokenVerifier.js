import { cognitoConfig } from "../config/cognito";

const region = cognitoConfig.UserPoolId.split("_")[0];
const issuer = `https://cognito-idp.${region}.amazonaws.com/${cognitoConfig.UserPoolId}`;

let jwksPromise = null;

// Cognito's public signing keys; cached for the page lifetime
function getJwks() {
  if (!jwksPromise) {
    jwksPromise = fetch(`${issuer}/.well-known/jwks.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not load Cognito signing keys");
        return res.json();
      })
      .catch((err) => {
        jwksPromise = null;
        throw err;
      });
  }
  return jwksPromise;
}

function base64UrlToBytes(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

function decodeJson(part) {
  return JSON.parse(new TextDecoder().decode(base64UrlToBytes(part)));
}

// Checks the RS256 signature, issuer, audience, token type and expiry.
// Resolves with the claims, or throws if anything is wrong.
export async function verifyIdToken(token) {
  const [headerPart, payloadPart, signaturePart] = token.split(".");
  if (!headerPart || !payloadPart || !signaturePart) throw new Error("Malformed token");

  const header = decodeJson(headerPart);
  if (header.alg !== "RS256") throw new Error("Unexpected signing algorithm");

  const { keys } = await getJwks();
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("Unknown signing key");

  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const signatureValid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlToBytes(signaturePart),
    new TextEncoder().encode(`${headerPart}.${payloadPart}`)
  );
  if (!signatureValid) throw new Error("Invalid token signature");

  const claims = decodeJson(payloadPart);
  const now = Math.floor(Date.now() / 1000);
  if (
    claims.iss !== issuer ||
    claims.token_use !== "id" ||
    claims.aud !== cognitoConfig.ClientId ||
    typeof claims.exp !== "number" ||
    claims.exp <= now
  ) {
    throw new Error("Token claims are not valid");
  }
  return claims;
}
