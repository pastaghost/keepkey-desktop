import type { Features } from '@keepkey/device-protocol/lib/messages_pb'
import type { KeepKeyHDWallet } from '@shapeshiftoss/hdwallet-keepkey'

// possible states
export enum KKState {
  UpdateBootloader = 'updateBootloader',
  UpdateFirmware = 'updateFirmware',
  NeedsInitialize = 'needsInitialize',
  Connected = 'connected',
  HardwareError = 'hardwareError',
  Disconnected = 'disconnected',
  Plugin = 'plugin',
  NeedsReconnect = 'needsReconnect',
}

export type KKStateData =
  | {
      state: KKState.Plugin
    }
  | {
      state: KKState.Disconnected
    }
  | {
      state: KKState.HardwareError
      error: string | undefined
    }
  | {
      state: KKState.UpdateBootloader
      firmware: string
      bootloader: string
      recommendedBootloader: string
      recommendedFirmware: string
      bootloaderMode: boolean
    }
  | {
      state: KKState.UpdateFirmware
      firmware: string
      bootloader: string
      recommendedBootloader: string
      recommendedFirmware: string
      bootloaderMode: boolean
    }
  | {
      state: KKState.NeedsInitialize
    }
  | {
      state: KKState.Connected
    }
  | {
      state: KKState.NeedsReconnect
    }

export type StateChangeHandler = (state: KKStateData) => Promise<void>
export type KeyringEventHandler = (e: unknown) => Promise<void>

export type GenericError = {
  prompt?: string
  success: boolean
  error?: string
}

export type FirmwareAndBootloaderData = {
  firmware: {
    version: string
    url: string
    hash: string
  }
  bootloader: {
    version: string
    url: string
    hash: string
  }
}

export type FirmwareAndBootloaderHashes = {
  bootloader: { [key: string]: string }[]
  firmware: { [key: string]: string }[]
}

export type AllFirmwareAndBootloaderData = {
  latest: FirmwareAndBootloaderData
  beta: FirmwareAndBootloaderData
  hashes: FirmwareAndBootloaderHashes
}

export type WebusbWallet = DeviceFeatures & {
  wallet: KeepKeyHDWallet
}

export type BasicWallet = GenericError & DeviceFeatures

export type DeviceFeatures = {
  bootloaderMode?: boolean
  bootloaderVersion: string | undefined
  firmwareVersion: string
  features?: Features.AsObject
}
