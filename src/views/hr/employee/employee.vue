<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">{{ $t('employee_list_page_title') }}</span>
      <div class="page__header--btn">
        <el-button
          class="mr30"
          type="text"
          @click="handleImportExcel()">
          {{ $t('common_import') }}
        </el-button>

        <el-dropdown class="mr30" trigger="click">
          <span class="el-dropdown-link">
            {{ $t('common_export') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleExportExcel('check')">{{ $t('employee_list_export_type1') }}</el-dropdown-item>
            <el-dropdown-item @click.native="handleExportExcel('search')">{{ $t('employee_list_export_type2') }}</el-dropdown-item>
            <el-dropdown-item @click.native="handleExportExcel('all')">{{ $t('employee_list_export_type3') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown class="mr30" trigger="click">
          <span class="el-dropdown-link">
            {{ $t('employee_list_header_btn1') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleDepDialogShow()">{{ $t('employee_list_header_btn1_1') }}</el-dropdown-item>
            <el-dropdown-item @click.native="handleBatchDelete()">{{ $t('common_delete') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button
          type="primary"
          size="small"
          @click="$router.push({name: 'empInfo'})">
          {{ $t('employee_list_header_btn2') }}
        </el-button>
      </div>
    </div>

    <div class="page__content">
      <expand-form
        :expand.sync="filterOption.showMore"
        :expandBtn.sync="filterOption.showExpandBtn"
        :left.sync="filterOption.leftNum">
        <el-form
          ref="filterForm"
          class="page__content--filter"
          :class="{'filter--reduce': !filterOption.showMore}"
          label-position="top"
          :inline="true"
          :model="searchParams"
          @keyup.enter.native="handleQuery('firstPage')">
          <el-form-item :label="$t('employee_list_search_label1')">
            <dep-tree-select ref="dep" v-model="searchParams.depId" type="1"></dep-tree-select>
          </el-form-item>
          <el-form-item :label="$t('employee_list_search_label2')">
            <emp-tree-select v-model="searchParams.empId" type="1"></emp-tree-select>
          </el-form-item>
          <el-form-item :label="$t('employee_list_search_label3')">
            <el-input
              v-model="searchParams.phone"
              @blur="searchParams.phone = searchParams.phone.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('employee_list_search_label4')">
            <el-select
              v-model="searchParams.roleId"
              placeholder=""
              clearable
              filterable
              v-leftClear>
              <el-option
                v-for="item in select.roles"
                :value="item.id"
                :key="item.id"
                :label="item.roleName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('employee_list_search_label5')">
            <el-input
              v-model="searchParams.empNo"
              @blur="searchParams.empNo = searchParams.empNo.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('employee_list_search_label6')">
            <el-input
              v-model="searchParams.cardNo"
              @blur="searchParams.cardNo = searchParams.cardNo.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('employee_list_search_label7')">
            <date-picker-range
              :startTime.sync="searchParams.begTime"
              :endTime.sync="searchParams.endTime"
              defultTime>
            </date-picker-range>
          </el-form-item>

          <div
            class="page__content--search"
            :class="{'filter--reduce': !filterOption.showMore}"
            :style="{'left': `${filterOption.leftNum}px`}">
            <el-form-item class="btn__search">
              <el-button
                icon="iconfont icon-search"
                @click="handleQuery('firstPage')">
                {{ $t('common_search') }}
              </el-button>
            </el-form-item>
            <el-form-item class="btn__expand">
              <span
                @click="filterOption.showMore = !filterOption.showMore"
                v-if="filterOption.showExpandBtn">
                {{ filterOption.showMore ? $t('common_pack') : $t('common_expand') }}
                <i
                  class="iconfont"
                  :class="{'icon-drop_down': !filterOption.showMore, 'icon-Collapse': filterOption.showMore}">
                </i>
              </span>
            </el-form-item>
          </div>
        </el-form>
      </expand-form>

      <el-table :data="employeeList" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column :label="$t('employee_list_table_column1')" min-width="170">
          <template slot-scope="scope">
            <img
              v-for="item in scope.row.photoIds"
              :key="item" class="photo"
              :src="`${baseUrl}/file/image/${item}`" />
            <span class="photo" v-for="item in (3 - scope.row.photoIds.length)" :key="item"></span>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('employee_list_table_column2')" min-width="90">
          <template slot-scope="{ row }">
            {{ row.name || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="workNo" :label="$t('employee_list_table_column3')" min-width="120">
          <template slot-scope="{ row }">
            {{ row.workNo || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" :label="$t('employee_list_table_column4')" min-width="120">
          <template slot-scope="{ row }">
            {{ row.phone || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="empNo" :label="$t('employee_list_table_column5')" min-width="140" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ row.empNo || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="cardNo" :label="$t('employee_list_table_column6')" min-width="130">
          <template slot-scope="{ row }">
            {{ row.cardNo || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="empRoleVO.roleName" :label="$t('employee_list_table_column7')" min-width="80">
          <template slot-scope="{ row }">
            {{ row.roleName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="empDeps" :label="$t('employee_list_table_column8')" min-width="85" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ row.empDeps || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="entryTime" :label="$t('employee_list_table_column9')" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.entryTime && scope.row.entryTime.split(' ')[0] || '--' }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('employee_list_table_column10')" min-width="80" class-name="table__icon--btn">
          <template slot-scope="scope">
            <el-tooltip
              :content="$t('common_edit')"
              placement="top"
              :enterable="false"
              :open-delay="500">
              <i
                class="iconfont icon-edit"
                @click="$router.push({
                  name: 'empInfo',
                  query: {id: scope.row.id}
                })">
              </i>
            </el-tooltip>
            <el-tooltip
              :content="$t('common_delete')"
              placement="top"
              :enterable="false"
              :open-delay="500">
              <i
                class="iconfont icon-delete"
                @click="handleDelete(scope.row)">
              </i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        :handleQueryFun="handleQuery"
        :pageParams="pageParams">
        <div>
          <el-button
            class="btn--blue"
            size="small"
            @click="$router.push({name: 'history'})">
            {{ $t('employee_list_footer_btn1') }}
          </el-button>
          <el-button
            class="btn--blue"
            size="small"
            @click="$router.push({name: 'taskList'})">
            {{ $t('employee_list_footer_btn2') }}
          </el-button>
        </div>
      </m-pagination>
    </div>

    <el-dialog
      :title="$t('employee_list_dep_dialog_title')"
      :visible.sync="dialog.depVisible"
      width="400px">
      <div class="pr20 pl20 dialog__dep" v-if="dialog.depVisible">
        <el-form
          :model="depForm"
          :rules="depFormRules"
          ref="depForm"
          :hide-required-asterisk="true"
          label-position="top">
          <el-form-item :label="$t('employee_list_dep_dialog_form_label1')" prop="departments">
            <dep-tree-select
              ref="dep"
              v-model="depForm.departments"
              type="2">
            </dep-tree-select>
          </el-form-item>
          <div class="ac pt10">
            <el-button @click="dialog.depVisible = false">{{ $t('common_cancel') }}</el-button>
            <el-button type="primary" @click="handleBatchAdjust">{{ $t('common_confirm') }}</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('common_import')"
      :visible.sync="dialog.importVisible"
      width="480px">
      <div>
        <p><span class="f-blue pointer" @click="handleEmpTemp()">{{ $t('employee_list_import_dialog_download_temp') }}</span></p>
        <el-upload
          class="upload__box"
          :before-upload="fileCheck"
          drag
          action="">
          <p v-if="file.fileName" class="file__name">
            <i class="iconfont icon-file"></i>{{ file.fileName }}
          </p>
          <i v-else class="el-icon-upload"></i>
          <div class="el-upload__text">{{ $t('employee_list_import_dialog_tip1') }}<em>{{ $t('employee_list_import_dialog_tip2') }}</em></div>
          <div class="el-upload__tip" slot="tip">
            <p>{{ $t('employee_list_import_dialog_tip3') }}</p>
            <p class="mt20">{{ $t('employee_list_import_dialog_tip4') }}</p>
            <div class="mt5">
              <el-radio v-model="file.coverEmpNo" label="0">{{ $t('employee_list_import_dialog_radio1') }}</el-radio>
              <el-radio v-model="file.coverEmpNo" label="1">{{ $t('employee_list_import_dialog_radio2') }}</el-radio>
            </div>
          </div>
        </el-upload>
        <div class="ac pt20">
          <el-button @click="dialog.importVisible = false">{{ $t('common_cancel') }}</el-button>
          <el-button type="primary" @click="handleUploadFile">{{ $t('common_import') }}</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('common_import')"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="dialog.progressVisible"
      width="400px">
      <div class="progress__dialog">
        <div class="progress">
          <el-progress :text-inside="true" :stroke-width="6" :percentage="exportInfo.progressNum"></el-progress>
          <p class="f-blue ac mt5">{{ exportInfo.progressNum }}%</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/hr/employee'
import DatePickerRange from '@/components/date-picker-range'
import { EmpTreeSelect, DepTreeSelect } from '@/components/tree-select'
import { roleList } from '@/api/hr/position'
import qs from 'qs'

export default {
  name: 'employee',
  data () {
    return {
      file: {
        file: '',
        coverEmpNo: '0',
        fileName: ''
      },
      filterOption: {
        leftNum: 0,
        showExpandBtn: false,
        showMore: false
      },
      dialog: {
        depVisible: false,
        importVisible: false,
        progressVisible: false
      },
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      depFormRules: {
        departments: [
          { required: true, message: this.$t('employee_list_dep_rule_msg'), trigger: 'change' }
        ]
      },
      exportInfo: {
        executing: true,
        failNum: '',
        susNum: '',
        id: '',
        createTime: '',
        progressNum: 0
      },
      select: {
        roles: []
      },
      depForm: { departments: '' },
      checkList: [],
      chooseTimes: '',
      searchParams: {
        depId: '',
        empId: '',
        roleId: '',
        phone: '',
        cardNo: '',
        empNo: '',
        endTime: '',
        begTime: ''
      },
      employeeList: []
    }
  },
  components: {
    DatePickerRange,
    EmpTreeSelect,
    DepTreeSelect
  },
  created () {
    this.getRoles()
  },
  mounted () {
    const { depId } = this.$route.query
    if (depId) {
      this.searchParams.depId = depId
      this.$refs.dep.init()
    }
    this.handleQuery()
  },
  methods: {
    handleQuery (firstPage) {
      if (firstPage) this.pageParams.pageNum = 1
      const params = {
        ...this.searchParams,
        ...this.pageParams
      }
      api.empList(params).then(res => {
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
    handleSelectionChange (val) {
      this.checkList = val
    },
    handleExportExcel (type) {
      if (type === 'check' && !this.checkList.length) {
        this.$message.warning(this.$t('employee_list_warning1'))
        return
      }
      this.$confirm(this.$t('employee_list_confirm1'), this.$t('common_export'), {
        confirmButtonText: this.$t('common_export'),
        center: true
      }).then(() => {
        if (type === 'check') {
          const ids = this.checkList.map(ele => ele.id).join(',')
          window.open(`${this.baseUrl}/employee/exportEmp?empIds=${ids}`)
        }
        if (type === 'search') {
          const params = {
            ...this.searchParams,
            pageNum: 1,
            pageSize: 10
          }
          window.open(`${this.baseUrl}/employee/exportEmp?${qs.stringify(params)}`)
        }
        if (type === 'all') {
          window.open(`${this.baseUrl}/employee/exportEmp`)
        }
      }, () => {})
    },
    handleBatchAdjust () {
      this.$refs.depForm.validate((valid) => {
        if (valid) {
          const params = {
            departments: this.depForm.departments,
            employees: this.checkList.map(ele => ele.id)
          }
          api.batchDep(params).then(res => {
            if (res.success) {
              this.dialog.depVisible = false
              this.$message.success(this.$t('employee_list_success1'))
              this.handleQuery()
            }
          })
        }
      })
    },
    handleDepDialogShow () {
      if (!this.checkList.length) {
        this.$message.warning(this.$t('employee_list_warning2'))
        return
      }
      this.dialog.depVisible = true
    },
    handleDelete ({ id }) {
      this.$confirm(this.$t('employee_list_confirm2'), this.$t('employee_list_confirm_title1'), {
        customClass: 'delete__box--confirm',
        confirmButtonText: this.$t('common_delete'),
        center: true
      }).then(() => {
        api.delEmp(id).then(res => {
          if (res.success) {
            this.$message.success(this.$t('employee_list_success2'))
            this.handleQuery()
          }
        })
      }, () => {})
    },
    handleBatchDelete () {
      if (!this.checkList.length) {
        this.$message.warning(this.$t('employee_list_warning2'))
        return
      }

      this.$confirm(this.$t('employee_list_confirm2'), this.$t('employee_list_confirm_title1'), {
        customClass: 'delete__box--confirm',
        confirmButtonText: this.$t('common_delete'),
        center: true
      }).then(() => {
        const params = {
          empIds: this.checkList.map(ele => ele.id).join(',')
        }
        api.delEmpList(params).then(res => {
          if (res.success) {
            this.$message.success(this.$t('employee_list_success2'))
            this.handleQuery()
          }
        })
      }, () => {})
    },
    handleImportExcel () {
      this.file = {
        file: '',
        coverEmpNo: '0',
        fileName: ''
      }
      this.dialog.importVisible = true
    },
    fileCheck (file) {
      const fileTypeList = ['xls', 'xlsx'] // 支持的文件格式
      const fileMaxSize = 5 // 文件大小限制 单位MB
      const fileNameSplit = file.name.split('.')
      const fileType = fileNameSplit[fileNameSplit.length - 1]
      const fileSize = file.size
      if (!fileTypeList.includes(fileType)) {
        this.$message.error(this.$t('employee_list_error1'))
        return false
      }
      if (fileSize > fileMaxSize * 1024 * 1024) {
        this.$message.error(this.$t('employee_list_error2'))
        return false
      }
      this.file.file = file
      this.file.fileName = file.name
      return false
    },
    handleUploadFile () {
      if (!this.file.fileName) {
        this.$message.warning(this.$t('employee_list_warning3'))
        return
      }
      var formFile = new FormData()
      formFile.append('excel', this.file.file)
      formFile.append('coverEmpNo', this.file.coverEmpNo)

      api.updateEmp(formFile).then(res => {
        if (res.success) {
          const taskId = res.data
          this.dialog.importVisible = false
          this.dialog.progressVisible = true
          this.getProgress(taskId)
        }
      })
    },
    getProgress (taskId) {
      api.progress(taskId).then(res => {
        if (res.success) {
          const { executing, failNum, susNum, totalNum, id, createTime } = res.data
          if (executing) {
            this.exportInfo = { executing, failNum, susNum, id, createTime }
            this.exportInfo.progressNum = parseInt((failNum + susNum) / totalNum * 100)
            setTimeout(() => { this.getProgress(taskId) }, 300)
          } else {
            this.exportInfo.progressNum = 100
            setTimeout(() => {
              this.dialog.progressVisible = false
              this.exportInfo = { executing, failNum, susNum, id, createTime, progressNum: 100 }
              this.$confirm(`${this.$t('employee_list_confirm3_1')}${this.exportInfo.susNum}${this.$t('employee_list_confirm3_3')}，${this.$t('employee_list_confirm3_2')}${this.exportInfo.failNum}${this.$t('employee_list_confirm3_3')}`, this.$t('employee_list_confirm_title2'), {
                cancelButtonText: this.$t('common_confirm'),
                confirmButtonText: this.$t('employee_list_confirm_btn1'),
                center: true
              }).then(() => {
                this.$router.push({
                  name: 'exportDetail',
                  query: {
                    id: this.exportInfo.id,
                    time: this.exportInfo.createTime
                  }
                })
              }, () => {
                this.handleQuery('firstPage')
              })
            }, 2000)
          }
        }
      })
    },
    handleEmpTemp () {
      window.open(`${this.baseUrl}/employee/empTemplate`)
    },
    getRoles () {
      const params = {
        pageSize: 0,
        pageNum: -1
      }
      roleList(params).then(res => {
        if (res.success) {
          this.select.roles = res.data.list || []
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page__header/deep/{
  .el-button--text{
    color: #606266;
    &:hover{
      color: #208ef2;
    }
  }
  .el-dropdown-link{
    cursor: pointer;
    &:hover{
      color: #208ef2;
    }
  }
}
.photo{
  width: 40px;
  height: 40px;
  float: left;
  margin-right: 10px;
  background: #f1f4f7;
}
.upload__box/deep/{
  width: 100%;
  .el-upload{
    width:100%;
    .el-upload-dragger{
      width: 100%;
      height: 150px;
      border-radius: 2px;
    }
  }
  .el-icon-upload{
    margin-top: 30px;
  }
  .el-upload__tip{
    font-size: 14px;
  }
  .file__name{
    color: #606266;
    margin: 50px 0 15px 0;
  }
  .icon-file{
    color: #3dce3d;
  }
}
.progress__dialog{
  height: 90px;
}
.progress/deep/{
  padding: 10px 10px 20px;
  .el-progress-bar__innerText{
    display: none;
  }
}
.dialog__dep/deep/{
  .el-form-item__label{
    padding: 0;
  }
  .el-select{
    width: 100%;
  }
}
</style>
