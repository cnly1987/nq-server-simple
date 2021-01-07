// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash'
import Database from '@ioc:Adonis/Lucid/Database'

import Host  from 'App/Models/Host'
import { get_collection } from 'App/libs/mongo'
// import sendmail from 'App/libs/email'


const now  = function () {  
    var dd = new Date();  
    var y = dd.getFullYear();  
    var m = (dd.getMonth()+1)<10 ? ('0'+(dd.getMonth()+1)) : (dd.getMonth()+1);  
    var d = dd.getDate() <10 ? ('0'+ dd.getDate()) :dd.getDate(); 
    var h = dd.getHours() <10 ? ('0'+ dd.getHours()) :dd.getHours(); 
    var minute = dd.getMinutes() <10 ? ('0'+ dd.getMinutes()) :dd.getMinutes(); 
    var s = dd.getSeconds() <10 ? ('0'+ dd.getSeconds()) :dd.getSeconds(); 
    return y+'-'+m+'-'+d+' '+h+':'+minute+':'+s
}

const getTimeByDays  = function (n) {  
    var dd = new Date();  
    dd.setDate(dd.getDate()+n);//获取AddDayCount天后的日期
    var y = dd.getFullYear();  
    var m = (dd.getMonth()+1)<10 ? ('0'+(dd.getMonth()+1)) : (dd.getMonth()+1);  
    var d = dd.getDate() <10 ? ('0'+ dd.getDate()) :dd.getDate(); 
    var h = dd.getHours() <10 ? ('0'+ dd.getHours()) :dd.getHours(); 
    var minute = dd.getMinutes() <10 ? ('0'+ dd.getMinutes()) :dd.getMinutes(); 
    var s = dd.getSeconds() <10 ? ('0'+ dd.getSeconds()) :dd.getSeconds(); 
    return y+'-'+m+'-'+d+'T'+h+':'+minute+':'+s+'.000Z'
}

const get_system_load =(loads)=>{
    try{
        const ld = loads.split(' ')
        return intVal(ld[1])
    }catch(e){
        return 0
    }
}

const intVal = (i)=>{
    if(typeof i === 'string'){
        return parseFloat(i)
    }else{
        return typeof i === 'number' ? i : 0;
    }
}

const toDecimal =  (x:any, pos:number=2) => {   
    pos = pos || 2
    const fs = parseFloat(x);    
    if (isNaN(fs)) {    
        return 0;    
    }    
    const f = Math.round(x*Math.pow(10, pos))/Math.pow(10, pos);    
    let s = f.toString();    
    let rs = s.indexOf('.');    
    if (rs < 0) {
        rs = s.length;    
        s += '.';    
    }    
    while (s.length <= rs + pos) {    
        s += '0';    
    }    
    return intVal(s);    
}


const unzipcode = list=>{
    const res = Object.assign({})
    res.version = Buffer.from(list[0], 'base64').toString('ascii')
    res.uptime = intVal(Buffer.from(list[1], 'base64').toString('ascii'))
    res.sessions = Buffer.from(list[2], 'base64').toString('ascii')
    res.processes = Buffer.from(list[3], 'base64').toString('ascii')
    res.processes_array = Buffer.from(list[4], 'base64').toString('ascii')
    res.file_handles = Buffer.from(list[5], 'base64').toString('ascii')
    res.file_handles_limit = Buffer.from(list[6], 'base64').toString('ascii')
    res.os_kernel = Buffer.from(list[7], 'base64').toString('ascii')
    res.os_name = Buffer.from(list[8], 'base64').toString('ascii')
    res.os_arch = Buffer.from(list[9], 'base64').toString('ascii')
    res.cpu_name = Buffer.from(list[10], 'base64').toString('ascii')
    res.cpu_cores = Buffer.from(list[11], 'base64').toString('ascii')
    res.cpu_freq = Buffer.from(list[12], 'base64').toString('ascii')
    res.ram_total = intVal(Buffer.from(list[13], 'base64').toString('ascii'))
    res.ram_usage = intVal(Buffer.from(list[14], 'base64').toString('ascii'))
    res.swap_total = intVal(Buffer.from(list[15], 'base64').toString('ascii'))
    res.swap_usage = intVal(Buffer.from(list[16], 'base64').toString('ascii'))
    res.disk_array = Buffer.from(list[17], 'base64').toString('ascii')
    res.disk_total = intVal(Buffer.from(list[18], 'base64').toString('ascii'))
    res.disk_usage = intVal(Buffer.from(list[19], 'base64').toString('ascii'))
    res.connections = Buffer.from(list[20], 'base64').toString('ascii')
    res.nic = Buffer.from(list[21], 'base64').toString('ascii')
    res.ipv_4 = Buffer.from(list[22], 'base64').toString('ascii')
    res.ipv_6 = Buffer.from(list[23], 'base64').toString('ascii')
    res.rx = intVal(Buffer.from(list[24], 'base64').toString('ascii'))
    res.tx =intVal( Buffer.from(list[25], 'base64').toString('ascii'))
    res.rx_gap = toDecimal(Buffer.from(list[26], 'base64').toString('ascii'))
    res.tx_gap = toDecimal(Buffer.from(list[27], 'base64').toString('ascii'))
    res.loads = Buffer.from(list[28], 'base64').toString('ascii')
    res.load_cpu = intVal(Buffer.from(list[29], 'base64').toString('ascii'))
    res.load_io = intVal(Buffer.from(list[30], 'base64').toString('ascii'))
    res.load_system = get_system_load(res.loads)
    res.ping_eu = toDecimal(Buffer.from(list[31], 'base64').toString('ascii'))
    res.ping_us = toDecimal(intVal(Buffer.from(list[32], 'base64').toString('ascii'))  )
    res.ping_as = toDecimal(Buffer.from(list[33], 'base64').toString('ascii') )
    res.updated_at = new Date(getTimeByDays(0))
    return res
}

