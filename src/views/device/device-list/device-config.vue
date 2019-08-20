<template>
  <div class="page">
    <div class="page__header">
      <span class="page__header--title pointer" @click="$router.go(-1)">
        <i class="iconfont icon-retreat"></i>设备配置
      </span>
    </div>
    <div class="page__content">
      <el-scrollbar class="form-scroll config-scroll">
        <el-form ref="deviceSettingForm" :model="deviceSetting" class="form--custom form-setting--custom pr10" label-position="top" :rules="checkRules" size="small">
          <el-tabs v-model="activeName">
            <el-tab-pane label="通用参数" name="first">
              <el-form-item prop="comRecTimeWindow">
                <span class="form__label">
                  时间窗
                  <el-tooltip content="在对应时间窗内，设备只会上传一次识别记录" placement="right">
                    <i class="iconfont icon-prompt"></i>
                  </el-tooltip>
                </span>
                <div>
                  <el-input v-model="deviceSetting.comRecTimeWindow"></el-input> 秒
                </div>
              </el-form-item>
              <el-form-item prop="comRecRank" v-show="deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6">
                <span class="form__label">
                  活体开关
                  <el-tooltip placement="right" content="检测是真人还是照片">
                    <i class="iconfont icon-prompt"></i>
                  </el-tooltip>
                  <el-switch
                    class="ml20"
                    v-model="deviceSetting.comRecRank"
                    :active-value="2"
                    :inactive-value="1"
                    @change="changeComRecRank">
                  </el-switch>
                </span>
              </el-form-item>
              <el-form-item prop="comRecDistModeType">
                <span class="form__label">
                  识别距离
                  <el-tooltip placement="right" content="例如识别距离在0.5米以内，设备只会检测0.5米以内的人脸">
                    <i class="iconfont icon-prompt"></i>
                  </el-tooltip>
                </span>
                <div>
                  <el-radio v-model="deviceSetting.comRecDistModeType" :label="2">0.5米以内</el-radio>
                  <el-radio v-model="deviceSetting.comRecDistModeType" :label="3">1米以内</el-radio>
                  <el-radio v-model="deviceSetting.comRecDistModeType" :label="4" v-show="deviceSetting.comRecRank === 1">1.5米以内</el-radio>
                  <el-radio v-model="deviceSetting.comRecDistModeType" :label="5" v-show="deviceSetting.comRecRank === 1">2米以内</el-radio>
                  <el-radio v-model="deviceSetting.comRecDistModeType" :label="6" v-show="deviceSetting.comRecRank === 1">3米以内</el-radio>
                  <el-radio v-model="deviceSetting.comRecDistModeType" :label="7" v-show="deviceSetting.comRecRank === 1">4米以内</el-radio>
                  <el-radio v-model="deviceSetting.comRecDistModeType" :label="1" v-show="deviceSetting.comRecRank === 1">无限制</el-radio>
                </div>
              </el-form-item>
              <el-form-item prop="comRelayTime" class="comRelayTime">
                <span class="form__label">
                  继电器控制时间
                  <el-tooltip placement="right">
                    <div slot="content">继电器控制开门到关门之间的时间间隔<br />请输入100-25500之间的整数，向下取整百</div>
                    <i class="iconfont icon-prompt"></i>
                  </el-tooltip>
                </span>
                <div>
                  <el-input v-model="deviceSetting.comRelayTime" class="f-margin-right5"></el-input>ms
                </div>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="识别参数" name="second" class="tab-child">
              <el-radio-group v-model="activeChild" style="margin-bottom: 30px;" class="tab-radio">
                <el-radio-button label="first">识别成功参数</el-radio-button>
                <el-radio-button label="second">识别失败参数</el-radio-button>
                <el-radio-button label="third">权限不足参数</el-radio-button>
              </el-radio-group>
              <el-tabs v-model="activeChild" class="tabs--button">
                <el-tab-pane name="first" class="pt10">
                  <el-form-item prop="recSucTtsModeType" :class="{'f-margin-bottom0': deviceSetting.recSucTtsModeType === 100}">
                    <span class="form__label">
                      语音播报模式
                      <el-tooltip placement="right" content="识别成功后语音播报内容">
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                    <div>
                      <el-radio v-model="deviceSetting.recSucTtsModeType" :label="1">播报名字</el-radio>
                      <el-radio v-model="deviceSetting.recSucTtsModeType" :label="2">不播报</el-radio>
                      <el-radio v-model="deviceSetting.recSucTtsModeType" :label="100">自定义</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item class="" prop="recSucTtsModeContent" v-show="deviceSetting.recSucTtsModeType === 100">
                    <el-input v-model="deviceSetting.recSucTtsModeContent" placeholder="允许{name}、{tag}、数字、英文和汉字"></el-input>
                    <div class="form__tip--bottom">如：{name}欢迎光临</div>
                  </el-form-item>
                  <el-form-item prop="recSucDisplayText1Type" :class="{'f-margin-bottom0': deviceSetting.recSucDisplayText1Type === 100}">
                    <span class="form__label">
                      屏幕显示文字1
                      <el-tooltip placement="right">
                        <div slot="content" class="form__tip--img"><img src="@/assets/images/device/suc-screen1.png" alt="屏幕显示文字1"></div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                    <div>
                      <el-radio v-model="deviceSetting.recSucDisplayText1Type" :label="1">显示名字</el-radio>
                      <el-radio v-model="deviceSetting.recSucDisplayText1Type" :label="100">自定义</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="recSucDisplayText1Content" v-show="deviceSetting.recSucDisplayText1Type === 100">
                    <el-input v-model="deviceSetting.recSucDisplayText1Content" placeholder="允许{name}、{tag}、数字、英文、汉字和符号"></el-input>
                    <div class="form__tip--bottom">如：{name}，欢迎光临！</div>
                  </el-form-item>
                  <el-form-item prop="recSucDisplayText2Type" :class="{'f-margin-bottom0': deviceSetting.recSucDisplayText2Type === 100}">
                    <span class="form__label">
                      屏幕显示文字2
                      <el-tooltip placement="right">
                        <div slot="content" class="form__tip--img"><img src="@/assets/images/device/suc-screen2.png" alt="屏幕显示文字2"></div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                    <div>
                      <el-radio v-model="deviceSetting.recSucDisplayText2Type" :label="1">识别成功</el-radio>
                      <el-radio v-model="deviceSetting.recSucDisplayText2Type" :label="100">自定义</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="recSucDisplayText2Content" v-show="deviceSetting.recSucDisplayText2Type === 100">
                    <el-input v-model="deviceSetting.recSucDisplayText2Content" placeholder="允许{name}、{tag}、数字、英文、汉字和符号"></el-input>
                    <div class="form__tip--bottom">如：{name}，欢迎光临！</div>
                  </el-form-item>
                  <el-form-item prop="recSucComModeType" :class="{'f-margin-bottom0': deviceSetting.recSucComModeType === 100}">
                    <span class="form__label">
                      串口输出模式
                      <el-tooltip placement="right">
                        <div slot="content">
                          串口支持输出韦根信号，设备需要外接串口→韦根信号转换小板，小板由本公司定制。自定义内容传入格式：<br />
                          韦根26：#26WG{cardNo}#，韦根34：#34WG{cardNo}#<br />
                          注意：{cardNo}+数字组合后，韦根26范围为1-65535，有效范围为5位；韦根34范围为1-4294967295，有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号。
                        </div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                    <div>
                      <el-radio v-model="deviceSetting.recSucComModeType" :label="1">开门</el-radio>
                      <el-radio v-model="deviceSetting.recSucComModeType" :label="2">不输出</el-radio>
                      <el-radio v-model="deviceSetting.recSucComModeType" :label="3">输出phone</el-radio>
                      <el-radio v-model="deviceSetting.recSucComModeType" :label="4">输出cardNo</el-radio>
                      <el-radio v-model="deviceSetting.recSucComModeType" :label="100">自定义</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="recSucComModeContent" v-show="deviceSetting.recSucComModeType === 100">
                    <el-input v-model="deviceSetting.recSucComModeContent" placeholder="允许{phone}、{cardNo}、数字、英文和英文符号"></el-input>
                  </el-form-item>
                  <el-form-item prop="recSucWiegandType" :class="{'f-margin-bottom0': deviceSetting.recSucWiegandType === 2 || deviceSetting.recSucWiegandType === 3}" v-show="deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6">
                    <span class="form__label">
                      韦根输出模式
                      <el-tooltip placement="right">
                        <div slot="content">{cardNo}+数字组合后，韦根26范围为1-65535，有效范围为5位；韦根34范围为1-4294967295，有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号</div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                    <div>
                      <el-radio v-model="deviceSetting.recSucWiegandType" :label="1">不输出</el-radio>
                      <el-radio v-model="deviceSetting.recSucWiegandType" :label="2">韦根26</el-radio>
                      <el-radio v-model="deviceSetting.recSucWiegandType" :label="3">韦根34</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="recSucWiegandContent" v-show="(deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6) && (deviceSetting.recSucWiegandType === 2 || deviceSetting.recSucWiegandType === 3)">
                    <el-input v-model="deviceSetting.recSucWiegandContent" placeholder="只允许{cardNo}和数字"></el-input>
                  </el-form-item>
                  <el-form-item prop="recSucRelayType" v-show="deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6">
                    <span class="form__label">
                      继电器输出
                      <el-tooltip placement="right" content="继电器输出打开，则识别后会输出开关量信号">
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                      <el-switch
                        class="ml20"
                        v-model="deviceSetting.recSucRelayType"
                        :active-value="1"
                        :inactive-value="2">
                      </el-switch>
                    </span>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="second" class="pt10">
                  <el-form-item prop="recFailEnable" class="form-item__background">
                    <span class="form__label">
                      识别失败
                      <el-tooltip placement="right" content="控制设备是否提示识别失败,开启后将保存陌生人的记录和现场抓拍照片">
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                      <el-switch
                        class="ml20"
                        v-model="deviceSetting.recFailEnable"
                        :active-value="1"
                        :inactive-value="2">
                      </el-switch>
                    </span>
                  </el-form-item>
                  <div v-show="deviceSetting.recFailEnable === 1">
                    <el-form-item prop="recFailTimesThreshold">
                      <span class="form__label">
                        识别失败判定次数
                        <el-tooltip placement="right" content="设备比对一定次数，均不通过，则判定为识别失败。次数越大，精度越高，时间越长范围（1-20的整数）">
                          <i class="iconfont icon-prompt"></i>
                        </el-tooltip>
                      </span>
                      <div>
                        <el-input v-model="deviceSetting.recFailTimesThreshold"></el-input>
                      </div>
                    </el-form-item>
                    <el-form-item prop="recFailTtsModeType" :class="{'f-margin-bottom0': deviceSetting.recFailTtsModeType === 100}">
                    <span class="form__label">
                      语音播报模式
                      <el-tooltip placement="right" content="识别失败后语音播报内容">
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                      <div>
                        <el-radio v-model="deviceSetting.recFailTtsModeType" :label="1">播报识别失败</el-radio>
                        <el-radio v-model="deviceSetting.recFailTtsModeType" :label="2">不播报</el-radio>
                        <el-radio v-model="deviceSetting.recFailTtsModeType" :label="100">自定义</el-radio>
                      </div>
                    </el-form-item>
                    <el-form-item prop="recFailTtsModeContent" v-show="deviceSetting.recFailTtsModeType === 100">
                      <el-input v-model="deviceSetting.recFailTtsModeContent" placeholder="只允许数字、英文和汉字"></el-input>
                      <div class="form__tip--bottom">如：注意陌生人</div>
                    </el-form-item>
                    <el-form-item prop="recFailDisplayTextType" :class="{'f-margin-bottom0': deviceSetting.recFailDisplayTextType === 100}">
                    <span class="form__label">
                      屏幕显示文字
                      <el-tooltip placement="right">
                        <div slot="content" class="form__tip--img"><img src="@/assets/images/device/fail-screen.png" alt="屏幕显示文字"></div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                      <div>
                        <el-radio v-model="deviceSetting.recFailDisplayTextType" :label="1">显示识别失败</el-radio>
                        <el-radio v-model="deviceSetting.recFailDisplayTextType" :label="100">自定义</el-radio>
                      </div>
                    </el-form-item>
                    <el-form-item prop="recFailDisplayTextContent" v-show="deviceSetting.recFailDisplayTextType === 100">
                      <el-input v-model="deviceSetting.recFailDisplayTextContent" placeholder="只允许数字、中英文和中英文符号"></el-input>
                      <div class="form__tip--bottom">如：注意陌生人！</div>
                    </el-form-item>
                    <el-form-item prop="recFailComModeType" :class="{'f-margin-bottom0': deviceSetting.recFailComModeType === 100}">
                      <span class="form__label">
                        串口输出模式
                        <el-tooltip placement="right">
                          <div slot="content">
                            串口支持输出韦根信号，设备需要外接串口→韦根信号转换小板，小板由本公司定制。自定义内容传入格式：<br />
                            韦根26：#26WG{cardNo}#，韦根34：#34WG{cardNo}#<br />
                            注意：{cardNo}+数字组合后，韦根26范围为1-65535，有效范围为5位；韦根34范围为1-4294967295，有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号。
                          </div>
                          <i class="iconfont icon-prompt"></i>
                        </el-tooltip>
                      </span>
                      <div>
                        <el-radio v-model="deviceSetting.recFailComModeType" :label="1">开门</el-radio>
                        <el-radio v-model="deviceSetting.recFailComModeType" :label="2">不输出</el-radio>
                        <el-radio v-model="deviceSetting.recFailComModeType" :label="100">自定义</el-radio>
                      </div>
                    </el-form-item>
                    <el-form-item prop="recFailComModeContent" v-show="deviceSetting.recFailComModeType === 100">
                      <el-input v-model="deviceSetting.recFailComModeContent" placeholder="允许数字、英文和英文符号"></el-input>
                    </el-form-item>
                    <el-form-item prop="recFailWiegandType" :class="{'f-margin-bottom0': deviceSetting.recFailWiegandType === 2 || deviceSetting.recFailWiegandType === 3}" v-show="deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6">
                    <span class="form__label">
                      韦根输出模式
                      <el-tooltip placement="right">
                        <div slot="content">{cardNo}+数字组合后，韦根26范围为1-65535，有效范围为5位；韦根34范围为1-4294967295，有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号。</div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                      <div>
                        <el-radio v-model="deviceSetting.recFailWiegandType" :label="1">不输出</el-radio>
                        <el-radio v-model="deviceSetting.recFailWiegandType" :label="2">韦根26</el-radio>
                        <el-radio v-model="deviceSetting.recFailWiegandType" :label="3">韦根34</el-radio>
                      </div>
                    </el-form-item>
                    <el-form-item prop="recFailWiegandContent" v-show="(deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6) && (deviceSetting.recFailWiegandType === 2 || deviceSetting.recFailWiegandType === 3)">
                      <el-input v-model="deviceSetting.recFailWiegandContent" placeholder="只允许数字"></el-input>
                    </el-form-item>
                    <el-form-item prop="recFailRelayType" v-show="deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6">
                      <span class="form__label">
                        继电器输出
                        <el-tooltip placement="right" content="继电器输出打开，则识别后会输出开关量信号">
                          <i class="iconfont icon-prompt"></i>
                        </el-tooltip>
                        <el-switch
                          class="ml20"
                          v-model="deviceSetting.recFailRelayType"
                          :active-value="1"
                          :inactive-value="2">
                        </el-switch>
                      </span>
                    </el-form-item>
                  </div>
                </el-tab-pane>

                <el-tab-pane name="third" class="pt10">
                  <el-form-item>
                    <span class="form__label">
                      权限不足参数<br />
                      识别成功后提示权限不足，例如：甲在08：00-20：00方可进入公司，然而他在21：00来到公司，则甲为权限不足
                    </span>
                  </el-form-item>
                  <el-form-item prop="recNoPerTtsModeType" :class="{'f-margin-bottom0': deviceSetting.recNoPerTtsModeType === 100}">
                    <span class="form__label">
                      语音播报模式
                      <el-tooltip placement="right" content="权限不足时语音播报内容">
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                    <div>
                      <el-radio v-model="deviceSetting.recNoPerTtsModeType" :label="1">播报姓名权限不足</el-radio>
                      <el-radio v-model="deviceSetting.recNoPerTtsModeType" :label="2">不播报</el-radio>
                      <el-radio v-model="deviceSetting.recNoPerTtsModeType" :label="100">自定义</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="recNoPerTtsModeContent" v-show="deviceSetting.recNoPerTtsModeType === 100">
                    <el-input v-model="deviceSetting.recNoPerTtsModeContent" placeholder="允许{name}、{tag}、数字、英文和汉字"></el-input>
                    <div class="form__tip--bottom">如：{name}权限不足</div>
                  </el-form-item>
                  <el-form-item prop="recNoPerDisplayText1Type" :class="{'f-margin-bottom0': deviceSetting.recNoPerDisplayText1Type === 100}">
                    <span class="form__label">
                      屏幕显示文字1
                      <el-tooltip placement="right">
                        <div slot="content" class="form__tip--img"><img src="@/assets/images/device/noper-screen1.png" alt="屏幕显示文字1"></div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                    <div>
                      <el-radio v-model="deviceSetting.recNoPerDisplayText1Type" :label="1">姓名</el-radio>
                      <el-radio v-model="deviceSetting.recNoPerDisplayText1Type" :label="100">自定义</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="recNoPerDisplayText1Content" v-show="deviceSetting.recNoPerDisplayText1Type === 100">
                    <el-input v-model="deviceSetting.recNoPerDisplayText1Content" placeholder="允许{name}、{tag}、数字、中英文和中英文符号"></el-input>
                    <div class="form__tip--bottom">如：{name}权限不足！</div>
                  </el-form-item>
                  <el-form-item prop="recNoPerDisplayText2Type" :class="{'f-margin-bottom0': deviceSetting.recNoPerDisplayText2Type === 100}">
                    <span class="form__label">
                      屏幕显示文字2
                      <el-tooltip placement="right">
                        <div slot="content" class="form__tip--img"><img src="@/assets/images/device/noper-screen2.png" alt="屏幕显示文字2"></div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                    <div>
                      <el-radio v-model="deviceSetting.recNoPerDisplayText2Type" :label="1">权限不足</el-radio>
                      <el-radio v-model="deviceSetting.recNoPerDisplayText2Type" :label="100">自定义</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="recNoPerDisplayText2Content" v-show="deviceSetting.recNoPerDisplayText2Type === 100">
                    <el-input v-model="deviceSetting.recNoPerDisplayText2Content" placeholder="允许{name}、{tag}、数字、中英文和中英文符号"></el-input>
                    <div class="form__tip--bottom">如：{name}权限不足！</div>
                  </el-form-item>
                  <el-form-item prop="recNoPerComModeType" :class="{'f-margin-bottom0': deviceSetting.recNoPerComModeType === 100}">
                    <span class="form__label">
                      串口输出模式
                      <el-tooltip placement="right">
                        <div slot="content">
                            串口支持输出韦根信号，设备需要外接串口→韦根信号转换小板，小板由本公司定制。自定义内容传入格式：<br />
                            韦根26：#26WG{cardNo}#，韦根34：#34WG{cardNo}#<br />
                            注意：{cardNo}+数字组合后，韦根26范围为1-65535，有效范围为5位；韦根34范围为1-4294967295，有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号。
                          </div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                    <div>
                      <el-radio v-model="deviceSetting.recNoPerComModeType" :label="1">开门</el-radio>
                      <el-radio v-model="deviceSetting.recNoPerComModeType" :label="2">不输出</el-radio>
                      <el-radio v-model="deviceSetting.recNoPerComModeType" :label="3">输出phone</el-radio>
                      <el-radio v-model="deviceSetting.recNoPerComModeType" :label="4">输出cardNo</el-radio>
                      <el-radio v-model="deviceSetting.recNoPerComModeType" :label="100">自定义</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="recNoPerComModeContent" v-show="deviceSetting.recNoPerComModeType === 100">
                    <el-input v-model="deviceSetting.recNoPerComModeContent" placeholder="允许{phone}、{cardNo}、数字中英文和中英文符号"></el-input>
                  </el-form-item>
                  <el-form-item prop="recNoPerWiegandType" :class="{'f-margin-bottom0': deviceSetting.recNoPerWiegandType === 2 || deviceSetting.recNoPerWiegandType === 3}" v-show="deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6">
                    <span class="form__label">
                      韦根输出模式
                      <el-tooltip placement="right">
                        <div slot="content">{cardNo}+数字组合后，韦根26范围为1-65535，有效范围为5位；韦根34范围为1-4294967295，有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号。</div>
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                    <div>
                      <el-radio v-model="deviceSetting.recNoPerWiegandType" :label="1">不输出</el-radio>
                      <el-radio v-model="deviceSetting.recNoPerWiegandType" :label="2">韦根26</el-radio>
                      <el-radio v-model="deviceSetting.recNoPerWiegandType" :label="3">韦根34</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="recNoPerWiegandContent" v-show="(deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6) && (deviceSetting.recNoPerWiegandType === 2 || deviceSetting.recNoPerWiegandType === 3)">
                    <el-input v-model="deviceSetting.recNoPerWiegandContent" placeholder="只允许{cardNo}和数字"></el-input>
                  </el-form-item>
                  <el-form-item prop="recNoPerRelayType" v-show="deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6">
                    <span class="form__label">
                      继电器输出
                      <el-tooltip placement="right" content="继电器输出打开，则识别后会输出开关量信号">
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                      <el-switch
                        class="ml20"
                        v-model="deviceSetting.recNoPerRelayType"
                        :active-value="1"
                        :inactive-value="2">
                      </el-switch>
                    </span>
                  </el-form-item>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="显示参数" name="third">
              <el-form-item prop="scrOrntType" v-show="deviceSetting.deviceType === 1">
                <span class="form__label">屏幕方向</span>
                <div>
                  <el-radio v-model="deviceSetting.scrDisplayText1Type" :label="1">横屏</el-radio>
                  <el-tooltip placement="right">
                    <div slot="content" class="form__tip--img"><img class="horizontal" src="@/assets/images/device/screen-horizontal.png" alt="横屏"></div>
                    <i class="iconfont icon-prompt"></i>
                  </el-tooltip>
                  <el-radio v-model="deviceSetting.scrDisplayText1Type" :label="2">竖屏</el-radio>
                  <el-tooltip placement="right">
                    <div slot="content" class="form__tip--img"><img src="@/assets/images/device/screen-vertical.png" alt="竖屏"></div>
                    <i class="iconfont icon-prompt"></i>
                  </el-tooltip>
                </div>
              </el-form-item>
              <el-form-item prop="scrDisplayText1Type" :class="{'f-margin-bottom0': deviceSetting.scrDisplayText1Type === 100}">
                <span class="form__label">显示文字1</span>
                <div>
                  <el-radio v-model="deviceSetting.scrDisplayText1Type" :label="1">不显示</el-radio>
                  <el-radio v-model="deviceSetting.scrDisplayText1Type" :label="2">应用名称</el-radio>
                  <el-radio v-model="deviceSetting.scrDisplayText1Type" :label="100">自定义</el-radio>
                </div>
              </el-form-item>
              <el-form-item prop="scrDisplayText1Content" v-show="deviceSetting.scrDisplayText1Type === 100">
                <el-input v-model="deviceSetting.scrDisplayText1Content" placeholder="如：宇泛智能科技有限公司"></el-input>
              </el-form-item>
              <el-form-item prop="scrDisplayText2Type" :class="{'f-margin-bottom0': deviceSetting.scrDisplayText2Type === 100}">
                <span class="form__label">显示文字2</span>
                <div>
                  <el-radio v-model="deviceSetting.scrDisplayText2Type" :label="1">不显示</el-radio>
                  <el-radio v-model="deviceSetting.scrDisplayText2Type" :label="2">设备名称</el-radio>
                  <el-radio v-model="deviceSetting.scrDisplayText2Type" :label="100">自定义</el-radio>
                </div>
              </el-form-item>
              <el-form-item prop="scrDisplayText2Content" v-show="deviceSetting.scrDisplayText2Type === 100">
                <el-input v-model="deviceSetting.scrDisplayText2Content" placeholder="如：东门口设备"></el-input>
              </el-form-item>
              <el-form-item prop="scrImage1Url">
                <span class="form__label">显示图片1</span>
                <div>
                  <div v-if="deviceSetting.scrImage1Url" class="delete-img inline-block mb-11">
                    <img v-if="deviceSetting.scrImage1Url" :src="`${baseUrl}/file/image/${deviceSetting.scrImage1Url}`" class="avatar">
                    <div class="delete-icon"><i class="iconfont icon-delete" @click="handleImageRemove('scrImage1Url')"></i></div>
                  </div>
                  <el-upload
                    v-else
                    class="form__upload inline-block"
                    action=""
                    :data="{target: 'scrImage1Url'}"
                    :before-upload="handleImageCheck"
                    :http-request="handleUpload"
                    :show-file-list="false"
                    :multiple="false">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <div class="el-upload__tip inline-block">
                    <el-tooltip placement="right">
                      <div slot="content" class="form__tip--img"><img class="logo" src="@/assets/images/device/default-image1.png" alt="显示图片1默认图"></div>
                      <el-button type="text" size="small">查看默认图</el-button>
                    </el-tooltip>
                    <br/>照片比例1:1，大小不得超过2M
                    <br/>文件格式支持jpg、jpeg、png
                    <br/>如：公司logo
                  </div>
                </div>
              </el-form-item>
              <el-form-item prop="scrImage2Url">
                <span class="form__label">显示图片2</span>
                <div>
                  <div v-if="deviceSetting.scrImage2Url" class="delete-img inline-block mb-11">
                    <img v-if="deviceSetting.scrImage2Url" :src="`${baseUrl}/file/image/${deviceSetting.scrImage2Url}`" class="avatar">
                    <div class="delete-icon"><i class="iconfont icon-delete" @click="handleImageRemove('scrImage2Url')"></i></div>
                  </div>
                  <el-upload
                    v-else
                    class="form__upload inline-block"
                    action=""
                    :data="{target: 'scrImage2Url'}"
                    :before-upload="handleImageCheck"
                    :http-request="handleUpload"
                    :show-file-list="false"
                    :multiple="false">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <div class="el-upload__tip inline-block">
                    照片比例1:1，大小不得超过2M
                    <br/>文件格式支持jpg、jpeg、png
                    <br/>如：二维码
                  </div>
                </div>
              </el-form-item>
              <el-form-item>
                <span class="form__label">显示设置</span>
                <div class="show-setting__item">
                  <span>IP</span>
                  <el-switch class="ml20" v-model="deviceSetting.showIp"></el-switch>
                </div>
                <div class="show-setting__item">
                  <span>设备序列号 </span>
                  <el-switch class="ml20" v-model="deviceSetting.showDeviceKey"></el-switch>
                </div>
                <div class="show-setting__item">
                  <span>人数</span>
                  <el-switch class="ml20" v-model="deviceSetting.showPersonCount"></el-switch>
                </div>
              </el-form-item>
              <el-form-item prop="scrDisableUrl">
                <span class="form__label">禁用界面图片</span>
                <div>
                  <div v-if="deviceSetting.scrDisableUrl" class="delete-img inline-block mb-11">
                    <img v-if="deviceSetting.scrDisableUrl" :src="`${baseUrl}/file/image/${deviceSetting.scrDisableUrl}`" class="avatar">
                    <div class="delete-icon"><i class="iconfont icon-delete" @click="handleImageRemove('scrDisableUrl')"></i></div>
                  </div>
                  <el-upload
                    v-else
                    class="form__upload inline-block"
                    action=""
                    :data="{target: 'scrDisableUrl'}"
                    :before-upload="handleImageCheck"
                    :http-request="handleUpload"
                    :show-file-list="false"
                    :multiple="false">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <div class="el-upload__tip inline-block">
                    <el-tooltip placement="right">
                      <div slot="content" class="form__tip--img"><img src="@/assets/images/device/default-image2.png" alt="显示图片1默认图"></div>
                      <el-button type="text" size="small">查看默认图</el-button>
                    </el-tooltip>
                    <br/>照片比例1:1，大小不得超过2M
                    <br/>文件格式支持jpg、jpeg、png
                    <br/>用于设备禁用时的展示
                  </div>
                </div>
              </el-form-item>
              <el-form-item prop="bigScrUrl" v-show="deviceSetting.deviceType === 1">
                <span class="form__label">大屏背景图片</span>
                <div>
                  <div v-if="deviceSetting.bigScrUrl" class="delete-img inline-block mb-11">
                    <img v-if="deviceSetting.bigScrUrl" :src="`${baseUrl}/file/image/${deviceSetting.bigScrUrl}`" class="avatar">
                    <div class="delete-icon"><i class="iconfont icon-delete" @click="handleImageRemove('bigScrUrl')"></i></div>
                  </div>
                  <el-upload
                    v-else
                    class="form__upload inline-block"
                    action=""
                    :data="{target: 'bigScrUrl'}"
                    :before-upload="handleImageCheck"
                    :http-request="handleUpload"
                    :show-file-list="false"
                    :multiple="false">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <div slot="tip" class="el-upload__tip inline-block">
                    照片比例1:1，大小不得超过2M
                    <br/>文件格式支持jpg、jpeg、png
                    <br/>大屏显示时候使用
                  </div>
                </div>
              </el-form-item>
              <img src="@/assets/images/device/parameter1.png" alt="显示参数图片" class="show-parameter__img--horizontal" v-if="deviceSetting.deviceType === 1">
              <img src="@/assets/images/device/parameter2.png" alt="显示参数图片" class="show-parameter__img--vertical" v-else>
            </el-tab-pane>
            <el-tab-pane label="识别模式" name="fourth">
              <el-form-item prop="recFailEnable" class="form-item__background">
                  <span class="form__label">
                    人脸识别
                    <el-switch
                      class="ml20"
                      v-model="deviceSetting.faceEnable"
                      :active-value="1"
                      :inactive-value="2">
                    </el-switch>
                  </span>
                </el-form-item>
                <div v-show="deviceSetting.faceEnable === 1">
                  <el-form-item prop="faceScore">
                    <span class="form__label">
                      人脸识别阈值
                      <el-tooltip placement="right" content="请输入1~100的整数，分数越高，识别准确率越高。为保证准确率，建议值50~100">
                        <i class="iconfont icon-prompt"></i>
                      </el-tooltip>
                    </span>
                    <div>
                      <el-input v-model="deviceSetting.faceScore"></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item prop="faceDetectionType">
                    <el-radio class="mr5" v-model="deviceSetting.faceDetectionType" :label="1">多人识别</el-radio>
                    <el-tooltip placement="right" content="识别区域内出现的人脸均会检测">
                      <i class="iconfont icon-prompt"></i>
                    </el-tooltip>
                    <el-radio class="ml30 mr5" v-model="deviceSetting.faceDetectionType" :label="2">单人识别</el-radio>
                    <el-tooltip placement="right" content="识别区域只检测最大人脸">
                      <i class="iconfont icon-prompt"></i>
                    </el-tooltip>
                  </el-form-item>
                </div>
                <el-form-item prop="recFailEnable" class="form-item__background">
                  <span class="form__label">
                    刷卡识别
                    <el-switch
                      class="ml20"
                      v-model="deviceSetting.cardEnable"
                      :active-value="1"
                      :inactive-value="2">
                    </el-switch>
                    <el-tooltip placement="right">
                      <div slot="content">当前刷卡识别与人卡合一不可共存，因为它们使用同一个串口输出</div>
                      <i class="icon-prompt iconfont"></i>
                    </el-tooltip>
                  </span>
                </el-form-item>
                <div v-show="deviceSetting.cardEnable === 1">
                  <el-form-item prop="cardIntf">
                    <span class="form__label">卡号传输接口</span>
                    <div>
                      <el-radio v-model="deviceSetting.cardIntf" :label="1" v-if="false">USB</el-radio>
                      <el-radio v-model="deviceSetting.cardIntf" :label="2" v-if="deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6">TTL串口</el-radio>
                      <el-radio v-model="deviceSetting.cardIntf" :label="3" v-if="deviceSetting.deviceType === 1">232串口</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="cardHardware">
                    <span class="form__label">外接硬件类型</span>
                    <div>
                      <el-radio v-model="deviceSetting.cardHardware" :label="1">IC读卡器</el-radio>
                      <el-radio v-model="deviceSetting.cardHardware" :label="2" v-if="false">新中新</el-radio>
                      <el-radio v-model="deviceSetting.cardHardware" :label="3" v-if="false">精伦</el-radio>
                      <el-radio v-model="deviceSetting.cardHardware" :label="4" v-if="false">中控</el-radio>
                    </div>
                  </el-form-item>
                </div>
                <el-form-item prop="cardFaceEnable" class="form-item__background">
                  <span class="form__label">
                    人卡合一
                    <el-switch
                      class="ml20"
                      v-model="deviceSetting.cardFaceEnable"
                      :active-value="1"
                      :inactive-value="2"
                      :disabled="deviceSetting.recType === 2">
                    </el-switch>
                    <el-tooltip placement="right">
                      <div slot="content">
                        1.当前设备识别模式为云端识别，目前云端识别不支持人卡合一，人证比对模块，如有需要，请在编辑设备中识别方式改为本地识别<br />
                        2.当前刷卡识别与人卡合一不可共存，因为它们使用同一个串口输出
                      </div>
                      <i class="icon-prompt iconfont"></i>
                    </el-tooltip>
                    <!-- <span class="form__tip--bottom f-margin-left10">（云端识别模式下此项不生效）</span> -->
                  </span>
                </el-form-item>
                <div v-show="deviceSetting.cardFaceEnable === 1">
                  <el-form-item prop="cardFaceScore">
                    <span class="form__label">人脸识别阈值<span class="label__details">（请输入1~100的整数，分数越高，识别准确率越高。为保证准确率，建议值50~100）</span></span>
                    <div>
                      <el-input v-model="deviceSetting.cardFaceScore"></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item prop="cardFaceIntf">
                    <span class="form__label">卡号传输接口</span>
                    <div>
                      <el-radio v-model="deviceSetting.cardFaceIntf" :label="1" v-if="false">USB</el-radio>
                      <el-radio v-model="deviceSetting.cardFaceIntf" :label="2" v-if="deviceSetting.deviceType === 2 || deviceSetting.deviceType === 3 || deviceSetting.deviceType === 6">TTL串口</el-radio>
                      <el-radio v-model="deviceSetting.cardFaceIntf" :label="3" v-if="deviceSetting.deviceType === 1">232串口</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="cardFaceHardware">
                    <span class="form__label">外接硬件类型</span>
                    <div>
                      <el-radio v-model="deviceSetting.cardFaceHardware" :label="1">IC读卡器</el-radio>
                      <el-radio v-model="deviceSetting.cardFaceHardware" :label="2" v-if="false">新中新</el-radio>
                      <el-radio v-model="deviceSetting.cardFaceHardware" :label="3" v-if="false">精伦</el-radio>
                      <el-radio v-model="deviceSetting.cardFaceHardware" :label="4" v-if="false">中控</el-radio>
                    </div>
                  </el-form-item>
                </div>
                <el-form-item prop="idCardFaceEnable" class="form-item__background">
                  <span class="form__label">
                    人证比对
                    <el-switch
                      class="ml20"
                      v-model="deviceSetting.idCardFaceEnable"
                      :active-value="1"
                      :inactive-value="2"
                      :disabled="deviceSetting.recType === 2">
                    </el-switch>
                    <el-tooltip placement="right" content="如果设备是云端则人卡合一与人证比对不可开启，若需要开启，请在编辑设备中修改为本地识别">
                      <i class="icon-prompt iconfont"></i>
                    </el-tooltip>
                    <!-- <span class="form__tip--bottom f-margin-left10">（云端识别模式下此项不生效）</span> -->
                  </span>
                </el-form-item>
                <div v-show="deviceSetting.idCardFaceEnable === 1">
                  <el-form-item prop="idCardFaceScore">
                    <span class="form__label">人脸识别阈值<span class="label__details">（请输入1~100的整数，分数越高，识别准确率越高。为保证准确率，建议值50~100）</span></span>
                    <div>
                      <el-input v-model="deviceSetting.idCardFaceScore"></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item prop="idCardFaceIntf">
                    <span class="form__label">卡号传输接口</span>
                    <div>
                      <el-radio v-model="deviceSetting.idCardFaceIntf" :label="1">USB</el-radio>
                      <el-radio v-model="deviceSetting.idCardFaceIntf" :label="2" v-if="false">TTL串口</el-radio>
                      <el-radio v-model="deviceSetting.idCardFaceIntf" :label="3">232串口</el-radio>
                    </div>
                  </el-form-item>
                  <el-form-item prop="idCardFaceHardware">
                    <span class="form__label">外接硬件类型</span>
                    <div>
                      <el-radio v-model="deviceSetting.idCardFaceHardware" :label="1" v-if="false">IC读卡器</el-radio>
                      <el-radio v-model="deviceSetting.idCardFaceHardware" :label="2">新中新</el-radio>
                      <el-radio v-model="deviceSetting.idCardFaceHardware" :label="3">精伦</el-radio>
                      <el-radio v-model="deviceSetting.idCardFaceHardware" :label="4">中控</el-radio>
                    </div>
                  </el-form-item>
                </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-scrollbar>
      <div class="footer__btn">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="handleDeviceSettingUpdate()">保存</el-button>
      </div>
    </div>

    <el-dialog
      title="配置失败设备"
      :visible.sync="failVisible"
      width="860px">
      <div>
        <el-table class="table__fail" :data="failList" :height="300">
          <el-table-column prop="deviceName" label="设备名称" min-width="100"></el-table-column>
          <el-table-column prop="deviceKey" label="设备序列号" min-width="80"></el-table-column>
          <el-table-column prop="reason" label="失败原因" min-width="200">
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
  name: 'deviceConfig',
  data () {
    // 公用
    // 允许{name}、{tag}，汉字/字母/数字 1-255
    const rulesType1 = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        return callback(new Error('请输入语音播报自定义内容'))
      } else if (value.length > 255) {
        return callback(new Error('请输入1-255位字符'))
      } else if (!/^(({name})|({tag})|[\u4e00-\u9fa5a-zA-Z\d\s])*$/.test(value)) {
        return callback(new Error('允许{name}、{tag}、数字、英文和汉字'))
      } else {
        return callback()
      }
    }
    // 数字、中英文和中英文符号 1-255
    const rulesType2 = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        return callback(new Error('请输入屏幕显示文字'))
      } else if (value.length > 255) {
        return callback(new Error('请输入1-255位字符'))
      } else {
        return callback()
      }
    }
    // 只允许{cardNo}和数字
    const rulesType3 = (rule, value, callback, parent) => {
      const num = value ? Number(value.replace(/{cardNo}/g, '')) : 0
      if (value === '' || value === null || value === undefined) {
        return callback(new Error('请输入韦根输出自定义内容'))
      } else if (!/^(({cardNo})|\d)*$/.test(value)) {
        return callback(new Error('只允许{cardNo}和数字'))
      } else if (!num) {
        return callback()
      } else if (parent === 2 && (num < 1 || num > 65535)) {
        return callback(new Error('韦根26范围为1-65535'))
      } else if (parent === 3 && (num < 1 || num > 4294967295)) {
        return callback(new Error('韦根34范围为1-4294967295'))
      } else if (value.length > 255) {
        return callback(new Error('请输入1-255位字符'))
      } else {
        return callback()
      }
    }
    // 只允许1-100之间的整数
    const rulesType4 = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        return callback(new Error('请输入人脸识别阈值'))
      } else if (!/^\d*$/.test(value)) {
        return callback(new Error('只允许数字'))
      } else if (value > 100 || value < 1) {
        return callback(new Error('请输入1-100之间的整数'))
      } else {
        return callback()
      }
    }
    // 允许{phone}、{cardNo}，数字/英文/英文符号 1-255
    const rulesType5 = (rule, value, callback, type) => {
      if (value === '' || value === null || value === undefined) {
        return callback(new Error('请输入串口输出自定义内容'))
      } else if (value.length > 255) {
        return callback(new Error('请输入1-255位字符'))
      } else if (!/^(({phone})|({cardNo})|[a-zA-Z\d\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F])*$/.test(value)) {
        if (type === 'recFail') return callback(new Error('允许数字、英文和英文符号'))
        return callback(new Error('允许{phone}、{cardNo}、数字、英文和英文符号'))
      } else {
        return callback()
      }
    }
    // 私有
    const comRecTimeWindowRules = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        return callback(new Error('请输入时间窗'))
      } else if (!/^\d*$/.test(value)) {
        return callback(new Error('仅限整数'))
      } else {
        return callback()
      }
    }
    const comRelayTimeRules = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        return callback(new Error('请输入继电器控制时间'))
      } else if (!/^\d*$/.test(value)) {
        return callback(new Error('仅限数字'))
      } else if (value > 25500 || value < 100) {
        return callback(new Error('请输入100-25500之间的整数'))
      } else {
        return callback()
      }
    }
    const recSucTtsModeContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recSucTtsModeType === 100) {
        rulesType1(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recSucDisplayText1ContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recSucDisplayText1Type === 100) {
        rulesType2(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recSucDisplayText2ContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recSucDisplayText2Type === 100) {
        rulesType2(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recSucComModeContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recSucComModeType === 100) {
        rulesType5(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recSucWiegandContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recSucWiegandType === 2 || this.deviceSetting.recSucWiegandType === 3) {
        rulesType3(rule, value, callback, this.deviceSetting.recSucWiegandType)
      } else {
        return callback()
      }
    }
    const recFailTimesThresholdRules = (rule, value, callback) => {
      if (value === '' || value === null || value === undefined) {
        return callback(new Error('请输入识别失败判定次数'))
      } else if (!/^\d*$/.test(value)) {
        return callback(new Error('仅限数字'))
      } else if (value > 20 || value < 1) {
        return callback(new Error('请输入1-20的整数'))
      } else {
        return callback()
      }
    }
    const recFailTtsModeContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recFailTtsModeType === 100) {
        rulesType1(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recFailDisplayTextContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recFailDisplayTextType === 100) {
        rulesType2(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recFailComModeContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recFailComModeType === 100) {
        rulesType5(rule, value, callback, 'recFail')
      } else {
        return callback()
      }
    }
    const recFailWiegandContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recFailWiegandType === 2 || this.deviceSetting.recFailWiegandType === 3) {
        if (!value) {
          callback(new Error('请输入韦根输出自定义内容'))
        } else if (!/^\d*$/.test(value)) {
          callback(new Error('仅限数字'))
        } else if (this.deviceSetting.recFailWiegandType === 2 && (Number(value) < 1 || Number(value) > 65535)) {
          callback(new Error('韦根26范围为1-65535'))
        } else if (this.deviceSetting.recFailWiegandType === 3 && (Number(value) < 1 || Number(value) > 4294967295)) {
          callback(new Error('韦根34范围为1-4294967295'))
        } else {
          callback()
        }
      } else {
        return callback()
      }
    }
    const recNoPerTtsModeContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recNoPerTtsModeType === 100) {
        rulesType1(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recNoPerDisplayText1ContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recNoPerDisplayText1Type === 100) {
        rulesType2(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recNoPerDisplayText2ContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recNoPerDisplayText2Type === 100) {
        rulesType2(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recNoPerComModeContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recNoPerComModeType === 100) {
        rulesType5(rule, value, callback)
      } else {
        return callback()
      }
    }
    const recNoPerWiegandContentRules = (rule, value, callback) => {
      if (this.deviceSetting.recNoPerWiegandType === 2 || this.deviceSetting.recNoPerWiegandType === 3) {
        rulesType3(rule, value, callback, this.deviceSetting.recNoPerWiegandType)
      } else {
        return callback()
      }
    }
    const scrDisplayText1ContentRules = (rule, value, callback) => {
      if (this.deviceSetting.scrDisplayText1Type === 100) {
        if (value === '' || value === null || value === undefined) {
          return callback(new Error('请输入显示文字内容1'))
        } else if (value.length > 255) {
          return callback(new Error('请输入1-255位字符'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    const scrDisplayText2ContentRules = (rule, value, callback) => {
      if (this.deviceSetting.scrDisplayText2Type === 100) {
        if (value === '' || value === null || value === undefined) {
          return callback(new Error('请输入显示文字内容2'))
        } else if (value.length > 255) {
          return callback(new Error('请输入1-255位字符'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    const faceScoreRules = (rule, value, callback) => {
      if (this.deviceSetting.faceEnable === 1) {
        rulesType4(rule, value, callback)
      } else {
        return callback()
      }
    }
    const cardFaceScoreRules = (rule, value, callback) => {
      if (this.deviceSetting.cardFaceEnable === 1) {
        rulesType4(rule, value, callback)
      } else {
        return callback()
      }
    }
    const idCardFaceScoreRules = (rule, value, callback) => {
      if (this.deviceSetting.idCardFaceEnable === 1) {
        rulesType4(rule, value, callback)
      } else {
        return callback()
      }
    }

    return {
      failVisible: false,
      failList: [],
      activeName: 'first',
      activeChild: 'first',
      checkList: '', // 选中的设备列表
      deviceInfo: {},
      deviceSetting: {
        appId: '',
        deviceKey: '',
        deviceName: '',
        deviceType: 2,
        bigScrUrl: '', // 识别通用参数.大屏背景图片 默认使用设备自带图片
        cardEnable: 1, // 刷卡识别参数.刷卡模式开关 1:打开(默认) 2:关闭
        cardFaceEnable: 2, // 卡&人脸双重认证.卡&人脸双重认证开关 1:打开2:关闭(默认)
        cardFaceHardware: 1, // 卡&人脸双重认证.外接硬件类型 1:IC读卡器(默认) 2:新中新 3:精伦 4:中控
        cardFaceIntf: 2, // 卡&人脸双重认证.卡号传输接口 1:USB 2:TTL串口(默认) 3:232串口
        cardFaceScore: 80, // 卡&人脸双重认证.人脸识别阈值 80(默认)
        cardHardware: 1, // 刷卡识别参数.外接硬件类型 1:IC读卡器(默认) 2:新中新 3:精伦 4:中控
        cardIntf: 2, // 刷卡识别参数.卡号传输接口 1:USB 2:TTL串口(默认) 3:232串口 Uface设备自带的刷卡模块使用的是TTL串口 USB（或TTL或232）接口只能被一种识别模式使用，若>1种模式使用USB（或TTL或232）则报错。
        comRecDistModeType: 2, // 识别通用参数.识别距离 1:无限制(默认) 2:0.5以内 3:1米以内 4:1.5米以内 5:2米以内 6:3米以内 7:4米以内 若识别等级选择2活体，则5、6不可选；若识别等级选择1活体，则0-6均可选。
        comRecRank: 2, // 识别通用参数.识别等级 1:非活体 2:活体(默认)
        comRecTimeWindow: 60, // 识别通用参数.时间窗 60秒(默认)
        comRelayTime: 500, // 识别通用参数.继电器控制时间 500ms(默认) 继电器控制开门到关门之间的时间间隔，默认500ms。请输入100-25500之间的整数，向下取整百。如：输入101-199之间的整数，实际生效的是100ms。
        faceDetectionType: 1, // 刷脸识别参数.人脸检测类型 1:多人识别(默认) 2:单人识别
        faceEnable: 1, // 刷脸识别参数.刷脸模式开关 1:打开(默认) 2:关闭
        faceScore: 80, // 刷脸识别参数.人脸识别阈值 80(默认) 实际允许0-100之间的所有整数。提示：请输入1~100的整数，分数越高，识别准确率越高。为保证准确率，建议值50~100。分数越高，识别准确率越高，但识别速度会变慢。
        idCardFaceEnable: 2, // 人证比对参数.人证比对开关 1:打开 2:关闭(默认)
        idCardFaceHardware: 2, // 人证比对参数.外接硬件类型 1:IC读卡器 2:新中新(默认) 3:精伦 4:中控
        idCardFaceIntf: 3, // 人证比对参数.卡号传输接口 1:USB 2:TTL串口 3:232串口(默认)
        idCardFaceScore: 50, // 人证比对参数.人脸识别阈值 50(默认)
        recFailComModeContent: '', // 识别失败参数.串口输出自定义内容
        recFailComModeType: 2, // 识别失败参数.串口输出模式 1:开门2:不输出(默认) 100:自定义
        recFailDisplayTextContent: '', // 识别失败参数.屏幕显示文字自定义内容 内容只允许数字、中英文和中英文符号，长度限制255个字符。如：注意陌生人！
        recFailDisplayTextType: 1, // 识别失败参数.屏幕显示文字类型 1:识别失败(默认) 100:自定义
        recFailEnable: 1, // 识别失败参数.识别失败开关 1:打开(默认) 2:关闭
        recFailRelayType: 2, // 识别失败参数.继电器输出类型 1:输出 2:不输出(默认)
        recFailTimesThreshold: 3, // 识别失败参数.判定次数 3(默认) 打开识别失败开关后，该选项有效；连续比对N次都未达到分数阈值，则判定为识别失败，默认3次；传入值请选择1-20之间的整数，1表示快速判定但精确率最低，随着数值增加，判定时间增加，精确度提高
        recFailTtsModeContent: '', // 识别失败参数.语音播报自定义内容 内容只允许数字、英文和汉字，长度限制255个字符。如：注意陌生人
        recFailTtsModeType: 1, // 识别失败参数.语音播报类型 1:识别失败(默认) 2:不播放 100:自定义
        recFailWiegandContent: '', // 识别失败参数.韦根输出自定义内容
        recFailWiegandType: 1, // 识别失败参数.韦根输出类型 1:不输出(默认) 2:韦根26 3:韦根34
        recNoPerComModeContent: '', // 权限不足参数.串口输出自定义内容
        recNoPerComModeType: 2, // 权限不足参数.串口输出模式 1:开门 2:不输出(默认) 3:输出phone 4:输出cardNo 100:自定义
        recNoPerDisplayText1Content: '', // 权限不足参数.屏幕显示文字1自定义内容
        recNoPerDisplayText1Type: 1, // 权限不足参数.屏幕显示文字1类型 1:姓名(默认) 100:自定义
        recNoPerDisplayText2Content: '', // 权限不足参数.屏幕显示文字2自定义内容
        recNoPerDisplayText2Type: 1, //  权限不足参数.屏幕显示文字2类型 1:权限不足(默认) 100:自定义
        recNoPerRelayType: 2, // 权限不足参数.继电器输出类型 1:输出 2:不输出(默认)
        recNoPerTtsModeContent: '', // 权限不足参数.语音播报自定义内容 允许{name}、{tag}。字段格式固定，其他内容只允许数字、英文和汉字，长度限制255个字符。如：{name}无权通行
        recNoPerTtsModeType: 1, // 权限不足参数.语音播报类型 1:播报姓名权限不足(默认) 2:不播放 100:自定义
        recNoPerWiegandContent: '', // 权限不足参数.韦根输出自定义内容
        recNoPerWiegandType: 1, // 权限不足参数.韦根输出类型 1:不输出(默认) 2:韦根26 3:韦根34
        recSucComModeContent: '', // 识别成功参数.串口输出自定义内容
        recSucComModeType: 1, // 识别成功参数.串口输出模式 1:开门(默认) 2:不输出 3:输出phone 4:输出cardNo 100:自定义
        recSucDisplayText1Content: '', // 识别成功参数.屏幕显示文字1自定义内容
        recSucDisplayText1Type: 1, // 识别成功参数.屏幕显示文字1类型 1:姓名(默认) 100:自定义
        recSucDisplayText2Content: '', // 识别成功参数.屏幕显示文字2自定义内容
        recSucDisplayText2Type: 1, // 识别成功参数.屏幕显示文字2类型 1:识别成功(默认) 100:自定义
        recSucRelayType: 1, // 识别成功参数.继电器输出类型 1:输出(默认) 2:不输出
        recSucTtsModeContent: '', // 识别成功参数.语音播报自定义内容 允许{name}、{tag}。字段格式固定，其他内容只允许数字、英文和汉字，长度限制255个字符。如：{name}欢迎光临
        recSucTtsModeType: 1, // 识别成功参数.语音播报类型 1:播报名字(默认) 2:不播放 100:自定义
        recSucWiegandContent: '', // 识别成功参数.韦根输出自定义内容 允许{phone}、{cardNo}。字段格式固定且只能为数字或字母，其他内容只允许数字、英文和英文符号，长度限制255个字符。串口支持输出韦根信号，设备需要外接串口→韦根信号转换小板，小板由本公司定制。自定义内容传入格式：韦根26：#26WG{cardNo}#，韦根34：#34WG{cardNo}#注意：{cardNo}+数字组合后，韦根26范围为1-65535（待定），有效范围为5位；韦根34范围为1-4294967295（待定），有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号。
        recSucWiegandType: 1, // 识别成功参数.韦根输出类型 1:不输出(默认) 2:韦根26 3:韦根34
        scrDisableUrl: '', // 识别通用参数.禁用界面图片 默认使用设备自带图片
        scrDisplayText1Content: '', // 识别通用参数.显示文字内容1自定义内容 长度限制255
        scrDisplayText1Type: 1, // 识别通用参数.显示文字内容1类型 1:应用名称(默认) 100:自定义
        scrDisplayText2Content: '', // 识别通用参数.显示文字内容2自定义内容 长度限制255
        scrDisplayText2Type: 1, // 识别通用参数.显示文字内容2类型 1:不显示(LAN默认) 2设备名称 100:自定义
        scrImage1Url: '', // 识别通用参数.显示图片1 默认使用设备自带图片
        scrImage2Url: '', // 识别通用参数.显示图片2 默认使用设备自带图片
        scrOrntType: 1, // 识别通用参数.屏幕方向 1:横屏(默认) 2:竖屏
        showDeviceKey: true,
        showIp: true,
        showPersonCount: true
      },
      checkRules: {
        comRecTimeWindow: [ // 时间窗
          { validator: comRecTimeWindowRules, trigger: 'blur' }
        ],
        comRelayTime: [ // 继电器控制时间
          { validator: comRelayTimeRules, trigger: 'blur' }
        ],
        recSucTtsModeContent: [ // 识别成功语音播报自定义内容
          { validator: recSucTtsModeContentRules, trigger: 'blur' }
        ],
        recSucDisplayText1Content: [ // 识别成功屏幕显示文字1
          { validator: recSucDisplayText1ContentRules, trigger: 'blur' }
        ],
        recSucDisplayText2Content: [ // 识别成功屏幕显示文字2
          { validator: recSucDisplayText2ContentRules, trigger: 'blur' }
        ],
        recSucComModeContent: [ // 识别成功串口输出模式
          { validator: recSucComModeContentRules, trigger: 'blur' }
        ],
        recSucWiegandContent: [ // 识别成功韦根自定义内容
          { validator: recSucWiegandContentRules, trigger: 'blur' }
        ],
        recFailTimesThreshold: [ // 识别失败判定次数
          { validator: recFailTimesThresholdRules, trigger: 'blur' }
        ],
        recFailTtsModeContent: [ // 识别失败语音播报自定义内容
          { validator: recFailTtsModeContentRules, trigger: 'blur' }
        ],
        recFailDisplayTextContent: [ // 识别失败屏幕显示文字
          { validator: recFailDisplayTextContentRules, trigger: 'blur' }
        ],
        recFailComModeContent: [ // 识别失败串口输出模式
          { validator: recFailComModeContentRules, trigger: 'blur' }
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
        faceScore: [ // 人脸识别阈值
          { validator: faceScoreRules, trigger: 'blur' }
        ],
        cardFaceScore: [ // 卡&人脸双重认证人脸识别阈值
          { validator: cardFaceScoreRules, trigger: 'blur' }
        ],
        idCardFaceScore: [ // 人证比对人脸识别阈值
          { validator: idCardFaceScoreRules, trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
    filterDeviceType (val) { // 设备类型
      switch (val) {
        case 1:
          return 'Uface1代'
        case 2:
          return 'Uface2代'
        case 3:
          return 'Uface3代'
        case 6:
          return 'Uface-C'
        case 90:
          return '分析网关'
      }
    },
    filterDeviceRecType (val) { // 设备识别方式
      switch (val) {
        case 1:
          return '本地识别'
        case 2:
          return '云端识别'
      }
    }
  },
  created () {
    this.checkList = JSON.parse(sessionStorage.getItem('deviceList'))
  },
  methods: {
    // 修改设备配置
    handleDeviceSettingUpdate () {
      this.$refs['deviceSettingForm'].validate((valid) => {
        if (valid) {
          let params = {
            ...this.deviceSetting,
            deviceKeyList: this.checkList.map(ele => ele.deviceKey)
          }
          params.comRelayTime = this.changeComRelayTime(this.deviceSetting.comRelayTime)
          configDevice(params).then(res => {
            if (res.success) {
              this.failList = res.data.filter(ele => !ele.success)
              if (this.failList.length) {
                this.failVisible = true
              } else {
                this.$message.success('设备配置成功！')
                this.$router.go(-1)
              }
            }
          })
        } else {
          this.$message.error('设备配置内容存在错误，请切换标签页核对后重新提交')
          return false
        }
      })
    },
    // 修改识别等级，切换识别距离为默认值
    changeComRecRank () {
      const distance = [1, 4, 5, 6, 7]
      if (distance.includes(this.deviceSetting.comRecDistModeType)) {
        this.deviceSetting.comRecDistModeType = 3
      }
    },
    // 修改继电器时间，保证输出为整百数
    changeComRelayTime (time) {
      return parseInt(time / 100) * 100
    },
    // 图片上传前校验
    handleImageCheck (file) {
      const fileTypeList = ['image/jpeg', 'image/png', 'image/jpg'] // 支持的文件格式
      const fileMaxSize = 2 // 文件大小限制 单位MB
      const fileType = file.type
      const fileSize = file.size
      if (!fileTypeList.includes(fileType)) {
        this.$message.error('文件格式不正确，请重新选择')
        return false
      }
      if (fileSize > fileMaxSize * 1024 * 1024) {
        this.$message.error('文件过大，请重新选择')
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
    }
  },
  watch: {
    'deviceSetting.recSucWiegandType': { // 识别成功韦根自定义输出内容设置默认值
      handler (val) {
        if (!this.deviceSetting.recSucWiegandContent && this.deviceSetting.recSucWiegandContent !== 0) this.deviceSetting.recSucWiegandContent = '{cardNo}'
      },
      deep: true
    },
    'deviceSetting.recFailWiegandType': { // 权限不足韦根自定义输出内容设置默认值
      handler (val) {
        if (val === 2 || val === 3) {
          if (!this.deviceSetting.recFailWiegandContent && this.deviceSetting.recFailWiegandContent !== 0) this.deviceSetting.recFailWiegandContent = '{cardNo}'
        }
      },
      deep: true
    },
    'deviceSetting.recNoPerWiegandType': { // 权限不足韦根自定义输出内容设置默认值
      handler (val) {
        if (val === 2 || val === 3) {
          if (!this.deviceSetting.recNoPerWiegandContent && this.deviceSetting.recNoPerWiegandContent !== 0) this.deviceSetting.recNoPerWiegandContent = '{cardNo}'
        }
      },
      deep: true
    },
    'deviceSetting.cardEnable': { // 保证刷卡识别和人卡合一不能同时开启
      handler (val) {
        if (val === 1) {
          this.deviceSetting.cardFaceEnable = 2
        }
      },
      deep: true
    },
    'deviceSetting.cardFaceEnable': { // 保证刷卡识别和人卡合一不能同时开启
      handler (val) {
        if (val === 1) {
          this.deviceSetting.cardEnable = 2
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.mb-11{
  margin-bottom: -11px;
}
.f-margin-bottom0{
  margin-bottom: 0;
}
.form-scroll{
  width: 100%;
  height: calc(100% - 60px);
}
.hd__back{
  color: #606266;
}
.content__header, .container__content, .content__footer{
  height: auto;
}
.container__content .content__main{
  max-height: max-content;
}
.content__header{
  padding: 20px 0 20px 0;
  overflow: hidden;
}
.content__header .basic-info__box{
  float: left;
  width: 200px;
  padding-right: 20px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}
.content__header .basic-info__box .title{
  font-size: 14px;
  color: #606266;
  margin-bottom: 5px;
  height: 30px;
}
.content__header .basic-info__box .info{
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.container__content{
  min-height: calc(100vh - 50px - 30px - 30px - 30px); /* 减去header、上下边距 */
}
.form-item__background{
  background: #f1f4f7;
  padding: 4px 14px;
  margin-bottom: 10px;
}
.form--custom .el-input{
  width: 360px;
}
.form--custom .setting__ipt--short{
  display: inline-block;
  width: 100px;
  margin-right: 10px;
}
.form__tip--bottom{
  font-size: 12px;
  color: #909399;
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
.avatar-uploader-icon{
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  &:hover{
    border-color: #409EFF;
  }
}
.form__upload--preview{
  border: 1px solid red;
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
  top: 280px;
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
  padding: 40px 0 0 0;
  text-align: left;
  border-top: 1px solid #E4E7ED;
}
.footer__btn{
  width: 96px;
  height: 36px;
  line-height: 36px;
  padding: 0;
  text-align: center;
}
.icon-prompt{
  color: #2EA2F8;
  vertical-align: -1px;
}
.icon-prompt iconfont{
  color: #2EA2F8;
  font-size: 14px;
  margin-left: 10px;
  vertical-align: -2px;
cursor: pointer;
}
.tab-child{
.el-tabs__header{
  height: 0;
  overflow: hidden;
}
.is-active .el-radio-button__inner{
  background: #fff!important;
  color: #2EA2F8!important;
}
}
.tab-radio{
  margin-bottom: 0!important;
}
.footer__btn{
  width: 100%;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  text-align: left;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.delete-img{
  border: 1px dashed #d9d9d9;
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 4px;
  position: relative;
  margin-bottom: 15px;
  &:hover .delete-icon{
    display: block;
  }
}
.delete-icon{
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  display: none;
  background: rgba(0, 0, 0, .4);
  position: absolute;
  border-radius: 4px;
  top: 0;
  left: 0;
  i{
    cursor: pointer;
    color: #fff;
    font-size: 20px;
  }
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  position: absolute;
  border-radius: 4px;
  top: 0;
  left: 0;
}
.tab-child/deep/{
  .el-tabs__header{
    display: none;
  }
}
.el-tabs/deep/{
  .el-tabs__item{
    font-size: 16px;
  }
}
.table__fail/deep/{
  tr>th{
    border-top: none;
  }
}
.icon-prompt{
  color: #409eff;
  padding-left: 10px;
}
</style>

<style>
.config-scroll .el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
