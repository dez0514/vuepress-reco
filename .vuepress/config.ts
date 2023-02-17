import { defineUserConfig } from "vuepress";
// import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
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
      "/blogs/nodejs/": ["README.md"]
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
          content: `🎉🎉🎉 reco 主题 2.x 尝鲜。`,
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
              link: "/docs/theme-reco/message.html",
            },
          ],
        },
      ],
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
  }),
  // debug: true,
});
