export function getShortAddress(
  address: string = '',
  num: number = 5,
  endNum = 4
) {
  let strLength = address.length;
  return (
    address.substring(0, num) +
    '...' +
    address.substring(strLength - endNum, strLength)
  );
}
// export const getShortAddress = (address: string = '') => {
//   let strLength = address.length;
//   return address.substring(0, 5) + '...' + address.substring(strLength - 4, strLength);
// };

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
 * File格式转换
*/
export const fileParse = (file: File, type = 'base64'): Promise<any> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    switch (type) {
    case 'base64':
      reader.readAsDataURL(file);
      break;
    case 'buffer':
      reader.readAsArrayBuffer(file);
      break;
    default:
      throw new Error('Woring');
    }
    reader.onload = (ev) => {
      resolve(ev);
    };
  });
};

// date-fns
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
    return rt > 10 || isAddZero(o) ? rt : `0${rt}`;
  });
}

export const toDate = (date: number | Date) => {
  const dateStr = Object.prototype.toString.call(date);

  // Clone the date
  if (
    date instanceof Date ||
    (typeof date === 'object' && dateStr === '[object Date]')
  ) {
    return new Date(date.getTime());
    // return new Date(argument.getTime())
  } else if (typeof date === 'number' || dateStr === '[object Number]') {
    return new Date(date);
  } else {
    return new Date(NaN);
  }
};

/** 比较两个日期，如果第一个日期晚于第二个日期，则返回 1；如果第一个日期早于第二个日期，则返回 -1；如果日期相等，则返回 0。
 * 
 * @param dirtyDateLeft 
 * @param dirtyDateRight 
 * @returns 
 * 
 */
export const compareAsc = (
  dirtyDateLeft: Date | number,
  dirtyDateRight: Date | number
) => {
  const dateLeft = toDate(dirtyDateLeft);
  const dateRight = toDate(dirtyDateRight);

  const diff = dateLeft.getTime() - dateRight.getTime();

  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
  } else {
    return diff;
  }
};

export const endOfDay = (dirtyDate: Date | number): Date => {
  const date = toDate(dirtyDate);
  date.setHours(23, 59, 59, 999);
  return date;
};
export const endOfMonth = (dirtyDate: Date | number): Date => {
  const date = toDate(dirtyDate);
  const month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
};
export const isLastDayOfMonth = (dirtyDate: Date | number): boolean => {
  const date = toDate(dirtyDate);
  return endOfDay(date).getTime() === endOfMonth(date).getTime();
};

export const getTimezoneOffsetInMilliseconds = (date: Date): number => {
  const utcDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
};
// 获取给定日期之间的日历月数
export const differenceInCalendarMonths = (dirtyDateLeft: Date | number,  dirtyDateRight: Date | number): number => {
  const dateLeft = toDate(dirtyDateLeft);
  const dateRight = toDate(dirtyDateRight);

  const yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
  const monthDiff = dateLeft.getMonth() - dateRight.getMonth();

  return yearDiff * 12 + monthDiff;
};
// 获取给定日期之间的毫秒数
export const differenceInMilliseconds = (dateLeft: Date | number, dateRight: Date | number): number => {
  return toDate(dateLeft).getTime() - toDate(dateRight).getTime();
};
// 获取给定日期之间的秒数。
export const differenceInSeconds = (dateLeft: Date | number, dateRight: Date | number,) => {
  const diff = differenceInMilliseconds(dateLeft, dateRight) / 1000;
  return diff < 0 ? Math.ceil(diff) : Math.floor(diff);
};
// 默认舍入方法获取给定日期之间的完整月数。
export const differenceInMonths = (dirtyDateLeft: Date | number, dirtyDateRight: Date | number): number => {
  const dateLeft = toDate(dirtyDateLeft);
  const dateRight = toDate(dirtyDateRight);

  const sign = compareAsc(dateLeft, dateRight);
  const difference = Math.abs(differenceInCalendarMonths(dateLeft, dateRight));
  let result;

  if (difference < 1) {
    result = 0;
  } else {
    if (dateLeft.getMonth() === 1 && dateLeft.getDate() > 27) {
      dateLeft.setDate(30);
    }

    dateLeft.setMonth(dateLeft.getMonth() - sign * difference);

    let isLastMonthNotFull = compareAsc(dateLeft, dateRight) === -sign;

    // Check for cases of one full calendar month
    if (
      isLastDayOfMonth(toDate(dirtyDateLeft)) &&
      difference === 1 &&
      compareAsc(dirtyDateLeft, dateRight) === 1
    ) {
      isLastMonthNotFull = false;
    }

    result = sign * (difference - Number(isLastMonthNotFull));
  }

  return result === 0 ? 0 : result;
};

