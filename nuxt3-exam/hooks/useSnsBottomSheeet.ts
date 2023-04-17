import { getImage } from '@/util/ImageUtil';
import { shareKakao } from './useKakaoApi';
import { BottomSheet, Notify } from 'quasar';

export const showBottomSheet = ({ title, description }: { title?: string; description?: string } = {}) => {
  BottomSheet.create({
    message: '공유하기',
    grid: false,
    actions: [
      {
        label: 'Kakaotalk (카카오톡)',
        img: getImage('sns/kakao.png'),
        id: 'kakao',
      },
      {
        label: 'Facebook (페이스북)',
        img: getImage('sns/facebook.png'),
        id: 'facebook',
      },
      {
        label: 'Twitter (트위터)',
        img: getImage('sns/twitter.png'),
        id: 'twitter',
      },
      {
        label: 'Naver Band (네이버 밴드)',
        img: getImage('sns/band.png'),
        id: 'band',
      },
      {},
      {
        label: 'URL Copy',
        icon: 'content_copy',
        id: 'copy',
      },
      {
        label: 'Share',
        icon: 'share',
        id: 'share',
      },
    ],
  }).onOk((action) => {
    const sharedUrl = encodeURIComponent(location.href);
    const _title = encodeURIComponent(title || '팀로그(teamlog) - 세상의 모든 블로그 한번에 모아보기');
    const _description =
      description || '티스토리, 미디엄, 브런치, 벨로그, 네이버블로그 상관없이 팀 블로그를 만들 수 있어요!';
    switch (action.id) {
      case 'kakao':
        shareKakao({ title: _title, description: _description });
        return;
      case 'facebook':
        window.open(`http://www.facebook.com/sharer/sharer.php?u=${sharedUrl}`, '', 'width=400, height=500');
        return;
      case 'twitter':
        window.open(
          `http://twitter.com/share?url=${sharedUrl}&text=${_title}`,
          'tweetPop',
          'width=400, height=500, scrollbars=yes',
        );
        return;
      case 'band':
        window.open(
          `http://www.band.us/plugin/share?body=${_title}&route=${sharedUrl}`,
          'shareBand',
          'width=400, height=500, resizable=yes',
        );
        return;
      case 'copy':
        copyUrl();
        return;
      case 'share':
      default:
        shareUrl();
        return;
    }
  });
};

const shareUrl = () => {
  if (typeof navigator.share === 'undefined') {
    Notify.create({ type: 'nagative', message: 'Non-shareable environment!' });
    return;
  }
  navigator.share({
    title: location.href,
    url: location.href,
  });
};

const copyUrl = async () => {
  if (typeof navigator.clipboard === 'undefined') {
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  } else {
    await navigator.clipboard.writeText(location.href);
  }
  Notify.create({ type: 'positive', message: 'Copy Completed!' });
};
