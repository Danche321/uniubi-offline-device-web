<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">{{$t('authorize_list_title_text')}}</span>
      <div class="page__header--btn">
        <el-button size="small" @click="handleCancelBatch">{{$t('authorize_list_title_buttons_revoke')}}</el-button>
        <el-button
          type="primary"
          size="small"
          @click="$router.push({ name: 'authCreate' })"
          >{{$t('authorize_list_title_buttons_create')}}</el-button
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
          <el-form-item :label="$t('authorize_list_search_department_label')">
            <dep-tree-select
              v-leftClear
              v-model="searchParams.departmentId"
            ></dep-tree-select>
          </el-form-item>
          <el-form-item :label="$t('authorize_list_search_emp_label')">
            <emp-tree-select
              v-leftClear
              v-model="searchParams.empId"
            ></emp-tree-select>
          </el-form-item>
          <el-form-item :label="$t('authorize_list_search_deviceGroup_label')">
            <el-select v-model="searchParams.deviceGroup" filterable clearable v-leftClear>
              <el-option
                v-for="item in deviceGroupList"
                :key="item.id"
                :label="item.groupName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('authorize_list_search_deviceName_label')">
            <el-input
              v-model.trim="searchParams.deviceName"
              maxlength="32"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('authorize_list_search_empNo_label')">
            <el-input
              v-model.trim="searchParams.empNo"
              maxlength="32"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('authorize_list_search_cardNum_label')">
            <el-input
              v-model.trim="searchParams.cardNum"
              maxlength="32"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('authorize_list_search_deviceKey_label')">
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
                >{{$t('authorize_list_search_button_text')}}</el-button
              >
            </el-form-item>
            <el-form-item class="btn__expand">
              <span @click="filterOption.showMore = !filterOption.showMore" v-if="filterOption.showExpandBtn">
                {{ filterOption.showMore ? $t('authorize_list_search_close_text') : $t('authorize_list_search_open_text') }}
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
        <el-table-column prop="faces" :label="$t('authorize_list_table_header_faces_label')" min-width="120">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.faces"
              :key="index"
              class="m-column-photo"
            >
              <img class="avatar" :src="`${baseUrl}/file/face/${item.faceId}`" :alt="$t('authorize_list_facesImg_alt')" />
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
        <el-table-column :label="$t('authorize_list_table_header_name_label')">
          <template slot-scope="scope">
            <span>{{ scope.row.employee.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="empNo" :label="$t('authorize_list_table_header_empNo_label')" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.employee.empNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cardNo" :label="$t('authorize_list_table_header_cardNo_label')">
          <template slot-scope="scope">
            <span>{{scope.row.employee.cardNo}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('authorize_list_table_header_deviceName_label')">
          <template slot-scope="scope">
            <span>{{ scope.row.device.deviceName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('authorize_list_table_header_deviceKey_label')" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.device.deviceKey }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('authorize_list_table_header_deviceGroup_label')">
          <template slot-scope="scope">
            <span>{{ scope.row.device.deviceGroup }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('authorize_list_table_header_operation_label')" class-name="table__icon--btn">
          <template slot-scope="scope">
            <el-tooltip :content="$t('authorize_list_table_operation_button_look')" placement="bottom">
              <i
                class="iconfont icon-View"
                @click="handleDetail(scope.row)"
              ></i>
            </el-tooltip>
            <el-button type="text" @click="handleCancel(scope.row)"
              >{{$t('authorize_list_table_operation_button_revoke')}}</el-button
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
            >{{$t('authorize_list_pagination_button_revoke_history')}}</el-button
          >
        </div>
      </m-pagination>
    </div>
    <el-dialog
      v-if="detailDialog.visible"
      :title="$t('authorize_list_dialogDetail_title')"
      :visible.sync="detailDialog.visible"
      width="400px"
      center
    >
      <div class="dialog-detail-box">
        <section class="border-bottom pb20">
          <p>
            <span class="label">{{$t('authorize_list_dialogDetail_info_name_label')}}</span>
            <span class="content">{{ detailDialog.data.employee.name }}</span>
          </p>
          <p>
            <span class="label">{{$t('authorize_list_dialogDetail_info_empNo_label')}}</span>
            <span class="content">{{ detailDialog.data.empNo }}</span>
          </p>
          <div class="mt10">
            <span class="label label-photo">{{$t('authorize_list_dialogDetail_info_faces_label')}}</span>
            <ul class="photo-list">
              <li
                v-for="(item, index) in detailDialog.data.faces"
                :key="index"
                class="m-photo80"
              >
                <img class="avatar" :src="`${baseUrl}/file/face/${item.faceId}`" :alt="$t('authorize_list_facesImg_alt')" />
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
            <span class="label">{{$t('authorize_list_dialogDetail_info_deviceName_label')}}</span>
            <span class="content">{{ detailDialog.data.device.deviceName }}</span>
          </div>
          <div>
            <span class="label">{{$t('authorize_list_dialogDetail_info_deviceKey_label')}}</span>
            <span class="content">{{ detailDialog.data.device.deviceKey }}</span>
          </div>
          <div>
            <span class="label">{{$t('authorize_list_dialogDetail_info_deviceGroup_label')}}</span>
            <span class="content">{{ detailDialog.data.device.deviceGroup }}</span>
          </div>
          <div>
            <span class="label">{{$t('authorize_list_dialogDetail_info_versionCompatibility_label')}}</span>
            <span class="content">{{detailDialog.data.device.versionCompatibility?$t('authorize_list_dialogDetail_info_versionCompatibility_value_true'):$t('authorize_list_dialogDetail_info_versionCompatibility_value_false')}}</span>
          </div>
          <div>
            <span class="label">{{$t('authorize_list_dialogDetail_info_haveFaces_label')}}</span>
            <span class="content">{{detailDialog.data.faces?$t('authorize_list_dialogDetail_info_haveFaces_value_true'):$t('authorize_list_dialogDetail_info_haveFaces_value_false')}}</span>
          </div>
          <div>
            <span class="label">{{$t('authorize_list_dialogDetail_info_recognitionModel_label')}}</span>
            <span class="content">{{detailDialog.data.device.recognitionModel||'-'}}</span>
          </div>
          <div>
            <span class="label">{{$t('authorize_list_dialogDetail_info_status_label')}}</span>
            <span class="content">{{detailDialog.data.device.status===1?$t('authorize_list_dialogDetail_info_status_label'):$t('authorize_list_dialogDetail_info_status_value_offline')}}</span>
          </div>
          <div>
            <span class="label">{{$t('authorize_list_dialogDetail_info_permissionTime_label')}}</span>
            <span class="content" v-if="detailDialog.data.permissionTime">{{ detailDialog.data.permissionTime.permissionTimeEntries.startTime }} ~{{ detailDialog.data.permissionTime.permissionTimeEntries.endTime }}</span>
            <span v-else>-</span>
          </div>
          <div class="f-flex-spaceStart-alignStart">
            <span class="label">{{$t('authorize_list_dialogDetail_info_permissionTimeEntries_label')}}</span>
            <div v-if="detailDialog.data.permissionTime.permissionTimeEntries.length" class="content">
              <p v-for="(item, index) in detailDialog.data.permissionTime.permissionTimeEntries" :key="index">
                {{item.startTime}} ~ {{item.endTime}}
              </p>
            </div>
            <span v-else>-</span>
          </div>
          <div>
            <span class="label">{{$t('authorize_list_dialogDetail_info_createTime_label')}}</span>
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
        this.$confirm(this.$t('authorize_list_dialogRevoke_confirm_content'), this.$t('authorize_list_dialogRevoke_confirm_title'), {
          showCancelButton: false,
          center: true
        }).then(() => {}, () => {})
      } else {
        this.$confirm(this.$t('authorize_list_dialogRevoke_content'), this.$t('authorize_list_dialogRevoke_title'), {
          customClass: 'delete__box--confirm',
          confirmButtonText: this.$t('authorize_list_dialogRevoke_submit_text'),
          center: true
        }).then(
          () => {
            const params = {
              authIds: this.checkList.map(item => item.authId)
            }
            cancelAuthBatch(params).then(res => {
              if (res.success) {
                this.$message.success(this.$t('authorize_list_dialogRevoke_success'))
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
      this.$confirm(this.$t('authorize_list_dialogRevoke_content'), this.$t('authorize_list_dialogRevoke_title'), {
        customClass: 'delete__box--confirm',
        confirmButtonText: this.$t('authorize_list_dialogRevoke_submit_text'),
        center: true
      }).then(
        () => {
          cancelAuth(authId).then(res => {
            if (res.success) {
              this.$message.success(this.$t('authorize_list_dialogRevoke_success'))
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
