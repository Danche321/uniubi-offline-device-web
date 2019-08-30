<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>{{ $t('cut_emp_page_title') }}
      </span>
      <div class="page__header--btn">
        <el-button type="primary" size="small" @click="getDelEmpInfo()">
          {{ $t('cut_emp_header_btn1') }}
        </el-button>
      </div>
    </div>

    <div class="page__content">
      <div class="content__header">
        <p class="content__title">{{ $t('cut_emp_page_sub_title1') }}</p>
        <div class="emp__info">
          <span>{{ $t('cut_emp_info_label1') }}{{ empInfo.name }}</span>
          <span class="ml30">{{ $t('cut_emp_info_label2') }}{{ empInfo.empNo }}</span>
          <span class="ml30">{{ $t('cut_emp_info_label3') }}{{ empInfo.cardNo }}</span>
        </div>
        <p class="content__title mt30 mb10">{{ $t('cut_emp_page_sub_title2') }}</p>
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
          <el-form-item :label="$t('cut_emp_search_label1')">
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
          <el-form-item :label="$t('cut_emp_search_label2')">
            <el-input
              v-model="searchParams.deviceName"
              @blur="searchParams.deviceName = searchParams.deviceName.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('cut_emp_search_label3')">
            <el-input
              v-model="searchParams.deviceKey"
              @blur="searchParams.deviceKey = searchParams.deviceKey.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('cut_emp_search_label4')">
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
              <el-button icon="iconfont icon-search" @click="getDelEmpInfo('firstPage')">{{ $t('common_search') }}</el-button>
            </el-form-item>
            <el-form-item class="btn__expand">
              <span
                @click="filterOption.showMore = !filterOption.showMore"
                v-if="filterOption.showExpandBtn">
                {{ filterOption.showMore ? $t('common_pack') : $t('common_expand') }}
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
        <el-table-column prop="deviceName" :label="$t('cut_emp_table_label1')" min-width="120"></el-table-column>
        <el-table-column prop="deviceKey" :label="$t('cut_emp_table_label2')" min-width="160"></el-table-column>
        <el-table-column prop="deviceGroup" :label="$t('cut_emp_table_label3')" min-width="120"></el-table-column>
        <el-table-column prop="recognitionModeZh" :label="$t('cut_emp_table_label4')" min-width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" :label="$t('cut_emp_table_label5')" min-width="120"></el-table-column>
        <el-table-column :label="$t('cut_emp_table_label6')" min-width="80">
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
        <el-table-column :label="$t('cut_emp_table_label7')" min-width="100" class-name="table__icon--btn">
          <template slot-scope="scope">
            <el-tooltip
              :content="$t('cut_emp_header_btn1')"
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
          { value: 0, label: this.$t('cut_emp_select_status_label1') },
          { value: 1, label: this.$t('cut_emp_select_status_label2') },
          { value: 2, label: this.$t('cut_emp_select_status_label3') },
          { value: 3, label: this.$t('cut_emp_select_status_label4') }
        ],
        recognitionMode: [
          { value: 1, label: this.$t('cut_emp_select_mode_label1') },
          { value: 2, label: this.$t('cut_emp_select_mode_label2') },
          { value: 3, label: this.$t('cut_emp_select_mode_label3') },
          { value: 4, label: this.$t('cut_emp_select_mode_label4') }
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
          this.$message.success(this.$t('cut_emp_success1'))
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
