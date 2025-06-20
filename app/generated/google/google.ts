/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import useSwr from "swr";
import type { Key, SWRConfiguration } from "swr";

import type {
  ErrorModel,
  HTTPValidationError,
  OAuth2AuthorizeResponse,
  OauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetParams,
  OauthGoogleCookieCallbackGoogleCookieCallbackGetParams,
  OauthGoogleJwtAuthorizeGoogleAuthorizeGetParams,
  OauthGoogleJwtCallbackGoogleCallbackGetParams,
} from "../fastAPI.schemas";

/**
 * @summary Oauth:Google.Jwt.Authorize
 */
export type oauthGoogleJwtAuthorizeGoogleAuthorizeGetResponse200 = {
  data: OAuth2AuthorizeResponse;
  status: 200;
};

export type oauthGoogleJwtAuthorizeGoogleAuthorizeGetResponse422 = {
  data: HTTPValidationError;
  status: 422;
};

export type oauthGoogleJwtAuthorizeGoogleAuthorizeGetResponseComposite =
  | oauthGoogleJwtAuthorizeGoogleAuthorizeGetResponse200
  | oauthGoogleJwtAuthorizeGoogleAuthorizeGetResponse422;

export type oauthGoogleJwtAuthorizeGoogleAuthorizeGetResponse =
  oauthGoogleJwtAuthorizeGoogleAuthorizeGetResponseComposite & {
    headers: Headers;
  };

export const getOauthGoogleJwtAuthorizeGoogleAuthorizeGetUrl = (
  params?: OauthGoogleJwtAuthorizeGoogleAuthorizeGetParams,
) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0
    ? `https://knowde.onrender.com/google/authorize?${stringifiedParams}`
    : "https://knowde.onrender.com/google/authorize";
};

export const oauthGoogleJwtAuthorizeGoogleAuthorizeGet = async (
  params?: OauthGoogleJwtAuthorizeGoogleAuthorizeGetParams,
  options?: RequestInit,
): Promise<oauthGoogleJwtAuthorizeGoogleAuthorizeGetResponse> => {
  const res = await fetch(
    getOauthGoogleJwtAuthorizeGoogleAuthorizeGetUrl(params),
    {
      ...options,
      method: "GET",
    },
  );

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data: oauthGoogleJwtAuthorizeGoogleAuthorizeGetResponse["data"] = body
    ? JSON.parse(body)
    : {};

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as oauthGoogleJwtAuthorizeGoogleAuthorizeGetResponse;
};

export const getOauthGoogleJwtAuthorizeGoogleAuthorizeGetKey = (
  params?: OauthGoogleJwtAuthorizeGoogleAuthorizeGetParams,
) =>
  [
    "https://knowde.onrender.com/google/authorize",
    ...(params ? [params] : []),
  ] as const;

export type OauthGoogleJwtAuthorizeGoogleAuthorizeGetQueryResult = NonNullable<
  Awaited<ReturnType<typeof oauthGoogleJwtAuthorizeGoogleAuthorizeGet>>
>;
export type OauthGoogleJwtAuthorizeGoogleAuthorizeGetQueryError =
  Promise<HTTPValidationError>;

/**
 * @summary Oauth:Google.Jwt.Authorize
 */
export const useOauthGoogleJwtAuthorizeGoogleAuthorizeGet = <
  TError = Promise<HTTPValidationError>,
>(
  params?: OauthGoogleJwtAuthorizeGoogleAuthorizeGetParams,
  options?: {
    swr?: SWRConfiguration<
      Awaited<ReturnType<typeof oauthGoogleJwtAuthorizeGoogleAuthorizeGet>>,
      TError
    > & { swrKey?: Key; enabled?: boolean };
    fetch?: RequestInit;
  },
) => {
  const { swr: swrOptions, fetch: fetchOptions } = options ?? {};

  const isEnabled = swrOptions?.enabled !== false;
  const swrKey =
    swrOptions?.swrKey ??
    (() =>
      isEnabled
        ? getOauthGoogleJwtAuthorizeGoogleAuthorizeGetKey(params)
        : null);
  const swrFn = () =>
    oauthGoogleJwtAuthorizeGoogleAuthorizeGet(params, fetchOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(
    swrKey,
    swrFn,
    swrOptions,
  );

  return {
    swrKey,
    ...query,
  };
};
/**
 * The response varies based on the authentication backend used.
 * @summary Oauth:Google.Jwt.Callback
 */
export type oauthGoogleJwtCallbackGoogleCallbackGetResponse200 = {
  data: unknown;
  status: 200;
};

export type oauthGoogleJwtCallbackGoogleCallbackGetResponse400 = {
  data: ErrorModel;
  status: 400;
};

export type oauthGoogleJwtCallbackGoogleCallbackGetResponse422 = {
  data: HTTPValidationError;
  status: 422;
};

export type oauthGoogleJwtCallbackGoogleCallbackGetResponseComposite =
  | oauthGoogleJwtCallbackGoogleCallbackGetResponse200
  | oauthGoogleJwtCallbackGoogleCallbackGetResponse400
  | oauthGoogleJwtCallbackGoogleCallbackGetResponse422;

export type oauthGoogleJwtCallbackGoogleCallbackGetResponse =
  oauthGoogleJwtCallbackGoogleCallbackGetResponseComposite & {
    headers: Headers;
  };

export const getOauthGoogleJwtCallbackGoogleCallbackGetUrl = (
  params?: OauthGoogleJwtCallbackGoogleCallbackGetParams,
) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0
    ? `https://knowde.onrender.com/google/callback?${stringifiedParams}`
    : "https://knowde.onrender.com/google/callback";
};

