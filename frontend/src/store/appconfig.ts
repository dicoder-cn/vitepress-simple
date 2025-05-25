import { appConfigDefault } from "@/configs/appConfig";
import { ConfigKeyLang } from "@/configs/appConfigKey";

import { ConfigGetAll, ConfigSet, ConfigSetDefault } from "wailsjs/go/system/SystemService";

export class AppConfig {
  private static data: Record<string, any> = {};
  private static defaultData: Record<string, any> = appConfigDefault;

  // 辅助函数：获取嵌套对象的值
  private static getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  //初始化配置
  public static async initAppConfig (){ 
      //检查和设置配置初始值
      await ConfigSetDefault(appConfigDefault);
      const res = await ConfigGetAll();
      this.data = res;

      // console.log("all config",res);
      // const lang = this.getString(ConfigKeyLang);
      // console.log("lang",lang);
   
  }

  //判断key是否存在
  public static isKeyExists(key: string): boolean {
    return this.getNestedValue(this.data, key) !== undefined;
  }

  public static set(key: string, value: any) {
    const keys = key.split('.');
    let current = this.data;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    ConfigSet(key, value).then(() => {
      console.log("set success");
    });
  }

  public static getString(key: string): string {
    const value = this.getNestedValue(this.data, key);
    if (value === undefined) {
      console.log("key not exists", key, this.getNestedValue(this.defaultData, key));
      return this.getNestedValue(this.defaultData, key) as string;
    }
    console.log("key ", key, value);
    return value as string;
  }

  public static getNumber(key: string): number {
    const value = this.getNestedValue(this.data, key);
    if (value === undefined) {
      return this.getNestedValue(this.defaultData, key) as number;
    }
    return value as number;
  }

  public static getBoolean(key: string): boolean {
    const value = this.getNestedValue(this.data, key);
    if (value === undefined) {
      return this.getNestedValue(this.defaultData, key) === "yes";
    }
    return value === "yes";
  }

  public static get(key: string): any {
    return this.getNestedValue(this.data, key);
  }
}


