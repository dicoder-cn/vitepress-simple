<template>
  <div
    class="flex items-center justify-between w-full pr-5"
    v-show="!storeIndex.IsEmptyProject"
    :style="StyleNoDrag"
  >
    <!-- 左侧文章列表 -->
    <div class="flex-1 flex items-center">
      <div class="flex items-center space-x-2 overflow-x-auto" style="max-width: 60%;">
        <template v-for="(article, index) in storeEditor.getArticleContents" :key="article.path">
          <div 
            class="flex items-center px-3 py-1 rounded cursor-pointer"
            :class="{'bg-gray-200': index === storeEditor.getCurrArticleIndex}"
            @click="storeEditor.changeCurrArticleIndex(index)"
          >
            <span class="truncate max-w-[150px]">{{ article.path.split('/').pop() }}</span>
            <icon-park
              class="ml-2 hover:text-red-500"
              @click.stop="storeEditor.closeArticle(article.path)"
              :size="16"
              type="close"
            />
          </div>
        </template>
      </div>
    </div>

    <!-- 中间显示当前项目路径 -->
    <div class="text-gray-400 flex-shrink-0 mx-4">
      {{ lang("pageIndex.currentProject") }}{{ storeConfig.baseDir }}
    </div>

    <!-- 右侧工具栏 -->
    <div class="flex items-center justify-end space-x-2">
      <!--    终端-->
      <index-editor-tool-shell></index-editor-tool-shell>
      
      <!-- 隐藏或关闭右侧栏-->
      <a-tooltip class="cursor-pointer">
        <template #title>{{
          storeLayout.showEditorView
            ? lang("common.hide")
            : lang("common.show")
        }}{{ lang("pageIndex.pageProperties") }}</template>
        <icon-park
          class="select-none"
          @click="storeLayout.setEditorViewShow(false)"
          v-show="storeLayout.showEditorView"
          :size="storeLayout.editorToolIconSize"
          fill="#493c3c"
          strokeLinejoin="bevel"
          theme="outline"
          type="file-display"
        />
        <icon-park
          class="select-none"
          @click="storeLayout.setEditorViewShow(true)"
          v-show="!storeLayout.showEditorView"
          :size="storeLayout.editorToolIconSize"
          fill="#493c3c"
          strokeLinejoin="bevel"
          theme="outline"
          type="file-hiding"
        />
      </a-tooltip>

      <!--      保存-->
      <a-tooltip class="cursor-pointer" @click="handleSave">
        <template #title>{{ lang("common.saveWithKey") }}</template>
        <icon-park
          :size="storeLayout.editorToolIconSize"
          fill="#493c3c"
          strokeLinejoin="bevel"
          theme="outline"
          type="save"
        />
      </a-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IconPark } from "@icon-park/vue-next/es/all";
import { useIndexStore } from "@/store";
import { useLayoutStore } from "@/store/layout";
import { useVpconfigStore } from "@/store/vpconfig";
import { useEditorStore } from "@/store/editor";
import { lang } from "../../utils/language";
import IndexEditorToolShell from "@/views/index/indexEditorToolShell.vue";
import { StyleNoDrag } from "@/configs/cnts";

const storeIndex = useIndexStore();
const storeConfig = useVpconfigStore();
const storeLayout = useLayoutStore();
const storeEditor = useEditorStore();

const handleSave = () => {
  if (storeEditor.getCurrArticleIndex >= 0) {
    storeEditor.saveArticle(storeEditor.getCurrArticleIndex);
  }
};
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
