export interface ProjectInfo {
  title: string; // 项目名称
  description: string; // 项目描述
  // identifier: string; // 项目标识
  dir: string; // 项目目录
  fullDir: string; // 项目完整目录
  docDir: string; // 存放文档文档目录
  createdAt: string; // 创建时间
  version?: string; // 版本号，可选
}

export interface ProjectCreate extends ProjectInfo {
  version?: string; // 版本号，可选
}
