<template>
  <div class="page__content">
    <div class="page__content--left">
      <p>{{$t('authorize_create_device_select_title')}}</p>
      <el-scrollbar class="scroll--y">
        <div class="pr10">
          <el-input
            class="mb5"
            :placeholder="$t('authorize_create_device_select_search_input_placeholder')"
            @input="filterTextChange()"
            v-model="filterText"
            prefix-icon="el-icon-search"
            clearable
          ></el-input>
          <el-tree
            ref="tree"
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            icon-class="iconfont icon-get-into"
            :data="dataTree"
            @check-change="handleCheckChange"
            show-checkbox
            :props="treeProps"
          >
            <div
              slot-scope="{ node, data }"
              :class="{ 'node--key': data.deviceKey }"
            >
              <div class="name">
                {{ data.deviceName }}
                <el-tooltip
                  :content="$t('authorize_create_device_offline_tooltip')"
                  placement="right"
                  :enterable="false"
                  :open-delay="500"
                >
                  <i
                    class="iconfont icon-Offline f-red"
                    v-if="data.expType === 1">
                  </i>
                </el-tooltip>
                <el-tooltip
                  :content="$t('authorize_create_device_disabled_tooltip')"
                  placement="right"
                  :enterable="false"
                  :open-delay="500"
                >
                  <i
                    class="iconfont icon-Disable f-red"
                    v-if="data.expType === 2">
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
      <p>
        {{$t('authorize_create_device_authorization_title')}}
        <el-tooltip
          effect="dark"
          :content="$t('authorize_create_device_authorization_tooltip')"
          placement="top"
        >
          <i class="iconfont icon-remind"></i>
        </el-tooltip>
      </p>
      <div class="scroll--y">
        <p class="sub-title">
          {{$t('authorize_create_device_authorization_content_true_header')}}<span class="f-blue ml10">{{ compatibleList.length }}</span>
        </p>
        <el-scrollbar>
          <div
            class="device__item"
            v-for="(item, index) in compatibleList"
            :key="index"
          >
            <span>{{ item.deviceName }}</span>
            <i
              class="iconfont icon-close"
              @click="handleDelete(index, item.deviceKey, 1)"
            ></i>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <div class="page__content--right">
      <div class="scroll--y">
        <p class="sub-title">
          {{$t('authorize_create_device_authorization_content_false_header')}}<span class="f-blue ml10">{{
            incompatibleList.length
          }}</span>
        </p>
        <el-scrollbar>
          <div
            class="device__item"
            v-for="(item, index) in incompatibleList"
            :key="index"
          >
            <span>{{ item.deviceName }}</span>
            <i
              class="iconfont icon-close"
              @click="handleDelete(index, item.id, 0)"
            ></i>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <div class="w100 ac mt30 pt20 page__content--bottom">
      <el-button @click="$emit('deviceCancel')">{{$t('authorize_create_device_authorization_prev')}}</el-button>
      <el-button type="primary" @click="handleAuth()">{{$t('authorize_create_device_authorization_submit')}}</el-button>
    </div>

    <div
      v-if="inAuth && !authDialog.visible"
      class="notification f-flex-space-between"
    >
      <span>{{
        authDialog.status === 1 ? `${$t('authorize_create_device_authorization_dialog_title')}${authDialog.percent}` : $t('authorize_create_device_authorization_dialog_title_finish')
      }}</span>
      <div>
        <i
          class="iconfont icon-maximize"
          @click="authDialog.visible = true"
        ></i>
        <i class="iconfont icon-close ml10" @click="handleAuthClose"></i>
      </div>
    </div>
    <el-dialog
      :visible.sync="authDialog.visible"
      width="660px"
      class="dialog-auth"
      :show-close="false"
    >
      <div slot="title" class="slot-header">
        <span>{{ authDialog.status === 1 ? $t('authorize_create_device_authorization_authDialog_title') : $t('authorize_create_device_authorization_authDialog_title_finish') }}</span>
        <div class="icon-warp">
          <el-tooltip
            effect="dark"
            :content="$t('authorize_create_device_authorization_authDialog_small_tooltip')"
            placement="top"
            :enterable="false"
          >
            <i class="iconfont icon-minimize mr20" @click="handleMinimize"></i>
          </el-tooltip>
          <el-tooltip
            effect="dark"
            :content="$t('authorize_create_device_authorization_authDialog_close_tooltip')"
            placement="top"
            :enterable="false"
          >
            <i class="iconfont icon-close" @click="handleAuthClose"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="f-flex-spaceBetween-alignCenter">
        <i v-if="authDialog.status === 1" class="iconfont icon-load"></i>
        <i v-else class="iconfont icon-success"></i>
        <div class="progress">
          <p v-if="authDialog.status === 1" class="progress__text">
            {{$t('authorize_create_device_authorization_authDialog_manyData')}}
          </p>
          <p v-else class="progress__text">
            {{$t('authorize_create_device_authorization_authDialog_finish_device')}}{{ authDialog.successNum.device }}{{$t('authorize_create_device_authorization_authDialog_finish_device_unit')}}{{$t('authorize_create_device_authorization_authDialog_finish_people')}}{{
              authDialog.successNum.employee
            }}{{$t('authorize_create_device_authorization_authDialog_finish_people_unit')}}
          </p>
          <div class="f-flex-spaceBetween-alignCenter">
            <el-progress
              :percentage="authDialog.percent"
              color="#409eff"
              class="progress__bar"
            ></el-progress>
            <el-button
              v-if="authDialog.status === 1"
              class="btn-cancel"
              @click="handleAuthClose"
              >{{$t('authorize_create_device_authorization_authDialog_cancel')}}</el-button
            >
            <el-button
              v-else
              type="primary"
              class="btn-detail"
              @click="$router.push(`/authorize/detail/${operateId}`)"
              >{{$t('authorize_create_device_authorization_authDialog_next')}}</el-button
            >
          </div>
        </div>
      </div>
      <div class="scroll--y dialog-auth__authList">
        <el-scrollbar>
          <div
            v-for="(item, index) in authDialog.failList"
            :key="index"
            class="authList__item"
          >
            <p v-if="item.type === 1">
              <span class="mr20">{{ item.deviceName }}</span>
              <span class="mr20">{{ item.deviceKey }}</span>
              <span class="f-error">{{ item.failedReason }}</span>
            </p>
            <p v-else>
              <span class="mr20">{{ item.empName }}</span>
              <span class="mr20">{{ item.empNo }}</span>
              <span class="mr20">{{ item.deviceName || item.deviceKey }}</span>
              <span class="f-error">{{ item.failedReason }}</span>
            </p>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deviceList } from '@/api/device/device'
