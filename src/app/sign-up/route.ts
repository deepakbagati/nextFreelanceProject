import { sendVerificationEmails } from "@/helpers/sendVerificationEmails";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import  bcrypt from "bcryptjs"

export async function POST(request:Request){
    await dbConnect()
    try{
      const {username,email,password}=  await request.json()
      const existingUserVerfiedByUsername= await UserModel.findOne({
        username,
        isVerified:true
      })
      if (existingUserVerfiedByUsername){
        return Response.json({
            success:false,
            message:"Username is already taken"
        },{status:400})
      }

      const existingUserbyemail=await UserModel.findOne({
        email
      })
      const verifyCode=Math.floor(100000 +Math.random()*900000).toString()
      if (existingUserbyemail){
        if(existingUserbyemail.isVerified){
            return Response.json({ //return kardeya that means method hogya khatam
                success:false,
                message:"user already exists with this email"
            })
        }
        else {
            const hashedPassword=await bcrypt.hash(password,10)
            existingUserbyemail.password=hashedPassword;
            existingUserbyemail.verifyCode=verifyCode;
            existingUserbyemail.verifyCodeExpiry=new Date(Date.now()+3600000) 
            await existingUserbyemail.save() //saving the user


        }
      }
      else{
        const hashedPassword=await bcrypt.hash(password,10)
        const expiryDate=new Date()
        expiryDate.setHours(expiryDate.getHours()+1)

        const newUser=new UserModel({
            username,
            password:hashedPassword,
            email,
            verifyCode,
            verifyCodeExpiry:expiryDate,
            isAcceptingMessages:true,
            messages:[]
        

        })
        await newUser.save()
      }

      //send verification email
     const emailResponse= await sendVerificationEmails(
        email,
        username,
        verifyCode
      )

      if (!emailResponse.success){

        return Response.json({
            success:false,
            message:emailResponse.message
        },{status:500})
      }

      return Response.json({
        success:true,
        message:"User registered successfully .Please your email"
    },{status:201})

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