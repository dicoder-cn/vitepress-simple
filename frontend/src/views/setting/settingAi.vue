<template>
    <div class="setting-ai">
        <h3>{{ lang("pageSetting.settingAi.title") }}</h3>
        <div class="ml-15 mt-5">
            <config-input :config-key="ConfigKeyOpenAIKey" :label="lang('pageSetting.settingAi.key.label')" :tooltip="lang('pageSetting.settingAi.key.tooltip')"></config-input>
        </div>
        <div class="ml-15 mt-5">
            <config-input :config-key="ConfigKeyOpenAIApiBase" :label="lang('pageSetting.settingAi.apiBase.label')" :tooltip="lang('pageSetting.settingAi.apiBase.tooltip')"></config-input>
        </div>
        <div class="ml-15 mt-5">
            <config-input :config-key="ConfigKeyOpenAIModel" :label="lang('pageSetting.settingAi.model.label')" :tooltip="lang('pageSetting.settingAi.model.tooltip')"></config-input>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ConfigKeyOpenAIApiBase, ConfigKeyOpenAIKey, ConfigKeyOpenAIModel } from '@/configs/appConfigKey';
import ConfigInput from "@/components/configInput.vue";
import { lang } from '@/utils/language';
</script>