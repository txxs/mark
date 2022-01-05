const algoSc = require('../algo')

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
const javajvmSc = require('../java/jvm')
const javaspringSc = require('../java/spring')
const javathreadSc = require('../java/thread')

const kafkaSc = require('../kafka')

const q&ainterviewSc = require('../q&a/interview')
const q&aselSc = require('../q&a/self')
const q&atujiSc = require('../q&a/tuji')

const selfSc = require('../self')



module.exports = {
  title: 'Mark',
  description: '用来记录工作和学习过程中的笔记，汇总成册方便查阅，类容涵盖各类技术，如：Java、Git、ElasticSearch、MyCat、设计模式、Gradle、Vue - mrcode.cn',
  base: '/note-book/', // gh-page 中是增加了项目名
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
    ['link', { rel: 'icon', href: '/favicon.ico' }],
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
    repo: 'https://github.com/zq99299/note-book',
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
        text: '工程算法', items: [
          { text: '个人总结', link: '/algo/' }
        ]
      },
      {
        text: '业务', items: [
          { text: 'buss', link: '/buss/' },
          { text: '高级知识篇', link: '/elasticsearch-senior/' }
        ]
      },
      {
        text: '数据库', items: [
          { text: 'ES', link: '/db/es' },
          { text: 'Mysql', link: '/db/mysql' },
          { text: 'redis', link: '/db/redis' },
        ]
      },
      {
         text: '分布式', items: [
                { text: '理论', link: '/distri/the' },
                { text: 'rpc', link: '/distri/rpc' },
                { text: 'zk', link: '/distri/zk' },
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
          { text: 'collection', link: '/java/collection' },
          { text: 'jvm', link: '/java/jvm' },
          { text: 'thread', link: '/java/thread' },
          { text: 'io', link: '/java/io' },
          { text: 'spring', link: '/java/spring' },
        ]
      },
      {
        text: 'kafka', items: [
          { text: 'kafka', link: '/kafka/' }
        ]
      },
      {
        text: 'q&a', items: [
          { text: '问答', link: '/q&a/interview' },
          { text: '自己', link: '/q&a/self' },
          { text: '突击', link: '/q&a/tuji' }
        ]
      },
      {
         text: '总结', items: [
           { text: '问答', link: '/self' }
         ]
       }
    ],
    sidebar: {
            '/algo/': algoSc(),
            '/buss/': bussSc(),

            '/db/es/': dbesSc(),
            '/db/mysql/': dbmysqlSc(),
            '/db/redis/': dbredisSc(),


      	  '/distri/rpc/': distrirpcSc(),
            '/distri/the/': distritheSc(),
            '/distri/zk/': distrizkSc(),

            '/internet/': internetSc(),

            '/interview/': interviewSc(),

            '/ava/collection/': javacollectionSc(),
            '/java/io/': javaioSc(),
            '/java/jvm/': javajvmSc(),
            '/java/spring/': javaspringSc(),
            '/java/thread/': javathreadSc(),

            '/kafka/': kafkaSc(),

            '/q&a/interview/': q&ainterviewSc(),
            '/q&a/self/': q&aselSc(),
            '/q&a/tuji/': q&atujiSc(),

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
