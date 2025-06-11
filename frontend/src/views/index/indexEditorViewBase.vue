<template>
  <div>
    <!-- 标题 -->
    <div class="px-1 mb-2">
      <a-input
        :value="getFrontMatter(['title'], defaultFrontMatter.title)"
        @update:value="(val: string) => setFrontMatter(['title'], val, defaultFrontMatter)"
        :placeholder="lang('pageIndex.inputArticleTitle')"
        prefix=""
        :suffix="lang('common.title')"
      />
    </div>

    <!-- 描述 -->
    <div class="px-1 my-2">
      <a-textarea
        class="text-gray-500"
        :value="getFrontMatter(['description'], defaultFrontMatter.description)"
        @update:value="(val: string) => setFrontMatter(['description'], val, defaultFrontMatter)"
        :auto-size="{ minRows: 1 }"
        :placeholder="lang('pageIndex.inputPageSeoDescription')"
      />
    </div>

    <!-- 标签输入框 -->
    <div class="px-1 my-2">
      <a-input
        v-model:value="tagInput"
        :placeholder="lang('pageIndex.inputTags') + '（回车添加）'"
        :suffix="lang('pageIndex.tags')"
        @keyup.enter="handleTagInput"
        allow-clear
        class="mb-2"
      />
      <div class="flex flex-wrap items-center gap-0.5 mt-0.5">
        <div v-if="getFrontMatter(['tags'], defaultFrontMatter.tags).length > 0" class="text-gray-500 ml-1 mr-1">Tags:</div>
        <q-chip v-for="(tag, index) in getFrontMatter(['tags'], defaultFrontMatter.tags)" :key="index" removable square dense @remove="removeTag(index)" color="gray" text-color="dark">
          {{ tag }}
        </q-chip>
      </div>
      <!-- 权重配置 -->
      <div class="mt-2">
        <a-input
          :value="getFrontMatter(['weight'], defaultFrontMatter.weight)"
          @update:value="(val: string) => setFrontMatter(['weight'], val, defaultFrontMatter)"
          :placeholder="lang('pageIndex.inputWeight')"
          :suffix="lang('pageIndex.weight')"
          class="w-full"
        />
      </div>
    </div>

    <!-- 大纲显示级别 -->
    <div class="px-2 mb-2" v-if="getFrontMatter(['outline'], defaultFrontMatter.outline).length >= 2">
      <a-input
        :value="String(getFrontMatter(['outline', '1'], defaultFrontMatter.outline['1']))"
        @update:value="(val: string) => setFrontMatter(['outline', '1'], val, defaultFrontMatter.outline)"
        class="text-gray-500"
        prefix=""
        :placeholder="lang('pageIndex.inputOutlineLevel')"
        :suffix="lang('pageIndex.outlineLevel')"
      />
    </div>
  </div>

  <div>
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol" class="ml-5" label-align="left">
      <!-- 是否显示导航栏 -->
      <div>
        <q-toggle :label="lang('pageIndex.showNav')"
                  v-model="navbarProxy"
                  left-label color="blue" />
      </div>
      <!-- 是否显示侧边栏 -->
      <div>
        <q-toggle :label="lang('pageIndex.showSidebar')"
                  v-model="sideBarProxy"
                  left-label color="blue" />
      </div>
      <!-- 是否显示页脚 -->
      <div>
        <q-toggle :label="lang('pageIndex.showFooter')"
                  v-model="footerProxy"
                  left-label color="blue" />
      </div>
      <!-- 是否显示编辑链接 -->
      <div>
        <q-toggle :label="lang('pageIndex.showEditLink')"
                  v-model="editLinkProxy"
                  left-label color="blue" />
      </div>
      <!-- 是否显示更新时间 -->
      <div>
        <q-toggle :label="lang('pageIndex.showUpdateTime')"
                  v-model="lastUpdatedProxy"
                  left-label color="blue" />
      </div>
      <!-- 大纲位置 -->
      <a-form-item :label="lang('pageIndex.outlinePosition')" v-if="getFrontMatter(['aside'], defaultFrontMatter.aside)">
        <a-radio-group :value="getFrontMatter(['aside'], defaultFrontMatter.aside)"
                       @update:value="(val: string) => setFrontMatter(['aside'], val, defaultFrontMatter)">
          <a-radio value="left">{{ lang("pageIndex.outlineLeft") }}</a-radio>
          <a-radio value="right">{{ lang("pageIndex.outlineRight") }}</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </div>

  <!-- <q-separator inset /> -->

  <!-- 自定义head -->
  <div class="mt-3" v-if="getFrontMatter(['head'], defaultFrontMatter.head).length > 0">
    <dy-add-head
      :meta="getFrontMatter(['head'], defaultFrontMatter.head)"
      @update:meta="(val: any) => setFrontMatter(['head'], val, defaultFrontMatter)"
      ref="refDyAddHead"
      :add-btn-text="lang('pageIndex.addMeta')"
      add-btn-class="bg-blue-500 text-white hover:bg-blue-600"
      class="mt-2"
      key-placeholder="name"
      value-placeholder="content"
      key-name="name"
      value-name="content"></dy-add-head>
  </div>
  <div class="mt-3">
    <q-separator inset />
  </div>

  <!--  自定义formatter-->
  <div class="mt-3">
    <a-tooltip :title="lang('pageIndex.customFormatterTip')">
      <dy-add-head
        :obj="getFrontMatter(['custom'], defaultFrontMatter.custom)"
        @update:obj="(val: any) => setFrontMatter(['custom'], val, defaultFrontMatter)"
        ref="refDyAddFontMatter"
        add-btn-class="bg-blue-500 text-white hover:bg-blue-600"
        :add-btn-text="lang('pageIndex.addCustomFormatter')"
        key-placeholder="key"
        value-placeholder="value">
      </dy-add-head>
    </a-tooltip>
  </div>
