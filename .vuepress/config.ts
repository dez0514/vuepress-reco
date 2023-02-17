import { defineUserConfig } from "vuepress";
// import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  title: "前端笔记",
  description: "记录学习，记录日常",
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
    docsDir: "example",
    lastUpdatedText: "最后更新时间",
    catalogTitle: '此页内容',
    // series 为原 sidebar
    series: {
      "/blogs/javascript/": [
        'readme',
        'ES6',
        'EventLoop'
      ],
      // "/docs/theme-reco/": [
      //   {
      //     text: "module one",
      //     children: ["home", "theme"],
      //   },
      //   {
      //     text: "module two",
      //     children: ["api", "plugin"],
      //   },
      // ],
    },
    navbar: [
      { text: "javascript", link: "/blogs/javascript/ES6" },
      { text: "分类", link: "/categories/reco/1/" },
      { text: "标签", link: "/tags/tag1/1/" },
      {
        text: "其他",
        children: [
          { text: "vuepress-reco", link: "/docs/theme-reco/theme" },
          { text: "vuepress-theme-reco", link: "/blogs/other/guide" },
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
