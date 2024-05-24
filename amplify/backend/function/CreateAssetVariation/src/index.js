/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["app_sync_api_key","app_sync_url"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/* Amplify Params - DO NOT EDIT
	API_TRANSFERTHOUGHT_ASSETTABLE_ARN
	API_TRANSFERTHOUGHT_ASSETTABLE_NAME
	API_TRANSFERTHOUGHT_GRAPHQLAPIENDPOINTOUTPUT
	API_TRANSFERTHOUGHT_GRAPHQLAPIIDOUTPUT
	API_TRANSFERTHOUGHT_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
	STORAGE_S3F39ED916_BUCKETNAME
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

const { SSMClient, GetParametersCommand } = require('@aws-sdk/client-ssm');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const gql = require('graphql-tag');
const graphql = require('graphql');
const { print } = graphql;

const s3Client = new S3Client({ region: 'us-east-1' });

// Create an SSM client instance
const ssmClient = new SSMClient({});

// Prepare the parameters for the getParameters command
const getParametersCommand = new GetParametersCommand({
    Names: ['app_sync_api_key', 'app_sync_url'].map((secretName) => process.env[secretName]),
    WithDecryption: true,
});

const updateAssetMutation = gql`
    mutation UpdateAsset($input: UpdateAssetInput!, $condition: ModelAssetConditionInput) {
        updateAsset(input: $input, condition: $condition) {
            id
            parentId
            name
            tag
            fileType
            key
            owner
            isFolder
            variations
            createdAt
            updatedAt
        }
    }
`;

exports.handler = async (event) => {
    for (const record of event.Records) {
        console.log('RECORD', record);
        if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
            // return early if variations already exit
            const oldImage = record.dynamodb.OldImage;
            const newImage = record.dynamodb.NewImage;
            if (oldImage && oldImage.variations) {
                return;
            }
            if (newImage && newImage.isFolder && newImage.isFolder.BOOL) {
                return;
            }
            const existingId = newImage.id.S;
            const originalKey = newImage.key.S;
            const url = `https://transferthought1382d681d5a54845b17b150d2dc3613621307-master.s3.us-east-1.amazonaws.com/public/${existingId}.${originalKey}`;

            console.log('NEW IMAGE', newImage);
            try {
                // Download the image

                const imageBuffer = (await axios({ url, responseType: 'arraybuffer' })).data;

                // Resize the image to thumbnail using sharp
                const resizedImageBuffer = await sharp(imageBuffer)
                    .rotate()
                    .resize(200, 200)
                    .toBuffer();

                // Generate a new UUID for the thumbnail
                const newKey = uuidv4();

                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: 'transferthought1382d681d5a54845b17b150d2dc3613621307-master',
                        Key: `public/${existingId}.${newKey}`,
                        Body: resizedImageBuffer,
                        ContentType: 'image/jpeg',
                    })
                );

                console.log(`Thumbnail uploaded successfully: ${newKey}`);
                const response = await ssmClient.send(getParametersCommand);

                // Extract the Parameters from the response
                const { Parameters } = response;

                console.log(Parameters);

                const graphqlData = await axios({
                    url: Parameters[1].Value,
                    method: 'post',
                    headers: {
                        'x-api-key': Parameters[0].Value,
                    },
                    data: {
                        query: print(updateAssetMutation),
                        variables: {
                            input: {
                                id: existingId,
                                ...(newImage?.owner?.S ? { owner: newImage.owner.S } : {}),

                                // ...(newImage?.parentId?.S ? {parentId: newImage.parentId.S} : {}),
                                // ...(newImage?.name?.S ? {name: newImage.name.S} : {}),
                                // ...(newImage?.tag?.S ? {tag: newImage.tag.S} : {}),
                                // ...(newImage?.fileType?.S ? {fileType: newImage.fileType.S} : {}),
                                // ...(newImage?.key?.S ? {key: newImage.key.S} : {}),
                                // ...(newImage?.isFolder?.BOOL ? {isFolder: newImage.isFolder.BOOL} : {}),
                                // ...(newImage?.createdAt?.S ? {createdAt: newImage.createdAt.S} : {}),
                                // ...(newImage?.updatedAt?.S ? {updatedAt: newImage.updatedAt.S} : {}),

                                variations: JSON.stringify({ thumbnail: newKey }),
                            },
                        },
                    },
                });
                console.log('graphqlData', JSON.stringify(graphqlData?.data));

                console.log(`DynamoDB updated successfully for ID: ${existingId}`);
            } catch (error) {
                console.error('Error processing record', record.eventID, error);
            }
        }
    }
};

async function getImageFromUrl(url) {
    // This function needs to be implemented to download the image from the given URL.
    // Use a suitable method to fetch the image as a Buffer for processing with sharp.
    // Placeholder for demonstration; please implement according to your needs.
}
