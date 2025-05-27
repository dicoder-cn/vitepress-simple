<template>
  <div class="setting-editor">
    <h3>{{ lang('pageSetting.settingEditor.title') }}</h3>
    <div class="editor-type-select">
      <config-radio
        :label="lang('pageSetting.settingEditor.editorType')"
        :config-key="ConfigKeyEditorType"
        :items="editorTypeItems"
        :tooltip="lang('pageSetting.settingEditor.editorTypeTooltip')" />

      <div class="ml-5 mt-5">
        <config-radio
          :config-key="ConfigKeyVditorCdn"
          :label="lang('pageSetting.settingBase.editorCdn.label')"
          :tooltip="lang('pageSetting.settingBase.editorCdn.tooltip')"
          :items="[
            { label: 'unpkg', value: VditorCdnUnpkg },
            { label: 'zstatic', value: VditorCdnZstatic },
            { label: 'jsdeliver', value: VditorCdnJsdelivr },
          ]"></config-radio>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { lang } from '@/utils/language'
  import { editorType } from '@/configs/appConfig'
  import { ConfigKeyEditorType } from '@/configs/appConfigKey'
  import ConfigRadio from '@/components/configRadio.vue'
  import { ConfigKeyVditorCdn } from '@/configs/appConfigKey'
  import { VditorCdnJsdelivr, VditorCdnUnpkg, VditorCdnZstatic } from '@/constant/enums/cdn'
  const editorTypeItems = [
    { label: 'Vditor', value: editorType.Vditor },
    { label: 'MdEditorV3', value: editorType.MdEditorV3 },
  ]
</script>

<style scoped>
  .setting-editor {
    padding: 16px;
  }

  .editor-type-select {
    margin-top: 16px;
  }
</style>
