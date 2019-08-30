<template>
  <div>
    <el-select
      ref="select"
      v-model="selectValue"
      v-bind="$attrs"
      v-on="treeListeners"
      :popper-class="className"
      @clear="clearSelectValue"
      @remove-tag="removeLabelTag">
      <div slot="empty" class="tree-dropdown">
        <el-scrollbar>
          <el-tree
            v-show="!filterText"
            ref="tree"
            :expand-on-click-node="false"
            v-bind="$attrs"
            v-on="treeListeners">
          </el-tree>

          <el-radio-group v-model="radio" v-show="filterText && !$attrs.multiple" @change="radioValChange">
            <el-radio v-for="item in options" :key="item[props.id]" :label="item[props.id]" :disabled="item[props.disabled]">{{ item[props.label] }}</el-radio>
          </el-radio-group>

          <el-checkbox-group v-model="checkList" v-show="filterText && $attrs.multiple" @change="checkboxValChange">
            <el-checkbox v-for="item in options" :key="item[props.id]" :label="item[props.id]" :disabled="item[props.disabled]">{{ item[props.label] }}</el-checkbox>
          </el-checkbox-group>

          <div v-show="loading" class="u-loading-text">
            {{ loadingText }}
          </div>
        </el-scrollbar>
      </div>
    </el-select>
  </div>
</template>

<script>
import { Tree } from 'element-ui'

