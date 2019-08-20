<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>任务列表
      </span>
      <div class="page__header--btn">
        <el-button
          type="primary"
          size="small"
          @click="handleRefresh()">
          刷新
        </el-button>
      </div>
    </div>

    <div class="page__content">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="人员删除列表" name="emp">
          <el-form
            ref="filterForm"
            class="page__content--filter"
            label-position="top"
            :inline="true"
            :model="searchEmpParams"
            @keyup.enter.native="handleEmpQuery('firstPage')">
            <el-form-item label="姓名">
              <el-input
                v-model="searchEmpParams.empName"
                @blur="searchEmpParams.empName = searchEmpParams.empName.trim()"
                maxlength="32"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="人员编号">
              <el-input
                v-model="searchEmpParams.empNo"
                @blur="searchEmpParams.empNo = searchEmpParams.empNo.trim()"
                maxlength="32"
                clearable>
              </el-input>
            </el-form-item>

           <el-form-item class="btn__search">
              <el-button
                icon="iconfont icon-search"
                @click="handleEmpQuery('firstPage')">
                查询
              </el-button>
            </el-form-item>
          </el-form>

          <el-table :data="empList" height="100%">
            <!-- <el-table-column label="照片" min-width="170">
              <template slot-scope="scope">
                <img v-for="item in scope.row.photoIds" :key="item" class="photo" :src="`${baseUrl}/file/image/${item}`" alt="照片">
              </template>
            </el-table-column> -->
            <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
            <el-table-column prop="empNo" label="员工编号" min-width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="deviceNum" label="未删除设备数" min-width="80"></el-table-column>
            <el-table-column label="操作" min-width="80" class-name="table__icon--btn">
              <template slot-scope="scope">
                <el-tooltip
                  content="查看"
                  placement="top"
                  :enterable="false"
                  :open-delay="500">
                  <i
                    class="iconfont icon-View"
                    v-if="scope.row.deviceNum"
                    @click="$router.push({
                      name: 'cutEmp',
                      query: {id: scope.row.id, type: 'del'}
                    })">
                  </i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <m-pagination
            :handleQueryFun="handleEmpQuery"
            :pageParams="pageEmpParams">
          </m-pagination>
        </el-tab-pane>

        <el-tab-pane label="信息变更列表" name="info">
          <el-form
            ref="filterForm1"
            class="page__content--filter"
            label-position="top"
            :inline="true"
            :model="searchInfoParams"
            @keyup.enter.native="handleInfoQuery('firstPage')">
            <el-form-item label="姓名">
              <el-input
                v-model="searchInfoParams.empName"
                @blur="searchInfoParams.empName = searchInfoParams.empName.trim()"
                maxlength="32"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="人员编号">
              <el-input
                v-model="searchInfoParams.empNo"
                @blur="searchInfoParams.empNo = searchInfoParams.empNo.trim()"
                maxlength="32"
                clearable>
              </el-input>
            </el-form-item>

            <el-form-item class="btn__search">
              <el-button
                icon="iconfont icon-search"
                @click="handleInfoQuery('firstPage')">
                查询
              </el-button>
            </el-form-item>
          </el-form>

          <el-table :data="infoList" height="100%">
            <el-table-column label="照片" min-width="170">
              <template slot-scope="scope">
                <img
                  v-for="item in scope.row.photoIds"
                  :key="item"
                  class="photo"
                  :src="`${baseUrl}/file/image/${item}`"
                  alt="照片" />
                  <span class="photo" v-for="item in (3 - scope.row.photoIds.length)" :key="item"></span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
            <el-table-column prop="empNo" label="员工编号" min-width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="deviceNum" label="未变更设备数" min-width="80"></el-table-column>
            <el-table-column label="操作" min-width="80" class-name="table__icon--btn">
              <template slot-scope="scope">
                <el-tooltip
                  content="查看"
                  placement="top"
                  :enterable="false"
                  :open-delay="500">
                  <i
                    class="iconfont icon-View"
                    v-if="scope.row.deviceNum"
                    @click="$router.push({
                      name: 'cutEmp',
                      query: {id: scope.row.id, type: 'update'}
                    })">
                  </i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <m-pagination
            :handleQueryFun="handleInfoQuery"
            :pageParams="pageInfoParams">
          </m-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/hr/employee'

export default {
  name: 'historyRecord',
  data () {
    return {
      activeTab: 'emp',
      pageEmpParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      pageInfoParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      searchEmpParams: {
        empName: '',
        empNo: ''
      },
      searchInfoParams: {
        empName: '',
        empNo: ''
      },
      infoList: [],
      empList: []
    }
  },
  created () {
    this.handleInfoQuery()
    this.handleEmpQuery()
  },
  methods: {
    handleInfoQuery (firstPage) {
      if (firstPage) this.pageInfoParams.pageNum = 1
      const params = {
        ...this.searchInfoParams,
        ...this.pageInfoParams
      }
      api.getUpdateEmpList(params).then(res => {
        if (res.success) {
          const { list, pageNum, total } = res.data
          this.infoList = list.map(ele => { return { ...ele, photoIds: ele.photoIds || [] } })
          this.pageInfoParams = { ...this.pageInfoParams, pageNum, total }
        }
      })
    },
    handleEmpQuery (firstPage) {
      if (firstPage) this.pageEmpParams.pageNum = 1
      const params = {
        ...this.searchEmpParams,
        ...this.pageEmpParams
      }
      api.getDelEmpList(params).then(res => {
        if (res.success) {
          const { list, pageNum, total } = res.data
          this.empList = list
          this.pageEmpParams = { ...this.pageEmpParams, pageNum, total }
        }
      })
    },
    handleHeaderExportExcel () {

    },
    handleExportExcel (type) {
      this.$confirm('批量导出选中的人员信息，系统将自动为您生成excel文件', '导出', {
        confirmButtonText: '导出',
        center: true
      }).then(() => {

      }, () => {})
    },
    handleDelete ({ id }) {
      this.$confirm('删除后员工信息将不可恢复', '删除人员', {
        customClass: 'delete__box--confirm',
        confirmButtonText: '删除',
        center: true
      }).then(() => {

      }, () => {})
    },
    handleRefresh () {
      this.handleInfoQuery()
      this.handleEmpQuery()
    }
  }
}
</script>

<style lang="scss" scoped>
.page__content{
  padding-top: 0;
}
.el-tabs/deep/{
  width: 100%;
  height: 100%;
  .el-tabs__header{
    margin-bottom: 0;
    padding: 10px 0;
  }
  .el-tabs__item{
    font-size: 16px;
  }
  .el-tabs__content{
    height: calc(100% - 60px);
    .el-tab-pane{
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
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
</style>
