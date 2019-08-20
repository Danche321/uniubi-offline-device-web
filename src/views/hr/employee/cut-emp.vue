<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>详情
      </span>
      <div class="page__header--btn">
        <el-button type="primary" size="small" @click="getDelEmpInfo()">刷新</el-button>
      </div>
    </div>

    <div class="page__content">
      <div class="content__header">
        <p class="content__title">人员信息</p>
        <div class="emp__info">
          <span>姓名：{{ empInfo.name }}</span>
          <span class="ml30">员工编号：{{ empInfo.empNo }}</span>
          <span class="ml30">卡号：{{ empInfo.cardNo }}</span>
        </div>
        <p class="content__title mt30 mb10">设备信息</p>
      </div>

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
          @keyup.enter.native="getDelEmpInfo('firstPage')">
          <el-form-item label="设备组">
            <el-select
              v-model="searchParams.deviceGroupId"
              placeholder=""
              clearable
              v-leftClear>
              <el-option
                v-for="item in select.deviceGroup"
                :key="item.id"
                :value="item.id"
                :label="item.groupName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input
              v-model="searchParams.deviceName"
              @blur="searchParams.deviceName = searchParams.deviceName.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="设备序列号">
            <el-input
              v-model="searchParams.deviceKey"
              @blur="searchParams.deviceKey = searchParams.deviceKey.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="识别模式">
            <el-select
              v-model="searchParams.recognitionMode"
              placeholder=""
              clearable
              v-leftClear
              multiple
              collapse-tags>
              <el-option
                v-for="item in select.recognitionMode"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <div
            class="page__content--search"
            :class="{'filter--reduce': !filterOption.showMore}"
            :style="{'left': `${filterOption.leftNum}px`}">
            <el-form-item class="btn__search">
              <el-button icon="iconfont icon-search" @click="getDelEmpInfo('firstPage')">查询</el-button>
            </el-form-item>
            <el-form-item class="btn__expand">
              <span
                @click="filterOption.showMore = !filterOption.showMore"
                v-if="filterOption.showExpandBtn">
                {{ filterOption.showMore ? '收起' : '展开' }}
                <i
                  class="iconfont"
                  :class="{
                    'icon-drop_down': !filterOption.showMore,
                    'icon-Collapse': filterOption.showMore
                  }">
                </i>
              </span>
            </el-form-item>
          </div>
        </el-form>
      </expand-form>

      <el-table :data="deviceList" height="100%">
        <el-table-column prop="deviceName" label="设备名称" min-width="120"></el-table-column>
        <el-table-column prop="deviceKey" label="设备序列号" min-width="160"></el-table-column>
        <el-table-column prop="deviceGroup" label="设备组" min-width="120"></el-table-column>
        <el-table-column prop="recognitionModeZh" label="识别模式" min-width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="120"></el-table-column>
        <el-table-column label="状态" min-width="80">
          <template slot-scope="scope">
            <span
              class="point mr5"
              :class="{
                blue: scope.row.status === 1,
                gray: scope.row.status !== 1
              }">
            </span>
            <span>{{ filter(scope.row.status, select.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100" class-name="table__icon--btn">
          <template slot-scope="scope">
            <el-tooltip
              content="刷新"
              placement="top"
              :enterable="false"
              :open-delay="500">
              <i
                class="iconfont icon-Refresh"
                @click="handleRefresh(scope.row, scope.$index)">
              </i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        :handleQueryFun="getDelEmpInfo"
        :pageParams="pageParams">
      </m-pagination>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/hr/employee'
import { refreshDevice } from '@/api/device/device'
import { fetchDeviceGroupAll } from '@/api/common'

export default {
  name: 'cutEmp',
  data () {
    return {
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      searchParams: {
        deviceGroupId: '',
        deviceKey: '',
        deviceName: '',
        recognitionMode: []
      },
      filterOption: {
        leftNum: 0,
        showExpandBtn: false,
        showMore: false
      },
      deviceList: [],
      empInfo: {
        name: '',
        empNo: '',
        cardNo: ''
      },
      select: {
        status: [
          { value: 0, label: '离线' },
          { value: 1, label: '在线' },
          { value: 2, label: '禁用' },
          { value: 3, label: '密码错误' }
        ],
        recognitionMode: [
          { value: 1, label: '人脸识别' },
          { value: 2, label: '刷卡识别' },
          { value: 3, label: '人卡合一' },
          { value: 4, label: '认证比对' }
        ],
        deviceGroup: []
      }
    }
  },
  created () {
    this.getDelEmpInfo()
    this.getDeviceGroupAll()
  },
  methods: {
    getDelEmpInfo (firstPage) {
      if (firstPage) this.pageParams.pageNum = 1
      const params = {
        ...this.pageParams,
        ...this.searchParams,
        empTaskId: this.$route.query.id
      }
      const apiType = this.$route.query.type === 'del' ? 'delEmpInfo' : 'updateEmpInfo'
      api[apiType](params).then(res => {
        if (res.success) {
          this.empInfo = res.data
          this.deviceList = this.empInfo.deviceDOS.list
          this.deviceList.forEach(ele => {
            if (ele.recognitionMode && ele.recognitionMode.length) {
              ele.recognitionModeZh = ele.recognitionMode.map(ele1 => this.filter(ele1, this.select.recognitionMode)).join('，')
            }
          })
        }
      })
    },
    handleRefresh ({ deviceKey }, index) {
      refreshDevice(deviceKey).then(res => {
        if (res.success) {
          this.deviceList.splice(index, 1, res.data)
          this.$message.success('设备刷新成功！')
        }
      })
    },
    getDeviceGroupAll () {
      fetchDeviceGroupAll().then(res => {
        if (res.success) {
          this.select.deviceGroup = res.data
        }
      })
    },
    filter (val, select) {
      if (!val && val !== 0) return
      return select.find(ele => ele.value === val).label
    }
  }
}
</script>

<style lang="scss" scoped>
.content__title{
  font-size: 16px;
  color: #303133;
}
.content__header{
  width: 100%;
}
.emp__info{
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  box-sizing: border-box;
  background: #f1f4f7;
}
.point{
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: transparent;
  &.blue{
    background: #208ef2;
  }
  &.gray{
    background: #c0c4cc;
  }
}
</style>
