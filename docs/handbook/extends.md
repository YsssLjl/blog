---
title: oop
author: Ys
date: '2021-01-05'
---

## 面向对象编程

### 什么是面向对象编程？

面向对象是一种编程思想，经常被拿来和面向过程比较。

其实说的简单点，

面向过程关注的重点是动词，是分析出解决问题需要的步骤，然后编写函数实现每个步骤，最后依次调用函数。

而面向对象关注的重点是主谓，是把构成问题的事物拆解为各个对象，而拆解出对象的目的也不是为了实现某个步骤，而是为了描述这个事物在当前问题中的各种行为。

面向对象的特点是什么？
封装：让使用对象的人不考虑内部实现，只考虑功能使用 把内部的代码保护起来，只留出一些 api 接口供用户使用
继承：就是为了代码的复用，从父类上继承出一些方法和属性，子类也有自己的一些属性
多态：是不同对象作用于同一操作产生不同的效果。多态的思想实际上是把“想做什么”和“谁去做“分开

比如下棋的过程,

面向过程是这样的：开局 -> 白方下棋 -> 棋盘展示 -> 检查胜负 -> 黑方下棋 -> 棋盘展示 -> 检查胜负 -> 循环
用代码表示可能是一连串函数的调用
init();
whitePlay(); // 里面实现一遍下棋的操作
repaint(); // 棋盘展示
check();
blackPlay(); // 再单独实现一遍下棋的操作
repaint(); // 棋盘展示
check();

面向对象是这样的：棋盘.开局 -> 选手.下棋 -> 棋盘.重新展示 -> 棋盘.检查胜负 -> 选手.下棋 -> 棋盘.重新展示 -> 棋盘.检查胜负
用代码表示可能是这样的
const checkerBoard = new CheckerBoard(); // CheckerBoard 类内部封账了棋盘的操作，比如初始化棋盘，检查胜负关系等
const whitePlayer = new Player('white'); // Player 类内部封装了各种玩家的操作，比如等待，落棋，悔棋
const blackPlayer = new Player('black');

whitePlayer.start(); // start 方法的结束，内部封装了或者通过事件发布触发 checkerBoard.repaint(), checkerBoard.check()的调用
blackPlayer.start();

你只需要调用 new 一个 player, 然后调用 start 方法，也就是说我们只需要关注行为，而不需要知道内部到底做了什么。

而且如果要加一些新功能，比如悔棋，比如再加一个玩家，面向对象都很好扩展。

#### 在上面的例子中，面向对象的特性是怎么表现出来的呢？

封装：Player, CheckerBoard 类，使用的时候并不需要知道内部实现了什么，只需要考虑暴露出的 api 的使用
继承：whitePlayer 和 blackPlayer 都继承自 Player，都可以直接使用 Player 的各种方法和属性
多态：whitePlayer.start() 和 blackPlayer.start() 下棋的颜色分别是白色和黑色

#### 什么时候适合使用面向对象

可以看出来，在比较复杂的问题面前，或者参与方较多的时候，面向对象的编程思想可以很好的简化问题，并且能够更好的扩展和维护。

而在比较简单的问题面前，面向对象和面向过程其实差异并不明显，也可以一步一步地按照步骤来调用。

### Js 中的面向对象

#### 对象包含什么

方法
属性

#### 一些内置对象

Object Array Date Function RegExp

#### 创建对象

1. 普通方式

每一个新对象都要重新写一遍 color 和 start 的赋值

```javascript
const Player = new Object();
Player.color = "white";
Player.start = function () {
  console.log("white下棋");
};
```

或者工厂模式，这两种方式都无法识别对象类型，比如 Player 的类型只是 Object

```javascript
function createObject() {
  const Player = new Object();
  Player.color = "white";
  Player.start = function () {
    console.log("white下棋");
  };
  return Player;
}
```

2. 构造函数/实例

通过 this 添加的属性和方法总是指向当前对象的，所以在实例化的时候，通过 this 添加的属性和方法都会在内存中复制一份，这样就会造成内存的浪费。

但是这样创建的好处是即使改变了某一个对象的属性或方法，不会影响其他的对象（因为每一个对象都是复制的一份）

```javascript
function Player(color) {
  this.color = color;
  this.start = function () {
    console.log(color + "下棋");
  };
}

const whitePlayer = new Player("white");
const blackPlayer = new Player("black");
```

Tips. 怎么看函数是不是在内存中创建了多次呢？

比如 2. 构造函数中，我们可以看到 whitePlayer.start === blackPlayer.start // 输出 false

3. 原型

通过原型继承的方法并不是自身的，我们要在原型链上一层一层的查找，这样创建的好处是只在内存中创建一次，实例化的对象都会指向这个 prototype 对象。

```javascript
function Player(color) {
  this.color = color;
}

Player.prototype.start = function () {
  console.log(color + "下棋");
};

const whitePlayer = new Player("white");
const blackPlayer = new Player("black");
```

4. 静态属性

是绑定在构造函数上的属性方法，需要通过构造函数访问

比如我们想看一下一共创建了多少个玩家的实例

```javascript
function Player(color) {
  this.color = color;
  if (!Player.total) {
    Player.total = 0;
  }
  Player.total++;
}

let p1 = new Player("white");
console.log(Player.total); // 1
let p2 = new Player("black");
console.log(Player.total); // 2
```
