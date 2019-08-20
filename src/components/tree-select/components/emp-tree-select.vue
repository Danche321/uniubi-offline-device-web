<template>
  <div>
    <!-- --------------单选------------------- -->
    <tree-select
      v-if="type === '1'"
      popper-class="tree1"
      ref="treeSelect"
      :props="props"
      :data="treeData"
      :default-expanded-keys="[rootDepId]"
      v-leftClear
      :highlight-current="true"
      node-key="onlyId"
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
      popper-class="tree2"
      ref="treeSelect"
      :props="props"
      :multiple="true"
      :data="treeData"
      :default-expanded-keys="[rootDepId]"
      v-leftClear
      :show-checkbox="true"
      :check-strictly="true"
      collapse-tags
      node-key="onlyId"
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
      popper-class="tree3"
      ref="treeSelect"
      :props="props"
      :data="treeData"
      :default-expanded-keys="[rootDepId]"
      :multiple="true"
      v-leftClear
      :show-checkbox="true"
      collapse-tags
      node-key="onlyId"
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
import { getAllDepAndEmp } from '@/api/hr/department'
import TreeSelect from './tree-select'

export default {
  name: 'EmpTreeSelect',
  data () {
    return {
      count: 0,
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
    },
    onlyShowEmp: {
      type: Boolean,
      default: false
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
      return getAllDepAndEmp(params).then(res => {
        if (res.success) {
          this.treeData = []
          this.treeData.push(res.data)
          this.handleData(this.treeData, 'root')
          init()
        }
      })
    },
    getTreeData () {
      const params = {
        depId: this.parentDepId
      }
      getAllDepAndEmp(params).then(res => {
        if (res.success) {
          this.treeData = []
          this.treeData.push(res.data)
          this.handleData(this.treeData, 'root')
        }
      })
    },
    handleData (data, root) {
      data.forEach(ele => {
        this.count++
        if (root) {
          this.rootDepId = `dep-${ele.id}-${this.count}`
        }
        ele.disabled = this.type !== '3'
        ele.isDep = true
        ele.onlyId = ele.onlyId ? ele.onlyId : `dep-${ele.id}-${this.count}`
        if (ele.departmentVOS && ele.departmentVOS.length && !this.onlyShowEmp) {
          ele.departmentVOS.forEach(ele1 => {
            ele1.disabled = this.type !== '3'
            ele1.onlyId = `dep-${ele1.id}-${this.count}`
            ele1.isDep = true
          })
          this.handleData(ele.departmentVOS)
        } else {
          ele.departmentVOS = []
        }
        if (ele.empVos && ele.empVos.length) {
          ele.empVos.forEach(ele1 => {
            ele1.depName = ele1.empName
            ele1.id = ele1.empId
            ele1.onlyId = `emp-${ele1.empId}-${this.count}`
            ele.departmentVOS.push(ele1)
          })
        }
      })
    },
    handlefFilter (val) {
      this.$refs.treeSelect.$refs.tree.filter(val)
    },
    filterNode (value, data, node) {
      if (!value) return true
      return data.depName.indexOf(value) !== -1 && !data.disabled
    }
  },
  watch: {
    currentData (val) {
      this.$emit('input', val.id)
    },
    checkList (val) {
      if (this.type === '3') {
        const list = val.filter(ele => !ele.isDep)
        this.$emit('input', list.map(ele => ele.id))
        this.$refs.treeSelect.resetSelectValue(list)
      } else {
        this.$emit('input', val.map(ele => ele.id))
      }
    }
  }
}
</script>

<style lang="scss">
.tree1{
  .el-tree{
    .el-tree-node[aria-disabled]>.el-tree-node__content{
      cursor: default;
      color: #606166;
    }
  }
}

.tree2{
  .el-tree{
    .el-checkbox.is-disabled{
      display: none!important;
    }
  }
}
</style>
