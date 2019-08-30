<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>{{ $t('task_list_page_title') }}
      </span>
      <div class="page__header--btn">
        <el-button
          type="primary"
          size="small"
          @click="handleRefresh()">
          {{ $t('task_list_header_btn1') }}
        </el-button>
      </div>
    </div>

    <div class="page__content">
      <el-tabs v-model="activeTab">
        <el-tab-pane :label="$t('task_list_tab1')" name="emp">
          <el-form
            ref="filterForm"
            class="page__content--filter"
            label-position="top"
            :inline="true"
            :model="searchEmpParams"
            @keyup.enter.native="handleEmpQuery('firstPage')">
            <el-form-item :label="$t('task_list_search_label1')">
              <el-input
                v-model="searchEmpParams.empName"
                @blur="searchEmpParams.empName = searchEmpParams.empName.trim()"
                maxlength="32"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('task_list_search_label2')">
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
                {{ $t('common_search') }}
              </el-button>
            </el-form-item>
          </el-form>

          <el-table :data="empList" height="100%">
            <!-- <el-table-column label="照片" min-width="170">
              <template slot-scope="scope">
                <img v-for="item in scope.row.photoIds" :key="item" class="photo" :src="`${baseUrl}/file/image/${item}`" alt="照片">
              </template>
            </el-table-column> -->
            <el-table-column prop="name" :label="$t('task_list_table_label2')" min-width="120"></el-table-column>
            <el-table-column prop="empNo" :label="$t('task_list_table_label3')" min-width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="deviceNum" :label="$t('task_list_table_label6')" min-width="80"></el-table-column>
            <el-table-column :label="$t('task_list_table_label5')" min-width="80" class-name="table__icon--btn">
              <template slot-scope="scope">
                <el-tooltip
                  :content="$t('task_list_table_btn1')"
                  placement="top"
                  :enterable="false"
                  :open-delay="500">
                 <!-- v-if="scope.row.deviceNum" -->
                  <i
                    class="iconfont icon-View"
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

        <el-tab-pane :label="$t('task_list_tab2')" name="info">
          <el-form
            ref="filterForm1"
            class="page__content--filter"
            label-position="top"
            :inline="true"
            :model="searchInfoParams"
            @keyup.enter.native="handleInfoQuery('firstPage')">
            <el-form-item :label="$t('task_list_search_label1')">
              <el-input
                v-model="searchInfoParams.empName"
                @blur="searchInfoParams.empName = searchInfoParams.empName.trim()"
                maxlength="32"
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('task_list_search_label2')">
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
                {{ $t('common_search') }}
              </el-button>
            </el-form-item>
          </el-form>

          <el-table :data="infoList" height="100%">
            <el-table-column :label="$t('task_list_table_label1')" min-width="170">
              <template slot-scope="scope">
                <img
                  v-for="item in scope.row.photoIds"
                  :key="item"
                  class="photo"
                  :src="`${baseUrl}/file/image/${item}`" />
                  <span class="photo" v-for="item in (3 - scope.row.photoIds.length)" :key="item"></span>
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('task_list_table_label2')" min-width="120"></el-table-column>
            <el-table-column prop="empNo" :label="$t('task_list_table_label3')" min-width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="deviceNum" :label="$t('task_list_table_label4')" min-width="80"></el-table-column>
            <el-table-column :label="$t('task_list_table_label5')" min-width="80" class-name="table__icon--btn">
              <template slot-scope="scope">
                <el-tooltip
                  :content="$t('task_list_table_btn1')"
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
      this.$confirm(this.$t('task_list_confirm1'), this.$t('common_export'), {
        confirmButtonText: this.$t('common_export'),
        center: true
      }).then(() => {

      }, () => {})
    },
    handleDelete ({ id }) {
      this.$confirm(this.$t('task_list_confirm2'), this.$t('task_list_confirm_title1'), {
        customClass: 'delete__box--confirm',
        confirmButtonText: this.$t('common_delete'),
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
