# 部署静态网页到 github.io

## 步骤
提示：可能以下某些步骤多余，但我是这么做的~。
1. 首先在github的setting里，我配了SSH keys，这便于我提交和拉取代码。
2. 创建代码仓库之后，按照正常流程，写个空项目提交上去。
3. 通常框架项目，例如 vue，react 框架开发的项目，需要打包之后用打包文件去部署，github仓库主分支（main）通常放开发源码。此时需要建一个分支用来放打包之后的文件。
4. 建分支：`gh-pages` , 设置仓库，选到 `Settings`。
  1. 选到侧边栏 `Pages`; `Build and deployment` 里 `Source` 选择 `Deploy from a branch`;
  `Branch` 里 分支选 `gh-pages`, 目录选 `root`, 点保存。
  2. 选到侧边栏 `Actions -> General` ,勾选权限Actions permissions：就默认第一个 `Allow all Actions and reuseable worflows`, Artifact and log retention：也是默认。主要是修改Workflow permissions勾选：选 `Read and write permissions`, 
  3. 将最后一行勾上：`Allow Github Actions to create and approve pull request` 保存。
5. 在开发源码根目录，新增目录文件 `.github/workflows/deploy.yml`，用来自动部署的action，yml内容根据不同项目微调， 同时将 npm/yarn 的lock文件也提交一份。
6. 提交代码 就会自动触发 action 部署。可以去代码仓库的 `Actions` 栏看部署进度和日志。如果部署成功可以去`Setting`栏的 `Pages` 里看到部署地址点击访问就行了。如果失败看具体报错，对症修改。
7. 打包时最好将 baseUrl 配置成仓库名称。


```yml
name: Deploy
 
on:
  push:
    branches:
      - main
 
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 17
          # node 版本控制
          cache: npm
          cache-dependency-path: '**/package-lock.json'
          # cache: yarn 如果用的yarn
      - name: Install
        run: 
          npm install
          # yarn install 安装依赖命令
      - name: Build
        run: 
          npm run build
          # yarn build 打包命令
      - name: Git config email
      # 如果权限问题，可能是勾选不对，如果勾选对了，可以试试加上下面的配置。
      #   run:
      #     git config --global user.email "xxx@qq.com"
      # - name: Git config name
      #   run:
      #     git config --global user.name "xxx"
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: dist
          # 打包文件的根目录，也就是提交到 gh-pages 分支的根目录

```