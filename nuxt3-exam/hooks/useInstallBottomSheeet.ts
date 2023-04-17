import { BottomSheet } from 'quasar';

export const showBottomSheet = (deferredPrompt?: BeforeInstallPromptEvent) => {
  BottomSheet.create({
    message: '앱 인스톨',
    grid: false,
    actions: [
      {
        label: '홈 화면에 teamlog 추가',
        img: new URL(`../assets/dark_logo.png`, import.meta.url).toString(),
        id: 'teamlog',
      },
    ],
  }).onOk((action) => {
    switch (action.id) {
      case 'teamlog':
        deferredPrompt?.prompt();
        deferredPrompt?.userChoice;
        return;
      default:
        return;
    }
  });
};
