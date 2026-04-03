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
            name: 'Market History',
            value: 'marketHistory',
          },
          {
            name: 'Governance',
            value: 'governance',
          },
          {
            name: 'PriceData',
            value: 'priceData',
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
    { name: 'Get Account', value: 'getAccount', description: 'Get account summary including total supply/borrow balances', action: 'Get account summary' },
    { name: 'Get Account Service', value: 'getAccountService', description: 'Get account service data and health metrics', action: 'Get account service data' },
    { name: 'Get Account History', value: 'getAccountHistory', description: 'Get historical account activity and transactions', action: 'Get account history' }
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
    { name: 'Get All CTokens', value: 'getAllCTokens', description: 'Get all available cToken markets and their details', action: 'Get all cTokens' },
    { name: 'Get CToken Service', value: 'getCTokenService', description: 'Get cToken service data including rates and metrics', action: 'Get cToken service' },
    { name: 'Get CToken History', value: 'getCTokenHistory', description: 'Get historical cToken market data and events', action: 'Get cToken history' }
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
			resource: ['marketHistory'],
		},
	},
	options: [
		{
			name: 'Get Market Graph',
			value: 'getMarketGraph',
			description: 'Get market data formatted for graphing and visualization',
			action: 'Get market graph data',
		},
		{
			name: 'Get Historical Rates',
			value: 'getHistoricalRates',
			description: 'Get historical interest rates for markets',
			action: 'Get historical rates',
		},
		{
			name: 'Get Utilization History',
			value: 'getUtilizationHistory',
			description: 'Get historical utilization rates',
			action: 'Get utilization history',
		},
	],
	default: 'getMarketGraph',
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
			name: 'Get Proposals',
			value: 'getProposals',
			description: 'Get all governance proposals',
			action: 'Get governance proposals',
		},
		{
			name: 'Get Proposal Votes',
			value: 'getProposalVotes',
			description: 'Get voting receipts for proposals',
			action: 'Get proposal votes',
		},
		{
			name: 'Get Governance Accounts',
			value: 'getGovernanceAccounts',
			description: 'Get accounts with voting power and delegation',
			action: 'Get governance accounts',
		},
	],
	default: 'getProposals',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['priceData'] } },
  options: [
    { name: 'Get Current Prices', value: 'getCurrentPrices', description: 'Get current prices for all supported assets', action: 'Get current prices for all supported assets' },
    { name: 'Get Price History', value: 'getPriceHistory', description: 'Get historical price data for assets', action: 'Get historical price data for assets' }
  ],
  default: 'getCurrentPrices',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getAccount'] } },
  default: '',
  placeholder: '0x1234...',
  description: 'Comma-separated list of account addresses to retrieve',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getAccountService'] } },
  default: '',
  placeholder: '0x1234...',
  description: 'Comma-separated list of account addresses to retrieve',
},
{
  displayName: 'Block Number',
  name: 'block_number',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getAccountService'] } },
  default: '',
  description: 'The block number to query account service data at',
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getAccountHistory'] } },
  default: '',
  placeholder: '0x1234...',
  description: 'Comma-separated list of account addresses to retrieve',
},
{
  displayName: 'Min Block Number',
  name: 'min_block_number',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getAccountHistory'] } },
  default: '',
  description: 'The minimum block number to filter transactions from',
},
{
  displayName: 'Max Block Number',
  name: 'max_block_number',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getAccountHistory'] } },
  default: '',
  description: 'The maximum block number to filter transactions to',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Ethereum Mainnet', value: 'mainnet' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Arbitrum', value: 'arbitrum' }
  ],
  default: 'mainnet',
  description: 'The blockchain network to query',
},
{
  displayName: 'Page Size',
  name: 'page_size',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getAccountHistory'] } },
  default: 100,
  description: 'Number of results per page (for pagination)',
},
{
  displayName: 'Page Number',
  name: 'page_number',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['account'], operation: ['getAccountHistory'] } },
  default: 1,
  description: 'Page number to retrieve (for pagination)',
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'number',
  default: '',
  description: 'Specific block number to query',
  displayOptions: {
    show: {
      resource: ['cToken'],
      operation: ['getAllCTokens']
    }
  }
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  default: '',
  required: true,
  description: 'Comma-separated list of cToken addresses',
  displayOptions: {
    show: {
      resource: ['cToken'],
      operation: ['getCTokenService']
    }
  }
},
{
  displayName: 'Block Number',
  name: 'blockNumber',
  type: 'number',
  default: '',
  description: 'Specific block number to query',
  displayOptions: {
    show: {
      resource: ['cToken'],
      operation: ['getCTokenService']
    }
  }
},
{
  displayName: 'Addresses',
  name: 'addresses',
  type: 'string',
  default: '',
  required: true,
  description: 'Comma-separated list of cToken addresses',
  displayOptions: {
    show: {
      resource: ['cToken'],
      operation: ['getCTokenHistory']
    }
  }
},
{
  displayName: 'Minimum Block Number',
  name: 'minBlockNumber',
  type: 'number',
  default: '',
  description: 'Minimum block number for historical data range',
  displayOptions: {
    show: {
      resource: ['cToken'],
      operation: ['getCTokenHistory']
    }
  }
},
{
  displayName: 'Maximum Block Number',
  name: 'maxBlockNumber',
  type: 'number',
  default: '',
  description: 'Maximum block number for historical data range',
  displayOptions: {
    show: {
      resource: ['cToken'],
      operation: ['getCTokenHistory']
    }
  }
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  default: 'mainnet',
  description: 'Blockchain network to query',
  options: [
    { name: 'Ethereum Mainnet', value: 'mainnet' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Arbitrum', value: 'arbitrum' }
  ],
  displayOptions: {
    show: {
      resource: ['cToken'],
      operation: ['getAllCTokens', 'getCTokenService', 'getCTokenHistory']
    }
  }
},
{
	displayName: 'Asset',
	name: 'asset',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['marketHistory'],
			operation: ['getMarketGraph', 'getHistoricalRates', 'getUtilizationHistory'],
		},
	},
	default: '',
	placeholder: 'cDAI',
	description: 'The compound asset symbol (e.g., cDAI, cUSDC)',
},
{
	displayName: 'Network',
	name: 'network',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['marketHistory'],
			operation: ['getMarketGraph', 'getHistoricalRates', 'getUtilizationHistory'],
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
	description: 'The blockchain network to query',
},
{
	displayName: 'Min Block Number',
	name: 'minBlockNumber',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['marketHistory'],
			operation: ['getMarketGraph', 'getHistoricalRates', 'getUtilizationHistory'],
		},
	},
	default: '',
	description: 'Minimum block number for the query range',
},
{
	displayName: 'Max Block Number',
	name: 'maxBlockNumber',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['marketHistory'],
			operation: ['getMarketGraph', 'getHistoricalRates', 'getUtilizationHistory'],
		},
	},
	default: '',
	description: 'Maximum block number for the query range',
},
{
	displayName: 'Number of Buckets',
	name: 'numBuckets',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['marketHistory'],
			operation: ['getMarketGraph'],
		},
	},
	default: 100,
	description: 'Number of data points to return for graphing',
},
{
	displayName: 'Page Size',
	name: 'pageSize',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['marketHistory'],
			operation: ['getMarketGraph', 'getHistoricalRates', 'getUtilizationHistory'],
		},
	},
	default: 100,
	description: 'Number of records to return per page',
},
{
	displayName: 'Page Number',
	name: 'pageNumber',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['marketHistory'],
			operation: ['getMarketGraph', 'getHistoricalRates', 'getUtilizationHistory'],
		},
	},
	default: 1,
	description: 'Page number for pagination',
},
{
	displayName: 'Proposal IDs',
	name: 'proposalIds',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getProposals'],
		},
	},
	default: '',
	description: 'Comma-separated list of proposal IDs to filter by',
},
{
	displayName: 'State',
	name: 'state',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getProposals'],
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
			operation: ['getProposals'],
		},
	},
	default: false,
	description: 'Whether to include detailed proposal information',
},
{
	displayName: 'Proposal ID',
	name: 'proposalId',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getProposalVotes'],
		},
	},
	default: 0,
	required: true,
	description: 'ID of the proposal to get votes for',
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
			name: 'Against',
			value: 'false',
		},
		{
			name: 'For',
			value: 'true',
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
			operation: ['getProposalVotes', 'getGovernanceAccounts'],
		},
	},
	default: 100,
	description: 'Number of results per page (max 1000)',
	typeOptions: {
		minValue: 1,
		maxValue: 1000,
	},
},
{
	displayName: 'Page Number',
	name: 'pageNumber',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getProposalVotes', 'getGovernanceAccounts'],
		},
	},
	default: 1,
	description: 'Page number to retrieve',
	typeOptions: {
		minValue: 1,
	},
},
{
	displayName: 'Addresses',
	name: 'addresses',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['governance'],
			operation: ['getGovernanceAccounts'],
		},
	},
	default: '',
	description: 'Comma-separated list of addresses to filter by',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  default: '',
  description: 'Asset symbol to get price data for (optional for current prices)',
  displayOptions: {
    show: {
      resource: ['priceData'],
      operation: ['getCurrentPrices']
    }
  }
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  default: '',
  description: 'Asset symbol to get historical price data for',
  displayOptions: {
    show: {
      resource: ['priceData'],
      operation: ['getPriceHistory']
    }
  }
},
{
  displayName: 'Min Block Number',
  name: 'min_block_number',
  type: 'number',
  default: 0,
  description: 'Minimum block number for historical data',
  displayOptions: {
    show: {
      resource: ['priceData'],
      operation: ['getPriceHistory']
    }
  }
},
{
  displayName: 'Max Block Number',
  name: 'max_block_number',
  type: 'number',
  default: 0,
  description: 'Maximum block number for historical data',
  displayOptions: {
    show: {
      resource: ['priceData'],
      operation: ['getPriceHistory']
    }
  }
},
{
  displayName: 'Number of Buckets',
  name: 'num_buckets',
  type: 'number',
  default: 10,
  description: 'Number of data buckets to return',
  displayOptions: {
    show: {
      resource: ['priceData'],
      operation: ['getPriceHistory']
    }
  }
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  options: [
    { name: 'Ethereum Mainnet', value: 'mainnet' },
    { name: 'Polygon', value: 'polygon' },
    { name: 'Arbitrum', value: 'arbitrum' }
  ],
  default: 'mainnet',
  description: 'Blockchain network to query',
  displayOptions: {
    show: {
      resource: ['priceData'],
      operation: ['getCurrentPrices', 'getPriceHistory']
    }
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
      case 'priceData':
        return [await executePriceDataOperations.call(this, items)];
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
      const baseUrl = credentials.baseUrl || 'https://api.compound.finance/api/v2';
      const network = this.getNodeParameter('network', i, 'mainnet') as string;

      switch (operation) {
        case 'getAccount': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const queryParams = new URLSearchParams();
          queryParams.append('addresses', addresses);
          if (network !== 'mainnet') {
            queryParams.append('network', network);
          }

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/account?${queryParams.toString()}`,
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
          const blockNumber = this.getNodeParameter('block_number', i, '') as number;
          const queryParams = new URLSearchParams();
          queryParams.append('addresses', addresses);
          if (blockNumber) {
            queryParams.append('block_number', blockNumber.toString());
          }
          if (network !== 'mainnet') {
            queryParams.append('network', network);
          }

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/account/service?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountHistory': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const minBlockNumber = this.getNodeParameter('min_block_number', i, '') as number;
          const maxBlockNumber = this.getNodeParameter('max_block_number', i, '') as number;
          const pageSize = this.getNodeParameter('page_size', i, 100) as number;
          const pageNumber = this.getNodeParameter('page_number', i, 1) as number;
          
          const queryParams = new URLSearchParams();
          queryParams.append('addresses', addresses);
          if (minBlockNumber) {
            queryParams.append('min_block_number', minBlockNumber.toString());
          }
          if (maxBlockNumber) {
            queryParams.append('max_block_number', maxBlockNumber.toString());
          }
          if (pageSize) {
            queryParams.append('page_size', pageSize.toString());
          }
          if (pageNumber) {
            queryParams.append('page_number', pageNumber.toString());
          }
          if (network !== 'mainnet') {
            queryParams.append('network', network);
          }

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/account/history?${queryParams.toString()}`,
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
          const blockNumber = this.getNodeParameter('blockNumber', i) as number;
          const network = this.getNodeParameter('network', i) as string;

          const params = new URLSearchParams();
          if (blockNumber) params.append('block_number', blockNumber.toString());
          if (network !== 'mainnet') params.append('network', network);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ctoken${params.toString() ? '?' + params.toString() : ''}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCTokenService': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const blockNumber = this.getNodeParameter('blockNumber', i) as number;
          const network = this.getNodeParameter('network', i) as string;

          const params = new URLSearchParams();
          params.append('addresses', addresses);
          if (blockNumber) params.append('block_number', blockNumber.toString());
          if (network !== 'mainnet') params.append('network', network);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ctoken/service?${params.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCTokenHistory': {
          const addresses = this.getNodeParameter('addresses', i) as string;
          const minBlockNumber = this.getNodeParameter('minBlockNumber', i) as number;
          const maxBlockNumber = this.getNodeParameter('maxBlockNumber', i) as number;
          const network = this.getNodeParameter('network', i) as string;

          const params = new URLSearchParams();
          params.append('addresses', addresses);
          if (minBlockNumber) params.append('min_block_number', minBlockNumber.toString());
          if (maxBlockNumber) params.append('max_block_number', maxBlockNumber.toString());
          if (network !== 'mainnet') params.append('network', network);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/ctoken/history?${params.toString()}`,
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
			const asset = this.getNodeParameter('asset', i) as string;
			const network = this.getNodeParameter('network', i) as string;
			const minBlockNumber = this.getNodeParameter('minBlockNumber', i) as number;
			const maxBlockNumber = this.getNodeParameter('maxBlockNumber', i) as number;
			const pageSize = this.getNodeParameter('pageSize', i) as number;
			const pageNumber = this.getNodeParameter('pageNumber', i) as number;

			const queryParams: any = {
				asset,
				network,
			};

			if (minBlockNumber) {
				queryParams.min_block_number = minBlockNumber;
			}

			if (maxBlockNumber) {
				queryParams.max_block_number = maxBlockNumber;
			}

			if (pageSize) {
				queryParams.page_size = pageSize;
			}

			if (pageNumber) {
				queryParams.page_number = pageNumber;
			}

			switch (operation) {
				case 'getMarketGraph': {
					const numBuckets = this.getNodeParameter('numBuckets', i) as number;
					if (numBuckets) {
						queryParams.num_buckets = numBuckets;
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/market_history/graph`,
						qs: queryParams,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getHistoricalRates': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/market_history/rates`,
						qs: queryParams,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getUtilizationHistory': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/market_history/utilization`,
						qs: queryParams,
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
				case 'getProposals': {
					const proposalIds = this.getNodeParameter('proposalIds', i) as string;
					const state = this.getNodeParameter('state', i) as string;
					const withDetail = this.getNodeParameter('withDetail', i) as boolean;

					const queryParams: any = {};
					if (proposalIds) queryParams.proposal_ids = proposalIds;
					if (state) queryParams.state = state;
					if (withDetail) queryParams.with_detail = 'true';

					const queryString = Object.keys(queryParams).length > 0 
						? '?' + new URLSearchParams(queryParams).toString() 
						: '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/governance/proposals${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getProposalVotes': {
					const proposalId = this.getNodeParameter('proposalId', i) as number;
					const support = this.getNodeParameter('support', i) as string;
					const pageSize = this.getNodeParameter('pageSize', i) as number;
					const pageNumber = this.getNodeParameter('pageNumber', i) as number;

					const queryParams: any = {
						proposal_id: proposalId.toString(),
						page_size: pageSize.toString(),
						page_number: pageNumber.toString(),
					};
					if (support) queryParams.support = support;

					const queryString = '?' + new URLSearchParams(queryParams).toString();

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/governance/proposal_vote_receipts${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getGovernanceAccounts': {
					const addresses = this.getNodeParameter('addresses', i) as string;
					const pageSize = this.getNodeParameter('pageSize', i) as number;
					const pageNumber = this.getNodeParameter('pageNumber', i) as number;

					const queryParams: any = {
						page_size: pageSize.toString(),
						page_number: pageNumber.toString(),
					};
					if (addresses) queryParams.addresses = addresses;

					const queryString = '?' + new URLSearchParams(queryParams).toString();

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/governance/accounts${queryString}`,
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

async function executePriceDataOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('compoundprotocolApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const network = this.getNodeParameter('network', i) as string;

      switch (operation) {
        case 'getCurrentPrices': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          
          const queryParams: any = {};
          if (symbol) {
            queryParams.symbol = symbol;
          }
          queryParams.network = network;

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/price${queryString ? '?' + queryString : ''}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.api_key}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPriceHistory': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const min_block_number = this.getNodeParameter('min_block_number', i) as number;
          const max_block_number = this.getNodeParameter('max_block_number', i) as number;
          const num_buckets = this.getNodeParameter('num_buckets', i) as number;

          const queryParams: any = {
            symbol,
            network
          };

          if (min_block_number > 0) {
            queryParams.min_block_number = min_block_number.toString();
          }
          if (max_block_number > 0) {
            queryParams.max_block_number = max_block_number.toString();
          }
          if (num_buckets > 0) {
            queryParams.num_buckets = num_buckets.toString();
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const url = `${credentials.baseUrl}/price/history?${queryString}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.api_key}`,
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
