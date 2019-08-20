<template>
  <div
    class="ip__input--wrap"
    :readonly="readonly"
    :style="{ height: height,lineHeight: (parseInt(height, 10) - 2) + 'px',color: color,borderColor: borderColor }">
    <template v-for="(item,index) in ipAddress">
      <div :key="index" class="ip__input--inner">
        <!--------ie9上focus事件会先触发一次input，本组件中input事件中会调用focus因此会导致堆栈溢出--------->
        <input
          class="ip__input--item"
          ref="ipInput"
          :readonly="readonly"
          :disabled="disabled"
          :style="{color: color}"
          @blur="setDefaultValue(item,index,$event)"
          @focus="setDefaultValue(item,index,$event)"
          @keyup="turnIpPost(item,index,$event)"
          @input="checkIpValue(item,index,$event)"
          v-model="item.value">
      </div>
    </template>
  </div>
</template>

<script>
import emitter from './mixins'

export default {
  name: 'IpInput',
  mixins: [emitter],
  props: {
    value: {
      type: [String],
      default: ''
    },
    readonly: { // 是否只读
      type: Boolean,
      default: false
    },
    disabled: { // 是否只读
      type: Boolean,
      default: false
    },
    borderColor: { // 边框颜色
      type: String,
      default: 'rgba(46, 162, 248, 0.50)'
    },
    color: { // 字体颜色
      type: String,
      default: '#fff'
    },
    height: { // input 高度尺寸
      type: [String],
      default: '36px'
    },
    autoFill: { // 是否自动填0
      type: [Boolean],
      default: false
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      count: 0,
      ipAddress: [
        { value: '' },
        { value: '' },
        { value: '' },
        { value: '' }
      ],
      styleCss: {
        height: this.height,
        lineHeight: this.height
      }
    }
  },
  mounted () {
    this.checkBrowser()
    this._initDefaultValue(this.value)
  },
  methods: {
    /*  设置光标位置
    * @params {Object} ele 输入框元素
    * @params {Number} pos 需要将光标设置的位置
    * @author 张晓元 2018/09/29
    * */
    setCaretPosition (ele, pos) {
      if (ele.setSelectionRange) {
        ele.focus()
        ele.setSelectionRange(pos, pos)
      } else if (ele.createTextRange) {
        let range = ele.createTextRange()
        range.collapse(true)
        range.moveEnd('character', pos)
        range.moveStart('character', pos)
        range.select()
      }
    },
    /* 获取光标在输入框中相对位置
     * @param {object} [ele] 输入框元素对象（input/textarea）
     * @return {int} 光标所处位置（根据字符长度值）
     * @author 张晓元 2018/09/29
     *  */
    getCaretPosition (ele) {
      let cursorPos = 0
      if (document.selection) { // IE
        const selectRange = document.selection.createRange()
        selectRange.moveStart('character', -ele.value.length)
        cursorPos = selectRange.text.length
      } else if (ele.selectionStart || ele.selectionStart === '0') {
        cursorPos = ele.selectionStart
      }
      return cursorPos
    },
    // 校验浏览器是否是ie9 以下
    checkBrowser () {
      let isIe9 = false
      let userAgent = navigator.userAgent
      let version = userAgent.split(';').filter(item => item.indexOf('MSIE') > -1)[0]
      if (version && version.replace('MSIE', '') <= 9) {
        isIe9 = true
      }
      return isIe9
    },
    // 校验输入ip格式
    checkIpValue (item, index, event) {
      // 确保每个值都处于0-255
      let val = item.value
      // 当输入的是空格时，值赋为空
      val = val.replace(/\D/g, '')
      val = parseInt(val, 10)
      if (isNaN(val)) {
        val = ''
      } else {
        val = val < 0 ? 0 : val
        if (val > 99 && index < 3) {
          val = val > 255 ? 255 : val
          if (!this.checkBrowser()) this.$refs.ipInput[index + 1].focus()
        } else {
          val = val > 255 ? 255 : val
        }
      }
      item.value = val
    },
    // 根据输入结果切换光标
    turnIpPost (item, index, event) {
      let self = this
      let e = event || window.event
      // 光标位置
      let selectction = this.getCaretPosition(e.target)
      // 左箭头向左跳转，删除键把当前数据删除完毕后会跳转到前一个input，左一不做任何措施
      if (e.keyCode === 37 || e.keyCode === 8) {
        if (index !== 0 && !selectction) {
          self.$refs.ipInput[index - 1].focus()
        }
      }
      // 右箭头、回车键、空格键、冒号均向右跳转，右一不做任何措施
      if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 190 || e.keyCode === 110) {
        if (item.value) {
          if (index < 3) {
            self.$refs.ipInput[index + 1].focus()
          }
        }
      }
      if (e.keyCode === 39 && selectction >= item.value.toString().length && index < 3) {
        self.$refs.ipInput[index + 1].focus()
      }
    },
    setDefaultValue (item, index, event) {
      // 当input失去焦点，而ip没有赋值时，会自动赋值为0
      let e = event || window.event
      if (e.type === 'focus') {
        this.count++
      } else {
        this.count--
      }
      let val = item.value.toString().trim()
      e.preventDefault()
      if (e.type === 'blur') {
        if (val === '' && this.autoFill) {
          item.value = '0'
        }
        // 失焦的时候把值传出去
        let ipStr = ''
        for (let item of this.ipAddress) {
          ipStr += `${item.value}${item.value ? '.' : ''}`
        }
        this.$emit('blur', ipStr.slice(0, -1))
        setTimeout(() => {
          if (this.validateEvent && !this.count) {
            this.dispatch('ElFormItem', 'el.form.blur', [this.emitValue()])
          }
        }, 0)
      } else {
        this.setCaretPosition(e.target, item.value.toString().length)
      }
    },
    _initDefaultValue (val) {
      const ipArr = (val || '').split('.')
      let ipObj = []
      for (let k = 0; k < 4; k++) {
        if (ipArr[k]) {
          ipObj[k] = { value: ipArr[k] }
        } else {
          ipObj[k] = { value: '' }
        }
      }
      this.ipAddress = ipObj
    },
    emitValue (val) {
      val = val || this.ipAddress
      let ipStr = ''
      for (let item of val) {
        ipStr += `${item.value}${item.value ? '.' : ''}`
      }
      this.$emit('input', ipStr.slice(0, -1))
      return ipStr.length > 3 ? ipStr.slice(0, -1) : ''
    }
  },
  watch: {
    ipAddress: {
      handler: function (val) {
        this.emitValue(val)
      },
      deep: true
    },
    value: function (val) {
      this._initDefaultValue(val)
    }
  }
}
</script>

