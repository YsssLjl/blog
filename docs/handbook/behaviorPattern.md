---
title: 行为型
author: Ys
date: "2020-12-13"
---

## 行为型：不同的对象之间划分责任和算法的抽象化

### 命令模式

#### 请求以命令的形式包裹在对象中，并传给调用对象

##### 对于游戏角色的控制

```js
// 接受者
class Receiver {
  execute() {
    console.log("角色开始奔跑");
  }
}

// 触发者
class Operator {
  constructor(command) {
    this.command = command;
  }
  run() {
    console.log("请给我爬");
    this.command.execute();
  }
}

// 指令器
class Command {
  constructor(receiver) {
    this.receiver = receiver;
  }
  execute() {
    console.log("执行命令");
    this.receiver.executer();
  }
}

const soldier = new Receiver();
const order = new Command(soldier);
const player = new Operator(order);
player.run();
```

### 模板模式

#### 在模板中，定义好每个方法的执行步骤。方法本身关注于自己的事情

##### 想要成功吃个鸡，大概分几步

```js
class Device {
  constructor(executePipeLine) {
    // executePipeLine……
  }
  powerOn() {
    console.log("打开电源");
  }
  login() {
    console.log("登录账号");
  }
  clickIcon() {
    console.log("点击开始游戏");
  }
  enterGame() {
    console.log("进入战场");
  }

  play() {
    this.powerOn();
    this.login();
    this.clickIcon();
    this.enterGame();
  }
}
```

### 观察者模式

#### 当一个属性发生状态改变时，观察者会连续引发所有的相关状态改变

##### 通过智能家居一键开始游戏

```js
class MediaCenter {
  constructor() {
    this.state = "";
    this.observers = [];
  }
  attach(observer) {
    this.observers.push(observer);
  }
  getState() {
    return this.state;
  }
  setState(state) {
    this.state = state;
    this.notifyAllobservers();
  }
  notifyAllobservers() {
    this.observers.forEach((ob) => {
      ob.update();
    });
  }
}

class observer {
  constructor(name, center) {
    this.name = name;
    this.center = center;
    this.center.attach(this);
  }
  update() {
    console.log(`${this.name} update, state: ${this.center.getState()}`);
  }
}

const center = new MediaCenter();
const ps = new Observer("ps", center);
const tv = new Observer("tv", center);

center.setState("on");
```

### 职责链

#### 1. 链式调用 2. 职责独立 3. 顺序执行

##### 成年高质量男性想要打个游戏，在家里需要过几关

```js
class Action {
  constructor(name) {
    this.name = name;
    this.nextAction = null;
  }
  setNextAction(action) {
    this.nextAction = action;
  }
  handle() {
    console.log(`${this.name}请审批，是否可以打游戏`);
    if (this.nextAction !== null) {
      this.nextAction.handle();
    }
  }
}

const dad = new Action("爸");
const mom = new Action("妈");
const wife = new Action("夫人");

dad.setNextAction(mom);
mom.setNextAction(wife);

dad.handle();
```

### 模式场景

- 发出指令，中间层传递命令本身，命中包含执行对象 - **命令模式**
- 通过模板定义执行顺序，做独立操作 - **模板模式**
- 通过观察者，可以让被观察值统一发生变化，触发相应依赖值的统一更新 - **观察者模式**
- 独立职责的单元通过链式执行，逐步操作流程 - **职责链**

### 实际应用

1.  提交表单进行表单逐行校验，链式调用 validate，依次执行 => 职责亮
2.  echart 准备工作：canvas、config、init、draw()，规划顺序执行 => 模板模式
3.  调度器在接受到一组新的数据时候，解析数据，并且根据数据类型包裹在对象中传递到下级 helper，helper 再去执行相应操作 => 命令模式
4.  输入框输入的值去判断下拉框显示与否 => 观察 input 设置 show => 观察者模式
