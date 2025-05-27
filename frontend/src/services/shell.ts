import { ToastCheck } from "@/utils/Toast";
import AnsiToHtml from "ansi-to-html";
import { IsEmptyValue } from "@/utils/utils";
import { CreateShell, RunCmd, RunCmdBySystem, StopShell } from "../../wailsjs/go/shell/ShellManager";
import { shell } from "../../wailsjs/go/models";
import NotifyShellData = shell.NotifyShellData;

type MessageCallback = (messages: Record<number, string>) => void;

export class ShellService {
  private messages: Record<number, string> = {};
  private errors: Record<number, string> = {};
  private messageCallbacks: Set<MessageCallback> = new Set();

  // 订阅消息更新
  subscribe(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);
    // 立即通知当前状态
    callback(this.messages);
    // 返回取消订阅的函数
    return () => {
      this.messageCallbacks.delete(callback);
    };
  }

  // 通知所有订阅者
  private notifySubscribers(): void {
    this.messageCallbacks.forEach((callback) => callback(this.messages));
  }

  // 创建并运行命令
  async createShellAndRun(baseDir: string, cmd: string, isAlone: boolean): Promise<number> {
    const shellIndex = await CreateShell();
    if (!isAlone) {
      this.setContent(shellIndex, `${cmd}\n`);
    }

    RunCmd(baseDir, cmd, shellIndex, isAlone).then((r: any) => {
      ToastCheck(r, "");
    });
    return shellIndex;
  }

  // 创建系统shell并运行命令
  async createSystemShellAndRun(baseDir: string, cmd: string): Promise<number> {
    const shellIndex = await CreateShell();
    this.setContent(shellIndex, `${cmd}\n`);
    RunCmdBySystem(baseDir, cmd, shellIndex).then((r) => {
      // 处理系统shell运行结果
    });
    return shellIndex;
  }

  // 停止命令
  async stopCmd(index: number): Promise<void> {
    const res = await StopShell(index);
    ToastCheck(res);
  }

  // 设置内容
  setContent(index: number, content: string): void {
    if (IsEmptyValue(this.messages[index])) {
      this.messages[index] = "";
    }
    this.messages[index] += content;
    this.notifySubscribers();
  }

  // 处理shell通知
  handlerShellNotify(data: NotifyShellData): void {
    const index = data.shell_index ?? 0;
    if (IsEmptyValue(data.content)) {
      return;
    }
    this.setContent(index, `${data.content}`);
    if (data.is_error) {
      this.errors[index] = this.errors[index] ?? "" + `${data.content}`;
    }
  }

  // 获取消息
  getMessages(): Record<number, string> {
    return this.messages;
  }

  // 获取错误
  getErrors(): Record<number, string> {
    return this.errors;
  }

  // 清除消息
  clearMessages(): void {
    this.messages = {};
    this.errors = {};
    this.notifySubscribers();
  }
}

// 导出单例
export const shellService = new ShellService();
