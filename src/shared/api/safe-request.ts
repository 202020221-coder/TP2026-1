import { type AxiosRequestConfig } from "axios";
import axiosInstance from "./axios.config";
import type { APIResponse } from "../interfaces/api-response";

export async function safeRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axiosInstance.request<APIResponse<T>>(config);
  const data = response.data;
  if (data.error) {
    const error = data.error;
    throw new Error(`Error: ${error.message}`, { cause: error.details });
  }
  return data.data;
}

// function httpErrorHandler(error:Error|AxiosError) {
//   if (error === null) throw new Error('Unrecoverable error!! Error is null!')
//   if (isAxiosError(error)) {
//     //here we have a type guard check, error inside this if will be treated as AxiosError
//     const response = error?.response
//     const request = error?.request
//     //const config = error?.config //here we have access the config used to make the api call (we can make a retry using this conf)

//     if (error.code === 'ERR_NETWORK') {
//       console.log('connection problems..')
//     } else if (error.code === 'ERR_CANCELED') {
//       console.log('connection canceled..')
//     }
//     if (response) {
//       //The request was made and the server responded with a status code that falls out of the range of 2xx the http status code mentioned above
//       const statusCode = response?.status
//       if (statusCode === 404) {
//         console.log('The requested resource does not exist or has been deleted')
//       } else if (statusCode === 401) {
//         console.log('Please login to access this resource')
//         //redirect user to login
//       }
//     } else if (request) {
//       //The request was made but no response was received, `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in Node.js
//     }
//   }
//   //Something happened in setting up the request and triggered an Error
//   console.log(error.message)

// }
