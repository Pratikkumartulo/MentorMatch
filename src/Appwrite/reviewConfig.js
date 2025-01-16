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
    async getReviews(username){
        const reviews = await this.databases.listDocuments(
            conf.databaseID,
            conf.reviewId,
            [
              Query.equal('ratingTo',username)
            ]
        )
        return reviews.documents
    }
    async getMyReviews(username){
      const reviews = await this.databases.listDocuments(
          conf.databaseID,
          conf.reviewId,
          [
            Query.equal('ratedBy',username)
          ]
      )
      return reviews.documents
  }
    async createReview({ratedBy,ratingTo,rating,isreport=false,review}){
        const createdReview = await this.databases.createDocument(
            conf.databaseID,
            conf.reviewId,
            ID.unique(),
            {ratedBy,ratingTo,rating,isreport,review}
        )
        if(createdReview){
            return true;
        }else{
            return false;
        }
    }

    async rateMentor(slug, {username,ment,ratingValue,review }) {
        try{
          const mentor = await this.databases.getDocument(
            conf.databaseID,
            conf.collectioNID,
            slug
          );
          const rtings = mentor.ratings || [];
          const ratedBy = mentor.ratingsby || []
          if(!ratedBy.includes(username)){
            rtings.push(ratingValue);
            ratedBy.push(username);
            await this.createReview({ratedBy:username,ratingTo:ment,rating:ratingValue,review});
            await this.databases.updateDocument(
              conf.databaseID,
              conf.collectioNID,
              slug,
              {ratingsby: ratedBy,ratings: rtings}
            );
          }else{
            return false;
          }
        }catch(err){
            console.log("Update error for post : ",err)
        }
    }
}
const ratingService = new createDcoument()
export default ratingService