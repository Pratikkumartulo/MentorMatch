import { Client,Databases, Account, ID,Query } from "appwrite";
import conf from "../config/EnvConfig";

export class communityService{
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite endpoint
            .setProject(conf.projectID); // Appwrite project ID

        this.databases = new Databases(this.client);
    }
    async createMessage({message,from}) {
        try {
            const createdMessage = await this.databases.createDocument(
                conf.databaseID,
                conf.communityId,
                ID.unique(),
                { message, from, timestamp:new Date().toISOString() }
            );
            return createdMessage;
        } catch (error) {
            console.error("Error creating message:", error);
            return null;
        }
    } 
    async fetchChatHistory() {
        try {
            const chatHistory = await this.databases.listDocuments(
                conf.databaseID,
                conf.communityId,
                [Query.orderAsc("timestamp")]
            );
            return chatHistory.documents; // Return the list of messages
        } catch (error) {
            console.error("Error fetching chat history:", error);
            return [];
        }
    }
    subscribeToChatUpdates(callback) {
        try {
            const unsubscribe = this.client.subscribe(
                `databases.${conf.databaseID}.collections.${conf.collectioNID}.documents`,
                (response) => {
                    const { payload } = response;
                    callback(payload);
                }
            );
            return unsubscribe;
        } catch (error) {
            console.error("Error subscribing to chat updates:", error);
        }
    }
}

const communityServices = new communityService();
export default communityServices;