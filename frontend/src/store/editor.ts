import { defaultFrontMatter } from "@/configs/defaultFrontMatter";
import { ConfigKeyFrontMatterSaveType } from "@/configs/appConfigKey";
import { parseTagContent, regexScript, regexStyle } from "@/utils/parse";
import { replaceImageUrlToLocalStatic, replaceLocalStaticToImageUrl } from "@/utils/repalceStatic";
import { ToastError, ToastInfo } from "@/utils/Toast";
import { getFileNameFromPath, IsEmptyValue } from "@/utils/utils";
import matter from "gray-matter";
import { defineStore } from "pinia";
import { ReadFileContent, WriteFileContent } from "wailsjs/go/services/ArticleTreeData";
import { AppConfig } from "@/store/appconfig";
// @ts-ignore
import yaml from "js-yaml";
import { watch } from "vue";
import { Modal } from "ant-design-vue";
import { lang } from "@/utils/language";
import { DateUtil } from "@/utils/date";
//这是一个简单的推荐store案例，可以在这里定义你的状态
//新建pinia时把editor全局替换成你的store名字

//文章内容=frontMatter+mdContent+vueContent
interface ArticleContent {
  isSave: boolean;
  frontMatter: any;
  scriptContent: string; //占位
  styleContent: string; //占位
  vueContent: string; //= scriptContent + styleContent
  isNewFile: boolean; //是否新建文章，不属于的话意着是打开旧的文章
  path: string; //文章路径
  mdContent: string; //=frontMatter+mdContent
}

export interface editorStore {
  currArticleIndex: number;
  currArticle: ArticleContent;
  articleLists: ArticleContent[];
  //vditor实例
  // vditor: any | null;
}

