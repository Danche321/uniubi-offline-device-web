<template>
  <div>
    <div class="dialog__body">
      <div class="dialog__body--left">
        <p>请选择{{ dialogType === 'quickBtn' ? '操作' : '菜单' }}</p>
        <el-scrollbar class="scroll--y">
          <div class="pr10">
            <el-input
              class="mb5"
              placeholder="输入关键字进行过滤"
              @input="filterTextChange()"
              v-model="filterText"
              prefix-icon="el-icon-search"
              clearable>
            </el-input>
            <el-tree
              ref="tree"
              check-strictly
              default-expand-all
              node-key="quickId"
              :filter-node-method="filterNode"
              icon-class="iconfont icon-get-into"
              :data="dataTree"
              @check-change="handleCheckChange"
              :props="treeProps"
              show-checkbox>
            </el-tree>
          </div>
        </el-scrollbar>
      </div>

      <div class="dialog__body--right">
        <p>已添加{{ dialogType === 'quickBtn' ? '操作' : '菜单' }}
          <span class="f-blue">{{ checkList.length }}/{{ dialogType === 'quickBtn' ? 8 : 11 }}</span>
        </p>
        <el-scrollbar class="scroll--y">
          <div class="pr10">
            <el-table :data="checkList">
              <el-table-column label="排序" min-width="40" type="index"></el-table-column>
              <el-table-column prop="name" label="快捷菜单" min-width="105" class-name="tr__icon"></el-table-column>
              <el-table-column min-width="65" class-name="tr__icon">
                <template slot-scope="scope">
                  <div class="handle__btn">
                    <i
                      class="iconfont icon-upwards"
                      :class="{'icon--disabled': scope.$index === 0}"
                      @click="handleUp(scope.$index)">
                    </i>
                    <i
                      class="iconfont icon-down"
                      :class="{'icon--disabled': scope.$index === checkList.length - 1}"
                      @click="handleDown(scope.$index)">
                    </i>
                    <i
                      class="iconfont icon-close"
                      @click="handleDelete(scope.$index, scope.row.quickId)">
                    </i>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="dialog__footer ac">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="handleSave()">保存</el-button>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/home'
import { quickBtn, quickEnter } from './tree'

export default {
  name: 'editDialog',
  data () {
    return {
      treeProps: {
        children: 'children',
        label: 'name'
      },
      checkList: [],
      filterText: '',
      dataTree: quickEnter
    }
  },
  props: {
    dialogType: {
      type: String,
      defult: 'quickBtn'
    },
    quickBtnList: {
      type: Array
    },
    quickEnterList: {
      type: Array
    }
  },
  created () {
    this.dataTree = this.dialogType === 'quickBtn' ? quickBtn : quickEnter
    this.checkList = this.dialogType === 'quickBtn' ? [...this.quickBtnList] : [...this.quickEnterList]
  },
  mounted () {
    this.$refs.tree.setCheckedKeys(this.checkList.map(ele => ele.quickId))
  },
  methods: {
    handleSave () {
      const apitype = this.dialogType === 'quickBtn' ? 'putQuickBtn' : 'putQuickEnter'
      const params = this.checkList.map((ele, index) => {
        ele.orderNo = index
        return ele
      })
      api[apitype](params).then(res => {
        if (res.success) {
          this.$emit('update:visible', false)
          this.$emit(this.dialogType)
          this.$message.success('保存成功！')
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    filterTextChange () {
      this.filterText = this.filterText.trim()
      this.$refs.tree.filter(this.filterText)
    },
    handleCheckChange (data, check) {
      if (check) {
        if (data.url && this.checkList.every(ele => ele.quickId !== data.quickId)) {
          this.checkList.push(data)
        }
      } else {
        if (data.url) {
          this.checkList.forEach((ele, index) => {
            if (ele.quickId === data.quickId) {
              this.checkList.splice(index, 1)
            }
          })
        }
      }
    },
    handleUp (index) {
      if (index === 0) return
      const dataItem = this.checkList[index]
      this.checkList.splice(index, 1)
      this.checkList.splice(index - 1, 0, dataItem)
    },
    handleDown (index) {
      if (index === this.checkList.length - 1) return
      const dataItem = this.checkList[index]
      this.checkList.splice(index, 1)
      this.checkList.splice(index + 1, 0, dataItem)
    },
    handleDelete (index, quickId) {
      this.$refs.tree.setChecked(quickId, false)
      this.checkList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog__body{
  margin-bottom: 20px;
  overflow: hidden;
  &>div{
    float: left;
    width: 289px;
  }
  .dialog__body--left,
  .dialog__body--right{
    box-sizing: border-box;
    &>div, .scroll--y{
      height: 340px;
      padding: 10px 0 10px 10px;
      margin-top: 5px;
      border: 1px solid #e4e7ed;
    }
  }
  .dialog__body--left{
    margin-right: 30px;
  }
}
.handle__btn{
  .iconfont{
    padding-left: 5px;
    float: left;
    color: #c0c4cc;
    cursor: pointer;
    &:hover{
      color: #208ef2;
    }
  }
  .icon-close{
    font-size: 12px;
  }
  .icon--disabled{
    color: #e4e7ed;
    cursor: not-allowed;
    &:hover{
      color: #e4e7ed;
    }
  }
}
.el-tree/deep/{
  .el-checkbox__input.is-disabled{
    display: none;
  }
  .el-checkbox{
    margin-right: 6px;
  }
  .el-checkbox.is-disabled{
    margin: 0;
  }
}
.el-table/deep/{
  .el-table__header th{
    border-top: none;
    height: 46px;
  }
  .el-table__body td{
    height: 46px;
  }
  .cell{
    padding: 0 5px;
  }
  .tr__icon .cell{
    padding: 0 5px 0 0;
  }
}
</style>
