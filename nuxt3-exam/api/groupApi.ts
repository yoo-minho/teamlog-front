import { Tag, TeamFormType, Team } from "@/types/common";
import { TeamCountResultType, TeamCreateJson, TeamFilter } from "@/types/api";

export default {
  findAll(props: TeamFilter) {
    const { tag, page, sort } = props;
    return useAPIFetch<Team[]>("group", {
      params: { page, sort, tag },
      lazy: true,
    });
  },
  count() {
    return useAPIFetch<TeamCountResultType>("group/counts");
  },
  findAllTag() {
    return useAPIFetch<Tag[]>("tag", { lazy: true });
  },
  findByDomain(domain: string) {
    return useAPIFetch<Team>(`group/${domain}`, { lazy: true });
  },
  create(props: TeamCreateJson) {
    const { domain, title, description, tags, links } = props;
    return useAPIFetchWithGuard("group", {
      method: "post",
      body: { domain, title, description, tags, links },
    });
  },
  update(props: TeamFormType) {
    const { id, domain, title, description, tags, links } = props;
    return useAPIFetchWithGuard("group", {
      method: "put",
      body: { id, domain, title, description, tags, links },
    });
  },
  delete(id?: number) {
    if (!id) throw new Error(`유효한 아이디가 아닙니다. ${id}`);
    return useAPIFetchWithGuard("group", { method: "delete", body: { id } });
  },
  updateLastPostCreateAt(groupId?: number) {
    if (!groupId) throw new Error("No Group Id");
    return useAPIFetch("group/last-post-create-at", {
      method: "put",
      body: { groupId },
    });
  },
  updateStat(groupId?: number) {
    if (!groupId) throw new Error("No Group Id");
    return useAPIFetch("group/stat", {
      method: "put",
      body: { groupId },
    });
  },
};