export default {
  name: 'TreeSelect',
  extends: {
    methods: Tree.methods
  },
  inheritAttrs: false,
  data () {
    return {
      props: {
        label: 'label',
        disabled: 'disabled',
        id: 'id'
      },
      className: '',
      checkList: [],
      radio: '',
      filterText: '',
      options: [],
      selected: [],
      currentId: '',
      rebackValue: [],
      currentNodeData: {},
      prevCurrentNodeKeys: [],
      checkedIds: [],
      checkedNodeData: [],
      prevCheckedNodeKeys: []
    }
  },
  props: {
    value: {
      type: [Array, Object, String],
      default: () => {
        return null
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: ''
    },
    filterRemoteMethod: {
      type: Function
    }
  },
  created () {
    // 获取自定义下拉框class
    this.className = `${this.$attrs['popper-class']} u-select-dropdown`
    // 获取自定义的字段名
    this.props = {
      label: (this.$attrs['props'] && this.$attrs['props'].label) || 'label',
      disabled: (this.$attrs['props'] && this.$attrs['props'].disabled) || 'disabled',
      id: (this.$attrs['props'] && this.$attrs['props'].id) || 'id'
    }
  },
  mounted () {
    // this.init()
  },
  computed: {
    selectValue: {
      get () {
        if (!this.$attrs.multiple) {
          return this.currentNodeData[this.props.label]
        } else {
          let selected = this.checkedNodeData.map(ele => { return { currentLabel: ele[this.props.label], value: ele[this.props.id] } })
          this.$nextTick(() => {
            this.$refs.select.selected = selected
          })
          return this.checkedNodeData.map(ele => ele[this.props.label])
        }
      },
      set () {}
    },
    treeListeners (event) {
      const vm = this
      return Object.assign({},
        this.$listeners,
        {
          // 单选点击时候选中
          'node-click': function (data, node, component) {
            if (!vm.$attrs.multiple) {
              const nodesMap = vm.$refs.tree.store.nodesMap
              if (data[vm.props.disabled] || node.disabled) {
                node.isCurrent = false
                vm.prevCurrentNodeKeys.forEach(key => {
                  nodesMap[key].isCurrent = true
                })
                return
              }
              vm.highlightCurrentNode(node.data[vm.props.id])
              vm.$refs.select.blur()
            }
            vm.$emit('node-click', ...arguments)
          },
          'check': function (data, checkedStatus) {
            const { checkedKeys } = checkedStatus
            let changeCheckedKeys = []
            const nodesMap = vm.$refs.tree.store.nodesMap
            if (checkedKeys.length > vm.prevCheckedNodeKeys.length) {
              // 选中
              changeCheckedKeys = checkedKeys.filter(ele => !vm.prevCheckedNodeKeys.includes(ele))
              changeCheckedKeys.forEach(ele => {
                if (!vm.checkedIds.includes(nodesMap[ele].data[vm.props.id])) {
                  vm.checkedIds.push(nodesMap[ele].data[vm.props.id])
                }
              })
            } else {
              // 取消选中
              changeCheckedKeys = vm.prevCheckedNodeKeys.filter(ele => !checkedKeys.includes(ele))
              changeCheckedKeys.forEach(ele => {
                if (vm.checkedIds.includes(nodesMap[ele].data[vm.props.id])) {
                  vm.checkedIds.splice(vm.checkedIds.indexOf(nodesMap[ele].data[vm.props.id]), 1)
                }
              })
            }
            if (vm.$attrs['check-strictly']) {
              vm.highlightCheckedNode()
            } else {
              vm.highlightCheckedStrictlyNode()
            }
            vm.$emit('check', ...arguments)
          },
          // 下拉框收起清空搜索内容
          'visible-change': function (visible) {
            if (!visible) {
              vm.filterText = ''
              if (vm.$refs.tree.filterNodeMethod) {
                vm.$refs.tree.filter('')
              }
            }
            vm.$emit('visible-change', ...arguments)
          }
        }
      )
    }
  },
  methods: {
    init () {
      setTimeout(() => {
        if (this.$attrs.lazy) {
          if (this.$attrs.multiple) {
            // 懒加载多选
            this.checkedNodeData = this.value
            this.rebackValue = this.value.map(ele => { return { ...ele, reback: true } })
          } else {
            // 懒加载单选
            this.rebackValue = this.value
            this.currentNodeData = this.value
          }
        } else {
          if (this.$attrs.multiple) {
            // 正常加载多选
            this.checkedIds = this.value.map(ele => ele[this.props.id])
            if (this.$attrs['check-strictly']) {
              this.highlightCheckedNode()
            } else {
              this.highlightCheckedStrictlyNode('init')
            }
          } else {
            // 正常加载单选
            this.highlightCurrentNode(this.value[this.props.id])
          }
        }
      }, 0)
    },
    radioValChange (val) {
      const [currentNode] = this.options.filter(ele => ele[this.props.id] === val)
      this.filterText = ''
      this.currentNodeData = currentNode
      this.rebackValue = currentNode
      this.highlightCurrentNode(val)
    },
    checkboxValChange (list) {
      const noCheckedId = this.options.map(ele => {
        if (!list.includes(ele[this.props.id])) return ele[this.props.id]
      })
      this.rebackValue = this.options.filter(ele => list.includes(ele[this.props.id]))
      // if (this.$attrs['check-strictly']) {
      this.checkedIds = this.checkedIds.filter(ele => !noCheckedId.includes(ele))
      this.highlightCheckedNode()
      // } else {
      //   const nodesMap = this.$refs.tree.store.nodesMap
      //   for (let key in nodesMap) {
      //     if (list.includes(nodesMap[key].data.id)) {
      //       nodesMap[key].setChecked(true, true)
      //     }
      //     if (noCheckedId.includes(nodesMap[key].data.id)) {
      //       nodesMap[key].setChecked(false, true)
      //     }
      //   }
      //   this.highlightCheckedStrictlyNode()
      // }
    },
    filterRemote (val) {
      this.filterText = val
      this.radio = this.currentNodeData && this.currentNodeData[this.props.id]
      this.checkList = this.checkedNodeData.map(ele => ele[this.props.id])
      new Promise((resolve, reject) => {
        this['filterRemoteMethod'](val, resolve, reject)
      }).then((data) => {
        this.options = data
      })
    },
    // 设置下拉框选中的展示项
    resetSelectValue (value) {
      const selectValue = value.map(ele => {
        return { currentLabel: ele[this.props.label], value: ele[this.props.id] }
      })
      setTimeout(() => {
        this.$refs.select.selected = selectValue
      }, 0)
    },
    // 高亮单选项
    highlightCurrentNode (id) {
      const currentId = id || this.rebackValue[this.props.id] || this.currentNodeData[this.props.id]
      const nodesMap = this.$refs.tree.store.nodesMap
      this.prevCurrentNodeKeys.forEach(key => { nodesMap[key].isCurrent = false })
      this.prevCurrentNodeKeys = []
      for (let key in nodesMap) {
        if (nodesMap[key].data[this.props.id] === currentId) {
          nodesMap[key].isCurrent = true
          this.currentNodeData = nodesMap[key].data
          this.prevCurrentNodeKeys.push(key)
        } else {
          nodesMap[key].isCurrent = false
        }
      }
      this.$emit('input', this.currentNodeData)
    },
    highlightCheckedNode () {
      const nodesMap = this.$refs.tree.store.nodesMap
      this.prevCheckedNodeKeys = []
      this.checkedNodeData = []
      this.checkedNodeData.push(...this.rebackValue)
      this.checkedIds.push(...this.rebackValue.map(ele => ele[this.props.id]))
      this.checkedIds = Array.from(new Set(this.checkedIds))
      for (let key in nodesMap) {
        this.rebackValue = this.rebackValue.filter(ele => ele[this.props.id] !== nodesMap[key].data[this.props.id])
        if (this.checkedIds.includes(nodesMap[key].data[this.props.id])) {
          nodesMap[key].checked = true
          this.prevCheckedNodeKeys.push(key)
          if (this.checkedNodeData.every(ele => nodesMap[key].data[this.props.id] !== ele[this.props.id])) {
            this.checkedNodeData.push(nodesMap[key].data)
          }
        } else {
          nodesMap[key].checked = false
        }
      }
      this.$emit('input', this.checkedNodeData)
    },
    highlightCheckedStrictlyNode (init) {
      const nodesMap = this.$refs.tree.store.nodesMap
      if (init === 'init') {
        for (let key in nodesMap) {
          if (this.checkedIds.includes(nodesMap[key].data[this.props.id])) {
            nodesMap[key].checked = true
            this.prevCheckedNodeKeys.push(key)
            if (this.checkedNodeData.every(ele => nodesMap[key].data[this.props.id] !== ele[this.props.id])) {
              this.checkedNodeData.push(nodesMap[key].data)
            }
          } else {
            nodesMap[key].checked = false
          }
        }
      } else {
        let checkedNodeData = this.$refs.tree.getCheckedNodes(false, true)
        checkedNodeData.push(...this.rebackValue)
        this.rebackValue.forEach((ele, index) => {
          for (let key in nodesMap) {
            if (ele[this.props.id] === nodesMap[key].data[this.props.id]) {
              // nodesMap[key].checked = true
              nodesMap[key].setChecked(true, true)
              this.rebackValue.splice(this.rebackValue.indexOf(ele), 1)
              this.$nextTick(() => {
                this.highlightCheckedStrictlyNode()
              })
            }
          }
        })
        let arr = checkedNodeData[0] ? [checkedNodeData[0]] : []
        this.prevCheckedNodeKeys = [...this.$refs.tree.getCheckedKeys(), ...this.$refs.tree.getHalfCheckedKeys()]
        checkedNodeData.forEach(ele => {
          if (arr.every(ele1 => ele1[this.props.id] !== ele[this.props.id])) {
            arr.push(ele)
          }
        })
        this.checkedNodeData = arr
      }
      this.$emit('input', this.checkedNodeData)
    },
    clearSelectValue () {
      const nodesMap = this.$refs.tree.store.nodesMap
      if (this.$attrs.multiple) {
        this.rebackValue = []
        this.checkedIds = []
        this.checkedNodeData = []
        this.prevCheckedNodeKeys.forEach(ele => { nodesMap[ele].checked = false; nodesMap[ele].indeterminate = false })
        this.prevCheckedNodeKeys = []
      } else {
        this.rebackValue = {}
        this.currentNodeData = {}
        this.prevCurrentNodeKeys.forEach(ele => { nodesMap[ele].isCurrent = false })
        this.prevCurrentNodeKeys = []
      }
    },
    removeLabelTag (id) {
      const nodesMap = this.$refs.tree.store.nodesMap
      this.rebackValue = this.rebackValue.filter(ele => ele[this.props.id] !== id)
      if (this.$attrs['check-strictly']) {
        this.checkedIds.splice(this.checkedIds.indexOf(id), 1)
        this.highlightCheckedNode()
      } else {
        for (let key in nodesMap) {
          if (nodesMap[key].data[this.props.id] === id) {
            nodesMap[key].setChecked(false, true)
          }
        }
        this.highlightCheckedStrictlyNode()
      }
    }
  }
}
</script>

<style scoped>
.el-scrollbar/deep/ .el-scrollbar__wrap{
  padding: 10px 0;
  height: 250px;
}

.el-tree--highlight-current/deep/ .el-tree-node[aria-disabled]>.el-tree-node__content{
  color: #b5b8b9;
  cursor: not-allowed;
}

.el-tree--highlight-current/deep/ .el-tree-node.is-current>.el-tree-node__content{
  color: #1991eb;
  background: #fff;
}

.el-checkbox-group/deep/ .el-checkbox{
  display: block;
  padding: 4px 20px;
}

.el-radio-group/deep/ .el-radio{
  display: block;
  width: 100%;
  padding: 6px 15px;
}

.el-radio-group/deep/ .el-radio .el-radio__input{
  width: 0;
  height: 0;
  overflow: hidden;
}

.el-radio-group/deep/ .el-radio .el-radio__label{
  margin-left: 0;
}

.el-tree/deep/ .el-checkbox{
  margin-right: 6px;
}

.el-tree/deep/ .el-icon-caret-right{
  font-size: 14px;
}

.u-loading-text{
  padding-top: 40%;
  color: #868282;
  text-align: center;
  font-size: 14px;
}
</style>
