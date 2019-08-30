<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title" @click="$router.back()"><i class="iconfont icon-retreat"></i>{{$t('authorize_history_title_text')}}</span>
      <div class="page__header--btn">
        <el-button size="small">{{$t('authorize_history_title_buttons_batchDelete')}}</el-button>
      </div>
    </div>

    <div class="page__content">
      <el-form ref="filterForm" class="page__content--filter" label-position="top" :inline="true">
        <el-form-item :label="$t('authorize_history_search_startTime_label')">
          <date-picker-range :startTime.sync="searchParams.startTime" :endTime.sync="searchParams.endTime"></date-picker-range>
        </el-form-item>
        <el-form-item class="btn__search">
          <el-button icon="iconfont icon-search" @click="handleQuery('firstPage')">{{$t('common_search')}}</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="listData" height="100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="createTime" :label="$t('authorize_history_table_header_createTime_label')"></el-table-column>
        <el-table-column prop="deviceNum" :label="$t('authorize_history_table_header_deviceNum_label')"></el-table-column>
        <el-table-column prop="personNum" :label="$t('authorize_history_table_header_personNum_label')"></el-table-column>
        <el-table-column prop="photoNum" :label="$t('authorize_history_table_header_photoNum')"></el-table-column>
        <el-table-column prop="storePhoto" :label="$t('authorize_history_table_header_storePhoto_label')">
          <template slot-scope="scope">
            <span>{{scope.row.storePhoto?$t('authorize_history_table_header_storePhoto_value_true'):$t('authorize_history_table_header_storePhoto_value_false')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('authorize_history_table_header_date_label')">
          <template slot-scope="scope">
            <span>{{scope.row.permissionTime&&scope.row.permissionTime.permissionStartTime?`${scope.row.permissionTime.permissionStartTime}~${scope.row.permissionTime.permissionEndTime}`:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceGroup" :label="$t('authorize_history_table_header_time_label')">
          <template slot-scope="scope">
            <div v-if="scope.row.permissionTime">
              <p v-for="(item, index) in scope.row.permissionTime.permissionTimeEntries" :key="index">
                {{item.startTime}} ~ {{item.endTime}}
              </p>
            </div>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('authorize_history_table_header_operation_label')" class-name="table__icon--btn">
          <template slot-scope="scope">
            <el-tooltip :content="$t('authorize_history_table_header_operation_value_look')" placement="bottom">
              <i class="iconfont icon-View" @click="handleDetail(scope.row)"></i>
            </el-tooltip>
            <el-tooltip :content="$t('authorize_history_table_header_operation_value_delete')" placement="bottom">
              <i class="iconfont icon-delete" @click="handleDelete(scope.row)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <m-pagination :handleQueryFun="handleQuery" :pageParams="pageParams"></m-pagination>
    </div>
  </div>
</template>

<script>
import DatePickerRange from '@/components/date-picker-range'
import { fetchHistoryList, recordDelete } from '@/api/authorize'
export default {
  name: 'auth-history',
  components: {
    DatePickerRange
  },
  data () {
    return {
      searchParams: {
        startTime: '',
        endTime: ''
      },
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      listData: [{}]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    handleQuery (firstPage) {
      if (firstPage) {
        this.pageParams.pageNum = 1
      }
      this.getList()
    },
    getList () {
      const params = Object.assign({}, this.searchParams, this.pageParams)
      fetchHistoryList(params).then(res => {
        if (res.success) {
          const { list, total } = res.data
          this.listData = list
          this.pageParams.total = total
        }
      })
    },
    handleDetail (item) {
      this.$router.push(`/authorize/detail/${item.id}`)
    },
    handleDelete (item) {
      this.$confirm(this.$t('authorize_history_dialogDelete_content'), this.$t('authorize_history_dialogDelete_title'), {
        customClass: 'delete__box--confirm',
        confirmButtonText: this.$t('common_delete'),
        center: true
      }).then(() => {
        const { id } = item
        recordDelete(id).then(res => {
          if (res.success) {
            this.$message.success(this.$t('authorize_history_dialogDelete_success'))
            this.getList()
          }
        })
      }, () => {})
    }
  }
}
</script>

<style scoped>

</style>
