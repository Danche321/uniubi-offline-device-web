<template>
  <div class="pagination">
    <div>
      <slot></slot>
    </div>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageParams.pageNum"
      :page-sizes="[10, 30, 50]"
      :page-size="pageParams.pageSize"
      :total="pageParams.total"
      :layout="layout">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'mPagination',
  props: {
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    handleQueryFun: {
      type: Function
    },
    pageParams: {
      type: Object,
      default () {
        return {
          total: 0,
          pageNum: 1,
          pageSize: 10
        }
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageParams.pageSize = val
      this.handleQueryFun('firstPage')
    },
    handleCurrentChange (val) {
      this.pageParams.pageNum = val
      this.handleQueryFun()
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination{
  width: 100%;
  box-sizing: border-box;
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-pagination/deep/{
    .btn-prev,
    .btn-next{
      width: 32px;
      height: 32px;
      border: 1px solid #E4E7ED;
      border-radius: 2px;
      background: #fff!important;
    }
    .el-pager li{
      width: 32px;
      height: 32px;
      background: #fff!important;
      border: 1px solid #E4E7ED;
      font-weight: normal;
      border-radius: 2px;
    }
    .el-pager .active{
      background: #fff!important;
      color: #2EA2F8!important;
      border: 1px solid #2EA2F8!important;
    }
    .el-pagination__total{
      line-height: 32px;
    }
    .el-pagination__sizes{
      width: 85px;
      .el-input{
        width: 85px;
      }
      .el-input__inner{
        width: 85px;
        height: 32px;
        border-radius: 2px;
      }
    }
    .el-pagination__editor .el-input__inner{
      width: 50px!important;
      height: 32px!important;
    }
    .el-pagination__editor{
      margin: 0 8px;
    }
  }
}
</style>
