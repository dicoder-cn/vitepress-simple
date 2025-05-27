import { LocaleSpecificConfig, UserConfig } from "vitepress";
import { DefaultTheme } from "vitepress";

export type VpConfig = Partial<UserConfig<DefaultTheme.Config>> & {
  // 可以添加自定义的配置项
  vpsimple?: VPSimpleConfig;
};

export type VpConfigLang = Partial<LocaleSpecificConfig<DefaultTheme.Config> & { label: string; link?: string }>;
export interface VPSimpleConfig {
  shellBaseDir: string;
  gitBaseDir: string; // git  仓库根目录
  cmdDocsDev: string;
  cmdDocsBuild: string;
  cmdNpmInstall: string;
  cmdGitInit: string;
  cmdGitPull: string;
  cmdGitAdd: string;
  cmdGitCommit: string;
  cmdGitPush: string;
}
