---
title: 结构型
author: Ys
date: "2020-12-13"
---

## 结构型：优化结构的实现方式

### 适配器模式 - adapter

#### 适配独立模块，保证模块间的独立解耦且连接兼容

##### 需求: 买了一个港行 PS，插座是国标

```js
class HKDevice {
  getPlug() {
    return "港行双圆柱插头";
  }
}

class Target {
  constructor() {
    this.plug = new HKDevice();
  }
  getPlug() {
    return this.plug.getPlug() + "+港行双圆柱转换器";
  }
}

const target = new Target();
target.getPlug();
```

### 装饰器模式

#### 动态将责任附加到对象上

##### 设备升级

```js
class Device {
  create() {
    console.log("PlayStation4");
  }
}
class Phone {
  create() {
    console.log("iphone18");
  }
}
class Decorator {
  constructor(device) {
    this.device = device;
  }
  create() {
    this.device.create();
    this.update(device);
  }
  update(device) {
    console.log(device + "pro");
  }
}

const device = new Device();
device.create();

const newDevice = new Decorator(device);
newDevice.create();
```

### 代理模式

#### 使用代理人来替代原始对象

##### 游戏防沉迷

```js
class Game {
  play() {
    return "playing";
  }
}

class Player {
  constructor(age) {
    this.age = age;
  }
}

class GameProxy {
  constructor(player) {
    this.player = player;
  }
  play() {
    return this.player.age < 16 ? "too young to play" : new Game().play();
  }
}

const player = new Player(18);
const game = new GameProxy(player);

game.play();
```

### 模式场景

- 中间转换参数、保持模块间独立的时候 - **适配器模式**
- 附着于多个组件上，批量动态赋予功能的时候 - **装饰器模式**
- 将代理对象与调用对象分离，不直接调用目标对象 - **代理模式**

### 实际应用

1. 两个模块：筛选器和表格，需要做一个联动。但筛选器的数据不能直接传入表格，需要做数据结构转换 => 模块之间独立，需要做数据结构转换 => **适配器模式**
2. 目前有按钮、title、icon 三个组件。希望开发一个模块，让三个组件同时具备相同功能 => 套一层装甲对于每个组件，有统一的能力提升，且可以动态添加功能进行拓展 => **装饰器模式**
3. ul 中多个 li，每个 li 上的点击事件 => 利用冒泡做委托，事件绑定在 ul 上 => **代理模式**
