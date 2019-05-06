
[English](./README.md) | 简体中文

> locally-cookie 是一个 1KB 轻量库，基于 localStorage 实现本地 session 数据及时效数据存储

## 快速开始

- 存储只在子域名有效，不能跨域
- 不建议存储大量数据，例如整个页面的缓存
- 支持IE8以上

### 安装

```bash
npm i -S locally-cookie
```

### API

```js
import locallyCookie from 'locally-cookie';
```

**设置 set**

```js
/**
 * 参数说明
 * key {String} 键，必填
 * value {String|Boolean|Number|Array|Object} 值，必填
 * day {Number} 0 session 数据，关闭浏览器失效 | 1，2... 1天，2天后失效 | -1 理论永久有效，选填 默认为 0
*/
locallyCookie.set('key', value, [day]);
```

**获取 get**

```js
/**
 * 参数说明
 * key {String} 键，必填
*/
locallyCookie.get('key');
```

**删除 del**

```js
/**
 * 参数说明
 * key {String} 键，必填
*/
locallyCookie.del('key');
```

**设置的某个key是否还存在 has**

```js
/**
 * 参数说明
 * key {String} 键，必填
*/
locallyCookie.has('key');
```
