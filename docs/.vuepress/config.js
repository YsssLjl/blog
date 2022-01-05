module.exports = {
    title: '前端技术',
    description: '前端技术',
    theme: 'reco',
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    base: '/blog/',
    themeConfig: {
        subSidebar: 'auto',
        nav: [{
                text: '首页',
                link: '/'
            },
            {
                text: 'Ys的前端技术博客',
                items: [{
                    text: 'Github',
                    link: 'https://github.com/chlorishi'
                }, ]
            }
        ],
        sidebar: [{
                title: '欢迎学习',
                path: '/',
                collapsable: false, // 不折叠
                children: [{
                    title: "学前必读",
                    path: "/"
                }]
            },
            {
                title: "基础学习",
                path: '/handbook/modules',
                collapsable: false, // 不折叠
                children: [{
                        title: "前端模块化",
                        path: "/handbook/modules"
                    },
                    {
                        title: "Promise",
                        path: "/handbook/promise"
                    },
                    {
                        title: "面向对象编程",
                        path: "/handbook/oop"
                    },
                    {
                        title: "原型及原型链",
                        path: "/handbook/prototype"
                    },
                    {
                        title: "继承",
                        path: "/handbook/extends"
                    }
                ],
            }
        ]
    }
}