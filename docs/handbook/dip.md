---
title: 依赖倒置原则
author: Ys
date: "2020-12-01"
---

## 依赖倒置原则（DIP: Dependence Inversion Principle) - 抽象不应该依赖于细节，细节应该依赖于抽象。

### 目标：面向抽象进行 coding，而不是对实现进行 coding。降低需求与实现的耦合

#### sprint1 分享功能

```js
class Store {
  constructor() {
    this.share = new Share();
  }
}

class Share {
  shareTo() {
    // 分享到不同平台
  }
}

const store = new Store();
store.share.shareTo("wx");

// sprint2
// 评分功能
class Store {
  constructor() {
    this.share = new Share();
    this.rate = new Rate();
  }
}

class Share {
  shareTo() {
    // 分享到不同平台
  }
}

class Rate {
  star(stars) {
    // 评分
  }
}

const store = new Store();
store.rate.stars("5");
```

#### 重构

#### 目标：暴露挂载 => 动态挂载

```js
class Rate {
  init(store) {
    store.rate = this;
  }
  store(stars) {
    // 评分
  }
}

class Store {
  // 维护模块名单
  static modules = new Map();

  constructor() {
    // 遍历名单做初始化挂载
    for (let module of Store.modules.values()) {
      module.init(this);
    }
  }

  // 注入功能模块
  static inject(module) {
    Store.modules.set(module.constructor.name, module);
  }
}

class Share {
  init(store) {
    store.share = this;
  }
  shareTo(platform) {
    // 分享到不同平台
  }
}

// 依次注册完所有模块
const rate = new Rate();
Store.inject(rate);

// 初始化商城
const store = new Store();
store.rate.star(4);
```
