/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type { Key } from "swr";

import useSWRMutation from "swr/mutation";
import type { SWRMutationConfiguration } from "swr/mutation";

import type {
  ClerkPayload,
  ClerkWebhookWebhookClerkPost200,
  HTTPValidationError,
} from "../fastAPI.schemas";

/**
 * ClerkでのUser CRUDがwebhookでこのAPIに連携される.
 * @summary Clerk Webhook
 */
export type clerkWebhookWebhookClerkPostResponse200 = {
  data: ClerkWebhookWebhookClerkPost200;
  status: 200;
};

export type clerkWebhookWebhookClerkPostResponse422 = {
  data: HTTPValidationError;
  status: 422;
};

export type clerkWebhookWebhookClerkPostResponseComposite =
  | clerkWebhookWebhookClerkPostResponse200
  | clerkWebhookWebhookClerkPostResponse422;

export type clerkWebhookWebhookClerkPostResponse =
  clerkWebhookWebhookClerkPostResponseComposite & {
    headers: Headers;
  };

export const getClerkWebhookWebhookClerkPostUrl = () => {
  return "https://knowde.onrender.com/webhook/clerk";
};

export const clerkWebhookWebhookClerkPost = async (
  clerkPayload: ClerkPayload,
  options?: RequestInit,
): Promise<clerkWebhookWebhookClerkPostResponse> => {
  const res = await fetch(getClerkWebhookWebhookClerkPostUrl(), {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(clerkPayload),
  });

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data: clerkWebhookWebhookClerkPostResponse["data"] = body
    ? JSON.parse(body)
    : {};

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as clerkWebhookWebhookClerkPostResponse;
};

export const getClerkWebhookWebhookClerkPostMutationFetcher = (
  options?: RequestInit,
) => {
  return (
    _: Key,
    { arg }: { arg: ClerkPayload },
  ): Promise<clerkWebhookWebhookClerkPostResponse> => {
    return clerkWebhookWebhookClerkPost(arg, options);
  };
};
export const getClerkWebhookWebhookClerkPostMutationKey = () =>
  ["https://knowde.onrender.com/webhook/clerk"] as const;

export type ClerkWebhookWebhookClerkPostMutationResult = NonNullable<
  Awaited<ReturnType<typeof clerkWebhookWebhookClerkPost>>
>;
export type ClerkWebhookWebhookClerkPostMutationError =
  Promise<HTTPValidationError>;

/**
 * @summary Clerk Webhook
 */
export const useClerkWebhookWebhookClerkPost = <
  TError = Promise<HTTPValidationError>,
>(options?: {
  swr?: SWRMutationConfiguration<
    Awaited<ReturnType<typeof clerkWebhookWebhookClerkPost>>,
    TError,
    Key,
    ClerkPayload,
    Awaited<ReturnType<typeof clerkWebhookWebhookClerkPost>>
  > & { swrKey?: string };
  fetch?: RequestInit;
}) => {
  const { swr: swrOptions, fetch: fetchOptions } = options ?? {};

  const swrKey =
    swrOptions?.swrKey ?? getClerkWebhookWebhookClerkPostMutationKey();
  const swrFn = getClerkWebhookWebhookClerkPostMutationFetcher(fetchOptions);

  const query = useSWRMutation(swrKey, swrFn, swrOptions);

  return {
    swrKey,
    ...query,
  };
};
