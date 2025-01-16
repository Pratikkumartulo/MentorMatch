import conf from "../config/EnvConfig";
import { Client,Databases,Storage,Query,ID } from "appwrite";

export class fileServices{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client
        .setEndpoint('https://cloud.appwrite.io/v1') 
        .setProject(conf.projectID);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async uploadFile(file){
        try{
            return await this.bucket.createFile(
                conf.bucketID,
                ID.unique(),
                file
            )
        }catch(err){
            console.log("Upload File error :",err);
            return false;
        }
    }

    async deleteFile(fileId){
        try{
            await this.bucket.deleteFile(
                conf.bucketID,
                fileId
            )
            return true
        }catch(err){
            console.log("Deleting File error :",err);
            return false;
        }
    }
    async getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.bucketID,
            fileId
        )
    }
}
const fileService = new fileServices()
export default fileService