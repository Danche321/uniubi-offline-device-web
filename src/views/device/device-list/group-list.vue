<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">设备组</span>
      <div class="page__header--btn">
        <el-button size="small" @click="handleDelete(1)">批量删除</el-button>
        <el-button type="primary" size="small" @click="handleAdd()">添加组</el-button>
      </div>
    </div>
    <div class="page__content">
      <el-table :data="listData" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="46" :selectable="rowSelectable"></el-table-column>
        <el-table-column prop="groupName" label="设备组"></el-table-column>
        <el-table-column prop="deviceNum" label="设备数">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="top" :disabled="!scope.row.deviceNum">
              <span class="f-blue" :class="{'f-pointer--light': scope.row.deviceNum}" @click="handleDeviceNum(scope.row)">{{scope.row.deviceNum||0}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" class-name="table__icon--btn">
          <template slot-scope="scope" v-if="!scope.row.defaultGroup">
            <el-tooltip content="编辑" placement="bottom">
              <i class="iconfont icon-edit" @click="handleAdd(scope.row)"></i>
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom">
              <i
                class="iconfont icon-delete"
                @click="handleDelete(0, scope.row.id)"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        :handleQueryFun="handleSearch"
        :pageParams="pageParams"
      ></m-pagination>
    </div>
    <el-dialog
      title="设备"
      :visible.sync="dialog.visible"
      width="520px"
    >
      <el-table :data="deviceList" height="60vh">
        <el-table-column prop="deviceName" label="设备名称"></el-table-column>
        <el-table-column prop="deviceKey" label="设备序列号"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { fetchDeviceGroupList } from '@/api/common'
import { deviceList, deleteDeviceGroup } from '@/api/device/device'
export default {
  name: 'group-list',
  data () {
    return {
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      listData: [],
      dialog: {
        visible: false
      },
      deviceList: [],
      checkList: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    rowSelectable (row) {
      return !row.defaultGroup
    },
    getList () {
      fetchDeviceGroupList().then(res => {
        if (res.success) {
          const { list, total } = res.data
          this.listData = list
          this.pageParams.total = total
        }
      })
    },
    // 编辑/添加
    handleAdd (item) {
      if (item) {
        const { id, groupName, remark } = item
        this.$router.push({
          path: `/device/group-add/${id}`,
          query: {
            groupName,
            remark
          }
        })
      } else {
        this.$router.push('/device/group-add')
      }
    },
    // 删除
    handleDelete (type, id) {
      if (type === 1 && !this.checkList.length) { // 批量删除
        return this.$message.error('请选择要删除的设备')
      }
      this.$confirm('删除设备组后，设备组下的设备将进入未分组', '删除设备组', {
        customClass: 'delete__box--confirm',
        confirmButtonText: '删除',
        center: true
      }).then(() => {
        let groupId
        if (type === 1) { // 批量删除
          groupId = this.checkList.map(item => item.id)
        } else {
          groupId = [id]
        }
        const params = {
          groupIds: groupId
        }
        deleteDeviceGroup(params).then(res => {
          if (res.success) {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      }, () => {})
    },
    // 查看设备数
    handleDeviceNum (item) {
      const { id, deviceNum } = item
      if (!deviceNum) return false
      this.getDeviceList(id).then(() => {
        this.dialog.visible = true
      })
    },
    handleSearch (firstPage) {
      if (firstPage) this.pageParams.pageNum = 1
      this.getList()
    },
    handleSelectionChange (val) {
      this.checkList = val
    },
    // 获取分组下的设备列表
    getDeviceList (groupId) {
      const params = {
        pageNum: -1,
        pageSize: 10,
        deviceGroup: groupId
      }
      return new Promise((resolve, reject) => {
        deviceList(params).then(res => {
          if (res.success) {
            this.deviceList = res.data.list
            resolve()
          } else {
            reject(res.msg)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/{
    thead th{
      border-top: none !important;
    }
  }
</style>
