import { sendVerificationEmails } from "@/helpers/sendVerificationEmails";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import  bcrypt from "bcryptjs"

export async function POST(request:Request){
    await dbConnect()
    try{
      const {username,email,password}=  await request.json()
    }
    catch(error){
        console.log("Error Registering user",error)//ye response hame terminal dekhaye dega
        return Response.json(
            {
                success:false,
                message:"Error registering User" //ye hamne response frontend pe bejdeya hai

            },
            {
                status:500
            }
        )
    }
}