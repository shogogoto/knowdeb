/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import { z as zod } from "zod";

/**
 * @summary Auth:Jwt.Login
 */
export const authJwtLoginAuthJwtLoginPostResponse = zod.object({
  access_token: zod.string(),
  token_type: zod.string(),
});

/**
 * @summary Auth:Jwt.Logout
 */
export const authJwtLogoutAuthJwtLogoutPostResponse = zod.any();

/**
 * @summary Register:Register
 */
export const registerRegisterAuthRegisterPostBodyIsActiveDefault = true;
export const registerRegisterAuthRegisterPostBodyIsSuperuserDefault = false;
export const registerRegisterAuthRegisterPostBodyIsVerifiedDefault = false;

export const registerRegisterAuthRegisterPostBody = zod
  .object({
    email: zod.string().email(),
    password: zod.string(),
    is_active: zod
      .boolean()
      .or(zod.null())
      .default(registerRegisterAuthRegisterPostBodyIsActiveDefault),
    is_superuser: zod.boolean().or(zod.null()).optional(),
    is_verified: zod.boolean().or(zod.null()).optional(),
  })
  .describe("作成.");

/**
 * @summary Reset:Forgot Password
 */
export const resetForgotPasswordAuthForgotPasswordPostBody = zod.object({
  email: zod.string().email(),
});

/**
 * @summary Reset:Reset Password
 */
export const resetResetPasswordAuthResetPasswordPostBody = zod.object({
  token: zod.string(),
  password: zod.string(),
});

export const resetResetPasswordAuthResetPasswordPostResponse = zod.any();

/**
 * @summary Verify:Request-Token
 */
export const verifyRequestTokenAuthRequestVerifyTokenPostBody = zod.object({
  email: zod.string().email(),
});

/**
 * @summary Verify:Verify
 */
export const verifyVerifyAuthVerifyPostBody = zod.object({
  token: zod.string(),
});

export const verifyVerifyAuthVerifyPostResponseIsActiveDefault = true;
export const verifyVerifyAuthVerifyPostResponseIsSuperuserDefault = false;
export const verifyVerifyAuthVerifyPostResponseIsVerifiedDefault = false;

export const verifyVerifyAuthVerifyPostResponse = zod
  .object({
    id: zod.string().uuid(),
    email: zod.string().email(),
    is_active: zod
      .boolean()
      .default(verifyVerifyAuthVerifyPostResponseIsActiveDefault),
    is_superuser: zod.boolean().optional(),
    is_verified: zod.boolean().optional(),
  })
  .describe("読み取り.");

/**
 * @summary Oauth:Google.Jwt.Authorize
 */
export const oauthGoogleJwtAuthorizeGoogleAuthorizeGetQueryParams = zod.object({
  scopes: zod.array(zod.string()).optional(),
});

export const oauthGoogleJwtAuthorizeGoogleAuthorizeGetResponse = zod.object({
  authorization_url: zod.string(),
});

/**
 * The response varies based on the authentication backend used.
 * @summary Oauth:Google.Jwt.Callback
 */
export const oauthGoogleJwtCallbackGoogleCallbackGetQueryParams = zod.object({
  code: zod.string().or(zod.null()).optional(),
  code_verifier: zod.string().or(zod.null()).optional(),
  state: zod.string().or(zod.null()).optional(),
  error: zod.string().or(zod.null()).optional(),
});

export const oauthGoogleJwtCallbackGoogleCallbackGetResponse = zod.any();
