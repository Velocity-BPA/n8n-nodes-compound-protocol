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
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'CToken',
            value: 'cToken',
          },
          {
            name: 'MarketHistory',
            value: 'marketHistory',
          },
          {
            name: 'Governance',
            value: 'governance',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          }
        ],
        default: 'account',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    {
      name: 'Get Account',
      value: 'getAccount',
      description: 'Get account summary with all positions',
      action: 'Get account summary',
    },
    {
      name: 'Get Account Service',
      value: 'getAccountService',
      description: 'Get account service status and health',
      action: 'Get account service status',
    },
  ],
  default: 'getAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['cToken'] } },
  options: [
    { name: 'Get All CTokens', value: 'getAllCTokens', description: 'Get all cToken market data', action: 'Get all cToken market data' },
    { name: 'Get CToken Service', value: 'getCTokenService', description: 'Get cToken service status', action: 'Get cToken service status' }
  ],
  default: 'getAllCTokens',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['marketHistory'] } },
  options: [
    {
      name: 'Get Market History Graph',
      value: 'getMarketHistoryGraph',
      description: 'Get historical market data for graphing',
      action: 'Get market history graph'
    }
  ],
  default: 'getMarketHistoryGraph',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['governance'] } },
  options: [
    { name: 'Get All Proposals', value: 'getAllProposals', description: 'Get all governance proposals', action: 'Get all proposals' },
    { name: 'Get Proposal Votes', value: 'getProposalVotes', description: 'Get votes for specific proposals', action: 'Get proposal votes' },
    { name: 'Get Governance Accounts', value: 'getGovernanceAccounts', description: 'Get governance account details', action: 'Get governance accounts' }
  ],
  default: 'getAllProposals',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transaction'] } },
  options: [
    {
      name: 'Get Account Transactions',
      value: 'getAccountTransactions',
      description: 'Get transaction history for accounts',
      action: 'Get account transactions'
    }
  ],
  default: 'getAccountTransactions',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getAccount'],
    },
  },
  default: '',
  placeholder: '0x1234...,0x5678...',
  description: 'Comma-separated list of Ethereum addresses to get account data for',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getAccount'],
    },
  },
  default: 0,
  description: 'Block number for historical data (0 for latest)',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getAccount'],
    },
  },
  options: [
    {
      name: 'Ethereum Mainnet',
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
  ],
  default: 'mainnet',
  description: 'Blockchain network to query',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['account'],
      operation: ['getAccountService'],
    },
  },
  default: '',
  placeholder: '0x1234...,0x5678...',
  description: 'Comma-separated list of Ethereum addresses to check service status for',
},
{
  displayName: 'Block Timestamp',
  name: 'blockTimestamp',
  type: 'number',
  displayOptions: { show: { resource: ['cToken'], operation: ['getAllCTokens'] } },
  default: '',
  description: 'Block timestamp for historical data',
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: { show: { resource: ['cToken'], operation: ['getAllCTokens'] } },
  default: 100,
  description: 'Number of results per page',
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  displayOptions: { show: { resource: ['cToken'], operation: ['getAllCTokens'] } },
  default: 1,
  description: 'Page number for pagination',
},
{
  displayName: 'Asset',
  name: 'asset',
  type: 'string',
  required: true,
  default: '',
  description: 'The asset symbol to get market history for (e.g., ETH, USDC)',
  displayOptions: {
    show: {
      resource: ['marketHistory'],
      operation: ['getMarketHistoryGraph']
    }
  }
},
{
  displayName: 'Minimum Block Timestamp',
  name: 'minBlockTimestamp',
  type: 'number',
  required: true,
  default: 0,
  description: 'The minimum block timestamp for the historical data range',
  displayOptions: {
    show: {
      resource: ['marketHistory'],
      operation: ['getMarketHistoryGraph']
    }
  }
},
{
  displayName: 'Maximum Block Timestamp',
  name: 'maxBlockTimestamp',
  type: 'number',
  required: true,
  default: 0,
  description: 'The maximum block timestamp for the historical data range',
  displayOptions: {
    show: {
      resource: ['marketHistory'],
      operation: ['getMarketHistoryGraph']
    }
  }
},
{
  displayName: 'Number of Buckets',
  name: 'numBuckets',
  type: 'number',
  required: false,
  default: 100,
  description: 'The number of data points/buckets to return for the graph',
  displayOptions: {
    show: {
      resource: ['marketHistory'],
      operation: ['getMarketHistoryGraph']
    }
  }
},
{
  displayName: 'Proposal IDs',
  name: 'proposalIds',
  type: 'string',
  displayOptions: { show: { resource: ['governance'], operation: ['getAllProposals'] } },
  default: '',
  description: 'Comma-separated list of specific proposal IDs to filter',
  placeholder: '1,2,3'
},
{
  displayName: 'State',
  name: 'state',
  type: 'options',
  displayOptions: { show: { resource: ['governance'], operation: ['getAllProposals'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Pending', value: 'pending' },
    { name: 'Active', value: 'active' },
    { name: 'Canceled', value: 'canceled' },
    { name: 'Defeated', value: 'defeated' },
    { name: 'Succeeded', value: 'succeeded' },
    { name: 'Queued', value: 'queued' },
    { name: 'Expired', value: 'expired' },
    { name: 'Executed', value: 'executed' }
  ],
  default: '',
  description: 'Filter proposals by state'
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: { show: { resource: ['governance'], operation: ['getAllProposals'] } },
  default: 100,
  description: 'Number of results to return per page',
  typeOptions: { minValue: 1, maxValue: 1000 }
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  displayOptions: { show: { resource: ['governance'], operation: ['getAllProposals'] } },
  default: 1,
  description: 'Page number for pagination',
  typeOptions: { minValue: 1 }
},
{
  displayName: 'Proposal ID',
  name: 'proposalId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['governance'], operation: ['getProposalVotes'] } },
  default: '',
  description: 'The proposal ID to get votes for'
},
{
  displayName: 'Support',
  name: 'support',
  type: 'options',
  displayOptions: { show: { resource: ['governance'], operation: ['getProposalVotes'] } },
  options: [
    { name: 'All', value: '' },
    { name: 'Against', value: 'false' },
    { name: 'For', value: 'true' }
  ],
  default: '',
  description: 'Filter by vote support (for/against)'
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: { show: { resource: ['governance'], operation: ['getProposalVotes'] } },
  default: 100,
  description: 'Number of results to return per page',
  typeOptions: { minValue: 1, maxValue: 1000 }
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  displayOptions: { show: { resource: ['governance'], operation: ['getProposalVotes'] } },
  default: 1,
  description: 'Page number for pagination',
  typeOptions: { minValue: 1 }
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  displayOptions: { show: { resource: ['governance'], operation: ['getGovernanceAccounts'] } },
  default: '',
  description: 'Comma-separated list of account addresses to get governance details for',
  placeholder: '0x123...,0x456...'
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: { show: { resource: ['governance'], operation: ['getGovernanceAccounts'] } },
  default: 100,
  description: 'Number of results to return per page',
  typeOptions: { minValue: 1, maxValue: 1000 }
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  displayOptions: { show: { resource: ['governance'], operation: ['getGovernanceAccounts'] } },
  default: 1,
  description: 'Page number for pagination',
  typeOptions: { minValue: 1 }
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getAccountTransactions']
    }
  },
  default: '',
  description: 'Comma-separated list of Ethereum addresses to get transactions for',
  placeholder: '0x1234...,0x5678...'
},
{
  displayName: 'Max Health',
  name: 'maxHealth',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getAccountTransactions']
    }
  },
  default: undefined,
  description: 'Maximum account health factor to filter by'
},
{
  displayName: 'Min Borrow Value in ETH',
  name: 'minBorrowValueInEth',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getAccountTransactions']
    }
  },
  default: undefined,
  description: 'Minimum borrow value in ETH to filter by'
},
{
  displayName: 'Page Size',
  name: 'pageSize',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getAccountTransactions']
    }
  },
  default: 50,
  description: 'Number of transactions to return per page',
  typeOptions: {
    minValue: 1,
    maxValue: 100
  }
},
{
  displayName: 'Page Number',
  name: 'pageNumber',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getAccountTransactions']
    }
  },
  default: 1,
  description: 'Page number for pagination',
  typeOptions: {
    minValue: 1
  }
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'cToken':
        return [await executeCTokenOperations.call(this, items)];
      case 'marketHistory':
        return [await executeMarketHistoryOperations.call(this, items)];
      case 'governance':
        return [await executeGovernanceOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
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
        case 'getAccount': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i) as number;
          const network = this.getNodeParameter('network', i) as string;

          const queryParams = new URLSearchParams();
          queryParams.append('addresses', addresses);
          if (blockNumber > 0) {
            queryParams.append('block_number', blockNumber.toString());
          }
          if (network && network !== 'mainnet') {
            queryParams.append('network', network);
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/account?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountService': {
          const addresses = this.getNodeParameter('addresses', i) as string;

          const queryParams = new URLSearchParams();
          queryParams.append('addresses', addresses);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/account/service?${queryParams.toString()}`,
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
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeCTokenOperations(
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
          const blockTimestamp = this.getNodeParameter('blockTimestamp', i) as number;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i) as number;

          const queryParams: string[] = [];
          if (blockTimestamp) queryParams.push(`block_timestamp=${blockTimestamp}`);
          if (pageSize) queryParams.push(`page_size=${pageSize}`);
          if (pageNumber) queryParams.push(`page_number=${pageNumber}`);

          const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ctoken${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCTokenService': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ctoken/service`,
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
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeMarketHistoryOperations(
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
        case 'getMarketHistoryGraph': {
          const asset = this.getNodeParameter('asset', i) as string;
          const minBlockTimestamp = this.getNodeParameter('minBlockTimestamp', i) as number;
          const maxBlockTimestamp = this.getNodeParameter('maxBlockTimestamp', i) as number;
          const numBuckets = this.getNodeParameter('numBuckets', i) as number;

          const queryParams = new URLSearchParams({
            asset: asset,
            min_block_timestamp: minBlockTimestamp.toString(),
            max_block_timestamp: maxBlockTimestamp.toString(),
            num_buckets: numBuckets.toString()
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/market_history/graph?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
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
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i) as number;

          const queryParams: any = {
            page_size: pageSize,
            page_number: pageNumber
          };

          if (proposalIds) {
            queryParams.proposal_ids = proposalIds;
          }
          if (state) {
            queryParams.state = state;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/governance/proposals?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProposalVotes': {
          const proposalId = this.getNodeParameter('proposalId', i) as string;
          const support = this.getNodeParameter('support', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i) as number;

          const queryParams: any = {
            proposal_id: proposalId,
            page_size: pageSize,
            page_number: pageNumber
          };

          if (support) {
            queryParams.support = support;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/governance/proposal_vote_receipts?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getGovernanceAccounts': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i) as number;

          const queryParams: any = {
            page_size: pageSize,
            page_number: pageNumber
          };

          if (addresses) {
            queryParams.addresses = addresses;
          }

          const queryString = new URLSearchParams(queryParams).toString();
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/governance/accounts?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionOperations(
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
        case 'getAccountTransactions': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const maxHealth = this.getNodeParameter('maxHealth', i) as number;
          const minBorrowValueInEth = this.getNodeParameter('minBorrowValueInEth', i) as number;
          const pageSize = this.getNodeParameter('pageSize', i) as number;
          const pageNumber = this.getNodeParameter('pageNumber', i) as number;

          const queryParams: any = {
            addresses: addresses
          };

          if (maxHealth !== undefined) {
            queryParams.max_health = maxHealth;
          }

          if (minBorrowValueInEth !== undefined) {
            queryParams.min_borrow_value_in_eth = minBorrowValueInEth;
          }

          if (pageSize !== undefined) {
            queryParams.page_size = pageSize;
          }

          if (pageNumber !== undefined) {
            queryParams.page_number = pageNumber;
          }

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/account/transactions?${queryString}`,
            headers: {
              'X-API-KEY': credentials.apiKey
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
