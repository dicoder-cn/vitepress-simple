import { appConfigDefault, editorType } from '@/configs/appConfig'
import { ConfigKeyEditorType } from '@/configs/appConfigKey'
import { defineStore } from 'pinia'

import { ConfigGetAll, ConfigSet, ConfigSetDefault } from 'wailsjs/go/system/SystemService'

export interface appConfigStore {
  editorType: editorType
}
export const useAppConfigStore = defineStore('appConfig', {
  state: (): appConfigStore => ({
    editorType: editorType.MdEditorV3,
  }),
})

export class AppConfig {
  private static data: Record<string, any> = {}
  private static defaultData: Record<string, any> = appConfigDefault

  // 辅助函数：获取嵌套对象的值
  public static getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined
    }, obj)
  }

  //初始化配置
  public static async initAppConfig() {
    //检查和设置配置初始值
    await ConfigSetDefault(appConfigDefault)
    const res = await ConfigGetAll()
    this.data = res
    // console.log("all config",res);
    // const lang = this.getString(ConfigKeyLang);
    // console.log("lang",lang);
  }

  //判断key是否存在
  public static isKeyExists(key: string): boolean {
    return this.getNestedValue(this.data, key) !== undefined
  }

  public static set(key: string, value: any) {
    const keys = key.split('.')
    let current = this.data

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    // console.log("current", current, keys, value);
    current[keys[keys.length - 1]] = value
    this.updateState()
    ConfigSet(key, value).then(() => {
      console.log('set success,key:', key, 'value:', value)
    })
  }

  public static getString(key: string): string {
    const value = this.getNestedValue(this.data, key)
    if (value === undefined) {
      console.log('返回默认值', key)
      return this.getNestedValue(this.defaultData, key) as string
    }
    return value as string
  }

  public static getNumber(key: string): number {
    const value = this.getNestedValue(this.data, key)
    if (value === undefined) {
      return this.getNestedValue(this.defaultData, key) as number
    }
    return value as number
  }

  public static getBoolean(key: string): boolean {
    const value = this.getNestedValue(this.data, key)
    if (value === undefined) {
      return this.getNestedValue(this.defaultData, key) === 'yes'
    }
    return value === 'yes'
  }

  public static get(key: string): any {
    return this.getNestedValue(this.data, key)
  }

  //调用时机:1.程序启动时 2.设置页面保存配置时
  public static updateState(): any {
    const storeAppconfig = useAppConfigStore()
    storeAppconfig.editorType = this.getString(ConfigKeyEditorType)
  }
}
