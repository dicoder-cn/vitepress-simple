import { CustomConfig } from "./custom";
import { VpSimpleConfig } from "./vpsimple";
import { PluginsConfig } from "./plugins";

export default {
  ...VpSimpleConfig,//来自软件vpsimple自动写入的配置
  ...PluginsConfig,//plugins import
  ...CustomConfig// customer config优先级更大
};
