import { dialog, shell, WebContentsView } from 'electron'
import electronUpdater, { type AppUpdater } from 'electron-updater'
import { webContents } from 'electron/main'

export class UpdaterManager {
  updater: AppUpdater
  constructor() {
    const { autoUpdater } = electronUpdater
    this.updater = autoUpdater
  }
  initialize() {
    this.updater.autoDownload = false
    this.updater.allowPrerelease = false // 是否更新到预发布版
    this.updater.allowDowngrade = false // 是否允许降级
    this.updater.autoInstallOnAppQuit = false
    if (process.env.NODE_ENV === 'development') {
      this.updater.forceDevUpdateConfig = true
    }

    // 监听更新事件
    this.updater.on('update-available', () => this.updateAvailable())
    this.updater.on('update-not-available', () => this.updateNotAvailable())
    this.updater.on('error', (err: Error) => this.updateError(err))
    this.updater.on('update-downloaded', () => this.updateDownloaded())

    this.checkForUpdates()
  }

  checkForUpdates() {
    this.updater.checkForUpdates()
  }

  // 有更新时的回调
  updateAvailable() {
    // dialog
    //   .showMessageBox({
    //     title: '狗库发布新版本啦',
    //     message: '新版本带来了更好的体验，需要更新吗？',
    //     type: 'info',
    //     buttons: ['更新', '官网下载', '本次忽略'],
    //   })
    //   .then((res) => {
    //     switch (res.response) {
    //       case 0:
    //         this.incrementalUpdate() // 增量更新
    //         break
    //       case 1:
    //         shell.openExternal('https://dog.xuxo.top')
    //         break
    //       default:
    //         break
    //     }
    //   })
    // 这里可以调用你想要执行的更新提示方法
  }

  // 没有更新时的回调
  updateNotAvailable() {
    dialog.showMessageBox({
      title: '你已经是最新版本啦！',
      message: '无需更新',
      type: 'none',
      buttons: ['关闭'],
    })

    // 这里可以调用你想要执行的没有更新的提示方法
  }

  // 更新过程中发生错误的回调
  updateError(err: Error) {
    dialog
      .showMessageBox({
        title: '更新出错！！！',
        message: '请截屏完整本窗口的内容找开发者反馈，或者官网重新下载新版本安装',
        detail: JSON.stringify(err),
        type: 'error',
        buttons: ['前往官网', '忽略'],
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
    // 这里可以调用你想要执行的更新提示方法
  }

  // 下载完成后执行的回调
  updateDownloaded() {
    this.restartApp() // 这里调用重启应用的逻辑
  }

  // 重启应用
  restartApp() {
    setTimeout(() => {
      this.updater.quitAndInstall()
    }, 1000) // 给一些时间处理下载完毕后的清理
  }

  incrementalUpdate() {
    this.updater.downloadUpdate()
  }
}
