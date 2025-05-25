<template>
  <div>
    <div class="px-1 mb-2">
      <a-input
        v-model:value="storeEditor.currArticle.frontMatter['title']"
        :placeholder="lang('pageIndex.inputArticleTitle')"
        prefix=""
        :suffix="lang('common.title')"
      />
    </div>

    <div class="px-1 my-2">
      <a-textarea
        class="text-gray-500"
        v-model:value="storeEditor.currArticle.frontMatter['description']"
        :auto-size="{ minRows: 1 }"
        :placeholder="lang('pageIndex.inputPageSeoDescription')"
      ></a-textarea>
    </div>
    <!-- 标签输入框 -->
    <div class="px-1 my-2">
      <q-input
        v-model="tagInput"
        :label="lang('pageIndex.tags')"
        :placeholder="lang('pageIndex.inputTags')"
        dense
        outlined
        style="width: 100%"
        @keyup.enter="handleTagInput"
      >
        <template v-slot:append>
          <q-icon name="close" v-if="tagInput" class="cursor-pointer" @click="tagInput = ''" />
        </template>
      </q-input>
      <div class="flex flex-wrap gap-2 mt-2">
        <q-chip
          v-for="(tag, index) in storeEditor.currArticle.frontMatter['tags']"
          :key="index"
          removable
          @remove="removeTag(index)"
          color="primary"
          text-color="white"
        >
          {{ tag }}
        </q-chip>
      </div>
    </div>
    


    <div class="px-2 mb-2">
      <a-input
        v-model:value="storeEditor.currArticle.frontMatter['outline'][1]"
        class="text-gray-500"
        prefix=""
        :placeholder="lang('pageIndex.inputOutlineLevel')"
        :suffix="lang('pageIndex.outlineLevel')"
      />
    </div>
  </div>

  <div>
    <a-form
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      class="ml-5"
      label-align="left"
    >
      <div>
        <q-toggle
          :label="lang('pageIndex.showNav')"
          left-label
          v-model="storeEditor.currArticle.frontMatter['navbar']"
          color="blue"
        />
      </div>
      <div>
        <q-toggle
          :label="lang('pageIndex.showSidebar')"
          left-label
          v-model="storeEditor.currArticle.frontMatter['sideBar']"
          color="blue"
        />
      </div>
      <div>
        <q-toggle
          :label="lang('pageIndex.showFooter')"
          left-label
          v-model="storeEditor.currArticle.frontMatter['footer']"
          color="blue"
        />
      </div>

      <div>
        <q-toggle
          :label="lang('pageIndex.showEditLink')"
          left-label
          v-model="storeEditor.currArticle.frontMatter['editLink']"
          color="blue"
        />
      </div>
      <div>
        <q-toggle
          :label="lang('pageIndex.showUpdateTime')"
          left-label
          v-model="storeEditor.currArticle.frontMatter['lastUpdated']"
          color="blue"
        />
      </div>

      <a-form-item :label="lang('pageIndex.outlinePosition')">
        <a-radio-group
          v-model:value="storeEditor.currArticle.frontMatter['aside']"
        >
          <a-radio value="left">{{ lang("pageIndex.outlineLeft") }}</a-radio>
          <a-radio value="right">{{ lang("pageIndex.outlineRight") }}</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </div>
  <q-separator inset />

  <div class="mt-3">
    <dy-add-head
      v-model:meta="storeEditor.currArticle.frontMatter['head']"
      ref="refDyAddHead"
      :add-btn-text="lang('pageIndex.addMeta')"
      add-btn-class="bg-blue-500 text-white hover:bg-blue-600"
      class="mt-2"
      key-placeholder="name"
      value-placeholder="content"
      key-name="name"
      value-name="content"
    ></dy-add-head>
  </div>
  <div class="mt-3">
    <q-separator inset />
  </div>

  <!--  自定义formatter-->
  <div class="mt-3">
    <a-tooltip :title="lang('pageIndex.customFormatterTip')">
      <dy-add-head
        v-model:obj="storeEditor.currArticle.frontMatter['custom']"
        ref="refDyAddFontMatter"
        add-btn-class="bg-blue-500 text-white hover:bg-blue-600"
        :add-btn-text="lang('pageIndex.addCustomFormatter')"
        key-placeholder="key"
        value-placeholder="value"
      >
      </dy-add-head>
    </a-tooltip>
  </div>
</template>
<script setup lang="ts">
import DyAddHead from "@/components/dyAddKV.vue";
import { onMounted, ref } from "vue";
import { useIndexStore } from "@/store";
import { lang } from "@/utils/language";
import { useEditorStore } from "@/store/editor";

const storeEditor = useEditorStore();
const labelCol = { style: { width: "150px" } };
const wrapperCol = { span: 14 };
const storeIndex = useIndexStore();

const tagInput = ref('');

// 确保所有必要的对象和数组都被初始化
if (!storeEditor.currArticle) {
  storeEditor.initCurrArticle();
}
if (!storeEditor.currArticle.frontMatter) {
  storeEditor.currArticle.frontMatter = {};
}
if (!storeEditor.currArticle.frontMatter['tags']) {
  storeEditor.currArticle.frontMatter['tags'] = [];
}

const handleTagInput = () => {
  if (!tagInput.value.trim()) return;
  
  const newTags = tagInput.value.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag && !storeEditor.currArticle.frontMatter['tags'].includes(tag));
  
  storeEditor.currArticle.frontMatter['tags'].push(...newTags);
  tagInput.value = '';
};

const removeTag = (index: number) => {
  storeEditor.currArticle.frontMatter['tags'].splice(index, 1);
};

const refDyAddHead = ref();
const refDyAddFontMatter = ref();
onMounted(() => {});
</script>
<style scoped></style>
