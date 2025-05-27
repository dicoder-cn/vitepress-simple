<template>


  <hr class="my-2" />
  <select-setting-lang></select-setting-lang>
  <div class="flex justify-start items-center my-2 mx-8">
    <!-- Logo 配置 -->
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

    <!-- 大纲级别配置 -->
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

    <!-- 外部链接图标配置 -->
    <sim-switch
      :model-value="storeConfig.currLangConfig?.themeConfig?.externalLinkIcon"
      @update:model-value="(val: boolean) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          storeConfig.currLangConfig.themeConfig.externalLinkIcon = val;
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.externalLinkIcon')"
      :label="lang('pageProject.settingBase.labels.externalLinkIcon')"></sim-switch>

    <sim-switch
      :model-value="storeConfig.currLangConfig?.themeConfig?.i18nRouting"
      @update:model-value="(val: boolean) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          storeConfig.currLangConfig.themeConfig.i18nRouting = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.i18nRouting')"
      :label="lang('pageProject.settingLang.labels.i18nRouting')"></sim-switch>
    <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.siteTitle"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          storeConfig.currLangConfig.themeConfig.siteTitle = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.siteTitleInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.siteTitle')"
      :label="lang('pageProject.settingLang.labels.siteTitle')"></sim-input>
    <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.footer?.message"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig?.footer) {
          storeConfig.currLangConfig.themeConfig.footer.message = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.footerMessageInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.footerMessage')"
      :label="lang('pageProject.settingLang.labels.footerMessage')"></sim-input>
    <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.footer?.copyright"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig?.footer) {
          storeConfig.currLangConfig.themeConfig.footer.copyright = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.copyrightInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.copyright')"
      :label="lang('pageProject.settingLang.labels.copyright')"></sim-input>

    <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.langMenuLabel"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          storeConfig.currLangConfig.themeConfig.langMenuLabel = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.langMenuLabelInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.langSwitchLabel')"
      :label="lang('pageProject.settingLang.labels.langSwitchLabel')"></sim-input>
    <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.returnToTopLabel"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          storeConfig.currLangConfig.themeConfig.returnToTopLabel = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.returnToTop')"
      placeholder=""
      :label="lang('pageProject.settingLang.labels.returnToTop')"></sim-input>
    <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.sidebarMenuLabel"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          storeConfig.currLangConfig.themeConfig.sidebarMenuLabel = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.sidebarMenuLabelInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.sidebarMenu')"
      :label="lang('pageProject.settingLang.labels.sidebarMenu')"></sim-input>
    <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.darkModeSwitchLabel"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          storeConfig.currLangConfig.themeConfig.darkModeSwitchLabel = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.darkModeSwitchLabelInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.darkModeSwitch')"
      :label="lang('pageProject.settingLang.labels.darkModeSwitch')"></sim-input>
    <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.lightModeSwitchTitle"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          storeConfig.currLangConfig.themeConfig.lightModeSwitchTitle = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.lightModeSwitchTitleInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.lightModeSwitchTitle')"
      :label="lang('pageProject.settingLang.labels.lightModeSwitchTitle')"></sim-input>
    <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.darkModeSwitchTitle"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          storeConfig.currLangConfig.themeConfig.darkModeSwitchTitle = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.darkModeSwitchTitleInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.darkModeSwitchTitle')"
      :label="lang('pageProject.settingLang.labels.darkModeSwitchTitle')"></sim-input>
    <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.editLink?.text"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig?.editLink) {
          storeConfig.currLangConfig.themeConfig.editLink.text = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.editLinkTextInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.editLinkText')"
      :label="lang('pageProject.settingLang.labels.editLinkText')"></sim-input>
    <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.editLink?.pattern"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig?.editLink) {
          storeConfig.currLangConfig.themeConfig.editLink.pattern = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.editLinkPatternInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.editLinkPattern')"
      :label="lang('pageProject.settingLang.labels.editLinkPattern')"></sim-input>
    <sim-bool-input
      class="w-full"
      :model-value="storeConfig.currLangConfig?.themeConfig?.docFooter?.prev"
      @update:model-value="(val: Record<'text' | 'link', string>) => {
        if (storeConfig.currLangConfig?.themeConfig?.docFooter) {
          storeConfig.currLangConfig.themeConfig.docFooter.prev = val.text;
        }
      }"
      :input-label="lang('pageProject.settingLang.labels.prevButtonText')"
      :bool-tooltip="lang('pageProject.settingLang.tooltips.prevNextPageInfo')"
      :bool-label="lang('pageProject.settingLang.labels.prevButton')"
      :input-tooltip="lang('pageProject.settingLang.tooltips.preButtonTextInfo')"></sim-bool-input>
    <sim-bool-input
      class="w-full"
      :model-value="storeConfig.currLangConfig?.themeConfig?.docFooter?.next"
      @update:model-value="(val: Record<'text' | 'link', string>) => {
        if (storeConfig.currLangConfig?.themeConfig?.docFooter) {
          storeConfig.currLangConfig.themeConfig.docFooter.next = val.text;
        }
      }"
      :input-label="lang('pageProject.settingLang.labels.nextButtonText')"
      :bool-tooltip="lang('pageProject.settingLang.tooltips.prevNextPageInfo')"
      :bool-label="lang('pageProject.settingLang.labels.nextButton')"
      :input-tooltip="lang('pageProject.settingLang.tooltips.nextButtonTextInfo')"></sim-bool-input>
  </div>
  <div class="flex justify-center">
    <a-button @click="saveLangConfig()" class="bg-blue-600 hover:bg-blue-500 text-white flex justify-center items-center">
      <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="save" />
      {{ lang("common.saveConfig") }}
    </a-button>
  </div>
</template>

<script setup lang="ts">
import SimInput from "@/components/simInput.vue";
import { useVpconfigStore } from "@/store/vpconfig";
import { IconPark } from "@icon-park/vue-next/es/all";
import SelectSettingLang from "@/components/selectSettingLang.vue";
import SimBoolInput from "@/components/simBoolInput.vue";
import SimSwitch from "@/components/simSwitch.vue";
import { lang } from "@/utils/language";
import { CopyPath, GetPathExt, PathJoin, SelectFile } from "../../../wailsjs/go/system/SystemService";
import { ToastCheck, ToastError } from "@/utils/Toast";

const storeConfig = useVpconfigStore();

const saveLangConfig = () => {
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
