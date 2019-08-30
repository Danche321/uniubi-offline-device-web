<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title">{{$t('main_client_setting_title')}}</span>
    </div>
    <el-tabs v-model="activeName" class="page__box">
      <el-tab-pane :label="$t('main_client_client_label')" name="client">
          <section class="client">
              <p>{{$t('main_client_client_personNum_label')}}{{clientInfo.personNum}}</p>
              <p>{{$t('main_client_client_photoNum_label')}}{{clientInfo.photoNum}}</p>
              <p>{{$t('main_client_client_recordNum_label')}}{{clientInfo.recordNum}}</p>
          </section>
          <section class="version-current">
              <p>{{$t('main_client_client_serverVersion_label')}}{{clientInfo.serverVersion}}</p>
          </section>
          <section class="version-arithmetic f-clear">
              <p class="fl">{{$t('main_client_client_version_arithmetic')}}</p>
              <ul class="fl version-list">
                  <li v-for="(item, index) in clientInfo.arithmeticVersionList" :key="index">{{item}}</li>
              </ul>
          </section>
      </el-tab-pane>
      <el-tab-pane :label="$t('main_client_params_label')" name="params">
          <div class="params__tip">
              <span class="params__tip__text">{{$t('main_client_params_tip_text')}}</span>
              <el-tooltip :content="$t('main_client_params_tip_content')" placement="right">
                  <i class="iconfont icon-remind"></i>
              </el-tooltip>
          </div>
          <el-radio-group v-model="storeImage" class="params__radio">
              <el-radio :label="true">{{$t('main_client_params_storeImage_true')}}</el-radio>
              <el-radio :label="false">{{$t('main_client_params_storeImage_false')}}</el-radio>
          </el-radio-group>
          <el-button type="primary" @click="handleSave">{{$t('main_client_params_submit_text')}}</el-button>
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
          this.$message.success(this,$t('main_client_handleSave_success'))
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
