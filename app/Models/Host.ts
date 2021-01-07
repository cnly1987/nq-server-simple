import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Host extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public code: string

  @column()
  public name: string

  @column()
  public version: string

  @column()
  public uptime: string

  @column()
  public sessions: string

  @column()
  public processes: string

  @column()
  public processes_array: string

  @column()
  public file_handles: string

  @column()
  public file_handles_limit: string

  @column()
  public os_kernel: string

  @column()
  public os_name: string

  @column()
  public os_arch: string

  @column()
  public cpu_name: string

  @column()
  public cpu_cores: string

  @column()
  public cpu_freq: string

  @column()
  public ram_total: number

  @column()
  public ram_usage: number

  @column()
  public swap_total: number

  @column()
  public swap_usage: number

  @column()
  public disk_array: string

  @column()
  public disk_total: number

  @column()
  public disk_usage: number

  @column()
  public connections: string

  @column()
  public nic: string

  @column()
  public ipv_4: string

  @column()
  public ipv_6: string

  @column()
  public rx: number

  @column()
  public tx: number

  @column()
  public rx_gap: number

  @column()
  public tx_gap: number

  @column()
  public loads: number

  @column()
  public load_cpu: number

  @column()
  public load_system: number

  @column()
  public load_io: number

  @column()
  public ping_eu: number

  @column()
  public ping_us: number

  @column()
  public ping_as: number

  @column()
  public notice_cpu: number

  @column()
  public notice_disk: number

  @column()
  public notice_load: number

  @column()
  public is_push: boolean

  @column()
  public is_pushed: boolean

  @column()
  public last_push_at: DateTime


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
