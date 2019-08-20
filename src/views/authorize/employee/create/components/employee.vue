<template>
  <div class="page__content">
    <div class="page__content--left">
      <p>选择人员</p>
      <el-scrollbar class="scroll--y">
        <div class="pr10">
          <el-input
            class="mb5"
            placeholder="搜索"
            @input="filterTextChange()"
            v-model="filterText"
            prefix-icon="el-icon-search"
            clearable
          ></el-input>
          <el-tree
            ref="tree"
            icon-class="iconfont icon-get-into"
            :data="treeData"
            :filter-node-method="filterNode"
            @check="handleTreeChecked"
            show-checkbox
            :default-expanded-keys="[rootDepId]"
            node-key="onlyId"
            :props="treeProps"
          >
            <div slot-scope="{ node }">
              <div class="name">
                {{ node.label }}
              </div>
            </div>
          </el-tree>
        </div>
      </el-scrollbar>
    </div>

    <div class="page__content--center">
      <p>
        已选人员 <span class="f-black">{{ checkList.length }}</span>
      </p>
      <el-scrollbar class="scroll--y">
        <el-tag
          v-for="item in checkList"
          :key="item.empId"
          closable
          type="info"
          @close="handleDelete(item.empId)"
        >
          {{ item.empName }}
        </el-tag>
      </el-scrollbar>
    </div>

    <div class="page__content--right">
      <p>设置</p>
      <el-scrollbar class="scroll--y">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item>
            <span slot="label">
              权限有效期
              <el-tooltip
                effect="dark"
                content="如：选择2015/01/01-2019/01/01,甲只在这个时间段内被设备识别"
                placement="top"
              >
                <i class="iconfont icon-remind"></i>
              </el-tooltip>
            </span>
            <el-radio-group v-model="form.isPeriod">
              <el-radio :label="0">不限制</el-radio>
              <el-radio :label="1">自定义</el-radio>
            </el-radio-group>
            <el-form-item v-if="form.isPeriod === 1" prop="validatePeriodTime">
              <date-picker-range
                :startTime.sync="form.permissionTime.permissionStartTime"
                :endTime.sync="form.permissionTime.permissionEndTime"
              ></date-picker-range>
              <el-input
                v-model="form.validatePeriodTime"
                class="f-hidden"
              ></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              准入时间
              <el-tooltip
                content="如：0:00-18:00，甲只在一天的这个时间段被设备识别"
                placement="top"
              >
                <i class="iconfont icon-remind"></i>
              </el-tooltip>
            </span>
            <el-radio-group v-model="form.isPermission">
              <el-radio :label="0">不限制</el-radio>
              <el-radio :label="1">自定义</el-radio>
            </el-radio-group>
            <el-form-item
              v-if="form.isPermission === 1"
              prop="validatePermissionTime"
            >
              <div
                v-for="(item, index) in form.permissionTime
                  .permissionTimeEntries"
                :key="index"
                class="time-permission-item"
              >
                <el-time-picker
                  v-model="
                    form.permissionTime.permissionTimeEntries[index].startTime
                  "
                  class="f-wd150"
                  value-format="HH:mm"
                  format="HH:mm"
                  placeholder="开始时间"
                ></el-time-picker>
                -
                <el-time-picker
                  v-model="
                    form.permissionTime.permissionTimeEntries[index].endTime
                  "
                  class="f-wd150"
                  value-format="HH:mm"
                  format="HH:mm"
                  placeholder="结束时间"
                ></el-time-picker>
                <i
                  v-if="index > 0"
                  class="iconfont icon-close"
                  @click="handleRemovePermission(index)"
                ></i>
              </div>
              <el-button
                v-if="form.isPermission===1&&form.permissionTime.permissionTimeEntries.length<3"
                @click="handleAddPermission"
                class="btn-add"
                ><i class="el-icon-plus"></i> 添加时间段</el-button
              >
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              设备存储注册照
              <el-tooltip
                effect="dark"
                content="注册照会占用设备较多的存储空间"
                placement="top"
              >
                <i class="iconfont icon-remind"></i>
              </el-tooltip>
            </span>
            <el-radio-group v-model="form.imgStoreDevice">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              版本不兼容的情况下继续授权
              <el-tooltip
                effect="dark"
                content="客户端和设备端版本不兼容的情况下，继续授权耗时将会很久，推荐前往客户端设置更新版本或到设备列表里进行设备固件升级"
                placement="top"
              >
                <i class="iconfont icon-remind"></i>
              </el-tooltip>
            </span>
            <el-radio-group v-model="form.stopAuthWhenNotCompatibility">
              <el-radio :label="false">是</el-radio>
              <el-radio :label="true">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <div class="w100 ac mt30 pt20 page__content--bottom">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="handleNext()">下一步</el-button>
    </div>
  </div>
</template>

