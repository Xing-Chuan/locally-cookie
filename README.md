
English | [简体中文](https://github.com/Xing-Chuan/locally-cookie/blob/master/README.zh-CN.md)

> locally-cookie is a 1KB lightweight library based on localStorage that stores session data and fixed time-length data locally

## Getting Started

- Storage is only valid in subdomains
- across domains it is not recommended to store large amounts of data, such as the cache of the entire page 
- support IE8 or more

### Installation

```bash
npm i -S locally-cookie
```

### API

```js
import locallyCookie from 'locally-cookie';
```

**set**

```js
/**
 * Parameter
 * key {String} required
 * value {String|Boolean|Number|Array|Object} required
 * day {Number} 0 session data, Turn off browser invalidation
 | 1，2... Expired after 1, 2 days | -1 Theory is permanent and effective, optional, default 0
*/
locallyCookie.set('key', value, [day]);
```

**get**

```js
/**
 * Parameter
 * key {String} required
*/
locallyCookie.get('key');
```

**delete**

```js
/**
 * Parameter
 * key {String} required
*/
locallyCookie.del('key');
```

**has**

```js
/**
 * Parameter
 * key {String} required
*/
locallyCookie.has('key');
```
