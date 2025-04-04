import { Client, Databases, ID, Query } from "appwrite";
import conf from "../config/EnvConfig";


export class createApplication {
    client = new Client();
    databases;
    constructor(){
        this.client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(conf.projectID);
        this.databases = new Databases(this.client);
    }
    async CreateApplication({UserName,Email,UserId,message,subject,Accepted=false}){
        const createdApplication =await this.databases.createDocument(
            conf.databaseID,
            conf.ApplicationId,
            ID.unique(),
            {UserName,Email,UserId,message,subject,Accepted,timestamp:new Date().toISOString()}
        )
        if(createdApplication){
            return true;
        }else{
            return false;
        }
    }
    async GetAllApplications(){
        let promise = await this.databases.listDocuments(
            conf.databaseID,
            conf.ApplicationId,
            [Query.orderAsc("timestamp")]
        )
        if(promise){
            // console.log(promise)
            return promise.documents;
        }
    }
    async GetdetailApplications(email){
        let promise = await this.databases.listDocuments(
            conf.databaseID,
            conf.ApplicationId,
            [
                Query.equal('Email',email),
                Query.equal('IsOpen',true)
            ]
        )
        if(promise){
            return promise;
        }
    }
    async updateApplicationDetails(slug,{IsOpen,Accepted}){
        // console.log(slug,IsOpen);
        try{
           return await this.databases.updateDocument(
            conf.databaseID,
            conf.ApplicationId,
            slug,
            {IsOpen,Accepted}
           )
        }catch(err){
            console.log("Update error for post : ",err)
        }
    }

}
const ApplicationService = new createApplication()
export default ApplicationService;
