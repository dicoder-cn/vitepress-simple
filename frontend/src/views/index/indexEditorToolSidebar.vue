<template>
  <div class="flex items-center">
    <a-modal v-model:visible="showSidebarModal" :title="lang('pageSidebar.sidebarSettings')" :width="800" :footer="null" :maskClosable="false"> </a-modal>
  </div>
</template>

<script setup lang="ts">
import { useVpconfigStore } from "@/store/vpconfig";
import { ParseToTree } from "../../../wailsjs/go/docparse/ParseService";
import { lang } from "@/utils/language";
import { onMounted, ref } from "vue";
import { docparse } from "wailsjs/go/models";
const showSidebarModal = ref(false);
const storeVpConfig = useVpconfigStore();
const treeData = ref<docparse.DocsTreeNode>();
const isManyLang = ref(false);
onMounted(() => {
  ParseToTree(storeVpConfig.SrcLangDir).then((res: docparse.DocsTreeNode) => {
    treeData.value = res;
    isManyLang.value = storeVpConfig.IsUseManyLang;
    console.log("res", res);
  });
});
</script>
