<template>
  <div class="page__content">
    <div class="tree">
      <el-input
        class="filter-input"
        :placeholder="$t('department_tree_tree_input')"
        v-model="filterText"
        maxlength="32"
        @input="handleFilter()"
        clearable>
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>

      <el-scrollbar class="scroll--y tree-scroll">
        <el-radio-group v-model="depInfo.id">
          <el-tree
            ref="tree"
            :expand-on-click-node="false"
            :indent="10"
            node-key="id"
            icon-class="iconfont icon-get-into"
            :default-expanded-keys="[rootDepId]"
            :filter-node-method="filterNode"
            :data="treeList"
            :props="treeProps">
            <div slot-scope="{ node, data }" class="node-content">
              <el-radio
                :label="data.id"
                :value="data.id"
                class="tree-name"
                :style="{width: `${205-node.level*10}px`}">
                {{ data.depName }}
              </el-radio>
              <span class="handle-icons" v-if="rootDepId !== data.id">
                <i
                  class="iconfont icon-upwards"
                  :class="{'icon--disabled': !node.previousSibling}"
                  @click="$emit('move', node, !node.previousSibling, 'up')"></i>
                <i
                  class="iconfont icon-down"
                  :class="{'icon--disabled': !node.nextSibling}"
                  @click="$emit('move', node, !node.nextSibling, 'down')">
                </i>
                <i
                  class="iconfont icon-edit"
                  @click="$router.push({
                    name: 'depInfo',
                    query: {id: data.id}
                  })">
                </i>
                <i
                  class="iconfont icon-delete"
                  @click="handleDelete(node)">
                </i>
              </span>
            </div>
          </el-tree>
        </el-radio-group>
      </el-scrollbar>
    </div>

    <div class="list">
      <div>
        <span class="department-name fl">{{ depInfo.depName }}</span>
        <span class="fl mb10">
          {{ $t('department_tree_list_depManagers') }}
          {{ depInfo.depManagers && depInfo.depManagers.map(ele => ele.empName).join('、') }}
          <span v-if="!depInfo.depManagers.length">--</span>
          &nbsp;&nbsp;&nbsp;&nbsp;{{ $t('department_tree_list_depManagers_count') }}{{ pageParams.total }}
        </span>
        <div class="list-icon fr" v-if="rootDepId !== depInfo.id">
          <i class="fr iconfont icon-delete" @click="handleDelete()"></i>
          <i
            class="fr iconfont icon-edit"
            @click="$router.push({
              name: 'depInfo',
              query: {id: depInfo.id}
            })">
          </i>
        </div>
      </div>
      <el-table :data="employeeList" class="filter-table" height="100%">
        <el-table-column prop="name" :label="$t('department_tree_table_name')" min-width="120"></el-table-column>
        <el-table-column prop="empRoleVO.roleName" :label="$('department_tree_table_roleName')" min-width="100">
          <template slot-scope="{ row }">
              {{ row.roleName || '--' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="workNo" :label="$('department_tree_table_workNo')" min-width="60">
          <template slot-scope="{ row }">
              {{ row.workNo || '--' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="phone" :label="$t('department_tree_table_phone')" min-width="120">
          <template slot-scope="{ row }">
              {{ row.phone || '--' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="mail" :label="$('department_tree_table_mail')" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
              {{ row.mail || '--' }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <m-pagination
        :handleQueryFun="handleQuery"
        :pageParams="pageParams">
      </m-pagination>
    </div>
  </div>
</template>

<script>
import { empList } from '@/api/hr/employee'
import * as api from '@/api/hr/department'

export default {
  name: 'organization',
  data () {
    return {
      filterText: '',
      // 选中的部门信息
      depInfo: {
        id: '',
        depName: '',
        managers: [],
        parentDepId: '',
        depManagers: []
      },
      employeeList: [],
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
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
      const params = { depId: '-1' }
      api.getdepTree(params).then(res => {
        if (res.success) {
          this.treeList.push(res.data)
          this.depInfo.id = res.data.id
          this.rootDepId = this.treeList[0] && this.treeList[0].id
        }
      })
    },
    // 选中部门后展示人员列表
    handelCheck () {
      api.getDepartmentInfo(this.depInfo.id).then(res => {
        if (res.success && res.data) {
          const { parentDepId, depName, managers = [], depManagers } = res.data
          this.depInfo = {
            ...this.depInfo,
            parentDepId,
            depManagers,
            depName,
            managers
          }
          this.handleQuery()
        }
      })
    },
    // 人员列表分页
    handleQuery () {
      const params = {
        depId: this.depInfo.id === this.rootDepId ? '' : this.depInfo.id,
        ...this.pageParams
      }
      empList(params).then(res => {
        if (res.success) {
          const { list, pageNum, total } = res.data
          this.employeeList = list
          this.employeeList.forEach(ele => {
            ele.empDeps = ele.empDepVOS.map(ele1 => ele1.depName).join('，')
          })
          this.pageParams = { ...this.pageParams, pageNum, total }
        }
      })
    },
    handleDelete (node) {
      if (node) {
        const deleteCurrent = node.data.id === this.depInfo.id
        this.$emit('delete', node, deleteCurrent)
      } else {
        const { id, parentDepId, depName } = this.depInfo
        const node = {
          data: { id, depName },
          parent: { data: { id: parentDepId } }
        }
        this.$emit('delete', node, true)
      }
    },
    checkRoot () {
      this.depInfo.id = this.treeList[0].id
    },
    handleFilter () {
      this.filterText = this.filterText.trim()
      this.$refs.tree.filter(this.filterText)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.depName.indexOf(value) !== -1
    }
  },
  watch: {
    'depInfo.id' (val) {
      this.handelCheck()
    }
  }
}
</script>

<style lang="scss" scoped>
.page__content/deep/{
  padding: 0;
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  .tree{
    width: 260px;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    border-right: 1px solid #E4E7ED;
  }
  .list{
    padding: 20px;
    box-sizing: border-box;
    height: calc(100% - 90px);
    width: calc(100% - 261px);
  }
  .department-name{
    padding: 3px 20px 12px 0;
    font-size: 16px;
    margin-top: -4px;
    color: #303133;
  }
  .el-input__icon{
    width: 25px;
    line-height: 36px;
    cursor: pointer;
  }
  .el-radio{
    margin-right: 0;
    // width: 100px;
  }
  .el-radio__input{
    width: 0;
    height: 0;
    overflow: hidden;
  }
  .el-radio__label{
    padding: 0;
    line-height: 26px;
  }
  .tree-name{
    display: inline-block;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    -o-text-overflow:ellipsis;
  }
  .tree-scroll{
    width: 100%;
    margin-top: 10px;
    height: calc(100% - 46px);
    overflow: hidden;
  }
  .el-scrollbar__wrap{
    height: 100%;
    overflow-x: hidden;
  }
  .handle-icons i{
    display: none;
    font-size: 16px;
    line-height: 26px;
    color: #C0C4CC;
    margin-left: 5px;
    &:hover{
      color: #2EA2F8;
    }
  }
  .handle-icons{
    width: 90px;
    float: right;
    position: absolute;
    right: 0;
    background: #F7F9FA;
  }
  .icon--disabled{
    color: #e4e7ed!important;
    cursor: not-allowed;
    &:hover{
      color: #e4e7ed!important;
    }
  }
  .el-tree-node__children{
    overflow: visible;
  }
  .el-tree-node__content{
    height: 30px;
  }
  .el-tree-node__content .node-content{
    width: 100%;
    position: relative;
  }
  .el-tree-node__loading-icon{
    margin: 0 0 0 -8px;
  }
  .el-tree-node__content  .node-content:hover{
    background: #F7F9FA;
    .el-radio__label{
      color: #2EA2F8;
    }
    & .handle-icons i{
      display: inline-block;
    }
  }
  .el-radio-group{
    width: 100%;
    box-sizing: border-box;
  }
  .list-icon{
    color: #C0C4CC;
    i{
      color: #C0C4CC;
      font-size: 16px;
      padding: 0 5px;
      cursor: pointer;
    };
  }
  .manager{
    padding: 0 5px;
  }
  .el-icon-error{
    font-size: 18px;
    color: #C0C4CC;
    &:hover{
      color: #a3a3a3;
    }
  }
}
.department-popper{
  .el-radio__input{
    width: 0;
    height: 0;
    overflow: hidden;
  }
  .el-radio-group{
    width: 90%;
  }
  .name{
    padding: 5px 10px;
    font-size: 14px;
    width: 100%;
    &:hover{
      background: #ededee;
    }
  }
}
</style>
