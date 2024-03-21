const AWS = require('aws-sdk');
require('dotenv').config();

function uploadToS3(file,filename){
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.S3_USER_KEY;
    const IAM_USER_SECRET=process.env.S3_USER_SECRET_KEY;
    
    
    let s3bucket = new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
        
    })
    
    console.log(file);
   
    let parmas = {
            Bucket: BUCKET_NAME,
            Key:filename,
            Body:file,
            ACL :'public-read'
        }
        
    return new Promise((resolve,reject)=>{
        s3bucket.upload(parmas,(err,s3response)=>{
            if(err){
                console.log('something went wrong',err)
                reject(err)
            }
            else{
                console.log('success',s3response);
                
                console.log('link is >>>>>>.',s3response.Location)
                
                resolve(s3response.Location)
            }
        })
    })
}
module.exports={
    uploadToS3
}