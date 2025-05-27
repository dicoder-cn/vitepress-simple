import {
  ConfigKeyProjectDir,
  ConfigKeyIsStartup,
  ConfigKeySysUpdateSource,
  ConfigKeyHistoryProject,
  ConfigKeyLayoutNavBgColor,
  ConfigKeyChangeAutoSave,
  ConfigKeyFrontMatterSaveType,
  ConfigKeySysStaticServerPort,
  ConfigKeySysProjectStaticDirName,
  ConfigKeyVditorCdn,
  ConfigKeyLang,
  ConfigKeySysProgramIsOpen,
  ConfigKeyEditorType,
  ConfigKeyGitBaseDir,
  ConfigKeyCmdDocsDev,
  ConfigKeyCmdDocsBuild,
  ConfigKeyCmdNpmInstall,
  ConfigKeyCmdGitInit,
  ConfigKeyCmdGitPull,
  ConfigKeyCmdGitAdd,
  ConfigKeyCmdGitCommit,
  ConfigKeyCmdGitPush
} from "@/configs/appConfigKey";

export class editorType {
  public static Vditor: string = "vditor";
  public static MdEditorV3: string = "md-editor-v3";
}

//默认配置
export const appConfigDefault: Record<string, any> = {
  [ConfigKeyIsStartup]: "no", //是否开机启动
  [ConfigKeyProjectDir]: "", //项目目录
  [ConfigKeySysUpdateSource]: "github", //自动更新源
  [ConfigKeyHistoryProject]: "[]", //历史项目
  [ConfigKeyLayoutNavBgColor]: "#ebebeb", //左侧导航栏背景颜色
  [ConfigKeyChangeAutoSave]: "no", //切换文件时自动保存
  [ConfigKeyFrontMatterSaveType]: "json", //frontMatter保存格式
  [ConfigKeySysStaticServerPort]: "9874", //项目的静态资源（图片）服务器端口
  [ConfigKeySysProjectStaticDirName]: "static", //项目静态资源目录名
  [ConfigKeyVditorCdn]: "zstatic", //Vditor CDN
  [ConfigKeyLang]: "zh-Hans", //语言
  [ConfigKeySysProgramIsOpen]: "no", //程序是否打开
  [ConfigKeyEditorType]: editorType.MdEditorV3, //默认编辑器
  [ConfigKeyGitBaseDir]: "", //git运行目录
  [ConfigKeyCmdDocsDev]: "npm run docs:dev", //启动文档开发服务
  [ConfigKeyCmdDocsBuild]: "npm run docs:build", //打包文档
  [ConfigKeyCmdNpmInstall]: "npm install", //启动文档服务
  [ConfigKeyCmdGitInit]: "git init", //git init
  [ConfigKeyCmdGitPull]: "git pull", //git pull
  [ConfigKeyCmdGitAdd]: "git add .", //git add .
  [ConfigKeyCmdGitCommit]: "git commit -m 'autoupdate'", //git commit
  [ConfigKeyCmdGitPush]: "git push" //git push
};
