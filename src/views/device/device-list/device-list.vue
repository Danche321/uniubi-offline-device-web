<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">{{ $t('deviceList_page_title') }}</span>
      <div class="page__header--btn">
        <el-button class="mr30" type="text" @click="$router.push({name: 'deviceCheck'})">{{ $t('deviceList_header_deviceCheck_button') }}</el-button>
        <el-button class="mr30" type="text"  @click="$router.push({name: 'batch'})">{{ $t('deviceList_header_batch_button') }}</el-button>
        <el-button type="primary" size="small" @click="dialog.chooseVisible = true">{{ $t('deviceList_header_addDevice_button') }}</el-button>
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
          <el-form-item :label="$t('deviceList_search_deviceGroup')">
            <el-select
              v-model="searchParams.deviceGroup"
              placeholder=""
              clearable
              filterable
              v-leftClear>
              <el-option
                v-for="item in select.deviceGroup"
                :key="item.id"
                :value="item.id"
                :label="item.groupName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('deviceList_search_deviceName')">
            <el-input
              v-model="searchParams.deviceName"
              @blur="searchParams.deviceName = searchParams.deviceName.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('deviceList_search_deviceKey')">
            <el-input
              v-model="searchParams.deviceKey"
              @blur="searchParams.deviceKey = searchParams.deviceKey.trim()"
              maxlength="32"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('deviceList_search_status')">
            <el-select
              v-model="searchParams.status"
              placeholder=""
              v-leftClear
              clearable>
              <el-option
                v-for="item in select.status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('deviceList_search_deviceIp')">
            <el-input
              v-model="searchParams.deviceIp"
              @blur="searchParams.deviceIp = searchParams.deviceIp.trim()"
              maxlength="32"
              clearable></el-input>
          </el-form-item>
          <el-form-item :label="$t('deviceList_search_recognitionMode')">
            <el-select
              v-model="searchParams.recognitionMode"
              placeholder=""
              clearable
              v-leftClear
              collapse-tags
              multiple>
              <el-option
                v-for="item in select.recognitionMode"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('deviceList_search_softwareVersion')">
            <el-input
              v-model="searchParams.softwareVersion"
              @blur="searchParams.softwareVersion = searchParams.softwareVersion.trim()"
              maxlength="32"
              clearable></el-input>
          </el-form-item>

          <div
            class="page__content--search"
            :class="{'filter--reduce': !filterOption.showMore}"
            :style="{'left': `${filterOption.leftNum}px`}">
            <el-form-item class="btn__search">
              <el-button icon="iconfont icon-search" @click="handleQuery('firstPage')">{{ $t('deviceList_search_button') }}</el-button>
            </el-form-item>
            <el-form-item class="btn__expand">
              <span
                @click="filterOption.showMore = !filterOption.showMore"
                v-if="filterOption.showExpandBtn">
                {{ filterOption.showMore ? $t('deviceList_search_retract_button') : $t('deviceList_search_unfold_button') }}
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
        <el-table-column width="30">
          <template slot-scope="scope">
            <el-tooltip
                    :content="$t('deviceList_table_tooltip_error')"
                    placement="right"
                    :enterable="false">
              <i class="iconfont icon-Error f-red" v-if="scope.row.expType === 3"></i>
            </el-tooltip>
            <el-tooltip
                    :content="$t('deviceList_table_tooltip_outLine')"
                    placement="right"
                    :enterable="false">
              <i class="iconfont icon-Disable f-red" v-if="scope.row.status !== 1"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="deviceName" :label="$t('deviceList_table_th_deviceName')" min-width="120">
          <template slot-scope="{ row }">
            {{ row.deviceName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="deviceKey" :label="$t('deviceList_table_th_deviceKey')" min-width="160">
          <template slot-scope="{ row }">
            {{ row.deviceKey || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="softwareVersion" :label="$t('deviceList_table_th_softwareVersion')" min-width="130">
          <template slot-scope="{ row }">
            {{ row.softwareVersion || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="deviceIp" :label="$t('deviceList_table_th_deviceIp')" min-width="130">
          <template slot-scope="{ row }">
            {{ row.deviceIp || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="recognitionModeZh" :label="$t('deviceList_table_th_recognitionModeZh')" min-width="120" :show-overflow-tooltip="true">
          <template slot-scope="{ row }">
            {{ row.recognitionModeZh || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="deviceGroup" :label="$t('deviceList_table_th_deviceGroup')" min-width="120">
          <template slot-scope="{ row }">
            {{ row.deviceGroup || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('deviceList_table_th_status')" min-width="100">
          <template slot-scope="scope">
            <div class="fl mr5 point">
              <span
                :class="{
                  blue: scope.row.status === 1,
                  gray: scope.row.status !== 1
                }">
              </span>
            </div>
            <span class="fl">{{ filter(scope.row.status, select.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('deviceList_table_th_createTime')" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.createTime && scope.row.createTime.split(' ')[0] || '--' }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('deviceList_table_th_operete')" min-width="170" class-name="table__icon--btn">
          <template slot-scope="scope">
            <el-tooltip
              :content="$t('deviceList_table_tootip_refresh')"
              placement="top"
              :enterable="false"
              :open-delay="500">
              <i
                class="iconfont icon-Refresh"
                @click="handleRefresh(scope.row, scope.$index)">
              </i>
            </el-tooltip>
            <el-tooltip
              :content="$t('deviceList_table_tootip_edit')"
              placement="top"
              :enterable="false"
              :open-delay="500">
              <i
                class="iconfont icon-edit"
                @click="handleEdit(scope.row)"
                v-if="scope.row.expType !== 2">
              </i>
            </el-tooltip>
            <el-tooltip
              :content="$t('deviceList_table_tootip_delete')"
              placement="top"
              :enterable="false"
              :open-delay="500">
              <i
                class="iconfont icon-delete"
                @click="handleDeleteDialogShow(scope.row)"></i>
            </el-tooltip>
            <el-button
              type="text"
              v-if="scope.row.expType !== 2"
              @click="handelMore(scope.row)">
              {{ $t('deviceList_table_button_more') }}
            </el-button>
            <el-button
              type="text"
              @click="handleEnable(scope.row)"
              v-if="scope.row.expType === 2">
              {{ $t('deviceList_table_button_enabled') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        :handleQueryFun="handleQuery"
        :pageParams="pageParams">
      </m-pagination>
    </div>

    <el-dialog
      :title="$t('deviceList_dialog_choose_title')"
      :visible.sync="dialog.chooseVisible"
      width="460px">
      <div class="pl30 pr30">
        <div class="choose__item">
          <i class="iconfont icon-Manual" @click="$router.push({name:'addManual'})"></i>
          <p class="mt20">{{ $t('deviceList_dialog_choose_manual_title') }}</p>
          <p class="tip">{{ $t('deviceList_dialog_choose_manual_tip') }}</p>
        </div>
        <div class="choose__item">
          <i class="iconfont icon-search" @click="$router.push({name:'addAuto'})"></i>
          <p class="mt20">{{ $t('deviceList_dialog_choose_search_title') }}</p>
          <p class="tip">{{ $t('deviceList_dialog_choose_search_tip') }}</p>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog.deleteVisible"
      class="delete__dialog"
      width="400px">
      <div class="pl30 pr30">
        <p class="delete__dialog--title">{{ $t('deviceList_dialog_delete_title') }}</p>
        <p>
          <el-radio v-model="deleteDevice.clearDevice" :label="true">
            {{ $t('deviceList_dialog_delete_clearDevice1') }}
          </el-radio>
        </p>
        <p>
          <el-radio v-model="deleteDevice.clearDevice" :label="false">
            {{ $t('deviceList_dialog_delete_clearDevice2') }}
          </el-radio>
        </p>
        <div class="ac pt30">
          <el-button @click="dialog.deleteVisible = false">{{ $t('deviceList_dialog_delete_cancel_button') }}</el-button>
          <el-button type="primary" @click="handleDelete()">{{ $t('deviceList_dialog_delete_delete_button') }}</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('deviceList_dialog_edit_title')"
      :visible.sync="updateDialog.visible"
      width="400px"
      @close="handleUpdateClose"
    >
      <el-form
        ref="form"
        :model="updateDialog.form"
        :rules="updateDialog.rules"
        label-position="top">
        <el-form-item prop="deviceName" :label="$t('deviceList_dialog_edit_form_deviceName')" required>
          <el-input
            v-model.trim="updateDialog.form.deviceName"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="groupId" :label="$t('deviceList_dialog_edit_form_groupId')">
          <el-select v-model="updateDialog.form.groupId" clearable class="w100">
            <el-option
              v-for="item in updateDialog.deviceGroupList"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item-showPass-wrap">
          <div class="form-item__showPass" @click="updateDialog.showPassField=!updateDialog.showPassField">
            <span class="mr10">{{ $t('deviceList_dialog_edit_form_showPassField') }}</span>
            <i v-if="updateDialog.showPassField" class="iconfont icon-Collapse"></i>
            <i v-else class="iconfont icon-drop_down"></i>
          </div>
        </el-form-item>
        <el-form-item v-if="updateDialog.showPassField" prop="newPass">
          <div slot="label">
            {{ $t('deviceList_dialog_edit_form_password1') }}<span class="f-gray">{{ $t('deviceList_dialog_edit_form_password2') }}</span>
          </div>
          <el-input type="password" v-model.trim="updateDialog.form.newPass" clearable>
          </el-input>
        </el-form-item>
        <div class="ac mt30">
          <el-button @click="updateDialog.visible=false">{{ $t('deviceList_dialog_edit_form_button_cancel') }}</el-button>
          <el-button type="primary" @click="handelUpdateSubmit">{{ $t('deviceList_dialog_edit_form_button_save') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/device/device'
import { fetchDeviceGroupAll } from '@/api/common'
import { nameRule } from '@/libs/rules'

export default {
  name: 'deviceList',
  data () {
    return {
      deleteDevice: {
        deviceKey: '',
        clearDevice: ''
      },
      filterOption: {
        leftNum: 0,
        showExpandBtn: false,
        showMore: false
      },
      dialog: {
        chooseVisible: false,
        deleteVisible: false
      },
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      checkedList: [],
      searchParams: {
        deviceKey: '',
        deviceName: '',
        deviceIp: '',
        deviceGroup: '',
        status: '',
        softwareVersion: '',
        recognitionMode: []
      },
      select: {
        status: [
          { value: 0, label: this.$t('deviceList_select_status_option1') },
          { value: 1, label: this.$t('deviceList_select_status_option2') }
        ],
        recognitionMode: [
          { value: 1, label: this.$t('deviceList_select_recognitionMode_option1') },
          { value: 2, label: this.$t('deviceList_select_recognitionMode_option2') },
          { value: 3, label: this.$t('deviceList_select_recognitionMode_option3') },
          { value: 4, label: this.$t('deviceList_select_recognitionMode_option4') }
        ],
        deviceGroup: []
      },
      deviceList: [],
      updateDialog: {
        visible: false,
        deviceGroupList: [],
        form: {
          deviceKey: '',
          deviceName: '',
          groupId: '',
          newPass: ''
        },
        rules: {
          deviceName: [
            { required: true, message: this.$t('deviceList_rules_deviceName_required'), trigger: 'blur' },
            { validator: nameRule, trigger: 'blur' }
          ]
        },
        showPassField: false
      }
    }
  },
  created () {
    this.handleQuery()
    this.getDeviceGroupAll()
    this.getAllGroup()
  },
  methods: {
    handleUpdateClose () {
      this.updateDialog.showPassField = false
      this.$refs.form.resetFields()
    },
    handleQuery (firstPage) {
      if (firstPage) this.pageParams.pageNum = 1
      const params = {
        ...this.searchParams,
        ...this.pageParams,
        recognitionMode: this.searchParams.recognitionMode.join(',')
      }
      api.deviceList(params).then(res => {
        if (res.success) {
          const { list, pageNum, total } = res.data
          this.deviceList = list
          this.deviceList.forEach(ele => {
            if (ele.recognitionMode && ele.recognitionMode.length) {
              ele.recognitionModeZh = ele.recognitionMode.map(ele1 => this.filter(ele1, this.select.recognitionMode)).join('，')
            }
          })
          this.pageParams = { ...this.pageParams, pageNum, total }
        }
      })
    },
    handleRefresh ({ deviceKey }, index) {
      api.refreshDevice(deviceKey).then(res => {
        if (res.success) {
          const deviceInfo = res.data
          if (deviceInfo.recognitionMode && deviceInfo.recognitionMode.length) {
            deviceInfo.recognitionModeZh = deviceInfo.recognitionMode.map(ele => this.filter(ele, this.select.recognitionMode)).join('，')
          }
          this.deviceList.splice(index, 1, deviceInfo)
          this.$message.success(this.$t('deviceList_refresh_message_success'))
        }
      })
    },
    handleEdit (item) {
      const { deviceGroupId, deviceKey, deviceName } = item
      this.updateDialog.visible = true
      this.updateDialog.form = {
        deviceKey,
        deviceName,
        groupId: deviceGroupId
      }
    },
    handleEnable ({ deviceKey }) {
      this.$confirm(this.$t('deviceList_enable_comfirm_message'), this.$t('deviceList_enable_comfirm_text'), {
        confirmButtonText: this.$t('deviceList_enable_comfirm_button_text'),
        center: true
      }).then(() => {
        const params = {
          deviceKeyList: [deviceKey]
        }
        api.deviceEnable(params).then(res => {
          if (res.success) {
            this.failList = res.data.filter(ele => !ele.success)
            if (this.failList.length) {
              this.$message.success(this.failList[0].reason)
            } else {
              this.$message.success(this.$t('deviceList_enable_comfirm_success'))
            }
            this.handleQuery()
          }
        })
      }, () => {})
    },
    handleDeleteDialogShow ({ deviceKey }) {
      this.deleteDevice.deviceKey = deviceKey
      this.dialog.deleteVisible = true
      this.deleteDevice.clearDevice = ''
    },
    handleDelete () {
      if (this.deleteDevice.clearDevice === '') {
        this.$message.warning(this.$t('deviceList_delete_message_warn'))
        return
      }
      const params = {
        deviceKeyList: [this.deleteDevice.deviceKey],
        clearDevice: this.deleteDevice.clearDevice
      }
      api.deleteDevice(params).then(res => {
        if (res.success) {
          this.failList = res.data.filter(ele => !ele.success)
          if (this.failList.length) {
            this.$message.error(this.failList[0].reason)
          } else {
            this.$message.success(this.$t('deviceList_delete_response_success'))
          }
          this.dialog.deleteVisible = false
          this.handleQuery()
        }
      })
    },
    handelUpdateSubmit () {
      const { deviceKey } = this.updateDialog.form
      api['deviceUpdate'](deviceKey, this.updateDialog.form).then(res => {
        if (res.success) {
          this.$message.success(this.$t('deviceList_update_success'))
          this.updateDialog.visible = false
          this.handleQuery()
        }
      })
    },
    filter (val, select) {
      if (!val && val !== 0) return
      return select.find(ele => ele.value === val).label
    },
    getDeviceGroupAll () {
      fetchDeviceGroupAll().then(res => {
        if (res.success) {
          this.select.deviceGroup = res.data
        }
      })
    },
    handelMore ({ deviceIp, devicePass }) {
      const encryptPwd = (e) => {
        let a = ''
        for (let s in e) a += s % 2 ? (e.charCodeAt(s) << 2).toString() + '*' : (e.charCodeAt(s) << 3).toString() + '*'
        return a.slice(0, a.length - 1)
      }
      const pass = encryptPwd(devicePass)
      window.open(`http://${deviceIp}:8090/#/login?pass=${pass}`)
    },

    // 获取所有设备组
    getAllGroup () {
      fetchDeviceGroupAll().then(res => {
        if (res.success) {
          this.updateDialog.deviceGroupList = res.data
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
  }
}
.choose__item{
  width: 50%;
  margin: 40px 0;
  display: inline-block;
  text-align: center;
  .iconfont{
    color: #208ef2;
    font-size: 70px;
    cursor: pointer;
  }
  .tip{
    color: #909399;
    line-height: 30px;
  }
}
.delete__dialog/deep/{
  .el-dialog__header{
    border: none;
  }
  .el-dialog__body{
    margin-top: -30px;
  }
  .delete__dialog--title{
    font-size: 16px;
    text-align: center;
    margin-top: -25px;
  }
  .el-radio{
    margin: 20px 0 0 30px;
  }
  .el-button--primary{
    background: #F95359;
    border: 1px solid #F95359;
  }
  .el-radio__label{
    color: #303133;
  }
}
.point{
  line-height: 20px;
  span{
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
}
.form-item-showPass-wrap{
  margin-bottom: 15px;
}
.form-item__showPass{
  cursor: pointer;
  display: inline-block;
  .iconfont{
    font-size: 12px;
    color: #909399;
  }
}
</style>
