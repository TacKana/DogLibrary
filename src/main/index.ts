import { app, shell, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ServiceManager } from './app/ServiceManager'

function createWindow(): void {
  // 创建浏览器窗口。
  const mainWindow = new BrowserWindow({
    width: 900,
    minWidth: 900,
    height: 670,
    minHeight: 670,
    show: false,

    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
    },
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 基于 electron-vite 命令行工具的渲染器热模块替换（HMR）。
  // 开发环境加载远程 URL，生产环境加载本地 html 文件。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 当 Electron 完成初始化并准备好创建浏览器窗口时会调用此方法。
// 某些 API 只能在此事件发生后才能使用。

app.whenReady().then(async () => {
  // 为 Windows 设置应用用户模型 ID
  electronApp.setAppUserModelId('com.electron')
  // 在开发环境中，默认通过 F12 键打开或关闭开发者工具
  // 并且在生产环境中忽略 CommandOrControl + R 组合键。
  // 参见https://github.com/alex8088/electron-toolkit/tree/master/packages/utils

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  const serviceManager = new ServiceManager()
  serviceManager.init()

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    // 在 macOS 上，当点击程序坞图标且没有其他窗口打开时，在应用中重新创建一个窗口是常见的做法。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  createWindow()
})

// 当所有窗口都关闭时退出，但 macOS 系统除外。在该系统上，应用程序及其菜单栏通常会保持活跃状态，直到用户通过 Cmd + Q 明确退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 在这个文件中，你可以包含应用程序特定主进程的其余代码
// 你也可以将它们放在单独的文件中，然后在这里引入。
