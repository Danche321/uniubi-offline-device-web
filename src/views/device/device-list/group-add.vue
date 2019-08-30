<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title" @click="$router.back()"
        ><i class="iconfont icon-retreat"></i
        >{{ groupId ? $t('group_add.editTitle') : $t('group_add.addTitle') }}</span
      >
    </div>
    <div class="page__content">
      <div class="page__content--form">
        <el-form ref="form" :model="form" class="from" :rules="rules">
          <el-form-item :label="$t('group_add.form.name')" prop="groupName">
            <el-input v-model="form.groupName"></el-input>
          </el-form-item>
          <el-form-item :label="$t('group_add.form.remark')" prop="remark">
            <el-input
              type="textarea"
              rows="3"
              resize="none"
              v-model.trim="form.remark"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="page__content--device">
        <p>{{$t('group_add.form.device')}}</p>
        <div class="page__content--device__body f-flex-spaceStart-alignStart">
          <el-scrollbar class="scroll--y">
            <div class="pr10">
              <el-input
                class="mb5"
                :placeholder="$t('group_add.form.search')"
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
                      :content="$t('group_add.form.offLine')"
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
                      :content="$t('group_add.form.disabled')"
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
          <el-scrollbar class="scroll--y">
            <div class="pr10">
              <div
                class="device__item"
                v-for="(item, index) in checkList"
                :key="item.id"
              >
                <span>{{ item.deviceName }}</span>
                <i
                  class="iconfont icon-close"
                  @click="handleDelete(index, item.id)"
                ></i>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <div class="w100 al mt30 page__content--bottom">
        <el-button @click="$router.back()">{{$t('common_cancel')}}</el-button>
        <el-button type="primary" @click="handleAdd()">{{
          groupId ? $t('common_save') : $t('common_add')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/device/device'
import { nameRule } from '@/libs/rules'
export default {
  name: 'group-add',
  data () {
    return {
      filterText: '',
      treeProps: {
        children: 'children',
        label: 'deviceName',
        disabled: (data) => {
          return !!data.expType
        }
      },
      dataTree: [],
      checkList: [],
      form: {
        groupName: '',
        remark: ''
      },
      rules: {
        groupName: [
          { required: true, message: this.$t('group_add.message.requiredName'), trigger: 'blur' },
          { validator: nameRule, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    groupId () {
      return this.$route.params.id || null
    }
  },
  async created () {
    if (this.groupId) {
      this.form = {
        groupName: this.$route.query.groupName,
        remark: this.$route.query.remark
      }
      await this.getDeviceOfGroup()
    }
    this.getDeviceList()
  },
  methods: {
    handleAdd () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            deviceKeyList: this.checkList.map(item => item.deviceKey),
            groupName: this.form.groupName,
            remark: this.form.remark
          }
          if (this.groupId) {
            // 编辑
            api['updateDeviceGroup'](this.groupId, params).then(res => {
              if (res.success) {
                this.$message.success(this.$t('group_add.message.updateSuccess'))
                this.$router.back()
              }
            })
          } else {
            api['createDeviceGroup'](params).then(res => {
              if (res.success) {
                this.$message.success(this.$t('group_add.message.addSuccess'))
                this.$router.back()
              }
            })
          }
        }
      })
    },
    getDeviceList () {
      const params = {
        pageNum: -1
      }
      api['deviceList'](params).then(res => {
        if (res.success) {
          const { list } = res.data
          const deviceGroupIds = Array.from(
            new Set(list.map(ele => ele.deviceGroupId))
          )
          let tree = [{ deviceName: this.$t('group_add.all'), id: 'all', children: [] }]
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
              devices.forEach(ele => (ele.disabled = true))
              tree[0].children.push({
                deviceName: this.$t('group_add.outGroup'),
                id: 'noGroup',
                children: devices
              })
            }
            // 编辑的时候勾选树
            if (this.groupId) {
              this.$refs.tree.setCheckedKeys(
                this.checkList.map(item => item.id)
              )
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
      this.checkList.splice(
        this.checkList.findIndex(item => item.deviceKey === id),
        1
      )
    },
    filterTextChange () {
      this.$refs.tree.filter(this.filterText)
    },
    // 获取分组下的设备列表
    getDeviceOfGroup () {
      const params = {
        pageNum: -1,
        deviceGroup: this.groupId
      }
      return new Promise((resolve, reject) => {
        api['deviceList'](params)
          .then(res => {
            if (res.success) {
              this.checkList = res.data.list
              resolve()
            } else {
              reject(res.msg)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page__content {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  .page__content--form {
    width: 300px;
    height: calc(100% - 86px);
    display: inline-block;
  }
  .page__content--device {
    width: 600px;
    height: calc(100% - 86px);
    display: inline-block;
    margin-left: 30px;
  }
  .page__content--device__body {
    width: 100%;
    height: calc(100% - 35px);
    margin-top: 15px;
    .scroll--y {
      padding: 10px 0 10px 10px;
      border: 1px solid #e4e7ed;
      display: inline-block;
      width: 300px;
      box-sizing: border-box;
      &:last-child {
        border-left: none;
      }
    }
  }
}
.el-tree/deep/ {
  .icon-get-into {
    font-size: 12px;
  }
  .el-tree-node__children {
    overflow: visible;
  }
  .el-tree-node__content {
    height: auto;
    position: relative;
    padding: 3px 0;
  }
  .el-checkbox {
    margin-left: 25px;
    position: absolute;
    top: 5px;
  }
  .name {
    margin-left: 25px;
  }
  .node--key {
    padding-top: 3px;
    height: 36px;
    .key {
      margin-left: 25px;
      font-size: 12px;
      color: #909399;
    }
  }
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
</style>
