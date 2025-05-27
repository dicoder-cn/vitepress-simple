<template>
   <div>
    <hr class="my-2" />
    <div class="flex justify-start items-center ml-2" v-if="storeVpConfig.IsUseManyLang">
      <icon-park strokeLinejoin="bevel" theme="outline" type="translate" />
      当前操作的语言：
      <a-radio-group @change="langChange" v-model:value="storeVpConfig.currLangConfigKey">
        <a-radio-button v-for="(item, index) in storeVpConfig.getLangKeys()" :key="index" :value="item">{{ item }} </a-radio-button>
      </a-radio-group>
    </div>
   </div>
</template>
<script setup lang="ts">
import { useVpconfigStore } from "@/store/vpconfig";
import { IconPark } from "@icon-park/vue-next/es/all";


const storeVpConfig = useVpconfigStore();
const emits = defineEmits(["changeLang"]);
const langChange = () => {
      storeVpConfig.changeCurrLang(storeVpConfig.currLangConfigKey);
  // if (storeVpConfig.currSettingLangKey == StringRootLang) {
  //   ToastInfo("已切换到global配置，global配置仅对单语言模式生效");
  // }
  emits("changeLang");
};
</script>

<style scoped></style>
