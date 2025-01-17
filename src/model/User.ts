import mongoose,{Schema,Document} from 'mongoose';

export interface Message extends Document{
    content:string;
    createdAt:Date;
}
const MessageSchema:Schema<Message>=new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
});

export interface User extends Document{
    username:string;
    password:string;
    email:string;
    verifyCode:string;
    verifyCodeExpiry:Date;
    isAcceptingMessages:boolean;
    messages:Message[];
    isVerified:false;

}

const UserSchema:Schema<User>=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required'],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,'Password is required'],

} ,      
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    verifyCode:{
        type:String,
        required:[true,'Verify code is required'],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'Verify code expiry is required'],
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
}
);


const UserModel=(mongoose.models.User as mongoose.Model<User>)||mongoose.model<User>('User',UserSchema);
export default UserModel;