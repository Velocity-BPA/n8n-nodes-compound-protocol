/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { CompoundProtocol } from '../nodes/Compound Protocol/Compound Protocol.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('CompoundProtocol Node', () => {
  let node: CompoundProtocol;

  beforeAll(() => {
    node = new CompoundProtocol();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Compound Protocol');
      expect(node.description.name).toBe('compoundprotocol');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('CTokens Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.compound.finance/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllCTokens operation', () => {
    it('should successfully get all cTokens', async () => {
      const mockResponse = {
        cToken: [
          { address: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', symbol: 'cDAI' },
          { address: '0x39AA39c021dfbaE8faC545936693aC917d5E7563', symbol: 'cUSDC' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllCTokens';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCTokensOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/ctoken',
        headers: {
          'X-API-KEY': 'test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getCToken operation', () => {
    it('should successfully get specific cToken', async () => {
      const mockResponse = {
        cToken: {
          address: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
          symbol: 'cDAI',
          name: 'Compound Dai',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getCToken';
        if (paramName === 'address') return '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCTokensOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/ctoken/0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
        headers: {
          'X-API-KEY': 'test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getCTokenAccounts operation', () => {
    it('should successfully get cToken accounts with pagination', async () => {
      const mockResponse = {
        accounts: [
          { address: '0x123', tokens: [] },
          { address: '0x456', tokens: [] },
        ],
        pagination_summary: { page_number: 1, page_size: 50 },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getCTokenAccounts';
        if (paramName === 'address') return '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643';
        if (paramName === 'pageSize') return 50;
        if (paramName === 'pageNumber') return 1;
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCTokensOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/ctoken/0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643/account?page_size=50&page_number=1',
        headers: {
          'X-API-KEY': 'test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getMarketHistory operation', () => {
    it('should successfully get market history', async () => {
      const mockResponse = {
        graph_results: [
          { block_timestamp: 1640995200, supply_rate: 0.02 },
          { block_timestamp: 1641081600, supply_rate: 0.021 },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getMarketHistory';
        if (paramName === 'asset') return 'cDAI';
        if (paramName === 'minBlockTimestamp') return 1640995200;
        if (paramName === 'maxBlockTimestamp') return 1641081600;
        if (paramName === 'numBuckets') return 100;
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCTokensOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/market_history/graph?asset=cDAI&min_block_timestamp=1640995200&max_block_timestamp=1641081600&num_buckets=100',
        headers: {
          'X-API-KEY': 'test-api-key',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is false', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllCTokens';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeCTokensOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });

    it('should handle API errors when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllCTokens';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCTokensOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });
});

describe('Accounts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.compound.finance/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get all accounts successfully', async () => {
    const mockResponse = {
      accounts: [
        { address: '0x123', tokens: [] },
        { address: '0x456', tokens: [] }
      ],
      pagination: { page_number: 1, page_size: 100 }
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAllAccounts';
        case 'pageSize': return 100;
        case 'pageNumber': return 1;
        case 'addresses': return '';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.compound.finance/api/v2/account?page_size=100&page_number=1',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get specific account successfully', async () => {
    const mockResponse = {
      address: '0x123456789',
      tokens: [],
      health: { value: '1.5' }
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccount';
        case 'address': return '0x123456789';
        case 'blockNumber': return undefined;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.compound.finance/api/v2/account/0x123456789',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get account transactions successfully', async () => {
    const mockResponse = {
      transactions: [
        { hash: '0xabc', type: 'supply' },
        { hash: '0xdef', type: 'withdraw' }
      ],
      pagination: { page_number: 1, page_size: 50 }
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccountTransactions';
        case 'address': return '0x123456789';
        case 'pageSize': return 50;
        case 'pageNumber': return 1;
        case 'order': return 'DESC';
        case 'sort': return 'block_time';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.compound.finance/api/v2/account/0x123456789/transactions?page_size=50&page_number=1&order=DESC&sort=block_time',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get account positions successfully', async () => {
    const mockResponse = {
      positions: [
        { symbol: 'cDAI', balance: '100.5' },
        { symbol: 'cUSDC', balance: '200.75' }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccountPositions';
        case 'address': return '0x123456789';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.compound.finance/api/v2/account/0x123456789/positions',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should handle API errors gracefully when continueOnFail is true', async () => {
    const error = new Error('API Error');
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAccount';
        case 'address': return '0x123456789';
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('Governance Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.compound.finance/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllProposals', () => {
    it('should get all proposals successfully', async () => {
      const mockResponse = {
        proposals: [
          { id: 1, title: 'Test Proposal 1' },
          { id: 2, title: 'Test Proposal 2' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAllProposals';
          case 'proposalIds': return '';
          case 'state': return '';
          case 'withDetail': return true;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle errors in getAllProposals', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAllProposals';
          case 'proposalIds': return '';
          case 'state': return '';
          case 'withDetail': return true;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
    });
  });

  describe('getProposal', () => {
    it('should get specific proposal successfully', async () => {
      const mockResponse = {
        proposal: { id: 1, title: 'Test Proposal', description: 'Test Description' },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getProposal';
          case 'proposalId': return '1';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getProposalVotes', () => {
    it('should get proposal votes successfully', async () => {
      const mockResponse = {
        votes: [
          { voter: '0x123...', support: true, votes: '1000' },
          { voter: '0x456...', support: false, votes: '500' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getProposalVotes';
          case 'proposalId': return '1';
          case 'support': return '';
          case 'pageSize': return 100;
          case 'pageNumber': return 1;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getGovernanceAccount', () => {
    it('should get governance account successfully', async () => {
      const mockResponse = {
        account: {
          address: '0x123...',
          voting_power: '5000',
          delegated_votes: '3000',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getGovernanceAccount';
          case 'address': return '0x123456789abcdef';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 },
      }]);
    });
  });
});

describe('PriceFeeds Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.compound.finance/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllPrices', () => {
    it('should get all prices successfully', async () => {
      const mockResponse = {
        prices: [
          { symbol: 'ETH', price: '2000.50' },
          { symbol: 'USDC', price: '1.00' }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllPrices');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePriceFeedsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/price_feed',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle errors for getAllPrices', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllPrices');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executePriceFeedsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getAssetPrice', () => {
    it('should get asset price successfully', async () => {
      const mockResponse = {
        symbol: 'ETH',
        price: '2000.50',
        timestamp: 1640995200
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAssetPrice')
        .mockReturnValueOnce('ETH');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePriceFeedsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/price_feed/ETH',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should throw error when symbol is missing', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAssetPrice')
        .mockReturnValueOnce('');

      const items = [{ json: {} }];

      await expect(
        executePriceFeedsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('Symbol is required for getAssetPrice operation');
    });
  });

  describe('getPriceHistory', () => {
    it('should get price history successfully', async () => {
      const mockResponse = {
        symbol: 'ETH',
        prices: [
          { timestamp: 1640995200, price: '2000.50' },
          { timestamp: 1641081600, price: '2100.75' }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockImplementation((param: string, index: number, defaultValue?: any) => {
          switch (param) {
            case 'operation': return 'getPriceHistory';
            case 'symbol': return 'ETH';
            case 'minTimestamp': return 1640995200;
            case 'maxTimestamp': return 1641168000;
            case 'numBuckets': return defaultValue || 100;
            default: return defaultValue;
          }
        });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executePriceFeedsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/price_feed/history?symbol=ETH&num_buckets=100&min_timestamp=1640995200&max_timestamp=1641168000',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should throw error when symbol is missing for price history', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPriceHistory')
        .mockReturnValueOnce('');

      const items = [{ json: {} }];

      await expect(
        executePriceFeedsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('Symbol is required for getPriceHistory operation');
    });
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    const items = [{ json: {} }];

    await expect(
      executePriceFeedsOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('CometMarkets Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.compound.finance/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAllCometMarkets', () => {
    it('should get all comet markets successfully', async () => {
      const mockResponse = {
        markets: [
          {
            address: '0x123',
            name: 'Compound USDC',
            symbol: 'cUSDCv3',
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllCometMarkets';
        if (paramName === 'network') return 'mainnet';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCometMarketsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/comet/markets',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: { network: 'mainnet' },
        json: true,
      });
    });

    it('should handle errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAllCometMarkets';
        if (paramName === 'network') return 'mainnet';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeCometMarketsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getCometMarket', () => {
    it('should get specific comet market successfully', async () => {
      const mockResponse = {
        market: {
          address: '0x123',
          name: 'Compound USDC',
          symbol: 'cUSDCv3',
        }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getCometMarket';
        if (paramName === 'market') return '0x123';
        if (paramName === 'network') return 'mainnet';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCometMarketsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getCometAccount', () => {
    it('should get comet account successfully', async () => {
      const mockResponse = {
        account: '0xabc',
        positions: [
          {
            market: '0x123',
            balance: '1000',
            collateral: '500',
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getCometAccount';
        if (paramName === 'address') return '0xabc';
        if (paramName === 'market') return '0x123';
        if (paramName === 'network') return 'mainnet';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCometMarketsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getCometTransactions', () => {
    it('should get comet transactions successfully', async () => {
      const mockResponse = {
        transactions: [
          {
            hash: '0x456',
            type: 'supply',
            amount: '1000',
          }
        ],
        pagination: {
          page: 1,
          total: 1,
        }
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number, defaultValue?: any) => {
        if (paramName === 'operation') return 'getCometTransactions';
        if (paramName === 'market') return '0x123';
        if (paramName === 'network') return 'mainnet';
        if (paramName === 'account') return '0xabc';
        if (paramName === 'pageSize') return defaultValue || 100;
        if (paramName === 'pageNumber') return defaultValue || 1;
        return defaultValue || '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCometMarketsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Analytics Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.compound.finance/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getProtocolSnapshot', () => {
    it('should get protocol snapshot successfully', async () => {
      const mockResponse = {
        totalSupply: '1000000000',
        totalBorrow: '500000000',
        tvl: '2000000000',
        totalReserves: '10000000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getProtocolSnapshot';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/protocol/snapshot',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getProtocolSnapshot';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getProtocolHistory', () => {
    it('should get protocol history with parameters', async () => {
      const mockResponse = {
        data: [
          { timestamp: 1640995200, totalSupply: '1000000000', totalBorrow: '500000000' },
          { timestamp: 1641081600, totalSupply: '1100000000', totalBorrow: '550000000' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getProtocolHistory';
        if (paramName === 'minTimestamp') return 1640995200;
        if (paramName === 'maxTimestamp') return 1641081600;
        if (paramName === 'numBuckets') return 50;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/protocol/history?min_timestamp=1640995200&max_timestamp=1641081600&num_buckets=50',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getYieldFarmingData', () => {
    it('should get yield farming data with market filter', async () => {
      const mockResponse = {
        markets: [
          {
            symbol: 'cUSDC',
            supplyApy: '2.5',
            borrowApy: '5.2',
            compSupplyApy: '1.8',
            compBorrowApy: '3.1',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getYieldFarmingData';
        if (paramName === 'market') return 'cUSDC';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/yield_farming?market=cUSDC',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getUtilizationRates', () => {
    it('should get utilization rates for all markets', async () => {
      const mockResponse = {
        markets: [
          { symbol: 'cUSDC', utilizationRate: '0.65' },
          { symbol: 'cDAI', utilizationRate: '0.72' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getUtilizationRates';
        if (paramName === 'market') return '';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/utilization',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });
});
});
