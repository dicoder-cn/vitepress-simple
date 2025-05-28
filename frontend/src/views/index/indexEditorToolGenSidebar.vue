

<template>
    <div>
       
    </div>
</template>

<script setup lang="ts">


import { useVpconfigStore } from '@/store/vpconfig';
import { onMounted } from 'vue';
import { ParseToTree } from 'wailsjs/go/docparse/ParseService';
import { docparse } from 'wailsjs/go/models';

const storeVpconfig= useVpconfigStore()
onMounted(()=>{
    ParseToTree(storeVpconfig.FullSrcLangDir).then((treeData:docparse.DocsTreeNode)=>{

    })
})
</script>