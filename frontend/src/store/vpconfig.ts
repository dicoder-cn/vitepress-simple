import { defineStore } from "pinia";
import { GetVpConfigData, SaveConfig } from "../../wailsjs/go/vpsimpler/VpConfig";
import { IsEmptyValue, parseJsObject } from "@/utils/utils";
import { PathExists, PathJoin } from "../../wailsjs/go/system/SystemService";
import { ConfigKeyProjectDir } from "@/configs/appConfigKey";
import { ToastCheck, ToastInfo } from "@/utils/Toast";
import { StringRootLang } from "@/configs/cnts";
import { CreateDir } from "../../wailsjs/go/services/ArticleTreeData";
import { AppConfig } from "./appconfig";
import { VpConfig, VpConfigLang } from "@/types/vpsimpleConfig";

export interface vpconfigStore {
  srcDir: string; //相对路径
  fullSrcDir: string;
  baseDir: string;
  vpConfig: VpConfig | null; //直接使用vitepress的类型
  currLangConfigKey: string; //当前正在设置的语言
  currLangConfig: VpConfigLang; //当前正在设置的语言
}

export const useVpconfigStore = defineStore("vpconfig", {
  state: (): vpconfigStore => ({
    srcDir: "./docs", //doc目录（相对路径），取自配置文件
    baseDir: "", //根目录（绝对路径，已经过join）
    fullSrcDir: "", //doc目录（绝对路径,已经过join）
    vpConfig: null, //所有语言的公共配置
    currLangConfigKey: "root", //root表示根目录，不使用多语言的时候使用root
    currLangConfig: {} as VpConfigLang //当前正在设置的语言
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
      let configData: VpConfig = {};
      if (content == "") {
        ToastInfo("读取配置文件内容为空");
        return;
      } else {
        configData = parseJsObject(content) as VpConfig; //解析config.mts文件内容
        console.log(configData, "configData -- console.log");
      }
      this.vpConfig = configData as any;
      this.srcDir = configData.srcDir ?? "";
      this.fullSrcDir = await PathJoin([this.baseDir, this.srcDir]);
      //判断如果原目录不存在则自动创建
      if (!(await PathExists(this.fullSrcDir))) {
        await CreateDir(this.fullSrcDir);
        ToastInfo(`检测到源目录不存在，已自动创建源目录:${this.fullSrcDir}`);
      }
    },
    //切换当前语言配置
    changeCurrLang(key: string): VpConfigLang {
      this.currLangConfigKey = key;
      this.currLangConfig = this.getLangConfig(key);
      return this.currLangConfig;
    },
    getLangConfig(key: string): VpConfigLang {
      if (!this.vpConfig) {
        this.vpConfig = {};
      }
      if (!this.vpConfig.locales) {
        this.vpConfig.locales = {};
      }

      const langConfig = this.vpConfig.locales[key];
      if (langConfig) {
        // 确保返回的配置对象包含必要的结构
        if (!langConfig.themeConfig) {
          langConfig.themeConfig = {};
          // 更新 vpConfig 中的值
          this.vpConfig.locales[key] = langConfig;
        }
        return langConfig;
      } else {
        // 创建新的语言配置时也确保包含必要的结构
        const newConfig = this.addLang(key, key);
        if (!newConfig.themeConfig) {
          newConfig.themeConfig = {};
          // 更新 vpConfig 中的值
          this.vpConfig.locales[key] = newConfig;
        }
        return newConfig;
      }
    },
    //新增一个语言
    addLang(key: string, label: string): VpConfigLang {
      if (!this.vpConfig) {
        this.vpConfig = {};
      }
      if (!this.vpConfig.locales) {
        this.vpConfig.locales = {};
      }
      const langConfig: VpConfigLang = {
        lang: key,
        label: label || key,
        themeConfig: {} // 初始化时添加 themeConfig
      };
      if (this.vpConfig.locales) {
        this.vpConfig.locales[key] = langConfig;
      }
      return langConfig;
    },
    //删除一个语言
    removeLang(key: string) {
      if (key === StringRootLang) {
        ToastInfo("can not remove root");
        return;
      }
      if (this.vpConfig?.locales?.[key]) {
        delete this.vpConfig.locales[key];
        // 如果删除的是当前语言，则切换到 root
        if (this.currLangConfigKey === key) {
          this.changeCurrLang(StringRootLang);
        }
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
    getLangKeys(): string[] {
      //获取所有语言列表keys
      if (!this.vpConfig?.locales) {
        return [];
      }
      return Object.keys(this.vpConfig.locales);
    },
    saveLangConfig(key:string,langConfig:VpConfigLang) {
      //判断key是否存在
      if (!this.vpConfig.locales[key]) {
        this.addLang(key, key);
      }
      this.vpConfig.locales[key] = langConfig;
    },
    //保存配置
    async saveConfig() {
      // console.log("this.vpConfig", this.vpConfig);
      // console.log("this.currlang key", this.currLangConfigKey, this.currLangConfig);
      this.saveLangConfig(this.currLangConfigKey,this.currLangConfig);
      const res = await SaveConfig(JSON.stringify(this.vpConfig, null, 2));
      ToastCheck(res);
    },
    // 修改配置更新函数，从 themeConfig 开始
    updateThemeConfig(path: string[], value: any) {
      if (!this.currLangConfig?.themeConfig) return;
      
      let current = this.currLangConfig.themeConfig as any;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
    }
  },
  getters: {
    //语言文档的路径（相对）
    SrcLangDir: (state) => {
      if (state.currLangConfigKey == StringRootLang) {
        return state.srcDir;
      } else {
        return state.srcDir + "/" + state.currLangConfigKey;
      }
    },
    //语言文档的路径（绝对）
    FullSrcLangDir: (state) => {
      if (state.currLangConfigKey == StringRootLang) {
        return state.fullSrcDir;
      } else {
        return state.fullSrcDir + "/" + state.currLangConfigKey;
      }
    },
    //是否使用多语言
    IsUseManyLang: (state) => {
      return Object.keys(state.vpConfig?.locales ?? {}).length > 1;
    },
    // 获取当前语言的配置
    CurrLangConfig: (state) => {
      return state.vpConfig?.locales?.[state.currLangConfigKey];
    },
    // 重写获取配置值的 getter，从 themeConfig 开始
    getThemeConfigValue: (state) => {
      const getValue = (path: string[], defaultValue: any = '') => {
        if (!state.currLangConfig?.themeConfig) return defaultValue;
        
        let current = state.currLangConfig.themeConfig as any;
        for (const key of path) {
          if (!current || typeof current !== 'object') return defaultValue;
          current = current[key];
        }
        return current ?? defaultValue;
      };
      
      return getValue;
    }
  }
});
