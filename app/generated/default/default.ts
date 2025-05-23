/**
 * Generated by orval v7.8.0 🍺
 * Do not edit manually.
 * FastAPI
 * OpenAPI spec version: 0.1.0
 */
import type {
  BodyReadFileUploadPost,
  HTTPValidationError,
} from "../fastAPI.schemas";

/**
 * ファイルからsysnetを読み取って永続化.
 * @summary Read File
 */
export type readFileUploadPostResponse200 = {
  data: null;
  status: 200;
};

export type readFileUploadPostResponse422 = {
  data: HTTPValidationError;
  status: 422;
};

export type readFileUploadPostResponseComposite =
  | readFileUploadPostResponse200
  | readFileUploadPostResponse422;

export type readFileUploadPostResponse = readFileUploadPostResponseComposite & {
  headers: Headers;
};

export const getReadFileUploadPostUrl = () => {
  return "https://knowde.onrender.com/upload";
};

export const readFileUploadPost = async (
  bodyReadFileUploadPost: BodyReadFileUploadPost,
  options?: RequestInit,
): Promise<readFileUploadPostResponse> => {
  const formData = new FormData();
  bodyReadFileUploadPost.files.forEach((value) =>
    formData.append("files", value),
  );

  const res = await fetch(getReadFileUploadPostUrl(), {
    ...options,
    method: "POST",
    body: formData,
  });

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data: readFileUploadPostResponse["data"] = body ? JSON.parse(body) : {};

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as readFileUploadPostResponse;
};

/**
 * Check health.
 * @summary Check Health
 */
export type checkHealthHealthGetResponse200 = {
  data: string;
  status: 200;
};

export type checkHealthHealthGetResponseComposite =
  checkHealthHealthGetResponse200;

export type checkHealthHealthGetResponse =
  checkHealthHealthGetResponseComposite & {
    headers: Headers;
  };

export const getCheckHealthHealthGetUrl = () => {
  return "https://knowde.onrender.com/health";
};

export const checkHealthHealthGet = async (
  options?: RequestInit,
): Promise<checkHealthHealthGetResponse> => {
  const res = await fetch(getCheckHealthHealthGetUrl(), {
    ...options,
    method: "GET",
  });

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data: checkHealthHealthGetResponse["data"] = body
    ? JSON.parse(body)
    : {};

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as checkHealthHealthGetResponse;
};
