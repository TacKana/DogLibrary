import { app, dialog, shell } from 'electron'
import electronUpdater, { type AppUpdater } from 'electron-updater'

export class UpdaterManager {
  updater: AppUpdater
  constructor() {
    const { autoUpdater } = electronUpdater
    this.updater = autoUpdater
  }
  initialize(): void {
    this.updater.autoDownload = false
    this.updater.allowPrerelease = false // 是否更新到预发布版
    this.updater.allowDowngrade = false // 是否允许降级
    this.updater.autoInstallOnAppQuit = false

    // 用于开发环境调试
    if (!app.isPackaged) {
      this.updater.forceDevUpdateConfig = true
    }

    // 监听更新事件
    this.updater.on('update-available', () => this.updateAvailable())
    this.updater.on('update-not-available', () => this.updateNotAvailable())
    this.updater.on('error', (err: Error) => this.updateError(err))
    this.updater.on('update-downloaded', () => this.updateDownloaded())
    this.checkForUpdates()
  }

  /**
   * 检查是否有可用更新
   *
   * 该方法会触发更新检查流程，与远程服务器通信
   * 以确定是否存在新版本的应用程序
   */
  async checkForUpdates(): Promise<void> {
    this.updater.checkForUpdates()
  }

  // 有更新时的回调
  updateAvailable(): void {
    dialog
      .showMessageBox({
        title: '狗库发布新版本啦',
        message: '新版本带来了更好的体验，需要更新吗？',
        type: 'info',
        icon: '../../../../resources/icon.png',
        buttons: ['更新', '官网下载', '本次忽略'],
        cancelId: 2,
      })
      .then((res) => {
        console.log(res)
        switch (res.response) {
          case 0:
            this.updater.downloadUpdate() // 更新
            break
          case 1:
            shell.openExternal('https://dog.xuxo.top')
            break
          default:
            break
        }
      })
  }

  // 没有更新时的回调
  updateNotAvailable(): void {
    dialog.showMessageBox({
      title: '你已经是最新版本啦！',
      message: '无需更新',
      type: 'none',
      buttons: ['关闭'],
    })
  }

  // 更新过程中发生错误的回调
  updateError(err: Error): void {
    const errStr = JSON.stringify(err.stack)
    dialog
      .showMessageBox({
        title: '更新出错！！！',
        message: '请截屏本窗口完整内容找开发者反馈',
        detail: errStr,
        type: 'error',
        buttons: ['前往官网', '忽略'],
        cancelId: 1,
      })
      .then((res) => {
        switch (res.response) {
          case 0:
            shell.openExternal('https://dog.xuxo.top')
            break
          default:
            break
        }
      })
  }

  // 下载完成后执行的回调
  updateDownloaded(): void {
    dialog
      .showMessageBox({
        message: '已准备就绪重启以应用更新',
        title: '已准备就绪重启以应用更新',
        type: 'info',
        buttons: ['重启'],
        cancelId: 0,
      })
      .then((res) => {
        switch (res.response) {
          case 0:
            this.restartApp()
            break
          default:
            break
        }
      })
  }

  // 重启应用
  restartApp(): void {
    setTimeout(() => {
      this.updater.quitAndInstall()
    }, 2000) // 给一些时间处理下载完毕后的清理
  }
}
