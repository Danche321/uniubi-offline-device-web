<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">识别记录</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          导出<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in exportTypes" :key="index" @click.native="handleExport(item.type)">{{item.text}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
        >
          <el-form-item label="设备组">
            <el-select v-model="searchParams.deviceGroupId" filterable clearable v-leftClear>
              <el-option v-for="item in deviceGroupList" :key="item.id" :value="item.id" :label="item.groupName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称">
            <el-input
              v-model.trim="searchParams.deviceName"
              maxlength="32"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="时间">
            <date-picker-range
              :startTime.sync="searchParams.startTime"
              :endTime.sync="searchParams.endTime"
            ></date-picker-range>
          </el-form-item>
          <el-form-item label="比对结果">
            <el-select v-model="searchParams.identifyType" clearable v-leftClear>
              <el-option v-for="item in identityTypes" :key="item.type" :value="item.type" :label="item.text"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门">
            <dep-tree-select v-leftClear v-model="searchParams.departmentId"></dep-tree-select>
          </el-form-item>
          <el-form-item label="人员">
            <emp-tree-select v-leftClear v-model="searchParams.empId"></emp-tree-select>
          </el-form-item>
          <el-form-item label="员工编号">
            <el-input
              v-model.trim="searchParams.empNo"
              maxlength="32"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="识别模式">
            <el-select v-model="searchParams.recognitionType" clearable v-leftClear>
              <el-option v-for="item in recognitionType" :key="item.type" :value="item.type" :label="item.text"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="准入时间判断">
            <el-select v-model="searchParams.passTimeType" clearable v-leftClear>
              <el-option v-for="item in passTimeTypes" :key="item.type" :value="item.type" :label="item.text"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活体判断">
            <el-select v-model="searchParams.aliveBody" clearable v-leftClear>
              <el-option v-for="item in aliveBodyType" :key="item.type" :value="item.type" :label="item.text"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效期判断">
            <el-select v-model="searchParams.permissionTimeType" clearable v-leftClear>
              <el-option v-for="item in permissionTimeTypes" :key="item.type" :value="item.type" :label="item.text"></el-option>
            </el-select>
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

      <el-table :data="listData" height="100%" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="46" fixed></el-table-column>
        <el-table-column prop="employeeVO.name" label="姓名" width="100" fixed></el-table-column>
        <el-table-column prop="faces" width="100" label="抓拍照片">
          <template slot-scope="scope">
            <img v-if="scope.row.photoId" class="m-avatar40" :src="`${baseUrl}/file/image/${scope.row.photoId}`" alt="头像" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column width="200" label="部门" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{scope.row.employeeVO&&scope.row.employeeVO.empDepVOS.map(item => item.depName).join('、')}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="employeeVO.empNo" label="人员编号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column width="120" prop="deviceBO.deviceGroup" label="设备组" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column width="120" prop="deviceBO.deviceName" label="设备名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column width="200" prop="deviceBO.deviceKey" label="设备序列号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column width="200" prop="recognitionTime" label="识别时间"></el-table-column>
        <el-table-column width="120" prop="recognitionType" label="识别模式">
          <template slot-scope="scope">
            <span>{{scope.row.recognitionType|filterIdentifyType}}</span>
          </template>
        </el-table-column>
        <el-table-column width="80" prop="identifyType" label="比对结果">
          <template slot-scope="scope">
            <span :class="scope.row.identifyType===1?'m-radio-success':'m-radio-failed'">{{scope.row.identifyType===1?'成功':'失败'}}</span>
          </template>
        </el-table-column>
        <el-table-column width="140" label="活体">
          <template slot-scope="scope">
            <span>{{scope.row.aliveBody|filterAlive}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="passTimeType" label="准入时间">
          <template slot-scope="scope">
            <span :class="{'f-red': scope.row.passTimeType===2}">{{scope.row.passTimeType|filterPassTimeType}}</span>
          </template>
        </el-table-column>
        <el-table-column width="120" prop="permissionTimeType" label="有效期">
          <template slot-scope="scope">
            <span :class="{'f-red': scope.row.permissionTimeType===2}">{{scope.row.permissionTimeType===1?'有效期内':'未在有效期'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <m-pagination
        :handleQueryFun="handleQuery"
        :pageParams="pageParams"
      ></m-pagination>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/identify'
import { EmpTreeSelect, DepTreeSelect } from '@/components/tree-select'
import DatePickerRange from '@/components/date-picker-range'
import { fetchDeviceGroupAll } from '@/api/common'
import qs from 'qs'
export default {
  name: 'list',
  components: {
    EmpTreeSelect,
    DepTreeSelect,
    DatePickerRange
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
        deviceGroupId: '',
        departmentId: '',
        empId: '',
        empNo: '',
        cardNum: '',
        deviceGroup: '',
        deviceKey: '',
        deviceName: '',
        aliveBody: '',
        permissionTimeType: '',
        identifyType: '',
        recognitionType: ''
      },
      listData: [],
      exportTypes: [
        { text: '选中', type: 1 },
        { text: '搜索结果', type: 2 },
        { text: '全部', type: 3 }
      ],
      exportParams: null,
      checkList: [],
      deviceGroupList: [], // 设备组
      recognitionType: [ // 识别模式
        { type: 1, text: '人脸识别' },
        { type: 2, text: '刷卡识别' },
        { type: 3, text: '人卡合一' },
        { type: 4, text: '认证对比' }
      ],
      passTimeTypes: [ // 准入时间判断
        { type: 1, text: '准入时间内' },
        { type: 2, text: '未在准入时间内' },
        { type: 3, text: '未设置' }
      ],
      aliveBodyType: [ // 活体判断
        { type: 1, text: '活体' },
        { type: 2, text: '非活体' }
      ],
      permissionTimeTypes: [ // 有效期判断
        { type: 1, text: '有效期内' },
        { type: 2, text: '未在有效期内' },
        { type: 3, text: '未设置' }
      ],
      identityTypes: [ // 比对结果
        { type: 1, text: '比对成功' },
        { type: 2, text: '比对失败' }
      ]
    }
  },
  filters: {
    filterAlive (type) {
      switch (type) {
        case 1:
          return '活体'
        case 2:
          return '非活体'
        case 3:
          return '未进行活体判断'
      }
    },
    filterIcon (status) {
      switch (status) {
        case 1:
          return 'icon-caveat'
        case 2:
          return 'icon-success'
        case 3:
          return 'icon-failure'
      }
    },
    filterPassTimeType (type) {
      switch (type) {
        case 1:
          return '准入时间内'
        case 2:
          return '未在准入时间'
        case 3:
          return '未设置'
      }
    },
    filterIdentifyType (type) {
      switch (type) {
        case 1:
          return '人脸识别'
        case 2:
          return '刷卡识别'
        case 3:
          return '人卡合一'
        case 4:
          return '人证对比'
        default:
          return '-'
      }
    }
  },
  created () {
    this.getAllGroup()
    this.getList()
  },
  methods: {
    // 获取所有设备组
    getAllGroup () {
      fetchDeviceGroupAll().then(res => {
        if (res.success) {
          this.deviceGroupList = res.data
        }
      })
    },
    handleQuery (firstPage) {
      if (firstPage) {
        this.pageParams.pageNum = 1
      }
      this.getList()
    },
    handleSelectionChange (val) {
      this.checkList = val
    },
    getList () {
      const params = { ...this.searchParams, ...this.pageParams }
      fetchList(params).then(res => {
        if (res.success) {
          const { list, total } = res.data
          this.listData = list
          this.pageParams.total = total
          this.exportParams = { ...this.searchParams, ...this.pageParams }
        }
      })
    },
    // 导出
    handleExport (type) {
      let params
      if (type === 1) { // 选中
        if (!this.checkList.length) {
          return this.$message.error('请选择要导出的数据')
        } else {
          const checkIds = this.checkList.map(item => item.id)
          params = { recognitionIdList: checkIds }
        }
      } else if (type === 2) { // 搜索结果
        if (!this.listData.length) {
          return this.$message.error('没有可导出的数据')
        } else {
          params = Object.assign({}, this.searchParams, { pageNum: -1 })
        }
      } else {
        params = { pageNum: -1 }
      }
      window.open(`${this.baseUrl}/recognition/output?${qs.stringify(params)}`)
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
.m-avatar40{
  width: 40px;
  height: 40px;
  display: inline-block;
}
.m-radio-success{
  position: relative;
  &:before{
    content: '';
    background: #3FC948;
    width: 6px;
    height: 6px;
    display: inline-block;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    margin-right: 5px;
  }
}
.m-radio-failed{
  position: relative;
  &:before{
    content: '';
    background: #FF002E;
    width: 6px;
    height: 6px;
    display: inline-block;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    margin-right: 5px;
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
