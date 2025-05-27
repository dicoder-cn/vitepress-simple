<template>
  <div>
    <sim-radio
      :tooltip="lang('pageProject.settingSearch.tooltips.tooltips')"
      v-model="(storeConfig.currLangConfig?.themeConfig?.search as SearchConfig)?.provider"
      :label="lang('pageProject.settingSearch.searchProvider')"
      :items="[
        { label: 'local', value: 'local' },
        { label: 'algolia', value: 'algolia' }
      ]"></sim-radio>

    <div class="flex justify-start" v-show="(storeConfig.currLangConfig?.themeConfig?.search as SearchConfig)?.provider === 'algolia'">
      <sim-input v-model="(storeConfig.currLangConfig?.themeConfig?.search as SearchConfig)?.options?.appId" :tooltip="lang('pageProject.settingSearch.tooltips.AlgoliaAppId')" label="AppId"> </sim-input>
      <sim-input v-model="(storeConfig.currLangConfig?.themeConfig?.search as SearchConfig)?.options?.apiKey" :tooltip="lang('pageProject.settingSearch.tooltips.AlgoliaSearchKey')" label="apiKey"> </sim-input>
      <sim-input v-model="(storeConfig.currLangConfig?.themeConfig?.search as SearchConfig)?.options?.indexName" :tooltip="lang('pageProject.settingSearch.tooltips.AlgoliaIndexName')" label="indexName">
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
import { DefaultTheme } from "vitepress";

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

const storeConfig = useVpconfigStore();
onBeforeMount(() => {
  //监测语言
  if (!storeConfig.vpConfig) {
    storeConfig.vpConfig = {};
  }
  if (!storeConfig.vpConfig.themeConfig) {
    storeConfig.vpConfig.themeConfig = {};
  }
  if (!storeConfig.vpConfig.themeConfig.search) {
    storeConfig.vpConfig.themeConfig.search = defaultShareConfigValue.themeConfig.search;
  }

  checkSearchKey1("provider", "local");
  checkSearchKey1("options", defaultShareConfigValue.themeConfig.search.options);
  checkSearchKey2("options", "appId", "");
  checkSearchKey2("options", "apiKey", "");
  checkSearchKey2("options", "indexName", "");
});

const checkSearchKey1 = (key1: string, defaultValue: any) => {
  if (!storeConfig.currLangConfig?.themeConfig?.search) {
    return;
  }
  const search = storeConfig.currLangConfig?.themeConfig.search as SearchConfig;
  if (IsEmptyValue(search[key1])) {
    search[key1] = defaultValue;
  }
};

const checkSearchKey2 = (key1: string, key2: string, defaultValue: any) => {
  checkSearchKey1(key1, {});
  if (!storeConfig.currLangConfig?.themeConfig?.search) {
    return;
  }
  const search = storeConfig.currLangConfig.themeConfig.search as SearchConfig;
  if (!search[key1]) {
    return;
  }
  const options = search[key1] as AlgoliaSearchOptions;
  if (IsEmptyValue(options[key2])) {
    options[key2] = defaultValue;
  }
};
const saveBaseConfig = () => {
  storeConfig.saveConfig();
};
</script>
<style scoped></style>
