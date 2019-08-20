<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">
        职称列表
      </span>
      <div class="page__header--btn">
        <el-button size="small" @click="handleBatchDelete()">批量删除</el-button>
        <el-button type="primary" size="small" @click="handlePositionDialogShow()">添加职称</el-button>
      </div>
    </div>

    <div class="page__content">
      <el-form
        ref="filterForm"
        class="page__content--filter"
        label-position="top"
        :inline="true"
        :model="searchParams"
        @keyup.enter.native="handleQuery('firstPage')">
        <el-form-item label="职称">
          <el-input
            v-model="searchParams.name"
            @blur="searchParams.name = searchParams.name.trim()"
            maxlength="32"
            clearable>
          </el-input>
        </el-form-item>

        <el-form-item class="btn__search">
          <el-button icon="iconfont icon-search" @click="handleQuery('firstPage')">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="position__list">
        <el-scrollbar class="scroll--y">
          <el-checkbox-group class="checkbox__group" v-model="checkList">
            <div class="position__item" v-for="item in positionList" :key="item.id">
              <div class="position__name">
                <el-checkbox :label="item.id">{{ item.roleName }}</el-checkbox>
              </div>
              <div class="position__icon">
                <el-tooltip content="编辑" :enterable="false" :open-delay="500">
                  <i class="iconfont icon-edit" @click="handlePositionDialogShow(item)"></i>
                </el-tooltip>
                <el-tooltip content="删除" :enterable="false" :open-delay="500">
                  <i class="iconfont icon-delete" @click="handleDelete(item)"></i>
                </el-tooltip>
              </div>
            </div>
          </el-checkbox-group>
        </el-scrollbar>
      </div>
      <m-pagination
        :handleQueryFun="handleQuery"
        :pageParams="pageParams">
      </m-pagination>
    </div>

    <el-dialog
      :title="isAdd ? '添加职称' : '编辑职称'"
      :visible.sync="dialog.positionVisible"
      width="400px">
      <div class="pr20 pl20 position__dialog" v-if="dialog.positionVisible">
        <el-form
          :model="positionForm"
          :rules="positionFormRules"
          ref="positionForm"
          :hide-required-asterisk="true"
          label-position="top">
          <el-form-item label="名称" prop="name">
            <el-input v-model="positionForm.name" placeholder="" clearable></el-input>
          </el-form-item>
          <div class="ac pt10">
            <el-button @click="dialog.positionVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="handleSavePosition">
              {{  isAdd ? '添加' : '保存'}}
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/hr/position'
import { positionRule } from '@/libs/rules'

export default {
  name: 'historyRecord',
  data () {
    return {
      isAdd: true,
      dialog: {
        positionVisible: false
      },
      positionForm: { name: '' },
      positionFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { validator: positionRule, trigger: 'blur' }
        ]
      },
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      checkList: [],
      searchParams: { name: '' },
      positionList: []
    }
  },
  created () {
    this.handleQuery()
  },
  methods: {
    handleQuery (firstPage) {
      if (firstPage) this.pageParams.pageNum = 1
      const params = {
        ...this.searchParams,
        ...this.pageParams
      }
      api.roleList(params).then(res => {
        if (res.success) {
          const { list, pageNum, total } = res.data
          this.positionList = list
          this.pageParams = { ...this.pageParams, pageNum, total }
        }
      })
    },
    handleSavePosition () {
      this.$refs.positionForm.validate((valid) => {
        if (valid) {
          const apiType = this.isAdd ? 'addRole' : 'editRole'

          api[apiType](this.positionForm).then(res => {
            if (res.success) {
              this.$message.success(`${this.isAdd ? '添加' : '编辑'}成功！`)
              this.handleQuery()
              this.dialog.positionVisible = false
            }
          })
        }
      })
    },
    handleDelete ({ id }) {
      this.$confirm('删除职称后，相关联的人员职称也一并删除，请谨慎操作', '删除职称', {
        customClass: 'delete__box--confirm',
        confirmButtonText: '删除',
        center: true
      }).then(() => {
        api.delRole(id).then(res => {
          if (res.success) {
            this.handleQuery()
          }
        })
      }, () => {})
    },
    handleBatchDelete () {
      if (!this.checkList.length) {
        this.$confirm('请先在职称列表中勾选职称', '提示', {
          showCancelButton: false,
          center: true
        }).then(() => {}, () => {})
        return
      }

      this.$confirm('删除职称后，相关联的人员职称也一并删除，请谨慎操作', '删除职称', {
        customClass: 'delete__box--confirm',
        confirmButtonText: '删除',
        center: true
      }).then(() => {
        const params = {
          roleIds: this.checkList.join(',')
        }
        api.delRoleList(params).then(res => {
          if (res.success) {
            this.handleQuery()
            this.checkList = []
          }
        })
      }, () => {})
    },
    handlePositionDialogShow (info) {
      this.dialog.positionVisible = true
      if (info) {
        this.isAdd = false
        this.positionForm = {
          ...info,
          name: info.roleName
        }
      } else {
        this.isAdd = true
        this.positionForm.name = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.position__list/deep/{
  width: 100%;
  height: calc(100% - 130px);
  .checkbox__group{
    margin-left: -20px;
  }
  .position__item{
    width: 200px;
    border: 1px solid #e4e7ed;
    float: left;
    margin: 0 0 20px 20px;
  }
  .position__name{
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    border-bottom: 1px solid #e4e7ed;
    box-sizing: border-box;
    .el-checkbox__input{
      line-height: 50px;
    }
    .el-checkbox__label{
      width: 155px;
      line-height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .position__icon{
    height: 36px;
    line-height: 36px;
    padding-left: 20px;
    box-sizing: border-box;
    background: #f1f4f7;
    .iconfont{
      color: #c0c4cc;
      cursor: pointer;
      font-size: 18px;
      margin-right: 10px;
      &:hover{
        color: #208ef2;
      }
    }
  }
}

.position__dialog/deep/{
  .el-form-item__label{
    height: 24px;
    line-height: 20px;
  }
}
</style>
