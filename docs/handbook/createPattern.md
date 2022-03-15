---
title: 元素创建型
author: Ys
date: "2020-12-13"
---

## 元素创建型：创建元素，规范创建步骤

### 工厂模式

#### 隐藏创建过程、暴露共同接口

##### 游戏商店里下载初始化游戏，并且可以运行游戏

```js
class Shop {
  create(name) {
    return new Game(name);
  }
}

class Game {
  constructor(name) {
    this.name = name;
  }
  init() {
    console.log("init");
  }
  run() {
    console.log("run");
  }
}

const shop = new Shop();
const pubg = new Game("pubg");

pubg.init();
pubg.run();
// 创建商店时快速生产了游戏
```

### 建造者模式

#### 拆分简单模块、独立执行 => 注重过程与搭配

##### 优惠套餐单元，商品 + 皮肤 进行打折售卖

```js
class Product {
  constructor(name) {
    this.name = name;
  }
  init() {
    console.log("Product init");
  }
}

class Skin {
  constructor(name) {
    this.name = name;
  }
  init() {
    console.log("Skin init");
  }
}

class Shop {
  constructor() {
    this.package = "";
  }
  create(name) {
    this.package = new PackageBuilder(name);
  }
  getGamePackage() {
    return this.package.getPackage();
  }
}

class PackageBuilder {
  constructor(name) {
    this.game = new Product(name);
    this.skin = new Skin(name);
  }
  getPackage() {
    return this.game.init() + this.skin.init();
  }
}
// 每个模块独立解耦，而建造者负责创建串联正题系统
```

### 单例模式

#### 全局只有一个实例

```js
class PlayStation {
  constructor() {
    this.state = "off";
  }
  play() {
    if (this.state === "on") {
      console.log("别闹，已经在 happy 了");
      return;
    }
    this.state = "on";
    console.log("开始 happy");
  }
  shutdown() {
    if (this.state === "off") {
      console.log("已经关闭");
      return;
    }
    this.state = "off";
    console.log("已经关机，请放心");
  }
  // static instance = undefined;
  // static getInstance() {
  // return function() {
  // if(!PlayStation.instance) {
  // PlayStation.instance = new PlayStation();
  // }
  // return PlayStation.instance;
  // }();
  // }
}

// main.js
PlayStation.instance = undefined;
PlayStation.getInstance = function () {
  return (function () {
    if (!PlayStation.instance) {
      PlayStation.instance = new PlayStation();
    }
    return PlayStation.instance;
  })();
};

const ps1 = PlayStation.getInstance();
ps1.play();

const ps2 = PlayStation.getInstance();
ps2.shutdown();

// 全局只要一个实例，不能乱
```

### 模式场景

- 批量生产同类型应用来满足频繁使用同一种类型需求时 - **工厂模式**
- 当我们需要模块化拆分一个大模块，同时使模块间独立解耦分工 - **建造者模式**
- 全局只需要一个实例，注重统一一体化 - **单例模式**

### 实际应用

1. Button Producer：生产不同类型的按钮 => 生产多个本质相同，利用传参区分不同属性的元素 => **工厂模式**
2. 页头组件 Header: 包含了 title、button、breadcum => 生产多重不同类型的元素 => **建造者模式**
3. 全局应用 router store => 只需要一个实例 => **单例模式**