enum monthEnum {
  'Jan' = 1,
  'Feb' = 2,
  'Mar' = 3,
  'Apr' = 4,
  'May' = 5,
  'Jun' = 6,
  'Jul' = 7,
  'Aug' = 8,
  'Sept' = 9,
  'Oct' = 10,
  'Nov' = 11,
  'Dec' = 12,
};
export function newDateFormat(time: number, format?: string) {
  const t = new Date(time);
  format = format || 'Y-m-d h:i:s';
  let year = t.getFullYear();
  let month = monthEnum[t.getMonth() + 1];
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
    if (typeof rt === 'string') return rt;
    return rt >= 10 || isAddZero(o) ? rt : `0${rt}`;
  });
}
/**
 * 
 * @param date
 * @returns 
 * | Distance between dates                                            | Result              |
 * |-------------------------------------------------------------------|---------------------|
 * |   0 <= seconds <= 60                                              | Just now            |
 * |   1 <= minutes < 60                                               | [1..60] min ago     |
 * |   1 <= hour < 24                                                  | [1..24] h ago       |
 * |   1 <= day < 7                                                    | [1..7] d ago        |
 * |   7 <= day < 30                                                   | [7..30] / 7 wk ago  |
 * |   1 <= month < 2                                                  | 1 mo ago            |
 * |   month >= 2                                                      | MM/DD，如：Apr 14    |
 * |  year > 1                                                         | MM/DD/YYYY          |
 */
export const formatDistanceToNow = (date: number | Date) => {
  const nowDate = Date.now();
  const minutesInDay = 1440;
  const minutesInMonth = 43200;
  const comparison = compareAsc(date, nowDate);
  if (isNaN(comparison)) {
    throw new RangeError('Invalid time value');
  }
  let dateLeft;
  let dateRight;
  if (comparison > 0) {
    dateLeft = toDate(nowDate);
    dateRight = toDate(date);
  } else {
    dateLeft = toDate(date);
    dateRight = toDate(nowDate);
  }

  const seconds = differenceInSeconds(dateRight, dateLeft);
  const offsetInSeconds = (getTimezoneOffsetInMilliseconds(dateRight) - getTimezoneOffsetInMilliseconds(dateLeft)) / 1000;
  const minutes = Math.round((seconds - offsetInSeconds) / 60);
  let months;
  // 一分钟内
  if (minutes < 1) {
    return 'Just now';
  } else if (minutes < 60) {
    // 一小时内
    return `${minutes}min ago`;
  } else if (minutes < minutesInDay) {
    // 一天内
    const hours = Math.round(minutes / 60);
    return `${hours}h ago`;
  } else if (minutes < minutesInDay * 7) {
    // 一周内
    const days = Math.round(minutes / minutesInDay);
    return `${days}d ago`;
  } else if (minutes < minutesInMonth) {
    // 一个月内
    const weeks = Math.round(Math.round(minutes / minutesInDay) / 7);
    return `${weeks}wk ago`;
  } else if (minutes < minutesInMonth * 2) {
    return '1mo ago';
  };
  months = differenceInMonths(dateRight, dateLeft);
  if (months < 12) {
    // 一年内
    return newDateFormat(toDate(date).getTime(), 'm d');
  } else {
    return newDateFormat(toDate(date).getTime(), 'm d, y');
  }
};

/**
 * 获取wallet address默认头像
 */
export const getUserAvatar = (address: string) =>  {
  return `https://cdn.stamp.fyi/avatar/${address}?s=300`;
};
