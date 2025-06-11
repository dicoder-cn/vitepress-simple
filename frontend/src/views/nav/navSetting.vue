<template>
  <empty-project></empty-project>
  <div class="mx-2 my-1">
      <select-setting-lang></select-setting-lang>
    </div>
  <div v-if="!storeIndex.IsEmptyProject" class="flex justify-center mx-20 mt-4">
    <!--    选择操作的语言-->

    <a-button v-if="storeConfig.IsUseManyLang" class="bg-blue-100 mx-2 flex justify-center items-center hover:bg-blue-100" @click="copyNav()">
      <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="copy-one" />
      {{ lang("pageNav.copy") }}
      <span class="text-red">{{ storeConfig.currLangConfigKey }}</span>
      {{ lang("pageNav.clipboard") }}
    </a-button>
    <a-button v-if="storeConfig.IsUseManyLang" class="bg-green-200 mx-2 flex justify-center items-center hover:bg-blue-100" :disabled="!copyNavData" @click="cuttingNav()">
      <q-tooltip> {{ lang("pageNav.coverCurrentNav") }}</q-tooltip>
      <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="cutting-one" />
      {{ lang("pageNav.paste") }}<span class="text-red">{{ copyNavLang }}</span
      >{{ lang("pageNav.toCurrentNav") }}
    </a-button>
    <!--    保存导航-->
    <div class="flex justify-end">
      <a-button class="bg-blue-200 mx-2 flex justify-center items-center hover:bg-blue-100" @click="addTopNav">
        <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="add-one" />
        {{ lang("pageNav.addTopNav") }}
      </a-button>

      <a-button @click="saveNav()" class="bg-blue-600 mx-2 hover:bg-blue-500 text-white flex justify-center items-center">
        <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="save" />
        {{ lang("pageNav.saveCurrentNav") }}
      </a-button>
    </div>
  </div>

  <hr class="my-3" />
  <div>
    <dy-add-nav ref="refNav" :show-add-top-nav="false" :level="1" v-model:nav-array="navArray"></dy-add-nav>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useVpconfigStore } from "@/store/vpconfig";
import DyAddNav from "@/components/dyAddNav.vue";
import { VpNav } from "@/utils/tree";
import { IconPark } from "@icon-park/vue-next/es/all";
import SelectSettingLang from "@/components/selectSettingLang.vue";
import { DeepClone } from "@/utils/deepClone";
import EmptyProject from "@/components/emptyProject.vue";
import { useIndexStore } from "@/store";
import { lang } from "../../utils/language";

const storeConfig = useVpconfigStore();
const storeIndex = useIndexStore();
onMounted(() => {
  const nav = storeConfig.currLangConfig?.themeConfig?.nav;
  navArray.value = Array.isArray(nav) ? DeepClone(nav) as VpNav[] : [];
});

//新增顶级导航
const refNav = ref<InstanceType<typeof DyAddNav>>();

const addTopNav = () => {
  refNav.value?.addTopNav();
};
const copyNavData = ref();
const copyNavLang = ref("");
//复制导航
const copyNav = () => {
  copyNavLang.value = storeConfig.currLangConfigKey;
  if (storeConfig.currLangConfig?.themeConfig?.nav) {
    copyNavData.value = DeepClone(storeConfig.currLangConfig.themeConfig.nav);
  }
};
//粘贴导航
const cuttingNav = () => {
  if (storeConfig.currLangConfig?.themeConfig) {
    storeConfig.currLangConfig.themeConfig.nav = copyNavData.value;
  }
  copyNavData.value = null;
  copyNavLang.value = "";
};

const navArray = ref<VpNav[]>([]);

// 格式化导航数据，对于有子导航的项目完全不包含link属性
const formatNavData = (data: any[]): any[] => {
  return data
    .filter(item => item.text && (item.link || item.items))
    .map((item) => {
      const hasChildren = Array.isArray(item.items) && item.items.length > 0;
      
      if (hasChildren) {
        // 如果有子导航，只返回text和items属性
        return {
          text: item.text || '',
          items: formatNavData(item.items)
        };
      } else {
        // 如果没有子导航，返回text和link属性
        return {
          text: item.text || '',
          link: item.link || ''
        };
      }
    });
};

const saveNav = () => {
  const formatData = formatNavData(navArray.value);
  console.log("nav Data",formatData)
  if (storeConfig.currLangConfig?.themeConfig) {
    storeConfig.currLangConfig.themeConfig.nav = formatData;
    storeConfig.saveConfig();
  }
};
</script>
<style scoped></style>
