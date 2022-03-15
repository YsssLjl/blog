---
title: 接口隔离原则
author: Ys
date: "2020-12-01"
---

## 接口隔离原则（ISP: Interface Segregation Principle) - 不应该强迫客户依赖与它们不用的方法。接口属于客户，不属于它所在的类层次结构。

### 目标：多个专业的接口比单个类提供的接口好用

#### sprint1 已经可以开发游戏了，但是实现游戏中台 - 快速生产游戏

```js
class Game {
  constructor(name) {
    this.name = name;
  }
  run() {
    // 跑
  }
  shot() {
    // 开枪
  }
  mega() {
    // 开大
  }
}

class PUGB extends Game {
  constructor() {
    // pubg constructor
  }
}

class LOL extends Game {
  constructor() {
    // lol constructor
  }
}

pubg = new PUBG("pubg");
pubg.run();
pubg.shot();
pubg.mega();
```

#### 重构 - 用多个接口替代他，每个接口服务于一个子模块

```js
class Game {
  constructor(name) {
    this.name = name;
  }
  run() {
    // 跑
  }
}

class FPS {}

class MOBA {}

class PUGB extends Game {
  constructor() {
    // pubg constructor
  }
  shot() {}
}

class LOL extends Game {
  constructor() {
    // lol constructor
  }
  mega() {}
}
```
