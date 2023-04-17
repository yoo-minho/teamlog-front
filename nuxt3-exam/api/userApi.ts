// import { useAxiosGet } from './base';
// import { AxiosError } from 'axios';

// export default {
//   async findUser() {
//     try {
//       return await useAxiosGet("user");
//     } catch (err) {
//       const { message } = err as AxiosError;
//       throw new Error(message);
//     }
//   },
//   async loginKakao() {
//     try {
//       return await useAxiosGet("auth/kakao");
//     } catch (err) {
//       const { message } = err as AxiosError;
//       throw new Error(message);
//     }
//   },
//   async logoutUser() {
//     try {
//       return await useAxiosGet("auth/logout");
//     } catch (err) {
//       const { message } = err as AxiosError;
//       throw new Error(message);
//     }
//   },
// };
