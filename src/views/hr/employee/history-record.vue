<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>历史上传记录
      </span>
      <div class="page__header--btn">
        <el-dropdown class="mr30" trigger="click">
          <span class="el-dropdown-link">
            导出<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleHeaderExportExcel(1)">导出全部</el-dropdown-item>
            <el-dropdown-item @click.native="handleHeaderExportExcel(2)">导出成功记录</el-dropdown-item>
            <el-dropdown-item @click.native="handleHeaderExportExcel(3)">导出失败记录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="small" @click="handleBatchDelete()">批量删除</el-button>
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
        <el-form-item label="文件名">
          <el-input
            v-model="searchParams.name"
            @blur="searchParams.name = searchParams.name.trim()"
            maxlength="32"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="上传时间">
          <date-picker-range
            :startTime.sync="searchParams.begTime"
            :endTime.sync="searchParams.endTime"
            defultTime>
          </date-picker-range>
        </el-form-item>

        <el-form-item class="btn__search">
          <el-button icon="iconfont icon-search" @click="handleQuery('firstPage')">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="historyList" height="100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="createTime" label="时间" min-width="100"></el-table-column>
        <el-table-column prop="name" label="文件名" min-width="120"></el-table-column>
        <el-table-column prop="susNum" label="成功人数" min-width="50"></el-table-column>
        <el-table-column prop="failNum" label="失败人数" min-width="50"></el-table-column>
        <el-table-column prop="totalNum" label="注册照数量" min-width="50"></el-table-column>
        <el-table-column label="操作" min-width="100" class-name="table__icon--btn">
          <template slot-scope="scope">
            <el-button
              class="mr10"
              type="text"
              @click="$router.push({
                name: 'exportDetail',
                query: {id: scope.row.id, time: scope.row.createTime}
              })">
              查看详情
            </el-button>
            <el-dropdown class="mr10" trigger="click">
              <span class="el-dropdown-link f-blue pointer">
                导出<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="handleExportExcel(1, scope.row.id)">导出全部</el-dropdown-item>
                <el-dropdown-item @click.native="handleExportExcel(2, scope.row.id)">导出成功记录</el-dropdown-item>
                <el-dropdown-item @click.native="handleExportExcel(3, scope.row.id)">导出失败记录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
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
        this.$message.warning('请先选择需要导出的历史记录！')
        return
      }

      this.$confirm('批量导出选中的历史记录，系统将自动为您生成excel文件', '导出', {
        confirmButtonText: '导出',
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
            a.setAttribute('download', '人员导出列表.xlsx')
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
      api.deleteHistory(id).then(res => {
        if (res.success) {
          this.$message.success('删除成功！')
          this.handleQuery()
        }
      })
    },
    handleBatchDelete () {
      if (!this.checkedList.length) {
        this.$message.warning('请先选择需要删除的历史记录！')
        return
      }
      let params = ''
      this.checkedList.forEach(ele => {
        params += `&recordIds=${ele.id}`
      })
      params = params.substr(1)
      api.batchDeleteHistory(params).then(res => {
        if (res.success) {
          this.$message.success('删除成功！')
          this.handleQuery()
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
  }
  .el-dropdown-link{
    cursor: pointer;
    &:hover{
      color: #208ef2;
    }
  }
}
</style>
