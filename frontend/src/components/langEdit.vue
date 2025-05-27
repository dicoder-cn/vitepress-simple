<template>
  <div class="lang-edit">
    <div class="row items-center justify-between q-mb-md">
      <h3 class="text-lg font-medium m-0">{{ lang("pageProject.settingBase.labels.languageManagement") }}</h3>
      <div class="q-gutter-sm">
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
    <q-list bordered separator>
      <q-item v-for="key in sortedLangKeys" :key="key">
        <q-item-section>
          <div class="row q-col-gutter-sm items-center">
            <div class="col-1">
              <q-input
                v-model="vpConfig.locales[key].lang"
                label="语言标识 *"
                dense
                :readonly="key === StringRootLang"
                :disable="key === StringRootLang"
                required
              />
            </div>
            <div class="col-2">
              <q-input
                v-model="vpConfig.locales[key].label"
                label="语言名称 *"
                dense
                required
              />
            </div>
            <div class="col-1">
              <q-input
                v-model="vpConfig.locales[key].link"
                label="URL前缀"
                dense
              />
            </div>
            <div class="col-3">
              <q-input
                v-model="vpConfig.locales[key].title"
                label="站点标题"
                dense
              />
            </div>
            <div class="col-2">
              <q-input
                v-model="vpConfig.locales[key].titleTemplate"
                label="站点标题模板"
                dense
              />
            </div>
         
            <div class="col-2">
              <q-input
                v-model="vpConfig.locales[key].description"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVpconfigStore } from '@/store/vpconfig'
import { StringRootLang } from '@/configs/cnts'
import { useQuasar } from 'quasar'
import type { VpConfigLang } from '@/types/vpsimpleConfig'
import { ToastError, ToastInfo, ToastSuccess } from '@/utils/Toast'
import { lang } from '@/utils/language'

const $q = useQuasar()
const vpConfigStore = useVpconfigStore()

// 获取 vpConfig
const vpConfig = computed(() => vpConfigStore.vpConfig)

// 获取排序后的语言 key 列表
const sortedLangKeys = computed(() => {
  if (!vpConfig.value?.locales) {
    return []
  }
  const keys = Object.keys(vpConfig.value.locales)
  // 将 'root' 提到前面，剩余的按字母顺序排序
  const rootIndex = keys.indexOf(StringRootLang)
  if (rootIndex > -1) {
    const rootKey = keys.splice(rootIndex, 1)[0]
    keys.sort()
    return [rootKey, ...keys]
  } else {
    // 如果没有 root 语言，就按字母顺序全部排序
    keys.sort()
    return keys
  }
})

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
  const localesToUpdate: { oldKey: string, newKey: string, langConfig: VpConfigLang }[] = [];
  const updatedLocales: Record<string, VpConfigLang> = {};

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

    // 记录需要更新 key 的语言项
    if (lang.lang && key !== lang.lang) {
        localesToUpdate.push({ oldKey: key, newKey: lang.lang, langConfig: lang });
    } else {
        // 如果 key 没有变化，保留原样
        updatedLocales[key] = lang;
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

  // 更新 vpConfig.locales 结构以反映 key 的变化
  for (const { oldKey, newKey, langConfig } of localesToUpdate) {
      // 根语言的标识不允许改变，这个检查在模板里已经做了 disable，但在这里再次确认一下
      if (oldKey === StringRootLang) continue;
      
      // 如果新 key 已经存在且不是当前项的旧 key，说明是重复的，这个在 duplicateKeys 检查里已经处理了，这里只是结构更新
      // if (updatedLocales[newKey] && newKey !== oldKey) { ... }

      updatedLocales[newKey] = langConfig; // 添加新 key
      // 注意：这里不直接删除旧 key，因为 Object.entries 遍历的是原始对象
  }

  // 最后将构建好的新 locales 赋值回去
  if (vpConfigStore.vpConfig) {
    vpConfigStore.vpConfig.locales = updatedLocales;
  }

  try {
    await vpConfigStore.saveConfig()
  
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
