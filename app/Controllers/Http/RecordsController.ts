// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import _ from 'lodash'
import Database from '@ioc:Adonis/Lucid/Database' 
 
import { get_collection } from 'App/libs/mongo' 




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

const getTimeByHours = function(n){
    var dd = new Date();  
    dd.setHours(dd.getHours()+n);
    var y = dd.getFullYear();  
    var m = (dd.getMonth()+1)<10 ? ('0'+(dd.getMonth()+1)) : (dd.getMonth()+1);  
    var d = dd.getDate() <10 ? ('0'+ dd.getDate()) :dd.getDate(); 
    var h = dd.getHours() <10 ? ('0'+ dd.getHours()) :dd.getHours(); 
    var minute = dd.getMinutes() <10 ? ('0'+ dd.getMinutes()) :dd.getMinutes(); 
    var s = dd.getSeconds() <10 ? ('0'+ dd.getSeconds()) :dd.getSeconds(); 
    return y+'-'+m+'-'+d+'T'+h+':'+minute+':'+s+'.000Z'  
}

const get_range_time =()=>{
    return {
        hour:[new Date(getTimeByHours(-1)), new Date(getTimeByDays(0))],
        day:[new Date(getTimeByDays(-1)), new Date(getTimeByDays(0))],
        month:[new Date(getTimeByDays(-30)), new Date(getTimeByDays(0))],
    } 
}

const days = (host_id)=>{
    // console.log(get_range_time()['day'][0], get_range_time()['day'][1])
    return [
        { 
        "$match":{
            "host_id":host_id,
                "updated_at":{"$gt":get_range_time()['day'][0],"$lt":get_range_time()['day'][1] }
            }
        },
        {
            "$addFields": {
                "created_date": { "$dateToParts": { "date": { "$toDate": { "$toLong": "$updated_at" } } } },
                "system_load":  {"$arrayElemAt":[ { "$split": ["$loads" , " "]}, 1] } 
            }
        }, 
        { "$group": {
            "_id": {
                "customerId": "$host_id",
                "hour": "$created_date.hour",
                "day": "$created_date.day",
                "month": "$created_date.month",
                "year": "$created_date.year"
            },
            "rx_gap": { "$avg": "$rx_gap" },
                "tx_gap": { "$avg": "$tx_gap" },
                "rx": { "$avg": "$rx" },
                "tx": { "$avg": "$tx" },
                "ram_usage": { "$avg": "$ram_usage" },
                "swap_usage": { "$avg": "$swap_usage" },
                "disk_usage": { "$avg": "$disk_usage" },
                "load_io": { "$avg": "$load_io" },
                "load_cpu": { "$avg": "$load_cpu" },
                "ping_eu": { "$avg": "$ping_eu" },
                "ping_us": { "$avg": "$ping_us" },
                "ping_as": { "$avg": "$ping_as" },
                "system_load": {"$avg": {"$toDouble":"$system_load"}   }
        }},
        { "$group": {
            "_id": {
                "customerId": "$_id.host_id", 
            },
            "hours": { 
                "$push": { 
                    "day": "$_id.day",
                    "hour": "$_id.hour",
                    "updated_at": { "$concat": [ { "$toString": "$_id.year" } , "-", { "$toString": "$_id.month" }, "-", { "$toString": "$_id.day" }, " ", 
                                { "$toString": "$_id.hour" }, ":00:00" ] },
                    "rx_gap": "$rx_gap",
                    "tx_gap": "$tx_gap",
                    "rx": "$rx",
                    "tx": "$tx",
                    "ram_usage": "$ram_usage",
                    "swap_usage": "$swap_usage",
                    "disk_usage": "$disk_usage",
                    "load_io": "$load_io",
                    "load_cpu": "$load_cpu",
                    "ping_eu": "$ping_eu",
                    "ping_us": "$ping_us",
                    "ping_as": "$ping_as",
                    "system_load":"$system_load"
                }
            }
        }}, 
    ]
}
const months = (host_id) =>{
    return [
        { 
        "$match":{
            "host_id":host_id,
            "updated_at":{"$gt":get_range_time()['month'][0],"$lt":get_range_time()['month'][1] }
            }
        },
        {
            "$addFields": {
                "created_date": { "$dateToParts": { "date": { "$toDate": { "$toLong": "$updated_at" } } } },
                "system_load":  {"$arrayElemAt":[ { "$split": ["$loads" , " "]}, 1] } 
            }
        }, 
        { "$group": {
            "_id": {
                "customerId": "$host_id", 
                "day": "$created_date.day",
                "month": "$created_date.month",
                "year": "$created_date.year"
            },
            "rx_gap": { "$avg":{"$toDouble":"$rx_gap"}  },
            "tx_gap": { "$avg": "$tx_gap" },
            "rx": { "$avg": "$rx" },
            "tx": { "$avg": "$tx" },
            "ram_usage": { "$avg": "$ram_usage" },
            "swap_usage": { "$avg": "$swap_usage" },
            "disk_usage": { "$avg": "$disk_usage" },
            "load_io": { "$avg": "$load_io" },
            "load_cpu": { "$avg": "$load_cpu" },
            "ping_eu": { "$avg": "$ping_eu" },
            "ping_us": { "$avg": "$ping_us" },
            "ping_as": { "$avg": "$ping_as" },
            "system_load": {"$avg": {"$toDouble":"$system_load"}   }
        }},
        { "$group": {
            "_id": {
                "customerId": "$_id.host_id", 
            },
            "months": { 
                "$push": { 
                    "day": "$_id.day",
                    "month": "$_id.month",
                    "updated_at": { "$concat": [ { "$toString": "$_id.year" } , "-", { "$toString": "$_id.month" }, "-", { "$toString": "$_id.day" } ] },
                    "rx_gap": "$rx_gap",
                    "tx_gap": "$tx_gap",
                    "rx": "$rx",
                    "tx": "$tx",
                    "ram_usage": "$ram_usage",
                    "swap_usage": "$swap_usage",
                    "disk_usage": "$disk_usage",
                    "load_io": "$load_io",
                    "load_cpu": "$load_cpu",
                    "ping_eu": "$ping_eu",
                    "ping_us": "$ping_us",
                    "ping_as": "$ping_as",
                    "system_load": "$system_load",
                }
            }
        }}, 
    ]
}



