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

    // Enable CORS for the /quotes resource
    mainPath.addMethod('OPTIONS', new apigateway.MockIntegration({
      integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET'"
      },
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
      }
    }), {
      methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      }
      }]
    });

    // Add usage plan and API key for rate limiting
    const plan = api.addUsagePlan('UsagePlan', {
      name: 'QuoteApiUsagePlan',
      throttle: {
      rateLimit: 100 / 3600, // ~0.0277 req/sec = 100 req/hour
      burstLimit: 5,
      },
      quota: {
      limit: 100,
      period: apigateway.Period.HOUR,
      },
    });

    const apiKey = api.addApiKey('ApiKey');
    plan.addApiKey(apiKey);
    plan.addApiStage({
      stage: api.deploymentStage,
      throttle: [
      {
        method: mainPath.methods.find(m => m.httpMethod === 'GET'),
        throttle: {
        rateLimit: 100 / 3600,
        burstLimit: 5,
        },
      },
      ],
    });

    //    mainPath.addMethod('GET', new apigateway.LambdaIntegration(getQuotes), {
    //   methodResponses: [{ statusCode: '200' }],
    // });
  }
}
