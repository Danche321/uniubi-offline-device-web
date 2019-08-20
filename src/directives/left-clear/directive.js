const directive = {}

directive.install = Vue => {
  const loadStyle = (code) => {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.rel = 'stylesheet'
    // for Chrome Firefox Opera Safari
    style.appendChild(document.createTextNode(code))
    // for IE
    // style.styleSheet.cssText = code;
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(style)
  }

  loadStyle(
    `.left-clear .el-input__suffix-inner>i {
      float: right;
    }

    .el-cascader .down-icon{
      height: 50%;
      position: relative;
      top: 25%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    .el-cascader .is-focus .el-icon-arrow-down{
      transform: rotate(180deg);
    }

    .left-clear .el-select__tags {
      width: calc(100% - 50px)!important;
    }

    .left-clear .el-input__suffix-inner>i::before {
      background: #fff;
    }

    .left-clear .el-input__suffix-inner .el-icon-circle-close{
      width: 14px;
    }`
  )

  Vue.directive('leftClear', {
    inserted: (el, binding, vnode) => {
      el.className += ' left-clear'
      const elClassList = Array.from(el.classList)
      const elChildClassList = el.firstChild.classList && Array.from(el.firstChild.classList)
      // 下拉框清空按钮
      if (elClassList.includes('el-select') || (elChildClassList && elChildClassList.includes('el-select'))) {
        const arrowUpIcon = el.querySelector('.el-input__suffix .el-icon-arrow-up')
        el.addEventListener('mouseenter', () => {
          arrowUpIcon.style.display = 'block'
        }, true)
      }
      // 级联选择器清空按钮
      if (elClassList.includes('el-cascader')) {
        el.parentElement.className += ' left-clear'
        const suffixInner = el.querySelector('.el-input__suffix .el-input__suffix-inner')
        const i = document.createElement('i')
        i.className = 'el-icon-arrow-down el-input__icon down-icon'
        el.addEventListener('mouseenter', () => {
          const input = el.querySelector('input')
          const cascaderLabel = el.querySelector('.el-cascader__label')
          if (input.value || cascaderLabel.innerText) suffixInner.insertBefore(i, suffixInner.firstChild)
        }, true)

        el.addEventListener('mouseout', () => {
          const input = el.querySelector('input')
          const cascaderLabel = el.querySelector('.el-cascader__label')
          if (input.value || (cascaderLabel && cascaderLabel.innerText)) suffixInner.removeChild(i)
        }, true)

        el.addEventListener('click', (event) => {
          const classList = Array.from(event.target.classList)
          if (classList && classList.includes('el-icon-circle-close')) {
            suffixInner.removeChild(i)
          }
        }, true)
      }
    }
  })
}

export default directive
