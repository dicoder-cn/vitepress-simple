import { DefaultTheme, UserConfig } from "./vpconfig/dist/node/vp";
import { LocaleSpecificConfig } from "./vpconfig/types";

export type VpConfig = Partial<UserConfig<DefaultTheme.Config>> & {
  // 可以添加自定义的配置项
  extra?: VpConfigExtra;
};

export type VpConfigLang = LocaleSpecificConfig<DefaultTheme.Config> & { label: string; link?: string };
//扩展配置
export interface VpConfigExtra {}

//项目配置
export interface VPSimpleConfig {
  srcDir: string; //源文档目录（相对路径）
  fullDir: string; //项目的完整路径
}
