<template>
  <component v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'
export default {
  name: 'AppLink',
  props: {
    to: {
      type: String,
      default: '',
      required: true
    }
  },
  methods: {
    linkProps(url) {
      // 是外部连接 重新开一个窗口
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }

}
</script>

<style>

</style>
