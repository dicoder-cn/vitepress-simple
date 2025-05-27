<template>
  <div v-show="storeEditor.isOpenArticle" id="vditor" ref="vditor" class="mx-2" style="height: 100vh; overflow-y: hidden"></div>

  <empty-project></empty-project>
  <div v-show="!storeEditor.isOpenArticle">
    <a-empty :description="lang('pageIndex.noSelectedArticle')" />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, nextTick, watch } from "vue";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { getDefaultVtitorOptions } from "@/configs/vditor";

import EmptyProject from "@/components/emptyProject.vue";
import { lang } from "@/utils/language";
import { useEditorStore } from "@/store/editor";

const storeEditor = useEditorStore();

const vditor = ref<Vditor>();

onMounted(() => {
  nextTick(async () => {
    let opts = await getDefaultVtitorOptions();
    opts.after = () => {
      vditor.value?.setValue(storeEditor.currArticle.mdContent);
    };
    vditor.value = new Vditor("vditor", opts);
  });
});

watch(
  () => storeEditor.currArticle.mdContent,
  (newVal) => {
    if (vditor.value) {
      vditor.value.setValue(newVal);
    }
  }
);
</script>
<style scoped>
a {
  color: #42b983;
}
</style>
