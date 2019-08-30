<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title" @click="$router.back()"><i class="iconfont icon-retreat"></i>{{$t('authorize_deviceDetail_title_text')}}</span>
    </div>

    <div class="page__content">
      <div class="content__header">
        <p class="content__title">{{$t('authorize_deviceDetail_deviceInfo_title')}}</p>
        <div class="header__info">
          <span>{{$t('authorize_deviceDetail_deviceInfo_deviceName_label')}}{{ $route.query.deviceName }}</span>
          <span class="ml30">{{$t('authorize_deviceDetail_deviceInfo_deviceKey_label')}}{{ $route.query.deviceKey }}</span>
        </div>
        <p class="content__title mt30 mb10">{{$t('authorize_deviceDetail_personInfo_title')}}</p>
      </div>
      <el-form
        ref="filterForm"
        class="page__content--filter"
        label-position="top"
        :inline="true"
      >
        <el-form-item :label="$t('authorize_deviceDetail_personInfo_search_emp_label')">
          <emp-tree-select
            v-leftClear
            v-model="searchParams.empId"
          ></emp-tree-select>
        </el-form-item>
        <el-form-item :label="$t('authorize_deviceDetail_personInfo_search_empNo_label')">
          <el-input
            v-model="searchParams.empNo"
            maxlength="32"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item class="btn__search">
          <el-button icon="iconfont icon-search" @click="getEmpList(1)">{{$t('common_search')}}</el-button>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeTab" @tab-click="getEmpList(1)">
        <el-tab-pane :label="`${$t('authorize_deviceDetail_personInfo_tabs_finish_label')}(${tabNums.finishNum})`" name="1"></el-tab-pane>
        <el-tab-pane :label="`${$t('authorize_deviceDetail_personInfo_tabs_expPerson_label')}(${tabNums.expPersonNum})`" name="2"></el-tab-pane>
        <el-tab-pane :label="`${$t('authorize_deviceDetail_personInfo_tabs_expFace_label')}(${tabNums.expFaceNum})`" name="3"></el-tab-pane>
      </el-tabs>
      <el-table :data="listData" height="100%">
        <el-table-column
          v-if="activeTab!=='2'"
          prop="faceId"
          :label="$t('authorize_deviceDetail_personInfo_table_header_faces_label')"
          min-width="80"
        >
          <template slot-scope="scope">
            <img v-for="(item, index) in scope.row.faceIds" :key="index" class="m-avatar40 mr10" :src="`${baseUrl}/file/face/${item}`" :alt="$t('authorize_deviceDetail_personInfo_table_header_faces_label')">
          </template>
        </el-table-column>
        <el-table-column
          prop="empName"
          :label="$t('authorize_deviceDetail_personInfo_table_header_empName_label')"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="empNo"
          :label="$t('authorize_deviceDetail_personInfo_table_header_empNo_label')"
          min-width="80"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          v-if="activeTab === 'third'"
          prop="failedReason"
          :label="$t('authorize_deviceDetail_personInfo_table_header_failedReason_label')"
          min-width="80"
        >
          <template slot-scope="scope">
            <span class="f-red">{{scope.row.failedReason}}</span>
          </template>
        </el-table-column>
      </el-table>
      <m-pagination :handleQueryFun="getEmpList" :pageParams="pageParams">
      </m-pagination>
    </div>
  </div>
</template>

<script>
import { authDetailEmpoyee, deviceDetailInfo, authDetailSuccess } from '@/api/authorize'
import { EmpTreeSelect } from '@/components/tree-select'

export default {
  name: 'cutEmp',
  components: {
    EmpTreeSelect
  },
  data () {
    return {
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      searchParams: {
        deviceOperatorId: this.$route.query.deviceOperatorId,
        empNo: ''
      },
      activeTab: '1',
      listData: [],
      tabNums: {
        finishNum: 0,
        expPersonNum: 0,
        expFaceNum: 0
      }
    }
  },
  computed: {
    // 授权操作id
    operateId () {
      return this.$route.params.id
    },
    // 授权操作中的设备操作id
    deviceOperatorId () {
      return this.$route.query.deviceOperatorId
    }
  },
  created () {
    this.getEmpList()
    this.getInfo()
  },
  methods: {
    getEmpList (firstPage) {
      if (firstPage) this.pageParams.pageNum = 1
      const params = { ...this.searchParams, ...this.pageParams }
      let authStatus, type, axiosUrl
      switch (this.activeTab) {
        case '1':
          authStatus = 2
          type = 1
          axiosUrl = authDetailSuccess
          break
        case '2':
          authStatus = 3
          type = 1
          axiosUrl = authDetailEmpoyee
          break
        case '3':
          authStatus = 3
          type = 2
          axiosUrl = authDetailEmpoyee
          break
      }
      params.authStatus = authStatus
      params.type = type
      axiosUrl(this.operateId, params).then(res => {
        if (res.success) {
          const { list, total } = res.data
          if (this.activeTab === '1') {
            this.listData = list.map(item => {
              return {
                faceIds: item.faces && item.faces.map(item => item.faceId),
                empName: item.person.empName,
                empNo: item.person.empNo
              }
            })
          } else {
            this.listData = list.map(item => {
              return {
                faceIds: [item.faceId],
                empName: item.empName,
                empNo: item.empNo
              }
            })
          }
          this.pageParams.total = total
        }
      })
    },
    getInfo () {
      deviceDetailInfo(this.operateId, this.deviceOperatorId).then(res => {
        if (res.success) {
          const { finishNum, expPersonNum, expFaceNum } = res.data
          this.tabNums = {
            finishNum,
            expPersonNum,
            expFaceNum
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__nav-wrap:after {
    height: 1px;
  }
  thead tr th {
    border-top: none;
  }
}
.photo{
  width: 40px;
  height: 40px;
}
.content__title {
  font-size: 16px;
  color: #303133;
}
.content__header {
  width: 100%;
}
.header__info {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  box-sizing: border-box;
  background: #f1f4f7;
  color: #303133;
}
</style>
