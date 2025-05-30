<template>
  <select-setting-lang></select-setting-lang>
  <div class="flex justify-start items-center my-2 mx-8">
    <!-- Logo 配置 -->
    <div class="my-3 w-1/3 flex justify-between">
      <div class="flex-1">
        <a-input 
          disabled 
          :value="storeVpconfig.getThemeConfigValue(['logo'], '')"
          @update:value="(val: string) => storeVpconfig.updateThemeConfig(['logo'], val)"
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

    <!-- 大纲级别配置：设置文档大纲显示的层级深度 -->
    <sim-input
      :model-value="(() => {
        const outline = storeVpconfig.currLangConfig?.themeConfig?.outline;
        if (outline && typeof outline === 'object' && 'level' in outline) {
          return outline.level?.toString() || '';
        }
        return '';
      })()"
      @update:model-value="(val: string) => {
        if (storeVpconfig.currLangConfig?.themeConfig) {
          const numVal = parseInt(val);
          if (!isNaN(numVal)) {
            storeVpconfig.currLangConfig.themeConfig.outline = { level: numVal };
          }
        }
      }"
      :tooltip="lang('pageProject.settingBase.tooltips.outlineLevel')"
      :placeholder="lang('pageProject.settingBase.placeholders.outlineLevel')"
      :label="lang('pageProject.settingBase.labels.outlineLevel')"></sim-input>

    <!-- 外部链接图标配置：是否在外部链接旁显示图标 -->
    <sim-switch
      :model-value="storeVpconfig.getThemeConfigValue(['externalLinkIcon'], false)"
      @update:model-value="(val: boolean) => storeVpconfig.updateThemeConfig(['externalLinkIcon'], val)"
      :tooltip="lang('pageProject.settingBase.tooltips.externalLinkIcon')"
      :label="lang('pageProject.settingBase.labels.externalLinkIcon')"></sim-switch>

    <!-- 国际化路由配置：是否启用国际化路由 -->
    <sim-switch
      :model-value="storeVpconfig.getThemeConfigValue(['i18nRouting'], false)"
      @update:model-value="(val: boolean) => storeVpconfig.updateThemeConfig(['i18nRouting'], val)"
      :tooltip="lang('pageProject.settingLang.tooltips.i18nRouting')"
      :label="lang('pageProject.settingLang.labels.i18nRouting')"></sim-switch>
    <!-- <sim-input
      :model-value="storeConfig.currLangConfig?.themeConfig?.siteTitle"
      @update:model-value="(val: string) => {
        if (storeConfig.currLangConfig?.themeConfig) {
          storeConfig.currLangConfig.themeConfig.siteTitle = val;
        }
      }"
      :tooltip="lang('pageProject.settingLang.tooltips.siteTitleInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.siteTitle')"
      :label="lang('pageProject.settingLang.labels.siteTitle')"></sim-input> -->
      <!-- 页脚信息 -->
    <sim-input
      :model-value="storeVpconfig.getThemeConfigValue(['footer', 'message'], '')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['footer', 'message'], val)"
      :tooltip="lang('pageProject.settingLang.tooltips.footerMessageInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.footerMessage')"
      :label="lang('pageProject.settingLang.labels.footerMessage')"></sim-input>
      <!-- 页脚版权信息 -->
    <sim-input
      :model-value="storeVpconfig.getThemeConfigValue(['footer', 'copyright'], '')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['footer', 'copyright'], val)"
      :tooltip="lang('pageProject.settingLang.tooltips.copyrightInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.copyright')"
      :label="lang('pageProject.settingLang.labels.copyright')"></sim-input>

    <!-- 语言菜单标签 -->
    <sim-input
      :model-value="storeVpconfig.getThemeConfigValue(['langMenuLabel'], '')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['langMenuLabel'], val)"
      :tooltip="lang('pageProject.settingLang.tooltips.langMenuLabelInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.langSwitchLabel')"
      :label="lang('pageProject.settingLang.labels.langSwitchLabel')"></sim-input>
      <!-- 返回顶部标签 -->
    <sim-input
      :model-value="storeVpconfig.getThemeConfigValue(['returnToTopLabel'], 'top')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['returnToTopLabel'], val)"
      :tooltip="lang('pageProject.settingLang.tooltips.returnToTop')"
      placeholder=""
      :label="lang('pageProject.settingLang.labels.returnToTop')"></sim-input>
    <!-- 侧边栏菜单标签 -->
    <sim-input
      :model-value="storeVpconfig.getThemeConfigValue(['sidebarMenuLabel'], '')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['sidebarMenuLabel'], val)"
      :tooltip="lang('pageProject.settingLang.tooltips.sidebarMenuLabelInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.sidebarMenu')"
      :label="lang('pageProject.settingLang.labels.sidebarMenu')"></sim-input>
      <!-- 暗色模式切换标签 -->
    <sim-input
      :model-value="storeVpconfig.getThemeConfigValue(['darkModeSwitchLabel'], '')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['darkModeSwitchLabel'], val)"
      :tooltip="lang('pageProject.settingLang.tooltips.darkModeSwitchLabelInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.darkModeSwitch')"
      :label="lang('pageProject.settingLang.labels.darkModeSwitch')"></sim-input>
      <!-- 亮色模式切换标题 -->
    <sim-input
      :model-value="storeVpconfig.getThemeConfigValue(['lightModeSwitchTitle'], '')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['lightModeSwitchTitle'], val)"
      :tooltip="lang('pageProject.settingLang.tooltips.lightModeSwitchTitleInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.lightModeSwitchTitle')"
      :label="lang('pageProject.settingLang.labels.lightModeSwitchTitle')"></sim-input>
      <!-- 暗色模式切换标题 -->
    <sim-input
      :model-value="storeVpconfig.getThemeConfigValue(['darkModeSwitchTitle'], '')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['darkModeSwitchTitle'], val)"
      :tooltip="lang('pageProject.settingLang.tooltips.darkModeSwitchTitleInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.darkModeSwitchTitle')"
      :label="lang('pageProject.settingLang.labels.darkModeSwitchTitle')"></sim-input>
    <!-- 编辑连接文本 -->
    <sim-input
      :model-value="storeVpconfig.getThemeConfigValue(['editLink', 'text'], '')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['editLink', 'text'], val)"
      :tooltip="lang('pageProject.settingLang.tooltips.editLinkTextInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.editLinkText')"
      :label="lang('pageProject.settingLang.labels.editLinkText')"></sim-input>
    <!-- 编辑连接模式 --> 
    <sim-input
      :model-value="storeVpconfig.getThemeConfigValue(['editLink', 'pattern'], '')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['editLink', 'pattern'], val)"
      :tooltip="lang('pageProject.settingLang.tooltips.editLinkPatternInfo')"
      :placeholder="lang('pageProject.settingLang.placeholders.editLinkPattern')"
      :label="lang('pageProject.settingLang.labels.editLinkPattern')"></sim-input>
      <!-- 上一页按钮文本 -->
    <sim-bool-input
      class="w-full"
      :model-value="storeVpconfig.getThemeConfigValue(['docFooter', 'prev'], '')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['docFooter', 'prev'], val)"
      :input-label="lang('pageProject.settingLang.labels.prevButtonText')"
      :bool-tooltip="lang('pageProject.settingLang.tooltips.prevNextPageInfo')"
      :bool-label="lang('pageProject.settingLang.labels.prevButton')"
      :input-tooltip="lang('pageProject.settingLang.tooltips.preButtonTextInfo')"></sim-bool-input>
      <!-- 下一页按钮文本 -->
    <sim-bool-input
      class="w-full"
      :model-value="storeVpconfig.getThemeConfigValue(['docFooter', 'next'], '')"
      @update:model-value="(val: string) => storeVpconfig.updateThemeConfig(['docFooter', 'next'], val)"
      :input-label="lang('pageProject.settingLang.labels.nextButtonText')"
      :bool-tooltip="lang('pageProject.settingLang.tooltips.prevNextPageInfo')"
      :bool-label="lang('pageProject.settingLang.labels.nextButton')"
      :input-tooltip="lang('pageProject.settingLang.tooltips.nextButtonTextInfo')"></sim-bool-input>
  </div>
  <!-- 保存按钮 -->
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

const storeVpconfig = useVpconfigStore();

const saveLangConfig = () => {
  storeVpconfig.saveConfig();
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
  let publicDir = await PathJoin([storeVpconfig.fullSrcDir, "public"]);
  let newImagePath = await PathJoin([publicDir, "images", "logo" + ext]);
  let copyResult = await CopyPath(oriImagePath, newImagePath, false);
  ToastCheck(copyResult);
  if (storeVpconfig.currLangConfig?.themeConfig) {
    storeVpconfig.currLangConfig.themeConfig.logo = newImagePath.replaceAll(publicDir, "");
  }
};
</script>

<style scoped></style>
