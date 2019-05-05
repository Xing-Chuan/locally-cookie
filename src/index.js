import Cookie from './cookie';

class LocalCookie {
  static sessionName = 'lc_sessionid';
  static keyListName = 'lc_keyslist';
  static supportDataTypeList = [
    '[object String]',
    '[object Array]',
    '[object Object]',
    '[object Number]',
    '[object Boolean]',
  ];
  // 获取要存储的key
  static generateKey(key) {
    return `lc_${key}`;
  }
  // 删除 keysList 中对应 key
  static deleteKeysList(key) {
    const localCookieKeysOriginal = localStorage.getItem(LocalCookie.keyListName);
    let localCookieKeys = localCookieKeysOriginal ? JSON.parse(localCookieKeysOriginal) : [];
    localCookieKeys = localCookieKeys.filter(function (localCookieKey) {
      if (localCookieKey === key) {
        return false;
      }
      return true;
    });
    localStorage.setItem(LocalCookie.keyListName, JSON.stringify(localCookieKeys));
  }
  // 初始化session数据结构，清除沉积session数据
  static initLocalSessionList() {
    // 若存储的数据中有session数据，则删除对应数据
    const localCookieKeysOriginal = localStorage.getItem(LocalCookie.keyListName);
    let localCookieKeys = localCookieKeysOriginal ? JSON.parse(localCookieKeysOriginal) : [];
    localCookieKeys = localCookieKeys.filter(function (key) {
      const keyItemDataOriginal = localStorage.getItem(LocalCookie.generateKey(key));
      const keyItemData = keyItemDataOriginal && JSON.parse(keyItemDataOriginal);
      if (keyItemData && keyItemData.expires === 0) {
        localStorage.removeItem(LocalCookie.generateKey(key));
        return false;
      }
      return true;
    });
    // 过滤掉已经删除的key值，重新赋值
    localStorage.setItem(LocalCookie.keyListName, JSON.stringify(localCookieKeys));
    // 用户重新打开了浏览器，需清除历史session数据, 新生成sessionId
    const sessionId = `${(Math.random() * 100000).toFixed(0)}-${(Math.random() * 100000).toFixed(0)}-${Date.now()}`;
    // 用cookie记录sessionId
    Cookie.set(LocalCookie.sessionName, sessionId, false, '/', window.location.hostname);
    // 用localStorage记录sessionId
    localStorage.setItem(LocalCookie.sessionName, JSON.stringify({
      sessionId,
    }));
  }
  set(key, value, day = 0) {
    try {
      /**
       * value 结构:
       * {
       *  expires(Number): 0(session数据) | 1,2,3(有效天数) | 永久数据 '-1'
       *  value(Number|String|Object|Array|Boolean): 真正保存的值
       * }
       */
      if (typeof key === 'string' && value !== undefined) {
        const dataType = Object.prototype.toString.call(value);
        const dataTypeSupport = LocalCookie.supportDataTypeList.includes(dataType);
        let expires;
        if (!dataTypeSupport) {
          // eslint-disable-next-line no-console
          console.warn('local-cookie: This data type is not supported, please check value!');
          return;
        } else if (typeof day !== 'number') {
          // eslint-disable-next-line no-console
          console.warn('local-cookie: day must be the number type');
          return;
        }
        if (day > 0) {
          // 存储固定时效数据
          expires = Date.now() + (day * 24 * 60 * 60 * 1000);
        } else if (day === -1) {
          // 存储永久数据, 存储10年作为永久
          expires = Date.now() + (10 * 365 * 24 * 60 * 60 * 1000);
        } else if (day === 0) {
          // session 数据，随浏览器生命周期走
          const cookieNowSessionId = Cookie.get(LocalCookie.sessionName);
          expires = 0;
          if (!cookieNowSessionId) {
            // 两处保存不一致时初始化本地的sessionList结构
            LocalCookie.initLocalSessionList();
          }
        }
        // 本地存储所有通过localcookie存储的 key 序列
        const localCookieKeysOriginal = localStorage.getItem(LocalCookie.keyListName);
        const localCookieKeys = localCookieKeysOriginal ? JSON.parse(localCookieKeysOriginal) : [];
        if (!localCookieKeys.includes(key)) {
          localCookieKeys.push(key);
          localStorage.setItem(LocalCookie.keyListName, JSON.stringify(localCookieKeys));
        }
        // 设置数据
        localStorage.setItem(LocalCookie.generateKey(key), JSON.stringify({
          expires,
          value,
        }));
      } else {
        // eslint-disable-next-line no-console
        console.warn('localCookie: key必须存在且为string，value不能为空');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('localCookie:', e);
    }
  }
  get(key) {
    try {
      const getKeyValue = localStorage.getItem(LocalCookie.generateKey(key)); // 提取
      if (!getKeyValue) {
        return null;
      }
      const parsedValue = JSON.parse(getKeyValue);
      const cookieNowSessionId = Cookie.get(LocalCookie.sessionName);
      const { expires, value } = parsedValue;
      if (parsedValue) {
        if (expires) {
          // 固定时效数据
          const nowTime = Date.now();
          if (nowTime >= expires) {
            localStorage.removeItem(LocalCookie.generateKey(key));
            return null;
          }
          return value;
        } else if (expires === 0 && cookieNowSessionId) {
          // 未重新打开浏览器
          return value;
        } else if (expires === 0 && !cookieNowSessionId) {
          // 已重新打开浏览器，也可能是没设置过session数据
          LocalCookie.initLocalSessionList();
          return null;
        }
      }
      return null;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('localCookie:', e);
    }
  }
  del(key) {
    localStorage.removeItem(LocalCookie.generateKey(key));
    // 删除数据同时清除keysList中对应key值
    LocalCookie.deleteKeysList(key);
  }
  // 设置的某个key是否还存在
  has(key) {
    const existentKeyList = localStorage.getItem(LocalCookie.keyListName);
    if (!existentKeyList) {
      return false;
    } else if (existentKeyList.includes(key)) {
      return true;
    }
    return false;
  }
}

export default new LocalCookie();
