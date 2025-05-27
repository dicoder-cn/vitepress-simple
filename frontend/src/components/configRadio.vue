<template>
  <div class="flex items-center">
    <a-form-item :label="label">
      <a-radio-group v-model:value="value" @change="handleChange">
        <a-radio v-for="item in props.items" :key="item.value" :value="item.value">{{ item.label }} </a-radio>
      </a-radio-group>
      <a-tooltip :title="props.tooltip">
        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
      </a-tooltip>
    </a-form-item>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";

import { InfoCircleOutlined } from "@ant-design/icons-vue";
import { AppConfig } from "@/store/appconfig";
import { ConfigSet } from "../../wailsjs/go/system/SystemService";

const value = ref();

interface radioItems {
  label: string;
  value: string;
}

interface Props {
  tooltip: string;
  label: string;
  configKey: string;
  items: radioItems[];
  isFullWidth?: boolean;
}

const props = defineProps<Props>();

onMounted(() => {
  value.value = AppConfig.getString(props.configKey);
});

const handleChange = (e: any) => {
  // console.log("handleChange", e.target.value);
  AppConfig.set(props.configKey, e.target.value);
};
</script>

<style scoped></style>
