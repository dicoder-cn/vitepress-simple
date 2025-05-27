<template>
  <MdEditor style="height: 92%" @onUploadImg="onUploadImg" previewTheme="vuepress" :toolbars="toolbars" v-show="storeEditor.isOpenArticle" v-model="storeEditor.currArticle.mdContent" />
  <empty-project></empty-project>
  <div v-if="!isEmptyArray(storeIndex.articleTreeData) && !storeEditor.isOpenArticle">
    <a-empty :description="lang('pageIndex.noSelectedArticle')" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, nextTick } from "vue";
import { useIndexStore } from "../../store";
import { getDefaultVtitorOptions } from "@/configs/vditor";
import { isEmptyArray } from "@/utils/array";
import EmptyProject from "@/components/emptyProject.vue";
import { lang } from "@/utils/language";
import { useEditorStore } from "../../store/editor";
import "md-editor-v3/lib/style.css";
import { MdEditor, ToolbarNames } from "md-editor-v3";
import { ConfigKeySysStaticServerPort } from "@/configs/appConfigKey";
import axios from "axios";
import { AppConfig } from "@/store/appconfig";

const storeEditor = useEditorStore();
const storeIndex = useIndexStore();

// export interface ToolbarTips {
//     bold?: string;           // 加粗
//     underline?: string;      // 下划线
//     italic?: string;         // 斜体
//     strikeThrough?: string;  // 删除线
//     title?: string;          // 标题
//     sub?: string;            // 下标
//     sup?: string;            // 上标
//     quote?: string;          // 引用
//     unorderedList?: string;  // 无序列表
//     orderedList?: string;    // 有序列表
//     task?: string;           // 任务列表
//     codeRow?: string;        // 行内代码
//     code?: string;           // 代码块
//     link?: string;           // 插入链接
//     image?: string;          // 插入图片
//     table?: string;          // 插入表格
//     mermaid?: string;        // Mermaid 图表
//     katex?: string;          // 数学公式 (LaTeX)
//     revoke?: string;         // 撤销
//     next?: string;           // 重做 / 前进
//     save?: string;           // 保存
//     prettier?: string;       // 格式化
//     pageFullscreen?: string; // 页面全屏
//     fullscreen?: string;     // 全屏模式
//     preview?: string;        // 预览
//     previewOnly?: string;    // 仅预览
//     htmlPreview?: string;    // HTML 预览
//     catalog?: string;        // 目录
//     github?: string;         // GitHub 链接或其他相关操作
//     '-'?: string;             // 分隔符（通常用于分组按钮）
//     '='?: string;             // 等宽字体或其他自定义功能
// }
const toolbars: ToolbarNames[] = [
  "bold", //加粗
  "underline", //下划线
  "italic", //斜体
  "table", //表格
  "quote", //引用
  "unorderedList", //无序列表
  "orderedList", //有序列表
  "task", //任务列表
  "strikeThrough", //删除线
  "title", //标题
  "sub", //下标
  "-", //分隔符
  "code", //代码块
  "link", //链接
  "image", //图片
  "katex", //数学公式
  "catalog", //目录
  "codeRow", //行内代码
  "mermaid", //mermaid图表
  "preview" //预览
];

const onUploadImg = async (files: any[], callback: (arg0: any[]) => void) => {
  let port = AppConfig.getString(ConfigKeySysStaticServerPort);
  port = port == "" ? "9874" : port;
  const uploadUrl = `http://localhost:${port}/upload_image`;
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append("image", file);
        axios
          .post(uploadUrl, form, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    })
  );

  //   {
  //     "code": 0,
  //     "msg": "",
  //     "data": {
  //         "errFiles": [],
  //         "succMap": {
  //             "07f8d818-1fcb-4602-b8eb-eebe8320adea.png": "http://localhost:9874/images/20250525/07f8d818-1fcb-4602-b8eb-eebe8320adea.png"
  //         }
  //     }
  // }

  console.log("uploadImg res:", res);
  const urls = res.map((item: any) => {
    const succMap = item.data.data.succMap;
    return Object.values(succMap)[0];
  });
  callback(urls);
};
</script>
<style scoped>
a {
  color: #42b983;
}
</style>
