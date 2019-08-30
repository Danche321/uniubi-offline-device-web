<template>
  <div class="page__content">
    <el-form
      ref="filterForm"
      class="page__content--filter"
      label-position="top"
      :inline="true"
      @keyup.enter.native="handleFilter()"
      @submit.native.prevent>
      <el-form-item :label="$t('department_list_form_search')">
        <el-input
          v-model="filterText"
          @blur="filterText = filterText.trim()"
          maxlength="32"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item class="btn__search">
        <el-button icon="iconfont icon-search" @click="handleFilter()">{{ $t('department_list_form_button') }}</el-button>
      </el-form-item>
    </el-form>

    <div class="list__header">
      <div class="ml5">{{ $t('department_list_list_header1') }}</div>
      <div>{{ $t('department_list_list_header2') }}</div>
      <div>{{ $t('department_list_list_header3') }}</div>
    </div>

    <div class="list__body">
      <el-scrollbar class="scroll--y">
        <el-tree
          ref="tree"
          :data="treeList"
          :props="treeProps"
          node-key="id"
          :default-expanded-keys="[rootDepId]"
          :filter-node-method="filterNode"
          icon-class="iconfont icon-get-into"
          :expand-on-click-node="false">
          <div slot-scope="{ node, data }" class="list__body--tr">
            <div :style="{width: `calc(${376 - 18 * (node.level - 1)}px)`}">
              {{ data.depName }}
            </div>
            <div>
              {{ data.managers && data.managers.map(ele => ele.empName).join('，') || '--' }}
            </div>
            <div class="table__icon--btn">
              <el-tooltip
                :content="$t('department_list_list_upwards')"
                placement="top"
                :enterable="false"
                :open-delay="500">
                <i
                  class="iconfont icon-upwards"
                  :class="{'icon--disabled': !node.previousSibling || node.data.special === 1}"
                  @click="$emit('move', node, !node.previousSibling || node.data.special === 1, 'up')">
                </i>
              </el-tooltip>
              <el-tooltip
                :content="$t('department_list_list_down')"
                placement="top"
                :enterable="false"
                :open-delay="500">
                <i
                  class="iconfont icon-down"
                  :class="{'icon--disabled': !node.nextSibling || node.nextSibling.data !== 1}"
                  @click="$emit('move', node, !node.nextSibling || node.nextSibling.data !== 1, 'down')">
                </i>
              </el-tooltip>
              <el-tooltip
                :content="$t('department_list_list_edit')"
                placement="top"
                :enterable="false"
                :open-delay="500">
                <i
                  class="iconfont icon-edit"
                  :class="{'icon--disabled': node.data.special === 1}"
                  @click="node.data.special !== 1 && $router.push({
                    name: 'depInfo',
                    query: {id: data.id}
                  })">
                </i>
              </el-tooltip>
              <el-tooltip
                :content="$t('department_list_list_delete')"
                placement="top"
                :enterable="false"
                :open-delay="500">
                <i
                  class="iconfont icon-delete"
                  :class="{'icon--disabled': node.data.special === 1}"
                  @click="node.data.special !== 1 && $emit('delete', node)">
                </i>
              </el-tooltip>
            </div>
          </div>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/hr/department'

export default {
  name: 'department',
  data () {
    return {
      formInline: {},
      filterText: '',
      treeProps: {
        children: 'departmentVOS',
        label: 'label'
      },
      treeList: [],
      rootDepId: ''
    }
  },
  created () {
    this.getDepTree()
  },
  methods: {
    getDepTree () {
      const params = {
        depId: '-1'
      }
      api.getdepTree(params).then(res => {
        if (res.success) {
          this.treeList = [res.data]
          this.rootDepId = res.data.id
        }
      })
    },
    handleFilter () {
      this.$refs.tree.filter(this.filterText)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.depName.indexOf(value) !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
.icon--disabled{
  color: #e4e7ed;
  cursor: not-allowed;
  &:hover{
    color: #e4e7ed;
  }
}
.page__content{
  justify-content: flex-start;
}
.list__header{
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
  &>div{
    box-sizing: border-box;
    display: inline-block;
  }
  &>div:nth-child(1){
    padding-left: 20px;
    width: 400px;
  }
  &>div:nth-child(2){
    width: 376px;
    padding-left: 20px;
  }
  &>div:nth-child(3){
    width:120px;
    padding-left: 20px;
  }
}
.list__body{
  width: 100%;
  flex-grow: 1;
  overflow: hidden;
}
.el-tree/deep/{
  margin-top: -51px;
  .el-tree-node__content{
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #e4e7ed;
  }
  .list__body--tr{
    width: 100%;
    height: 50px;
    cursor: default;
    &>div{
      box-sizing: border-box;
      display: inline-block;
    }
    &>div:nth-child(1){
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &>div:nth-child(2){
      width: 376px;
      padding-left: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &>div:nth-child(3){
      width:120px;
      padding-left: 20px;
      overflow: hidden;
    }
  }
}
</style>
