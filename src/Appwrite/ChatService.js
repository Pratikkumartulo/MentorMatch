import { Client, Databases, ID, Query } from "appwrite";
import conf from "../config/EnvConfig";

export class ChatService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite endpoint
            .setProject(conf.projectID); // Appwrite project ID

        this.databases = new Databases(this.client);
    }

    // Create a new chat message
    async createMessage({ chatRoomId, message, senderId, receiverId, timestamp }) {
        try {
            const createdMessage = await this.databases.createDocument(
                conf.databaseID,
                conf.MessagingId,
                ID.unique(),
                { chatRoomId, message, senderId, receiverId, timestamp }
            );
            return createdMessage; // Return created message object
        } catch (error) {
            console.error("Error creating message:", error);
            return null;
        }
    }

    // Fetch chat history for a specific chat room
    async fetchChatHistory(chatRoomId) {
        try {
            const chatHistory = await this.databases.listDocuments(
                conf.databaseID,
                conf.MessagingId,
                [Query.equal("chatRoomId", chatRoomId), Query.orderAsc("timestamp")]
            );
            return chatHistory.documents; // Return the list of messages
        } catch (error) {
            console.error("Error fetching chat history:", error);
            return [];
        }
    }

    // Subscribe to real-time updates for a specific chat room
    subscribeToChatUpdates(chatRoomId, callback) {
        try {
            const unsubscribe = this.client.subscribe(
                `databases.${conf.databaseID}.collections.${conf.MessagingId}.documents`,
                (response) => {
                    const { payload } = response;
                    if (payload.chatRoomId === chatRoomId) {
                        callback(payload); // Trigger callback with the new message
                    }
                }
            );
            return unsubscribe; // Return the unsubscribe function
        } catch (error) {
            console.error("Error subscribing to chat updates:", error);
        }
    }

    // Handle user typing status (Optional: Implement a `typing` collection or use additional fields)
    // async setUserTypingStatus(chatRoomId, userId, isTyping) {
    //     try {
    //         const typingStatus = await this.databases.updateDocument(
    //             conf.databaseID,
    //             conf.typingCollectionID, // Optional collection for typing indicators
    //             userId,
    //             { chatRoomId, isTyping }
    //         );
    //         return typingStatus;
    //     } catch (error) {
    //         console.error("Error updating typing status:", error);
    //     }
    // }

    // Fetch typing status for a specific chat room
    // async getTypingStatus(chatRoomId) {
    //     try {
    //         const typingStatuses = await this.databases.listDocuments(
    //             conf.databaseID,
    //             conf.typingCollectionID,
    //             [Query.equal("chatRoomId", chatRoomId)]
    //         );
    //         return typingStatuses.documents;
    //     } catch (error) {
    //         console.error("Error fetching typing status:", error);
    //         return [];
    //     }
    // }
}

const ChatServiceInstance = new ChatService();
export default ChatServiceInstance;
