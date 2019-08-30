<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>
        {{ isAdd ?
        $t('department_info_page_title1')
        : $t('department_info_page_title2') }} {{ $t('department_info_page_title3') }}
      </span>
    </div>

    <div class="page__content">
      <el-form
        :model="depForm"
        :rules="formRules"
        ref="depForm"
        label-position="top"
        class="page__content--filter">
        <el-form-item :label="$t('department_info_form_depName')" prop="depName">
          <el-input
            v-model="depForm.depName"
            @blur="depForm.depName = depForm.depName.trim()"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('department_info_form_parentDepName')">
          <dep-tree-select
            ref="dep"
            :hasSpecialDep="true"
            v-model="depForm.parentDepId"
            :disabled="parentDepId === '-1'">
          </dep-tree-select>
        </el-form-item>
        <el-form-item :label="$t('department_info_form_managers')">
          <emp-tree-select
            v-if="depForm.id && !isAdd"
            ref="emp"
            v-model="depForm.managers"
            type="3"
            :onlyShowEmp="true"
            :parentDepId="depForm.id">
          </emp-tree-select>
          <emp-tree-select
            v-if="isAdd"
            ref="emp"
            v-model="depForm.managers"
            type="3">
          </emp-tree-select>
        </el-form-item>
        <div>
          <el-button @click="$router.go(-1)">{{ $t('department_info_form_button_cancel')}}</el-button>
          <el-button
            class="ml20"
            type="primary"
            @click="handleSaveDepartment">
            {{ isAdd ? $t('department_info_form_button_add') : $t('department_info_form_button_save') }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/hr/department'
import { nameRule } from '@/libs/rules'
import { EmpTreeSelect, DepTreeSelect } from '@/components/tree-select'

export default {
  name: 'depInfo',
  data () {
    return {
      isAdd: true,
      parentDepId: '',
      depForm: {
        depName: '',
        parentDepId: '',
        managers: []
      },
      formRules: {
        depName: [
          { required: true, message: this.$t('department_info_form_depName_required'), trigger: 'blur' },
          { validator: nameRule, trigger: 'blur' }
        ]
        // parentDepId: [
        //   { required: true, message: '请选择上级部门', trigger: 'change' }
        // ]
      }
    }
  },
  components: {
    EmpTreeSelect,
    DepTreeSelect
  },
  created () {
    this.isAdd = !this.$route.query.id
    !this.isAdd && this.getDepartmentInfo()
  },
  methods: {
    handleSaveDepartment () {
      this.$refs.depForm.validate((valid) => {
        if (valid) {
          const apiType = this.isAdd ? 'addDepartment' : 'editDepartment'
          if (this.parentDepId === '-1') this.depForm.parentDepId = '-1'
          api[apiType](this.depForm).then(res => {
            if (res.success) {
              this.$message.success(`${this.isAdd ? this.$t('department_info_form_save_message1') : this.$t('department_info_form_save_message2')}${this.$t('department_info_form_save_message3')}`)
              this.$router.push({
                name: 'department'
              })
            }
          })
        }
      })
    },
    // 编辑获取详情
    getDepartmentInfo () {
      api.getDepartmentInfo(this.$route.query.id).then(res => {
        if (res.success) {
          this.isAdd = false
          this.depForm = res.data
          this.parentDepId = res.data.parentDepId
          if (res.data.depManagers) {
            this.depForm.managers = res.data.depManagers.map(({ empId: id, empName: name }) => {
              return { id, name }
            })
          } else {
            this.depForm.managers = []
          }
          this.$nextTick(() => {
            this.$refs.dep.init()
            this.$refs.emp.init()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page__content/deep/{
  justify-content: flex-start;
  .el-input{
    width: 340px;
  }
  .el-form-item{
    margin-bottom: 30px;
  }
}
</style>
