
import MongoClient from 'mongodb';
 
import Env from '@ioc:Adonis/Core/Env'


const mongourl = Env.get('MONGOURL')

const get_db =  async function() {
    return await  MongoClient.connect(mongourl, { useUnifiedTopology: true, useNewUrlParser: true} )
}


const get_collection =  async function(table:string = 'records') {
    const conn =   get_db()
    const coll = await conn.then(client => {
        const x = client.db('nqmonitor');
        const collection = x.collection(table)
        return  {collection,client}
    })
    return coll
}




export  default get_collection

export {
    get_db,
    get_collection,
    mongourl
}