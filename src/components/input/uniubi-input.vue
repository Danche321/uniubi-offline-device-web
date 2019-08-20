<template>
  <div class="uniubi-input">
    <el-input
      ref="input"
      @keyup.enter.native="handleEnter"
      v-bind="$attrs"
      v-on="inputListeners">
      <!--
       2.6.0 新增 动态插槽名使用方式
       <template v-for="(value, name) in $slots" v-slot:[name]>
        <slot :name="name" :node="value"> </slot>
       </template>
      -->
      <template v-for="(value, name) in $slots" :slot="name">
        <slot :name="name" :node="value"> </slot>
      </template>
    </el-input>
    <transition name="el-zoom-in-top">
      <div v-if="showFocusMessage" class="focus--message">
        {{focusMessage}}
      </div>
    </transition>
  </div>
</template>

<script>
import { Input } from 'element-ui'

export default {
  name: 'UniubiInput',
  extends: {
    methods: Input.methods
  },
  inheritAttrs: false,
  props: {
    focusMessage: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isFocus: false
    }
  },
  computed: {
    // 使用方法参考官方文档 https://cn.vuejs.org/v2/guide/components-custom-events.html#%E5%B0%86%E5%8E%9F%E7%94%9F%E4%BA%8B%E4%BB%B6%E7%BB%91%E5%AE%9A%E5%88%B0%E7%BB%84%E4%BB%B6
    inputListeners: function () {
      let vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (val) {
            vm.$emit('input', val)
          },
          focus: function (event) {
            let form = vm.parentForm
            let formItem = vm.formItem
            if (form && formItem) {
              form.clearValidate([formItem.$props.prop])
            }
            if (vm['focusMessage']) {
              vm.isFocus = true
            }
            vm.$emit('focus', event)
          },
          blur: function (event) {
            vm.isFocus = false
            vm.$emit('blur', event)
          }
        }
      )
    },
    parentForm () {
      let [parent, parentName] = [null, '']
      try {
        parent = this.$parent
        parentName = parent.$options.componentName
        while (parentName !== 'ElForm') {
          parent = parent.$parent
          parentName = parent.$options.componentName
        }
      } catch (error) {
      }
      return parent
    },
    formItem () {
      let [parent, parentName] = [null, '']
      try {
        parent = this.$parent
        parentName = parent.$options.componentName
        while (parentName !== 'ElFormItem') {
          parent = parent.$parent
          parentName = parent.$options.componentName
        }
      } catch (error) {
      }
      return parent
    },
    showFocusMessage () {
      return this.focusMessage && this.isFocus
    }
  },
  methods: {
    handleEnter (event) {
      let e = event || window.event
      e.target.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
  .uniubi-input {
    position: relative;
  }

  .focus--message {
    position: absolute;
    top: 100%;
    left: 0;
    line-height: 1;
    padding-top: 4px;
    font-size: 12px;
    color: gray;
    box-sizing: border-box;
  }
</style>
