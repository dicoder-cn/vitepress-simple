<template>

<select-setting-lang></select-setting-lang>
  <div class="flex flex-wrap mx-8 mt-3">
    
    <div class="mt-2">
      <a-tooltip :title="lang('pageProject.settingSocial.tooltipsIcon')">
        <div class="flex flex-wrap gap-2">
          <a-tag 
            v-for="item in soList" 
            :key="item"
            color="cyan" 
            class="cursor-pointer hover:bg-cyan-100"
            @click="selectIcon(item)">
            {{ item }}
          </a-tag>
        </div>
      </a-tooltip>
    </div>
  </div>
  <hr class="my-3" />
  
  <!-- 社交账户列表 -->
  <div class="mx-6">
    <div class="flex justify-start mb-2">
      <a-button class="bg-blue-200 flex justify-center items-center hover:bg-blue-100" @click="addSocialAccount">
        <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="add-one" />
        {{ lang('pageProject.settingSocial.addSocialAccount') }}
      </a-button>
    </div>
    
    <div v-for="(item, index) in socialAccounts" :key="index" class="flex mt-2 justify-start items-center">
      <div class="mt-1 px-1 w-1/3">
        <a-input 
          v-model:value="item.icon" 
          :placeholder="lang('pageProject.settingSocial.icon')"
          class="w-full" />
      </div>
      <div class="mt-1 px-1 w-1/2">
        <a-input 
          v-model:value="item.link" 
          :placeholder="lang('pageProject.settingSocial.link')"
          class="w-full" />
      </div>
      <div class="mt-1 px-1">
        <a-button type="dashed" @click="removeSocialAccount(index)">
          <icon-park class="mr-1" theme="outline" type="delete" />
          {{ lang('common.remove') }}
        </a-button>
      </div>
    </div>
  </div>

  <hr class="my-2" />
  <div class="flex justify-center">
    <a-button @click="saveSocialConfig" class="bg-blue-600 hover:bg-blue-500 text-white flex justify-center items-center">
      <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="save" />
      {{ lang("common.saveConfig") }}
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { ToastError, ToastSuccess } from "@/utils/Toast";
import { useVpconfigStore } from "@/store/vpconfig";
import { IconPark } from "@icon-park/vue-next/es/all";
import { onMounted, ref, watch } from "vue";
import { lang } from "../../utils/language";
import SelectSettingLang from "@/components/selectSettingLang.vue";

const storeConfig = useVpconfigStore();
const soList = ["github", "discord", "facebook", "youtube", "instagram", "linkedin", "mastodon", "npm", "slack", "twitter", "x"];

// 社交账户列表
const socialAccounts = ref<Array<{icon: string, link: string}>>([]);

// 加载社交链接数据
const loadSocialLinks = () => {
  if (storeConfig.currLangConfig?.themeConfig?.socialLinks) {
    socialAccounts.value = [...storeConfig.currLangConfig.themeConfig.socialLinks];
  } else {
    socialAccounts.value = [];
  }
};

// 监听语言配置变化
watch(() => storeConfig.currLangConfigKey, () => {
  loadSocialLinks();
}, { deep: true });

// 初始化数据
onMounted(() => {
  loadSocialLinks();
});

// 添加社交账户
const addSocialAccount = () => {
  socialAccounts.value.push({ icon: '', link: '' });
};

// 移除社交账户
const removeSocialAccount = (index: number) => {
  socialAccounts.value.splice(index, 1);
};

// 选择图标
const selectIcon = (icon: string) => {
  addSocialAccount();
  const lastIndex = socialAccounts.value.length - 1;
  socialAccounts.value[lastIndex].icon = icon;
};

// 保存配置
const saveSocialConfig = () => {
  // 检查是否有空输入
  const emptyInputs = socialAccounts.value.filter(account => !account.icon || !account.link);
  if (emptyInputs.length > 0) {
    ToastError(lang('pageProject.settingSocial.error.emptyInput'));
    return;
  }

  if (!storeConfig.currLangConfig?.themeConfig) {
    storeConfig.currLangConfig = {
      ...storeConfig.currLangConfig,
      themeConfig: {}
    };
  }
  
  storeConfig.currLangConfig.themeConfig.socialLinks = socialAccounts.value;
  storeConfig.saveConfig();
  ToastSuccess(lang('pageProject.settingSocial.success.save'));
};
</script>

<style scoped></style>
