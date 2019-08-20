<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title" @click="$router.back()"><i class="iconfont icon-retreat"></i>历史授权记录</span>
      <div class="page__header--btn">
        <el-button size="small">批量删除</el-button>
      </div>
    </div>

    <div class="page__content">
      <el-form ref="filterForm" class="page__content--filter" label-position="top" :inline="true">
        <el-form-item label="上传时间">
          <date-picker-range :startTime.sync="searchParams.startTime" :endTime.sync="searchParams.endTime"></date-picker-range>
        </el-form-item>
        <el-form-item class="btn__search">
          <el-button icon="iconfont icon-search" @click="handleQuery('firstPage')">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="listData" height="100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="createTime" label="时间"></el-table-column>
        <el-table-column prop="deviceNum" label="设备数"></el-table-column>
        <el-table-column prop="personNum" label="人员数"></el-table-column>
        <el-table-column prop="photoNum" label="照片数"></el-table-column>
        <el-table-column prop="storePhoto" label="存储注册照">
          <template slot-scope="scope">
            <span>{{scope.row.storePhoto?'是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限有效期（日期）">
          <template slot-scope="scope">
            <span>{{scope.row.permissionTime&&scope.row.permissionTime.permissionStartTime?`${scope.row.permissionTime.permissionStartTime}~${scope.row.permissionTime.permissionEndTime}`:'-'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceGroup" label="权限有效期（时间）">
          <template slot-scope="scope">
            <div v-if="scope.row.permissionTime">
              <p v-for="(item, index) in scope.row.permissionTime.permissionTimeEntries" :key="index">
                {{item.startTime}} ~ {{item.endTime}}
              </p>
            </div>
            <p v-else>-</p>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" class-name="table__icon--btn">
          <template slot-scope="scope">
            <el-tooltip content="查看" placement="bottom">
              <i class="iconfont icon-View" @click="handleDetail(scope.row)"></i>
            </el-tooltip>
            <el-tooltip content="删除" placement="bottom">
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
      this.$confirm('确定删除？', '删除授权记录', {
        customClass: 'delete__box--confirm',
        confirmButtonText: '删除',
        center: true
      }).then(() => {
        const { id } = item
        recordDelete(id).then(res => {
          if (res.success) {
            this.$message.success('删除成功！')
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
