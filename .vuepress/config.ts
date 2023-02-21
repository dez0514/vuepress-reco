import { defineUserConfig } from "vuepress";
// import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  base: '/vuepress-reco/',
  title: "前端笔记",
  description: "Just go ahead",
  head: [
    ['link', { rel: 'icon', href: '/basketball.png' }]
  ],
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    logo: "/head.png",
    author: "寒山少年",
    authorAvatar: "/head.png",
    docsRepo: "https://github.com/dez0514",
    docsBranch: "main",
    docsDir: "",
    lastUpdatedText: "最后更新时间",
    catalogTitle: '此页内容',
    // series 为原 sidebar
    series: {
      "/blogs/javascript/": [
        'README.md', // 默认模块首页
        'ES6',
        'EventLoop'
      ],
      "/blogs/Vue/vuex/": ["README.md"],
      "/blogs/Vue/vue-router/": ["README.md"],
      "/blogs/React/": ["README.md"],
      "/blogs/webpack/": ["README.md"],
      "/blogs/nodejs/": ["README.md"],
      "/blogs/other/interview/": ["README.md"]
    },
    navbar: [
      // { text: "分类", link: "/categories/reco/1/" },
      // { text: "标签", link: "/tags/tag1/1/" },
      { text: "javascript", link: "/blogs/javascript/" },
      {
        text: "Vue",
        children: [
          { text: "vue-router", link: "/blogs/Vue/vue-router/" },
          { text: "vuex", link: "/blogs/Vue/vuex/" }
        ],
      },
      { text: "React", link: "/blogs/React/" },
      { text: "webpack", link: "/blogs/webpack/" },
      { text: "nodejs", link: "/blogs/nodejs/" },
      {
        text: "其他",
        children: [
          { text: "github", link: "https://github.com/dez0514" },
          { text: "面试题", link: "/blogs/other/interview/" },
        ],
      },
    ],
    bulletin: {
      body: [
        {
          type: "text",
          content: `🎉🎉🎉 vuepress-reco 主题 2.x 尝鲜。没玩过这种配置的玩意，开始还是有点费劲的，文档比较简洁，大胆尝试吧，用来记笔记还不错的。`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "title",
          content: "GitHub",
        },
        {
          type: "text",
          content: `
          <ul>
            <li><a style="color: #4954e6" href="https://github.com/dez0514">github<a/></li>
          </ul>`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "buttongroup",
          children: [
            {
              text: "留言",
              link: "/vuepress-reco/docs/message",
            },
          ],
        },
      ]
    },
    // valineConfig 配置与 1.x 一致
    // valineConfig: {
    //   appId: 'xxx',
    //   appKey: 'xxx',
    //   placeholder: '填写邮箱可以收到回复提醒哦！',
    //   verify: true, // 验证码服务
    //   // notify: true,
    //   recordIP: true,
    //   // hideComments: true // 隐藏评论
    // },
    //评论
    commentConfig: {
      type: 'valine',
      options: {
        appId: '3zvBHCvTKGB4NsZzdO2KPjxZ-gzGzoHsz', // your appId
        appKey: 'jJdDQNq2XsDIKjCDlwo4JY6K', // your appKey
        placeholder: '理性留言...',
        serverURLs: 'https://3zvbhcvt.lc-cn-n1-shared.com',// https://kiqrtssv.lc-cn-n1-shared.com // 该配置适用于国内自定义域名用户, 海外版本会自动检测(无需手动填写) 
        visitor: true,//文章访问量统计。
        enableQQ: true,// 阅读量统计
        avatar: 'robohash',//头像
        recordIP: true,//是否记录评论者IP
        hideComments: false, // 全局隐藏评论，默认 false
      },
    },
  }),
  // debug: true,
});
