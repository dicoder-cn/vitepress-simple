import { defineStore } from "pinia";
import { GetVpConfigData, SaveConfig } from "../../wailsjs/go/vpsimpler/VpConfig";
import { IsEmptyValue, parseJsObject } from "@/utils/utils";
import { PathExists, PathJoin } from "../../wailsjs/go/system/SystemService";
import { ConfigKeyProjectDir } from "@/configs/appConfigKey";
import { ToastCheck, ToastInfo } from "@/utils/Toast";

import {} from "@/configs/defaultLangConfig";
import { StringGlobalLang, StringRootLang } from "@/configs/cnts";
import { CreateDir } from "../../wailsjs/go/services/ArticleTreeData";
import { AppConfig } from "./appconfig";
// import { VpConfig } from "@/types/vpConfig";
import { DefaultTheme, UserConfig } from "vitepress";

//这是一个简单的推荐store案例，可以在这里定义你的状态
//新建pinia时把vpconfig全局替换成你的store名字
export interface vpconfigStore {
  // themeConfig:DefaultTheme.Config//默认主题的配置
  srcDir: string; //相对路径
  fullSrcDir: string;
  baseDir: string;
  isInstall: boolean;
  configData: UserConfig<DefaultTheme.Config> | null; //直接使用vitepress的类型
  currSettingLangKey: string; //当前正在设置的语言
  currLangConfigIsUseRootConfig: boolean; //当前语言配置是否指向根目录
  configContent: string;
}

export const useVpconfigStore = defineStore("vpconfig", {
  state: (): vpconfigStore => ({
    // themeConfig:defaultThemeConfig,
    srcDir: "./docs", //doc目录（相对路径），取自配置文件
    baseDir: "", //根目录（绝对路径，已经过join）
    fullSrcDir: "", //doc目录（绝对路径,已经过join）
    isInstall: false,
    configData: null, //所有语言的公共配置
    // currLangConfig: {}, //当前编辑的语言的主题配置
    currSettingLangKey: "",
    currLangConfigIsUseRootConfig: false, //当前语言配置是否指向根目录
    configContent: ""
  }),
  actions: {
    async formatPath() {
      this.baseDir = await PathJoin([AppConfig.getString(ConfigKeyProjectDir)]);
    },
    //获取config.mts文件内容
    async readVpConfig() {
      //获取项目根目录(绝对路径)
      await this.formatPath();
      if (IsEmptyValue(this.baseDir)) {
        return;
      }
      // await this.backupConfigFile(); //如果是首次则备份文件夹，放在 this.baseDir后面
      const content = await GetVpConfigData(); //获取config.mts文件内容
      let configData: any = {};
      if (content == "") {
        ToastInfo("读取配置文件内容为空");
      } else {
        configData = parseJsObject(content); //解析config.mts文件内容
        console.log(configData, "configData -- console.log");
      }
      this.configData = configData ?? {};
      this.srcDir = configData["srcDir"];

      this.fullSrcDir = await PathJoin([this.baseDir, this.srcDir]);
      //判断如果原目录不存在则自动创建
      if (!(await PathExists(this.fullSrcDir))) {
        await CreateDir(this.fullSrcDir);
        ToastInfo(`检测到源目录不存在，已自动创建源目录:${this.fullSrcDir}`);
      }
    },
    async ExistsProjectDir() {
      await this.formatPath();
      const isExists = await PathExists(this.baseDir);
      if (isExists) {
        return true;
      } else {
        // ToastError("项目目录不存在:" + this.baseDir);
        return false;
      }
    },

    //设置当前语言配置指向根目录
    currLangConfigUseRootConfig() {
      this.currSettingLangKey = StringGlobalLang;
      this.currLangConfigIsUseRootConfig = true;
    },
    getFirstLang() {
      if (!this.configData) return "";
      const keys = Object.keys(this.configData.locales ?? []);
      if (keys.length == 0) {
        //没有配置多语言
        return "";
      } else {
        return keys[0];
      }
    },

    //保存配置
    async saveConfig() {
      const res = await SaveConfig(JSON.stringify(this.configData, null, 2));
      ToastCheck(res);
    }
  },
  getters: {
    //相对路径
    // SrcDir: (state) => state.srcDir,
    //基于语言的相对路径
    SrcLangDir: (state) => {
      if (state.currSettingLangKey == StringGlobalLang || state.currSettingLangKey == StringRootLang) {
        return state.srcDir;
      } else {
        return state.srcDir + "/" + state.currSettingLangKey;
      }
    },
    FullSrcLangDir: (state) => {
      if (state.currSettingLangKey == StringGlobalLang || state.currSettingLangKey == StringRootLang) {
        return state.fullSrcDir;
      } else {
        return state.fullSrcDir + "/" + state.currSettingLangKey;
      }
    },
    //是否使用多语言
    IsUseI18n: (state) => {
      return !IsEmptyValue(state.configData?.locales) && Object.keys(state.configData?.locales ?? {}).length > 0;
    },

    GetLangArray(state) {
      const langArray = [];
      for (const key in state.configData?.locales ?? {}) {
        langArray.push(key);
      }
      return langArray;
    },
    // 获取当前语言的配置
    CurrLangConfig: (state) => {
      if (state.currLangConfigIsUseRootConfig) {
        return state.configData?.locales;
      }
      return state.configData?.locales?.[state.currSettingLangKey];
    }
  }
});
