import mongooseConnect from '../../lib/mongoose';
import {Order} from '../../models/OrderSchema';
import {NextApiRequest,NextApiResponse} from 'next';

export default async function handle(request:NextApiRequest,response:NextApiResponse){
    const {method} = request;

    mongooseConnect();

    if(method === "GET")
    {
        return response.json(await Order.find());
    }

    return response.json({
        message: "Server error",
        status: 500
    });
}