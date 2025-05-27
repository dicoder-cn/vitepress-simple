<template>
  <div class="flex items-center">
    <a-tooltip class="cursor-pointer">
      <template #title>{{ lang('pageSidebar.sidebarSettings') }}</template>
      <icon-park
        class="select-none"
        @click="showSidebarModal = true"
        :size="storeLayout.editorToolIconSize"
        fill="#493c3c"
        strokeLinejoin="bevel"
        theme="outline"
        type="setting" />
    </a-tooltip>

    <a-modal
      v-model:visible="showSidebarModal"
      :title="lang('pageSidebar.sidebarSettings')"
      :width="800"
      :footer="null"
      :maskClosable="false">
      <div class="mx-6 mt-4 text-xl" :style="StyleNoDrag">
        <!-- 多侧边栏选择 -->
        <div class="flex pl-3 justify-between ml-2 items-center min-h-11 pb-2 border">
          <div>
            {{ lang('pageSidebar.chooseEditedSidebar') }}
            <a-radio-group
              class="mt-2"
              @change="subSidebarChange"
              v-model:value="currSelectSidebarKey">
              <a-radio-button
                v-for="(item, index) in currSidebarSubDirList"
                :key="index"
                :value="item">
                <q-tooltip>
                  {{ lang('pageSidebar.whenRouteInTip') }} '{{ item }}'
                  {{ lang('pageSidebar.whenRouteInTip2') }}
                </q-tooltip>
                {{ item }}
              </a-radio-button>
            </a-radio-group>
          </div>
          <div class="text-red-500" v-if="!hasSubSidebarDir">
            {{ emptySubDirText }}
          </div>
          <div class="mr-4 cursor-pointer" @click="setCurrTreeData">
            <q-tooltip>{{ lang('pageSidebar.reloadSidebarTip') }}</q-tooltip>
            <icon-park strokeLinejoin="bevel" theme="outline" type="refresh" />
          </div>
        </div>

        <!-- 顶部操作按钮栏目 -->
        <div class="mt-4 flex justify-start">
          <!-- 添加顶级侧栏 -->
          <a-button
            class="bg-blue-200 mx-2 flex justify-center items-center hover:bg-blue-100"
            @click="addTopSidebar()">
            <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="add-one" />
            {{ lang('pageSidebar.addTopSidebar') }}
          </a-button>
          <!-- 自动识别侧栏 -->
          <div class="mx-1">
            <a-popconfirm
              :title="lang('pageSidebar.recognitionWarning')"
              :ok-text="lang('common.know')"
              :cancel-text="lang('common.cancel')"
              :ok-button-props="{ class: 'bg-blue-500 text-white' }"
              @confirm="recognitionSidebar()">
              <q-tooltip>
                {{ lang('pageSidebar.autoRecognize') }}{{ storeVpConfig.SrcLangDir }}
                {{ lang('pageSidebar.sidebarData') }}
              </q-tooltip>
              <a-button
                class="bg-blue-500 hover:bg-blue-600 text-white flex justify-center items-center"
                dense>
                <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="scanning" />
                {{ lang('pageSidebar.autoRecognizeSidebar') }}
              </a-button>
            </a-popconfirm>
          </div>
          <!-- 保存到配置文件 -->
          <a-button
            @click="saveSidebar()"
            class="bg-blue-600 hover:bg-blue-500 text-white flex justify-center items-center">
            <icon-park class="mr-1" strokeLinejoin="bevel" theme="outline" type="save" />
            {{ lang('pageSidebar.saveSidebar') }}
          </a-button>
        </div>
        <!-- 动态添加侧栏 -->
        <dy-add-sidebar
          class="ml-4"
          ref="refSidebar"
          :level="1"
          v-model:sidebar-array="sidebarTree"></dy-add-sidebar>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref } from 'vue'
  import { useVpconfigStore } from '@/store/vpconfig'
  import { VpNav } from '@/utils/tree'
  import { IconPark } from '@icon-park/vue-next/es/all'
  import DyAddSidebar from '@/components/dyAddSidebar.vue'
  import { ParseTreeData } from '../../../wailsjs/go/services/ArticleTreeData'
  import { StyleNoDrag } from '@/configs/cnts'
  import { PathJoin } from '../../../wailsjs/go/system/SystemService'
  import { ToastError } from '@/utils/Toast'
  import { dto } from '../../../wailsjs/go/models'
  import { useLayoutStore } from '@/store/layout'
  import { IsEmptyValue } from '@/utils/utils'
  import { lang } from '@/utils/language'
  import TreeNode = dto.TreeNode

  const showSidebarModal = ref(false)
  const storeVpConfig = useVpconfigStore()
  const storeLayout = useLayoutStore()
  const sidebarTree = ref<VpNav[]>([])
  const currSidebarSubDirList = ref<string[]>([])
  const currSelectSidebarKey = ref('')

  onMounted(() => {
    nextTick(() => {
      setCurrTreeData()
    })
  })

  const hasSubSidebarDir = computed(() => {
    return currSidebarSubDirList.value && currSidebarSubDirList.value.length > 0
  })

  const emptySubDirText = computed(() => {
    if (!hasSubSidebarDir.value) {
      return storeVpConfig.SrcLangDir + lang('pageSidebar.noSubDirectoryTip')
    }
    return ''
  })

  // 设置当前侧栏指向的数据
  const setCurrTreeData = async () => {
    await getSubSidebarDirList()
    sidebarTree.value =
      storeVpConfig.currLangConfig['themeConfig']['sidebar'][currSelectSidebarKey.value]

    if (IsEmptyValue(sidebarTree.value)) {
      sidebarTree.value = []
    }
  }

  // 获取子侧栏目录列表
  const getSubSidebarDirList = async () => {
    // 实现获取子侧栏目录列表的逻辑
  }

  // 侧栏切换
  const subSidebarChange = (e: any) => {
    currSelectSidebarKey.value = e.target.value
    setCurrTreeData()
  }

  // 添加顶级侧栏
  const addTopSidebar = () => {
    // 实现添加顶级侧栏的逻辑
  }

  // 识别侧栏
  const recognitionSidebar = async () => {
    if (emptySubDirText.value !== '') {
      ToastError(emptySubDirText.value)
      return
    }

    if (currSelectSidebarKey.value == '') {
      ToastError(lang('pageSidebar.selectSidebarTip'))
      return
    }

    let baseDir = await PathJoin([storeVpConfig.srcDir, currSelectSidebarKey.value])
    let treeData = await ParseTreeData(baseDir)

    if (!treeData) {
      ToastError(
        `${lang('pageSidebar.recognitionWarning2')}${baseDir}${lang('pageSidebar.existFile')}`
      )
    } else {
      // 实现侧栏数据转换和保存的逻辑
    }
  }

  // 保存侧栏
  const saveSidebar = () => {
    // 实现保存侧栏配置的逻辑
  }
</script>
