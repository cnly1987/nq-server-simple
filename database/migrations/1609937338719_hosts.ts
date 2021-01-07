import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Host extends BaseSchema {
  protected tableName = 'hosts'
  

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').nullable().defaultTo(0)
      table.string('code', 180).notNullable()
      table.string('name', 180).notNullable()
      table.string('version').nullable()
      table.float('uptime').nullable()
      table.string('sessions').nullable()
      table.string('processes').nullable()
      table.string('processes_array').nullable()
      table.string('file_handles').nullable()
      table.string('file_handles_limit').nullable()
      table.string('os_kernel').nullable()
      table.string('os_name').nullable()
      table.string('os_arch').nullable()
      table.string('cpu_name').nullable()
      table.string('cpu_cores').nullable()
      table.string('cpu_freq').nullable()
      table.float('ram_total').nullable()
      table.float('ram_usage').nullable()
      table.float('swap_total').nullable()
      table.float('swap_usage').nullable()
      table.string('disk_array').nullable()
      table.float('disk_total').nullable()
      table.float('disk_usage').nullable() 
      table.string('connections').nullable() 
      table.string('nic').nullable()
      table.string('ipv_4').nullable()
      table.string('ipv_6').nullable()
      table.float('rx').nullable()
      table.float('tx').nullable()
      table.float('rx_gap').nullable()
      table.float('tx_gap').nullable()
      table.string('loads').nullable()
      table.float('load_cpu').nullable()
      table.float('load_io').nullable()
      table.float('load_system').nullable()
      table.float('ping_eu').nullable()
      table.float('ping_us').nullable()
      table.float('ping_as').nullable()
      table.float('notice_cpu').nullable().defaultTo(80)
      table.float('notice_disk').nullable().defaultTo(80)
      table.float('notice_load').nullable().defaultTo(80)
      table.boolean('is_push').notNullable().defaultTo(false)
      table.boolean('is_pushed').notNullable().defaultTo(false)
      table.dateTime('last_push_at').nullable()
      table.boolean('down').notNullable().defaultTo(false)
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