export const useEditorStore = defineStore("editor", {
  state: (): editorStore => ({
    currArticleIndex: -1, // 初始化为 -1 表示没有选中任何文章
    currArticle: {} as ArticleContent,
    articleLists: [] as ArticleContent[]
    // vditor: null,
  }),
  actions: {
    // 初始化监听器
    initWatcher() {
      let isInitializing = true; // 添加初始化标志
      // 监听文章切换
      watch(
        () => this.currArticle.path,
        () => {
          isInitializing = true; // 切换文章时重置标志
          setTimeout(() => {
            isInitializing = false;
          }, 100);
        }
      );

      // 监听 mdContent
      watch(
        () => this.currArticle.mdContent,
        (newVal, oldVal) => {
          if (!isInitializing && this.currArticle.path && newVal !== oldVal) {
            this.currArticle.isSave = false;
            if (this.currArticleIndex >= 0) {
              this.articleLists[this.currArticleIndex].isSave = false;
            }
          }
        }
      );

      // 监听 frontMatter
      watch(
        () => this.currArticle.frontMatter,
        (newVal, oldVal) => {
          if (!isInitializing && this.currArticle.path && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.currArticle.isSave = false;
            if (this.currArticleIndex >= 0) {
              this.articleLists[this.currArticleIndex].isSave = false;
            }
          }
        },
        { deep: true }
      );

      // 监听 vueContent
      watch(
        () => this.currArticle.vueContent,
        (newVal, oldVal) => {
          if (!isInitializing && this.currArticle.path && newVal !== oldVal) {
            this.currArticle.isSave = false;
            if (this.currArticleIndex >= 0) {
              this.articleLists[this.currArticleIndex].isSave = false;
            }
          }
        }
      );

      // 延迟关闭初始化标志
      setTimeout(() => {
        isInitializing = false;
      }, 100);
    },

    //更新文章保存状态
    updateArticleSaveStatus(index: number, status: boolean) {
      if (index >= 0 && index < this.articleLists.length) {
        this.articleLists[index].isSave = status;
        if (this.currArticleIndex === index) {
          this.currArticle.isSave = status;
        }
      }
    },

    //切换当前打开的文章
    changeCurrArticleIndex(index: number) {
      if (!Array.isArray(this.articleLists)) {
        this.articleLists = [];
        return;
      }
      // 确保索引有效
      if (index < 0 || index >= this.articleLists.length) {
        return;
      }
      // 更新当前文章索引和内容
      this.currArticleIndex = index;
      this.currArticle = this.articleLists[index];
    },
    //打开文章
    openArticle(path: string, isNewFile = false) {
      if (!Array.isArray(this.articleLists)) {
        this.articleLists = [];
      }

      let articleIndex = this.articleLists.findIndex((item) => item?.path === path);
      if (articleIndex !== -1) {
        //存在
        this.changeCurrArticleIndex(articleIndex);
      } else {
        //最大不能打开超过6个文章
        if (this.articleLists.length >= 8) {
          ToastError("最多只能打开8篇文章");
          return;
        }
        const openArticle: ArticleContent = this.getDefaultArticle();
        openArticle.path = path;
        openArticle.isNewFile = isNewFile;
        this.articleLists.push(openArticle);
        articleIndex = this.articleLists.length - 1;
      }

      this.preHandlerOpenArticle(path, articleIndex); //预处理打开文章
      this.changeCurrArticleIndex(articleIndex);
    },
    getDefaultArticle(): ArticleContent {
      return {
        isSave: true,
        isNewFile: false,
        frontMatter: {},
        scriptContent: "",
        styleContent: "",
        vueContent: "",
        path: "",
        mdContent: ""
      };
    },
    //打开文章前处理
    async preHandlerOpenArticle(path: string, articleIndex: number) {
      const content = await ReadFileContent(path);
      // const isNewFile = content == "";

      const matterData = matter(content);
      const matchScriptArray = parseTagContent(matterData.content ?? "", regexScript);
      const matchStyleArray = parseTagContent(matterData.content ?? "", regexStyle);
      const scriptContent = matchScriptArray[0] ?? "";
      const styleContent = matchStyleArray[0] ?? "";
      const vueContent = (scriptContent + "\n" + styleContent).trim();
      //matter字符串
      this.articleLists[articleIndex].scriptContent = scriptContent;
      this.articleLists[articleIndex].styleContent = styleContent;
      this.articleLists[articleIndex].frontMatter = matterData.data;
      this.articleLists[articleIndex].vueContent = vueContent;
      let mdContent = (matterData.content ?? "").replace(scriptContent, "").replace(styleContent, "");
      mdContent = mdContent ? mdContent : `# ${getFileNameFromPath(path)}`;
      //初始化文章的front matter
      this.initArticleFrontMatter(articleIndex);
      //相对路径转换成 域名替换
      const replaceMdContent = replaceLocalStaticToImageUrl(mdContent);
      this.articleLists[articleIndex].mdContent = replaceMdContent;
      //设置当前上下文
      this.changeCurrArticleIndex(articleIndex);
      console.log(this.currArticle, "currArticle -- console.log");
    },

    //设置当前文章front matter
    initArticleFrontMatter(articleIndex: number) {
      //当前文章的front matter
      const articleFrontMatter = this.articleLists[articleIndex].frontMatter;

      //设置默认的front matter
      for (const key in defaultFrontMatter) {
        if (IsEmptyValue(articleFrontMatter[key])) {
          articleFrontMatter[key] = defaultFrontMatter[key];
        }
      }

      if (this.articleLists[articleIndex].isNewFile) {
        //标题
        articleFrontMatter["title"] = getFileNameFromPath(this.articleLists[articleIndex].path);
        //创建时间
        articleFrontMatter["createAt"] = DateUtil.getFormatDate(new Date().toISOString());
      }

      console.log(articleFrontMatter, "articleFrontMatter -- console.log");
    },
    //关闭文章
    async closeArticle(path: string) {
      if (!Array.isArray(this.articleLists)) {
        this.articleLists = [];
        return;
      }
      const articleIndex = this.articleLists.findIndex((item) => item?.path === path);
      if (articleIndex === -1) return;

      const article = this.articleLists[articleIndex];

      // 如果文章未保存，显示确认弹窗
      if (!article.isSave) {
        return new Promise((resolve) => {
          Modal.confirm({
            title: lang("common.tips"),
            content: lang("pageIndex.closeUnsavedTip"),
            okText: lang("common.confirm"),
            cancelText: lang("common.cancel"),
            okButtonProps: {
              type: "primary",
              danger: true
            },
            async onOk() {
              // 用户确认关闭
              const store = useEditorStore();
              store.doCloseArticle(articleIndex);
              resolve(true);
            },
            onCancel() {
              resolve(false);
            }
          });
        });
      } else {
        // 文章已保存，直接关闭
        this.doCloseArticle(articleIndex);
      }
    },

    // 执行实际的关闭操作
    doCloseArticle(articleIndex: number) {
      this.articleLists.splice(articleIndex, 1);

      // 如果关闭的是当前文章，需要更新当前文章索引
      if (this.currArticleIndex === articleIndex) {
        // 如果还有其他文章，选择最后一篇
        if (this.articleLists.length > 0) {
          this.changeCurrArticleIndex(this.articleLists.length - 1);
        } else {
          // 如果没有文章了，重置状态
          this.currArticleIndex = -1;
          this.currArticle = {} as ArticleContent;
        }
      } else if (this.currArticleIndex > articleIndex) {
        // 如果关闭的文章在当前文章之前，需要更新索引
        this.currArticleIndex--;
      }
    },

    //保存文章
    async saveArticle(articleIndex: number, showToast = true) {
      if (!Array.isArray(this.articleLists)) {
        this.articleLists = [];
        return;
      }
      const articleItem = this.articleLists[articleIndex];

      console.log(articleItem.frontMatter, "articleItem.frontMatter -- console.log");
      //更新时间
      articleItem.frontMatter.updateAt = DateUtil.getFormatDate(new Date().toISOString());

      const saveType = AppConfig.getString(ConfigKeyFrontMatterSaveType);
      let fontMatterString = "";
      if (saveType == "yaml") {
        //默认
        fontMatterString = yaml.dump(articleItem.frontMatter);
      } else {
        fontMatterString = JSON.stringify(articleItem.frontMatter, null, 4);
      }
      let fullContent = `---\n${fontMatterString}\n---\n${articleItem.mdContent}\n${articleItem.vueContent}`;

      //替换域名为本地路径
      fullContent = replaceImageUrlToLocalStatic(fullContent);

      //获取动态新增的数据
      WriteFileContent(articleItem.path, fullContent).then(() => {
        if (showToast) ToastInfo("已保存");
        this.articleLists[articleIndex].isNewFile = false; //保存后默认不属于新文章
        if (this.currArticleIndex === articleIndex) {
          this.currArticle.isSave = true;
        }
        this.articleLists[articleIndex].isSave = true;
      });
    },

    //保存所有文章
    saveAllArticle() {
      if (!Array.isArray(this.articleLists)) {
        this.articleLists = [];
        return;
      }
      this.articleLists.forEach((item, index) => {
        if (item && !item.isSave) {
          this.saveArticle(index, false);
        }
      });
    },

    setCurrFrontMatterValue(path: (string | number)[], value: any, defaultValue?: any) {
      if (!this.currArticle || !this.currArticle.frontMatter) return;
      let obj = this.currArticle.frontMatter;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (typeof path[i + 1] === "number") {
          if (!Array.isArray(obj[key])) obj[key] = defaultValue && Array.isArray(defaultValue[key]) ? [...defaultValue[key]] : [];
        } else {
          if (typeof obj[key] !== "object" || obj[key] === null) obj[key] = {};
        }
        obj = obj[key];
      }
      obj[path[path.length - 1]] = value;
    }
  },
  getters: {
    isOpenArticle: (state): boolean => state.articleLists.length > 0 && state.currArticleIndex >= 0,
    getCurrArticleIndex: (state): number => state.currArticleIndex,
    getCurrArticle: (state): ArticleContent => state.currArticle,
    getArticleContents: (state): ArticleContent[] => (Array.isArray(state.articleLists) ? state.articleLists : []),
    // 获取当前文章 frontMatter 的值
    getCurrFrontMatterValue: (state) => {
      // path: 属性路径数组，如 ['title']，defaultValue: 默认值
      const getValue = (path: string[], defaultValue: any = "") => {
        if (!state.currArticle || !state.currArticle.frontMatter) return defaultValue;
        let current = state.currArticle.frontMatter as any;
        for (const key of path) {
          if (!current || typeof current !== "object") return defaultValue;
          current = current[key];
        }
        return current ?? defaultValue;
      };
      return getValue;
    }
  }
});
