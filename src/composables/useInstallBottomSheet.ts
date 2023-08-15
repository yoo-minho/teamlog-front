let prompt: BeforeInstallPromptEvent;
let isInstalled = false;
export const installed = () => {
  isInstalled = true;
};
export const savePrompt = (deferredPrompt: BeforeInstallPromptEvent) => {
  prompt = deferredPrompt;
};
export const isExistsPrompt = () => {
  return !!prompt;
};
export const showInstallBottomSheet = () => {
  if (isInstalled) {
    Notify.create({
      type: "success",
      message: "이미 '홈 화면에 추가'되었습니다!",
    });
    return;
  }
  if (!isExistsPrompt()) {
    Notify.create({ type: "negative", message: "잠시후 다시 시도해주세요!" });
    return;
  }
  BottomSheet.create({
    message: "앱 인스톨",
    grid: false,
    actions: [
      {
        label: "홈 화면에 teamlog 추가",
        img: "/dark_logo.png",
        id: "teamlog",
      },
    ],
  }).onOk((action) => {
    switch (action.id) {
      case "teamlog":
        prompt.prompt();
        prompt.userChoice;
        return;
      default:
        return;
    }
  });
};
