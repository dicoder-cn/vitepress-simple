import { defineStore } from "pinia";
import { ConfigSet } from "wailsjs/go/system/SystemService";
//这是一个简单的推荐store案例，可以在这里定义你的状态
//新建pinia时把appClient全局替换成你的store名字
export interface appConfigStore {
  data: Record<string, any>;
  defaultData: Record<string, any>;
}

export const useAppConfigStore = defineStore("appConfig", {
  state: (): appConfigStore => ({
    data: {},
    defaultData: {},
  }),
  actions: {
    //判断key是否存在
    isKeyExists(key: string): boolean {
      return this.data[key] !== undefined;
    },
    set(key: string, value: any) {
      this.data[key] = value;
      ConfigSet(key, value).then(()=>{
        console.log("set success");
      });
    },
    getString(key: string): string {
      if(!this.isKeyExists(key)){
        return this.defaultData[key] as string;
      }
      return this.data[key] as string;
    },
    getNumber(key: string): number {
      if(!this.isKeyExists(key)){
        return this.defaultData[key] as number;
      }
      return this.data[key] as number;
    },
    getBoolean(key: string): boolean {
      if(!this.isKeyExists(key)){
        return this.defaultData[key] === "yes";
      }
      return this.data[key] === "yes";
    },
    get(key: string): any {
      return this.data[key];
    },
  },
  getters: {
   
  },
});
