<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">员工列表</span>
      <div class="page__header--btn">
        <el-button
          class="mr30"
          type="text"
          @click="handleImportExcel()">
          导入
        </el-button>

        <el-dropdown class="mr30" trigger="click">
          <span class="el-dropdown-link">
            导出<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleExportExcel('check')">选中</el-dropdown-item>
            <el-dropdown-item @click.native="handleExportExcel('search')">搜索结果</el-dropdown-item>
            <el-dropdown-item @click.native="handleExportExcel('all')">全部</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown class="mr30" trigger="click">
          <span class="el-dropdown-link">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleDepDialogShow()">调整部门</el-dropdown-item>
            <el-dropdown-item @click.native="handleBatchDelete()">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-button
          type="primary"
          size="small"
          @click="$router.push({name: 'empInfo'})">
          添加员工
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
          <el-form-item label="部门">
            <dep-tree-select ref="dep" v-model="searchParams.depId" type="1"></dep-tree-select>
          </el-form-item>
          <el-form-item label="人员">
            <emp-tree-select v-model="searchParams.empId" type="1"></emp-tree-select>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input
              v-model="searchParams.phone"
              @blur="searchParams.phone = searchParams.phone.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="职称">
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
          <el-form-item label="员工编号">
            <el-input
              v-model="searchParams.empNo"
              @blur="searchParams.empNo = searchParams.empNo.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="卡号">
            <el-input
              v-model="searchParams.cardNo"
              @blur="searchParams.cardNo = searchParams.cardNo.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="入职时间">
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
                查询
              </el-button>
            </el-form-item>
            <el-form-item class="btn__expand">
              <span
                @click="filterOption.showMore = !filterOption.showMore"
                v-if="filterOption.showExpandBtn">
                {{ filterOption.showMore ? '收起' : '展开' }}
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
        <el-table-column label="照片" min-width="170">
          <template slot-scope="scope">
            <img
              v-for="item in scope.row.photoIds"
              :key="item" class="photo"
              :src="`${baseUrl}/file/image/${item}`"
              alt="照片" />
            <span class="photo" v-for="item in (3 - scope.row.photoIds.length)" :key="item"></span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" min-width="90"></el-table-column>
        <el-table-column prop="workNo" label="工号" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
        <el-table-column prop="empNo" label="员工编号" min-width="140" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="cardNo" label="卡号" min-width="130"></el-table-column>
        <el-table-column prop="empRoleVO.roleName" label="职称" min-width="80"></el-table-column>
        <el-table-column prop="empDeps" label="部门" min-width="85" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="entryTime" label="入职时间" min-width="100">
          <template slot-scope="scope">
            {{ scope.row.entryTime && scope.row.entryTime.split(' ')[0] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" class-name="table__icon--btn">
          <template slot-scope="scope">
            <el-tooltip
              content="编辑"
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
              content="删除"
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
            历史上传记录
          </el-button>
          <el-button
            class="btn--blue"
            size="small"
            @click="$router.push({name: 'taskList'})">
            任务列表
          </el-button>
        </div>
      </m-pagination>
    </div>

    <el-dialog
      title="调整部门"
      :visible.sync="dialog.depVisible"
      width="400px">
      <div class="pr20 pl20 dialog__dep" v-if="dialog.depVisible">
        <el-form
          :model="depForm"
          :rules="depFormRules"
          ref="depForm"
          :hide-required-asterisk="true"
          label-position="top">
          <el-form-item label="调整后的部门" prop="departments">
            <dep-tree-select
              ref="dep"
              v-model="depForm.departments"
              type="2">
            </dep-tree-select>
          </el-form-item>
          <div class="ac pt10">
            <el-button @click="dialog.depVisible = false">取消</el-button>
            <el-button type="primary" @click="handleBatchAdjust">确定</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog
      title="导入"
      :visible.sync="dialog.importVisible"
      width="480px">
      <div>
        <p><span class="f-blue pointer" @click="handleEmpTemp()">下载模板</span></p>
        <el-upload
          class="upload__box"
          :before-upload="fileCheck"
          drag
          action="">
          <p v-if="file.fileName" class="file__name">
            <i class="iconfont icon-file"></i>{{ file.fileName }}
          </p>
          <i v-else class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处或<em>文件上传</em></div>
          <div class="el-upload__tip" slot="tip">
            <p>[只支持xls，xlsx]、文件大小不超过5M</p>
            <p class="mt20">若人员编号重复，选择报错还是自动替换更新？</p>
            <div class="mt5">
              <el-radio v-model="file.coverEmpNo" label="0">报错</el-radio>
              <el-radio v-model="file.coverEmpNo" label="1">更新</el-radio>
            </div>
          </div>
        </el-upload>
        <div class="ac pt20">
          <el-button @click="dialog.importVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUploadFile">导入</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="导入"
      :show-close="false"
      :close-on-click-modal="false"
      :visible.sync="dialog.progressVisible"
      width="400px">
      <div class="progress__dialog">
        <div class="progress">
          <el-progress :text-inside="true" :stroke-width="6" :percentage="exportInfo.progressNum"></el-progress>
          <p class="f-blue ac mt5">{{ exportInfo.progressNum }}%</p>
        </div>
        <!-- <div v-else>
          <div class="ac">已成功上传{{ exportInfo.susNum }}人，上传失败{{ exportInfo.failNum }}人</div>
          <div class="ac mt20">
            <el-button @click="dialog.progressVisible = false; handleQuery('firstPage')">确定</el-button>
            <el-button
              type="primary"
              @click="$router.push({
                name: 'exportDetail',
                query: {id: exportInfo.id, time: exportInfo.createTime}
              })">
              查看详情
            </el-button>
          </div>
        </div> -->
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
          { required: true, message: '请选择部门', trigger: 'change' }
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
        this.$message.warning('请选择需要导出的员工！')
        return
      }
      this.$confirm('批量导出选中的人员信息，系统将自动为您生成excel文件', '导出', {
        confirmButtonText: '导出',
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
              this.$message.success('批量调整部门成功！')
              this.handleQuery()
            }
          })
        }
      })
    },
    handleDepDialogShow () {
      if (!this.checkList.length) {
        this.$message.warning('请先在员工列表中勾选员工！')
        return
      }
      this.dialog.depVisible = true
    },
    handleDelete ({ id }) {
      this.$confirm('删除后员工信息将不可恢复', '删除人员', {
        customClass: 'delete__box--confirm',
        confirmButtonText: '删除',
        center: true
      }).then(() => {
        api.delEmp(id).then(res => {
          if (res.success) {
            this.$message.success('删除成功！')
            this.handleQuery()
          }
        })
      }, () => {})
    },
    handleBatchDelete () {
      if (!this.checkList.length) {
        this.$message.warning('请先在员工列表中勾选员工！')
        return
      }

      this.$confirm('删除后员工信息将不可恢复', '删除人员', {
        customClass: 'delete__box--confirm',
        confirmButtonText: '删除',
        center: true
      }).then(() => {
        const params = {
          empIds: this.checkList.map(ele => ele.id).join(',')
        }
        api.delEmpList(params).then(res => {
          if (res.success) {
            this.$message.success('删除成功！')
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
        this.$message.error('文件格式不正确，请重新选择')
        return false
      }
      if (fileSize > fileMaxSize * 1024 * 1024) {
        this.$message.error('文件过大，请重新选择')
        return false
      }
      this.file.file = file
      this.file.fileName = file.name
      return false
    },
    handleUploadFile () {
      if (!this.file.fileName) {
        this.$message.warning('请选择要导入的文件！')
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
              this.$confirm(`已成功上传${this.exportInfo.susNum}人，上传失败${this.exportInfo.failNum}人`, '导入成功', {
                cancelButtonText: '确定',
                confirmButtonText: '查看详情',
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
