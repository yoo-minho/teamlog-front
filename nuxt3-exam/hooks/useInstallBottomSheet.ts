import { BottomSheet } from "quasar";

let prompt: BeforeInstallPromptEvent;

export const savePrompt = (deferredPrompt: BeforeInstallPromptEvent) => {
  prompt = deferredPrompt;
};
export const isExistsPrompt = () => {
  return !!prompt;
};
export const showInstallBottomSheet = () => {
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
        console.log({ prompt });
        prompt?.prompt();
        prompt?.userChoice;
        return;
      default:
        return;
    }
  });
};