export default class RecordsController {

    //  获取服务器
    public async list ({  params, response }: HttpContextContract) {
        const host_id = params.id
         
        const host = await Database.query().select('*').from('hosts').where('id', host_id).first()
        if(host){ 
            const mdb = get_collection('records') 
            const vhours = await mdb.then(function(coll){
                return coll.collection.find(
                    {'host_id': host.id, "updated_at":{"$gt":get_range_time()['hour'][0],"$lt":get_range_time()['hour'][1] } }, 
                    {
                        fields:{
                            'host_id':1,'rx':1, 'tx':1, 'rx_gap':1, 'tx_gap':1, '_id':0, 'updated_at':1, 'ping_us':1, 'ping_eu':1, 'ping_as':1,
                            'ram_usage':1, 'disk_usage':1,'loads':1,'load_cpu':1, 'load_io':1, 'swap_usage':1
                        } 
                    }
                ).toArray()
            })
            const vdays = await mdb.then(function(coll){
                return coll.collection.aggregate(days(host.id)).toArray()
            })
            const vmonths = await mdb.then(function(coll){
                return coll.collection.aggregate(months(host.id)).toArray()
            }) 
            await mdb.then(coll=>{   coll.client.close()  })

            return {
                host, 
                records:{
                    hours:{results: (vhours? vhours.reverse() : [] ) },
                    days:{results:vdays[0].hours},
                    months:{results:vmonths[0].months}
                }
            }
          
        }else{
            return response.status(400).send({'msg':'host not found!'})
        }

    }

    public async delete ({  params, response }: HttpContextContract) {
        const { id } = params
     
        try{
            const mdb = get_collection('records') 
            await mdb.then(coll=>{
                coll.collection.deleteMany({'host_id': parseInt(id),   }, )
              
            })
            return {msg:'ok'}
        }catch(e){
            console.log(e)
            return response.status(400).send({msg:'not found'})
        }

         
    }


}
