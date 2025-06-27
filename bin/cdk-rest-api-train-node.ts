#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkRestApiTrainNodeStack } from '../lib/cdk-rest-api-train-node-stack';

const app = new cdk.App();
new CdkRestApiTrainNodeStack(app, 'CdkRestApiTrainNodeStack', {});
