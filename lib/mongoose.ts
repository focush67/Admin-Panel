import mongoose from "mongoose";
export default function mongooseConnect()
{
    const url = process.env.MONGO_URI!;
    if(mongoose.connection.readyState === 1)
    {
        return mongoose.connection.asPromise();
    }

    else
    {
        return mongoose.connect(url);
    }
}