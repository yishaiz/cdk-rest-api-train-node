import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

export class CdkRestApiTrainNodeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'QuotesTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const handlerFunction = new Function(this, 'quotesHandler', {
      runtime: Runtime.NODEJS_18_X,
      code: cdk.aws_lambda.Code.fromAsset(join(__dirname, '../lambdas')),
      handler: 'app.handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // grant permissions to the Lambda function to read/write to the DynamoDB table

    table.grantReadWriteData(handlerFunction);

    const api = new RestApi(this, 'quotes-api', {
      description: 'API for fetching quotes',
    });

    const mainPath = api.root.addResource('quotes');

    const method = mainPath.addMethod(
      'GET',
      new apigateway.LambdaIntegration(handlerFunction)
    );
  }
}

/*
    // 1. צור API Key
    const apiKey = api.addApiKey('ApiKey');

    // 2. צור Usage Plan עם הגבלת קצב (rate) ו‑burst
    const plan = api.addUsagePlan('UsagePlan', {
      name: 'QuoteApiUsagePlan',
      throttle: {
        rateLimit: 5, // קריאות בשנייה
        burstLimit: 10, // קריאות מקבילות
      },
      quota: {
        limit: 1000, // תקופה יומית
        period: apigateway.Period.DAY,
      },
    });

    // 3. חבר API Key ל‑Usage Plan
    plan.addApiKey(apiKey);

    // 4. חבר את השלב (stage) שלך ל‑Usage Plan
    plan.addApiStage({
      stage: api.deploymentStage,
      throttle: [
        {
          method: method,
          throttle: {
            rateLimit: 2, // לקביעת הגבלה ספציפית על GET /quotes
            burstLimit: 5,
          },
        },
      ],
    });
  }
}
*/
