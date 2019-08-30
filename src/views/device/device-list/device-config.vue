<!--  created by 钟小燕  at 2019/7/22 -->
<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>{{$t('device_config.title')}}
      </span>
    </div>
    <div class="page__content" v-show="pageShow">
      <el-scrollbar class="form-scroll config-scroll">
        <div class="container__content">
          <div class="params__form">
            <el-form ref="deviceSettingForm" :model="deviceSetting" class="form--custom form-setting--custom" label-position="top" :rules="checkRules" size="small">
              <el-tabs v-model="activeParent" class="header__tabs main-tab">
                <el-tab-pane :label="$t('device_config.generalParams.title')" class="general-params" name="first">
                  <el-switch
                    class="mt5 mb10"
                    v-model="tabActive.tab1"
                    :active-value="true"
                    :inactive-value="false"
                    @change="tabActiveChange(1)">
                  </el-switch>
                  <template>
                    <el-form-item prop="saveIdentifyTime" class="error-margin-left34" :class="{ 'el-form-item--disabled': !checked.saveIdentifyTime }">
                      <el-checkbox v-model="checked.saveIdentifyTime" :disabled="!tabActive.tab1"></el-checkbox>
                      <span class="form__label ml14">
                        {{$t('device_config.generalParams.timeWindow')}}
                        <el-tooltip :content="$t('device_config.generalParams.timeWindowTip')" placement="right">
                          <i class="iconfont icon-remind"></i>
                        </el-tooltip>
                      </span>
                      <div class="mb5 ml34">
                        <el-input v-model="deviceSetting.saveIdentifyTime" :disabled="!checked.saveIdentifyTime"></el-input> {{$t('device_config.generalParams.second')}}
                      </div>
                    </el-form-item>
                    <el-form-item prop="recRank">
                      <el-checkbox v-model="checked.recRank" :disabled="!tabActive.tab1"></el-checkbox>
                      <span class="form__label ml14">
                        {{$t('device_config.generalParams.recRank')}}
                        <el-tooltip placement="right" :content="$t('device_config.generalParams.recRankTip')">
                          <i class="iconfont icon-remind"></i>
                        </el-tooltip>
                        <el-switch
                          class="ml10"
                          v-model="deviceSetting.recRank"
                          :active-value="3"
                          :inactive-value="1"
                          :disabled="!checked.recRank"
                          @change="changeComRecRank">
                        </el-switch>
                      </span>
                    </el-form-item>
                    <el-form-item prop="identifyDistance">
                      <el-checkbox v-model="checked.identifyDistance" :disabled="!tabActive.tab1"></el-checkbox>
                      <span class="form__label ml14">
                        {{$t('device_config.generalParams.identifyDistance')}}
                        <el-tooltip placement="right" :content="$t('device_config.generalParams.identifyDistanceTip')">
                          <i class="iconfont icon-remind"></i>
                        </el-tooltip>
                      </span>
                      <div :attr="deviceSetting.recRank" class="ml34">
                        <el-radio v-model="deviceSetting.identifyDistance" :label="1" :disabled="!checked.identifyDistance">0.5{{$t('device_config.generalParams.miDistance')}}</el-radio>
                        <el-radio v-model="deviceSetting.identifyDistance" :label="2" :disabled="!checked.identifyDistance">1{{$t('device_config.generalParams.miDistance')}}</el-radio>
                        <el-radio v-model="deviceSetting.identifyDistance" :label="3" :disabled="!checked.identifyDistance" v-show="deviceSetting.recRank === 1">1.5{{$t('device_config.generalParams.miDistance')}}</el-radio>
                        <el-radio v-model="deviceSetting.identifyDistance" :label="4" :disabled="!checked.identifyDistance" v-show="deviceSetting.recRank === 1">2{{$t('device_config.generalParams.miDistance')}}</el-radio>
                        <el-radio v-model="deviceSetting.identifyDistance" :label="5" :disabled="!checked.identifyDistance" v-show="deviceSetting.recRank === 1">3{{$t('device_config.generalParams.miDistance')}}</el-radio>
                        <el-radio v-model="deviceSetting.identifyDistance" :label="6" :disabled="!checked.identifyDistance" v-show="deviceSetting.recRank === 1">4{{$t('device_config.generalParams.miDistance')}}</el-radio>
                        <el-radio v-model="deviceSetting.identifyDistance" :label="100" :disabled="!checked.identifyDistance" v-show="deviceSetting.recRank === 1">{{$t('device_config.generalParams.noDistance')}}</el-radio>
                      </div>
                    </el-form-item>
                    <el-form-item prop="delayTimeForCloseDoor" class="delayTimeForCloseDoor error-margin-left34" :class="{ 'el-form-item--disabled': !checked.delayTimeForCloseDoor }">
                      <el-checkbox v-model="checked.delayTimeForCloseDoor" :disabled="!tabActive.tab1"></el-checkbox>
                      <span class="form__label ml14">
                        {{$t('device_config.generalParams.delayTimeForCloseDoor')}}
                        <el-tooltip placement="right">
                          <div slot="content">{{$t('device_config.generalParams.delayTimeForCloseDoor_tip1')}}<br />{{$t('device_config.generalParams.delayTimeForCloseDoor_tip2')}}</div>
                          <i class="iconfont icon-remind"></i>
                        </el-tooltip>
                      </span>
                      <div class="ml34">
                        <el-input v-model="deviceSetting.delayTimeForCloseDoor" :disabled="!checked.delayTimeForCloseDoor" class="mr5"></el-input>ms
                      </div>
                    </el-form-item>
                  </template>
                </el-tab-pane>
                <el-tab-pane :label="$t('device_config.identifyParams.title')" name="second">
                  <template>
                    <el-tabs v-model="activeChild" class="tabs--button">
                      <el-tab-pane :label="$t('device_config.identifyParams.successParams')" name="first">
                        <el-switch
                          class="mt5 mb10"
                          v-model="tabActive.tab2"
                          :active-value="true"
                          :inactive-value="false"
                          @change="tabActiveChange(2)">
                        </el-switch>
                        <el-form-item prop="ttsModType" :class="{'f-margin-bottom0': deviceSetting.ttsModType === 100}">
                          <el-checkbox v-model="checked.ttsModType" :disabled="!tabActive.tab2"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.ttsModType')}}
                            <el-tooltip placement="right" :content="$t('device_config.identifyParams.ttsModTypeTip')">
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                          </span>
                          <div class="ml34">
                            <el-radio v-model="deviceSetting.ttsModType" :disabled="!checked.ttsModType" :label="2">{{$t('device_config.identifyParams.modName')}}</el-radio>
                            <el-radio v-model="deviceSetting.ttsModType" :disabled="!checked.ttsModType" :label="1">{{$t('device_config.identifyParams.modNone')}}</el-radio>
                            <el-radio v-model="deviceSetting.ttsModType" :disabled="!checked.ttsModType" :label="100">{{$t('device_config.identifyParams.modCustom')}}</el-radio>
                          </div>
                        </el-form-item>
                        <el-form-item class="ml34" prop="ttsModContent" v-show="deviceSetting.ttsModType === 100" :class="{ 'el-form-item--disabled': !checked.ttsModType }">
                          <el-input v-model="deviceSetting.ttsModContent" :disabled="!checked.ttsModType" :placeholder="$t('device_config.identifyParams.ttsModTypeTip2')"></el-input>
                          <div class="form__tip--bottom">{{$t('device_config.identifyParams.ttsModTypeExample')}}</div>
                        </el-form-item>
                        <el-form-item prop="displayModType" :class="{'f-margin-bottom0': deviceSetting.displayModType === 100}">
                          <el-checkbox v-model="checked.displayModType" :disabled="!tabActive.tab2"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.screen1')}}
                            <el-tooltip placement="right">
                              <div slot="content" class="form__tip--img"><img src="@/assets/images/device/suc-screen1.png" alt=""></div>
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                          </span>
                          <div class="ml34">
                            <el-radio v-model="deviceSetting.displayModType" :disabled="!checked.displayModType" :label="1">{{$t('device_config.identifyParams.screen1ShowName')}}</el-radio>
                            <el-radio v-model="deviceSetting.displayModType" :disabled="!checked.displayModType" :label="2">{{$t('device_config.identifyParams.screen1ShowNone')}}</el-radio>
                            <el-radio v-model="deviceSetting.displayModType" :disabled="!checked.displayModType" :label="100">{{$t('device_config.identifyParams.screen1ShowCustom')}}</el-radio>
                          </div>
                        </el-form-item>
                        <el-form-item class="ml34" prop="displayModContent" v-show="deviceSetting.displayModType === 100" :class="{ 'el-form-item--disabled': !checked.displayModType }">
                          <el-input v-model="deviceSetting.displayModContent" :disabled="!checked.displayModType" :placeholder="$t('device_config.identifyParams.ttsModTypeTip2')"></el-input>
                          <div class="form__tip--bottom">{{$t('device_config.identifyParams.ttsModTypeExample')}}</div>
                        </el-form-item>
                        <el-form-item prop="recSucDisplayText2Type" :class="{'f-margin-bottom0': deviceSetting.recSucDisplayText2Type === 100}">
                          <el-checkbox v-model="checked.recSucDisplayText2Type" :disabled="!tabActive.tab2"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.screen2')}}
                            <el-tooltip placement="right">
                              <div slot="content" class="form__tip--img"><img src="@/assets/images/device/suc-screen2.png" alt=""></div>
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                          </span>
                          <div class="ml34">
                            <el-radio v-model="deviceSetting.recSucDisplayText2Type" :disabled="!checked.recSucDisplayText2Type" :label="1">{{$t('device_config.identifyParams.screen2IdentifySuccess')}}</el-radio>
                            <el-radio v-model="deviceSetting.recSucDisplayText2Type" :disabled="!checked.recSucDisplayText2Type" :label="100">{{$t('device_config.identifyParams.screen2Custom')}}</el-radio>
                          </div>
                        </el-form-item>
                        <el-form-item class="ml34" prop="recSucDisplayText2Content" v-show="deviceSetting.recSucDisplayText2Type === 100" :class="{ 'el-form-item--disabled': !checked.recSucDisplayText2Type }">
                          <el-input v-model="deviceSetting.recSucDisplayText2Content" :disabled="!checked.recSucDisplayText2Type" :placeholder="$t('device_config.identifyParams.ttsModTypeTip2')"></el-input>
                          <div class="form__tip--bottom">{{$t('device_config.identifyParams.ttsModTypeExample')}}</div>
                        </el-form-item>
                        <el-form-item prop="comModType" :class="{'f-margin-bottom0': deviceSetting.comModType === 100}">
                          <el-checkbox v-model="checked.comModType" :disabled="!tabActive.tab2"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.comModType')}}
                            <el-tooltip placement="right">
                              <div slot="content">
                                {{$t('device_config.identifyParams.comModTypeTip1')}}：<br />
                                {{$t('device_config.identifyParams.comModTypeTip2')}}<br />
                                {{$t('device_config.identifyParams.comModTypeTip3')}}
                              </div>
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                          </span>
                          <div class="ml34">
                            <el-radio v-model="deviceSetting.comModType" :disabled="!checked.comModType" :label="1">{{$t('device_config.identifyParams.comModTypeOpen')}}</el-radio>
                            <el-radio v-model="deviceSetting.comModType" :disabled="!checked.comModType" :label="2">{{$t('device_config.identifyParams.comModTypeNoOutPut')}}</el-radio>
                            <el-radio v-model="deviceSetting.comModType" :disabled="!checked.comModType" :label="3">{{$t('device_config.identifyParams.comModTypeOutPutId')}}</el-radio>
                            <el-radio v-model="deviceSetting.comModType" :disabled="!checked.comModType" :label="4">{{$t('device_config.identifyParams.comModTypeOutPutCard')}}</el-radio>
                            <el-radio v-model="deviceSetting.comModType" :disabled="!checked.comModType" :label="5">{{$t('device_config.identifyParams.comModTypeOutPutPhone')}}</el-radio>
                            <el-radio v-model="deviceSetting.comModType" :disabled="!checked.comModType" :label="100">{{$t('device_config.identifyParams.comModTypeCustom')}}</el-radio>
                          </div>
                        </el-form-item>
                        <el-form-item class="f-margin-bottom25 ml34" prop="comModContent" v-show="deviceSetting.comModType === 100" :class="{ 'el-form-item--disabled': !checked.comModType }">
                          <el-input v-model="deviceSetting.comModContent" :disabled="!checked.comModType" :placeholder="$t('device_config.identifyParams.ttsModTypeTip3')"></el-input>
                        </el-form-item>
                        <el-form-item prop="recSucWiegandType" :class="{'f-margin-bottom0': deviceSetting.recSucWiegandType === 2 || deviceSetting.recSucWiegandType === 3}">
                          <el-checkbox v-model="checked.recSucWiegandType" :disabled="!tabActive.tab2"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.recSucWiegandType')}}
                            <el-tooltip placement="right">
                              <div slot="content">{{$t('device_config.identifyParams.recSucWiegandTypeTip')}}</div>
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                          </span>
                          <div class="ml34">
                            <el-radio v-model="deviceSetting.recSucWiegandType" :disabled="!checked.recSucWiegandType" :label="1">{{$t('device_config.identifyParams.recSucWiegandTypeNoOutput')}}</el-radio>
                            <el-radio v-model="deviceSetting.recSucWiegandType" :disabled="!checked.recSucWiegandType" :label="2">{{$t('device_config.identifyParams.recSucWiegandTypeWk')}}26</el-radio>
                            <el-radio v-model="deviceSetting.recSucWiegandType" :disabled="!checked.recSucWiegandType" :label="3">{{$t('device_config.identifyParams.recSucWiegandTypeWk')}}34</el-radio>
                          </div>
                        </el-form-item>
                        <el-form-item class="f-margin-bottom25 ml34" prop="recSucWiegandContent" :class="{ 'el-form-item--disabled': !checked.recSucWiegandType }" v-show="(deviceSetting.recSucWiegandType === 2 || deviceSetting.recSucWiegandType === 3)">
                          <el-input v-model="deviceSetting.recSucWiegandContent" :disabled="!checked.recSucWiegandType" :placeholder="$t('device_config.identifyParams.onlyNumber')"></el-input>
                        </el-form-item>
                        <el-form-item prop="isOpenRelay">
                          <el-checkbox v-model="checked.isOpenRelay" :disabled="!tabActive.tab2"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.isOpenRelay')}}
                            <el-tooltip placement="right" :content="$t('device_config.identifyParams.isOpenRelayTip')">
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                            <el-switch
                              class="ml5"
                              v-model="deviceSetting.isOpenRelay"
                              :disabled="!checked.isOpenRelay"
                              :active-value="1"
                              :inactive-value="2">
                            </el-switch>
                          </span>
                        </el-form-item>
                      </el-tab-pane>
                      <el-tab-pane :label="$t('device_config.identifyParams.failParams')" name="second">
                        <el-switch
                          class="mt5 mb10"
                          v-model="tabActive.tab3"
                          :active-value="true"
                          :inactive-value="false"
                          @change="tabActiveChange(3)">
                        </el-switch>
                        <el-form-item prop="recStrangerType">
                          <el-checkbox v-model="checked.recStrangerType" :disabled="!tabActive.tab3"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.identifyFail')}}
                            <el-tooltip placement="right" :content="$t('device_config.identifyParams.identifyFailTip')">
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                            <el-switch
                              class="ml10"
                              v-model="deviceSetting.recStrangerType"
                              :disabled="!checked.recStrangerType"
                              :active-value="2"
                              :inactive-value="1">
                            </el-switch>
                          </span>
                        </el-form-item>
                        <div v-if="deviceSetting.recStrangerType === 2">
                          <el-form-item prop="recStrangerTimesThreshold" class="error-margin-left34" :class="{ 'el-form-item--disabled': !checked.recStrangerTimesThreshold }">
                            <el-checkbox v-model="checked.recStrangerTimesThreshold" :disabled="!tabActive.tab3"></el-checkbox>
                            <span class="form__label ml14">
                              {{$t('device_config.identifyParams.identifyFailCount')}}
                              <el-tooltip placement="right" :content="$t('device_config.identifyParams.identifyFailCountTip')">
                                <i class="iconfont icon-remind"></i>
                              </el-tooltip>
                            </span>
                            <div class="mb10 ml34">
                              <el-input v-model="deviceSetting.recStrangerTimesThreshold" :disabled="!checked.recStrangerTimesThreshold"></el-input>
                            </div>
                          </el-form-item>
                          <el-form-item prop="ttsModStrangerType" :class="{'f-margin-bottom0': deviceSetting.ttsModStrangerType === 100}">
                            <el-checkbox v-model="checked.ttsModStrangerType" :disabled="!tabActive.tab3"></el-checkbox>
                            <span class="form__label ml14">
                              {{$t('device_config.identifyParams.ttsModType')}}
                              <el-tooltip placement="right" :content="$t('device_config.identifyParams.modFailContent')">
                                <i class="iconfont icon-remind"></i>
                              </el-tooltip>
                            </span>
                            <div class="ml34">
                              <el-radio v-model="deviceSetting.ttsModStrangerType" :disabled="!checked.ttsModStrangerType" :label="3">{{$t('device_config.identifyParams.modFailContent2')}}</el-radio>
                              <el-radio v-model="deviceSetting.ttsModStrangerType" :disabled="!checked.ttsModStrangerType" :label="1">{{$t('device_config.identifyParams.modNone')}}</el-radio>
                              <el-radio v-model="deviceSetting.ttsModStrangerType" :disabled="!checked.ttsModStrangerType" :label="100">{{$t('device_config.identifyParams.modCustom')}}</el-radio>
                            </div>
                          </el-form-item>
                          <el-form-item class="ml34" prop="ttsModStrangerContent" v-show="deviceSetting.ttsModStrangerType === 100" :class="{ 'el-form-item--disabled': !checked.ttsModStrangerType }">
                            <el-input v-model="deviceSetting.ttsModStrangerContent" :disabled="!checked.ttsModStrangerType" placeholder="$t('device_config.identifyParams.modRule')"></el-input>
                            <div class="form__tip--bottom">{{$t('device_config.identifyParams.modExample')}}</div>
                          </el-form-item>
                          <el-form-item prop="displayModStrangerType" :class="{'f-margin-bottom0': deviceSetting.displayModStrangerType === 100}">
                            <el-checkbox v-model="checked.displayModStrangerType" :disabled="!tabActive.tab3"></el-checkbox>
                            <span class="form__label ml14">
                              {{$t('device_config.identifyParams.screenShowText')}}
                              <el-tooltip placement="right">
                                <div slot="content" class="form__tip--img"><img src="@/assets/images/device/fail-screen.png" :alt="$t('device_config.identifyParams.screenShowText')"></div>
                                <i class="iconfont icon-remind"></i>
                              </el-tooltip>
                            </span>
                            <div class="ml34">
                              <el-radio v-model="deviceSetting.displayModStrangerType" :disabled="!checked.displayModStrangerType" :label="1">{{$t('device_config.identifyParams.showFail')}}</el-radio>
                              <el-radio v-model="deviceSetting.displayModStrangerType" :disabled="!checked.displayModStrangerType" :label="100">{{$t('device_config.identifyParams.screen2Custom')}}</el-radio>
                            </div>
                          </el-form-item>
                          <el-form-item class="ml34" prop="displayModStrangerContent" v-show="deviceSetting.displayModStrangerType === 100" :class="{ 'el-form-item--disabled': !checked.displayModStrangerType }">
                            <el-input v-model="deviceSetting.displayModStrangerContent" :disabled="!checked.displayModStrangerType" :placeholder="$t('device_config.identifyParams.modRule2')"></el-input>
                            <div class="form__tip--bottom">{{$t('device_config.identifyParams.modExample')}}</div>
                          </el-form-item>
                          <el-form-item prop="serialOutMode" :class="{'f-margin-bottom0': deviceSetting.serialOutMode === 2}">
                            <el-checkbox v-model="checked.serialOutMode" :disabled="!tabActive.tab3"></el-checkbox>
                            <span class="form__label ml14">
                              {{$t('device_config.identifyParams.comModType')}}
                              <el-tooltip placement="right">
                                <div slot="content">
                                  {{$t('device_config.identifyParams.thunkModeTip1')}}<br />
                                  {{$t('device_config.identifyParams.thunkModeTip2')}}
                                </div>
                                <i class="iconfont icon-remind"></i>
                              </el-tooltip>
                            </span>
                            <div class="ml34">
                              <el-radio v-model="deviceSetting.serialOutMode" :disabled="!checked.serialOutMode" :label="1">{{$t('device_config.identifyParams.comModTypeOpen')}}</el-radio>
                              <el-radio v-model="deviceSetting.serialOutMode" :disabled="!checked.serialOutMode" :label="3">{{$t('device_config.identifyParams.comModTypeNoOutPut')}}</el-radio>
                              <el-radio v-model="deviceSetting.serialOutMode" :disabled="!checked.serialOutMode" :label="2">{{$t('device_config.identifyParams.screen2Custom')}}</el-radio>
                            </div>
                          </el-form-item>
                          <el-form-item class="ml34" prop="serialOutContent" v-show="deviceSetting.serialOutMode === 2" :class="{ 'el-form-item--disabled': !checked.serialOutMode }">
                            <el-input v-model="deviceSetting.serialOutContent" :disabled="!checked.serialOutMode" :placeholder="$t('device_config.identifyParams.modRule4')"></el-input>
                          </el-form-item>
                          <el-form-item prop="recFailWiegandType" :class="{'f-margin-bottom0': deviceSetting.recFailWiegandType === 2 || deviceSetting.recFailWiegandType === 3}">
                            <el-checkbox v-model="checked.recFailWiegandType" :disabled="!tabActive.tab3"></el-checkbox>
                            <span class="form__label ml14">
                              {{$t('device_config.identifyParams.recSucWiegandType')}}
                              <el-tooltip placement="right">
                                <div slot="content">{{$t('device_config.identifyParams.thunkModeTip3')}}</div>
                                <i class="iconfont icon-remind"></i>
                              </el-tooltip>
                            </span>
                            <div class="ml34">
                              <el-radio v-model="deviceSetting.recFailWiegandType" :disabled="!checked.recFailWiegandType" :label="1">{{$t('device_config.identifyParams.recSucWiegandTypeNoOutput')}}</el-radio>
                              <el-radio v-model="deviceSetting.recFailWiegandType" :disabled="!checked.recFailWiegandType" :label="2">{{$t('device_config.identifyParams.recSucWiegandTypeWk')}}26</el-radio>
                              <el-radio v-model="deviceSetting.recFailWiegandType" :disabled="!checked.recFailWiegandType" :label="3">{{$t('device_config.identifyParams.recSucWiegandTypeWk')}}34</el-radio>
                            </div>
                          </el-form-item>
                          <el-form-item class="ml34" prop="recFailWiegandContent" :class="{ 'el-form-item--disabled': !checked.recFailWiegandType }" v-show="(deviceSetting.recFailWiegandType === 2 || deviceSetting.recFailWiegandType === 3)">
                            <el-input v-model="deviceSetting.recFailWiegandContent" :disabled="!checked.recFailWiegandType" :placeholder="$t('device_config.identifyParams.onlyNumber')"></el-input>
                          </el-form-item>
                          <el-form-item prop="relaySwitch">
                            <el-checkbox v-model="checked.relaySwitch" :disabled="!tabActive.tab3"></el-checkbox>
                            <span class="form__label ml14">
                              {{$t('device_config.identifyParams.isOpenRelay')}}
                              <el-tooltip placement="right" :content="$t('device_config.identifyParams.isOpenRelayTip')">
                                <i class="iconfont icon-remind"></i>
                              </el-tooltip>
                              <el-switch
                                class="ml5"
                                v-model="deviceSetting.relaySwitch"
                                :disabled="!checked.relaySwitch"
                                :active-value="1"
                                :inactive-value="2">
                              </el-switch>
                            </span>
                          </el-form-item>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane :label="$t('device_config.identifyParams.noAccessParams')" name="third">
                        <el-switch
                          class="mt5 mb10"
                          v-model="tabActive.tab4"
                          :active-value="true"
                          :inactive-value="false"
                          @change="tabActiveChange(4)">
                        </el-switch>
                        <el-form-item>
                          <span class="form__label">
                            {{$t('device_config.identifyParams.noAccessParams')}}<br />
                          <span class="f-gray">{{$t('device_config.identifyParams.noAccessParamsTip')}}</span>
                          </span>
                        </el-form-item>
                        <el-form-item prop="recNoPerTtsModeType" :class="{'f-margin-bottom0': deviceSetting.recNoPerTtsModeType === 100}">
                          <el-checkbox v-model="checked.recNoPerTtsModeType" :disabled="!tabActive.tab4"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.ttsModType')}}
                            <el-tooltip placement="right" :content="$t('device_config.identifyParams.noAccessModTip')">
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                          </span>
                          <div class="ml34">
                            <el-radio v-model="deviceSetting.recNoPerTtsModeType" :disabled="!checked.recNoPerTtsModeType" :label="1">{{$t('device_config.identifyParams.noAccessNameTip')}}</el-radio>
                            <el-radio v-model="deviceSetting.recNoPerTtsModeType" :disabled="!checked.recNoPerTtsModeType" :label="2">{{$t('device_config.identifyParams.modNone')}}</el-radio>
                            <el-radio v-model="deviceSetting.recNoPerTtsModeType" :disabled="!checked.recNoPerTtsModeType" :label="100">{{$t('device_config.identifyParams.modCustom')}}</el-radio>
                          </div>
                        </el-form-item>
                        <el-form-item class="ml34" prop="recNoPerTtsModeContent" v-show="deviceSetting.recNoPerTtsModeType === 100" :class="{ 'el-form-item--disabled': !checked.recNoPerTtsModeType }">
                          <el-input v-model="deviceSetting.recNoPerTtsModeContent" :disabled="!checked.recNoPerTtsModeType" :placeholder="$t('device_config.identifyParams.modRule3')"></el-input>
                          <div class="form__tip--bottom">{{$t('device_config.identifyParams.nameExample')}}</div>
                        </el-form-item>
                        <el-form-item prop="recNoPerDisplayText1Type" :class="{'f-margin-bottom0': deviceSetting.recNoPerDisplayText1Type === 100}">
                          <el-checkbox v-model="checked.recNoPerDisplayText1Type" :disabled="!tabActive.tab4"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.screen1')}}
                            <el-tooltip placement="right">
                              <div slot="content" class="form__tip--img"><img src="@/assets/images/device/noper-screen1.png" :alt="$t('device_config.identifyParams.screen1')"></div>
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                          </span>
                          <div class="ml34">
                            <el-radio v-model="deviceSetting.recNoPerDisplayText1Type" :disabled="!checked.recNoPerDisplayText1Type" :label="1">{{$t('device_config.identifyParams.name')}}</el-radio>
                            <el-radio v-model="deviceSetting.recNoPerDisplayText1Type" :disabled="!checked.recNoPerDisplayText1Type" :label="100">{{$t('device_config.identifyParams.screen2Custom')}}</el-radio>
                          </div>
                        </el-form-item>
                        <el-form-item class="ml34" prop="recNoPerDisplayText1Content" v-show="deviceSetting.recNoPerDisplayText1Type === 100" :class="{ 'el-form-item--disabled': !checked.recNoPerDisplayText1Type }">
                          <el-input v-model="deviceSetting.recNoPerDisplayText1Content" :disabled="!checked.recNoPerDisplayText1Type" :placeholder="$t('device_config.identifyParams.deviceRule3')"></el-input>
                          <div class="form__tip--bottom">{{$t('device_config.identifyParams.nameRule3')}}</div>
                        </el-form-item>
                        <el-form-item prop="recNoPerDisplayText2Type" :class="{'f-margin-bottom0': deviceSetting.recNoPerDisplayText2Type === 100}">
                          <el-checkbox v-model="checked.recNoPerDisplayText2Type" :disabled="!tabActive.tab4"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.screen2')}}
                            <el-tooltip placement="right">
                              <div slot="content" class="form__tip--img"><img src="@/assets/images/device/noper-screen2.png" :alt="$t('device_config.identifyParams.screen2')"></div>
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                          </span>
                          <div class="ml34">
                            <el-radio v-model="deviceSetting.recNoPerDisplayText2Type" :disabled="!checked.recNoPerDisplayText2Type" :label="1">{{$t('device_config.identifyParams.noAccess')}}</el-radio>
                            <el-radio v-model="deviceSetting.recNoPerDisplayText2Type" :disabled="!checked.recNoPerDisplayText2Type" :label="100">{{$t('device_config.identifyParams.modCustom')}}</el-radio>
                          </div>
                        </el-form-item>
                        <el-form-item class="ml34" prop="recNoPerDisplayText2Content" :class="{ 'el-form-item--disabled': !checked.recNoPerDisplayText2Type }" v-show="deviceSetting.recNoPerDisplayText2Type === 100">
                          <el-input v-model="deviceSetting.recNoPerDisplayText2Content" :disabled="!checked.recNoPerDisplayText2Type" :placeholder="$t('device_config.identifyParams.deviceRule3')"></el-input>
                          <div class="form__tip--bottom">{{$t('device_config.identifyParams.nameRule3')}}</div>
                        </el-form-item>
                        <el-form-item prop="recNoPerComModeType" :class="{'f-margin-bottom0': deviceSetting.recNoPerComModeType === 100}">
                          <el-checkbox v-model="checked.recNoPerComModeType" :disabled="!tabActive.tab4"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.comModType')}}
                            <el-tooltip placement="right">
                              <div slot="content">
                                  {{$t('device_config.identifyParams.thunkTip1')}}<br />
                                  {{$t('device_config.identifyParams.thunkTip2')}}<br />
                                  {{$t('device_config.identifyParams.recSucWiegandTypeTip')}}
                                </div>
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                          </span>
                          <div class="ml34">
                            <el-radio v-model="deviceSetting.recNoPerComModeType" :disabled="!checked.recNoPerComModeType" :label="1">{{$t('device_config.identifyParams.comModTypeOpen')}}</el-radio>
                            <el-radio v-model="deviceSetting.recNoPerComModeType" :disabled="!checked.recNoPerComModeType" :label="2">{{$t('device_config.identifyParams.comModTypeNoOutPut')}}</el-radio>
                            <el-radio v-model="deviceSetting.recNoPerComModeType" :disabled="!checked.recNoPerComModeType" :label="3">{{$t('device_config.identifyParams.comModTypeOutPutId')}}</el-radio>
                            <el-radio v-model="deviceSetting.recNoPerComModeType" :disabled="!checked.recNoPerComModeType" :label="4">{{$t('device_config.identifyParams.comModTypeOutPutCard')}}</el-radio>
                            <el-radio v-model="deviceSetting.recNoPerComModeType" :disabled="!checked.recNoPerComModeType" :label="5">{{$t('device_config.identifyParams.comModTypeOutPutPhone')}}</el-radio>
                            <el-radio v-model="deviceSetting.recNoPerComModeType" :disabled="!checked.recNoPerComModeType" :label="100">{{$t('device_config.identifyParams.comModTypeCustom')}}</el-radio>
                          </div>
                        </el-form-item>
                        <el-form-item class="ml34" prop="recNoPerComModeContent" :class="{ 'el-form-item--disabled': !checked.recNoPerComModeType }" v-show="deviceSetting.recNoPerComModeType === 100">
                          <el-input v-model="deviceSetting.recNoPerComModeContent" :disabled="!checked.recNoPerComModeType" :placeholder="$t('device_config.identifyParams.thunkTip4')"></el-input>
                        </el-form-item>
                        <el-form-item prop="recNoPerWiegandType" :class="{'f-margin-bottom0': deviceSetting.recNoPerWiegandType === 2 || deviceSetting.recNoPerWiegandType === 3}">
                          <el-checkbox v-model="checked.recNoPerWiegandType" :disabled="!tabActive.tab4"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.recSucWiegandType')}}
                            <el-tooltip placement="right">
                              <div slot="content">{{$t('device_config.identifyParams.recSucWiegandTypeTip')}}</div>
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                          </span>
                          <div class="ml34">
                            <el-radio v-model="deviceSetting.recNoPerWiegandType" :disabled="!checked.recNoPerWiegandType" :label="1">{{$t('device_config.identifyParams.comModTypeNoOutPut')}}</el-radio>
                            <el-radio v-model="deviceSetting.recNoPerWiegandType" :disabled="!checked.recNoPerWiegandType" :label="2">{{$t('device_config.identifyParams.recSucWiegandTypeWk')}}26</el-radio>
                            <el-radio v-model="deviceSetting.recNoPerWiegandType" :disabled="!checked.recNoPerWiegandType" :label="3">{{$t('device_config.identifyParams.recSucWiegandTypeWk')}}34</el-radio>
                          </div>
                        </el-form-item>
                        <el-form-item class="ml34" prop="recNoPerWiegandContent" :class="{ 'el-form-item--disabled': !checked.recNoPerWiegandType }" v-show="(deviceSetting.recNoPerWiegandType === 2 || deviceSetting.recNoPerWiegandType === 3)">
                          <el-input v-model="deviceSetting.recNoPerWiegandContent" :disabled="!checked.recNoPerWiegandType" :placeholder="$t('device_config.identifyParams.onlyNumber')"></el-input>
                        </el-form-item>
                        <el-form-item prop="recNoPerRelayType">
                          <el-checkbox v-model="checked.recNoPerRelayType" :disabled="!tabActive.tab4"></el-checkbox>
                          <span class="form__label ml14">
                            {{$t('device_config.identifyParams.isOpenRelay')}}
                            <el-tooltip placement="right" :content="$t('device_config.identifyParams.isOpenRelayTip')">
                              <i class="iconfont icon-remind"></i>
                            </el-tooltip>
                            <el-switch
                              class="ml5"
                              v-model="deviceSetting.recNoPerRelayType"
                              :disabled="!checked.recNoPerRelayType"
                              :active-value="1"
                              :inactive-value="2">
                            </el-switch>
                          </span>
                        </el-form-item>
                      </el-tab-pane>
                    </el-tabs>
                  </template>
                </el-tab-pane>
                <el-tab-pane :label="$t('device_config.showParams.title')" name="third">
                  <el-switch
                    class="mt5 mb10"
                    v-model="tabActive.tab5"
                    :active-value="true"
                    :inactive-value="false"
                    @change="tabActiveChange(5)">
                  </el-switch>
                  <el-form-item prop="orientation">
                    <el-checkbox v-model="checked.orientation" :disabled="!tabActive.tab5"></el-checkbox>
                    <span class="form__label ml14">{{$t('device_config.showParams.screenArrow')}}</span>
                    <div class="ml34">
                      <el-radio v-model="deviceSetting.orientation" :disabled="!checked.orientation" :label="1">{{$t('device_config.showParams.arrowAcross')}}</el-radio>
                      <el-tooltip placement="right">
                        <div slot="content" class="form__tip--img"><img class="horizontal" src="@/assets/images/device/screen-horizontal.png" :alt="$t('device_config.showParams.arrowAcross')"></div>
                        <i class="iconfont icon-remind radio--tip"></i>
                      </el-tooltip>
                      <el-radio v-model="deviceSetting.orientation" :disabled="!checked.orientation" :label="2">{{$t('device_config.showParams.arrowColumn')}}</el-radio>
                      <el-tooltip placement="right">
                        <div slot="content" class="form__tip--img"><img src="@/assets/images/device/screen-vertical.png" :alt="$t('device_config.showParams.arrowColumn')"></div>
                        <i class="iconfont icon-remind radio--tip"></i>
                      </el-tooltip>
                    </div>
                  </el-form-item>
                  <el-form-item prop="scrDisplayText1Type" :class="{'f-margin-bottom0': deviceSetting.scrDisplayText1Type === 100}">
                    <el-checkbox v-model="checked.scrDisplayText1Type" :disabled="!tabActive.tab5"></el-checkbox>
                    <span class="form__label ml14">{{$t('device_config.showParams.showText')}}1</span>
                    <div class="ml34">
                      <el-radio v-model="deviceSetting.scrDisplayText1Type" :disabled="!checked.scrDisplayText1Type" :label="1">{{$t('device_config.showParams.hidden')}}</el-radio>
                      <el-radio v-model="deviceSetting.scrDisplayText1Type" :disabled="!checked.scrDisplayText1Type" :label="2">{{$t('device_config.showParams.deviceGroup')}}</el-radio>
                      <el-radio v-model="deviceSetting.scrDisplayText1Type" :disabled="!checked.scrDisplayText1Type" :label="100">{{$t('device_config.showParams.custom')}}</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item class="ml34" prop="scrDisplayText1Content" :class="{ 'el-form-item--disabled': !checked.scrDisplayText1Type }" v-show="deviceSetting.scrDisplayText1Type === 100">
                    <el-input v-model="deviceSetting.scrDisplayText1Content" :disabled="!checked.scrDisplayText1Type" :placeholder="$t('device_config.showParams.scrDisplayText1Content')"></el-input>
                  </el-form-item>
                  <el-form-item prop="scrDisplayText2Type" :class="{'f-margin-bottom0': deviceSetting.scrDisplayText2Type === 100}">
                    <el-checkbox v-model="checked.scrDisplayText2Type" :disabled="!tabActive.tab5"></el-checkbox>
                    <span class="form__label ml14">{{$t('device_config.showParams.showText')}}2</span>
                    <div class="ml34" :disabled="!checked.scrDisplayText2Type">
                      <el-radio v-model="deviceSetting.scrDisplayText2Type" :disabled="!checked.scrDisplayText2Type" :label="1">{{$t('device_config.showParams.hidden')}}</el-radio>
                      <el-radio v-model="deviceSetting.scrDisplayText2Type" :disabled="!checked.scrDisplayText2Type" :label="2">{{$t('device_config.showParams.deviceName')}}</el-radio>
                      <el-radio v-model="deviceSetting.scrDisplayText2Type" :disabled="!checked.scrDisplayText2Type" :label="100">{{$t('device_config.showParams.custom')}}</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item class="ml34" prop="scrDisplayText2Content" :class="{ 'el-form-item--disabled': !checked.scrDisplayText2Type }" v-show="deviceSetting.scrDisplayText2Type === 100">
                    <el-input v-model="deviceSetting.scrDisplayText2Content" :disabled="!checked.scrDisplayText2Type" :placeholder="$t('device_config.showParams.scrDisplayText2Content')"></el-input>
                  </el-form-item>
                  <el-form-item prop="scrImage1Url">
                    <el-checkbox v-model="checked.scrImage1Url" :disabled="!tabActive.tab5"></el-checkbox>
                    <span class="form__label ml14">{{$t('device_config.showParams.showImg')}}1</span>
                    <div class="ml34 form__upload" :class="{ 'form__upload--disabled': !checked.scrImage1Url }">
                      <div v-if="deviceSetting.scrImage1Url" class="delete-img inline-block mb-11">
                        <img v-if="deviceSetting.scrImage1Url" :src="`${baseUrl}/file/image/${deviceSetting.scrImage1Url}`" class="avatar">
                        <div class="delete-icon" v-if="checked.scrImage1Url"><i class="iconfont icon-delete" @click="handleImageRemove('scrImage1Url')"></i></div>
                      </div>
                      <el-upload
                        v-else
                        class="inline-block"
                        action=""
                        :disabled="!checked.scrImage1Url"
                        :data="{target: 'scrImage1Url'}"
                        :before-upload="handleImageCheck"
                        :http-request="handleUpload"
                        :show-file-list="false"
                        :multiple="false">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                      <div class="el-upload__tip inline-block">
                        <el-tooltip placement="right">
                          <div slot="content" class="form__tip--img"><img class="logo" src="@/assets/images/device/default-image1.png" alt=""></div>
                          <el-button type="text" size="small">{{$t('device_config.showParams.previewDefaultImg')}}</el-button>
                        </el-tooltip>
                        <br/>{{$t('device_config.showParams.imgStandard1')}}
                        <br/>{{$t('device_config.showParams.imgStandard2')}}
                        <br/>{{$t('device_config.showParams.imgStandard3')}}
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-checkbox v-model="checked.scrImage2Url" :disabled="!tabActive.tab5"></el-checkbox>
                    <span class="form__label ml14">{{$t('device_config.showParams.showImg')}}2</span>
                    <div class="ml34 form__upload" :class="{ 'form__upload--disabled': !checked.scrImage2Url }">
                      <div v-if="deviceSetting.scrImage2Url" class="delete-img inline-block mb-11">
                        <img v-if="deviceSetting.scrImage2Url" :src="`${baseUrl}/file/image/${deviceSetting.scrImage2Url}`" class="avatar">
                        <div class="delete-icon" v-if="checked.scrImage2Url"><i class="iconfont icon-delete" @click="handleImageRemove('scrImage2Url')"></i></div>
                      </div>
                      <el-upload
                        v-else
                        class="inline-block"
                        action=""
                        :disabled="!checked.scrImage2Url"
                        :data="{target: 'scrImage2Url'}"
                        :before-upload="handleImageCheck"
                        :http-request="handleUpload"
                        :show-file-list="false"
                        :multiple="false">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                      <div class="el-upload__tip inline-block">
                        {{$t('device_config.showParams.imgStandard1')}}
                        <br/>{{$t('device_config.showParams.imgStandard2')}}
                        <br/>{{$t('device_config.showParams.imgStandard4')}}
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-checkbox v-model="checked.showIp" :disabled="!tabActive.tab5"></el-checkbox>
                    <span class="form__label ml14">{{$t('device_config.showParams.showConfig')}}</span>
                    <div class="show-setting__item ml34">
                      <el-checkbox v-model="deviceSetting.showIp" :disabled="!checked.showIp">IP</el-checkbox>
                      <el-checkbox v-model="deviceSetting.showDeviceKey" :disabled="!checked.showIp">{{$t('device_config.showParams.deviceKey')}}</el-checkbox>
                      <el-checkbox v-model="deviceSetting.showPeopleNum" :disabled="!checked.showIp">{{$t('device_config.showParams.personCount')}}</el-checkbox>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-checkbox v-model="checked.scrDisableUrl" :disabled="!tabActive.tab5"></el-checkbox>
                    <span class="form__label ml14">{{$t('device_config.showParams.disabledImg')}}</span>
                    <div class="ml34 form__upload" :class="{ 'form__upload--disabled': !checked.scrDisableUrl }">
                      <div v-if="deviceSetting.scrDisableUrl" class="delete-img inline-block mb-11">
                        <img v-if="deviceSetting.scrDisableUrl" :src="`${baseUrl}/file/image/${deviceSetting.scrDisableUrl}`" class="avatar">
                        <div class="delete-icon" v-if="checked.scrDisableUrl"><i class="iconfont icon-delete" @click="handleImageRemove('scrDisableUrl')"></i></div>
                      </div>
                      <el-upload
                        v-else
                        class="inline-block"
                        action=""
                        :disabled="!checked.scrDisableUrl"
                        :data="{target: 'scrDisableUrl'}"
                        :before-upload="handleImageCheck"
                        :http-request="handleUpload"
                        :show-file-list="false"
                        :multiple="false">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                      <div class="el-upload__tip inline-block">
                        <el-tooltip placement="right">
                          <div slot="content" class="form__tip--img"><img src="@/assets/images/device/default-image2.png" alt=""></div>
                          <el-button type="text" size="small">{{$t('device_config.showParams.previewDefaultImg')}}</el-button>
                        </el-tooltip>
                        <br/>{{$t('device_config.showParams.imgStandard1')}}
                        <br/>{{$t('device_config.showParams.imgStandard2')}}
                        <br/>{{$t('device_config.showParams.imgStandard5')}}
                      </div>
                    </div>
                  </el-form-item>
                  <!-- 产品7.26的时候说暂时没用 -->
                  <el-form-item>
                    <el-checkbox v-model="checked.bigScrUrl" :disabled="!tabActive.tab5"></el-checkbox>
                    <span class="form__label ml14">{{$t('device_config.showParams.bigScreen')}}</span>
                    <div class="ml34">
                      <el-radio v-model="screenMode" :disabled="!checked.bigScrUrl" :label="1">{{$t('device_config.showParams.normalType')}}</el-radio>
                      <el-radio v-model="screenMode" :disabled="!checked.bigScrUrl" :label="2">{{$t('device_config.showParams.customType')}}</el-radio>
                    </div>
                    <div v-if="screenMode === 2" class="ml34 mt20 form__upload" :class="{ 'form__upload--disabled': !checked.bigScrUrl }">
                      <div v-if="deviceSetting.bigScrUrl" class="delete-img inline-block mb-11">
                        <img v-if="deviceSetting.bigScrUrl" :src="`${baseUrl}/file/image/${deviceSetting.bigScrUrl}`" class="avatar">
                        <div class="delete-icon" v-if="checked.bigScrUrl"><i class="iconfont icon-delete" @click="handleImageRemove('bigScrUrl')"></i></div>
                      </div>
                      <el-upload
                        v-else
                        class="form__upload inline-block"
                        action=""
                        :data="{target: 'bigScrUrl'}"
                        :disabled="!checked.bigScrUrl"
                        :before-upload="handleImageCheck"
                        :http-request="handleUpload"
                        :show-file-list="false"
                        :multiple="false">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
                      <div slot="tip" class="el-upload__tip inline-block">
                        {{$t('device_config.showParams.showForBig')}}
                      </div>
                    </div>
                  </el-form-item>
                  <div class="ml34" v-if="screenMode === 1">
                    <el-form-item prop="slogan" :class="{ 'el-form-item--disabled': !checked.bigScrUrl }">
                      <span class="form__label">{{$t('device_config.showParams.slogan')}}</span><br/>
                      <el-input v-model="deviceSetting.slogan" :disabled="!checked.bigScrUrl"></el-input>
                    </el-form-item>
                    <el-form-item prop="intro" :class="{ 'el-form-item--disabled': !checked.bigScrUrl }">
                      <span class="form__label">{{$t('device_config.showParams.intro')}}</span><br/>
                      <el-input v-model="deviceSetting.intro" :disabled="!checked.bigScrUrl" type="textarea" :rows="3"></el-input>
                    </el-form-item>
                  </div>
                  <!-- <img src="@/assets/images/device/parameter1.png" alt="显示参数图片" class="show-parameter__img--horizontal" v-if="deviceSetting.deviceType === 1"> -->
                  <!-- <img src="@/assets/images/device/parameter2.png" alt="显示参数图片" class="show-parameter__img--vertical"> -->
                </el-tab-pane>
                <el-tab-pane :label="$t('device_config.identifyType.title')" name="fourth">
                  <el-switch
                    class="mt5 mb10"
                    v-model="tabActive.tab6"
                    :active-value="true"
                    :inactive-value="false"
                    @change="tabActiveChange(6)">
                  </el-switch>
                  <el-form-item prop="recModeFaceEnable" class="form-item__background">
                    <span class="form__label">
                      {{$t('device_config.identifyType.photoIdentify')}}
                      <el-switch
                        v-model="deviceSetting.recModeFaceEnable"
                        :disabled="!tabActive.tab6"
                        :active-value="2"
                        :inactive-value="1">
                      </el-switch>
                    </span>
                  </el-form-item>
                  <div v-show="deviceSetting.recModeFaceEnable === 2">
                    <el-form-item prop="identifyScores" class="error-margin-left34" :class="{ 'el-form-item--disabled': !checked.identifyScores }">
                      <el-checkbox v-model="checked.identifyScores" :disabled="!tabActive.tab6"></el-checkbox>
                      <span class="form__label ml14">
                        {{$t('device_config.identifyType.identifyScores')}}
                        <el-tooltip placement="right" :content="$t('device_config.identifyType.identifyScoresTip')">
                          <i class="iconfont icon-remind"></i>
                        </el-tooltip>
                      </span>
                      <div class="mb10 ml34">
                        <el-input v-model="deviceSetting.identifyScores" :disabled="!checked.identifyScores"></el-input>
                      </div>
                    </el-form-item>
                    <el-form-item prop="multiplayerDetection">
                      <el-checkbox v-model="checked.multiplayerDetection" :disabled="!tabActive.tab6"></el-checkbox>
                      <el-radio v-model="deviceSetting.multiplayerDetection" :label="1" :disabled="!checked.multiplayerDetection">{{$t('device_config.identifyType.moreIdentify')}}</el-radio>
                      <el-tooltip placement="right" :content="$t('device_config.identifyType.moreIdentifyTip')" class="mr10">
                        <i class="iconfont icon-remind radio--tip"></i>
                      </el-tooltip>
                      <el-radio class="ml20" v-model="deviceSetting.multiplayerDetection" :label="2" :disabled="!checked.multiplayerDetection">{{$t('device_config.identifyType.singleIdentify')}}</el-radio>
                      <el-tooltip placement="right" :content="$t('device_config.identifyType.singleIdentifyTip')">
                        <i class="iconfont icon-remind radio--tip"></i>
                      </el-tooltip>
                    </el-form-item>
                  </div>
                  <el-form-item prop="recStrangerType" class="form-item__background">
                    <span class="form__label">
                      {{$t('device_config.identifyType.cardIdentify')}}
                      <el-switch
                        v-model="deviceSetting.recModeCardEnable"
                        :active-value="2"
                        :disabled="!tabActive.tab6"
                        :inactive-value="1">
                      </el-switch>
                      <el-tooltip placement="right">
                        <div slot="content">{{$t('device_config.identifyType.cardIdentifyTip')}}</div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                  </el-form-item>
                  <div v-show="deviceSetting.recModeCardEnable === 2">
                    <el-form-item prop="recModeCardIntf">
                      <el-checkbox v-model="checked.recModeCardIntf" :disabled="!tabActive.tab6"></el-checkbox>
                      <span class="form__label ml14">{{$t('device_config.identifyType.recModeCardIntf')}}<span class="label__details">{{$t('device_config.identifyType.recModeCardIntfTip')}}</span></span>
                      <div class="ml34">
                        <el-radio v-model="deviceSetting.recModeCardIntf" :disabled="!checked.recModeCardIntf" :label="3" v-if="false">USB</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardIntf" :disabled="!checked.recModeCardIntf" :label="1">TTL{{$t('device_config.identifyType.chunk')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardIntf" :disabled="!checked.recModeCardIntf" :label="2">232{{$t('device_config.identifyType.chunk')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardIntf" :disabled="!checked.recModeCardIntf" :label="4">I²C</el-radio>
                      </div>
                    </el-form-item>
                    <el-form-item prop="recModeCardHardware">
                      <el-checkbox v-model="checked.recModeCardHardware" :disabled="!tabActive.tab6"></el-checkbox>
                      <span class="form__label ml14">{{$t('device_config.identifyType.recModeCardHardware')}}</span>
                      <div class="ml34">
                        <el-radio v-model="deviceSetting.recModeCardHardware" :disabled="!checked.recModeCardHardware" :label="1">{{$t('device_config.identifyType.hardware1')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardHardware" :disabled="!checked.recModeCardHardware" :label="2" v-if="false">{{$t('device_config.identifyType.hardware2')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardHardware" :disabled="!checked.recModeCardHardware" :label="3" v-if="false">{{$t('device_config.identifyType.hardware3')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardHardware" :disabled="!checked.recModeCardHardware" :label="4" v-if="false">{{$t('device_config.identifyType.hardware4')}}</el-radio>
                      </div>
                    </el-form-item>
                  </div>
                  <el-form-item prop="recModeCardFaceEnable" class="form-item__background">
                    <span class="form__label">
                      {{$t('device_config.identifyType.personCard')}}
                      <el-switch
                        v-model="deviceSetting.recModeCardFaceEnable"
                        :active-value="2"
                        :inactive-value="1"
                        :disabled="deviceSetting.recType === 2 || !tabActive.tab6">
                      </el-switch>
                      <el-tooltip placement="right">
                        <div slot="content">
                          {{$t('device_config.identifyType.personCardTip')}}
                        </div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                  </el-form-item>
                  <div v-show="deviceSetting.recModeCardFaceEnable === 2">
                    <el-form-item prop="recDoubleValue" class="error-margin-left34" :class="{ 'el-form-item--disabled': !checked.recDoubleValue }">
                      <el-checkbox v-model="checked.recDoubleValue" :disabled="!tabActive.tab6"></el-checkbox>
                      <span class="form__label ml14">{{$t('device_config.identifyType.identifyScores')}}<span class="label__details">{{$t('device_config.identifyType.identifyScoresTip')}}</span></span>
                      <div class="ml34">
                        <el-input v-model="deviceSetting.recDoubleValue" :disabled="!checked.recDoubleValue"></el-input>
                      </div>
                    </el-form-item>
                    <el-form-item prop="recModeCardFaceIntf">
                      <el-checkbox v-model="checked.recModeCardFaceIntf" :disabled="!tabActive.tab6"></el-checkbox>
                      <span class="form__label ml14">{{$t('device_config.identifyType.recModeCardIntf')}}<span class="label__details">{{$t('device_config.identifyType.recModeCardIntfTip')}}</span></span>
                      <div class="ml34">
                        <el-radio v-model="deviceSetting.recModeCardFaceIntf" :disabled="!checked.recModeCardFaceIntf" :label="3" v-if="false">USB</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardFaceIntf" :disabled="!checked.recModeCardFaceIntf" :label="1">TTL{{$t('device_config.identifyType.chunk')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardFaceIntf" :disabled="!checked.recModeCardFaceIntf" :label="2">232{{$t('device_config.identifyType.chunk')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardFaceIntf" :disabled="!checked.recModeCardFaceIntf" :label="4">I²C</el-radio>
                      </div>
                    </el-form-item>
                    <el-form-item prop="recModeCardFaceHardware">
                      <el-checkbox v-model="checked.recModeCardFaceHardware" :disabled="!tabActive.tab6"></el-checkbox>
                      <span class="form__label ml14">{{$t('device_config.identifyType.recModeCardHardware')}}</span>
                      <div class="ml34">
                        <el-radio v-model="deviceSetting.recModeCardFaceHardware" :disabled="!checked.recModeCardFaceHardware" :label="1">{{$t('device_config.identifyType.hardware1')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardFaceHardware" :disabled="!checked.recModeCardFaceHardware" :label="2" v-if="false">{{$t('device_config.identifyType.hardware2')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardFaceHardware" :disabled="!checked.recModeCardFaceHardware" :label="3" v-if="false">{{$t('device_config.identifyType.hardware3')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeCardFaceHardware" :disabled="!checked.recModeCardFaceHardware" :label="4" v-if="false">{{$t('device_config.identifyType.hardware4')}}</el-radio>
                      </div>
                    </el-form-item>
                  </div>
                  <el-form-item prop="recModeIdcardFaceEnable" class="form-item__background">
                    <span class="form__label">
                      {{$t('device_config.identifyType.pearsonWithCard')}}
                      <el-switch
                        v-model="deviceSetting.recModeIdcardFaceEnable"
                        :active-value="2"
                        :inactive-value="1"
                        :disabled="deviceSetting.recType === 2 || !tabActive.tab6">
                      </el-switch>
                      <el-tooltip placement="right" :content="$t('device_config.identifyType.pearsonWithCardTip')">
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                  </el-form-item>
                  <div v-show="deviceSetting.recModeIdcardFaceEnable === 2">
                    <el-form-item prop="recCardFaceValue" class="error-margin-left34" :class="{ 'el-form-item--disabled': !checked.recCardFaceValue }">
                      <el-checkbox v-model="checked.recCardFaceValue" :disabled="!tabActive.tab6"></el-checkbox>
                      <span class="form__label ml14">{{$t('device_config.identifyType.identifyScores')}}<span class="label__details">{{$t('device_config.identifyType.identifyScoresTip')}}</span></span>
                      <div class="ml34">
                        <el-input v-model="deviceSetting.recCardFaceValue" :disabled="!checked.recCardFaceValue"></el-input>
                      </div>
                    </el-form-item>
                    <el-form-item prop="recModeIdcardFaceIntf">
                      <el-checkbox v-model="checked.recModeIdcardFaceIntf" :disabled="!tabActive.tab6"></el-checkbox>
                      <span class="form__label ml14">{{$t('device_config.identifyType.recModeCardIntf')}}<span class="label__details">{{$t('device_config.identifyType.recModeCardIntfTip')}}</span></span>
                      <div class="ml34">
                        <el-radio v-model="deviceSetting.recModeIdcardFaceIntf" :disabled="!checked.recModeIdcardFaceIntf" :label="3">USB</el-radio>
                        <el-radio v-model="deviceSetting.recModeIdcardFaceIntf" :disabled="!checked.recModeIdcardFaceIntf" :label="1">TTL{{$t('device_config.identifyType.chunk')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeIdcardFaceIntf" :disabled="!checked.recModeIdcardFaceIntf" :label="2">232{{$t('device_config.identifyType.chunk')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeIdcardFaceIntf" :disabled="!checked.recModeIdcardFaceIntf" :label="4">I²C</el-radio>
                      </div>
                    </el-form-item>
                    <el-form-item prop="recModeIdcardFaceHardware">
                      <el-checkbox v-model="checked.recModeIdcardFaceHardware" :disabled="!tabActive.tab6"></el-checkbox>
                      <span class="form__label ml14">{{$t('device_config.identifyType.recModeCardHardware')}}</span>
                      <div class="ml34">
                        <el-radio v-model="deviceSetting.recModeIdcardFaceHardware" :disabled="!checked.recModeIdcardFaceHardware" :label="1">{{$t('device_config.identifyType.hardware2')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeIdcardFaceHardware" :disabled="!checked.recModeIdcardFaceHardware" :label="2">{{$t('device_config.identifyType.hardware3')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeIdcardFaceHardware" :disabled="!checked.recModeIdcardFaceHardware" :label="3">{{$t('device_config.identifyType.hardware4')}}</el-radio>
                        <el-radio v-model="deviceSetting.recModeIdcardFaceHardware" :disabled="!checked.recModeIdcardFaceHardware" :label="4">{{$t('device_config.identifyType.hardware5')}}</el-radio>
                      </div>
                    </el-form-item>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-form>
          </div>
          <div class="content__footer">
            <el-button type="default" class="footer__btn" @click="$router.go(-1)">{{$t('common_cancel')}}</el-button>
            <el-button type="primary" class="footer__btn" @click="handleDeviceSettingUpdate">{{$t('common_save')}}</el-button>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-dialog
      :title="$t('device_config.dialog.title')"
      :visible.sync="failVisible"
      width="860px">
      <div>
        <el-table class="table__fail" :data="failList" :height="300">
          <el-table-column prop="deviceName" :label="$t('device_config.dialog.deviceName')" min-width="100"></el-table-column>
          <el-table-column prop="deviceKey" :label="$t('device_config.dialog.deviceKey')" min-width="80"></el-table-column>
          <el-table-column prop="reason" :label="$t('device_config.dialog.failReason')" min-width="200">
            <template slot-scope="scope">
              <span class="f-red">{{ scope.row.reason }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { configDevice } from '@/api/device/device'
import { updateImg } from '@/api/hr/employee'

export default {
  name: 'configuration',
  data () {
    // 公用
    // 允许{name}、{tag}，汉字/字母/数字 1-255
    const rulesType1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('device_config.message.rule1')))
      } else if (value.length > 255) {
        return callback(new Error(this.$t('device_config.message.rule2')))
      } else if (!/^(({name})|({tag})|[\u4e00-\u9fa5a-zA-Z\d\s])*$/.test(value)) {
        return callback(new Error(this.$t('device_config.message.rule3')))
      } else {
        return callback()
      }
    }
    // 数字、中英文和中英文符号 1-255
    const rulesType2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('device_config.message.rule4')))
      } else if (value.length > 255) {
        return callback(new Error(this.$t('device_config.message.rule5')))
      } else {
        return callback()
      }
    }
    // 只允许{cardNo}和数字
    const rulesType3 = (rule, value, callback, parent) => {
      const num = value ? Number(value.replace(/({idcardNum})|({id})/g, '')) : 0
      if (!value) {
        return callback(new Error(this.$t('device_config.message.rule6')))
      } else if (/\D/.test(value)) {
        return callback(new Error(this.$t('device_config.message.rule7')))
      } else if (!num) {
        return callback()
      } else if (parent === 2 && (num < 1 || num > 65535)) {
        return callback(new Error(this.$t('device_config.message.rule8')))
      } else if (parent === 3 && (num < 1 || num > 4294967295)) {
        return callback(new Error(this.$t('device_config.message.rule9')))
      } else if (value.length > 255) {
        return callback(new Error(this.$t('device_config.message.rule5')))
      } else {
        return callback()
      }
    }
    // 只允许1-100之间的整数
    const rulesType4 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('device_config.message.rule10')))
      } else if (!/^\d*$/.test(value)) {
        return callback(new Error(this.$t('device_config.message.rule7')))
      } else if (value > 100 || value < 1) {
        return callback(new Error(this.$t('device_config.message.rule11')))
      } else {
        return callback()
      }
    }
    // 允许{phone}、{cardNo}，数字/英文/英文符号 1-255
    const rulesType5 = (rule, value, callback, type) => {
      if (!value) {
        return callback(new Error(this.$t('device_config.message.rule12')))
      } else if (value.length > 255) {
        return callback(new Error(this.$t('device_config.message.rule5')))
      } else if (!/^(({phone})|({idcardNum})|({id})|[a-zA-Z\d\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F])*$/.test(value)) {
        if (type === 'recFail') return callback(new Error(this.$t('device_config.message.rule13')))
        return callback(new Error(this.$t('device_config.message.rule14')))
      } else {
        return callback()
      }
    }
    // 私有
    const identifyDistanceRules = (rule, value, callback) => {
      if (!this.checked.saveIdentifyTime) {
        return callback()
      }
      if (value === '' || value === null) {
        return callback(new Error(this.$t('device_config.message.rule15')))
      } else if (!/^\d*$/.test(value)) {
        return callback(new Error(this.$t('device_config.message.rule7')))
      } else {
        return callback()
      }
    }
    const delayTimeForCloseDoorRules = (rule, value, callback) => {
      if (!this.checked.delayTimeForCloseDoor) {
        return callback()
      }
      if (value === '' || value === null) {
        return callback(new Error(this.$t('device_config.message.rule16')))
      } else if (!/^\d*$/.test(value)) {
        return callback(new Error(this.$t('device_config.message.rule7')))
      } else if (value > 25500 || value < 100) {
        return callback(new Error(this.$t('device_config.message.rule17')))
      } else {
        return callback()
      }
    }
    const ttsModContentRules = (rule, value, callback) => {
      if (!this.checked.ttsModType) {
        return callback()
      }
      if (this.deviceSetting.ttsModType === 100) {
        rulesType1(rule, value, callback)
      } else {
        return callback()
      }
    }
    const displayModContentRules = (rule, value, callback) => {
      if (!this.checked.displayModType) {
        return callback()
      }
      if (this.deviceSetting.displayModType === 100) {
        rulesType2(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recSucDisplayText2ContentRules = (rule, value, callback) => {
      if (!this.checked.recSucDisplayText2Type) {
        return callback()
      }
      if (this.deviceSetting.recSucDisplayText2Type === 100) {
        rulesType2(rule, value, callback)
      } else {
        return callback()
      }
    }
    const comModContentRules = (rule, value, callback) => {
      if (!this.checked.comModType) {
        return callback()
      }
      if (this.deviceSetting.comModType === 100) {
        rulesType5(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recSucWiegandContentRules = (rule, value, callback) => {
      if (!this.checked.recSucWiegandType) {
        return callback()
      }
      if (this.deviceSetting.recSucWiegandType === 2 || this.deviceSetting.recSucWiegandType === 3) {
        rulesType3(rule, value, callback, this.deviceSetting.recSucWiegandType)
      } else {
        return callback()
      }
    }
    const recStrangerTimesThresholdRules = (rule, value, callback) => {
      if (!this.checked.recStrangerTimesThreshold) {
        return callback()
      }
      if (value === '' || value === null) {
        return callback(new Error(this.$t('device_config.message.rule18')))
      } else if (!/^\d*$/.test(value)) {
        return callback(new Error(this.$t('device_config.message.rule7')))
      } else if (value > 20 || value < 1) {
        return callback(new Error(this.$t('device_config.message.rule29')))
      } else {
        return callback()
      }
    }
    const ttsModStrangerContentRules = (rule, value, callback) => {
      if (!this.checked.ttsModStrangerType) {
        return callback()
      }
      if (this.deviceSetting.ttsModStrangerType === 100) {
        rulesType1(rule, value, callback)
      } else {
        return callback()
      }
    }
    const displayModStrangerContentRules = (rule, value, callback) => {
      if (!this.checked.displayModStrangerType) {
        return callback()
      }
      if (this.deviceSetting.displayModStrangerType === 100) {
        rulesType2(rule, value, callback)
      } else {
        return callback()
      }
    }
    const serialOutContentRules = (rule, value, callback) => {
      if (!this.checked.serialOutMode) {
        return callback()
      }
      if (this.deviceSetting.serialOutMode === 2) {
        rulesType5(rule, value, callback, 'recFail')
      } else {
        return callback()
      }
    }
    const recFailWiegandContentRules = (rule, value, callback) => {
      if (!this.checked.recFailWiegandType) {
        return callback()
      }
      if (this.deviceSetting.recFailWiegandType === 2 || this.deviceSetting.recFailWiegandType === 3) {
        if (!value) {
          callback(new Error(this.$t('device_config.message.rule20')))
        } else if (!/^\d*$/.test(value)) {
          callback(new Error(this.$t('device_config.message.rule7')))
        } else if (this.deviceSetting.recFailWiegandType === 2 && (Number(value) < 1 || Number(value) > 65535)) {
          callback(new Error(this.$t('device_config.message.rule21')))
        } else if (this.deviceSetting.recFailWiegandType === 3 && (Number(value) < 1 || Number(value) > 4294967295)) {
          callback(new Error(this.$t('device_config.message.rule22')))
        } else {
          callback()
        }
      } else {
        return callback()
      }
    }
    const recNoPerTtsModeContentRules = (rule, value, callback) => {
      if (!this.checked.recNoPerTtsModeType) {
        return callback()
      }
      if (this.deviceSetting.recNoPerTtsModeType === 100) {
        rulesType1(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recNoPerDisplayText1ContentRules = (rule, value, callback) => {
      if (!this.checked.recNoPerDisplayText1Type) {
        return callback()
      }
      if (this.deviceSetting.recNoPerDisplayText1Type === 100) {
        rulesType2(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recNoPerDisplayText2ContentRules = (rule, value, callback) => {
      if (!this.checked.recNoPerDisplayText2Type) {
        return callback()
      }
      if (this.deviceSetting.recNoPerDisplayText2Type === 100) {
        rulesType2(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recNoPerComModeContentRules = (rule, value, callback) => {
      if (!this.checked.recNoPerComModeType) {
        return callback()
      }
      if (this.deviceSetting.recNoPerComModeType === 100) {
        rulesType5(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recNoPerWiegandContentRules = (rule, value, callback) => {
      if (!this.checked.recNoPerWiegandType) {
        return callback()
      }
      if (this.deviceSetting.recNoPerWiegandType === 2 || this.deviceSetting.recNoPerWiegandType === 3) {
        rulesType3(rule, value, callback, this.deviceSetting.recNoPerWiegandType)
      } else {
        return callback()
      }
    }
    const scrDisplayText1ContentRules = (rule, value, callback) => {
      if (!this.checked.scrDisplayText1Type) {
        return callback()
      }
      if (this.deviceSetting.scrDisplayText1Type === 100) {
        if (value === '' || value === null) {
          return callback(new Error(this.$t('device_config.message.rule23')))
        } else if (value.length > 255) {
          return callback(new Error(this.$t('device_config.message.rule5')))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    const scrDisplayText2ContentRules = (rule, value, callback) => {
      if (!this.checked.scrDisplayText2Type) {
        return callback()
      }
      if (this.deviceSetting.scrDisplayText2Type === 100) {
        if (value === '' || value === null) {
          return callback(new Error(this.$t('device_config.message.rule24')))
        } else if (value.length > 255) {
          return callback(new Error(this.$t('device_config.message.rule5')))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    const identifyScoresRules = (rule, value, callback) => {
      if (!this.checked.identifyScores) {
        return callback()
      }
      if (this.deviceSetting.recModeFaceEnable === 2) {
        rulesType4(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recDoubleValueRules = (rule, value, callback) => {
      if (!this.checked.recDoubleValue) {
        return callback()
      }
      if (this.deviceSetting.recModeCardFaceEnable === 2) {
        rulesType4(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recCardFaceValueRules = (rule, value, callback) => {
      if (!this.checked.recCardFaceValue) {
        return callback()
      }
      if (this.deviceSetting.recModeIdcardFaceEnable === 2) {
        rulesType4(rule, value, callback)
      } else {
        return callback()
      }
    }
    return {
      failList: [],
      failVisible: false,
      checkList: [],
      checked: {
        saveIdentifyTime: false,
        identifyDistance: false,
        recRank: false,
        delayTimeForCloseDoor: false,
        ttsModType: false,
        displayModType: false,
        recSucDisplayText2Type: false,
        comModType: false,
        recSucWiegandType: false,
        isOpenRelay: false,
        recStrangerType: false,
        recStrangerTimesThreshold: false,
        ttsModStrangerType: false,
        displayModStrangerType: false,
        serialOutMode: false,
        recFailWiegandType: false,
        relaySwitch: false,
        recNoPerTtsModeType: false,
        recNoPerDisplayText1Type: false,
        recNoPerDisplayText2Type: false,
        recNoPerComModeType: false,
        recNoPerWiegandType: false,
        recNoPerRelayType: false,
        orientation: false,
        scrDisplayText1Type: false,
        scrDisplayText2Type: false,
        scrImage1Url: false,
        scrImage2Url: false,
        showIp: false,
        scrDisableUrl: false,
        bigScrUrl: false,
        recModeFaceEnable: false,
        identifyScores: false,
        multiplayerDetection: false,
        recModeCardEnable: false,
        recModeCardIntf: false,
        recModeCardHardware: false,
        recDoubleValue: false,
        recModeCardFaceIntf: false,
        recModeCardFaceHardware: false,
        recCardFaceValue: false,
        recModeIdcardFaceIntf: false,
        recModeIdcardFaceHardware: false
      },
      tabActive: {},
      deviceSetting: {
        // bigScrUrl: '', // 识别通用参数.大屏背景图片 默认使用设备自带图片
        recModeCardEnable: 1, // 刷卡识别参数.刷卡模式开关 1:打开(默认) 2:关闭
        recModeCardFaceEnable: 1, // 卡&人脸双重认证.卡&人脸双重认证开关 1:打开2:关闭(默认)
        recModeCardFaceHardware: 1, // 卡&人脸双重认证.外接硬件类型 1:IC读卡器(默认) 2:新中新 3:精伦 4:中控
        recModeCardFaceIntf: 2, // 卡&人脸双重认证.卡号传输接口 3:USB 1:TTL串口(默认) 2:232串口
        recDoubleValue: 80, // 卡&人脸双重认证.人脸识别阈值 80(默认)
        recModeCardHardware: 1, // 刷卡识别参数.外接硬件类型 1:IC读卡器(默认) 2:新中新 3:精伦 4:中控
        recModeCardIntf: 2, // 刷卡识别参数.卡号传输接口 3:USB 1:TTL串口(默认) 2:232串口 Uface设备自带的刷卡模块使用的是TTL串口 USB（或TTL或232）接口只能被一种识别模式使用，若>1种模式使用USB（或TTL或232）则报错。
        identifyDistance: 2, // 识别通用参数.识别距离 100:无限制(默认) 1:0.5以内 2:1{{$t('device_config.generalParams.miDistance')}} 3:1.5{{$t('device_config.generalParams.miDistance')}} 4:2{{$t('device_config.generalParams.miDistance')}} 5:3{{$t('device_config.generalParams.miDistance')}} 6:4{{$t('device_config.generalParams.miDistance')}} 若识别等级选择2活体，则5、6不可选；若识别等级选择1活体，则0-6均可选。
        recRank: 2, // 识别通用参数.识别等级 1:非活体 2:活体(默认)
        saveIdentifyTime: 60, // 识别通用参数.时间窗 60秒(默认)
        delayTimeForCloseDoor: 500, // 识别通用参数.继电器控制时间 500ms(默认) 继电器控制开门到关门之间的时间间隔，默认500ms。请输入100-25500之间的整数，向下取整百。如：输入101-199之间的整数，实际生效的是100ms。
        multiplayerDetection: 1, // 刷脸识别参数.人脸检测类型 1:多人识别(默认) 2:单人识别
        recModeFaceEnable: 1, // 刷脸识别参数.刷脸模式开关 1:关闭 2:打开(默认)
        identifyScores: 80, // 刷脸识别参数.人脸识别阈值 80(默认) 实际允许0-100之间的所有整数。提示：请输入1~100的整数，分数越高，识别准确率越高。为保证准确率，建议值50~100。分数越高，识别准确率越高，但识别速度会变慢。
        recModeIdcardFaceEnable: 1, // 人证比对参数.人证比对开关 1:关闭(默认) 2:打开
        recModeIdcardFaceHardware: 1, // 人证比对参数.外接硬件类型 1:新中新(默认) 2:中控 3:精伦 4:华视
        recModeIdcardFaceIntf: 3, // 人证比对参数.卡号传输接口 1:TTL串口 2:232串口(默认) 3:USB 4.I²C
        recCardFaceValue: 50, // 人证比对参数.人脸识别阈值 50(默认)
        serialOutContent: '', // 识别失败参数.串口输出自定义内容
        serialOutMode: 1, // 识别失败参数.串口输出模式 1:开门3:不输出(默认) 2:自定义
        displayModStrangerContent: '', // 识别失败参数.屏幕显示文字自定义内容 内容只允许数字、中英文和中英文符号，长度限制255个字符。如：注意陌生人！
        displayModStrangerType: 1, // 识别失败参数.屏幕显示文字类型 1:识别失败(默认) 100:自定义
        recStrangerType: 1, // 识别失败参数.识别失败开关 1:关闭 2:打开(默认)
        relaySwitch: 2, // 识别失败参数.继电器输出类型 1:输出 2:不输出(默认)
        recStrangerTimesThreshold: 3, // 识别失败参数.判定次数 3(默认) 打开识别失败开关后，该选项有效；连续比对N次都未达到分数阈值，则判定为识别失败，默认3次；传入值请选择1-20之间的整数，1表示快速判定但精确率最低，随着数值增加，判定时间增加，精确度提高
        ttsModStrangerContent: '', // 识别失败参数.语音播报自定义内容 内容只允许数字、英文和汉字，长度限制255个字符。如：注意陌生人
        ttsModStrangerType: 2, // 识别失败参数.语音播报类型 2:识别失败(默认) 1:不播放 100:自定义
        recFailWiegandContent: '', // 识别失败参数.韦根输出自定义内容
        recFailWiegandType: 1, // 识别失败参数.韦根输出类型 1:不输出(默认) 2:韦根26 3:韦根34
        recNoPerComModeContent: '', // 权限不足参数.串口输出自定义内容
        recNoPerComModeType: 2, // 权限不足参数.串口输出模式 1:开门（默认） 2:不输出 3:输出人员id 4:输出idcardNum 5:输出phone 100:自定义
        recNoPerDisplayText1Content: '', // 权限不足参数.屏幕显示文字1自定义内容
        recNoPerDisplayText1Type: 1, // 权限不足参数.屏幕显示文字1类型 1:姓名(默认) 100:自定义
        recNoPerDisplayText2Content: '', // 权限不足参数.屏幕显示文字2自定义内容
        recNoPerDisplayText2Type: 1, //  权限不足参数.屏幕显示文字2类型 1:权限不足(默认) 100:自定义
        recNoPerRelayType: 2, // 权限不足参数.继电器输出类型 1:输出 2:不输出(默认)
        recNoPerTtsModeContent: '', // 权限不足参数.语音播报自定义内容 允许{name}、{tag}。字段格式固定，其他内容只允许数字、英文和汉字，长度限制255个字符。如：{name}无权通行
        recNoPerTtsModeType: 1, // 权限不足参数.语音播报类型 1:播报姓名权限不足(默认) 2:不播放 100:自定义
        recNoPerWiegandContent: '', // 权限不足参数.韦根输出自定义内容
        recNoPerWiegandType: 1, // 权限不足参数.韦根输出类型 1:不输出(默认) 2:韦根26 3:韦根34
        comModContent: '', // 识别成功参数.串口输出自定义内容
        comModType: 1, // 识别成功参数.串口输出模式 1:开门（默认） 2:不输出 3:输出人员id 4:输出idcardNum 5:输出phone 100:自定义
        displayModContent: '', // 识别成功参数.屏幕显示文字1自定义内容
        displayModType: 1, // 识别成功参数.屏幕显示文字1类型 1:姓名(默认) 100:自定义
        recSucDisplayText2Content: '', // 识别成功参数.屏幕显示文字2自定义内容
        recSucDisplayText2Type: 1, // 识别成功参数.屏幕显示文字2类型 1:识别成功(默认) 100:自定义
        isOpenRelay: 1, // 识别成功参数.继电器输出类型 1:输出(默认) 2:不输出
        ttsModContent: '', // 识别成功参数.语音播报自定义内容 允许{name}、{tag}。字段格式固定，其他内容只允许数字、英文和汉字，长度限制255个字符。如：{name}欢迎光临
        ttsModType: 1, // 识别成功参数.语音播报类型 2:播报名字(默认) 1:不播放 100:自定义
        recSucWiegandContent: '', // 识别成功参数.韦根输出自定义内容 允许{phone}、{cardNo}。字段格式固定且只能为数字或字母，其他内容只允许数字、英文和英文符号，长度限制255个字符。串口支持输出韦根信号，设备需要外接串口→韦根信号转换小板，小板由本公司定制。自定义内容传入格式：韦根26：#26WG{cardNo}#，韦根34：#34WG{cardNo}#注意：{cardNo}+数字组合后，韦根26范围为1-65535（待定），有效范围为5位；韦根34范围为1-4294967295（待定），有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号。
        recSucWiegandType: 1, // 识别成功参数.韦根输出类型 1:不输出(默认) 2:韦根26 3:韦根34
        // scrDisableUrl: '', // 识别通用参数.禁用界面图片 默认使用设备自带图片
        scrDisplayText1Content: '', // 识别通用参数.显示文字内容1自定义内容 长度限制255
        scrDisplayText1Type: 1, // 识别通用参数.显示文字内容1类型 1:应用名称(默认) 100:自定义
        scrDisplayText2Content: '', // 识别通用参数.显示文字内容2自定义内容 长度限制255
        scrDisplayText2Type: 1, // 识别通用参数.显示文字内容2类型 1:不显示(LAN默认) 2设备名称 100:自定义
        // scrImage1Url: '', // 识别通用参数.显示图片1 默认使用设备自带图片
        // scrImage2Url: '', // 识别通用参数.显示图片2 默认使用设备自带图片
        orientation: 1, // 识别通用参数.屏幕方向 1:横屏(默认) 2:竖屏
        showDeviceKey: 1,
        showIp: 1,
        showPeopleNum: 1,
        // 新增字段
        slogan: '', // 标语
        intro: '' // 简介
      },
      pageShow: true,
      checkRules: {
        saveIdentifyTime: [ // 时间窗
          { validator: identifyDistanceRules, trigger: 'blur' }
        ],
        delayTimeForCloseDoor: [ // 继电器控制时间
          { validator: delayTimeForCloseDoorRules, trigger: 'blur' }
        ],
        ttsModContent: [ // 识别成功语音播报自定义内容
          { validator: ttsModContentRules, trigger: 'blur' }
        ],
        displayModContent: [ // 识别成功屏幕显示文字1
          { validator: displayModContentRules, trigger: 'blur' }
        ],
        recSucDisplayText2Content: [ // 识别成功屏幕显示文字2
          { validator: recSucDisplayText2ContentRules, trigger: 'blur' }
        ],
        comModContent: [ // 识别成功串口输出模式
          { validator: comModContentRules, trigger: 'blur' }
        ],
        recSucWiegandContent: [ // 识别成功韦根自定义内容
          { validator: recSucWiegandContentRules, trigger: 'blur' }
        ],
        recStrangerTimesThreshold: [ // 识别失败判定次数
          { validator: recStrangerTimesThresholdRules, trigger: 'blur' }
        ],
        ttsModStrangerContent: [ // 识别失败语音播报自定义内容
          { validator: ttsModStrangerContentRules, trigger: 'blur' }
        ],
        displayModStrangerContent: [ // 识别失败屏幕显示文字
          { validator: displayModStrangerContentRules, trigger: 'blur' }
        ],
        serialOutContent: [ // 识别失败串口输出模式
          { validator: serialOutContentRules, trigger: 'blur' }
        ],
        recFailWiegandContent: [ // 识别失败韦根自定义内容
          { validator: recFailWiegandContentRules, trigger: 'blur' }
        ],
        recNoPerTtsModeContent: [ // 权限不足语音播报自定义内容
          { validator: recNoPerTtsModeContentRules, trigger: 'blur' }
        ],
        recNoPerDisplayText1Content: [ // 权限不足屏幕显示文字1
          { validator: recNoPerDisplayText1ContentRules, trigger: 'blur' }
        ],
        recNoPerDisplayText2Content: [ // 权限不足屏幕显示文字2
          { validator: recNoPerDisplayText2ContentRules, trigger: 'blur' }
        ],
        recNoPerComModeContent: [ // 权限不足串口输出模式
          { validator: recNoPerComModeContentRules, trigger: 'blur' }
        ],
        recNoPerWiegandContent: [ // 权限不足韦根自定义内容
          { validator: recNoPerWiegandContentRules, trigger: 'blur' }
        ],
        scrDisplayText1Content: [ // 显示文字内容1
          { validator: scrDisplayText1ContentRules, trigger: 'blur' }
        ],
        scrDisplayText2Content: [ // 显示文字内容2
          { validator: scrDisplayText2ContentRules, trigger: 'blur' }
        ],
        identifyScores: [ // 人脸识别阈值
          { validator: identifyScoresRules, trigger: 'blur' }
        ],
        recDoubleValue: [ // 卡&人脸双重认证人脸识别阈值
          { validator: recDoubleValueRules, trigger: 'blur' }
        ],
        recCardFaceValue: [ // 人证比对人脸识别阈值
          { validator: recCardFaceValueRules, trigger: 'blur' }
        ]
      },
      activeParent: 'first', // 父级tab
      activeChild: 'first',
      scrDisableUrl: '',
      scrImage1Url: '',
      scrImage2Url: '',
      bigScrUrl: '', // 大屏自定义图片
      screenMode: 1
    }
  },
  methods: {
    // 修改设备配置
    handleDeviceSettingUpdate () {
      this.$refs['deviceSettingForm'].validate((valid) => {
        if (valid) {
          let param = { ...this.deviceSetting }
          param.showDeviceKey = param.showDeviceKey ? 2 : 1
          param.showIp = param.showIp ? 2 : 1
          param.showPeopleNum = param.showPeopleNum ? 2 : 1
          param['delayTimeForCloseDoor'] = this.changeDelayTimeForCloseDoor(this.deviceSetting.delayTimeForCloseDoor)

          for (let key in this.checked) {
            if (!this.checked[key]) {
              delete param[key]
            }
          }

          if (!this.checked.showIp) {
            delete param.showDeviceKey
            delete param.showPeopleNum
          }

          if (!this.tabActive.tab6) {
            delete param.recModeFaceEnable
            delete param.recModeCardEnable
            delete param.recModeCardFaceEnable
            delete param.recModeIdcardFaceEnable
          }

          let params = {
            ...param,
            deviceKeyList: this.checkList.map(ele => ele.deviceKey)
          }
          configDevice(params).then(res => {
            if (res.success) {
              this.failList = res.data.filter(ele => !ele.success)
              if (this.failList.length) {
                this.failVisible = true
              } else {
                this.$message.success(this.$t('device_config.configSuccess'))
                this.$router.go(-1)
              }
            }
          })
        } else {
          this.$message.error(this.$t('device_config.configError'))
          return false
        }
      })
    },
    // 修改识别等级，切换识别距离为默认值
    changeComRecRank () {
      const distance = [100, 3, 4, 5, 6]
      if (distance.includes(this.deviceSetting.identifyDistance)) {
        this.deviceSetting.identifyDistance = 2
      }
    },
    // 修改继电器时间，保证输出为整百数
    changeDelayTimeForCloseDoor (time) {
      return parseInt(time / 100) * 100
    },
    // 图片上传前校验
    handleImageCheck (file) {
      const fileTypeList = ['image/jpeg', 'image/png', 'image/jpg'] // 支持的文件格式
      const fileMaxSize = 2 // 文件大小限制 单位MB
      const fileType = file.type
      const fileSize = file.size
      if (!fileTypeList.includes(fileType)) {
        this.$message.error(this.$t('device_config.message.rule27'))
        return false
      }
      if (fileSize > fileMaxSize * 1024 * 1024) {
        this.$message.error(this.$t('device_config.message.rule28'))
        return false
      }
    },
    // 图片上传
    async handleUpload (file) {
      var formFile = new FormData()
      formFile.append('file', file.file)

      updateImg(formFile).then(res => {
        if (res.success) {
          this.$set(this.deviceSetting, file.data.target, res.data)
        }
      })
    },
    // 删除图片预览
    handleImageRemove (target) {
      this.deviceSetting[target] = ''
    },
    tabActiveChange (index) {
      let checkField = []
      if (index === 1) {
        checkField = ['saveIdentifyTime', 'identifyDistance', 'recRank', 'identifyDistance', 'delayTimeForCloseDoor']
      }
      if (index === 2) {
        checkField = ['ttsModType', 'displayModType', 'recSucDisplayText2Type', 'comModType', 'recSucWiegandType', 'isOpenRelay']
      }
      if (index === 3) {
        if (!this.tabActive.tab3) {
          this.deviceSetting.recStrangerType = 1
        }
        checkField = ['recStrangerType', 'recStrangerTimesThreshold', 'ttsModStrangerType', 'displayModStrangerType', 'serialOutMode', 'recFailWiegandType', 'relaySwitch']
      }
      if (index === 4) {
        checkField = ['recNoPerTtsModeType', 'recNoPerDisplayText1Type', 'recNoPerDisplayText2Type', 'recNoPerComModeType', 'recNoPerWiegandType', 'recNoPerRelayType']
      }
      if (index === 5) {
        checkField = ['orientation', 'scrDisplayText1Type', 'scrDisplayText2Type', 'scrImage1Url', 'scrImage2Url', 'showIp', 'scrDisableUrl', 'bigScrUrl']
      }
      if (index === 6) {
        if (!this.tabActive.tab6) {
          this.deviceSetting.recModeFaceEnable = 1
          this.deviceSetting.recModeCardEnable = 1
          this.deviceSetting.recModeCardFaceEnable = 1
          this.deviceSetting.recModeIdcardFaceEnable = 1
        }
        checkField = ['recModeFaceEnable', 'identifyScores', 'multiplayerDetection', 'recModeCardEnable', 'recModeCardIntf', 'recModeCardHardware', 'recDoubleValue', 'recModeCardFaceIntf', 'recModeCardFaceHardware', 'recCardFaceValue', 'recModeIdcardFaceIntf', 'recModeIdcardFaceHardware']
      }
      checkField.forEach(ele => {
        this.checked[ele] = false
      })
    }
  },
  created () {
    this.checkList = JSON.parse(sessionStorage.getItem('deviceList'))
  },
  watch: {
    'deviceSetting.recSucWiegandType': { // 识别成功韦根自定义输出内容设置默认值
      handler (val) {
        if (val === 2 || val === 3) {
          if (!this.deviceSetting.recSucWiegandContent && this.deviceSetting.recSucWiegandContent !== 0) this.deviceSetting.recSucWiegandContent = ''
        }
      },
      deep: true
    },
    'deviceSetting.recNoPerWiegandType': { // 权限不足韦根自定义输出内容设置默认值
      handler (val) {
        if (val === 2 || val === 3) {
          if (!this.deviceSetting.recNoPerWiegandContent && this.deviceSetting.recNoPerWiegandContent !== 0) this.deviceSetting.recNoPerWiegandContent = ''
        }
      },
      deep: true
    },
    'deviceSetting.recModeCardEnable': { // 保证刷卡识别和人卡合一不能同时开启
      handler (val) {
        if (val === 2 && this.tabActive.tab6) {
          this.deviceSetting.recModeCardFaceEnable = 1
        }
      },
      deep: true
    },
    'deviceSetting.recModeCardFaceEnable': { // 保证刷卡识别和人卡合一不能同时开启
      handler (val) {
        if (val === 2 && this.tabActive.tab6) {
          this.deviceSetting.recModeCardEnable = 1
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
  .ml14{
    margin-left: 14px;
  }
  .ml34{
    margin-left: 34px;
  }
  .page/deep/ .el-input.is-disabled > .el-input__inner{
    background: #F5F7FA;
  }
  .f-margin-bottom0{
    margin-bottom: 0;
  }
  .f-margin-bottom25{
    margin-bottom: 25px;
  }
  .hd__back{
    color: #606266;
  }
  .page__content{
    // padding: 0
  }
  .form-scroll{
    width: 100%;
    height: 100%;
  }
  .container__content, .content__footer{
    height: auto;
    width: 100%;
    box-sizing: border-box;
  }
  .container__content .content__main{
    max-height: max-content;
  }
  .content__header .basic-info__box{
    float: left;
    width: 20%;
    padding-right: 20px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  .content__header .basic-info__box .title{
    color: #606266;
    margin-bottom: 5px;
  }
  .content__header .basic-info__box .info{
    color: #303133;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .form-item__background{
    background: #F1F4F7;
    /deep/ .el-form-item__content{
      line-height: 40px;
      padding-left: 20px;
      font-size: 16px;
      .el-switch{
        vertical-align: text-bottom;
        margin-left: 5px;
      }
    }
  }
  .form--custom .el-input, .form--custom .el-textarea{
    width: 460px;
  }
  .form--custom .setting__ipt--short{
    display: inline-block;
    width: 100px;
    margin-right: 10px;
  }
  .form__tip--bottom{
    font-size: 12px;
    color: #909399;
    line-height: 16px;
  }
  .form__tip--img img{
    width: 300px;
    height: 512px;
  }
  .form__tip--img img.logo{
    width: 148px;
    height: 148px;
  }
  .form__tip--img img.horizontal{
    width: 427px;
    height: 240px;
  }
  .form__upload--preview{
    width: 100px;
    height: 100px;
  }
  .el-upload__tip{
    display: inline-block;
    line-height: 20px;
    vertical-align: bottom;
    margin-left: 10px;
    font-size: 12px;
    color: #909399;
  }
  .show-setting__item+.show-setting__item{
    margin-top: 10px;
  }
  .show-setting__item span{
    display: inline-block;
    width: 120px;
  }
  .show-parameter__img--horizontal{
    position: absolute;
    top: 40px;
    right: 0;
    width: 551px;
    height: 295px;
  }
  .show-parameter__img--vertical{
    position: absolute;
    top: 20px;
    right: 0;
    width: 442px;
    height: 555px;
  }
  .content__footer{
    position: static;
    padding: 20px 0 0 0;
    text-align: left;
    border-top: 1px solid #e4e7ed;
  }
  .footer__btn{
    height: 36px;
    line-height: 36px;
    padding: 0 20px;
    text-align: center;
  }
  .icon-remind{
    color:  #C0C4CC;
    vertical-align: -1px;
    display: inline-block;
    margin-left: 2px;
  }
  .icon-prompt{
    color: #2EA2F8;
    font-size: 16px;
    margin-left: 10px;
    vertical-align: -2px;
    cursor: pointer;
  }
  .general-params{
    /deep/ .el-input{
      width: 120px;
    }
  }
  .params__form{
    .header__tabs{
      &>/deep/ .el-tabs__header{
        .el-tabs__item{
          height: 50px;
          line-height: 50px;
        }
      }
    }
  }
  .tabs--button{
    /deep/ .el-tabs__header{
      .el-tabs__nav-wrap{
        &::after{
          height: 0;
        }
      }
      .el-tabs__nav{
        background-color: #F1F4F7;
        padding: 3px;
        box-sizing: border-box;
        .el-tabs__active-bar{
          height: 0;
        }
        .el-tabs__item{
          padding: 0 10px;
          border-left: 0;
          box-sizing: border-box;
          font-size: 14px;
          &.is-bottom:nth-child(2), &.is-top:nth-child(2){
            padding-left: 10px;
          }
          &.is-bottom:last-child, &.is-top:last-child{
            padding-right: 10px;
          }
          &.is-active{
            border: none;
            background-color: #fff;
          }
          &.is-bottom:nth-child(2).is-active, &.is-top:nth-child(2).is-active{
            border: none;
          }
        }
      }
    }
  }
  .table__fail/deep/{
    tr>th{
      border-top: none;
    }
  }
  .form__upload/deep/{
    .el-upload{
      width: 110px;
      height: 110px;
      border: 1px dashed #d9d9d9;
      border-radius: 2px;
      cursor: pointer;
      position: relative;
      line-height: 110px;
      .el-icon-plus{
        font-size: 20px;
        color: #c0c4cc;
      }
      &:hover{
        border: 1px dashed #409eff;
        .el-icon-plus{
          color: #409eff;
        }
      }
    }
    .delete-img{
      width: 110px;
      height: 110px;
      position: relative;
      img{
        width: 100%;
        height: 100%;
      }
      .delete-icon{
        position: absolute;
        top: 0;
        left: 0;
        width: 110px;
        height: 110px;
        background: rgba(0, 0, 0, .4);
        display: none;
        text-align: center;
        line-height: 110px;
        i{
          color: #fff;
          font-size: 20px;
          cursor: pointer;
        }
      }
      &:hover{
        .delete-icon{
          display: block;
        }
      }
    }
  }
  .form__upload--disabled/deep/{
    .el-upload{
      &:hover{
        cursor: not-allowed;
        border: 1px dashed #d9d9d9;
        .el-icon-plus{
          color: #c0c4cc;
        }
      }
    }
  }
  .error-margin-left34/deep/{
    .el-form-item__error{
      margin-left: 34px;
    }
  }
  .el-form-item--disabled/deep/{
    .el-form-item__error{
      display: none;
    }
  }
  .radio--tip{
    margin: 0 30px 0 -22px;
  }
  .main-tab/deep/{
    &>.el-tabs__header .el-tabs__item{
      height: 30px!important;
      line-height: 16px!important;
    }
  }
</style>

<style>
.config-scroll .el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
