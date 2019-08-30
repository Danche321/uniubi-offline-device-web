<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title" @click="$router.back()"
        ><i class="iconfont icon-retreat"></i>{{$t('device_check.title')}}</span
      >
    </div>
    <div class="page__content">
      <div v-if="[1, 2].includes(checkStatus)" class="header__searching">
        <i class="iconfont icon-load"></i>
        <p class="text">{{$t('device_check.search.checking')}}···</p>
        <div class="tip" v-if="checkStatus === 1">
          <p>{{$t('device_check.search.tip1')}}</p>
          <p>{{$t('device_check.search.tip2')}}</p>
        </div>
      </div>
      <div v-if="checkStatus === 3 && !isEmpty" class="header__result">
        <p>{{$t('device_check.search.tip3')}}（{{ total }}）</p>
        <el-button type="text" @click="handleReCheck">{{$t('device_check.search.reCheck')}}</el-button>
      </div>
      <!--检查有结果-->
      <div
        v-if="checkStatus !== 1 && !isEmpty"
        class="result-box"
        style="height: 100%;width: 100%"
      >
        <div class="f-flex-spaceBetween-alignCenter w100 mb5">
          <p>{{$t('device_check.search.tip2')}}</p>
          <el-button size="small" type="primary" @click="handleUpgrade(1)">{{$t('device_check.search.batchUpgrade')}}</el-button>
        </div>
        <el-tabs v-model="activeTab">
          <el-tab-pane
            :label="`${$t('device_check.table.tabs.tab1')}(${normalDeviceList.length})`"
            name="1"
          ></el-tab-pane>
          <el-tab-pane
            :label="`${$t('device_check.table.tabs.tab2')}(${lowVersionDeviceList.length})`"
            name="2"
          ></el-tab-pane>
          <el-tab-pane
            :label="`${$t('device_check.table.tabs.tab3')}(${highVersionDeviceList.length})`"
            name="3"
          ></el-tab-pane>
          <el-tab-pane
            :label="`${$t('device_check.table.tabs.tab4')}(${offlineDeviceList.length})`"
            name="4"
          ></el-tab-pane>
        </el-tabs>
        <el-table :data="tableList" height="100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="deviceKey" :label="$t('device_check.table.labels.deviceKey')" min-width="120">
            <template slot-scope="scope">
              <el-tooltip
                v-if="[0, 2].includes(scope.row.status)"
                effect="dark"
                :disabled="![0, 2].includes(scope.row.status)"
                :content="scope.row.status | filterStatusText"
                placement="top"
                :enterable="false"
              >
                <i
                  class="f-error iconfont mr15"
                  :class="scope.row.status | filterStatusIcon"
                ></i>
              </el-tooltip>
              <span>{{ scope.row.deviceKey }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="version"
            :label="$t('device_check.table.labels.version')"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="ip"
            :label="$t('device_check.table.labels.ipAddress')"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="deviceNameFromDevice"
            :label="$t('device_check.table.labels.devicePlateName')"
            min-width="80"
          >
            <template slot-scope="scope">
              <span :class="{'f-red': scope.row.deviceNameFromDevice!==scope.row.deviceName}">{{scope.row.deviceNameFromDevice}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="deviceName"
            :label="$t('device_check.table.labels.ClientPlateName')"
            min-width="80"
          >
            <template slot-scope="scope">
              <span :class="{'f-red': scope.row.deviceNameFromDevice!==scope.row.deviceName}">{{scope.row.deviceName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceGroup" :label="$t('device_check.table.labels.handle')" min-width="80">
            <template slot-scope="scope">
              <el-button v-if="scope.row.deviceNameFromDevice!==scope.row.deviceName && activeTab !== '4'" type="text" @click="handleSync(scope.row)">{{$t('device_check.table.sync')}}</el-button>
              <el-button v-if="['2', '3'].includes(activeTab)" :class="{'f-diabeld': activeTab==='3'}" type="text" @click="handleUpgrade(0, scope.row)">{{$t('device_check.table.upgrade')}}</el-button>
              <el-button v-if="scope.row.status === 2" type="text" @click="handleEnable(scope.row)">{{$t('device_check.table.enable')}}</el-button>
              <el-button v-if="activeTab === '4'" type="text" @click="handleDelete(scope.row)">{{$t('device_check.table.forceDelete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <p v-show="activeTab === '3' && highVersionDeviceList.length" class="mt10 ac w100">
          {{$t('device_check.table.tip')}}
        </p>
      </div>
      <!--检查无结果-->
      <div v-if="checkStatus === 3 && isEmpty" class="empty-box">
        <img
          class="img-empty"
          src="@/assets/images/device/empty-device.jpg"
          alt=""
        />
        <p>{{$t('device_check.search.noDataTip')}}</p>
        <el-button type="text" @click="handleEmptyToCheck">{{$t('device_check.search.reCheck')}}</el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="syncDialog.visible"
      class="delete__dialog"
      width="400px"
    >
      <div class="pl30 pr30">
        <p class="delete__dialog--title">{{$t('device_check.dialog.sync')}}</p>
        <p class="item__radio">
          <el-radio v-model="syncDialog.val" :label="syncDialog.deviceNameFromDevice">{{$t('device_check.dialog.syncDevice')}}</el-radio>
        </p>
        <p class="item__radio">
          <el-radio v-model="syncDialog.val" :label="syncDialog.deviceName">{{$t('device_check.dialog.syncClient')}}</el-radio>
        </p>
        <div class="ac pt30">
          <el-button @click="syncDialog.visible = false">{{$t('common_cancel')}}</el-button>
          <el-button type="primary" @click="handleSyncConfirm">{{$t('device_check.dialog.sync')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  checkDevice,
  deviceEnable,
  deviceDeleteForce,
  deviceUpdate
} from '@/api/device/device'
export default {
  name: 'device-check',
  data () {
    return {
      normalDeviceList: [],
      lowVersionDeviceList: [],
      highVersionDeviceList: [],
      offlineDeviceList: [],
      checkStatus: 1, // 1初次检查中 2重新检查中 3检查完成
      activeTab: '1', // 1版本一致  2设备版本低  3客户端版本低  4设备离线
      total: 0,
      syncDialog: {
        visible: false,
        val: '',
        deviceKey: '',
        deviceName: '',
        deviceNameFromDevice: ''
      },
      checkList: []
    }
  },
  computed: {
    isEmpty () {
      return (
        !this.normalDeviceList.length &&
        !this.highVersionDeviceList.length &&
        !this.lowVersionDeviceList.length &&
        !this.offlineDeviceList.length
      )
    },
    tableList () {
      switch (this.activeTab) {
        case '1':
          return this.normalDeviceList
        case '2':
          return this.lowVersionDeviceList
        case '3':
          return this.highVersionDeviceList
        case '4':
          return this.offlineDeviceList
        default:
          return []
      }
    }
  },
  filters: {
    filterStatusIcon (status) {
      switch (status) {
        case 0: // 离线
          return 'icon-Offline'
        case 2: // 禁用
          return 'icon-Disable'
      }
    },
    filterStatusText (status) {
      switch (status) {
        case 0:
          return this.$t('device_check.deviceOffLine')
        case 2: // 禁用
          return this.$t('device_check.deviceDisabled')
      }
    }
  },
  created () {
    this.handleCheck()
  },
  methods: {
    handleCheck () {
      checkDevice().then(res => {
        if (res.success) {
          const {
            normalDeviceList = [],
            highVersionDeviceList = [],
            lowVersionDeviceList = [],
            offlineDeviceList = []
          } = res.data || {}
          this.normalDeviceList = normalDeviceList
          this.highVersionDeviceList = highVersionDeviceList
          this.lowVersionDeviceList = lowVersionDeviceList
          this.offlineDeviceList = offlineDeviceList
          this.total =
            normalDeviceList.length +
            highVersionDeviceList.length +
            lowVersionDeviceList.length +
            offlineDeviceList.length
        }
        this.checkStatus = 3
      })
    },
    handleSelectionChange (val) {
      if (!val.length) return false
      this.checkList = val
    },
    // 同步
    handleSync (item) {
      this.syncDialog.visible = true
      this.syncDialog.deviceKey = item.deviceKey
      this.syncDialog.deviceName = item.deviceName
      this.syncDialog.deviceNameFromDevice = item.deviceNameFromDevice
    },
    handleSyncConfirm () {
      const { val, deviceKey } = this.syncDialog
      const params = {
        deviceName: val
      }
      deviceUpdate(deviceKey, params).then(res => {
        if (res.success) {
          this.$message.success(this.$t('device_check.message.syncSuccess'))
          this.syncDialog.visible = false
        }
      })
    },
    // 升级
    handleUpgrade (type, data) {
      let deviceList
      if (type === 1) {
        if (!this.checkList.length) return this.$message.error(this.$t('device_check.message.requiredDevice'))
        deviceList = this.checkList
      } else {
        deviceList = [data]
      }
      sessionStorage.setItem('deviceList', JSON.stringify(deviceList))
      this.$router.push({
        name: 'upgrade'
      })
    },
    // 启用
    handleEnable (item) {
      const { deviceKey } = item
      const params = {
        deviceKeyList: [deviceKey]
      }
      deviceEnable(params).then(res => {
        if (res.success && res.data[0].success) {
          this.$message.success(this.$t('device_check.message.hasEnable'))
          this.handleCheck()
        }
      })
    },
    // 强制删除
    handleDelete (item) {
      const { deviceKey } = item
      this.$confirm(
        this.$t('device_check.message.forceDeleteTip'),
        this.$t('device_check.message.forceDelete'),
        {
          customClass: 'delete__box--confirm',
          confirmButtonText: this.$t('device_check.message.delete'),
          center: true
        }
      ).then(() => {
        deviceDeleteForce(deviceKey).then(res => {
          if (res.success) {
            this.$message.success(this.$t('device_check.message.hasDelete'))
            this.handleCheck()
          }
        })
      }, () => {})
    },
    // 有数据重新检查
    handleReCheck () {
      this.checkStatus = 2
      this.handleCheck()
    },
    // 无数据重新检查
    handleEmptyToCheck () {
      this.checkStatus = 1
      this.handleCheck()
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
.header__searching {
  text-align: center;
  width: 100%;
  padding: 40px 0;
  .text {
    color: #303133;
    margin-top: 20px;
  }
  .tip {
    line-height: 28px;
    color: #606266;
    margin-top: 30px;
  }
}
.header__result {
  width: 100%;
  text-align: center;
  padding: 30px 0 40px 0;
}
.result-box {
  width: 100%;
  height: calc(100% - 150px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  box-sizing: border-box;
  background: #fff;
}
.empty-box {
  margin: auto;
  text-align: center;
  .img-empty {
    width: 333px;
    height: 180px;
  }
}
.input__edit {
  .iconfont {
    cursor: pointer;
  }
  .icon-success {
    color: #3fc948;
  }
  .icon-failure {
    color: #c0c4cc;
  }
}
.icon-Disable {
  color: #ff002e;
}

.delete__dialog/deep/{
  .el-dialog__header{
    border: none;
  }
  .delete__dialog--title{
    font-size: 16px;
    text-align: center;
    margin-top: -25px;
  }
  .item__radio{
    text-align: center;
    margin-right: 16px;
  }
  .el-radio{
    margin: 20px 0 0 30px;
  }
  .el-radio__label{
    color: #303133;
  }
}
</style>
