<template>
  <div class="sidebar-tree-node">
    <div class="node-content" :class="{ clickable: hasChildren }" @click="toggleCollapse">
      <div v-if="hasChildren" class="folder-node">
        <el-icon class="folder-icon">
          <component :is="collapsed ? 'Folder' : 'Folder'" />
        </el-icon>
        <span class="folder-title">{{ nodeData.text }}</span>
        <span class="arrow" :class="{ collapsed }">
          <svg width="12" height="12" viewBox="0 0 24 24"><path d="M8 10l4 4 4-4" stroke="#999" stroke-width="2" fill="none"/></svg>
        </span>
      </div>
      <div v-else class="file-node">
        <el-icon class="file-icon"><Document /></el-icon>
        <label class="input-label">标题：</label>
        <el-input v-model="nodeData.text" placeholder="文档标题" class="text-input" @change.stop="updateNode"/>
        <label class="input-label">链接：</label>
        <el-input v-model="nodeData.link" placeholder="链接路径" class="link-input" @change.stop="updateNode"/>
      </div>
    </div>
    <div v-if="hasChildren && !collapsed" class="node-children">
      <sidebar-tree-node 
        v-for="child in node.children" 
        :key="child.path" 
        :node="child"
        @update:node="handleChildUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from 'vue';
import { ElInput, ElIcon } from 'element-plus';
import { Folder, Document } from '@element-plus/icons-vue';

// 定义节点类型
interface TreeNode {
  title: string;
  path: string;
  children?: TreeNode[];
  text: string;
  link: string;
  collapsed?: boolean;
}

const props = defineProps<{
  node: TreeNode
}>();

const emit = defineEmits<{
  (e: 'update:node', node: TreeNode): void
}>();

// 创建本地节点数据的副本，以便于编辑
const nodeData = ref({
  text: props.node.text,
  link: props.node.link
});

const collapsed = ref(props.node.collapsed !== false); // 默认收起

const hasChildren = computed(() => Array.isArray(props.node.children) && props.node.children.length > 0);

watch(() => props.node.text, val => { nodeData.value.text = val; });
watch(() => props.node.link, val => { nodeData.value.link = val; });

function toggleCollapse() {
  if (!hasChildren.value) return;
  collapsed.value = !collapsed.value;
}

function updateNode() {
  const updatedNode = {
    ...props.node,
    text: nodeData.value.text,
    link: nodeData.value.link,
    collapsed: collapsed.value
  };
  emit('update:node', updatedNode);
}

function handleChildUpdate(childNode: TreeNode) {
  if (props.node.children) {
    const updatedChildren = [...props.node.children];
    const childIndex = updatedChildren.findIndex(child => child.path === childNode.path);
    if (childIndex !== -1) {
      updatedChildren[childIndex] = childNode;
      const updatedNode = {
        ...props.node,
        children: updatedChildren,
        collapsed: collapsed.value
      };
      emit('update:node', updatedNode);
    }
  }
}
</script>

<style scoped>
.sidebar-tree-node {
  margin-bottom: 8px;
}

.node-content {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
}

.node-content.clickable:hover {
  background: #f5f7fa;
}

.folder-node, .file-node {
  display: flex;
  align-items: center;
  width: 100%;
}

.folder-icon, .file-icon {
  margin-right: 8px;
  color: #909399;
}

.folder-title {
  flex: 1;
  margin-right: 8px;
  font-weight: 500;
  color: #333;
  user-select: text;
}

.input-label {
  margin: 0 4px 0 0;
  color: #666;
  font-size: 13px;
  align-self: center;
}

.text-input {
  flex: 1;
  margin-right: 8px;
}

.link-input {
  flex: 1;
}

.arrow {
  display: flex;
  align-items: center;
  margin-left: 4px;
  transition: transform 0.2s;
}
.arrow.collapsed {
  transform: rotate(-90deg);
}

.node-children {
  margin-left: 24px;
  padding-left: 8px;
  border-left: 1px dashed #ebeef5;
}
</style> 