const algoProjectSc = require('../algo/project')
const algoSumSc = require('../algo/sum')

const bussSc = require('../buss')

const dbesSc = require('../db/es')
const dbmysqlSc = require('../db/mysql')
const dbredisSc = require('../db/redis')

const distrirpcSc = require('../distri/rpc')
const distritheSc = require('../distri/the')
const distrizkSc = require('../distri/zk')

const internetSc = require('../internet')

const interviewSc = require('../interview')

const javacollectionSc = require('../java/collection')
const javaioSc = require('../java/io')
const javaspringSc = require('../java/spring')
const javathreadSc = require('../java/thread')

const kafkaSc = require('../kafka')

const qainterviewSc = require('../q&a/interview')
const qaselSc = require('../q&a/self')
const qatujiSc = require('../q&a/tuji')
const keySc = require('../q&a/key')

const selfSc = require('../self')



module.exports = {
  title: 'Mark',
  description: '本博客主要是用来记录系统化的知识，内容部分来自github上的其他开源仓库，如有问题联系sdlyjhm01@sina.com',
  base: '/mark/', // gh-page 中是增加了项目名
  dest: 'build/.vuepress/dist',  // 目录配置在外,纯粹是有代码洁癖和强迫症，并不能规避开发模式下同时构建不报错的问题
  host: 'localhost', // dev 的域名
  port: 8080,
  // locales: {
  //     // 键名是该语言所属的子路径
  //     // 作为特例，默认语言可以使用 '/' 作为其路径。
  //     // '/': {
  //     //     lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
  //     // }
  // },
  head:[
    ['link', { rel: 'icon', href: '/mlogo.svg' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
  ],
  markdown: {
    lineNumbers: true
  },
  // theme: 'vue',
  themeConfig: {
    docsDir: 'docs',
    sidebar: 'auto',
    sidebarDepth: 3, // 嵌套标题侧边栏提取深度，最大为 2，会提取到 h3
    lastUpdated: '上次更新', // string | boolean
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'https://github.com/txxs/mark',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    repoLabel: 'GitHub',
    // 以下为可选的编辑链接选项
    // 假如你的文档仓库和项目本身不在一个仓库：
    // docsRepo: 'vuejs/vuepress',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    docsBranch: 'master',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！',
    logo: '/mlogo.svg',
    // 主题级别的配置
    serviceWorker: {
      updatePopup: true // Boolean | Object, 默认值是 undefined.
      // 如果设置为 true, 默认的文本配置将是:
      // updatePopup: {
      //    message: "New content is available.",
      //    buttonText: "Refresh"
      // }
    },
    nav: [
      { text: '博客github', link: 'https://txxs.github.io/record/' },
      {
        text: '算法', items: [
          { text: '工程算法', link: '/algo/project/' },
          { text: '常用算法', link: '/algo/sum/' },
        ]
      },
      {
        text: '业务', items: [
          { text: 'buss', link: '/buss/' }
        ]
      },
      {
        text: '数据库', items: [
          { text: 'ES', link: '/db/es/' },
          { text: 'Mysql', link: '/db/mysql/' },
          { text: 'redis', link: '/db/redis/' },
        ]
      },
      {
         text: '分布式', items: [
                { text: '理论', link: '/distri/the/' },
                { text: 'rpc', link: '/distri/rpc/' },
                { text: 'zk', link: '/distri/zk/' },
              ]
      },
      {
        text: '网络', items: [
          { text: '网络', link: '/internet/' }
        ]
      },
      {
        text: '问答', items: [
          { text: '问答', link: '/interview/' }
        ]
      },
      {
        text: 'java', items: [
          { text: 'collection', link: '/java/collection/' },
          { text: 'thread', link: '/java/thread/' },
          { text: 'io', link: '/java/io/' },
          { text: 'spring', link: '/java/spring/' },
        ]
      },
      {
        text: 'kafka', items: [
          { text: 'kafka', link: '/kafka/' }
        ]
      },
      {
        text: 'q&a', items: [
          { text: '问答', link: '/q&a/interview/' },
          { text: '自己', link: '/q&a/self/' },
          { text: '突击', link: '/q&a/tuji/' },
          { text: 'key', link: '/q&a/key/' }
        ]
      },
      {
         text: '总结', items: [
           { text: '问答', link: '/self/' }
         ]
       }
    ],
    sidebar: {
            '/algo/project': algoProjectSc(),
            '/algo/sum': algoSumSc(),

            '/buss/': bussSc(),

            '/db/es/': dbesSc(),
            '/db/mysql/': dbmysqlSc(),
            '/db/redis/': dbredisSc(),


      	  '/distri/rpc/': distrirpcSc(),
            '/distri/the/': distritheSc(),
            '/distri/zk/': distrizkSc(),

            '/internet/': internetSc(),

            '/interview/': interviewSc(),

            '/java/collection/': javacollectionSc(),
            '/java/io/': javaioSc(),
            '/java/spring/': javaspringSc(),
            '/java/thread/': javathreadSc(),

            '/kafka/': kafkaSc(),

            '/q&a/interview/': qainterviewSc(),
            '/q&a/self/': qaselSc(),
            '/q&a/tuji/': qatujiSc(),
            '/q&a/key/': keySc(),

            '/self/': selfSc()
    }
  },
  plugins: [
    ['@vuepress/back-to-top', true],
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: {
        message: '有新内容更新啦~',
        buttonText: '立即获取新内容，确定后稍后自动刷新'
      }
    }],
    ['@vuepress/medium-zoom', {
      selector: '.theme-default-content img'
    }],
    ['@vuepress/search', {
      searchMaxSuggestions: 10
    }],
    ['vuepress-plugin-code-copy', true],
    ['@vuepress/last-updated', {
      transformer: (timestamp, lang) => {
        // 不要忘了安装 moment
        const moment = require('moment')
        // moment.locale(lang)
        // return moment(timestamp).fromNow()
        return moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
      }
    }],
    ['vuepress-plugin-baidu-tongji-analytics', {
      key: '63b757e8938717e95e7218e8e1341393'
    }],
    ['vuepress-plugin-tags'],
    ['vuepress-plugin-baidu-autopush', true]
  ]
}
