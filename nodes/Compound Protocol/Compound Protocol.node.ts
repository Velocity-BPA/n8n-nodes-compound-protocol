/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-compoundprotocol/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class CompoundProtocol implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Compound Protocol',
    name: 'compoundprotocol',
    icon: 'file:compoundprotocol.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Compound Protocol API',
    defaults: {
      name: 'Compound Protocol',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'compoundprotocolApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'CTokens',
            value: 'cTokens',
          },
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Governance',
            value: 'governance',
          },
          {
            name: 'PriceFeeds',
            value: 'priceFeeds',
          },
          {
            name: 'CometMarkets',
            value: 'cometMarkets',
          },
          {
            name: 'Analytics',
            value: 'analytics',
          }
        ],
        default: 'cTokens',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['cTokens'],
    },
  },
  options: [
    {
      name: 'Get All CTokens',
      value: 'getAllCTokens',
      description: 'Get all cToken market data',
      action: 'Get all cTokens',
    },
    {
      name: 'Get CToken',
      value: 'getCToken',
      description: 'Get specific cToken details',
      action: 'Get specific cToken',
    },
    {
      name: 'Get CToken Accounts',
      value: 'getCTokenAccounts',
      description: 'Get accounts for specific cToken',
      action: 'Get cToken accounts',
    },
    {
      name: 'Get Market History',
      value: 'getMarketHistory',
      description: 'Get historical market data for cTokens',
      action: 'Get market history',
    },
  ],
  default: 'getAllCTokens',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
    },
  },
  options: [
    {
      name: 'Get All Accounts',
      value: 'getAllAccounts',
      description: 'Get paginated list of all accounts',
      action: 'Get all accounts',
    },
    {
      name: 'Get Account',
      value: 'getAccount',
      description: 'Get specific account details and positions',
      action: 'Get account details',
    },
    {
      name: 'Get Account Transactions',
      value: 'getAccountTransactions',
      description: 'Get account transaction history',
      action: 'Get account transactions',
    },
    {
      name: 'Get Account Positions',
      value: 'getAccountPositions',
      description: 'Get current account positions',
      action: 'Get account positions',
    },
  ],
  default: 'getAllAccounts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['governance'],
    },
  },
  options: [
    {
      name: 'Get All Proposals',
      value: 'getAllProposals',
      description: 'Get all governance proposals',
      action: 'Get all proposals',
    },
    {
      name: 'Get Proposal',
      value: 'getProposal',
      description: 'Get specific proposal details',
      action: 'Get proposal',
    },
    {
      name: 'Get Proposal Votes',
      value: 'getProposalVotes',
      description: 'Get votes for a proposal',
      action: 'Get proposal votes',
    },
    {
      name: 'Get Governance Account',
      value: 'getGovernanceAccount',
      description: 'Get account governance data including voting power',
      action: 'Get governance account',
    },
  ],
  default: 'getAllProposals',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['priceFeeds'],
    },
  },
  options: [
    {
      name: 'Get All Prices',
      value: 'getAllPrices',
      description: 'Get current prices for all supported assets',
      action: 'Get all prices',
    },
    {
      name: 'Get Asset Price',
      value: 'getAssetPrice',
      description: 'Get current price for specific asset',
      action: 'Get asset price',
    },
    {
      name: 'Get Price History',
      value: 'getPriceHistory',
      description: 'Get historical price data',
      action: 'Get price history',
    },
  ],
  default: 'getAllPrices',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['cometMarkets'],
    },
  },
  options: [
    {
      name: 'Get All Comet Markets',
      value: 'getAllCometMarkets',
      description: 'Get all Comet market configurations',
      action: 'Get all comet markets',
    },
    {
      name: 'Get Comet Market',
      value: 'getCometMarket',
      description: 'Get specific Comet market details',
      action: 'Get comet market',
    },
    {
      name: 'Get Comet Account',
      value: 'getCometAccount',
      description: 'Get account positions in Comet markets',
      action: 'Get comet account',
    },
    {
      name: 'Get Comet Transactions',
      value: 'getCometTransactions',
      description: 'Get Comet transaction history',
      action: 'Get comet transactions',
    },
  ],
  default: 'getAllCometMarkets',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
    },
  },
  options: [
    {
      name: 'Get Protocol Snapshot',
      value: 'getProtocolSnapshot',
      description: 'Get current protocol metrics snapshot',
      action: 'Get protocol snapshot',
    },
    {
      name: 'Get Protocol History',
      value: 'getProtocolHistory',
      description: 'Get historical protocol metrics',
      action: 'Get protocol history',
    },
    {
      name: 'Get Yield Farming Data',
      value: 'getYieldFarmingData',
      description: 'Get yield farming opportunities and APY data',
      action: 'Get yield farming data',
    },
    {
      name: 'Get Utilization Rates',
      value: 'getUtilizationRates',
      description: 'Get current utilization rates across markets',
      action: 'Get utilization rates',
    },
  ],
  default: 'getProtocolSnapshot',
},
      // Parameter definitions
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['cTokens'],
      operation: ['getCToken', 'getCTokenAccounts'],
    },
  },
  default: '',
  description: 'The cToken address',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['cTokens'],
      operation: ['getCTokenAccounts'],
    },
  },
  default: 50,
  description: 'Number of accounts to return per page',
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['cTokens'],
      operation: ['getCTokenAccounts'],
    },
  },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['cTokens'],
      operation: ['getMarketHistory'],
    },
  },
  default: '',
  description: 'The asset symbol (e.g., cDAI, cUSDC)',
},
{
  displayName: 'Min Block Timestamp',
  name: 'minBlockTimestamp',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['cTokens'],
      operation: ['getMarketHistory'],
    },
  },
  default: null,
  description: 'Minimum block timestamp for the historical data range',
},
{
  displayName: 'Max Block Timestamp',
  name: 'maxBlockTimestamp',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['cTokens'],
      operation: ['getMarketHistory'],
    },
  },
  default: null,
  description: 'Maximum block timestamp for the historical data range',
},
{
  displayName: 'Number of Buckets',
  name: 'numBuckets',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['cTokens'],
      operation: ['getMarketHistory'],
    },
  },
  default: 100,
  description: 'Number of data points to return',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAllAccounts'],
    },
  },
  default: 100,
  description: 'Number of results per page',
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAllAccounts'],
    },
  },
  default: 1,
  description: 'Page number to retrieve',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAllAccounts'],
    },
  },
  default: '',
  description: 'Comma-separated list of addresses to filter by',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccount', 'getAccountTransactions', 'getAccountPositions'],
    },
  },
  default: '',
  description: 'The account address',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccount'],
    },
  },
  default: '',
  description: 'Block number for historical data',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions'],
    },
  },
  default: 100,
  description: 'Number of results per page',
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions'],
    },
  },
  default: 1,
  description: 'Page number to retrieve',
},
{
  displayName: 'Order',
  name: 'order',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions'],
    },
  },
  options: [
    {
      name: 'Ascending',
      value: 'ASC',
    },
    {
      name: 'Descending',
      value: 'DESC',
    },
  ],
  default: 'DESC',
  description: 'Sort order for transactions',
},
{
  displayName: 'Sort By',
  name: 'sort',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions'],
    },
  },
  options: [
    {
      name: 'Block Time',
      value: 'block_time',
    },
    {
      name: 'Block Number',
      value: 'block_number',
    },
  ],
  default: 'block_time',
  description: 'Field to sort transactions by',
},
{
  displayName: 'Proposal IDs',
  name: 'proposalIds',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['governance'],
      operation: ['getAllProposals'],
    },
  },
  default: '',
  description: 'Comma-separated list of proposal IDs to filter',
},
{
  displayName: 'State',
  name: 'state',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['governance'],
      operation: ['getAllProposals'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Pending',
      value: 'pending',
    },
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Canceled',
      value: 'canceled',
    },
    {
      name: 'Defeated',
      value: 'defeated',
    },
    {
      name: 'Succeeded',
      value: 'succeeded',
    },
    {
      name: 'Queued',
      value: 'queued',
    },
    {
      name: 'Expired',
      value: 'expired',
    },
    {
      name: 'Executed',
      value: 'executed',
    },
  ],
  default: '',
  description: 'Filter proposals by state',
},
{
  displayName: 'With Detail',
  name: 'withDetail',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['governance'],
      operation: ['getAllProposals'],
    },
  },
  default: true,
  description: 'Whether to include detailed proposal information',
},
{
  displayName: 'Proposal ID',
  name: 'proposalId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['governance'],
      operation: ['getProposal', 'getProposalVotes'],
    },
  },
  default: '',
  description: 'The ID of the proposal',
},
{
  displayName: 'Support',
  name: 'support',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['governance'],
      operation: ['getProposalVotes'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'For',
      value: 'true',
    },
    {
      name: 'Against',
      value: 'false',
    },
    {
      name: 'Abstain',
      value: 'abstain',
    },
  ],
  default: '',
  description: 'Filter votes by support type',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['governance'],
      operation: ['getProposalVotes'],
    },
  },
  default: 100,
  description: 'Number of votes to return per page',
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['governance'],
      operation: ['getProposalVotes'],
    },
  },
  default: 1,
  description: 'Page number to retrieve',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['governance'],
      operation: ['getGovernanceAccount'],
    },
  },
  default: '',
  description: 'The account address to get governance data for',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['priceFeeds'],
      operation: ['getAssetPrice'],
    },
  },
  default: '',
  description: 'The asset symbol (e.g., ETH, USDC, WBTC)',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['priceFeeds'],
      operation: ['getPriceHistory'],
    },
  },
  default: '',
  description: 'The asset symbol for historical data',
},
{
  displayName: 'Min Timestamp',
  name: 'minTimestamp',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['priceFeeds'],
      operation: ['getPriceHistory'],
    },
  },
  default: 0,
  description: 'The minimum timestamp for historical data (Unix timestamp)',
},
{
  displayName: 'Max Timestamp',
  name: 'maxTimestamp',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['priceFeeds'],
      operation: ['getPriceHistory'],
    },
  },
  default: 0,
  description: 'The maximum timestamp for historical data (Unix timestamp)',
},
{
  displayName: 'Number of Buckets',
  name: 'numBuckets',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['priceFeeds'],
      operation: ['getPriceHistory'],
    },
  },
  default: 100,
  description: 'The number of data points to return (1-1000)',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  options: [
    {
      name: 'Mainnet',
      value: 'mainnet',
    },
    {
      name: 'Polygon',
      value: 'polygon',
    },
    {
      name: 'Arbitrum',
      value: 'arbitrum',
    },
    {
      name: 'Base',
      value: 'base',
    },
  ],
  required: true,
  displayOptions: {
    show: {
      resource: ['cometMarkets'],
      operation: ['getAllCometMarkets', 'getCometMarket', 'getCometAccount', 'getCometTransactions'],
    },
  },
  default: 'mainnet',
  description: 'The network to query',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['cometMarkets'],
      operation: ['getCometMarket', 'getCometAccount', 'getCometTransactions'],
    },
  },
  default: '',
  description: 'The market address or identifier',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['cometMarkets'],
      operation: ['getCometAccount'],
    },
  },
  default: '',
  description: 'The account address',
},
{
  displayName: 'Account',
  name: 'account',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['cometMarkets'],
      operation: ['getCometTransactions'],
    },
  },
  default: '',
  description: 'Filter transactions by account address',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['cometMarkets'],
      operation: ['getCometTransactions'],
    },
  },
  default: 100,
  description: 'Number of transactions per page',
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['cometMarkets'],
      operation: ['getCometTransactions'],
    },
  },
  default: 1,
  description: 'Page number to retrieve',
},
{
  displayName: 'Min Timestamp',
  name: 'minTimestamp',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getProtocolHistory'],
    },
  },
  default: 0,
  description: 'Minimum timestamp for historical data',
},
{
  displayName: 'Max Timestamp',
  name: 'maxTimestamp',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getProtocolHistory'],
    },
  },
  default: 0,
  description: 'Maximum timestamp for historical data',
},
{
  displayName: 'Number of Buckets',
  name: 'numBuckets',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getProtocolHistory'],
    },
  },
  default: 100,
  description: 'Number of data buckets to return',
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getYieldFarmingData', 'getUtilizationRates'],
    },
  },
  default: '',
  description: 'Market address or symbol to filter by',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'cTokens':
        return [await executeCTokensOperations.call(this, items)];
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'governance':
        return [await executeGovernanceOperations.call(this, items)];
      case 'priceFeeds':
        return [await executePriceFeedsOperations.call(this, items)];
      case 'cometMarkets':
        return [await executeCometMarketsOperations.call(this, items)];
      case 'analytics':
        return [await executeAnalyticsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeCTokensOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('compoundprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllCTokens': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ctoken`,
            headers: {
              'X-API-KEY': credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCToken': {
          const address = this.getNodeParameter('address', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ctoken/${address}`,
            headers: {
              'X-API-KEY': credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCTokenAccounts': {
          const address = this.getNodeParameter('address', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i) as number;
          
          const queryParams: string[] = [];
          if (pageSize) {
            queryParams.push(`page_size=${pageSize}`);
          }
          if (pageNumber) {
            queryParams.push(`page_number=${pageNumber}`);
          }
          
          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ctoken/${address}/account${queryString}`,
            headers: {
              'X-API-KEY': credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMarketHistory': {
          const asset = this.getNodeParameter('asset', i) as string;
          const minBlockTimestamp = this.getNodeParameter('minBlockTimestamp', i) as number;
          const maxBlockTimestamp = this.getNodeParameter('maxBlockTimestamp', i) as number;
          const numBuckets = this.getNodeParameter('numBuckets', i) as number;

          const queryParams: string[] = [`asset=${asset}`];
          if (minBlockTimestamp) {
            queryParams.push(`min_block_timestamp=${minBlockTimestamp}`);
          }
          if (maxBlockTimestamp) {
            queryParams.push(`max_block_timestamp=${maxBlockTimestamp}`);
          }
          if (numBuckets) {
            queryParams.push(`num_buckets=${numBuckets}`);
          }

          const queryString = `?${queryParams.join('&')}`;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/market_history/graph${queryString}`,
            headers: {
              'X-API-KEY': credentials.apiKey,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeAccountsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('compoundprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAllAccounts': {
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i) as number;
          const addresses = this.getNodeParameter('addresses', i) as string;

          const params: any = {
            page_size: pageSize,
            page_number: pageNumber,
          };

          if (addresses) {
            params.addresses = addresses;
          }

          const queryString = new URLSearchParams(params).toString();

          const options: any = {
            method: 'GET',
            url: `https://api.compound.finance/api/v2/account?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccount': {
          const address = this.getNodeParameter('address', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i) as number;

          let url = `https://api.compound.finance/api/v2/account/${address}`;
          
          if (blockNumber) {
            url += `?block_number=${blockNumber}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i) as number;
          const order = this.getNodeParameter('order', i) as string;
          const sort = this.getNodeParameter('sort', i) as string;

          const params: any = {
            page_size: pageSize,
            page_number: pageNumber,
            order,
            sort,
          };

          const queryString = new URLSearchParams(params).toString();

          const options: any = {
            method: 'GET',
            url: `https://api.compound.finance/api/v2/account/${address}/transactions?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountPositions': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'GET',
            url: `https://api.compound.finance/api/v2/account/${address}/positions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeGovernanceOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('compoundprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAllProposals': {
          const proposalIds = this.getNodeParameter('proposalIds', i) as string;
          const state = this.getNodeParameter('state', i) as string;
          const withDetail = this.getNodeParameter('withDetail', i) as boolean;
          
          const params = new URLSearchParams();
          if (proposalIds) {
            params.append('proposal_ids', proposalIds);
          }
          if (state) {
            params.append('state', state);
          }
          params.append('with_detail', withDetail.toString());
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/governance/proposals?${params.toString()}`,
            headers: {
              'X-COMPOUND-API-KEY': credentials.apiKey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getProposal': {
          const proposalId = this.getNodeParameter('proposalId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/governance/proposals/${proposalId}`,
            headers: {
              'X-COMPOUND-API-KEY': credentials.apiKey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getProposalVotes': {
          const proposalId = this.getNodeParameter('proposalId', i) as string;
          const support = this.getNodeParameter('support', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i) as number;
          
          const params = new URLSearchParams();
          if (support) {
            params.append('support', support);
          }
          params.append('page_size', pageSize.toString());
          params.append('page_number', pageNumber.toString());
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/governance/proposals/${proposalId}/votes?${params.toString()}`,
            headers: {
              'X-COMPOUND-API-KEY': credentials.apiKey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getGovernanceAccount': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/governance/accounts/${address}`,
            headers: {
              'X-COMPOUND-API-KEY': credentials.apiKey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.response?.body?.message) {
          throw new NodeApiError(this.getNode(), error.response.body, { 
            message: error.response.body.message,
            httpCode: error.response.statusCode,
          });
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }
  
  return returnData;
}

async function executePriceFeedsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('compoundprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAllPrices': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/price_feed`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAssetPrice': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          if (!symbol) {
            throw new NodeOperationError(this.getNode(), 'Symbol is required for getAssetPrice operation');
          }
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/price_feed/${symbol}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPriceHistory': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          if (!symbol) {
            throw new NodeOperationError(this.getNode(), 'Symbol is required for getPriceHistory operation');
          }

          const minTimestamp = this.getNodeParameter('minTimestamp', i, 0) as number;
          const maxTimestamp = this.getNodeParameter('maxTimestamp', i, 0) as number;
          const numBuckets = this.getNodeParameter('numBuckets', i, 100) as number;

          const queryParams: any = {
            symbol,
            num_buckets: numBuckets,
          };

          if (minTimestamp > 0) {
            queryParams.min_timestamp = minTimestamp;
          }

          if (maxTimestamp > 0) {
            queryParams.max_timestamp = maxTimestamp;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/price_feed/history?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (error.httpCode) {
        throw new NodeApiError(this.getNode(), error, { itemIndex: i });
      }
      
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
      }
    }
  }

  return returnData;
}

async function executeCometMarketsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('compoundprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAllCometMarkets': {
          const network = this.getNodeParameter('network', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/comet/markets`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getCometMarket': {
          const market = this.getNodeParameter('market', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/comet/markets/${market}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getCometAccount': {
          const address = this.getNodeParameter('address', i) as string;
          const market = this.getNodeParameter('market', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/comet/accounts/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              market,
              network,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getCometTransactions': {
          const market = this.getNodeParameter('market', i) as string;
          const network = this.getNodeParameter('network', i) as string;
          const account = this.getNodeParameter('account', i, '') as string;
          const pageSize = this.getNodeParameter('pageSize', i, 100) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i, 1) as number;
          
          const queryParams: any = {
            market,
            network,
            page_size: pageSize,
            page_number: pageNumber,
          };
          
          if (account) {
            queryParams.account = account;
          }
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/comet/transactions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: queryParams,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
            itemIndex: i,
          });
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error, { itemIndex: i });
        }
        throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
      }
    }
  }
  
  return returnData;
}

async function executeAnalyticsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('compoundprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getProtocolSnapshot': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/protocol/snapshot`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProtocolHistory': {
          const minTimestamp = this.getNodeParameter('minTimestamp', i) as number;
          const maxTimestamp = this.getNodeParameter('maxTimestamp', i) as number;
          const numBuckets = this.getNodeParameter('numBuckets', i) as number;

          const queryParams: string[] = [];
          if (minTimestamp) queryParams.push(`min_timestamp=${minTimestamp}`);
          if (maxTimestamp) queryParams.push(`max_timestamp=${maxTimestamp}`);
          if (numBuckets) queryParams.push(`num_buckets=${numBuckets}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/protocol/history${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getYieldFarmingData': {
          const market = this.getNodeParameter('market', i) as string;
          const queryString = market ? `?market=${encodeURIComponent(market)}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/yield_farming${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUtilizationRates': {
          const market = this.getNodeParameter('market', i) as string;
          const queryString = market ? `?market=${encodeURIComponent(market)}` : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/utilization${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
          );
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}
