import{_ as n,p as s,q as a,J as e}from"./framework-4a7f5a2b.js";const t={},i=e(`<h1 id="部署静态网页到-github-io" tabindex="-1"><a class="header-anchor" href="#部署静态网页到-github-io" aria-hidden="true">#</a> 部署静态网页到 github.io</h1><h2 id="步骤" tabindex="-1"><a class="header-anchor" href="#步骤" aria-hidden="true">#</a> 步骤</h2><p>提示：可能以下某些步骤多余，但我是这么做的~。</p><ol><li>首先在github的setting里，我配了SSH keys，这便于我提交和拉取代码。</li><li>创建代码仓库之后，按照正常流程，写个空项目提交上去。</li><li>通常框架项目，例如 vue，react 框架开发的项目，需要打包之后用打包文件去部署，github仓库主分支（main）通常放开发源码。此时需要建一个分支用来放打包之后的文件。</li><li>建分支：<code>gh-pages</code> , 设置仓库，选到 <code>Settings</code>。</li><li>选到侧边栏 <code>Pages</code>; <code>Build and deployment</code> 里 <code>Source</code> 选择 <code>Deploy from a branch</code>; <code>Branch</code> 里 分支选 <code>gh-pages</code>, 目录选 <code>root</code>, 点保存。</li><li>选到侧边栏 <code>Actions -&gt; General</code> ,勾选权限Actions permissions：就默认第一个 <code>Allow all Actions and reuseable worflows</code>, Artifact and log retention：也是默认。主要是修改Workflow permissions勾选：选 <code>Read and write permissions</code>,</li><li>将最后一行勾上：<code>Allow Github Actions to create and approve pull request</code> 保存。</li><li>在开发源码根目录，新增目录文件 <code>.github/workflows/deploy.yml</code>，用来自动部署的action，yml内容根据不同项目微调， 同时将 npm/yarn 的lock文件也提交一份。</li><li>提交代码 就会自动触发 action 部署。可以去代码仓库的 <code>Actions</code> 栏看部署进度和日志。如果部署成功可以去<code>Setting</code>栏的 <code>Pages</code> 里看到部署地址点击访问就行了。如果失败看具体报错，对症修改。</li><li>打包时最好将 baseUrl 配置成仓库名称。</li></ol><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">name</span><span class="token punctuation">:</span> Deploy
 
<span class="token key atrule">on</span><span class="token punctuation">:</span>
  <span class="token key atrule">push</span><span class="token punctuation">:</span>
    <span class="token key atrule">branches</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> main
 
<span class="token key atrule">jobs</span><span class="token punctuation">:</span>
  <span class="token key atrule">deploy</span><span class="token punctuation">:</span>
    <span class="token key atrule">runs-on</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">-</span>latest
    <span class="token key atrule">steps</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v3
      <span class="token punctuation">-</span> <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/setup<span class="token punctuation">-</span>node@v3
        <span class="token key atrule">with</span><span class="token punctuation">:</span>
          <span class="token key atrule">node-version</span><span class="token punctuation">:</span> <span class="token number">17</span>
          <span class="token comment"># node 版本控制</span>
          <span class="token key atrule">cache</span><span class="token punctuation">:</span> npm
          <span class="token key atrule">cache-dependency-path</span><span class="token punctuation">:</span> <span class="token string">&#39;**/package-lock.json&#39;</span>
          <span class="token comment"># cache: yarn 如果用的yarn</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Install
        <span class="token key atrule">run</span><span class="token punctuation">:</span> 
          npm install
          <span class="token comment"># yarn install 安装依赖命令</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Build
        <span class="token key atrule">run</span><span class="token punctuation">:</span> 
          npm run build
          <span class="token comment"># yarn build 打包命令</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Git config email
      <span class="token comment"># 如果权限问题，可能是勾选不对，如果勾选对了，可以试试加上下面的配置。</span>
      <span class="token comment">#   run:</span>
      <span class="token comment">#     git config --global user.email &quot;xxx@qq.com&quot;</span>
      <span class="token comment"># - name: Git config name</span>
      <span class="token comment">#   run:</span>
      <span class="token comment">#     git config --global user.name &quot;xxx&quot;</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Deploy
        <span class="token key atrule">uses</span><span class="token punctuation">:</span> peaceiris/actions<span class="token punctuation">-</span>gh<span class="token punctuation">-</span>pages@v3
        <span class="token key atrule">with</span><span class="token punctuation">:</span>
          <span class="token key atrule">github_token</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.GITHUB_TOKEN <span class="token punctuation">}</span><span class="token punctuation">}</span>
          <span class="token key atrule">publish_dir</span><span class="token punctuation">:</span> dist
          <span class="token comment"># 打包文件的根目录，也就是提交到 gh-pages 分支的根目录</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),l=[i];function c(o,p){return s(),a("div",null,l)}const d=n(t,[["render",c],["__file","index.html.vue"]]);export{d as default};