<script>
import DatePickerRange from '@/components/date-picker-range'
import { fetchIsStore } from '@/api/main'
import * as api from '@/api/authorize'
export default {
  name: 'employee-create',
  data () {
    return {
      form: {
        isPeriod: 0,
        isPermission: 0,
        permissionTime: {
          permissionStartTime: '',
          permissionEndTime: '',
          permissionTimeEntries: [
            {
              endTime: '',
              startTime: ''
            }
          ]
        },
        imgStoreDevice: false,
        stopAuthWhenNotCompatibility: true,
        validatePeriodTime: '',
        validatePermissionTime: ''
      },
      rules: {
        validatePeriodTime: [
          { validator: this.customVerify().validatePeriodTime, trigger: ['blur', 'change'] }
        ],
        validatePermissionTime: [
          { validator: this.customVerify().validatePermissionTime, trigger: ['blur', 'change'] }
        ]
      },
      filterText: '',
      treeData: [],
      treeProps: {
        label: 'depName',
        children: 'departmentVOS',
        id: 'id'
      },
      checkList: [],
      checkedIds: [],
      rootDepId: ''
    }
  },
  components: {
    DatePickerRange
  },
  created () {
    this.getIsStore()
    this.getTreeData()
  },
  methods: {
    getTreeData () {
      const params = {
        depId: this.parentDepId
      }
      api['deptAndEmpList'](params).then(res => {
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
        ele.isDep = true
        ele.onlyId = ele.onlyId ? ele.onlyId : `dep-${ele.id}-${this.count}`
        if (ele.departmentVOS && ele.departmentVOS.length && !this.onlyShowEmp) {
          ele.departmentVOS.forEach(ele1 => {
            ele1.disabled = !ele1.departmentVOS && !ele1.empVos.length
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
    getIsStore () {
      fetchIsStore().then(res => {
        if (res.success) {
          this.form.imgStoreDevice = res.data
        }
      })
    },
    // 自定义校验规则
    customVerify () {
      return {
        validatePeriodTime: (rule, value, callback) => {
          const {
            permissionStartTime,
            permissionEndTime
          } = this.form.permissionTime
          if (!permissionStartTime && !permissionEndTime) {
            callback(new Error('请选择权限有效期'))
          }
          if (!permissionStartTime) {
            callback(new Error('请选择开始日期'))
          }
          if (!permissionEndTime) {
            callback(new Error('请选择结束日期'))
          }
          callback()
        },
        validatePermissionTime: (rule, value, callback) => {
          const check = this.form.permissionTime.permissionTimeEntries.every(item => {
            return item.startTime && item.endTime
          })
          if (!check) {
            callback(new Error('请选择准入时间'))
          }
          callback()
        }
      }
    },
    handleNext () {
      if (!this.checkList.length) return this.$message.error('请选择人员')
      this.$refs.form.validate(valid => {
        if (valid) {
          const pageParams = {
            form: this.form,
            checkList: this.checkList,
            checkedIds: this.checkedIds
          }
          this.$emit('employeeCallback', JSON.stringify(pageParams))
        }
      })
    },
    handleAddPermission () {
      this.form.permissionTime.permissionTimeEntries.push({
        endTime: '',
        startTime: ''
      })
    },
    handleRemovePermission (index) {
      this.form.permissionTime.permissionTimeEntries.splice(index, 1)
    },
    // 已选移除
    handleDelete (id) {
      const keyArr = this.checkedIds.filter(item => item !== id)
      this.$refs.tree.setCheckedKeys(keyArr)
      this.checkedIds = keyArr
      this.checkList = this.checkList.filter(item => item.id !== id)
    },
    // 树节点选中
    handleTreeChecked () {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      const filter1 = checkedNodes.filter(item => !item.isDep)
      filter1.forEach(item => {
        if (!this.checkedIds.includes(item.empId)) {
          this.checkList.push(item)
        }
        this.checkedIds.push(item.empId)
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.depName.includes(value)
    },
    filterTextChange () {
      this.$refs.tree.filter(this.filterText)
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .el-form-item__label {
    padding-bottom: 0;
  }
  .el-date-editor--date {
    width: 150px;
    .el-input__inner {
      width: 150px;
    }
  }
}
.el-tag--info {
  background: #f1f4f8;
  border: 1px solid #d5dce6;
  border-radius: 3px;
  line-height: 28px;
  height: 30px;
  color: #303133;
  font-size: 14px;
  margin: 2px;
}
.page__content {
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  position: relative;
  .scroll--y {
    height: 100%;
    padding: 10px 0 10px 10px;
    margin-top: 5px;
    border: 1px solid #e4e7ed;
  }
  .page__content--left {
    width: 300px;
    min-width: 300px;
    height: calc(100% - 130px);
  }
  .page__content--center {
    width: 30vw;
    height: calc(100% - 130px);
    margin-left: 30px;
  }
  .page__content--right {
    width: 380px;
    min-width: 380px;
    height: calc(100% - 130px);
    margin-left: 30px;
  }
  .page__content--bottom {
    position: absolute;
    bottom: 34px;
    left: 50%;
    transform: translateX(-50%);
  }
  .icon-remind {
    margin-left: 6px;
    color: #ccc;
  }
  .btn-add {
    display: block;
    margin-top: 4px;
  }
  .time-permission-item {
    margin-bottom: 10px;
    .el-date-editor--timerange {
      width: 320px;
      margin-bottom: 10px;
    }
    .icon-close {
      margin-left: 12px;
      cursor: pointer;
    }
  }
}
.el-tree/deep/ {
  .icon-get-into {
    font-size: 12px;
  }
  .el-tree-node__children {
    overflow: visible;
  }
  .el-tree-node__content {
    height: auto;
    position: relative;
    padding: 3px 0;
  }
  .el-checkbox {
    margin-left: 25px;
    position: absolute;
    top: 5px;
  }
  .name {
    margin-left: 25px;
  }
}
</style>
