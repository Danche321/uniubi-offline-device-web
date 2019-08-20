<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title" @click="$router.back()"
        ><i class="iconfont icon-retreat"></i>授权详情</span
      >
    </div>

    <el-scrollbar class="scroll--y">
      <div class="page__content">
        <section class="detail__header">
          <p class="title">
            此次授权人员{{ info.personNum }}名，授权设备{{ info.deviceNum }}台
          </p>
          <div class="f-flex-spaceBetween-alignCenter content">
            <span
              >权限有效期：{{
                info.permissionTime.permissionStartTime
                  ? `${info.permissionTime.permissionStartTime}~${info.permissionTime.permissionEndTime}`
                  : "-"
              }}</span
            >
            <span>{{ info.createTime }}</span>
          </div>
        </section>
        <!--设备信息-->
        <section class="detail__part">
          <div class="detail__search">
            <p class="search__title">设备信息</p>
            <el-form
              class="page__content--filter"
              label-position="top"
              :inline="true"
            >
              <el-form-item label="设备名称">
                <el-input
                  v-model="deviceTable.searchParams.deviceName"
                  maxlength="32"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="设备序列号">
                <el-input
                  v-model="deviceTable.searchParams.deviceKey"
                  maxlength="32"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="设备组">
                <el-select
                  v-model="deviceTable.searchParams.deviceGroupId"
                  filterable
                  clearable
                  v-leftClear
                >
                  <el-option
                    v-for="item in deviceGroupList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.groupName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="btn__search">
                <el-button icon="iconfont icon-search" @click="getDeviceList(1)"
                  >查询</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div class="detail__table">
            <el-tabs
              v-model="deviceTable.activeTab"
              @tab-click="handleDeviceTabChange"
            >
              <el-tab-pane
                :label="`授权完成(${info.finishDeviceNum})`"
                name="2"
              ></el-tab-pane>
              <el-tab-pane
                :label="`授权未完成(${info.unFinishDeviceNum})`"
                name="3"
              ></el-tab-pane>
            </el-tabs>
            <el-table :data="deviceTable.listData" height="250px" empty-text="暂无信息">
              <el-table-column
                prop="deviceName"
                label="设备名称"
                min-width="80"
              ></el-table-column>
              <el-table-column
                prop="deviceKey"
                label="设备序列号"
                min-width="100"
              ></el-table-column>
              <el-table-column
                prop="deviceGroup"
                label="设备组"
                min-width="80"
              ></el-table-column>
              <el-table-column
                prop="personNum"
                label="人数"
                min-width="80"
              ></el-table-column>
              <el-table-column
                prop="photoNum"
                label="照片数"
                min-width="80"
              ></el-table-column>
              <el-table-column prop="deviceStatus" label="状态" min-width="80">
                <template slot-scope="scope">
                  <span
                    class="point"
                    :class="scope.row.deviceStatus === 1 ? 'blue' : 'gray'"
                    >{{ scope.row.deviceStatus | filterStatus }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column
                v-if="deviceTable.activeTab === '3'"
                prop="failedReason"
                :show-overflow-tooltip="true"
                label="未完成原因"
                min-width="100"
              >
                <template slot-scope="scope">
                  <span class="f-red">{{ scope.row.failedReason }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                min-width="100"
                class-name="table__icon--btn"
              >
                <template slot-scope="scope">
                  <el-tooltip content="查看" placement="bottom">
                    <i
                      class="iconfont icon-View"
                      @click="handleDetail(scope.row)"
                    ></i>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
            <m-pagination
              :handleQueryFun="getDeviceList"
              :pageParams="deviceTable.pageParams"
            ></m-pagination>
          </div>
        </section>
        <!--授权异常人员信息-->
        <section class="detail__part">
          <div class="detail__search">
            <p class="search__title">授权异常人员信息</p>
            <expand-form
              :expand.sync="filterOption.showMore"
              :expandBtn.sync="filterOption.showExpandBtn"
              :left.sync="filterOption.leftNum"
            >
              <el-form
                ref="filterForm"
                class="page__content--filter"
                label-position="top"
                :inline="true"
                :class="{ 'filter--reduce': !filterOption.showMore }"
              >
                <el-form-item label="人员">
                  <emp-tree-select
                    v-leftClear
                    v-model="employeeTable.searchParams.empId"
                  ></emp-tree-select>
                </el-form-item>
                <el-form-item label="员工编号">
                  <el-input
                    v-model="employeeTable.searchParams.empNo"
                    maxlength="32"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备组">
                  <el-select
                    v-model="employeeTable.searchParams.deviceGroupId"
                    filterable
                    clearable
                    v-leftClear
                  >
                    <el-option
                      v-for="item in deviceGroupList"
                      :key="item.id"
                      :value="item.id"
                      :label="item.groupName"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备名称">
                  <el-input
                    v-model="employeeTable.searchParams.deviceName"
                    maxlength="32"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item label="卡号">
                  <el-input
                    v-model="employeeTable.searchParams.cardNum"
                    maxlength="32"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item label="设备序列号">
                  <el-input
                    v-model="employeeTable.searchParams.deviceKey"
                    maxlength="32"
                    clearable
                  ></el-input>
                </el-form-item>
                <div
                  class="page__content--search"
                  :class="{ 'filter--reduce': !filterOption.showMore }"
                  :style="{ left: `${filterOption.leftNum}px` }"
                >
                  <el-form-item class="btn__search">
                    <el-button
                      icon="iconfont icon-search"
                      @click="getEmpList(1)"
                      >查询</el-button
                    >
                  </el-form-item>
                  <el-form-item class="btn__expand">
                    <span
                      @click="filterOption.showMore = !filterOption.showMore"
                      v-if="filterOption.showExpandBtn"
                    >
                      {{ filterOption.showMore ? "收起" : "展开" }}
                      <i
                        class="iconfont"
                        :class="{
                          'icon-drop_down': !filterOption.showMore,
                          'icon-Collapse': filterOption.showMore
                        }"
                      ></i>
                    </span>
                  </el-form-item>
                </div>
              </el-form>
            </expand-form>
          </div>
          <div class="detail__table">
            <el-tabs
              v-model="employeeTable.activeTab"
              @tab-click="handleEmpTabChange"
            >
              <el-tab-pane
                :label="`授权未完成(${info.expPersonNum})`"
                name="1"
              ></el-tab-pane>
              <el-tab-pane
                :label="`照片失败(${info.expFaceNum})`"
                name="3"
              ></el-tab-pane>
            </el-tabs>
            <el-table :data="employeeTable.listData" height="250px" empty-text="暂无信息">
              <el-table-column prop="faceId" label="照片" min-width="80">
                <template slot-scope="scope">
                  <img
                    v-if="scope.row.faceId"
                    :key="item"
                    class="photo"
                    :src="`${baseUrl}/file/face/${scope.row.faceId}`"
                    alt="照片"
                  />
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="empName"
                label="姓名"
                min-width="80"
              ></el-table-column>
              <el-table-column
                prop="empNo"
                label="员工编号"
                min-width="80"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                prop="cardNo"
                label="卡号"
                min-width="80"
              ></el-table-column>
              <el-table-column
                prop="failedReason"
                label="失败原因"
                min-width="80"
              >
                <template slot-scope="scope">
                  <span class="f-red">{{ scope.row.failedReason }}</span>
                </template>
              </el-table-column>
            </el-table>
            <m-pagination
              :handleQueryFun="getEmpList"
              :pageParams="employeeTable.pageParams"
            ></m-pagination>
          </div>
        </section>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {
  authDetailDevice,
  authDetailEmpoyee,
  authDetailInfo
} from '@/api/authorize'
import { fetchDeviceGroupAll } from '@/api/common'
import { EmpTreeSelect } from '@/components/tree-select'
export default {
  name: 'authDetail',
  components: {
    EmpTreeSelect
  },
  data () {
    return {
      // 设备信息
      deviceTable: {
        activeTab: '2', // 1授权中  2授权完成  3授权失败
        searchParams: {
          deviceGroupId: '',
          deviceKey: '',
          deviceName: ''
        },
        pageParams: {
          total: 1,
          pageNum: 1,
          pageSize: 10
        },
        listData: []
      },
      // 人员信息
      employeeTable: {
        activeTab: '1', // 1授权中  2授权完成  3授权失败
        searchParams: {
          empId: '',
          empNo: '',
          cardNum: '',
          deviceKey: '',
          deviceName: '',
          deviceGroupId: ''
        },
        pageParams: {
          total: 1,
          pageNum: 1,
          pageSize: 10
        },
        listData: []
      },
      info: {
        personNum: 0,
        deviceNum: 0,
        authTime: '',
        createTime: '',
        finishDeviceNum: 0,
        unFinishDeviceNum: 0,
        expFaceNum: 0,
        expPersonNum: 0,
        permissionTime: ''
      },
      deviceGroupList: [],
      filterOption: {
        leftNum: 0,
        showExpandBtn: false,
        showMore: false
      }
    }
  },
  computed: {
    operateId () {
      return this.$route.params.id
    }
  },
  filters: {
    filterStatus (status) {
      switch (status) {
        case 0:
          return '离线'
        case 1:
          return '在线'
      }
    }
  },
  created () {
    this.getAllGroup()
    this.getInfo()
    this.getDeviceList()
    this.getEmpList()
  },
  methods: {
    // 获取头部信息等
    getInfo () {
      authDetailInfo(this.operateId).then(res => {
        if (res.success) {
          this.info = res.data
        }
      })
    },
    // 获取所有设备组
    getAllGroup () {
      fetchDeviceGroupAll().then(res => {
        if (res.success) {
          this.deviceGroupList = res.data
        }
      })
    },
    getDeviceList (firstPage) {
      if (firstPage) this.deviceTable.pageParams.pageNum = 1
      const params = {
        ...this.deviceTable.searchParams,
        ...this.deviceTable.pageParams
      }
      params.authStatus = this.deviceTable.activeTab
      authDetailDevice(this.operateId, params).then(res => {
        if (res.success) {
          const { list, total } = res.data
          this.deviceTable.listData = list
          this.deviceTable.pageParams.total = total
        }
      })
    },
    getEmpList (firstPage) {
      let type, authStatus
      switch (this.employeeTable.activeTab) {
        case '1':
          authStatus = 3
          type = 1
          break
        case '3':
          authStatus = 3
          type = 2
          break
      }
      if (firstPage) this.employeeTable.pageParams.pageNum = 1
      const params = {
        ...this.employeeTable.searchParams,
        ...this.employeeTable.pageParams,
        authStatus,
        type
      }
      authDetailEmpoyee(this.operateId, params).then(res => {
        if (res.success) {
          const { list, total } = res.data
          this.employeeTable.listData = list
          this.employeeTable.pageParams.total = total
        }
      })
    },
    handleDetail (item) {
      const { id, deviceName, deviceKey } = item
      this.$router.push({
        path: `/authorize/device-detail/${this.operateId}`,
        query: {
          deviceName,
          deviceKey,
          deviceOperatorId: id
        }
      })
    },
    handleDeviceTabChange () {
      this.getDeviceList(1)
    },
    handleEmpTabChange () {
      this.getEmpList(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll--y {
  height: calc(100% - 40px);
}
.detail__header {
  width: 100%;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 20px;
  .title {
    font-size: 16px;
    color: #303133;
  }
  .content {
    font-size: 14px;
    color: #606266;
    margin-top: 10px;
  }
}
.detail__part {
  width: 100%;
  border-bottom: 1px solid #e4e7ed;
  &:last-child {
    border-bottom: none;
  }
}
.detail__search {
  padding-top: 30px;
  .search__title {
    font-size: 16px;
    color: #303133;
    margin-bottom: 14px;
  }
}
.detail__table {
  width: 100%;
  /deep/ {
    .el-tabs__header {
      margin-bottom: 0;
      background-color: #fff;
    }
    .el-tabs__nav-wrap:after {
      height: 1px;
    }
    thead tr th {
      border-top: none;
    }
  }
  .pagination {
    padding: 14px 0;
  }
}
.point {
  position: relative;
  padding-left: 10px;
  &:before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  &.blue:before {
    background: #208ef2;
  }
  &.gray:before {
    background: #c0c4cc;
  }
}
.photo {
  width: 40px;
  height: 40px;
}
</style>
