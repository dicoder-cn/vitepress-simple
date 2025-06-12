<template>

    <a-dropdown class="mx-1" arrow>
        <icon-park class="select-none cursor-pointer" :size="storeLayout.editorToolIconSize" fill="black" strokeLinejoin="bevel" theme="outline" type="magic-wand" />
      <!-- <icon-park class="select-none cursor-pointer" :size="storeLayout.editorToolIconSize" fill="black" strokeLinejoin="bevel" theme="outline" type="magic-wand" /> -->
      <template #overlay>
        <a-menu>
          <!-- 列表 菜单 -->
          <div v-for="(item, index) in generateList" :key="index">
            <a-menu-item @click="handleGenerate(index)">
              <a class="no-select" href="javascript:;">{{ item.menuLabel }}</a>
            </a-menu-item>
            <hr v-if="[1].includes(index)" />
          </div>
        </a-menu>
      </template>
    </a-dropdown>

    <!-- 生成侧栏弹窗 -->
    <a-modal
      :style="StyleNoDrag"
      v-model:open="isShowGenerateSidebar"
      title="生成侧栏"
      
      :cancel-button-props="{ style: 'display:none' }"
     
      width="80%">
      <index-editor-tool-gen-sidebar></index-editor-tool-gen-sidebar>
    </a-modal>



    <!-- 生成SEO关键词弹窗 -->
    <a-modal
      :style="StyleNoDrag"
      v-model:open="isShowGenerateSEO"
      title="生成SEO关键词"
      :cancel-button-props="{ style: 'display:none' }"
      width="80%">
     <div>
        
     </div>
    </a-modal>
 
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { IconPark } from "@icon-park/vue-next/es/all";
import { useLayoutStore } from "@/store/layout";
import { StyleNoDrag } from "@/configs/cnts";
import IndexEditorToolGenSidebar from "@/views/index/indexEditorToolGenSidebar.vue";
import { generateTagService } from '@/services/generateTag';

const storeLayout = useLayoutStore();

// 侧栏生成相关状态
const isShowGenerateSidebar = ref(false);
const sidebarTitle = ref('');
const sidebarContent = ref('');
const sidebarPosition = ref('left');

// SEO生成相关状态
const isShowGenerateSEO = ref(false);
const seoTitle = ref('');
const seoDescription = ref('');
const seoKeywords = ref<string[]>([]);

// tag标签页生成相关状态
const isShowGenerateTagPage = ref(false);

interface GenerateItem {
  menuLabel: string;
  type: 'sidebar' | 'seo' | 'tag';
}

const generateList = ref<GenerateItem[]>([
  {
    menuLabel: '快速生成侧栏',
    type: 'sidebar'
  },
  {
    menuLabel: '生成tag标签页',
    type: 'tag'
  }
  // ,
  // {
  //   menuLabel: '快速生成SEO',
  //   type: 'seo'
  // }
]);

const handleGenerate = (index: number) => {
  const item = generateList.value[index];
  switch (item.type) {
    case 'sidebar':
      isShowGenerateSidebar.value = true;
      break;
    case 'seo':
        isShowGenerateSEO.value = true;
        break;
    case 'tag':
        generateTagService.genTagPage();
        break;
  }
};


</script>

<style scoped>
.no-select {
  user-select: none;
}
</style> 