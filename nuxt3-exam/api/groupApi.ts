// import { Group, Link } from "../types/common";
// // import axiosClient, { useAxiosGet } from './base';
// // import { AxiosError } from 'axios';

// export default {
//   async findAll(props: { tag?: string; page?: number; sort?: string } = {}) {
//     const { tag, page, sort } = props;
//     try {
//       return await useAxiosGet("group", { params: { tag, page, sort } });
//     } catch (err) {
//       const { message } = err as AxiosError;
//       throw new Error(message);
//     }
//   },
//   async count() {
//     try {
//       return await useAxiosGet("group/counts");
//     } catch (err) {
//       const { message } = err as AxiosError;
//       throw new Error(message);
//     }
//   },
//   async findAllTag() {
//     try {
//       return await useAxiosGet("tag");
//     } catch (err) {
//       const { message } = err as AxiosError;
//       throw new Error(message);
//     }
//   },
//   async findById(domain: string) {
//     try {
//       return await useAxiosGet(`group/${domain}`);
//     } catch (err) {
//       const { message } = err as AxiosError;
//       throw new Error(message);
//     }
//   },
//   async create(group: Group, tags: string[], links: Link[]) {
//     const { domain, title, description } = group;
//     try {
//       await axiosClient.post("group", {
//         domain,
//         title,
//         description,
//         links,
//         tags,
//       });
//     } catch (axiosError) {
//       const err = axiosError as AxiosError<{ res: { message: string } }>;
//       const message = err.response?.data?.res?.message || err.message;
//       throw new Error(message);
//     }
//   },
//   async update(id: number, group: Group, tags: string[], links: Link[]) {
//     const { domain, title, description } = group;
//     try {
//       await axiosClient.put("group", {
//         id,
//         domain,
//         title,
//         description,
//         links,
//         tags,
//       });
//     } catch (axiosError) {
//       const err = axiosError as AxiosError<{ res: { message: string } }>;
//       const message = err.response?.data?.res?.message || err.message;
//       throw new Error(message);
//     }
//   },
//   async updateLastPostCreateAt(
//     groupId?: number
//   ): Promise<{ lastPostCreatedAt: Date }> {
//     if (!groupId) throw new Error("No Group Id");
//     try {
//       const { data } = await axiosClient.patch(`group/last-post-create-at`, {
//         groupId,
//       });
//       return { lastPostCreatedAt: new Date(data.lastPostCreatedAt) };
//     } catch (axiosError) {
//       const err = axiosError as AxiosError<{ res: { message: string } }>;
//       const message = err.response?.data?.res?.message || err.message;
//       throw new Error(message);
//     }
//   },
// };