</template>
<script setup lang="ts">
import DyAddHead from "@/components/dyAddKV.vue";
import { onMounted, ref, computed } from "vue";
import { useIndexStore } from "@/store";
import { lang } from "@/utils/language";
import { useEditorStore } from "@/store/editor";
import { defaultFrontMatter } from "@/configs/defaultFrontMatter";

const storeEditor = useEditorStore();
const labelCol = { style: { width: "150px" } };
const wrapperCol = { span: 14 };
const storeIndex = useIndexStore();

const tagInput = ref("");
const weight = ref("5"); // 默认权重为5

// getter
const getFrontMatter = storeEditor.getCurrFrontMatterValue;
const setFrontMatter = storeEditor.setCurrFrontMatterValue;

// 新增 computed 代理，保证响应式
const navbarProxy = computed({
  get: () => getFrontMatter(["navbar"], defaultFrontMatter.navbar),
  set: (val) => setFrontMatter(["navbar"], val, defaultFrontMatter)
});
const sideBarProxy = computed({
  get: () => getFrontMatter(["sideBar"], defaultFrontMatter.sideBar),
  set: (val) => setFrontMatter(["sideBar"], val, defaultFrontMatter)
});
const footerProxy = computed({
  get: () => getFrontMatter(["footer"], defaultFrontMatter.footer),
  set: (val) => setFrontMatter(["footer"], val, defaultFrontMatter)
});
const editLinkProxy = computed({
  get: () => getFrontMatter(["editLink"], defaultFrontMatter.editLink),
  set: (val) => setFrontMatter(["editLink"], val, defaultFrontMatter)
});
const lastUpdatedProxy = computed({
  get: () => getFrontMatter(["lastUpdated"], defaultFrontMatter.lastUpdated),
  set: (val) => setFrontMatter(["lastUpdated"], val, defaultFrontMatter)
});

// 确保所有必要的对象和数组都被初始化
if (!storeEditor.currArticle) {
  storeEditor.currArticle=storeEditor.getDefaultArticle();
}
if (!storeEditor.currArticle.frontMatter) {
  storeEditor.currArticle.frontMatter = {};
}
if (!storeEditor.currArticle.frontMatter["tags"]) {
  storeEditor.currArticle.frontMatter["tags"] = [];
}

const handleTagInput = () => {
  const tag = tagInput.value.trim();
  if (!tag) return;
  if (!storeEditor.currArticle.frontMatter["tags"]) {
    storeEditor.currArticle.frontMatter["tags"] = [];
  }
  // 不重复添加
  if (!storeEditor.currArticle.frontMatter["tags"].includes(tag)) {
    storeEditor.currArticle.frontMatter["tags"].push(tag);
  }
  tagInput.value = "";
};

const removeTag = (index: number) => {
  storeEditor.currArticle.frontMatter["tags"].splice(index, 1);
};

const refDyAddHead = ref();
const refDyAddFontMatter = ref();
onMounted(() => {});
</script>
<style scoped></style>
