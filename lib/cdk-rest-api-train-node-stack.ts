import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { TableViewer } from 'cdk-dynamo-table-viewer';

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

    new TableViewer(this, 'QuotesTableViewer', {
      title: 'Quotes Table',
      table, // The DynamoDB table to view
      sortBy: '-createdAt',
    });

    // Integration
    const handlerIntegration = new apigateway.LambdaIntegration(
      handlerFunction
    );

    const mainPath = api.root.addResource('quotes');
    const idPath = mainPath.addResource('{id}');

    // GET
    mainPath.addMethod('GET', handlerIntegration);

    // POST
    mainPath.addMethod('POST', handlerIntegration);

    // DELETE
    idPath.addMethod('DELETE', handlerIntegration);

    idPath.addMethod('GET', handlerIntegration);
    idPath.addMethod('PUT', handlerIntegration);
  }
}
