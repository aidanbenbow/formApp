import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import pkg from '@aws-sdk/client-dynamodb'
const { GetItemCommand } = pkg;
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";

const REGION = 'eu-central-1'; // e.g. "us-east-1"
// const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
// const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY

const ddbClient = new DynamoDBClient({
    region: REGION,
    // credentials: {
    //     accessKeyId: ACCESS_KEY,
    //     secretAccessKey: SECRET_KEY
    // }
    });

    export const dynamoDB = DynamoDBDocumentClient.from(ddbClient)
    export const tableName = 'formSubmissions'

    // Function to save form data to DynamoDB
    export const saveFormData = async (formData) => {
        const params = {
            TableName: formData.fields[1],
            Item: {
                id: uuidv4(),
                ...formData
            }
        };
        try {
            await dynamoDB.send(new PutCommand(params));
            console.log("Form data saved successfully:", formData);
        } catch (err) {
            console.error("Error saving form data:", err);
        }
    };

    export const saveFormData2 = async (formData) => {
        const params = {
            TableName: formData.formTable,
            Item: {
                id: uuidv4(),
                ...formData
            }
        };
        try {
            await dynamoDB.send(new PutCommand(params));
            console.log("Form data saved successfully:", formData);
        } catch (err) {
            console.error("Error saving form data:", err);
        }
    };
         
    // Function to get one item from DynamoDB
    export const getOneFormData = async (formID) => {
        const params = {
            TableName: tableName,
            Key: {
                id: {S: formID}
            }
        };
        try {
            const data = await dynamoDB.send(new GetItemCommand(params));
            console.log("Form data retrieved successfully:", data);
            return data;
        } catch (err) {
            console.error("Error retrieving form data:", err);
        }
    };

    //function to get item from dynamoDB
    export const getFormData = async (formID) => {
        const params = {
            TableName: tableName,
            Key: {
                id: formID
            }
        };
        try {
            const data = await dynamoDB.send(new ScanCommand(params));
            console.log("Form data retrieved successfully:", data);
            return data;
        } catch (err) {
            console.error("Error retrieving form data:", err);
        }
    };

    //function to get all items from dynamoDB
    export const getAllFormData = async () => {
        const params = {
            TableName: 'testdata'
        };
        try {
            const data = await dynamoDB.send(new ScanCommand(params));
            console.log("All form data retrieved successfully:", data);
            return data;
        } catch (err) {
            console.error("Error retrieving form data:", err);
        }
    };