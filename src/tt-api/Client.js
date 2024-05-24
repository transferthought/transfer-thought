/* eslint-disable */

import { Auth, Hub } from 'aws-amplify';
import awsConfig from '../aws-exports';

class Client {
    constructor() {
        this.clientDeferred = {};
        this.clientDeferred.promise = new Promise((resolve, reject) => {
            this.clientDeferred.resolve = resolve;
            this.clientDeferred.reject = reject;
        });
        this.subscribe();
    }

    initialize() {
        return this.clientDeferred.promise;
    }

    subscribe() {
        // register auth listeners
        Hub.listen('auth', async (data) => {
            // switch (data.payload.event) {
            //     case 'configured':
            //         try {
            //             // check to see if there is any currently authenticated user.
            //             // We do this before initialization to ensure
            //             // we can get the correct Authorized vs Unauthorized Api Client
            //             await Auth.currentAuthenticatedUser();
            //         } catch (e) {
            //             console.error('No user found: ', e);
            //         }
            //         this.clientDeferred.resolve();
            //         break;
            //     default:
            //         break;
            // }
        });
    }

    getAssetBase() {
        return `https://${awsConfig.aws_user_files_s3_bucket}.s3.${awsConfig.aws_user_files_s3_bucket_region}.amazonaws.com/public`;
    }

    getAssetUrl(id, key) {
        return `${this.getAssetBase()}/${id}.${key}`;
    }
}

export default new Client();
