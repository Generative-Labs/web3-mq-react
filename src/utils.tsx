export const getShortAddress = (address: string = '') => {
  let strLength = address.length;
  return address.substring(0, 5) + '...' + address.substring(strLength - 4, strLength);
};

export const copyText = (text: string) => {
  return navigator.clipboard
    .writeText(text)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

/**
 * 防反跳。fn函数在最后一次调用时刻的delay毫秒之后执行！
 * @param fn 执行函数
 * @param delay 时间间隔
 * @param isImmediate 为true，debounce会在delay时间间隔的开始时立即调用这个函数
 * @returns {Function}
 */
export function debounce<T extends {}>(
  fn: Function,
  delay: number,
  isImmediate: boolean,
): ([k]: string) => T | Promise<T> {
  let timer: NodeJS.Timeout | null = null;

  return function () {
    // @ts-ignore
    const context = this;
    const args = arguments;

    return new Promise((resolve) => {
      timer && clearTimeout(timer);

      if (isImmediate) {
        const doNow = !timer;

        timer = setTimeout(() => {
          timer = null;
        }, delay);

        doNow && resolve(fn.apply(context, args));
      } else {
        timer = setTimeout(() => {
          resolve(fn.apply(context, args));
        }, delay);
      }
    });
  };
}

export const dateTransform = (time: number): string => {
  return new Date(time / 1000000).toLocaleString() || '';
};

export const formatUserInfoData = (data: any) => {
  let avatar, title, user_id;

  avatar =
    data.twitter_avatar ||
    data.discord_avatar ||
    data.facebook_avatar ||
    data.opensea_avatar ||
    data.instagram_avatar ||
    '';
  title =
    data.twitter_username ||
    data.discord_username ||
    data.facebook_username ||
    data.opensea_username ||
    data.instagram_username ||
    '';
  user_id = data.user_id;
  return {
    avatar,
    title,
    user_id,
  };
};

/**
 * channel格式化
 * @param channel
 */
export const formatMessageData = (channel: any) => {
  let latestMsg,
    displayTitle = '',
    avatarUrl: string[] = [],
    updatedAt: string = '',
    unread: number = 0;

  const {
    latest_msg,
    members,
    name,
    is_opensea_coll,
    opensea_coll_name,
    opensea_coll_cover,
    unreadCount = 0,
  } = channel;
  const { msg_contents, created_at, msg_type } = latest_msg || {};

  if (!latest_msg) {
    latestMsg = '';
    updatedAt = '';
  } else {
    latestMsg = msg_type === 'text' ? msg_contents : '暂不支持此消息类型';
    updatedAt = dateFormat(created_at / 1000000, 'm/d');
  }
  if (is_opensea_coll) {
    displayTitle = opensea_coll_name;
    avatarUrl = [opensea_coll_cover];
  } else {
    members.forEach((element: any) => {
      if (name) {
        displayTitle = name;
      } else {
        displayTitle += element.user_name;
      }
      avatarUrl.push(element.avatar || '');
    });
  }
  unread = unreadCount;
  return {
    ...channel,
    latestMsg,
    displayTitle,
    avatarUrl,
    updatedAt,
    unread,
  };
};

/**
 * 日期格式化
 * @param time
 * @param format
 */
export function dateFormat(time: number, format?: string) {
  const t = new Date(time);
  format = format || 'Y-m-d h:i:s';
  let year = t.getFullYear();
  let month = t.getMonth() + 1;
  let day = t.getDate();
  let hours = t.getHours();
  let minutes = t.getMinutes();
  let seconds = t.getSeconds();

  const hash = {
    y: year,
    m: month,
    d: day,
    h: hours,
    i: minutes,
    s: seconds,
  };
  // 是否补 0
  const isAddZero = (o: string) => {
    return /M|D|H|I|S/.test(o);
  };
  return format.replace(/\w/g, (o) => {
    // @ts-ignore
    let rt = hash[o.toLocaleLowerCase()];
    return rt > 10 || !isAddZero(o) ? rt : `0${rt}`;
  });
}
