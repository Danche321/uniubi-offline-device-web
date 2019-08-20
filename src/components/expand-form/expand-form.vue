<template>
  <div class="w100 expand-div">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ExpandForm',
  data () {
    return {
      el: {}
    }
  },
  props: {
    expand: {
      type: Boolean
    }
  },
  mounted () {
    const el = this.$slots.default[0].elm
    this.resize(el)
    window.onresize = () => {
      Array.from(document.querySelectorAll('.expand-div')).forEach(ele => {
        this.resize(ele.children[0])
      })
    }
  },
  methods: {
    resize (el = this.$slots.default[0].elm) {
      let widthTotal = 0
      let widthTotal1 = 0
      let widthTotal2 = 0
      let i = 0
      const len = Array.from(el.children).length - 1
      Array.from(el.children).forEach(ele => {
        widthTotal += (ele.offsetWidth + 20)
        if (widthTotal > el.offsetWidth && !i) {
          this.$emit('update:left', widthTotal2)
          this.$emit('aaa', widthTotal2)
          i++
        }
        widthTotal2 += (ele.offsetWidth + 20)
      })
      widthTotal1 = widthTotal - Array.from(el.children)[len].offsetWidth - 20
      if (this.expand) {
        if (widthTotal > el.offsetWidth) {
          this.$emit('update:expandBtn', true)
        } else {
          this.$emit('update:expandBtn', false)
        }
      } else {
        if (widthTotal1 > el.offsetWidth) {
          this.$emit('update:expandBtn', true)
        } else {
          this.$emit('update:expandBtn', false)
        }
      }
    }
  },
  watch: {
    expand (val) {
      this.$nextTick(() => {
        const el = this.$slots.default[0].elm
        this.resize(el)
      })
    }
  }
}
</script>
