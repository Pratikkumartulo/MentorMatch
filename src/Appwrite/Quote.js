import { Client, Databases, ID, Query } from "appwrite";
import conf from "../config/EnvConfig";

export class QuoteOfDay{
    Client = new Client();
    database;
    constructor(){
        this.Client
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(conf.projectID);
        this.database = new Databases(this.Client);
    }
    getTodayDate() {
        const d = new Date();
        return `${d.getDate()}|${d.getMonth() + 1}|${d.getFullYear()}`; // Corrected month indexing
    }
    async generateQuote(){
        const d = new Date();
        this.TodayDate = (`${d.getDate()}|${d.getMonth()+1}|${d.getFullYear()}`);
        const quoteExists = await this.getTodaysQuote();
        if (quoteExists.total === 0) {
            try {
                const response = await fetch('https://api.kanye.rest/');
                const data = await response.json();

                if (data && data.quote) {
                    await this.database.createDocument(
                        conf.databaseID,
                        conf.quoteId,
                        ID.unique(),
                        {
                            Date: this.TodayDate,
                            Quote: data.quote
                        }
                    );
                } else {
                    console.error("Failed to fetch the quote from the API.");
                }
            } catch (error) {
                console.error("Error fetching the quote:", error.message);
            }
        } 

    }
    async getTodaysQuote(todayDate =  this.getTodayDate()){
        let dbDate = await this.database.listDocuments(
            conf.databaseID,
            conf.quoteId,
            [
                Query.equal('Date',todayDate)
            ]
        )
        return dbDate
    }
}

const QuoteService = new QuoteOfDay()
export default QuoteService