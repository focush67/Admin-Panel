import connect from '@/lib/mongoose';
import { Category } from '@/models/CategorySchema';
export default async function handle(request:any,response:any)
{
    const {method} = request;
    await connect();

    if(method === "GET")
    {
        return response.json(await Category.find().populate('parent'));
    }

    if(method === "PUT")
    {
        const {name,parent,_id} = request.body;
        await Category.findByIdAndUpdate(_id , {
            name,
            parent,
        })

        return response.json({
            message:"Category Updated",
            status:201,
        })
    }

    if(method === "POST")
    {
        let {name,parent} = request.body;
        
        const categoryDoc = await Category.create({name,parent});

       return response.json(categoryDoc);
    }

    if(method === "DELETE")
    {
        try {
            const id = request.query?.id;

        await Category.findByIdAndDelete(id);

        return response.json({
            message : `Deleted Category ${id}`,
            status : 201,
        })
        } catch (error:any) {
            console.log(error.message);
        }
    }
}