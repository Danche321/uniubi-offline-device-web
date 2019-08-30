<template>
  <div class="page__content">
    <div class="page__content--left">
      <p>{{$t('authorize_create_employee_select_title')}}</p>
      <el-scrollbar class="scroll--y">
        <div class="pr10">
          <el-input
            class="mb5"
            :placeholder="$t('authorize_create_employee_select_search_input_placeholder')"
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
        {{$t('authorize_create_employee_selected_title')}} <span class="f-black">{{ checkList.length }}</span>
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
      <p>{{$t('authorize_create_employee_setting_title')}}</p>
      <el-scrollbar class="scroll--y">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item>
            <span slot="label">
              {{$t('authorize_create_employee_setting_form_period_label')}}
              <el-tooltip
                effect="dark"
                :content="$t('authorize_create_employee_setting_form_period_tooltip')"
                placement="top"
              >
                <i class="iconfont icon-remind"></i>
              </el-tooltip>
            </span>
            <el-radio-group v-model="form.isPeriod">
              <el-radio :label="0">{{$t('authorize_create_employee_setting_form_period_value_false')}}</el-radio>
              <el-radio :label="1">{{$t('authorize_create_employee_setting_form_period_value_custom')}}</el-radio>
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
              {{$t('authorize_create_employee_setting_form_permission_label')}}
              <el-tooltip
                :content="$t('authorize_create_employee_setting_form_permission_tooltip')"
                placement="top"
              >
                <i class="iconfont icon-remind"></i>
              </el-tooltip>
            </span>
            <el-radio-group v-model="form.isPermission">
              <el-radio :label="0">{{$t('authorize_create_employee_setting_form_permission_value_false')}}</el-radio>
              <el-radio :label="1">{{$t('authorize_create_employee_setting_form_permission_value_custom')}}</el-radio>
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
                  :placeholder="$t('authorize_create_employee_setting_form_permission_value_custom_start_placeholder')"
                ></el-time-picker>
                -
                <el-time-picker
                  v-model="
                    form.permissionTime.permissionTimeEntries[index].endTime
                  "
                  class="f-wd150"
                  value-format="HH:mm"
                  format="HH:mm"
                  :placeholder="$t('authorize_create_employee_setting_form_permission_value_custom_end_placeholder')"
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
                ><i class="el-icon-plus"></i> {{$t('authorize_create_employee_setting_form_permission_value_custom_add_button')}}</el-button
              >
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              {{$t('authorize_create_employee_setting_form_imgStoreDevice_label')}}
              <el-tooltip
                effect="dark"
                :content="$t('authorize_create_employee_setting_form_imgStoreDevice_tooltip')"
                placement="top"
              >
                <i class="iconfont icon-remind"></i>
              </el-tooltip>
            </span>
            <el-radio-group v-model="form.imgStoreDevice">
              <el-radio :label="true">{{$t('authorize_create_employee_setting_form_imgStoreDevice_value_true')}}</el-radio>
              <el-radio :label="false">{{$t('authorize_create_employee_setting_form_imgStoreDevice_value_false')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <span slot="label">
              {{$t('authorize_create_employee_setting_form_stopAuthWhenNotCompatibility_label')}}
              <el-tooltip
                effect="dark"
                :content="$t('authorize_create_employee_setting_form_stopAuthWhenNotCompatibility_tooltip')"
                placement="top"
              >
                <i class="iconfont icon-remind"></i>
              </el-tooltip>
            </span>
            <el-radio-group v-model="form.stopAuthWhenNotCompatibility">
              <el-radio :label="false">{{$t('authorize_create_employee_setting_form_stopAuthWhenNotCompatibility_value_true')}}</el-radio>
              <el-radio :label="true">{{$t('authorize_create_employee_setting_form_stopAuthWhenNotCompatibility_value_false')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>

    <div class="w100 ac mt30 pt20 page__content--bottom">
      <el-button @click="$router.back()">{{$t('authorize_create_employee_setting_cancel')}}</el-button>
      <el-button type="primary" @click="handleNext()">{{$t('authorize_create_employee_setting_next')}}</el-button>
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
            callback(new Error(this.$t('authorize_create_employee_setting_form_period_error_empty')))
          }
          if (!permissionStartTime) {
            callback(new Error(this.$t('authorize_create_employee_setting_form_period_error_start_empty')))
          }
          if (!permissionEndTime) {
            callback(new Error(this.$t('authorize_create_employee_setting_form_period_error_end_empty')))
          }
          callback()
        },
        validatePermissionTime: (rule, value, callback) => {
          const check = this.form.permissionTime.permissionTimeEntries.every(item => {
            return item.startTime && item.endTime
          })
          if (!check) {
            callback(new Error(this.$t('authorize_create_employee_setting_form_permission_error_empty')))
          }
          callback()
        }
      }
    },
    handleNext () {
      if (!this.checkList.length) return this.$message.error(this.$t('authorize_create_employee_setting_person_error_empty'))
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
</style>
