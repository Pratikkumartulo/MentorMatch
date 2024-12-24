import { Client, Databases, ID, Query } from "appwrite";
import conf from "../config/EnvConfig";
import { setupListeners } from "@reduxjs/toolkit/query";


export class createDcoument {
    client = new Client();
    databases;
    constructor(){
        this.client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(conf.projectID);
        this.databases = new Databases(this.client);
    }
    async CreateUser({UserName,Email,UserID,Phone}){
        const createdUser =await this.databases.createDocument(
            conf.databaseID,
            conf.collectioNID,
            ID.unique(),
            {UserName,Email,UserID,Phone}
        )
        if(createdUser){
            return true;
        }else{
            return false;
        }
    }
    async getUserDetails(username){
        let user = await this.databases.listDocuments(
            conf.databaseID,
            conf.collectioNID,
            [
                Query.equal('UserName',username)
            ]
        );
        return user.total;
    }
    async getEmailDetails(email){
        // console.log(email)
        let user = await this.databases.listDocuments(
            conf.databaseID,
            conf.collectioNID,
            [
                Query.equal('Email',email)
            ]
        );
        // console.log(user.documents);
        return user.documents[0];
    }
    async getIdDetails(username){
        // console.log(email)
        let user = await this.databases.listDocuments(
            conf.databaseID,
            conf.collectioNID,
            [
                Query.equal('UserName',username)
            ]
        );
        // console.log(user.documents);
        return user.documents[0];
    }
    async updateUserDetails(slug,{UserName, Email, SpecializedIn, AboutYou, Phone}){
        try{
           return await this.databases.updateDocument(
            conf.databaseID,
            conf.collectioNID,
            slug,
            {UserName, Email, SpecializedIn, AboutYou, Phone}
           )
        }catch(err){
            console.log("Update error for post : ",err)
        }
    }
    async getAllUser(){
        let user = await this.databases.listDocuments(
            conf.databaseID,
            conf.collectioNID,
        );
        return user;
    }
    async updateUserAppDetails(slug,{isUser}){
        try{
           return await this.databases.updateDocument(
            conf.databaseID,
            conf.collectioNID,
            slug,
            {isUser}
           )
        }catch(err){
            console.log("Update error for post : ",err)
        }
    }
    async updateUserChatDetails(username1, username2) {
      try {
          // Fetch user details (ensure getIdDetails is async)
          const usr1 = await this.getIdDetails(username1);
          const usr2 = await this.getIdDetails(username2);
  
          // Extract ChatsWith arrays, handle undefined
          const chatsWith1 = usr1.ChatsWith || [];
          const chatsWith2 = usr2.ChatsWith || [];
  
          // Add usernames if not already present
          if (!chatsWith1.includes(username2)) {
              chatsWith1.push(username2);
          }
          if (!chatsWith2.includes(username1)) {
              chatsWith2.push(username1);
          }
  
          // Update both users' ChatsWith fields in parallel
          await Promise.all([
              this.databases.updateDocument(
                  conf.databaseID,
                  conf.collectioNID,
                  usr1.$id,
                  { ChatsWith: chatsWith1 }
              ),
              this.databases.updateDocument(
                  conf.databaseID,
                  conf.collectioNID,
                  usr2.$id,
                  { ChatsWith: chatsWith2 }
              ),
          ]);
  
          // console.log("Chat details updated successfully for", username1, "and", username2);
      } catch (err) {
          console.error("Error updating chat details for", username1, "and", username2, ":", err);
      }
  }
  
    async follow(slug, { UserName, currentId }) {
        try {
          // Fetch the target user document (the user being followed)
          const targetUser = await this.databases.getDocument(
            conf.databaseID,
            conf.collectioNID,
            slug
          );
      
          // Fetch the current user's document to get the UserName
          const currentUser = await this.databases.getDocument(
            conf.databaseID,
            conf.collectioNID,
            currentId
          );
      
          const currentUserName = UserName; // Assuming `UserName` is stored in the document
      
          // Add the current user's username to the target user's followers list if not already present
          const updatedFollowers = targetUser.Follower || [];
          if (!updatedFollowers.includes(currentUserName)) {
            updatedFollowers.push(currentUserName);
          }
      
          // Add the target user's username to the current user's following list if not already present
          const updatedFollowings = currentUser.Following || [];
          if (!updatedFollowings.includes(targetUser.UserName)) {
            updatedFollowings.push(targetUser.UserName);
          }
      
          // Update the target user's document with the new followers list
          await this.databases.updateDocument(
            conf.databaseID,
            conf.collectioNID,
            slug,
            { Follower: updatedFollowers }
          );
      
          // Update the current user's document with the new following list
          await this.databases.updateDocument(
            conf.databaseID,
            conf.collectioNID,
            currentId,
            { Following: updatedFollowings }
          );
      
          return true;
        } catch (err) {
          console.error("Error during follow action:", err);
          return false;
        }
      }

      async unfollow (slug, { UserName, currentId }){
        try {
          // Fetch the target user document (the user being unfollowed)
          const targetUser = await this.databases.getDocument(
            conf.databaseID,
            conf.collectioNID,
            slug
          );
      
          // Fetch the current user document (the user initiating the unfollow)
          const currentUser = await this.databases.getDocument(
            conf.databaseID,
            conf.collectioNID,
            currentId
          );
      
          // Remove the current user's ID from the target user's followers list
          const updatedFollowers = targetUser.Follower || [];
          const followerIndex = updatedFollowers.indexOf(UserName);
          if (followerIndex !== -1) {
            updatedFollowers.splice(followerIndex, 1);
          }
      
          // Remove the target user's ID from the current user's following list
          const updatedFollowings = currentUser.Following || [];
          const followingIndex = updatedFollowings.indexOf(targetUser.UserName);
          if (followingIndex !== -1) {
            updatedFollowings.splice(followingIndex, 1);
          }
      
          // Update the target user's document with the new followers list
          await this.databases.updateDocument(
            conf.databaseID,
            conf.collectioNID,
            slug,
            { Follower: updatedFollowers }
          );
      
          // Update the current user's document with the new following list
          await this.databases.updateDocument(
            conf.databaseID,
            conf.collectioNID,
            currentId,
            { Following: updatedFollowings }
          );
      
          return true; // Successfully unfollowed
        } catch (err) {
          console.error("Error unfollowing user:", err);
          return false; // Unfollow failed
        }
      };

      async getMentor(SpecializedIn){
        const mentors = await this.databases.listDocuments(
          conf.databaseID,
          conf.collectioNID,
          [
              Query.equal('isUser',false),
              Query.equal('SpecializedIn',SpecializedIn)
          ]
        )
      // console.log(user.documents);
      return mentors;
      }
}
const DocumentService = new createDcoument()
export default DocumentService
