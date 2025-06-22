import dotenv from "dotenv"
dotenv.config()

const JWT_PASSWORD: string = process.env.JWT_PASSWORD!
// console.log(JWT_PASSWORD)
const port =process.env.PORT || 8000
const ContentType=['youtube', 'twitter', 'document', 'image', 'link'] as const
console.log(port)
const random=(len:number)=>{
       let options="ndkjnmcnisjdkvisjakpaajwoew";
       let ans="";

       for(let i=0;i<len;i++){
           ans+=options[Math.floor(Math.random()*options.length)]
       }
       
       return ans;
}
export {ContentType,random,JWT_PASSWORD,port }