import { defineStore } from "pinia";

import { ToastCheck } from "@/utils/Toast";
import AnsiToHtml from "ansi-to-html";
import { IsEmptyValue } from "@/utils/utils";
import { CreateShell, RunCmd, RunCmdBySystem, StopShell } from "../../wailsjs/go/shell/ShellManager";
import { shell } from "../../wailsjs/go/models";
import NotifyShellData = shell.NotifyShellData;

export interface shellStore {
  // currShellIndex: number;
  messages: Record<number, string>;
  errors: Record<number, string>;
}

export const useShellStore = defineStore("shell", {
  state: (): shellStore => ({
    messages: {},
    errors: {}
  }),
  actions: {
    loadVpSimpleConfig() {},
    async createShellAndRun(baseDir: string, cmd: string, isAlone: boolean) {
      const shellIndex = await CreateShell();
      if (!isAlone) {
        this.setContent(shellIndex, `${cmd}\n`);
      }

      RunCmd(baseDir, cmd, shellIndex, isAlone).then((r: any) => {
        ToastCheck(r, "");
      });
      return shellIndex;
    },
    async createSystemShellAndRun(baseDir: string, cmd: string) {
      const shellIndex = await CreateShell();
      this.setContent(shellIndex, `${cmd}\n`);
      RunCmdBySystem(baseDir, cmd, shellIndex).then((r) => {
        ToastCheck(r, "");
      });
      return shellIndex;
    },
    stopCmd(index: number) {
      StopShell(index).then((res: string) => {
        ToastCheck(res);
      });
    },
    setContent(index: number, content: string) {
      if (IsEmptyValue(this.messages[index])) {
        this.messages[index] = "";
      }
      this.messages[index] += content;
    },
    handlerShellNotify(data: NotifyShellData) {
      const index = data.shell_index ?? 0;
      // this.currShellIndex = index;
      //把ANSI转义序列转换成HTML格式，以便在网页上正确显示
      data.content = new AnsiToHtml().toHtml(data.content ?? "");
      if (IsEmptyValue(data.content)) {
        return;
      }
      this.setContent(index, `${data.content}`);
      if (data.is_error) {
        this.errors[index] = this.errors[index] ?? "" + `${data.content}`;
      }
      // console.log(this.currShellIndex, "currShellIndex");
    }
  },
  getters: {}
});