import { batchAuth, authDetailProgress } from '@/api/authorize'
export default {
  name: 'employee-create',
  data () {
    return {
      filterText: '',
      allDeviceNum: 0,
      treeProps: {
        children: 'children',
        label: 'deviceName',
        disabled: (data) => {
          return !!data.expType
        }
      },
      dataTree: [],
      checkList: [],
      compatibleList: [],
      incompatibleList: [],
      // 授权弹框
      authDialog: {
        visible: false,
        status: 0, // 1进行中 2已完成
        failList: [],
        percent: 0,
        successNum: {
          device: 0,
          employee: 0
        }
      },
      inAuth: false,
      preStepParams: null,
      operateId: '',
      progressTimer: null
    }
  },
  created () {
    this.getDeviceList()
  },
  methods: {
    getDeviceList () {
      deviceList({ pageNum: -1 }).then(res => {
        if (res.success) {
          const { list } = res.data
          const deviceGroupIds = Array.from(
            new Set(list.map(ele => ele.deviceGroupId))
          )
          let tree = [{ deviceName: this.$t('authorize_create_device_select_all'), id: 'all', children: [] }]
          deviceGroupIds.forEach(id => {
            if (id) {
              const devices = list.filter(ele => ele.deviceGroupId === id)
              tree[0].children.push({
                deviceName: devices[0].deviceGroup,
                id: `group-${id}`,
                children: devices
              })
            } else {
              const devices = list.filter(ele => !ele.deviceGroupId)
              tree[0].children.push({
                deviceName: this.$t('authorize_create_device_select_false'),
                id: 'noGroup',
                children: devices
              })
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
      if (check) {
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
      this.compatibleList = this.checkList.filter(
        item => item.versionCompatibility
      )
      this.incompatibleList = this.checkList.filter(
        item => !item.versionCompatibility
      )
    },
    filterTextChange () {
      this.$refs.tree.filter(this.filterText)
    },
    handleDelete (index, id, type) {
      this.$refs.tree.setChecked(id, false)
      this.checkList.splice(
        this.checkList.findIndex(item => item.deviceKey === id),
        1
      )
      if (type === 1) {
        this.compatibleList.splice(index, 1)
      } else {
        this.incompatibleList.splice(index, 1)
      }
    },
    // 授权
    handleAuth () {
      if (!this.checkList.length) {
        return this.$message.error(this.$t('authorize_create_device_authorization_error_empty'))
      }
      const { form, checkedIds } = this.preStepParams
      const params = {
        ...form,
        ...{ empNoList: checkedIds },
        ...{ deviceKeyList: this.checkList.map(item => item.deviceKey) }
      }
      if (form.stopAuthWhenNotCompatibility) {
        this.$confirm(this.$t('authorize_create_device_authorization_error_version_content'), this.$t('authorize_create_device_authorization_error_version_title'), {
          showCancelButton: false,
          center: true
        }).then(() => {
          this.handleAuthConfirm(params)
        })
      } else {
        this.handleAuthConfirm(params)
      }
    },
    handleAuthConfirm (params) {
      batchAuth(params).then(res => {
        if (res.success) {
          this.operateId = res.data
          this.handleUpdateProgress()
          this.authDialog.visible = true
          this.progressTimer = setInterval(() => {
            this.handleUpdateProgress()
          }, 2000)
        }
      })
    },
    // 关闭授权
    handleAuthClose () {
      this.$confirm('', this.$t('authorize_create_device_close_content'), {
        customClass: 'delete__box--confirm',
        confirmButtonText: this.$t('common_confirm'),
        center: true
      }).then(
        () => {
          this.authDialog.visible = false
          this.inAuth = false
          clearInterval(this.progressTimer)
        },
        () => {}
      )
    },
    // 最小化
    handleMinimize () {
      this.authDialog.visible = false
    },
    // 授权进度
    handleUpdateProgress () {
      authDetailProgress(this.operateId)
        .then(res => {
          if (res.success) {
            const {
              status,
              authOperatorDeviceList,
              finishedPersonNum,
              totalPersonNum
            } = res.data
            const deviceList = Object.values(authOperatorDeviceList)
            let successDevice = 0
            let successEmp = 0
            const failList = []
            deviceList.forEach(device => {
              if (device.status === 3) {
                // 设备授权失败
                failList.push({
                  type: 1, // 1设备 2人员
                  deviceKey: device.deviceKey,
                  deviceName: device.deviceName,
                  failedReason: device.failedReason
                })
              } else {
                successDevice++
              }
              device.authOperatorPersonFaceBOList.forEach(emp => {
                if (emp.status === 3) {
                  // 人员授权失败
                  failList.push({
                    type: 2, // 1设备 2人员
                    empName: emp.empName,
                    empNo: emp.empNo,
                    deviceName: device.deviceName,
                    failedReason: emp.failedReason
                  })
                } else {
                  successEmp++
                }
              })
            })
            this.authDialog.failList = failList
            this.authDialog.percent = parseInt(
              (finishedPersonNum / totalPersonNum) * 100
            )
            this.authDialog.successNum.device = successDevice
            this.authDialog.successNum.employee = successEmp
            this.inAuth = true
            this.authDialog.status = status
            if (status === 2) {
              clearInterval(this.progressTimer)
            }
          } else {
            clearInterval(this.progressTimer)
          }
        })
        .catch(() => {
          clearInterval(this.progressTimer)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .el-form-item__label {
    padding-bottom: 0;
  }
  .el-date-editor--date {
    width: 150px;
    .el-input__inner {
      width: 150px;
    }
  }
}
.el-tag--info {
  background: #f1f4f8;
  border: 1px solid #d5dce6;
  border-radius: 3px;
  line-height: 28px;
  height: 30px;
  color: #303133;
  font-size: 14px;
  margin: 2px;
}
.page__content {
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  position: relative;
  .scroll--y {
    height: 100%;
    padding: 10px 0 10px 10px;
    margin-top: 5px;
    border: 1px solid #e4e7ed;
    .el-scrollbar {
      padding-top: 10px;
      height: calc(100% - 29px);
    }
  }
  .page__content--left {
    width: 300px;
    min-width: 300px;
    height: calc(100% - 130px);
  }
  .page__content--center {
    width: 26vw;
    height: calc(100% - 130px);
    margin-left: 30px;
  }
  .page__content--right {
    width: 26vw;
    height: calc(100% - 130px);
    margin-left: 30px;
    margin-top: 19px;
  }
  .page__content--bottom {
    position: absolute;
    bottom: 34px;
    left: 50%;
    transform: translateX(-50%);
  }
  .icon-remind {
    margin-left: 6px;
    color: #ccc;
  }
  .device__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    padding: 0 10px;
    border-bottom: 1px solid #e4e7ed;
    .iconfont {
      cursor: pointer;
      font-size: 12px;
      color: #c0c4cc;
    }
  }
  .notification {
    background: #208ef2;
    width: 200px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    padding: 0 14px;
    border-radius: 2px;
    position: fixed;
    right: 0;
    bottom: 60px;
    box-sizing: border-box;
    .iconfont {
      cursor: pointer;
    }
  }
}

.dialog-auth {
  /deep/ {
    .el-dialog__body {
      padding: 30px;
    }
  }
  .slot-header {
    position: relative;
    font-size: 20px;
    color: #303133;
    line-height: 60px;
    height: 60px;
    .icon-warp {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .iconfont {
      cursor: pointer;
      color: #c0c4cc;
      width: 30px;
      height: 30px;
      display: inline-block;
      line-height: 30px;
      vertical-align: middle;
    }
  }
  .icon-success {
    font-size: 60px;
    margin-right: 20px;
    color: #3fc948;
  }
  .progress {
    width: 100%;
    .progress__text {
      color: #303133;
    }
    .progress__bar {
      width: 400px;
    }
  }
  .btn-cancel {
    width: 68px;
    height: 36px;
  }
  .btn-detail {
    width: 96px;
    height: 36px;
    border-radius: 2px;
  }
  .dialog-auth__authList {
    height: 156px;
    background: #f1f4f7;
    border-radius: 2px;
    padding: 10px 20px;
    margin-top: 20px;
    box-sizing: border-box;
    .el-scrollbar {
      height: 100%;
    }
    .authList__item {
      line-height: 34px;
      color: #303133;
    }
    .status {
    }
  }
}
.el-tree/deep/ {
  .el-tree-node__content {
    height: auto;
  }
  .node--key {
    padding-top: 10px;
    .key {
      font-size: 12px;
      color: #909399;
    }
  }
}
.icon-Disable,
.icon-Offline {
  color: #ff002e;
  margin-left: 4px;
  font-size: 18px;
}
</style>
