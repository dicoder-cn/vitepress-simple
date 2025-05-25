<template>

  <MdEditor style="height: 93%;" @onUploadImg="onUploadImg"  v-show="storeEditor.isOpenArticle" v-model="storeEditor.currArticle.mdContent" />
  <empty-project></empty-project>
  <div
    v-if="
      !isEmptyArray(storeIndex.articleTreeData) &&
      !storeEditor.isOpenArticle
    "
  >
    <a-empty :description="lang('pageIndex.noSelectedArticle')" />
  </div>
</template>
<script lang="ts" setup>
import {  onMounted, nextTick } from "vue";
import { useIndexStore } from "../../store";
import { getDefaultVtitorOptions } from "@/configs/vditor";
import { isEmptyArray } from "@/utils/array";
import EmptyProject from "@/components/emptyProject.vue";
import { lang } from "@/utils/language";
import { useEditorStore } from "../../store/editor";
import 'md-editor-v3/lib/style.css';
import { MdEditor } from 'md-editor-v3';
import { ConfigGet } from "wailsjs/go/system/SystemService";
import { ConfigKeySysStaticServerPort } from "@/constant/keys/config";
import axios from "axios";

const storeEditor = useEditorStore();
const storeIndex = useIndexStore();




onMounted(() => {
  nextTick(async () => {
    let opts = await getDefaultVtitorOptions();
  });
});



const onUploadImg = async (files: any[], callback: (arg0: any[]) => void) => {
  let port = await ConfigGet(ConfigKeySysStaticServerPort);
  port = port == "" ? "9874" : port;
  const uploadUrl = `http://localhost:${port}/upload_image`;
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append('image', file);
        axios .post(uploadUrl, form, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
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

  console.log("uploadImg res:",res);
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
