<template>
  <div class="mt-2 items-end text-right" :style="StyleNoDrag">
    <q-input
      v-if="props.formType == 'text'"
      outlined
      type="text"
      :disable="props.disEnable"
      v-model="CurrInputValue"
      :label="props.label" />

    <q-input
      v-if="props.formType == 'password'"
      outlined
      type="password"
      :disable="props.disEnable"
      v-model="CurrInputValue"
      :label="props.label" />
    <q-input
      v-if="props.formType == 'textarea'"
      outlined
      type="textarea"
      :disable="props.disEnable"
      v-model="CurrInputValue"
      :label="props.label" />
  </div>
</template>

<script setup lang="ts">
  import { defineProps, onMounted, ref, watch } from 'vue'
  import { AppConfig } from '@/store/appconfig'
  import { StyleNoDrag } from '@/configs/cnts'

  const props = defineProps({
    configKey: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '请输入',
    },
    formType: {
      type: String,
      default: 'text',
    },
    disEnable: {
      type: Boolean,
      default: false,
    },
  })

  onMounted(async () => {
    CurrInputValue.value = AppConfig.getString(props.configKey)
  })

  let CurrInputValue = ref('')
  watch(CurrInputValue, (nval: string, oval: string) => {
    AppConfig.set(props.configKey, nval)
  })

  const SetModelValue = (val: string) => {
    LoadConfigValue()
  }
  const LoadConfigValue = () => {
    CurrInputValue.value = AppConfig.getString(props.configKey)
  }

  defineExpose({ SetModelValue, LoadConfigValue })
</script>

<style scoped></style>