export default class HostsController {

    // 新增服务器
    public async create ({  request, response, auth }: HttpContextContract)  { 
        const code = uuidv4().split("-").join("");
        const data = request.post()
        const user =  auth.user

        const host = new Host()
        host.code = code
        host.name = data.name
        host.user_id = (user?.id)?user?.id:0
        await host.save()
        // const host = await Database.insertQuery().table('hosts').insert({ code: code, name: data.name, user_id:user?.id })

        return response.status(200).send({'msg':'ok', host:host.serialize()})
         
    }

    //  获取服务器
    public async list ({  request, auth }: HttpContextContract): Promise<{ count: any; results: any; }> {
        const params = request.get()
        const user = await auth.user?.toJSON()
        // console.log(user)
        const query = Database.query().from('hosts')  
        let hosts, all
        if(user?.is_super){
            all =  await Database.query().from('hosts') 
            hosts = await query.forPage(params.page?params.page:1, params.limit?params.limit:10)
        }else{
            all =  await Database.query().from('hosts').where('user_id', user?.id) 
            hosts = await query.where('user_id', user?.id).forPage(params.page?params.page:1, params.limit?params.limit:10)
        }
        return { 
            count:all.length,
            results:hosts
        }
    }

    public async retrie ({ }: HttpContextContract) {
        return {msg:'ok'}
    }

    public async detail ({  auth, view, params, response }: HttpContextContract) {
        const id = params.id
         
        try{
            const user = auth.user
            const host = await Database.query().from('hosts').where('id', id)
            const nhost = JSON.parse(JSON.stringify(host)) 
           
            if(user?.id !== nhost[0].user_id){
                return {msg:'error'}
            }
            return view.render('host_detail', {host:nhost[0]}) 
        }catch(e){
            // console.log(e)
            return response.status(401).send({msg:e})
        }
      
     
    }


    public async delete ({ auth, params, response }: HttpContextContract) {
        const { id } = params
        const user = await auth.user?.toJSON()
        try{
            await Host.query().where('id', id).where('user_id', user?.id).delete()
            return {msg:'ok'}
        }catch(e){
            console.log(e)
            return response.status(400).send({msg:'not found'})
        }

         
    }




    // 获取服务器提交的数据
    public async get_data ({ request, response }: HttpContextContract) {
        const token = request.post().token
        const sdata = request.post()['data'] 
        const slist = unzipcode(sdata.split(' '))
        // console.log(slist)
        try{
            const mdb = get_collection() 
            const host = await Database.query().select('*').from('hosts').where('code', token).first()
            const user = await Database.query().select('*').from('users').where('id', host.user_id).first()
            if(user.id !== host.user_id){
                return  response.status(500).send({'msg':'host not found or is not yours'})
            }
            await Database.query().select('*').from('hosts').where('code', token).update({
                ...slist,
                updated_at:now()
            })
            await mdb.then(function(coll){
                coll.collection.insertOne({
                    ...slist,
                    code:host.code,
                    host_id:host.id,
                    create_at:getTimeByDays(0)
                })
            })
            // await sendmail(user.email, host)
            // if(slist.load_cpu > host.notice_cpu){
            //     await sendmail(user.email, host)
            // }else if(slist.load_system > host.notice_load){
            //     await sendmail(user.email, host)
            // }
            // await mdb.then(coll=>{   coll.client.close()  })
            return response.status(200).send({'msg':'ok'}) 
        }catch(e){
            // console.log(e)
            return response.status(500).send({'msg':e})
        }
         

        // console.log(host.id, slist) 
    }
}
