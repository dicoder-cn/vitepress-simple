<template>
  <div
    class="flex items-center justify-between w-full pr-5"
    v-show="!storeIndex.IsEmptyProject"
    :style="StyleNoDrag"
  >
    <!-- 左侧文章列表 -->
    <div class="flex-1 flex items-center ">
      <div class="flex items-center hide-scrollbar overflow-x-auto" style="max-width: 60%; padding-right: 1px;">
        <template v-for="(article, index) in storeEditor.getArticleContents" :key="article.path">
          <div 
            class="tab-item flex items-center px-3 py-1.5 mr-1 cursor-pointer transition-all duration-200 group relative"
            :class="{
              'bg-white  text-gray-800 border border-gray-200 -mb-px z-10 pr-8': index === storeEditor.getCurrArticleIndex,
              'bg-gray-100/80 text-gray-600 border-r border-b border-gray-200 hover:bg-gray-50 pr-8': index !== storeEditor.getCurrArticleIndex
            }"
            @click="storeEditor.changeCurrArticleIndex(index)"
          >
            <span class="truncate max-w-[120px]">{{ (article.path.split('/').pop() || '').replace('.md', '') }}</span>
            <div class="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center">
              <icon-park
                class="opacity-0 group-hover:opacity-100 hover:text-gray-700 transition-all duration-200"
                @click.stop="storeEditor.closeArticle(article.path)"
                :size="13"
                type="close"
              />
            </div>
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

.tab-item {
  position: relative;
  margin-right: -1px;
}

.tab-item:hover {
  border-color: #e5e7eb;
}

.hide-scrollbar {
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>
