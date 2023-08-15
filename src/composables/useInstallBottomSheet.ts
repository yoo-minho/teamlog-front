export let pwaPrompt: BeforeInstallPromptEvent;
export const savePrompt = (deferredPrompt: any) => {
  pwaPrompt = deferredPrompt;
};
export const isExistsPrompt = () => !!prompt;
export const showInstallBottomSheet = () => {
  BottomSheet.create({
    message: "앱 인스톨",
    grid: false,
    actions: [
      {
        label: "홈 화면에 Teamlog 추가",
        img: "/og-image.png",
        id: "teamlog",
      },
    ],
  }).onOk((action) => {
    switch (action.id) {
      case "teamlog":
        pwaPrompt?.prompt();
        pwaPrompt?.userChoice;
        return;
      default:
        return;
    }
  });
};
