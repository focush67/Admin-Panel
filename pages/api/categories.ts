import connect from '@/lib/mongoose';
import { Category } from '@/models/CategorySchema';
export default async function handle(request:any,response:any)
{
    const {method} = request;
    connect();

    if(method === "GET")
    {
        response.json(await Category.find().populate('parent'));
    }

    if(method === "PUT")
    {
        console.log("INSIDE CATEGORY PUT");
        const {name,parent,_id} = request.body;
        console.log(name+" "+parent+" "+_id);
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
        console.log("INSIDE CATEGORY POST");
        let {name,parent} = request.body;
        const isPresent = await Category.findOne({name});

        if(isPresent)
        {
            return response.json({
                message:"Product Already Exists,Updated Category",
                status:400,
            })
        }
        
        const categoryDoc = await Category.create({name,parent});

       return response.json(categoryDoc);
    }

    if(method === "DELETE")
    {
        try {
            const id = request.query?.id;
            const exists = Category.findOne({id});

            if(!exists)
            {
                return response.json({
                    message:"Product not found in categories",
                    status:404,
                })
            }

            console.log("DELETING FROM CATEGORY ",id);
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