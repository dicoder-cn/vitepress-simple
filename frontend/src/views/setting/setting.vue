<template>
  <div class="mt-4 ml-2">
    <a-tabs style="min-height: 55vh" v-model:activeKey="activeKey" :tab-position="'left'" type="line" animated>
      <a-tab-pane key="1" :tab="lang('pageSetting.settingBase.title')" :style="StyleNoDrag">
        <setting-base></setting-base>
      </a-tab-pane>
      <!-- 暂时不允许切换编辑器 切换成vditor不显示 有兴趣可以再研究研究 -->
      <!-- <a-tab-pane
        key="2"
        :tab="lang('pageSetting.settingEditor.title')"
        :style="StyleNoDrag"
      >
        <setting-editor></setting-editor>
      </a-tab-pane> -->
      <a-tab-pane key="2" :tab="lang('pageSetting.settingAi.title')" :style="StyleNoDrag">
        <setting-ai></setting-ai>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import SettingBase from "@/views/setting/settingBase.vue";
import { lang } from "@/utils/language";
import { StyleNoDrag } from "@/configs/cnts";
import SettingAi from "@/views/setting/settingAi.vue";
  
const activeKey = ref("2");
</script>

<style scoped></style>
