<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>批量操作
      </span>
    </div>

    <div class="page__content">
      <div class="page__content--left">
        <p>选择设备</p>
        <el-scrollbar class="scroll--y">
          <div class="pr10">
            <el-input
              class="mb5"
              placeholder="搜索"
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
                    content="离线"
                    placement="right"
                    :enterable="false"
                    :open-delay="500">
                    <i
                      class="iconfont icon-Offline f-red"
                      v-if="data.expType === 1">
                    </i>
                  </el-tooltip>
                  <el-tooltip
                    content="禁用"
                    placement="right"
                    :enterable="false"
                    :open-delay="500">
                    <i
                      class="iconfont icon-Disable f-red"
                      v-if="data.expType === 2">
                    </i>
                  </el-tooltip>
                  <el-tooltip
                    content="密码错误"
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
        <p>已选设备
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
        <p class="pl10">操作选项</p>
        <el-scrollbar class="scroll--y">
          <el-radio-group class="pr10 pl10" v-model="operateType">
            <el-radio :label="1">重启</el-radio>
            <el-radio :label="2">重置</el-radio>
            <el-radio :label="3">禁用</el-radio>
            <el-radio :label="4">启用</el-radio>
            <el-radio :label="10">设备校时</el-radio>
            <el-radio :label="5">设备配置</el-radio>
            <el-radio :label="6">网络配置</el-radio>
            <el-radio :label="7">固件升级</el-radio>
            <el-radio :label="8">修改密码</el-radio>
            <el-radio :label="9">批量删除</el-radio>
          </el-radio-group>
        </el-scrollbar>
      </div>

      <div class="w100 ac mt30 pt20">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="handleOperate()">操作</el-button>
      </div>
    </div>

    <el-dialog
      :visible.sync="dialog.resetVisible"
      class="reset__dialog"
      width="400px">
      <div class="pl30 pr30">
        <p class="reset__dialog--title">设备重置</p>
        <p>
          <el-radio v-model="resetType" :label="true">
            清空数据但保留设备配置
          </el-radio>
        </p>
        <p>
          <el-radio v-model="resetType" :label="false">
            恢复出厂设置
          </el-radio>
        </p>
        <p class="reset__tip">提示：需重新设置设备密码</p>
        <div class="ac pt30">
          <el-button @click="dialog.resetVisible = false">取消</el-button>
          <el-button type="primary" @click="deviceReset()">重置</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialog.deleteVisible"
      class="reset__dialog"
      width="400px">
      <div class="pl30 pr30">
        <p class="reset__dialog--title">删除设备</p>
        <p>
          <el-radio v-model="deleteType" :label="true">
            同时删除系统和设备上的数据
          </el-radio>
        </p>
        <p>
          <el-radio v-model="deleteType" :label="false">
            删除系统数据，保留设备上的数据
          </el-radio>
        </p>
        <div class="ac pt30">
          <el-button @click="dialog.deleteVisible = false">取消</el-button>
          <el-button type="primary" @click="deviceBatchDel()">删除</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      :title="failTitle"
      :visible.sync="dialog.failVisible"
      width="860px">
      <div>
        <el-table class="table__fail" :data="failList" :height="300">
          <el-table-column prop="deviceName" label="设备名称" min-width="80"></el-table-column>
          <el-table-column prop="deviceKey" label="设备序列号" min-width="80"></el-table-column>
          <el-table-column prop="reason" label="失败原因" min-width="200">
            <template slot-scope="scope">
              <span class="f-red">{{ scope.row.reason }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog
      title="修改密码"
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
          <el-form-item label="输入Admin密码" prop="adminPass">
            <el-input
              v-model="pswForm.adminPass"
              placeholder=""
              clearable
              show-password>
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input
              v-model="pswForm.newPass"
              placeholder=""
              clearable
              show-password>
            </el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop="confirmPass">
            <el-input
              v-model="pswForm.confirmPass"
              placeholder=""
              clearable
              show-password>
            </el-input>
          </el-form-item>
          <div class="ac pt10">
            <el-button @click="dialog.pswVisible = false">取消</el-button>
            <el-button type="primary" @click="deviceSetPsw()">修改</el-button>
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
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        confirmPass: [
          { validator: psw2Validate, trigger: 'blur' }
        ]
      },
      treeProps: {
        children: 'children',
        label: 'deviceName',
        disabled: (data) => {
          return !!data.expType
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
          return '重启失败设备'
        case 2:
          return '重置失败设备'
        case 3:
          return '禁用失败设备'
        case 4:
          return '启用失败设备'
        case 8:
          return '修改密码失败设备'
        case 9:
          return '删除失败设备'
        default:
          return '重启失败设备'
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
          let tree = [{ deviceName: '全部', id: 'all', children: [] }]
          deviceGroupIds.forEach(id => {
            if (id) {
              const devices = list.filter(ele => ele.deviceGroupId === id)
              tree[0].children.push({ deviceName: devices[0].deviceGroup, id: `group-${id}`, children: devices })
            } else {
              const devices = list.filter(ele => !ele.deviceGroupId)
              tree[0].children.push({ deviceName: '未分组', id: 'noGroup', children: devices })
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
        this.$message.warning('请先选择设备！')
        return
      }
      if (!this.operateType) {
        this.$message.warning('请先选择操作选项！')
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
      this.$confirm('设备将会终止当前任务进入重启，是否确认进入重启', '设备重启', {
        confirmButtonText: '重启',
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
              this.$message.success('设备重启成功！')
            }
          }
        })
      }, () => {})
    },
    deviceDisabled () {
      this.$confirm(`
        <p>设备禁用后，将无法使用</p>
        <p>禁用后，您可以点击启用重新使用设备</p>`, '设备禁用', {
        customClass: 'delete__box--confirm',
        dangerouslyUseHTMLString: true,
        confirmButtonText: '禁用',
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
              this.$message.success('设备禁用成功！')
            }
          }
        })
      }, () => {})
    },
    deviceEnable () {
      this.$confirm('设备启用后，将会正常运行', '设备启用', {
        confirmButtonText: '启用',
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
              this.$message.success('设备启用成功！')
            }
          }
        })
      }, () => {})
    },
    deviceReset () {
      if (this.resetType === '') {
        this.$message.warning('请选择重置方式！')
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
            this.$message.success('设备重置成功！')
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
                this.$message.success('设备修改密码成功！')
              }
            }
          })
        }
      })
    },
    deviceBatchDel () {
      if (this.deleteType === '') {
        this.$message.warning('请选择删除方式！')
        return
      }
      const params = {
        deviceKeyList: JSON.stringify(this.checkList.map(ele => ele.deviceKey)),
        clearDevice: this.deleteType
      }
      api.deleteDevice(params).then(res => {
        if (res.success) {
          this.getDeviceList()
          this.failList = res.data.filter(ele => !ele.success)
          if (this.failList.length) {
            this.dialog.failVisible = true
          } else {
            this.$message.success('设备删除成功！')
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
