<template>
  <div class="setting-editor">
    <h3>{{ lang('pageSetting.settingEditor.title') }}</h3>
    <div class="editor-type-select">
      <config-radio
        :label="lang('pageSetting.settingEditor.editorType')"
        :config-key="ConfigKeyEditorType"
        :items="editorTypeItems"
        :tooltip="lang('pageSetting.settingEditor.editorTypeTooltip')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { lang } from "@/utils/language";
import { editorType } from "@/configs/appConfig";
import { ConfigKeyEditorType } from "@/configs/appConfigKey";
import ConfigRadio from "@/components/configRadio.vue";

const editorTypeItems = [
  { label: 'Vditor', value: editorType.Vditor },
  { label: 'MdEditorV3', value: editorType.MdEditorV3 }
];
</script>

<style scoped>
.setting-editor {
  padding: 16px;
}

.editor-type-select {
  margin-top: 16px;
}
</style> 