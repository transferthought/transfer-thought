export type AmplifyDependentResourcesAttributes = {
  "api": {
    "Stripe": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "transferthought": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string"
    }
  },
  "auth": {
    "transferthought1015a9c5": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "CreatedSNSRole": "string",
      "GoogleWebClient": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    },
    "userPoolGroups": {
      "testGroupRole": "string"
    }
  },
  "function": {
    "CreateAssetVariation": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "StripeCheckoutSession": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "StripeWebhook": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "transferthought1015a9c5PostConfirmation": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "transferthought1015a9c5PreAuthentication": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "transferthought1015a9c5PreSignup": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "predictions": {
    "speechGeneratoreebef0ec": {
      "language": "string",
      "region": "string",
      "voice": "string"
    },
    "transcriptionb08cd37b": {
      "language": "string",
      "region": "string"
    }
  },
  "storage": {
    "s3f39ed916": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}