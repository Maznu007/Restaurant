import mongoose from "mongoose";

export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "rastaurant"}).then(()=>{
            console.log("connected");
        }).catch((err)=>{
            console.log(`some error occured ${err}`);
        });
    
    };