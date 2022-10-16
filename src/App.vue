<template>
<div>
  App <button @click="fn">测试request工具函数</button>
</div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'App',
  setup () {
    const fn = () => {
      const res = request('/member/profile', 'GET', { a: 10 })
      console.log(res)
    }
    return { fn }
  }
}
</script>

<style>
</style>
