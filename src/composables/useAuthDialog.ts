export const showAuthDialog = (props: { to: string }) => {
  Dialog.create({
    title: "로그인 요청",
    message: "로그인이 필요합니다.\n로그인 페이지로 이동할까요?",
    ok: "이동하기",
    cancel: "취소",
  }).onOk(() => {
    navigateTo({ path: "/my", query: { to: props.to } });
  });
};
