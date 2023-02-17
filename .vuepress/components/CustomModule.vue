<template>
  <section class="custom-module-wrapper flex-c" :style="{ ...bgImageStyle }">
    <div class="custom-module-content flex" :style="{ ...contentStyle }">
      <img v-if="heroImage" :src="heroImage" :style="{ ...heroImageStyle }" alt="customHeroImage" />
      <div class="custom-hero-content">
        <h1 class="custom-hero-text" v-if="frontmatter?.customModule?.heroText">{{ frontmatter?.customModule?.heroText }}</h1>
        <p v-if="frontmatter?.customModule?.tagline">{{ frontmatter?.customModule?.tagline }}</p>
        <div class="btn-group" v-if="buttons.length > 0">
          <Xicons
            class="cus-btn"
            style="color: #fff"
            v-for="(btn, index) in buttons" :class="btn.type" :key="index"
            :icon="btn.icon"
            :text="btn.text"
            :link="btn.link"
            icon-size="18"
            text-size="14"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { computed } from "vue";
import { usePageFrontmatter, withBase } from '@vuepress/client'
const frontmatter = usePageFrontmatter()
const heroImage = computed(() => {
  console.log(frontmatter.value)
  return frontmatter.value?.customModule?.heroImage
    ? withBase(frontmatter.value?.customModule?.heroImage)
    : null
})
const heroImageStyle = computed(
  () => frontmatter.value?.customModule?.heroImageStyle || {}
)
const contentStyle = computed(() => {
  return frontmatter.value?.customModule?.contentStyle || {}
})
const buttons = computed(() => {
  return frontmatter.value?.customModule?.buttons || []
})
const bgImageStyle = computed(() => {
  const { bgImageStyle, bgImage } = frontmatter.value?.customModule || {}
  const initBgImageStyle = bgImage ? {
    textAlign: 'center',
    overflow: 'hidden',
    background: `url(${withBase(bgImage)}) center/cover no-repeat`
  } : {}
  return bgImageStyle ? { ...initBgImageStyle, ...bgImageStyle } : initBgImageStyle
})
</script>
<style lang="scss" scpoed>
.flex-c {
  display: flex;
  justify-content: center;
  align-items: center;
}
.custom-module-wrapper {
  height: 100vh;
  width: 100%;
}
.custom-module-content {
  display: flex;
  flex-direction: row-reverse;
  img {
    display: block;
    margin-bottom: 0 0 64px 64px;
    width: 240px;
    height: 240px;
  }
}
.custom-hero-content {
  margin-bottom: 64px;
  padding: 0 24px;
  text-align: left;
  .custom-hero-text {
    font-size: 60px;
    line-height: 1;
    background-image: linear-gradient(60deg, #5D67E8, #ef4444);
    background-clip: text;
    color: transparent;
  }
  .btn-group {
    margin-top: 32px;
    .cus-btn {
      padding: 12px 24px;
      background-color: #5D67E8;
      font-size: 600;
      border-radius: 5px;
    }
  }
}
@media (max-width: 768px){
  .custom-module-wrapper {
    height: 100%;
  }
  .custom-module-content {
    display: flex;
    flex-direction: column;
    img {
      display: block;
      margin: 128px auto 64px;
      width: 160px;
      height: 160px;
    }
    .custom-hero-content {
      text-align: center;
      .custom-hero-text {
        font-size: 36px;
        margin-bottom: 24px;
      }
    }
  }
}
</style>