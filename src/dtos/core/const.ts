export type ApiResponseStatus = "Ok" | "Error";

export const API_RESPONSE_STATUS: {
  [key in ApiResponseStatus]: ApiResponseStatus;
} = {
  Ok: "Ok",
  Error: "Error",
};