<template>
  <div class="flex items-center justify-between w-full pr-5" v-show="!storeIndex.IsEmptyProject" :style="StyleNoDrag">
    <!-- 左侧文章列表 -->
    <div class="flex-1 flex items-center">
      <div class="flex items-center hide-scrollbar overflow-x-auto" style="max-width: 80%; padding-right: 1px">
        <template v-for="(article, index) in storeEditor.getArticleContents" :key="article.path">
          <div
            class="tab-item flex items-center px-3 py-1.5 mr-1 cursor-pointer transition-all duration-200 group relative"
            :class="{
              'bg-white  text-gray-800 border border-gray-200 -mb-px z-10 pr-8': index === storeEditor.getCurrArticleIndex,
              'bg-gray-100/80 text-gray-600 border-r border-b border-gray-200 hover:bg-gray-50 pr-8': index !== storeEditor.getCurrArticleIndex
            }"
            @click="storeEditor.changeCurrArticleIndex(index)">
            <a-tooltip>
              <template #title>{{ article.path.replace(storeConfig.baseDir, "") }}</template>
              <span class="truncate max-w-[120px]">
                <span v-if="!article.isSave" class="text-gray-500">*</span>
                {{ (article.path.split("/").pop() || "").replace(".md", "") }}
              </span>
            </a-tooltip>
            <div class="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center">
              <icon-park class="opacity-0 group-hover:opacity-100 hover:text-gray-700 transition-all duration-200" @click.stop="storeEditor.closeArticle(article.path)" :size="13" type="close" />
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 右侧工具栏 -->
    <div class="flex items-center justify-end space-x-2 mr-2">
            <!-- 生成工具 -->
      <index-editor-tool-generate></index-editor-tool-generate>

      
      <!--    终端-->
      <index-editor-tool-shell></index-editor-tool-shell>


      <!-- 侧边栏设置 -->
      <index-editor-tool-sidebar></index-editor-tool-sidebar>

      <!-- 隐藏或关闭右侧栏-->
      <a-tooltip class="cursor-pointer">
        <template #title>{{ storeLayout.showEditorView ? lang("common.hide") : lang("common.show") }}{{ lang("pageIndex.pageProperties") }}</template>
        <icon-park
          class="select-none"
          @click="storeLayout.setEditorViewShow(false)"
          v-show="storeLayout.showEditorView"
          :size="storeLayout.editorToolIconSize"
          fill="#493c3c"
          strokeLinejoin="bevel"
          theme="outline"
          type="file-display" />
        <icon-park
          class="select-none"
          @click="storeLayout.setEditorViewShow(true)"
          v-show="!storeLayout.showEditorView"
          :size="storeLayout.editorToolIconSize"
          fill="#493c3c"
          strokeLinejoin="bevel"
          theme="outline"
          type="file-hiding" />
      </a-tooltip>

      <!--      保存-->
      <a-tooltip class="cursor-pointer" @click="handleSave">
        <template #title>{{ lang("common.saveWithKey") }}</template>
        <icon-park :size="storeLayout.editorToolIconSize" fill="#493c3c" strokeLinejoin="bevel" theme="outline" type="save" />
      </a-tooltip>
    </div>

    <!-- 中间显示当前项目路径 -->
    <div class="text-gray-400 flex-shrink-0 mx-4">{{ lang("pageIndex.currentProject") }}{{ storeConfig.baseDir }}</div>
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
import IndexEditorToolSidebar from "@/views/index/indexEditorToolSidebar.vue";
import IndexEditorToolGenerate from "@/views/index/indexEditorToolGen.vue";
import { StyleNoDrag } from "@/configs/cnts";
import { ref } from "vue";

const storeIndex = useIndexStore();
const storeConfig = useVpconfigStore();
const storeLayout = useLayoutStore();
const storeEditor = useEditorStore();

const isShowGenerateSidebar = ref(false);
const isShowGenerateSEO = ref(false);

const handleSave = () => {
  if (storeEditor.getCurrArticleIndex >= 0) {
    storeEditor.saveArticle(storeEditor.getCurrArticleIndex);
  }
};

const handleGenerateSidebar = () => {
  // 处理生成侧栏的逻辑
  isShowGenerateSidebar.value = false;
};

const handleGenerateSEO = () => {
  // 处理生成SEO关键词的逻辑
  isShowGenerateSEO.value = false;
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
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
