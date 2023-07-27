import { BottomSheet, LocalStorage } from "quasar";

export const showOrderBottomSheet = (props: {
  order: string;
  okCallback: (id: string) => void;
}) => {
  const checkedIcon = (name: string) =>
    props.order === name ? "check_box" : "check_box_outline_blank";
  BottomSheet.create({
    message: "정렬",
    grid: false,
    actions: [
      {
        label: "포스트 최신 작성순",
        id: "lastPostCreatedAt",
        icon: checkedIcon("lastPostCreatedAt"),
      },
      {
        label: "주간 게시물 많은 순",
        id: "weeklyAvgPost",
        icon: checkedIcon("weeklyAvgPost"),
      },
      {
        label: "투데이 방문자 순",
        id: "todayViews",
        icon: checkedIcon("todayViews"),
      },
      {
        label: "누적 방문자 순",
        id: "totalViews",
        icon: checkedIcon("totalViews"),
      },
    ],
  }).onOk((action) => {
    LocalStorage.set("groupSort", action.id);
    props.okCallback(action.id);
  });
};
