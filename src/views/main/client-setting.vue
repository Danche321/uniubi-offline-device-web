<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">客户端设置</span>
    </div>
    <el-tabs v-model="activeName" class="page__box">
      <el-tab-pane label="客户端信息" name="client">
          <section class="client">
              <p>人员数量：{{clientInfo.personNum}}</p>
              <p>照片数量：{{clientInfo.photoNum}}</p>
              <p>识别记录数量：{{clientInfo.recordNum}}</p>
          </section>
          <section class="version-current">
              <p>当前版本：{{clientInfo.serverVersion}}</p>
          </section>
          <section class="version-arithmetic f-clear">
              <p class="fl">算法版本号：</p>
              <ul class="fl version-list">
                  <li v-for="(item, index) in clientInfo.arithmeticVersionList" :key="index">{{item}}</li>
              </ul>
          </section>
      </el-tab-pane>
      <el-tab-pane label="操作参数" name="params">
          <div class="params__tip">
              <span class="params__tip__text">人员、照片信息授权到设备时，是否需要设备存储注册照</span>
              <el-tooltip content="注册照会占用设备较多的存储空间" placement="right">
                  <i class="iconfont icon-remind"></i>
              </el-tooltip>
          </div>
          <el-radio-group v-model="storeImage" class="params__radio">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
          </el-radio-group>
          <el-button type="primary" @click="handleSave">保存</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { fetchClientInfo, fetchIsStore, setIsStore } from '@/api/main'
export default {
  name: 'clientSetting',
  data () {
    return {
      activeName: 'client',
      clientInfo: {
        personNum: '',
        photoNum: '',
        recordNum: '',
        serverVersion: '',
        arithmeticVersionList: []
      },
      storeImage: false
    }
  },
  created () {
    this.getClientInfo()
    this.getIsStore()
  },
  methods: {
    getClientInfo () {
      fetchClientInfo().then(res => {
        if (res.success) {
          this.clientInfo = res.data
        }
      })
    },
    getIsStore () {
      fetchIsStore().then(res => {
        if (res.success) {
          this.storeImage = res.data
        }
      })
    },
    handleSave () {
      const params = {
        storeImage: this.storeImage
      }
      setIsStore(params).then(res => {
        if (res.success) {
          this.$message.success('保存成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .el-tabs__header {
    margin-bottom: 24px;
  }
  .el-tabs__item {
    font-size: 16px;
  }
}
.page__box {
    background-color: #fff;
    width: 100%;
    padding: 10px 20px 0 20px;
    height: calc(100vh - 140px);
    min-height: 450px;
    box-sizing: border-box;
    .client{
        line-height: 28px;
        padding-bottom: 24px;
        border-bottom: 1px solid #E4E7ED;
    }
    .version-current{
        line-height: 28px;
        padding: 24px 0;
        border-bottom: 1px solid #E4E7ED;
    }
    .version-arithmetic{
        padding-top: 24px;
    }
    .params__tip{
        .params__tip__text{
            line-height: 28px;
        }
        .iconfont{
            margin-left: 10px;
            color: #ccc;
        }
    }
    .params__radio{
        display: block;
        margin: 10px 0 30px 0;
    }
  .version-list{
    li{
      line-height: 24px;
    }
  }
}
</style>
