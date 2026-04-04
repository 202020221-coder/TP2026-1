// import { http } from "@/shared/api/http";
// import { safeApiCall } from "@/shared/api/safe-api-call";
// export const uploadFile = <T>(
//   relativeUrl: string,
//   file: File,
//   signal?: AbortSignal
// ) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   return safeApiCall<T>(() =>
//     http.post(relativeUrl, formData, {
//       headers: {
//         // Let the browser/axios set the correct Content-Type with boundary
//         "Content-Type": "multipart/form-data",
//       },
//       signal,
//     })
//   );
// };