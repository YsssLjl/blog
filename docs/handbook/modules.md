---
title: oop
author: Ys
date: '2021-01-05'
---

# 继承

## 原型链继承

### 实现

```javascript
function Parent() {
  this.name = "parentName";
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child() {}

// Parent的实例同时包含实例属性方法和原型属性方法，所以把new Parent()赋值给Child.prototype。
// 如果仅仅Child.prototype = Parent.prototype，那么Child只能调用getName，无法调用.name
// 当Child.prototype = new Parent()后， 如果new Child()得到一个实例对象child，那么
// child.__proto__ === Child.prototype;
// Child.prototype.__proto__ === Parent.prototype
// 也就意味着在访问child对象的属性时，如果在child上找不到，就会去Child.prototype去找，如果还找不到，就会去Parent.prototype中去找，从而实现了继承。
Child.prototype = new Parent();
// 因为constructor属性是包含在prototype里的，上面重新赋值了prototype，所以会导致Child的constructor指向[Function: Parent]，有的时候使用child1.constructor判断类型的时候就会出问题
// 为了保证类型正确，我们需要将Child.prototype.constructor 指向他原本的构造函数Child
Child.prototype.constructor = Child;

var child1 = new Child();

child1.getName(); // parentName
```

### 隐含的问题

1. 如果有属性是引用类型的，一旦某个实例修改了这个属性，所有实例都会受到影响

```javascript
function Parent() {
  this.actions = ["eat", "run"];
}
function Child() {}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child1 = new Child();
const child2 = new Child();

child1.actions.pop();

console.log(child1.actions); // ['eat']
console.log(child2.actions); // ['eat']
```

2. 创建 Child 实例的时候，不能传参

## 构造函数继承

看到上面的问题 1，我们想一下该怎么解决呢？

能不能想办法把 Parent 上的属性方法，添加到 Child 上呢？而不是都存在原型对象上，防止被所有实例共享。

### 实现

针对问题 1. 我们可以使用 call 来复制一遍 Parent 上的操作

```javascript
function Parent() {
  this.actions = ["eat", "run"];
  this.name = "parentName";
}

function Child() {
  Parent.call(this);
}

const child1 = new Child();
const child2 = new Child();

child1.actions.pop();

console.log(child1.actions); // ['eat']
console.log(child1.actions); // ['eat', 'run']
```

针对问题 2. 我们应该怎么传参呢？

```javascript
function Parent(name, actions) {
  this.actions = actions;
  this.name = name;
}

function Child(id, name, actions) {
  Parent.call(this, name); // 如果想直接传多个参数, 可以Parent.apply(this, Array.from(arguments).slice(1));
  this.id = id;
}

const child1 = new Child(1, "c1", ["eat"]);
const child2 = new Child(2, "c2", ["sing", "jump", "rap"]);

console.log(child1.name); // { actions: [ 'eat' ], name: 'c1', id: 1 }
console.log(child2.name); // { actions: [ 'sing', 'jump', 'rap' ], name: 'c2', id: 2 }
```

### 隐含的问题

属性或者方法想被继承的话，只能在构造函数中定义。而如果方法在构造函数内定义了，那么每次创建实例都会创建一遍方法，多占一块内存。

```javascript
function Parent(name, actions) {
  this.actions = actions;
  this.name = name;
  this.eat = function () {
    console.log(`${name} - eat`);
  };
}

function Child(id) {
  Parent.apply(this, Array.prototype.slice.call(arguments, 1));
  this.id = id;
}

const child1 = new Child(1, "c1", ["eat"]);
const child2 = new Child(2, "c2", ["sing", "jump", "rap"]);

console.log(child1.eat === child2.eat); // false
```

## 组合继承

通过原型链继承我们实现了基本的继承，方法存在 prototype 上，子类可以直接调用。但是引用类型的属性会被所有实例共享，并且不能传参。

通过构造函数继承，我们解决了上面的两个问题：使用 call 在子构造函数内重复一遍属性和方法创建的操作，并且可以传参了。

但是构造函数同样带来了一个问题，就是构造函数内重复创建方法，导致内存占用过多。

是不是突然发现原型链继承是可以解决方法重复创建的问题？ 所以我们将这两种方式结合起来，这就叫做组合继承

### 实现

```javascript
function Parent(name, actions) {
  this.name = name;
  this.actions = actions;
}

Parent.prototype.eat = function () {
  console.log(`${this.name} - eat`);
};

function Child(id) {
  Parent.apply(this, Array.from(arguments).slice(1));
  this.id = id;
}

Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child1 = new Child(1, "c1", ["hahahahahhah"]);
const child2 = new Child(2, "c2", ["xixixixixixx"]);

child1.eat(); // c1 - eat
child2.eat(); // c2 - eat

console.log(child1.eat === child2.eat); // true
```

### 隐含的问题

调用了两次构造函数，做了重复的操作

1. Parent.apply(this, Array.from(arguments).slice(1));
2. Child.prototype = new Parent();

## 寄生组合式继承

上面重复调用了 2 次构造函数，想一下，我们可以精简掉哪一步？

我们可以考虑让 Child.prototype 间接访问到 Parent.prototype

### 实现

```javascript
function Parent(name, actions) {
  this.name = name;
  this.actions = actions;
}

Parent.prototype.eat = function () {
  console.log(`${this.name} - eat`);
};

function Child(id) {
  Parent.apply(this, Array.from(arguments).slice(1));
  this.id = id;
}

// 模拟Object.create的效果
// 如果直接使用Object.create的话，可以写成Child.prototype = Object.create(Parent.prototype);
let TempFunction = function () {};
TempFunction.prototype = Parent.prototype;
Child.prototype = new TempFunction();

Child.prototype.constructor = Child;

const child1 = new Child(1, "c1", ["hahahahahhah"]);
const child2 = new Child(2, "c2", ["xixixixixixx"]);
```

也许有的同学会问，为什么一定要通过桥梁的方式让 Child.prototype 访问到 Parent.prototype？
直接 Child.prototype = Parent.prototype 不行吗？
答：不行！！

咱们可以来看一下

```javascript
function Parent(name, actions) {
  this.name = name;
  this.actions = actions;
}

Parent.prototype.eat = function () {
  console.log(`${this.name} - eat`);
};

function Child(id) {
  Parent.apply(this, Array.from(arguments).slice(1));
  this.id = id;
}

Child.prototype = Parent.prototype;

Child.prototype.constructor = Child;

console.log(Parent.prototype); // Child { eat: [Function], childEat: [Function] }

Child.prototype.childEat = function () {
  console.log(`childEat - ${this.name}`);
};

const child1 = new Child(1, "c1", ["hahahahahhah"]);

console.log(Parent.prototype); // Child { eat: [Function], childEat: [Function] }
```

可以看到，在给 Child.prototype 添加新的属性或者方法后，Parent.prototype 也会随之改变，这可不是我们想看到的。