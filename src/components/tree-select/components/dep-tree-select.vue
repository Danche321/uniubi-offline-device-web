<template>
  <div>
    <!-- --------------单选------------------- -->
    <tree-select
      v-if="type === '1'"
      ref="treeSelect"
      :props="props"
      :data="treeData"
      :default-expanded-keys="[rootDepId]"
      v-leftClear
      :highlight-current="true"
      node-key="id"
      v-model="currentData"
      filterable
      :filter-method="handlefFilter"
      :filter-node-method="filterNode"
      placeholder=""
      :disabled="disabled"
      clearable>
    </tree-select>

    <!-- -------------多选不联动----------------- -->
    <tree-select
      v-if="type === '2'"
      ref="treeSelect"
      :props="props"
      :multiple="true"
      :data="treeData"
      :default-expanded-keys="[rootDepId]"
      v-leftClear
      :show-checkbox="true"
      :check-strictly="true"
      collapse-tags
      node-key="id"
      v-model="checkList"
      filterable
      :filter-method="handlefFilter"
      :filter-node-method="filterNode"
      placeholder=""
      :disabled="disabled"
      clearable>
    </tree-select>

    <tree-select
      v-if="type === '3'"
      ref="treeSelect"
      :props="props"
      :data="treeData"
      :default-expanded-keys="[rootDepId]"
      :multiple="true"
      collapse-tags
      v-leftClear
      :show-checkbox="true"
      node-key="id"
      v-model="checkList"
      filterable
      :filter-method="handlefFilter"
      :filter-node-method="filterNode"
      placeholder=""
      :disabled="disabled"
      clearable>
    </tree-select>
  </div>
</template>

<script>
import { getdepTree } from '@/api/hr/department'
import TreeSelect from './tree-select'

export default {
  name: 'EmpTreeSelect',
  data () {
    return {
      currentData: {},
      checkList: [],
      props: {
        label: 'depName',
        disabled: 'disabled',
        children: 'departmentVOS',
        id: 'id'
      },
      treeData: [],
      rootDepId: ''
    }
  },
  components: {
    TreeSelect
  },
  props: {
    type: {
      type: String,
      default: '1'
    },
    parentDepId: {
      type: String,
      default: '-1'
    },
    value: {
      type: [String, Object, Array]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    depName: {
      type: String,
      default: ''
    }
  },
  created () {
    this.getTreeData()
  },
  methods: {
    init () {
      const init = () => {
        if (Object.prototype.toString.call(this.value) === '[object String]') {
          this.currentData = { id: this.value }
        }
        if (Object.prototype.toString.call(this.value) === '[object Object]') {
          this.currentData = this.value
        }
        if (Object.prototype.toString.call(this.value) === '[object Array]' &&
            Object.prototype.toString.call(this.value[0]) === '[object String]' &&
            this.value[0]) {
          this.checkList = this.value.map(id => { return { id } })
        }
        if (Object.prototype.toString.call(this.value) === '[object Array]' &&
            Object.prototype.toString.call(this.value[0]) === '[object Object]' &&
            this.value[0]) {
          this.checkList = this.value
        }
        this.$refs.treeSelect.init()
      }

      const params = {
        depId: this.parentDepId
      }
      return getdepTree(params).then(res => {
        if (res.success) {
          this.treeData = []
          this.treeData.push(res.data)
          init()
        }
      })
    },
    getTreeData () {
      const params = {
        depId: this.parentDepId
      }
      getdepTree(params).then(res => {
        if (res.success) {
          this.treeData = []
          this.treeData.push(res.data)
          if (this.depName) {
            let count = 0
            const depNames = this.depName.split('/')
            const getDepId = (deps) => {
              deps.forEach(ele => {
                if (ele.depName === depNames[count] && count < depNames.length - 1) {
                  count++
                  getDepId(ele.departmentVOS)
                }
                if (ele.depName === depNames[count] && count === depNames.length - 1) {
                  this.checkList = [{ id: ele.id }]
                  this.$refs.treeSelect.init()
                }
              })
            }
            getDepId(this.treeData)
          }
          this.rootDepId = this.treeData[0] && this.treeData[0].id
        }
      })
    },
    handlefFilter (val) {
      this.$refs.treeSelect.$refs.tree.filter(val)
    },
    filterNode (value, data, node) {
      if (!value) return true
      return data.depName.indexOf(value) !== -1
    }
  },
  watch: {
    currentData (val) {
      this.$emit('input', val.id)
    },
    checkList (val) {
      this.$emit('input', val.map(ele => ele.id))
    }
  }
}
</script>
