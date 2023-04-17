export const shareKakao = ({ title, description }: { title?: string; description?: string } = {}) => {
  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: decodeURI(title || '팀로그(teamlog) - 세상의 모든 블로그 한번에 모아보기'),
      description: decodeURI(
        description || '티스토리, 미디엄, 브런치, 벨로그, 네이버블로그 상관없이 팀 블로그를 만들 수 있어요!',
      ),
      imageUrl: 'https://teamlog.team/kakao_share.png',
      link: {
        mobileWebUrl: location.href,
        webUrl: location.href,
      },
    },
    buttons: [
      {
        title: '이동',
        link: {
          mobileWebUrl: location.href,
          webUrl: location.href,
        },
      },
    ],
  });
};