export const oauthGoogleJwtCallbackGoogleCallbackGet = async (
  params?: OauthGoogleJwtCallbackGoogleCallbackGetParams,
  options?: RequestInit,
): Promise<oauthGoogleJwtCallbackGoogleCallbackGetResponse> => {
  const res = await fetch(
    getOauthGoogleJwtCallbackGoogleCallbackGetUrl(params),
    {
      ...options,
      method: "GET",
    },
  );

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data: oauthGoogleJwtCallbackGoogleCallbackGetResponse["data"] = body
    ? JSON.parse(body)
    : {};

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as oauthGoogleJwtCallbackGoogleCallbackGetResponse;
};

export const getOauthGoogleJwtCallbackGoogleCallbackGetKey = (
  params?: OauthGoogleJwtCallbackGoogleCallbackGetParams,
) =>
  [
    "https://knowde.onrender.com/google/callback",
    ...(params ? [params] : []),
  ] as const;

export type OauthGoogleJwtCallbackGoogleCallbackGetQueryResult = NonNullable<
  Awaited<ReturnType<typeof oauthGoogleJwtCallbackGoogleCallbackGet>>
>;
export type OauthGoogleJwtCallbackGoogleCallbackGetQueryError = Promise<
  ErrorModel | HTTPValidationError
>;

/**
 * @summary Oauth:Google.Jwt.Callback
 */
export const useOauthGoogleJwtCallbackGoogleCallbackGet = <
  TError = Promise<ErrorModel | HTTPValidationError>,
>(
  params?: OauthGoogleJwtCallbackGoogleCallbackGetParams,
  options?: {
    swr?: SWRConfiguration<
      Awaited<ReturnType<typeof oauthGoogleJwtCallbackGoogleCallbackGet>>,
      TError
    > & { swrKey?: Key; enabled?: boolean };
    fetch?: RequestInit;
  },
) => {
  const { swr: swrOptions, fetch: fetchOptions } = options ?? {};

  const isEnabled = swrOptions?.enabled !== false;
  const swrKey =
    swrOptions?.swrKey ??
    (() =>
      isEnabled ? getOauthGoogleJwtCallbackGoogleCallbackGetKey(params) : null);
  const swrFn = () =>
    oauthGoogleJwtCallbackGoogleCallbackGet(params, fetchOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(
    swrKey,
    swrFn,
    swrOptions,
  );

  return {
    swrKey,
    ...query,
  };
};
/**
 * @summary Oauth:Google.Cookie.Authorize
 */
export type oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetResponse200 = {
  data: OAuth2AuthorizeResponse;
  status: 200;
};

export type oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetResponse422 = {
  data: HTTPValidationError;
  status: 422;
};

export type oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetResponseComposite =
  | oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetResponse200
  | oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetResponse422;

export type oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetResponse =
  oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetResponseComposite & {
    headers: Headers;
  };

export const getOauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetUrl = (
  params?: OauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetParams,
) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0
    ? `https://knowde.onrender.com/google/cookie/authorize?${stringifiedParams}`
    : "https://knowde.onrender.com/google/cookie/authorize";
};

export const oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet = async (
  params?: OauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetParams,
  options?: RequestInit,
): Promise<oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetResponse> => {
  const res = await fetch(
    getOauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetUrl(params),
    {
      ...options,
      method: "GET",
    },
  );

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data: oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetResponse["data"] =
    body ? JSON.parse(body) : {};

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetResponse;
};

export const getOauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetKey = (
  params?: OauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetParams,
) =>
  [
    "https://knowde.onrender.com/google/cookie/authorize",
    ...(params ? [params] : []),
  ] as const;

export type OauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetQueryResult =
  NonNullable<
    Awaited<
      ReturnType<typeof oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet>
    >
  >;
export type OauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetQueryError =
  Promise<HTTPValidationError>;

/**
 * @summary Oauth:Google.Cookie.Authorize
 */
export const useOauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet = <
  TError = Promise<HTTPValidationError>,
