import mongoose from 'mongoose';


const mongodb = async ()=> {
    return await mongoose.connect('mongodb://localhost/my_database', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}

export default mongodb;