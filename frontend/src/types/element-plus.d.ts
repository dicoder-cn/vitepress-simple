declare module "element-plus" {
  import { Component } from "vue";

  export const ElButton: Component;
  export const ElEmpty: Component;
  export const ElMessage: {
    success(message: string): void;
    error(message: string): void;
    warning(message: string): void;
    info(message: string): void;
  };
  export const ElInput: Component;
  export const ElIcon: Component;
}

declare module "@element-plus/icons-vue" {
  import { Component } from "vue";

  export const Folder: Component;
  export const Document: Component;
}
