import { VPSimpleConfig } from "@/types/vpsimpleConfig";
import { defineStore } from "pinia";
//这是一个简单的推荐store案例，可以在这里定义你的状态
//新建pinia时把vpsimple全局替换成你的store名字

//项目级配置
export const useVpsimpleStore = defineStore("vpsimple", {
  state: (): VPSimpleConfig => ({
    srcDir: "",
    fullDir: ""
  }),
  actions: {},
  getters: {}
});
