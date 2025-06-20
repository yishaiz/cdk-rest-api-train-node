import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';

export class CdkRestApiTrainNodeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getQuotes = new Function(this, 'GetQuotesLambda', {
      runtime: Runtime.NODEJS_18_X,
      code: cdk.aws_lambda.Code.fromAsset(join(__dirname, '../lambdas')),
      handler: 'getQuotes.handler',
    });
  }
}
