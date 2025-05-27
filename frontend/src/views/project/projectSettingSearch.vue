<template>
  <div>
    
    <select-setting-lang></select-setting-lang>
    <sim-radio
      :tooltip="lang('pageProject.settingSearch.tooltips.tooltips')"
      :model-value="storeVpconfig.getThemeConfigValue(['search', 'provider'], 'local')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['search', 'provider'], val)"
      :label="lang('pageProject.settingSearch.searchProvider')"
      :items="[
        { label: 'local', value: 'local' },
        { label: 'algolia', value: 'algolia' }
      ]"></sim-radio>

    <div class="flex justify-start" v-show="storeVpconfig.getThemeConfigValue(['search', 'provider'], 'local') === 'algolia'">
      <sim-input 
        :model-value="storeVpconfig.getThemeConfigValue(['search', 'options', 'appId'], '')"
        @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['search', 'options', 'appId'], val)"
        :tooltip="lang('pageProject.settingSearch.tooltips.AlgoliaAppId')" 
        label="AppId">
      </sim-input>
      <sim-input 
        :model-value="storeVpconfig.getThemeConfigValue(['search', 'options', 'apiKey'], '')"
        @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['search', 'options', 'apiKey'], val)"
        :tooltip="lang('pageProject.settingSearch.tooltips.AlgoliaSearchKey')" 
        label="apiKey">
      </sim-input>
      <sim-input 
        :model-value="storeVpconfig.getThemeConfigValue(['search', 'options', 'indexName'], '')"
        @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['search', 'options', 'indexName'], val)"
        :tooltip="lang('pageProject.settingSearch.tooltips.AlgoliaIndexName')" 
        label="indexName">
      </sim-input>
    </div>

    <div class="flex justify-center">
      <a-button @click="saveBaseConfig" class="bg-blue-600 hover:bg-blue-500 text-white flex justify-center items-center">
        <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="save" />
        {{ lang("common.saveConfig") }}
      </a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import SimRadio from "@/components/simRadio.vue";
import { useVpconfigStore } from "@/store/vpconfig";
import { onBeforeMount } from "vue";
import { IsEmptyValue } from "@/utils/utils";
import { defaultShareConfigValue } from "@/configs/defaultShareConfig";
import SimInput from "@/components/simInput.vue";
import { lang } from "@/utils/language";
import { VpConfig, VpConfigLang } from "@/types/vpsimpleConfig";
import SelectSettingLang from "@/components/selectSettingLang.vue";

interface AlgoliaSearchOptions {
  appId: string;
  apiKey: string;
  indexName: string;
  [key: string]: any;
}

interface SearchConfig {
  provider: string;
  options: AlgoliaSearchOptions;
  [key: string]: any;
}

const storeVpconfig = useVpconfigStore();

onBeforeMount(() => {
  //监测语言
  if (!storeVpconfig.vpConfig) {
    storeVpconfig.vpConfig = {};
  }
  if (!storeVpconfig.vpConfig.themeConfig) {
    storeVpconfig.vpConfig.themeConfig = {};
  }
  if (!storeVpconfig.vpConfig.themeConfig.search) {
    storeVpconfig.vpConfig.themeConfig.search = defaultShareConfigValue.themeConfig.search;
  }

  if (!storeVpconfig.currLangConfig) {
    storeVpconfig.currLangConfig = {
      label: 'zh',
      themeConfig: {
        search: defaultShareConfigValue.themeConfig.search
      }
    } as VpConfigLang;
  }
  if (!storeVpconfig.currLangConfig.themeConfig) {
    storeVpconfig.currLangConfig.themeConfig = {
      search: defaultShareConfigValue.themeConfig.search
    };
  }
  if (!storeVpconfig.currLangConfig.themeConfig.search) {
    storeVpconfig.currLangConfig.themeConfig.search = defaultShareConfigValue.themeConfig.search;
  }

  // 初始化配置
  checkSearchKey1('search', 'provider', 'local');
  checkSearchKey1('search', 'options', {});
  checkSearchKey2('search', 'options', 'appId', '');
  checkSearchKey2('search', 'options', 'apiKey', '');
  checkSearchKey2('search', 'options', 'indexName', '');
});

const checkSearchKey1 = (key1: string, key2: string, defaultValue: any) => {
  if (!storeVpconfig.currLangConfig?.themeConfig) {
    return;
  }
  const themeConfig = storeVpconfig.currLangConfig.themeConfig as any;
  if (!themeConfig[key1]) {
    themeConfig[key1] = {};
  }
  if (IsEmptyValue(themeConfig[key1][key2])) {
    themeConfig[key1][key2] = defaultValue;
  }
};

const checkSearchKey2 = (key1: string, key2: string, key3: string, defaultValue: any) => {
  if (!storeVpconfig.currLangConfig?.themeConfig) {
    return;
  }
  const themeConfig = storeVpconfig.currLangConfig.themeConfig as any;
  if (!themeConfig[key1]) {
    themeConfig[key1] = {};
  }
  if (!themeConfig[key1][key2]) {
    themeConfig[key1][key2] = {};
  }
  if (IsEmptyValue(themeConfig[key1][key2][key3])) {
    themeConfig[key1][key2][key3] = defaultValue;
  }
};
const saveBaseConfig = () => {
  if (!storeVpconfig.currLangConfig?.themeConfig?.search) {
    return;
  }
  storeVpconfig.saveConfig();
};
</script>
<style scoped></style>
