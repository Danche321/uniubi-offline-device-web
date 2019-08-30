<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>{{ $t('history_record_page_title') }}
      </span>
      <div class="page__header--btn">
        <el-dropdown class="mr30" trigger="click">
          <span class="el-dropdown-link">
            {{ $t('common_export') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleHeaderExportExcel(1)">{{ $t('history_record_header_btn1_1') }}</el-dropdown-item>
            <el-dropdown-item @click.native="handleHeaderExportExcel(2)">{{ $t('history_record_header_btn1_2') }}</el-dropdown-item>
            <el-dropdown-item @click.native="handleHeaderExportExcel(3)">{{ $t('history_record_header_btn1_3') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="small" @click="handleBatchDelete()">{{ $t('history_record_header_btn2') }}</el-button>
      </div>
    </div>

    <div class="page__content">
      <el-form
        ref="filterForm"
        class="page__content--filter"
        label-position="top"
        :inline="true"
        :model="searchParams"
        @keyup.enter.native="handleQuery('firstPage')">
        <el-form-item :label="$t('history_record_search_label1')">
          <el-input
            v-model="searchParams.name"
            @blur="searchParams.name = searchParams.name.trim()"
            maxlength="32"
            clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('history_record_search_label2')">
          <date-picker-range
            :startTime.sync="searchParams.begTime"
            :endTime.sync="searchParams.endTime"
            defultTime>
          </date-picker-range>
        </el-form-item>

        <el-form-item class="btn__search">
          <el-button icon="iconfont icon-search" @click="handleQuery('firstPage')">{{ $t('common_search') }}</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="historyList" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="createTime" :label="$t('history_record_table_column1')" min-width="100"></el-table-column>
        <el-table-column prop="name" :label="$t('history_record_table_column2')" min-width="120"></el-table-column>
        <el-table-column prop="susNum" :label="$t('history_record_table_column3')" min-width="50"></el-table-column>
        <el-table-column prop="failNum" :label="$t('history_record_table_column4')" min-width="50"></el-table-column>
        <el-table-column prop="totalNum" :label="$t('history_record_table_column5')" min-width="50"></el-table-column>
        <el-table-column :label="$t('history_record_table_column6')" min-width="100" class-name="table__icon--btn">
          <template slot-scope="scope">
            <el-button
              class="mr10"
              type="text"
              @click="$router.push({
                name: 'exportDetail',
                query: {id: scope.row.id, time: scope.row.createTime}
              })">
              {{ $t('history_record_table_btn1') }}
            </el-button>
            <el-dropdown class="mr10" trigger="click">
              <span class="el-dropdown-link f-blue pointer">
                {{ $t('common_export') }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleExportExcel(1, scope.row.id)">{{ $t('history_record_header_btn1_1') }}</el-dropdown-item>
                <el-dropdown-item @click.native="handleExportExcel(2, scope.row.id)">{{ $t('history_record_header_btn1_2') }}</el-dropdown-item>
                <el-dropdown-item @click.native="handleExportExcel(3, scope.row.id)">{{ $t('history_record_header_btn1_3') }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-tooltip effect="dark" :content="$t('common_delete')" placement="top" :enterable="false">
              <i class="iconfont icon-delete" @click="handleDelete(scope.row)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        :handleQueryFun="handleQuery"
        :pageParams="pageParams">
      </m-pagination>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/hr/employee'
import DatePickerRange from '@/components/date-picker-range'

export default {
  name: 'historyRecord',
  data () {
    return {
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      checkedList: [],
      searchParams: {
        name: '',
        begTime: '',
        endTime: ''
      },
      historyList: []
    }
  },
  components: {
    DatePickerRange
  },
  created () {
    this.handleQuery()
  },
  methods: {
    handleQuery (firstPage) {
      if (firstPage) this.pageParams.pageNum = 1
      const params = {
        ...this.searchParams,
        ...this.pageParams
      }
      api.historyList(params).then(res => {
        if (res.success) {
          const { list, pageNum, total } = res.data
          this.historyList = list
          this.pageParams = { ...this.pageParams, pageNum, total }
        }
      })
    },
    handleSelectionChange (val) {
      this.checkedList = val
    },
    handleHeaderExportExcel (type) {
      if (!this.checkedList.length) {
        this.$message.warning(this.$t('history_record_warning1'))
        return
      }

      this.$confirm(this.$t('history_record_confirm1'), this.$t('common_export'), {
        confirmButtonText: this.$t('common_export'),
        center: true
      }).then(() => {
        this.checkedList.forEach((ele, index) => {
          const params = {
            type,
            id: ele.id
          }
          api.exportExcel(params).then(res => {
            const a = document.createElement('a')
            const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
            a.href = URL.createObjectURL(blob)
            a.setAttribute('download', this.$t('history_record_excel_name'))
            document.body.appendChild(a)
            a.click()
            URL.revokeObjectURL(a.href)
          })
        })
      }, () => {})
    },
    handleExportExcel (type, id) {
      window.open(`${this.baseUrl}/employee/exportHistory?type=${type}&recordId=${id}`)
    },
    handleDelete ({ id }) {
      this.$confirm(this.$t('history_record_confirm2'), this.$t('common_delete'), {
        customClass: 'delete__box--confirm',
        confirmButtonText: this.$t('common_delete'),
        center: true
      }).then(() => {
        api.deleteHistory(id).then(res => {
          if (res.success) {
            this.$message.success(this.$t('history_record_success1'))
            this.handleQuery()
          }
        })
      }, () => {})
    },
    handleBatchDelete () {
      if (!this.checkedList.length) {
        this.$message.warning(this.$t('history_record_warning3'))
        return
      }

      this.$confirm(this.$t('history_record_warning2'), this.$t('common_delete'), {
        customClass: 'delete__box--confirm',
        confirmButtonText: this.$t('common_delete'),
        center: true
      }).then(() => {
        let params = ''
        this.checkedList.forEach(ele => {
          params += `&recordIds=${ele.id}`
        })
        params = params.substr(1)
        api.batchDeleteHistory(params).then(res => {
          if (res.success) {
            this.$message.success(this.$t('history_record_success1'))
            this.handleQuery()
          }
        })
      }, () => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.page__header/deep/{
  .el-button--text{
    color: #606266;
  }
  .el-dropdown-link{
    cursor: pointer;
    &:hover{
      color: #208ef2;
    }
  }
}
</style>
