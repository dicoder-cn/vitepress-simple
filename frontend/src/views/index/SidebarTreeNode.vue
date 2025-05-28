<template>
  <div class="sidebar-tree-node">
    <div class="node-content">
      <div v-if="node.children" class="folder-node">
        <el-icon class="folder-icon"><folder /></el-icon>
        <el-input v-model="nodeData.text" placeholder="目录名称" class="text-input" @change="updateNode"/>
      </div>
      <div v-else class="file-node">
        <el-icon class="file-icon"><document /></el-icon>
        <el-input v-model="nodeData.text" placeholder="文档标题" class="text-input" @change="updateNode"/>
        <el-input v-model="nodeData.link" placeholder="链接路径" class="link-input" @change="updateNode"/>
      </div>
    </div>
    
    <div v-if="node.children && node.children.length > 0" class="node-children">
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
import { ref, defineProps, defineEmits, computed } from 'vue';
import { ElInput, ElIcon } from 'element-plus';
import { Folder, Document } from '@element-plus/icons-vue';

// 定义节点类型
interface TreeNode {
  title: string;
  path: string;
  children?: TreeNode[];
  text: string;
  link: string;
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

// 更新节点
const updateNode = () => {
  const updatedNode = {
    ...props.node,
    text: nodeData.value.text,
    link: nodeData.value.link
  };
  emit('update:node', updatedNode);
};

// 处理子节点更新
const handleChildUpdate = (childNode: TreeNode) => {
  // 找到子节点并更新它
  if (props.node.children) {
    const updatedChildren = [...props.node.children];
    const childIndex = updatedChildren.findIndex(child => child.path === childNode.path);
    
    if (childIndex !== -1) {
      updatedChildren[childIndex] = childNode;
      
      // 创建更新后的父节点
      const updatedNode = {
        ...props.node,
        children: updatedChildren
      };
      
      // 发送更新事件
      emit('update:node', updatedNode);
    }
  }
};
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

.text-input {
  flex: 1;
  margin-right: 8px;
}

.link-input {
  flex: 1;
}

.node-children {
  margin-left: 24px;
  padding-left: 8px;
  border-left: 1px dashed #ebeef5;
}
</style> 