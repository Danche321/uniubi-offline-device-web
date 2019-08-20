<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">员工授权</span>
      <div class="page__header--btn">
        <el-button size="small" @click="handleCancelBatch">批量销权</el-button>
        <el-button
          type="primary"
          size="small"
          @click="$router.push({ name: 'authCreate' })"
          >新增授权</el-button
        >
      </div>
    </div>

    <div class="page__content">
      <expand-form
        :expand.sync="filterOption.showMore"
        :expandBtn.sync="filterOption.showExpandBtn"
        :left.sync="filterOption.leftNum"
      >
        <el-form
          ref="filterForm"
          class="page__content--filter"
          :class="{ 'filter--reduce': !filterOption.showMore }"
          label-position="top"
          :inline="true"
          :model="searchParams"
          @keyup.enter.native="handleQuery('firstPage')"
        >
          <el-form-item label="部门">
            <dep-tree-select
              v-leftClear
              v-model="searchParams.departmentId"
            ></dep-tree-select>
          </el-form-item>
          <el-form-item label="人员">
            <emp-tree-select
              v-leftClear
              v-model="searchParams.empId"
            ></emp-tree-select>
          </el-form-item>
          <el-form-item label="设备组">
            <el-select v-model="searchParams.deviceGroup" filterable clearable v-leftClear>
              <el-option
                v-for="item in deviceGroupList"
                :key="item.id"
                :label="item.groupName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input
              v-model.trim="searchParams.deviceName"
              maxlength="32"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="员工编号">
            <el-input
              v-model.trim="searchParams.empNo"
              maxlength="32"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="卡号">
            <el-input
              v-model.trim="searchParams.cardNum"
              maxlength="32"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="设备序列号">
            <el-input
              v-model.trim="searchParams.deviceKey"
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
              <el-button icon="iconfont icon-search" @click="handleQuery('firstPage')"
                >查询</el-button
              >
            </el-form-item>
            <el-form-item class="btn__expand">
              <span @click="filterOption.showMore = !filterOption.showMore" v-if="filterOption.showExpandBtn">
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

      <el-table
        :data="listData"
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="46"></el-table-column>
        <el-table-column prop="faces" label="照片" min-width="120">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.faces"
              :key="index"
              class="m-column-photo"
            >
              <img class="avatar" :src="`${baseUrl}/file/face/${item.faceId}`" alt="头像" />
              <el-tooltip
                :content="item.failedReason"
                placement="right"
                :disabled="item.status !== 3"
              >
                <i class="iconfont" :class="item.status | matchIcon"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.employee.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="empNo" label="员工编号" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.employee.empNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cardNo" label="卡号">
          <template slot-scope="scope">
            <span>{{scope.row.employee.cardNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="授权设备">
          <template slot-scope="scope">
            <span>{{ scope.row.device.deviceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备序列号" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.device.deviceKey }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备组">
          <template slot-scope="scope">
            <span>{{ scope.row.device.deviceGroup }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="table__icon--btn">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="bottom">
              <i
                class="iconfont icon-View"
                @click="handleDetail(scope.row)"
              ></i>
            </el-tooltip>
            <el-button type="text" @click="handleCancel(scope.row)"
              >销权</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <m-pagination :handleQueryFun="handleQuery" :pageParams="pageParams">
        <div>
          <el-button
            class="btn--blue"
            size="small"
            @click="$router.push({ name: 'authHistory' })"
            >历史授权记录</el-button
          >
        </div>
      </m-pagination>
    </div>
    <el-dialog
      v-if="detailDialog.visible"
      title="授权详情"
      :visible.sync="detailDialog.visible"
      width="400px"
      center
    >
      <div class="dialog-detail-box">
        <section class="border-bottom pb20">
          <p>
            <span class="label">姓名：</span>
            <span class="content">{{ detailDialog.data.employee.name }}</span>
          </p>
          <p>
            <span class="label">人员编号：</span>
            <span class="content">{{ detailDialog.data.empNo }}</span>
          </p>
          <div class="mt10">
            <span class="label label-photo">照片：</span>
            <ul class="photo-list">
              <li
                v-for="(item, index) in detailDialog.data.faces"
                :key="index"
                class="m-photo80"
              >
                <img class="avatar" :src="`${baseUrl}/file/face/${item.faceId}`" alt="头像" />
                <el-tooltip
                  :content="item.failedReason"
                  placement="right"
                  :disabled="item.status !== 3"
                >
                  <i class="iconfont" :class="item.status | matchIcon"></i>
                </el-tooltip>
              </li>
            </ul>
          </div>
        </section>
        <section class="pt20">
          <div>
            <span class="label">设备名称：</span>
            <span class="content">{{ detailDialog.data.device.deviceName }}</span>
          </div>
          <div>
            <span class="label">设备序列号：</span>
            <span class="content">{{ detailDialog.data.device.deviceKey }}</span>
          </div>
          <div>
            <span class="label">设备组：</span>
            <span class="content">{{ detailDialog.data.device.deviceGroup }}</span>
          </div>
          <div>
            <span class="label">版本兼容性：</span>
            <span class="content">{{detailDialog.data.device.versionCompatibility?'兼容':'不兼容'}}</span>
          </div>
          <div>
            <span class="label">有无注册照：</span>
            <span class="content">{{detailDialog.data.faces?'有':'无'}}</span>
          </div>
          <div>
            <span class="label">识别模式：</span>
            <span class="content">{{detailDialog.data.device.recognitionModel||'-'}}</span>
          </div>
          <div>
            <span class="label">网络状态：</span>
            <span class="content">{{detailDialog.data.device.status===1?'在线':'离线'}}</span>
          </div>
          <div>
            <span class="label">权限有效期：</span>
            <span class="content" v-if="detailDialog.data.permissionTime">{{ detailDialog.data.permissionTime.permissionTimeEntries.startTime }} ~{{ detailDialog.data.permissionTime.permissionTimeEntries.endTime }}</span>
            <span v-else>-</span>
          </div>
          <div class="f-flex-spaceStart-alignStart">
            <span class="label">准入时间：</span>
            <div v-if="detailDialog.data.permissionTime.permissionTimeEntries.length" class="content">
              <p v-for="(item, index) in detailDialog.data.permissionTime.permissionTimeEntries" :key="index">
                {{item.startTime}} ~ {{item.endTime}}
              </p>
            </div>
            <span v-else>-</span>
          </div>
          <div>
            <span class="label">授权时间：</span>
            <span class="content">{{detailDialog.data.createTime}}</span>
          </div>
        </section>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchEmployeeAuth,
  cancelAuth,
  cancelAuthBatch
} from '@/api/authorize'
import { EmpTreeSelect, DepTreeSelect } from '@/components/tree-select'
import { fetchDeviceGroupAll } from '@/api/common'
export default {
  name: 'employee',
  components: {
    EmpTreeSelect,
    DepTreeSelect
  },
  data () {
    return {
      filterOption: {
        leftNum: 0,
        showExpandBtn: false,
        showMore: false
      },
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      chooseTimes: '',
      searchParams: {
        departmentId: '',
        empId: '',
        empNo: '',
        cardNum: '',
        deviceGroup: '',
        deviceKey: '',
        deviceName: ''
      },
      listData: [],
      detailDialog: {
        visible: false,
        data: null
      },
      deviceGroupList: [],
      checkList: []
    }
  },
  filters: {
    matchIcon (status) {
      switch (status) {
        case 1:
          return 'icon-caveat'
        case 2:
          return 'icon-success'
        case 3:
          return 'icon-failure'
      }
    }
  },
  created () {
    this.getAllGroup()
    this.getList()
  },
  methods: {
    // 批量销权
    handleCancelBatch () {
      if (!this.checkList.length) {
        this.$confirm('请先选择员工', '提示', {
          showCancelButton: false,
          center: true
        }).then(() => {}, () => {})
      } else {
        this.$confirm('销权后人员将不会被该设备识别', '销权', {
          customClass: 'delete__box--confirm',
          confirmButtonText: '销权',
          center: true
        }).then(
          () => {
            const params = {
              authIds: this.checkList.map(item => item.authId)
            }
            cancelAuthBatch(params).then(res => {
              if (res.success) {
                this.$message.success('操作成功')
                this.getList()
              }
            })
          },
          () => {}
        )
      }
    },
    // 获取所有设备组
    getAllGroup () {
      fetchDeviceGroupAll().then(res => {
        if (res.success) {
          this.deviceGroupList = res.data
        }
      })
    },
    handleSelectionChange (val) {
      this.checkList = val
    },
    // 查看详情
    handleDetail (item) {
      this.detailDialog.visible = true
      this.detailDialog.data = item
    },
    // 销权
    handleCancel (item) {
      const { authId } = item
      this.$confirm('销权后人员将不会被该设备识别', '销权', {
        customClass: 'delete__box--confirm',
        confirmButtonText: '销权',
        center: true
      }).then(
        () => {
          cancelAuth(authId).then(res => {
            if (res.success) {
              this.$message.success('操作成功')
              this.getList()
            }
          })
        },
        () => {}
      )
    },
    handleQuery (firstPage) {
      if (firstPage) {
        this.pageParams.pageNum = 1
        this.getList()
      }
    },
    getList () {
      const params = {
        ...this.searchParams,
        ...this.pageParams
      }
      fetchEmployeeAuth(params).then(res => {
        if (res.success) {
          const { list, total } = res.data
          this.listData = list
          this.pageParams.total = total
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.m-column-photo {
  display: inline-block;
  margin-right: 10px;
  position: relative;
  .avatar {
    width: 40px;
    height: 40px;
  }
  .iconfont {
    position: absolute;
    right: 6px;
    bottom: 5px;
    border-radius: 50%;
    font-size: 16px;
    background-color: #fff;
    width: 12px;
    height: 12px;
    &:before {
      right: 1px;
      position: absolute;
      width: 12px;
      height: 12px;
      line-height: 14px;
    }
  }
  .icon-success {
    color: #3fc948;
  }
  .icon-failure {
    color: #ff002e;
  }
  .icon-caveat {
    color: #faad14;
  }
}
.m-photo80 {
  display: inline-block;
  margin-right: 10px;
  position: relative;
  .avatar {
    width: 80px;
    height: 80px;
  }
  .iconfont {
    position: absolute;
    right: 10px;
    bottom: 10px;
    border-radius: 50%;
    font-size: 19px;
    background-color: #fff;
    width: 15px;
    height: 15px;
    &:before {
      position: absolute;
      width: 16px;
      height: 16px;
      line-height: 16px;
      right: 1px;
    }
  }
  .icon-success {
    color: #3fc948;
  }
  .icon-failure {
    color: #ff002e;
  }
  .icon-caveat {
    color: #faad14;
  }
}
.dialog-detail-box {
  line-height: 28px;
  padding: 0 5px;
  .border-bottom {
    border-bottom: 1px solid #e4e7ed;
  }
  .label {
    color: #939497;
  }
  .label-photo {
    line-height: 1;
    vertical-align: top;
  }
  .content {
    color: #303133;
  }
  .photo-list {
    display: inline-block;
  }
}
</style>
