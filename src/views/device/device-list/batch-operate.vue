<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>{{ $t('batchOperate_page_title') }}
      </span>
    </div>

    <div class="page__content">
      <div class="page__content--left">
        <p>{{ $t('batchOperate_left_title') }}</p>
        <el-scrollbar class="scroll--y">
          <div class="pr10">
            <el-input
              class="mb5"
              :placeholder="$t('batchOperate_left_search')"
              @input="filterTextChange()"
              v-model="filterText"
              prefix-icon="el-icon-search"
              clearable>
            </el-input>
            <el-tree
              ref="tree"
              default-expand-all
              node-key="id"
              :filter-node-method="filterNode"
              icon-class="iconfont icon-get-into"
              :data="dataTree"
              @check-change="handleCheckChange"
              show-checkbox
              :props="treeProps">
              <div slot-scope="{ node, data }" :class="{'node--key': data.deviceKey}">
                <div class="name">
                  {{ data.deviceName }}
                  <el-tooltip
                    :content="$t('batchOperate_left_tree_name_tooltip')"
                    placement="right"
                    :enterable="false"
                    :open-delay="500">
                    <i
                      class="iconfont icon-Offline f-red"
                      v-if="data.expType === 1">
                    </i>
                  </el-tooltip>
                  <el-tooltip
                    :content="$t('batchOperate_left_tree_disable_tooltip')"
                    placement="right"
                    :enterable="false"
                    :open-delay="500">
                    <i
                      class="iconfont icon-Disable f-red"
                      v-if="data.expType === 2">
                    </i>
                  </el-tooltip>
                  <el-tooltip
                    :content="$t('batchOperate_left_tree_password_error_tooltip')"
                    placement="right"
                    :enterable="false"
                    :open-delay="500">
                    <i
                      class="iconfont icon-password f-red"
                      v-if="data.expType === 3">
                    </i>
                  </el-tooltip>
                </div>
                <div class="key">{{ data.deviceKey }}</div>
              </div>
            </el-tree>
          </div>
        </el-scrollbar>
      </div>

      <div class="page__content--center">
        <p>{{ $t('batchOperate_center_title') }}
          <span class="f-blue">
            {{ checkList.length }}/50<!-- {{ allDeviceNum }} -->
          </span>
        </p>
        <el-scrollbar class="scroll--y">
          <div class="pr10">
            <div
              class="device__item"
              v-for="(item, index) in checkList"
              :key="item.id">
              <span>{{ item.deviceName }}</span>
              <i class="iconfont icon-close" @click="handleDelete(index, item.id)"></i>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <div class="page__content--right">
        <p class="pl10">{{ $t('batchOperate_right_title') }}</p>
        <el-scrollbar class="scroll--y">
          <el-radio-group class="pr10 pl10" v-model="operateType">
            <el-radio :label="1" :disabled="this.checkList[0] && this.checkList[0].expType === 2">{{ $t('batchOperate_right_radio_label1') }}</el-radio>
            <el-radio :label="2" :disabled="this.checkList[0] && this.checkList[0].expType === 2">{{ $t('batchOperate_right_radio_label2') }}</el-radio>
            <el-radio :label="3" :disabled="this.checkList[0] && this.checkList[0].expType === 2">{{ $t('batchOperate_right_radio_label3') }}</el-radio>
            <el-radio :label="4" :disabled="this.checkList[0] && !this.checkList[0].expType">{{ $t('batchOperate_right_radio_label4') }}</el-radio>
            <el-radio :label="10" :disabled="this.checkList[0] && this.checkList[0].expType === 2">{{ $t('batchOperate_right_radio_label5') }}</el-radio>
            <el-radio :label="5" :disabled="this.checkList[0] && this.checkList[0].expType === 2">{{ $t('batchOperate_right_radio_label6') }}</el-radio>
            <el-radio :label="6" :disabled="this.checkList[0] && this.checkList[0].expType === 2">{{ $t('batchOperate_right_radio_label7') }}</el-radio>
            <el-radio :label="7" :disabled="this.checkList[0] && this.checkList[0].expType === 2">{{ $t('batchOperate_right_radio_label8') }}</el-radio>
            <el-radio :label="8" :disabled="this.checkList[0] && this.checkList[0].expType === 2">{{ $t('batchOperate_right_radio_label9') }}</el-radio>
            <el-radio :label="9" :disabled="this.checkList[0] && this.checkList[0].expType === 2">{{ $t('batchOperate_right_radio_label10') }}</el-radio>
          </el-radio-group>
          <p class="tip">{{ $t('batchOperate_right_tip') }}</p>
        </el-scrollbar>
      </div>

      <div class="w100 ac mt30 pt20">
        <el-button @click="$router.go(-1)">{{ $t('batchOperate_right_cancel') }}</el-button>
        <el-button type="primary" @click="handleOperate()">{{ $t('batchOperate_right_operate') }}</el-button>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialog.resetVisible"
      class="reset__dialog"
      width="400px">
      <div class="pl30 pr30">
        <p class="reset__dialog--title">{{ $t('batchOperate_dialog_reset_title') }}</p>
        <p>
          <el-radio v-model="resetType" :label="true">
            {{ $t('batchOperate_dialog_reset_radio1') }}
          </el-radio>
        </p>
        <p>
          <el-radio v-model="resetType" :label="false">
             {{ $t('batchOperate_dialog_reset_radio2') }}
          </el-radio>
        </p>
        <p class="reset__tip">{{ $t('batchOperate_dialog_reset_tip') }}</p>
        <div class="ac pt30">
          <el-button @click="dialog.resetVisible = false">{{ $t('batchOperate_dialog_reset_cancel_button') }}</el-button>
          <el-button type="primary" @click="deviceReset()">{{ $t('batchOperate_dialog_reset_reset_button') }}</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog.deleteVisible"
      class="reset__dialog"
      width="400px">
      <div class="pl30 pr30">
        <p class="reset__dialog--title">{{ $t('batchOperate_dialog_delete_title') }}</p>
        <p>
          <el-radio v-model="deleteType" :label="true">
            {{ $t('batchOperate_dialog_delete_radio1') }}
          </el-radio>
        </p>
        <p>
          <el-radio v-model="deleteType" :label="false">
            {{ $t('batchOperate_dialog_delete_radio2') }}
          </el-radio>
        </p>
        <div class="ac pt30">
          <el-button @click="dialog.deleteVisible = false">{{ $t('batchOperate_dialog_delete_cancel_button') }}</el-button>
          <el-button type="primary" @click="deviceBatchDel()">{{ $t('batchOperate_dialog_delete_delete_button') }}</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="failTitle"
      :visible.sync="dialog.failVisible"
      width="860px">
      <div>
        <el-table class="table__fail" :data="failList" :height="300">
          <el-table-column prop="deviceName" :label="$t('batchOperate_dialog_fail_table_deviceName')" min-width="80"></el-table-column>
          <el-table-column prop="deviceKey" :label="$t('batchOperate_dialog_fail_table_deviceKey')" min-width="80"></el-table-column>
          <el-table-column prop="reason" :label="$t('batchOperate_dialog_fail_table_reason')" min-width="200">
            <template slot-scope="scope">
              <span class="f-red">{{ scope.row.reason }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog
      :title="$t('batchOperate_dialog_psw_title')"
      :visible.sync="dialog.pswVisible"
      width="400px">
      <div v-if="dialog.pswVisible">
        <el-form
          class="psw__form"
          :model="pswForm"
          :rules="pswFormRules"
          ref="pswForm"
          :hide-required-asterisk="true"
          label-position="top">
          <div class="none"><input type="password"></div>
          <el-form-item :label="$t('batchOperate_dialog_psw_form_adminPass')" prop="adminPass">
            <el-input
              v-model="pswForm.adminPass"
              placeholder=""
              clearable
              show-password>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('batchOperate_dialog_psw_form_newPass')" prop="newPass">
            <el-input
              v-model="pswForm.newPass"
              placeholder=""
              clearable
              show-password>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('batchOperate_dialog_psw_form_confirmPass')" prop="confirmPass">
            <el-input
              v-model="pswForm.confirmPass"
              placeholder=""
              clearable
              show-password>
            </el-input>
          </el-form-item>
          <div class="ac pt10">
            <el-button @click="dialog.pswVisible = false">{{ $t('batchOperate_dialog_psw_form_cancel_button') }}</el-button>
            <el-button type="primary" @click="deviceSetPsw()">{{ $t('batchOperate_dialog_psw_form_update_button') }}</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from '@/api/device/device'
import * as rules from '@/libs/rules'
import { getSolt } from '@/api/main'
import { hashPassWord } from '@/libs/util'

export default {
  name: 'batchOperate',
  data () {
    const psw2Validate = (rule, value, callback) => {
      rules.passwordAgainRule(rule, value, callback, this.pswForm.newPass)
    }

    return {
      deleteType: '',
      resetType: '',
      operateType: '',
      filterText: '',
      allDeviceNum: 0,
      dialog: {
        resetVisible: false,
        failVisible: false,
        deleteVisible: false,
        pswVisible: false
      },
      pswForm: {
        adminPass: '',
        newPass: '',
        confirmPass: ''
      },
      pswFormRules: {
        adminPass: [
          { validator: rules.passwordRule, trigger: 'blur' }
        ],
        newPass: [
          { required: true, message: this.$t('batchOperate_pswFormRules_newPass_required'), trigger: 'blur' }
        ],
        confirmPass: [
          { validator: psw2Validate, trigger: 'blur' }
        ]
      },
      treeProps: {
        children: 'children',
        label: 'deviceName',
        disabled: (data) => {
          return data.expType === 1 || data.expType === 3
        }
      },
      dataTree: [],
      failList: [],
      checkList: []
    }
  },
  computed: {
    failTitle () {
      switch (this.operateType) {
        case 1:
          return this.$t('batchOperate_computed_failTitle1')
        case 2:
          return this.$t('batchOperate_computed_failTitle2')
        case 3:
          return this.$t('batchOperate_computed_failTitle3')
        case 4:
          return this.$t('batchOperate_computed_failTitle4')
        case 8:
          return this.$t('batchOperate_computed_failTitle8')
        case 9:
          return this.$t('batchOperate_computed_failTitle9')
        default:
          return this.$t('batchOperate_computed_failTitle1')
      }
    }
  },
  created () {
    this.getDeviceList()
  },
  methods: {
    getDeviceList () {
      const params = {
        pageNum: -1
      }
      api.deviceList(params).then(res => {
        if (res.success) {
          const { list } = res.data
          if (!list.length) {
            this.dataTree = []
            return
          }
          const deviceGroupIds = Array.from(new Set(list.map(ele => ele.deviceGroupId)))
          let tree = [{ deviceName: this.$t('batchOperate_methode_getdevicelist_all'), id: 'all', children: [] }]
          deviceGroupIds.forEach(id => {
            if (id) {
              const devices = list.filter(ele => ele.deviceGroupId === id)
              tree[0].children.push({ deviceName: devices[0].deviceGroup, id: `group-${id}`, children: devices })
            } else {
              const devices = list.filter(ele => !ele.deviceGroupId)
              tree[0].children.push({ deviceName: this.$t('batchOperate_methode_getdevicelist_noGroup'), id: 'noGroup', children: devices })
            }
          })
          this.allDeviceNum = list.length
          this.dataTree = tree
        }
      })
    },
    filterNode (value, data) {
      if (!value) return true
      return data.deviceName.indexOf(value) !== -1
    },
    handleCheckChange (data, check) {
      if (this.checkList.length > 50 && check) {
        this.$message.warning(this.$t('batchOperate_methode_handleCheckChange_warning'))
        return
      }
      if (check) {
        if ((this.checkList[0] && this.checkList[0].expType === 2 && !data.expType) ||
            (this.checkList[0] && !this.checkList[0].expType && data.expType === 2)) {
          this.$nextTick(() => {
            this.$refs.tree.setChecked(data.id, false)
          })
          return
        }
        if (data.deviceKey && this.checkList.every(ele => ele.id !== data.id)) {
          this.checkList.push(data)
        }
      } else {
        if (data.deviceKey) {
          this.checkList.forEach((ele, index) => {
            if (ele.id === data.id) {
              this.checkList.splice(index, 1)
            }
          })
        }
      }
    },
    handleDelete (index, id) {
      this.$refs.tree.setChecked(id, false)
      this.checkList.splice(index, 1)
    },
    filterTextChange () {
      this.filterText = this.filterText.trim()
      this.$refs.tree.filter(this.filterText)
    },
    handleOperate () {
      if (!this.checkList.length) {
        this.$message.warning(this.$t('batchOperate_methode_handleOperate_warning1'))
        return
      }
      if (!this.operateType) {
        this.$message.warning(this.$t('batchOperate_methode_handleOperate_warning2'))
        return
      }
      switch (this.operateType) {
        case 1:
          this.deviceReStart() // 重启
          return
        case 2:
          this.resetType = ''
          this.dialog.resetVisible = true // 重置 deviceReset
          return
        case 3:
          this.deviceDisabled() // 禁用
          return
        case 4:
          this.deviceEnable() // 启用
          return
        case 5:
          this.deviceBatchOperate('config') // 设备配置
          return
        case 6:
          this.deviceBatchOperate('wifi') // -网络配置
          return
        case 7:
          this.deviceBatchOperate('upgrade') // 固件升级
          return
        case 8:
          this.pswForm = {
            adminPass: '',
            newPass: '',
            confirmPass: ''
          }
          this.dialog.pswVisible = true // 修改密码 deviceSetPsw
          return
        case 9:
          this.deleteType = ''
          this.dialog.deleteVisible = true // 批量删除 deviceBatchDel
          return
        case 10:
          this.deviceBatchOperate('time') // 设备校时
          return
        default:
          return ''
      }
    },
    deviceReStart () {
      this.$confirm(this.$t('batchOperate_methode_deviceReStart_confirm1'), this.$t('batchOperate_methode_deviceReStart_confirm2'), {
        confirmButtonText: this.$t('batchOperate_methode_deviceReStart_confirm4'),
        center: true
      }).then(() => {
        const params = {
          deviceKeyList: this.checkList.map(ele => ele.deviceKey)
        }
        api.restartDevice(params).then(res => {
          if (res.success) {
            this.getDeviceList()
            this.failList = res.data.filter(ele => !ele.success)
            if (this.failList.length) {
              this.dialog.failVisible = true
            } else {
              this.$message.success(this.$t('batchOperate_methode_deviceReStart_confirm3'))
            }
          }
        })
      }, () => {})
    },
    deviceDisabled () {
      this.$confirm(`
        <p>${this.$t('batchOperate_methode_deviceDisabled_confirm1')}</p>
        <p>${this.$t('batchOperate_methode_deviceDisabled_confirm2')}</p>`, this.$t('batchOperate_methode_deviceDisabled_confirm3'), {
        customClass: 'delete__box--confirm',
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('batchOperate_methode_deviceDisabled_confirm4'),
        center: true
      }).then(() => {
        const params = {
          deviceKeyList: this.checkList.map(ele => ele.deviceKey)
        }
        api.disabledDevice(params).then(res => {
          if (res.success) {
            this.getDeviceList()
            this.failList = res.data.filter(ele => !ele.success)
            if (this.failList.length) {
              this.dialog.failVisible = true
            } else {
              this.$message.success(this.$t('batchOperate_methode_deviceDisabled_confirm5'))
            }
          }
        })
      }, () => {})
    },
    deviceEnable () {
      this.$confirm(this.$t('batchOperate_methode_deviceEnable_confirm1'), this.$t('batchOperate_methode_deviceEnable_confirm2'), {
        confirmButtonText: this.$t('batchOperate_methode_deviceEnable_confirm3'),
        center: true
      }).then(() => {
        const params = {
          deviceKeyList: this.checkList.map(ele => ele.deviceKey)
        }
        api.deviceEnable(params).then(res => {
          if (res.success) {
            this.getDeviceList()
            this.failList = res.data.filter(ele => !ele.success)
            if (this.failList.length) {
              this.dialog.failVisible = true
            } else {
              this.$message.success(this.$t('batchOperate_methode_deviceEnable_confirm4'))
            }
          }
        })
      }, () => {})
    },
    deviceReset () {
      if (this.resetType === '') {
        this.$message.warning(this.$t('batchOperate_methode_deviceReset_warning'))
        return
      }
      const params = {
        deviceKeyList: this.checkList.map(ele => ele.deviceKey),
        clearDevice: this.resetType
      }
      api.resetDevice(params).then(res => {
        if (res.success) {
          this.getDeviceList()
          this.dialog.resetVisible = false
          this.failList = res.data.filter(ele => !ele.success)
          if (this.failList.length) {
            this.dialog.failVisible = true
          } else {
            this.$message.success(this.$t('batchOperate_methode_deviceReset_success'))
          }
        }
      })
    },
    deviceBatchOperate (routeName) {
      sessionStorage.setItem('deviceList', JSON.stringify(this.checkList))
      this.$router.push({
        name: routeName
      })
    },
    deviceSetPsw () {
      this.$refs.pswForm.validate(async (valid) => {
        if (valid) {
          const oldSalt = await this.getOldSalt()
          const params = {
            deviceKeyList: this.checkList.map(ele => ele.deviceKey),
            ...this.pswForm,
            adminPass: hashPassWord(this.pswForm.adminPass, oldSalt)
          }
          api.pswDevice(params).then(res => {
            if (res.success) {
              this.getDeviceList()
              this.dialog.pswVisible = false
              this.failList = res.data.filter(ele => !ele.success)
              if (this.failList.length) {
                this.dialog.failVisible = true
              } else {
                this.$message.success(this.$t('batchOperate_methode_deviceSetPsw_success'))
              }
            }
          })
        }
      })
    },
    deviceBatchDel () {
      if (this.deleteType === '') {
        this.$message.warning(this.$t('batchOperate_methode_deviceBatchDel_warning'))
        return
      }
      const params = {
        deviceKeyList: this.checkList.map(ele => ele.deviceKey),
        clearDevice: this.deleteType
      }
      api.deleteDevice(params).then(res => {
        if (res.success) {
          this.getDeviceList()
          this.failList = res.data.filter(ele => !ele.success)
          if (this.failList.length) {
            this.dialog.failVisible = true
          } else {
            this.$message.success(this.$t('batchOperate_methode_deviceBatchDel_success'))
          }
        }
      })
    },
    getOldSalt () {
      return new Promise((resolve, reject) => {
        getSolt(this.$store.state.username).then(res => {
          if (res.success) {
            resolve(res.data)
          }
        })
      })
    }
  },
  watch: {
    'checkList.length' (val) {
      if (this.checkList[0] && this.checkList[0].expType === 2 && this.operateType !== 4) {
        this.operateType = ''
      }
      if (this.checkList[0] && !this.checkList[0].expType && this.operateType === 4) {
        this.operateType = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page__content{
  flex-direction: row;
  flex-wrap: wrap;
  .scroll--y{
    height: 100%;
    padding: 10px 0 10px 10px;
    margin-top: 5px;
    border: 1px solid #e4e7ed;
  }
  .page__content--left{
    width: 300px;
    height: calc(100% - 130px);
    display: inline-block;
  }
  .page__content--center{
    width: 400px;
    height: calc(100% - 130px);
    display: inline-block;
    margin-left: 30px;
  }
  .page__content--right{
    flex-grow: 1;
    height: calc(100% - 130px);
    margin-left: 20px;
    .scroll--y{
      border: none;
      padding: 0;
    }
    .tip{
      color: #909399;
      font-size: 12px;
      margin: 20px 0 0 12px;
    }
  }
}
.device__item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  padding: 0 10px;
  border-bottom: 1px solid #e4e7ed;
  .iconfont{
    cursor: pointer;
    font-size: 12px;
    color: #c0c4cc;
  }
}
.el-radio-group{
  .el-radio{
    display: block;
    margin-top: 12px;
  }
}
.reset__dialog/deep/{
  .el-dialog__header{
    border: none;
  }
  .el-dialog__body{
    margin-top: -30px;
  }
  .reset__dialog--title{
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
  .reset__tip{
    color: #909399;
    padding: 10px 0 0 50px;
  }
}
.el-tree/deep/{
  .icon-get-into{
    font-size: 12px;
  }
  .el-tree-node__children{
    overflow: visible;
  }
  .el-tree-node__content{
    height: auto;
    position: relative;
    padding: 3px 0;
  }
  .el-checkbox{
    margin-left: 25px;
    position: absolute;
    top: 5px;
  }
  .name{
    margin-left: 25px;
  }
  .node--key{
    padding-top: 3px;
    height: 36px;
    .key{
      margin-left: 25px;
      font-size: 12px;
      color: #909399;
    }
  }
}
.psw__form/deep/{
  .el-form-item__label{
    height: 24px;
    line-height: 20px;
  }
  .none{
    width: 0;
    height: 0;
    overflow: hidden;
  }
}
.table__fail/deep/{
  tr>th{
    border-top: none;
  }
}
</style>
