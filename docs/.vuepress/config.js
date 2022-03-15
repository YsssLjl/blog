module.exports = {
  title: "前端技术",
  description: "前端技术",
  theme: "reco",
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  base: "/blog/",
  themeConfig: {
    subSidebar: "auto",
    nav: [
      {
        text: "首页",
        link: "/",
      },
      {
        text: "Ys的前端技术博客",
        items: [
          {
            text: "Github",
            link: "https://github.com/chlorishi",
          },
        ],
      },
    ],
    sidebar: [
      {
        title: "知识分享",
        path: "/handbook/modules",
        collapsable: false, // 不折叠
        children: [
          {
            title: "前端模块化",
            path: "/handbook/modules",
          },
          {
            title: "Promise",
            path: "/handbook/promise",
          },
          {
            title: "面向对象编程",
            path: "/handbook/oop",
          },
          {
            title: "原型及原型链",
            path: "/handbook/prototype",
          },
          {
            title: "继承",
            path: "/handbook/extends",
          },
          {
            title: "设计模式",
            path: "/handbook/ocp",
            collapsable: true, // 不折叠
            children: [
              {
                title: "开闭原则",
                path: "/handbook/ocp",
              },
              {
                title: "单一职责原则",
                path: "/handbook/srp",
              },
              {
                title: "接口隔离原则",
                path: "/handbook/isp",
              },
              {
                title: "依赖倒置原则",
                path: "/handbook/dip",
              },
              {
                title: "里氏替换原则",
                path: "/handbook/lsp",
              },
              {
                title: "行为型",
                path: "/handbook/behaviorPattern",
              },
              {
                title: "结构型",
                path: "/handbook/contructionPattern",
              },
              {
                title: "元素创建型",
                path: "/handbook/createPattern",
              },
            ],
          },
          {
            title: "微前端",
            path: "/handbook/mirco",
          },
        ],
      },
    ],
  },
};
