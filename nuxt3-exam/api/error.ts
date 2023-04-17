// import { AxiosError } from 'axios';

// export type AxiosErrorType = AxiosError<{
//   res: { message: string[] | string; error: string };
// }>;

// export const ErrorMessage = (err: AxiosErrorType) => {
//   const _message = err.response?.data?.res?.message;
//   const __message = _message instanceof Array ? _message[0] : _message;
//   const _error = err.response?.data?.res?.error;
//   return `[${_error}] -  ${__message}`;
// };
