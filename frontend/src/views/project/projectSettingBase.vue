<template>
  <div class="flex justify-start items-center my-2 mx-8">
    <LangEdit></LangEdit>

     <sim-input 
      :model-value="storeConfig.getVpConfigValue(['srcDir'],'')"
      @update:model-value="(val: string) => {
        storeConfig.updateVpConfig(['srcDir'], val);
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.docPath')" 
      :label="lang('pageProject.settingBase.labels.docPath')"></sim-input>

    <sim-input
      :model-value="storeConfig.getVpConfigValue(['lang'],'')"
      @update:model-value="(val: string) => {
        storeConfig.updateVpConfig(['lang'], val);
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.htmlLang')"
      :placeholder="lang('pageProject.settingBase.placeholders.htmlLang')"
      :label="lang('pageProject.settingBase.labels.htmlLang')"></sim-input>


   
    <sim-input
      :model-value="storeConfig.getVpConfigValue(['base'],'')"
      @update:model-value="(val: string) => {
        storeConfig.updateVpConfig(['base'], val);
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.baseUrl')"
      :placeholder="lang('pageProject.settingBase.placeholders.baseUrl')"
      :label="lang('pageProject.settingBase.labels.baseUrl')"></sim-input>

    <sim-input 
      :model-value="storeConfig.getVpConfigValue(['outDir'],'')"
      @update:model-value="storeConfig.updateVpConfig(['outDir'],$event)"
      :tooltip="lang('pageProject.settingBase.tooltips.buildPath')" 
      :label="lang('pageProject.settingBase.labels.buildPath')"></sim-input>
    <sim-input
      :model-value="storeConfig.getVpConfigValue(['sitemap','hostname'],'')"
      @update:model-value="(val: string) => {
        storeConfig.updateVpConfig(['sitemap','hostname'], val);
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.hostname')"
      :label="lang('pageProject.settingBase.labels.hostname')"></sim-input>

    <sim-input 
      :model-value="storeConfig.getVpConfigValue(['assetsDir'],'')"
      @update:model-value="(val: string) => {
        storeConfig.updateVpConfig(['assetsDir'], val);
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.staticAssets')" 
      :label="lang('pageProject.settingBase.labels.staticAssets')"></sim-input>

    <sim-input 
      :model-value="storeConfig.getVpConfigValue(['cacheDir'],'')"
      @update:model-value="(val: string) => {
        storeConfig.updateVpConfig(['cacheDir'], val);
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.cachePath')" 
      :label="lang('pageProject.settingBase.labels.cachePath')"></sim-input>
    <sim-switch 
      :model-value="storeConfig.getVpConfigValue(['cleanUrls'], false)"
      @update:model-value="(val: boolean) => {
        storeConfig.updateVpConfig(['cleanUrls'], val);
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
import LangEdit from "@/components/langEdit.vue"

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
