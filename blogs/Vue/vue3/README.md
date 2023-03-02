# vue3 

## 组合式API: setup()

Vue 3 的 `Composition API` 系列里，推出了一个全新的 setup 函数，它是一个组件选项，在创建组件之前执行，一旦 `props` 被解析，并作为组合式 API 的入口点。

setup是一个接收`props`和`context`的函数，最后setup需要`return`所有内容暴露给模板。

```vue
<script>
// 这是一个基于 TypeScript 的 Vue 组件
import { defineComponent } from 'vue'

export default defineComponent({
  setup(props, context) {
    // 在这里声明数据，或者编写函数并在这里执行它
    console.log(context)
    return {
      // 需要给 `<template />` 用的数据或函数，在这里 `return` 出去
    }
  },
})
</script>
```

新的 `setup` 选项是在组件创建之前, `props` 被解析之后执行，是组合式 API 的入口。

> *注意：在setup中不能使用this，因为他找不到实例。但是在vue2语法和vue3语法混用的时候，vue2语法中可以使用this访问到setup里暴露出的变量。

## 组件的生命周期

![](/vue/lifecycle.png)

可以看到 Vue 2 生命周期里的 beforeCreate 和 created ，在 Vue 3 里已被 setup 替代。

## setup语法糖

```vue
<script setup>

</script>
```
1. 它只是简化了以往的组合API（compositionApi）的必须返回（return）的写法，并且有更好的运行时性能。
2. 在setup函数中所有 ES 模块导出都被认为是暴露给上下文的值，并包含在 setup() 返回对象中。相对于之前的写法，使用后，语法也变得更简单。

## ref
`ref`是最常用的一个响应式 API，它可以用来定义所有类型的数据，包括 Node 节点和组件。返回一个响应式对象，所有的值都通过`.value`属性获取。
```vue
<template>
  <div>{{num}}</div>
</template>
<script setup >
import { ref } from 'vue'

const num = ref(0)

</script>
```

## reactive
返回一个对象的响应式代理。
```vue
<template>
  <div>{{state.searchInfo.name}}</div>
</template>
<script setup >
import { reactive } from 'vue'

const state = reactive({
  searchInfo: {
    name: 'Jack',
  },
})
</script>
```
## 组件自动注册
在`setup`中不再需要用过`components`进行注册，直接引入即可食用。

```vue
<template>
 <Child />
</template>

<script setup>
import Child from '@/components/Child.vue'
</script>
```
## defineProps
接收父组件传过来的内容,可以定义类型和默认值

```vue
const props = defineProps({
  modelValue: {
    type: Array,
    default: (() => {[]}),
  },
})
```
## defineEmit
子组件向父组件传递内容事件

```vue
const text = ref(1)
const emit = defineEmits(['update:modelValue'])
emit('update:modelValue', text.value)
```
## defineExpose
向外暴露组件内方法和属性

传统的写法，我们可以在父组件中，通过 `ref` 实例的方式去访问子组件的内容，但在 `script setup` 中，该方法就不能用了，`setup` 相当于是一个闭包，除了内部的 `template` 模板，谁都不能访问内部的数据和方法。

> `<script setup>` 的组件默认不会对外部暴露任何内部声明的属性。如果有部分属性要暴露出去，可以使用 `defineExpose`

```vue
// 子组件
const table = ref(null)
defineExpose({
  table,
})
```
```vue
// 父组件
<template>
 <Child ref="child" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

let child = ref(null);

onMounted(() => {
 console.log(child.value.table); // Child Components
})
</script>
```

## watch 和 watchEffect
区别：
1. watch是惰性执行，也就是只有监听的值发生变化的时候才会执行，但是watchEffect不同，每次代码加载watchEffect都会执行（忽略watch第三个参数的配置，如果修改配置项也可以实现立即执行）

2. watch需要传递监听的对象，watchEffect不需要

3. watch只能监听响应式数据：ref定义的属性和reactive定义的对象，如果直接监听reactive定义对象中的属性是不允许的，除非使用函数转换一下

4. watchEffect如果监听reactive定义的对象是不起作用的，只能监听对象中的属性。

```vue
// watch
watch(
  source, // 必传，要侦听的数据源
  callback // 必传，侦听到变化后要执行的回调函数
  // options // 可选，一些侦听选项
)
```
```vue
// watchEffect
<template>
  <div>{{num}}</div>
</template>
<script setup >
import { watchEffect, watch, ref } from 'vue'

const num = ref(1)

var id = setInterval(() => {
  num.value = num.value + 1
  if (num.value === 20) {
    clearInterval(id)
    id = null
  }
}, 1000)

watchEffect(() => {
  console.log(1111)
})

watch(() => num.value, () => {
  console.log(222, num.value)
})
</script>
```

## seSlots() 和 useAttrs()
获取插槽数据和获取attrs数据，里面包含了 class、属性、方法。
```vue
// 旧
<script setup>
  import { useContext } from 'vue'

  const { slots, attrs } = useContext()
</script>

// 新
<script setup>
  import { useAttrs, useSlots } from 'vue'

  const attrs = useAttrs()
  const slots = useSlots()
</script>
```
### 其他 Hook Api

1. useCSSModule：CSS Modules 是一种 CSS 的模块化和组合系统。vue-loader 集成 CSS Modules，可以作为模拟 scoped CSS。允许在单个文件组件的setup中访问CSS模块。此 api 本人用的比较少，不过多做介绍。
2. useCssVars: 此 api 暂时资料比较少。介绍v-bind in styles时提到过。
3. useTransitionState: 此 api 暂时资料比较少。
4. useSSRContext: 此 api 暂时资料比较少。