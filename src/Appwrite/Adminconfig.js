import { Client, Account, ID } from "appwrite";
import conf from "../config/EnvConfig";
import DocumentService from "./CreateDocument";


export class AppwriteAdminServise{
    client = new Client();
    account;
    constructor(){
        this.client
        .setProject(conf.projectID);
        this.account = new Account(this.client);
    }
    async Adminlogin({email,password}){
        try{
            const session = await this.account.createEmailPasswordSession(email, password);
            // console.log(session);
            const pref = await this.account.getPrefs();
            // console.log(pref);
            if(pref.isAdmin){
                return session;
            }else{
                return false;
            }
        }catch(err){
            throw err;
        }
    }
    async getCurrentAdmin(){
        try{
            return await this.account.get();
        }catch(err){
            console.error("Failed to get user:", err);
            return null;
        }
    }
    async logout(){
        try{
            await this.account.deleteSessions();
        }catch(err){
            throw err;
        }
    }
}

const AdminauthServie = new AppwriteAdminServise();
export default AdminauthServie;