>(
  params?: OauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetParams,
  options?: {
    swr?: SWRConfiguration<
      Awaited<
        ReturnType<typeof oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet>
      >,
      TError
    > & { swrKey?: Key; enabled?: boolean };
    fetch?: RequestInit;
  },
) => {
  const { swr: swrOptions, fetch: fetchOptions } = options ?? {};

  const isEnabled = swrOptions?.enabled !== false;
  const swrKey =
    swrOptions?.swrKey ??
    (() =>
      isEnabled
        ? getOauthGoogleCookieAuthorizeGoogleCookieAuthorizeGetKey(params)
        : null);
  const swrFn = () =>
    oauthGoogleCookieAuthorizeGoogleCookieAuthorizeGet(params, fetchOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(
    swrKey,
    swrFn,
    swrOptions,
  );

  return {
    swrKey,
    ...query,
  };
};
/**
 * The response varies based on the authentication backend used.
 * @summary Oauth:Google.Cookie.Callback
 */
export type oauthGoogleCookieCallbackGoogleCookieCallbackGetResponse200 = {
  data: unknown;
  status: 200;
};

export type oauthGoogleCookieCallbackGoogleCookieCallbackGetResponse400 = {
  data: ErrorModel;
  status: 400;
};

export type oauthGoogleCookieCallbackGoogleCookieCallbackGetResponse422 = {
  data: HTTPValidationError;
  status: 422;
};

export type oauthGoogleCookieCallbackGoogleCookieCallbackGetResponseComposite =
  | oauthGoogleCookieCallbackGoogleCookieCallbackGetResponse200
  | oauthGoogleCookieCallbackGoogleCookieCallbackGetResponse400
  | oauthGoogleCookieCallbackGoogleCookieCallbackGetResponse422;

export type oauthGoogleCookieCallbackGoogleCookieCallbackGetResponse =
  oauthGoogleCookieCallbackGoogleCookieCallbackGetResponseComposite & {
    headers: Headers;
  };

export const getOauthGoogleCookieCallbackGoogleCookieCallbackGetUrl = (
  params?: OauthGoogleCookieCallbackGoogleCookieCallbackGetParams,
) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0
    ? `https://knowde.onrender.com/google/cookie/callback?${stringifiedParams}`
    : "https://knowde.onrender.com/google/cookie/callback";
};

export const oauthGoogleCookieCallbackGoogleCookieCallbackGet = async (
  params?: OauthGoogleCookieCallbackGoogleCookieCallbackGetParams,
  options?: RequestInit,
): Promise<oauthGoogleCookieCallbackGoogleCookieCallbackGetResponse> => {
  const res = await fetch(
    getOauthGoogleCookieCallbackGoogleCookieCallbackGetUrl(params),
    {
      ...options,
      method: "GET",
    },
  );

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data: oauthGoogleCookieCallbackGoogleCookieCallbackGetResponse["data"] =
    body ? JSON.parse(body) : {};

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as oauthGoogleCookieCallbackGoogleCookieCallbackGetResponse;
};

export const getOauthGoogleCookieCallbackGoogleCookieCallbackGetKey = (
  params?: OauthGoogleCookieCallbackGoogleCookieCallbackGetParams,
) =>
  [
    "https://knowde.onrender.com/google/cookie/callback",
    ...(params ? [params] : []),
  ] as const;

export type OauthGoogleCookieCallbackGoogleCookieCallbackGetQueryResult =
  NonNullable<
    Awaited<ReturnType<typeof oauthGoogleCookieCallbackGoogleCookieCallbackGet>>
  >;
export type OauthGoogleCookieCallbackGoogleCookieCallbackGetQueryError =
  Promise<ErrorModel | HTTPValidationError>;

/**
 * @summary Oauth:Google.Cookie.Callback
 */
export const useOauthGoogleCookieCallbackGoogleCookieCallbackGet = <
  TError = Promise<ErrorModel | HTTPValidationError>,
>(
  params?: OauthGoogleCookieCallbackGoogleCookieCallbackGetParams,
  options?: {
    swr?: SWRConfiguration<
      Awaited<
        ReturnType<typeof oauthGoogleCookieCallbackGoogleCookieCallbackGet>
      >,
      TError
    > & { swrKey?: Key; enabled?: boolean };
    fetch?: RequestInit;
  },
) => {
  const { swr: swrOptions, fetch: fetchOptions } = options ?? {};

  const isEnabled = swrOptions?.enabled !== false;
  const swrKey =
    swrOptions?.swrKey ??
    (() =>
      isEnabled
        ? getOauthGoogleCookieCallbackGoogleCookieCallbackGetKey(params)
        : null);
  const swrFn = () =>
    oauthGoogleCookieCallbackGoogleCookieCallbackGet(params, fetchOptions);

  const query = useSwr<Awaited<ReturnType<typeof swrFn>>, TError>(
    swrKey,
    swrFn,
    swrOptions,
  );

  return {
    swrKey,
    ...query,
  };
};
