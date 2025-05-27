import { defineStore } from 'pinia'
import Vditor from 'vditor'
import { ToastError, ToastInfo, ToastSuccess } from '@/utils/Toast'
import { ParseTreeData, WriteFileContent } from '../../wailsjs/go/services/ArticleTreeData'
import { dto } from '../../wailsjs/go/models'
import { getDirectoryPath } from '@/utils/file'
import {
  ConfigSet,
  GetCurrVersion,
  GetSystemType,
  PathExists,
  PathJoin,
} from '../../wailsjs/go/system/SystemService'
import {
  ConfigKeyFrontMatterSaveType,
  ConfigKeyProjectDir,
  ConfigKeySysProjectStaticDirName,
  ConfigKeySysStaticServerPort,
} from '@/configs/appConfigKey'
import { useVpconfigStore } from '@/store/vpconfig'
import { getFileNameFromPath, IsEmptyValue } from '@/utils/utils'
import { VitePressHome } from '@/types/home'
import { moveTo } from '@/utils/system'
import { defaultFrontMatter } from '@/configs/defaultFrontMatter'
import { useHistoryStore } from '@/store/history'
import { isEmptyArray } from '@/utils/array'
// @ts-ignore
import yaml from 'js-yaml'
import { replaceImageUrlToLocalStatic } from '@/utils/repalceStatic'
import { StartStaticServer } from '../../wailsjs/go/services/StaticServer'
import { useShellStore } from '@/store/shell' // 浏览器环境（需确保构建工具已正确处理）
import { AppConfig } from './appconfig'

//定义首页的数据类型
export interface indexStore {
  articleTreeData: dto.TreeNode[] | null
  // vditor: Vditor | null;
  expandKeys: string[]
  selectKeys: string[]
  currCopyPath: string
  searchValue: string //搜索值
  currHomeConfig?: VitePressHome //当前主页配置
  currProjectDir: string //当前项目的根目录
  currDocDir: string //文档所在目录
  IsEmptyProject: boolean //是否为空项目
  systemType: string //系统类型
  version: string //系统类型
  staticServerPort: string
  staticBaseDir: string
}

export const useIndexStore = defineStore('index', {
  state: (): indexStore => ({
    articleTreeData: null,
    // vditor: null,
    currProjectDir: '',
    currDocDir: '',
    expandKeys: [],
    selectKeys: [],
    systemType: '',
    version: '',
    IsEmptyProject: true, //是否为空项目
    searchValue: '', //搜索值
    staticBaseDir: 'vpstatic',
    staticServerPort: '9874',
    currCopyPath: '', //当前剪切路径
  }),
  //定义actions
  actions: {
    async loadTreeData() {
      const cfg = useVpconfigStore()
      await cfg.formatPath() //获取项目目录

      if (await cfg.ExistsProjectDir()) {
        await cfg.readVpConfig() //读取配置 以及组装路径
        this.articleTreeData = await ParseTreeData(cfg.srcDir)
      }
    },
    //获取系统类型
    async getSystemType() {
      this.systemType = await GetSystemType()
    },
    async getVersion() {
      this.version = await GetCurrVersion()
    },
    //获取静态端口
    async getStaticPort() {
      this.staticServerPort = AppConfig.getString(ConfigKeySysStaticServerPort)
    },
    async getStaticDir() {
      this.staticBaseDir = AppConfig.getString(ConfigKeySysProjectStaticDirName)
    },
    async checkProjectDir(dir: string): Promise<string> {
      //判空
      if (dir == '') {
        return '不能切换为空路径项目'
      }
      //判断兖是否存在
      const isExists = await PathExists(dir)
      if (!isExists) {
        useHistoryStore().remove(dir)
        return '项目路径不存在:' + dir
      }
      //判断是否是.vitepress目录
      const vitePressDir = await PathJoin([dir, '.vitepress'])
      const isExistsVpDir = await PathExists(vitePressDir)
      if (!isExistsVpDir) {
        return `切换失败，所选路径${dir}不存在"vitepress"文件夹`
      }
      return ''
    },
    //切换项目
    async changeProject(dir: string) {
      //先检查传入的项目目录是否合法
      const checkString = await this.checkProjectDir(dir)
      if (checkString != '') {
        ToastError(checkString)
        return
      }
      ToastSuccess(`当前打开项目："${dir}"`)
      this.IsEmptyProject = false //设置为非空项目
      await useHistoryStore().add(dir) //加入到历史项目数据中
      //设置当前的项目路径
      await ConfigSet(ConfigKeyProjectDir, dir)
      await StartStaticServer('') //启动静态服务器
      // this.clearCurrData();
      await this.loadTreeData()
      useShellStore().loadVpSimpleConfig()
    },

    moveTo(path: string, target: string) {
      moveTo(path, getDirectoryPath(target)).then(() => {
        this.loadTreeData()
      })
    },

    setCurrCutPath(path: string) {
      this.currCopyPath = path
    },
  },
  getters: {
    //大驼峰命名法
    ArticleTreeData: (state) => state.articleTreeData,
    ExpandKeys: (state) => state.expandKeys,
    SelectKeys: (state) => state.selectKeys,
    CurrCutPath: (state) => state.currCopyPath,

    CurrProjectDir: (state) => state.currProjectDir,
    // IsEmptyProject: (state) => isEmptyArray(state.articleTreeData),
    IsEmptyTreeData: (state) => isEmptyArray(state.articleTreeData),
    // CurrArticleTitle: (state) =>
    // getFileNameFromPath(state.currArticlePath).replaceAll(".md", ""),
    // GetArticleFrontMatter: (state) => state.currArticleFrontMatter,
  },
})
