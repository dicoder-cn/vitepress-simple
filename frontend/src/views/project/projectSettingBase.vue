<template>
  <div class="flex justify-start items-center my-2 mx-8">
    <!--    选择logo图片-->
    <div class="my-3 w-1/3 flex justify-between">
      <div class="flex-1">
        <a-input 
          disabled 
          :value="storeConfig.currLangConfig?.themeConfig?.logo"
          @update:value="(val: string) => {
            if (storeConfig.currLangConfig?.themeConfig) {
              storeConfig.currLangConfig.themeConfig.logo = val;
            }
          }"
          :placeholder="lang('pageProject.settingBase.placeholders.logoUrl')" 
          class="w-full">
        </a-input>
      </div>

      <div class="mx-2">
        <a-button class="bg-blue-200" @click="selectLogo">
          <q-tooltip anchor="bottom left" self="bottom right">
            {{ lang("pageProject.settingBase.logoSavePath") }}
          </q-tooltip>
          {{ lang("pageProject.settingBase.selectLogo") }}
        </a-button>
      </div>
    </div>

    <sim-input
      :model-value="storeConfig.vpConfig?.title"
      @update:model-value="(val: string) => {
        if (storeConfig.vpConfig) {
          storeConfig.vpConfig.title = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.pageTitle')"
      :placeholder="lang('pageProject.settingBase.placeholders.pageTitle')"
      :label="lang('pageProject.settingBase.labels.pageTitle')"></sim-input>
    <sim-input
      :model-value="storeConfig.vpConfig?.titleTemplate"
      @update:model-value="(val: string) => {
        if (storeConfig.vpConfig) {
          storeConfig.vpConfig.titleTemplate = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.titleSuffix')"
      :placeholder="lang('pageProject.settingBase.placeholders.titleSuffix')"
      :label="lang('pageProject.settingBase.labels.titleSuffix')"></sim-input>
    <sim-input
      :model-value="(() => {
        const outline = storeConfig.currLangConfig?.themeConfig?.outline;
        if (outline && typeof outline === 'object' && 'level' in outline) {
          return outline.level?.toString() || '';
        }
        return '';
      })()"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          const numVal = parseInt(val);
          if (!isNaN(numVal)) {
            storeConfig.currLangConfig.themeConfig.outline = { level: numVal };
          }
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.outlineLevel')"
      :placeholder="lang('pageProject.settingBase.placeholders.outlineLevel')"
      :label="lang('pageProject.settingBase.labels.outlineLevel')"></sim-input>
    <sim-input
      :model-value="storeConfig.vpConfig?.lang"
      @update:model-value="(val: string) => {
        if (storeConfig.vpConfig) {
          storeConfig.vpConfig.lang = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.htmlLang')"
      :placeholder="lang('pageProject.settingBase.placeholders.htmlLang')"
      :label="lang('pageProject.settingBase.labels.htmlLang')"></sim-input>
    <sim-input
      :model-value="storeConfig.vpConfig?.description"
      @update:model-value="(val: string) => {
        if (storeConfig.vpConfig) {
          storeConfig.vpConfig.description = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.siteDescription')"
      :placeholder="lang('pageProject.settingBase.placeholders.siteDescription')"
      :label="lang('pageProject.settingBase.labels.siteDescription')"></sim-input>

    <!--    切换日/夜间文字- -->

    <!--    仅手机端生效-->

    <!--    多语言-->

    <sim-switch
      :model-value="storeConfig.currLangConfig?.themeConfig?.externalLinkIcon"
      @update:model-value="(val: boolean) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          storeConfig.currLangConfig.themeConfig.externalLinkIcon = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.externalLinkIcon')"
      :placeholder="lang('pageProject.settingBase.placeholders.titleSuffix')"
      :label="lang('pageProject.settingBase.labels.externalLinkIcon')"></sim-switch>
    <hr class="my-1 w-full" />
    <sim-input 
      :model-value="storeConfig.vpConfig?.srcDir"
      @update:model-value="(val: string) => {
        if (storeConfig.vpConfig) {
          storeConfig.vpConfig.srcDir = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.docPath')" 
      :label="lang('pageProject.settingBase.labels.docPath')"></sim-input>
    <sim-input
      :model-value="storeConfig.vpConfig?.base"
      @update:model-value="(val: string) => {
        if (storeConfig.vpConfig) {
          storeConfig.vpConfig.base = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.baseUrl')"
      :placeholder="lang('pageProject.settingBase.placeholders.baseUrl')"
      :label="lang('pageProject.settingBase.labels.baseUrl')"></sim-input>

    <sim-input 
      :model-value="storeConfig.vpConfig?.outDir"
      @update:model-value="(val: string) => {
        if (storeConfig.vpConfig) {
          storeConfig.vpConfig.outDir = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.buildPath')" 
      :label="lang('pageProject.settingBase.labels.buildPath')"></sim-input>
    <sim-input
      :model-value="storeConfig.vpConfig?.sitemap?.hostname"
      @update:model-value="(val: string) => {
        if (storeConfig.vpConfig?.sitemap) {
          storeConfig.vpConfig.sitemap.hostname = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.hostname')"
      :label="lang('pageProject.settingBase.labels.hostname')"></sim-input>

    <sim-input 
      :model-value="storeConfig.vpConfig?.assetsDir"
      @update:model-value="(val: string) => {
        if (storeConfig.vpConfig) {
          storeConfig.vpConfig.assetsDir = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.staticAssets')" 
      :label="lang('pageProject.settingBase.labels.staticAssets')"></sim-input>

    <sim-input 
      :model-value="storeConfig.vpConfig?.cacheDir"
      @update:model-value="(val: string) => {
        if (storeConfig.vpConfig) {
          storeConfig.vpConfig.cacheDir = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.cachePath')" 
      :label="lang('pageProject.settingBase.labels.staticAssets')"></sim-input>
    <sim-switch 
      :model-value="storeConfig.vpConfig?.cleanUrls"
      @update:model-value="(val: boolean) => {
        if (storeConfig.vpConfig) {
          storeConfig.vpConfig.cleanUrls = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.cleanUrls')" 
      label="cleanUrls"></sim-switch>
    <!--    <sim-switch-->
    <!--      v-model="storeConfig.configData['map']"-->
    <!--      tooltip="设置为 true 时，生产应用程序将在 MPA 模式下构建。MPA 模式默认提供 零 JavaScript 支持，代价是禁用客户端导航，并且需要明确选择加入才能进行交互。"-->
    <!--      label="map模式"-->
    <!--    ></sim-switch>-->
  </div>
  <hr class="my-2" />
  <div class="flex justify-center">
    <a-button @click="saveBaseConfig" class="bg-blue-600 hover:bg-blue-500 text-white flex justify-center items-center">
      <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="save" />
      {{ lang("common.saveConfig") }}
    </a-button>
  </div>
</template>
<script setup lang="ts">
import { useVpconfigStore } from "@/store/vpconfig";
import SimInput from "@/components/simInput.vue";
import SimSwitch from "@/components/simSwitch.vue";
import { CopyPath, GetPathExt, PathJoin, SelectFile } from "../../../wailsjs/go/system/SystemService";
import { ToastCheck, ToastError } from "@/utils/Toast";
import { useIndexStore } from "@/store";
import { IconPark } from "@icon-park/vue-next/es/all";
import { onBeforeMount, onMounted, ref } from "vue";
import { lang } from "@/utils/language";

const storeConfig = useVpconfigStore();
const storeIndex = useIndexStore();
onMounted(() => {
  console.log(storeConfig.vpConfig, "storeConfig.configData -- console.log");
});
const saveBaseConfig = () => {
  storeConfig.saveConfig();
};
const selectLogo = async () => {
  let oriImagePath = await SelectFile("选择主页图片", "");
  console.log(oriImagePath, "filePath -- console.log");
  let ext = await GetPathExt(oriImagePath);
  let allowExt = [".png", ".jpg", ".jpeg", ".bmp"];
  if (!allowExt.includes(ext)) {
    ToastError("请选则图片格式文件" + allowExt);
    return;
  }
  //组装新路径
  let publicDir = await PathJoin([storeConfig.fullSrcDir, "public"]);
  let newImagePath = await PathJoin([publicDir, "images", "logo" + ext]);
  let copyResult = await CopyPath(oriImagePath, newImagePath, false);
  ToastCheck(copyResult);
  if (storeConfig.currLangConfig?.themeConfig) {
    storeConfig.currLangConfig.themeConfig.logo = newImagePath.replaceAll(publicDir, "");
  }
};
</script>
<style scoped></style>
