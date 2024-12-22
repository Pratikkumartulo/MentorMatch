import { Client, Account, ID } from "appwrite";
import conf from "../config/EnvConfig";
import DocumentService from "./CreateDocument";


export class AppwriteUserServise{
    client = new Client();
    account;
    users;
    constructor(){
        this.client
        .setProject(conf.projectID);
        this.account = new Account(this.client);
    }
    async UserSignUp({ username, email, password, name, phone }) {
        try {
            if (await DocumentService.getUserDetails(username) > 0) {
                return { status: false, msg: "Username already exists!" };
            }
            const userAccount = await this.account.create(ID.unique(), email, password, name);
    
            if (userAccount) {
                const userId = userAccount.$id; // Extract user ID from the created user
                const userCreated = await DocumentService.CreateUser({
                    UserName: username,
                    Email: email,
                    UserID: userId,
                    Phone: parseInt(phone),
                });
    
                if (userCreated) {
                    return { status: true, msg: "Account created successfully!" };
                } else {
                    return { status: false, msg: "Failed to save user data in DocumentService." };
                }
            } else {
                return { status: false, msg: "Something went wrong while creating the account." };
            }
        } catch (err) {
            return { status: false, msg: err.message || "An error occurred." };
        }
    }
    
    async Userlogin({email,password}){
        try{
            // const res = await this.account.updatePrefs({ userType: "doctor" });
            // const res1 =await this.account.updateLabels(response.$id, ["User"]);
            // console.log(res);
            // console.log(res1);
            return await this.account.createEmailPasswordSession(email, password);
        }catch(err){
            throw err;
        }
    }
    async getCurrentUser(){
        try{
            return await this.account.get();
        }catch(err){
            console.error("Failed to get user:");
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

const authServie = new AppwriteUserServise();
export default authServie;