<style scoped>
  .ip__input--wrap {
    width: 100%;
    height: 36px;
    background-color: transparent;
    border: none;
    border-radius: 2px;
    color: #fff;
    box-sizing: border-box;
  }
  .ip__input--inner{
    float: left;
    position: relative;
    width: 25%;
    height: 100%;
    background: transparent;
  }
  .ip__input--inner:after{
    position: absolute;
    content: '·';
    display: block;
    top: 10px;
    right: 12%;
    width: 4px;
    height: 100%;
    font-size: 14px;
    text-align: center;
  }
  .ip__input--inner:last-child:after{
    display: none;
  }
  .ip__input--wrap .ip__input--item {
    position: relative;
    width: 74%;
    min-width: 40px;
    height: 100%;
    vertical-align: top;
    z-index: 9;
    text-align: center;
    border-radius: 2px;
    font-size: 14px;
    box-sizing: border-box;
    background-color: #fff;
    color: #fff;
    border: 1px solid #E1E7EC;
  }

  .ip__input--wrap .ip__input--item:focus {
    border-color: #409EFF;
    outline: none;
  }
  .ip__input--wrap span {
    float: left;
    width: 4%;
    text-align: center;
    font-size: 22px;
  }
  .ip__input--wrap span:last-child {
    display: none;
  }
  input:disabled{
    background-color: #f7f7f7 !important;
  }
</style>
