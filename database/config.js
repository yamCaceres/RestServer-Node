const mongoose = require('mongoose')

const dbConection = async ()=>{

    try {
        
        await mongoose.connect( process.env.MONGODB_CNN, {

            useNewUrlParser:true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('BD funcionando')

    } catch (error) {

        console.log(error);
        throw new error('Error en Base de Datos');
        
    }


}


module.exports= {
    dbConection
}