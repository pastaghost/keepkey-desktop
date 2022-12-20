import AutoLaunch from 'auto-launch'
import type { BrowserWindow } from 'electron'
import fs from 'fs'
import * as hidefile from 'hidefile'
import type { Server } from 'http'
import NedbPromises from 'nedb-promises'
import path from 'path'

import { BridgeLogger } from './helpers/bridgeLogger'
import { KKStateController } from './helpers/kk-state-controller'
import type { KKStateData } from './helpers/kk-state-controller/types'
import { KKState } from './helpers/kk-state-controller/types'
import { SettingsInstance } from './helpers/settings'
import { queueIpcEvent } from './helpers/utils'
import { startTcpBridge, stopTcpBridge } from './tcpBridge'
import { createAndUpdateTray } from './tray'

export const assetsDirectory = path.join(__dirname, 'assets')
export const isMac = process.platform === 'darwin'
export const isWin = process.platform === 'win32'
export const isLinux = process.platform !== 'darwin' && process.platform !== 'win32'
export const ALLOWED_HOSTS = ['localhost']

const homedir = require('os').homedir()
const dbDirPath = path.join(homedir, '.keepkey')
const dbPath = path.join(dbDirPath, './db')
if (!fs.existsSync(dbDirPath)) {
  fs.mkdirSync(dbDirPath)
  fs.closeSync(fs.openSync(dbPath, 'w'))
}
hidefile.hideSync(dbDirPath)

export const db = NedbPromises.create({ filename: dbPath, autoload: true })

export let server: Server
export let setServer = (value: Server) => (server = value)

export let tcpBridgeRunning = false
export let setTcpBridgeRunning = (value: boolean) => (tcpBridgeRunning = value)

export let tcpBridgeStarting = false
export let setTcpBridgeStarting = (value: boolean) => (tcpBridgeStarting = value)

export let tcpBridgeClosing = false
export let setTcpBridgeClosing = (value: boolean) => (tcpBridgeClosing = value)

export let renderListenersReady = false
export let setRenderListenersReady = (value: boolean) => (renderListenersReady = value)

export const [shouldShowWindow, setShouldShowWindow] = (() => {
  let out: () => void
  return [new Promise<boolean>(resolve => (out = () => resolve(true))), out!]
})()

export const windows: {
  mainWindow: undefined | BrowserWindow
  splash: undefined | BrowserWindow
} = {
  mainWindow: undefined,
  splash: undefined,
}

export const ipcQueue = new Array<{ eventName: string; args: any }>()

export const isWalletBridgeRunning = () =>
  kkStateController?.data.state === KKState.Connected && tcpBridgeRunning

export const settings = new SettingsInstance()
export const bridgeLogger = new BridgeLogger()

export const kkAutoLauncher = new AutoLaunch({
  name: 'KeepKey Desktop',
})

export const kkStateController = new KKStateController(
  async (data: KKStateData) => {
    console.log('KK STATE', data)
    if (data.state === KKState.Connected || data.state === KKState.NeedsInitialize) {
      await startTcpBridge()
    } else if (data.state === KKState.Disconnected || data.state === KKState.HardwareError) {
      await stopTcpBridge().catch(e => console.warn('stopTcpBridge error: ', e))
    }
    createAndUpdateTray()
    queueIpcEvent('updateState', data)
  },
  async (e: any) => {
    if (e[2] === '18') queueIpcEvent('requestPin', e)
  },
)
