// // 快速排序  分治
// const quickSort = (arr) => {
//   if (arr.length < 2) {
//     return arr;
//   }
//   let value = arr[0];

//   let left = [];
//   let right = [];
//   for (let i = 1; i < arr.length; i++) {
//     if (arr[i] < value) {
//       left.push(arr[i]);
//     } else {
//       right.push(arr[i]);
//     }
//   }

//   return quickSort(left).concat([value], quickSort(right));
// };

// 冒泡排序
// const bubblleSort = (arr) => {
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = 0; j < arr.length - i; j++) {
//       if (arr[j] > arr[j + 1]) {
//         let swap = arr[j];
//         arr[j] = arr[j + 1];
//         arr[j + 1] = swap;
//       }
//     }
//   }
// };
// console.log(bubblleSort(arr1), arr1);

//实现数组扁平化
// let arr = [1, 2, 3, [4, 5, [6]]];
// const flatten = (list, depth = 1) => {
//   if (depth == 0) return list;
//   return list.reduce((acc, cur) => {
//     return acc.concat(Array.isArray(cur) ? flatten(cur, depth - 1) : cur);
//   }, []);
// };

// console.log(flatten(arr, 0));

// 防抖节流

// const debounce = (fn, wait) => {
//   let timer;
//   return () => {
//     let callNow = !timer;
//     if (timer) clearTimeout(timer);
//     timer = setTimeout(() => {
//       timer = null;
//     }, wait);
//     if (callNow) fn();
//   };
// };

// const throttle = (fn, wait) => {
//   // let pretime = 0;
//   // return () => {
//   //   let now = new Date();
//   //   if (now - pretime > wait) {
//   //     fn();
//   //     pretime = now;
//   //   }
//   // };
//   let timer;
//   return () => {
//     if (!timer) {
//       timer = setTimeout(() => {
//         fn();
//         timer = null;
//       }, wait);
//     }
//   };
// };

// var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];

// const fun = (list) => {
//   const flatten = (list) => {
//     return list.reduce(
//       (acc, cur) => acc.concat(Array.isArray(cur) ? flatten(cur) : cur),
//       []
//     );
//   };
//   return Array.from(new Set(flatten(list))).sort((a, b) => a - b);
// };
// console.log(fun(arr));
