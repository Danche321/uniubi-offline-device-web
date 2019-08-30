<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>{{ $t('export_detail_page_title') }}
      </span>
    </div>

    <div class="page__content">
      <div class="w100">
        <p class="tip">
          {{ $t('export_detail_tip_text_1') }}{{ pageSuccessParams.total }}{{ $t('export_detail_tip_text_3') }}，{{ $t('export_detail_tip_text_2') }}{{ pageFailParams.total }}{{ $t('export_detail_tip_text_3') }}
        </p>
        <div class="mt10">
          <el-button class="btn--blue" @click="importFailExcel()">
            {{ $t('export_detail_top_btn') }}
          </el-button>
          <span class="ml10">{{ $t('export_detail_tip_text_4') }}</span>
          <span class="fr mt10">{{ $route.query.time }}</span>
        </div>
      </div>

      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane :label="$t('export_detail_tab1')" name="success">
          <el-table :data="empSuccessList" height="100%">
            <el-table-column prop="name" :label="$t('export_detail_table_label1')" min-width="90">
              <template slot-scope="{ row }">
                {{ row.name || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="workNo" :label="$t('export_detail_table_label2')" min-width="120">
              <template slot-scope="{ row }">
                {{ row.workNo || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="phone" :label="$t('export_detail_table_label3')" min-width="120">
              <template slot-scope="{ row }">
                {{ row.phone || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="empNo" :label="$t('export_detail_table_label4')" min-width="140" :show-overflow-tooltip="true">
              <template slot-scope="{ row }">
                {{ row.empNo || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="cardNo" :label="$t('export_detail_table_label5')" min-width="130">
              <template slot-scope="{ row }">
                {{ row.cardNo || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="role" :label="$t('export_detail_table_label6')" min-width="80">
              <template slot-scope="{ row }">
                {{ row.role || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="depName" :label="$t('export_detail_table_label7')" min-width="85" :show-overflow-tooltip="true">
              <template slot-scope="{ row }">
                {{ row.depName || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="entryTime" :label="$t('export_detail_table_label8')" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.entryTime && scope.row.entryTime.split(' ')[0] || '--' }}
              </template>
            </el-table-column>
          </el-table>
          <m-pagination
            :handleQueryFun="handleSuccessQuery"
            :pageParams="pageSuccessParams">
          </m-pagination>
        </el-tab-pane>

        <el-tab-pane :label="$t('export_detail_tab2')" name="fail">
          <el-table :data="empFailList" height="100%">
            <el-table-column prop="name" :label="$t('export_detail_table_label1')" min-width="90">
              <template slot-scope="{ row }">
                {{ row.name || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="workNo" :label="$t('export_detail_table_label2')" min-width="120">
              <template slot-scope="{ row }">
                {{ row.workNo || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="phone" :label="$t('export_detail_table_label3')" min-width="120">
              <template slot-scope="{ row }">
                {{ row.phone || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="empNo" :label="$t('export_detail_table_label4')" min-width="140" :show-overflow-tooltip="true">
              <template slot-scope="{ row }">
                {{ row.empNo || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="cardNo" :label="$t('export_detail_table_label5')" min-width="130">
              <template slot-scope="{ row }">
                {{ row.cardNo || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="role" :label="$t('export_detail_table_label6')" min-width="80">
              <template slot-scope="{ row }">
                {{ row.role || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="depName" :label="$t('export_detail_table_label7')" min-width="85" :show-overflow-tooltip="true">
              <template slot-scope="{ row }">
                {{ row.depName || '--' }}
              </template>
            </el-table-column>
            <el-table-column prop="entryTime" :label="$t('export_detail_table_label8')" min-width="100">
              <template slot-scope="scope">
                {{ scope.row.entryTime && scope.row.entryTime.split(' ')[0] || '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="reason"
              :label="$t('export_detail_table_label9')"
              min-width="90"
              :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span class="f-red">{{ scope.row.reason }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('export_detail_table_label10')"
              min-width="50"
              class-name="table__icon--btn">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.updateStatus === 0"
                  type="text"
                  @click="handleReCreate(scope.row)">
                  {{ $t('export_detail_table_btn1') }}
                </el-button>
                <span v-else class="gary-light">{{ $t('export_detail_table_btn2') }}</span>
              </template>
            </el-table-column>
          </el-table>
          <m-pagination
            :handleQueryFun="handleFailQuery"
            :pageParams="pageFailParams">
          </m-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/hr/employee'

export default {
  name: 'empInfo',
  data () {
    return {
      activeTab: 'success',
      empSuccessList: [],
      empFailList: [],
      pageSuccessParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      pageFailParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created () {
    this.activeTab = this.$route.query.tab || 'success'
    this.handleSuccessQuery()
    this.handleFailQuery()
  },
  methods: {
    handleSuccessQuery () {
      const params = {
        recordId: this.$route.query.id,
        type: 2,
        ...this.pageSuccessParams
      }
      api.historyDetail(params).then(res => {
        if (res.success) {
          const { list, pageNum, total } = res.data
          this.empSuccessList = list
          this.pageSuccessParams = { ...this.pageSuccessParams, pageNum, total }
        }
      })
    },
    handleFailQuery () {
      const params = {
        recordId: this.$route.query.id,
        type: 3,
        ...this.pageFailParams
      }
      api.historyDetail(params).then(res => {
        if (res.success) {
          const { list, pageNum, total } = res.data
          this.empFailList = list
          this.pageFailParams = { ...this.pageFailParams, pageNum, total }
        }
      })
    },
    importFailExcel () {
      window.open(`${this.baseUrl}/employee/exportHistory?type=3&recordId=${this.$route.query.id}`)
    },
    handleReCreate (info) {
      sessionStorage.setItem('userInfo', JSON.stringify(info))
      this.$router.push({
        name: 'empInfo',
        query: {
          recreate: 'yes'
        }
      })
    },
    handleTabChange () {
      this.$router.replace({
        name: '',
        query: {
          ...this.$route.query,
          tab: this.activeTab
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tip{
  font-size: 16px;
  color: #303133;
}
.el-tabs/deep/{
  width: 100%;
  height: calc(100% - 70px);
  margin-top: 10px;
  .el-tabs__header{
    margin-bottom: 0;
  }
  .el-tabs__item{
    font-size: 16px;
  }
  .el-tabs__content{
    height: calc(100% - 40px);
    .el-tab-pane{
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
    }
  }
}
.photo{
  width: 40px;
  height: 40px;
}
.gary-light{
  color: #b1b0b0;
}
</style>
