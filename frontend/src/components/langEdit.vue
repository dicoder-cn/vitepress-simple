<template>
  <div class="lang-edit">
    <q-list bordered separator>
      <q-item v-for="(lang, key) in vpConfig?.locales" :key="key">
        <q-item-section>
          <div class="row q-col-gutter-sm items-center">
            <div class="col-1">
              <q-input
                v-model="lang.lang"
                label="语言标识 *"
                dense
                :readonly="key === StringRootLang"
                :disable="key === StringRootLang"
                required
              />
            </div>
            <div class="col-2">
              <q-input
                v-model="lang.label"
                label="语言名称 *"
                dense
                required
              />
            </div>
            <div class="col-1">
              <q-input
                v-model="lang.link"
                label="URL前缀"
                dense
              />
            </div>
            <div class="col-3">
              <q-input
                v-model="lang.title"
                label="站点标题"
                dense
              />
            </div>
            <div class="col-2">
              <q-input
                v-model="lang.titleTemplate"
                label="站点标题模板"
                dense
              />
            </div>
         
            <div class="col-2">
              <q-input
                v-model="lang.description"
                label="站点描述"
                dense
              />
            </div>
            <div class="col-1">
              <a-popconfirm
                v-if="key !== StringRootLang"
                title="确定要删除该语言吗？"
                ok-text="确认"
                cancel-text="取消"
                :ok-button-props="{ class: 'bg-blue-600 text-white' }"
                @confirm="handleRemoveLang(key)"
              >
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                />
              </a-popconfirm>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="q-mt-md row justify-center q-gutter-sm">
      <q-btn
        color="primary"
        icon="add"
        label="添加语言"
        @click="handleAddLang"
      />
      <q-btn
        color="positive"
        icon="save"
        label="保存配置"
        @click="handleSaveConfig"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVpconfigStore } from '@/store/vpconfig'
import { StringRootLang } from '@/configs/cnts'
import { useQuasar } from 'quasar'
import type { VpConfigLang } from '@/types/vpsimpleConfig'
import { ToastError, ToastInfo, ToastSuccess } from '@/utils/Toast'

const $q = useQuasar()
const vpConfigStore = useVpconfigStore()

// 获取 vpConfig
const vpConfig = computed(() => vpConfigStore.vpConfig)

// 处理添加语言
const handleAddLang = () => {
  // 生成一个临时的语言标识
  const tempKey = 'new_lang_' + Date.now()
  // 添加新语言
  vpConfigStore.addLang(tempKey, '新语言')
}

// 处理保存配置
const handleSaveConfig = async () => {
  // 检查必填项 (语言标识和语言名称)
  const missingFields = []
  // 检查语言 key 是否重复
  const langKeys = new Set<string>()
  const duplicateKeys = new Set<string>()

  for (const [key, lang] of Object.entries(vpConfig.value?.locales || {})) {
    // 检查语言标识 (非根语言)
    if (key !== StringRootLang && !lang.lang) {
        missingFields.push(`${key} 的语言标识`)
    }
    // 检查语言名称
    if (!lang.label) {
      missingFields.push(`${key} 的语言名称`)
    }

    // 检查语言 key 是否重复 (只检查非空标识)
    if (lang.lang) {
      if (langKeys.has(lang.lang)) {
        duplicateKeys.add(lang.lang)
      } else {
        langKeys.add(lang.lang)
      }
    }
  }

  if (missingFields.length > 0) {
    ToastError(`请填写以下必填项：\n${missingFields.join('\n')}`)
    return
  }

  if (duplicateKeys.size > 0) {
    ToastError(`以下语言标识重复：\n${Array.from(duplicateKeys).join('\n')}`)
    return
  }

  try {
    await vpConfigStore.saveConfig()
    ToastSuccess("配置保存成功")
  } catch (error) {
    ToastError("配置保存失败")
  }
}

// 删除语言
const handleRemoveLang = (key: string) => {
  vpConfigStore.removeLang(key)
}
</script>

<style scoped>
.lang-edit {
  padding: 20px;
}
</style>
