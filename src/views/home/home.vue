<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">首页</span>
    </div>
    <div class="page__content">
      <el-scrollbar class="scroll--y">
        <div class="summary">
          <div
            class="summary__item"
            :class="{'border--none': index === 3}"
            v-for="(item, index) in summary"
            :key="index">
            <p>
              <i class="iconfont" :class="item.icon"></i>
              <span class="emp__num">{{ item.num }}</span>
              <span class="emp__text">{{ item.numType }}</span>
            </p>
            <p class="mt10">{{ item.text }}</p>
          </div>
        </div>

        <div class="quick">
          <div class="quick__title">
            <p>快捷操作</p>
            <el-tooltip
              content="编辑"
              placement="left"
              :enterable="false"
              :open-delay="500">
              <i class="iconfont icon-edit" @click="handleShowDialog('quickBtn')"></i>
            </el-tooltip>
          </div>
          <div class="quick__content">
            <div class="empty__tip" v-if="!quickBtn.length">
              <span class="pointer" @click="handleShowDialog('quickBtn')">点击添加快捷操作</span>
            </div>
            <el-button
              v-for="(item, index) in quickBtn"
              :key="index" plain
              @click="$router.push({name: item.url})">
              {{ item.name }}
            </el-button>
          </div>
        </div>

        <div class="quick">
          <div class="quick__title">
            <p>快捷入口</p>
            <el-tooltip
              content="编辑"
              placement="left"
              :enterable="false"
              :open-delay="500">
              <i class="iconfont icon-edit" @click="handleShowDialog('quickEnter')"></i>
            </el-tooltip>
          </div>
          <div class="quick__content">
            <div class="empty__tip" v-if="!quickEnter.length">
              <span class="pointer" @click="handleShowDialog('quickEnter')">点击添加快捷入口</span>
            </div>
            <div class="quick__enter--item" v-for="(item, index) in quickEnter" :key="index">
              <i class="iconfont" :class="item.icon" @click="$router.push({name: item.url})"></i>
              <span class="pointer" @click="$router.push({name: item.url})">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </el-scrollbar>

      <el-dialog
        v-if="editDialogVisible"
        :title="`${dialogType === 'quickEnter' ? '编辑菜单' : '编辑快捷操作'}`"
        :visible.sync="editDialogVisible"
        width="680px"
        center>
        <edit-dialog
          :visible.sync="editDialogVisible"
          :quickBtnList="quickBtn"
          :quickEnterList="quickEnter"
          :dialogType="dialogType"
          @quickBtn="getQuickBtn"
          @quickEnter="getQuickEnter">
        </edit-dialog>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/home'
import editDialog from './dialog/edit-dialog'

export default {
  name: 'home',
  data () {
    return {
      dialogType: '',
      editDialogVisible: false,
      summary: [
        { icon: 'icon-data_People', num: 0, text: '今日识别人数', numType: '人' },
        { icon: 'icon-data_success', num: 0, text: '今日识别总次数', numType: '次' },
        { icon: 'icon-data_People', num: 0, text: '昨日识别人数', numType: '人' },
        { icon: 'icon-data_success', num: 0, text: '昨日识别总次数', numType: '次' }
      ],
      quickBtn: [],
      quickEnter: [],
      message: {}
    }
  },
  components: {
    editDialog
  },
  created () {
    this.getQuickEnter()
    this.getQuickBtn()
    this.getOverview()
  },
  methods: {
    getOverview () {
      api.overview().then(res => {
        if (res.success) {
          const { todayRecognitionEmpNum, todayRecognitionNum, yesterdayRecognitionEmpNum, yesterdayRecognitionNum } = res.data
          const numArr = [todayRecognitionEmpNum, todayRecognitionNum, yesterdayRecognitionEmpNum, yesterdayRecognitionNum]
          this.summary.forEach((ele, index) => {
            ele.num = numArr[index]
          })
        }
      })
    },
    getQuickEnter () {
      api.getQuickEnter().then(res => {
        if (res.success) {
          this.quickEnter = res.data
        }
      })
    },
    getQuickBtn () {
      api.getQuickBtn().then(res => {
        if (res.success) {
          this.quickBtn = res.data
        }
      })
    },
    handleShowDialog (type) {
      this.dialogType = type
      this.editDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.page__content{
  background: #f1f4f7;
  padding: 0;
}
.summary{
  width: 100%;
  height: 160px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  .summary__item{
    width: 25%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-right: 1px solid #e4e7ed;
    .iconfont{
      font-size: 40px;
      float: left;
    }
    .emp__num{
      float: left;
      margin-top: 2px;
      font-size: 30px;
      color: #606266;
      margin-left: 10px;
    }
    .emp__text{
      float: left;
      margin-top: 20px;
    }
  }
  .border--none{
    border: none;
  }
  .iconfont{
    color: #208ef2;
  }
}
.quick{
  padding: 0 20px;
  margin-bottom: 20px;
  background: #fff;
  .quick__title{
    // padding: 20px 20px 20px 0;
    height: 56px;
    line-height: 56px;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    border-bottom: 1px solid #e4e7ed;
    .iconfont{
      color: #c0c4cc;
      cursor: pointer;
    }
  }
  .quick__content{
    padding: 20px 20px;
    overflow: hidden;
    // display: flex;
    // justify-content: center;
    // flex-wrap: wrap;
    .el-button{
      width: 170px;
      margin: 10px 20px 10px 0;
    }
    .quick__enter--item{
      width: 170px;
      float: left;
      margin: 10px 0 20px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      .iconfont{
        color: #208ef2;
        font-size: 32px;
        padding-bottom: 5px;
      }
    }
    .empty__tip{
      width: 100%;
      height: 70px;
      line-height: 60px;
      text-align: center;
      font-size: 16px;
      color: #a1a1a1;
    }
  }
}

</style>
