<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'APP',
  created () {
    this.$i18n.locale = 'zh-CN'
  }
}
</script>

<style lang="scss">
html,body{
  width: 100%;
  min-width: 1280px;
  height: 100%;
  box-sizing: border-box;
  // overflow-x: scroll;
  overflow-y: hidden;
  margin: 0;
  padding: 0;
}
</style>
