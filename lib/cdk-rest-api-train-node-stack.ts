import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class CdkRestApiTrainNodeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getQuotes = new Function(this, 'GetQuotesLambda', {
      runtime: Runtime.NODEJS_18_X,
      code: cdk.aws_lambda.Code.fromAsset(join(__dirname, '../lambdas')),
      handler: 'getQuotes.handler',
    });

    const api = new RestApi(this, 'quotes-api', {
      description: 'API for fetching quotes',
    });

    const mainPath = api.root.addResource('quotes');

    mainPath.addMethod('GET', new apigateway.LambdaIntegration(getQuotes));

    //    mainPath.addMethod('GET', new apigateway.LambdaIntegration(getQuotes), {
    //   methodResponses: [{ statusCode: '200' }],
    // });
  }
}
