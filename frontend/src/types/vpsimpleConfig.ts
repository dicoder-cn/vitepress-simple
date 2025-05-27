import { DefaultTheme, UserConfig } from "./vpconfig/dist/node/vp";
import { LocaleSpecificConfig } from "./vpconfig/types";

export type VpConfig = Partial<UserConfig<DefaultTheme.Config>> & {
  // 可以添加自定义的配置项
  vpsimple?: VPSimpleConfig;
};

export type VpConfigLang = LocaleSpecificConfig<DefaultTheme.Config> & { label: string; link?: string };
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
