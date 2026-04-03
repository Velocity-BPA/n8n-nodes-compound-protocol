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

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
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
describe('Account Resource', () => {
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
      },
    };
  });

  describe('getAccount operation', () => {
    it('should get account data successfully', async () => {
      const mockResponse = {
        accounts: [
          {
            address: '0x1234567890abcdef',
            total_supply_balance_underlying_usd: '1000.50',
            total_borrow_balance_underlying_usd: '500.25',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccount')
        .mockReturnValueOnce('0x1234567890abcdef')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce('mainnet');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeAccountOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/account?addresses=0x1234567890abcdef',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle errors gracefully when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccount')
        .mockReturnValueOnce('0x1234567890abcdef')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce('mainnet');

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];
      const result = await executeAccountOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: { error: 'API Error' },
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('getAccountService operation', () => {
    it('should get account service status successfully', async () => {
      const mockResponse = {
        accounts: [
          {
            address: '0x1234567890abcdef',
            service_status: 'active',
            health_factor: '2.5',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountService')
        .mockReturnValueOnce('0x1234567890abcdef');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeAccountOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/account/service?addresses=0x1234567890abcdef',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should throw error when continueOnFail is false', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountService')
        .mockReturnValueOnce('0x1234567890abcdef');

      mockExecuteFunctions.continueOnFail.mockReturnValue(false);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];

      await expect(
        executeAccountOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('API Error');
    });
  });
});

describe('CToken Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.compound.finance/api/v2' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getAllCTokens operation', () => {
    it('should get all cToken market data successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllCTokens')
        .mockReturnValueOnce(1234567890)
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(1);

      const mockResponse = {
        cTokens: [
          { symbol: 'cDAI', address: '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643' }
        ]
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/ctoken?block_timestamp=1234567890&page_size=50&page_number=1',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getAllCTokens errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllCTokens');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getCTokenService operation', () => {
    it('should get cToken service status successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getCTokenService');

      const mockResponse = { status: 'operational' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/ctoken/service',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle getCTokenService errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getCTokenService');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Service Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Service Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('MarketHistory Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.compound.finance/api/v2'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getMarketHistoryGraph operation', () => {
    it('should successfully get market history graph data', async () => {
      const mockResponse = {
        graph_results: [
          {
            block_timestamp: 1640995200,
            supply_rate: "0.025",
            borrow_rate: "0.035",
            exchange_rate: "1.05"
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getMarketHistoryGraph')
        .mockReturnValueOnce('ETH')
        .mockReturnValueOnce(1640995200)
        .mockReturnValueOnce(1641081600)
        .mockReturnValueOnce(100);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeMarketHistoryOperations.call(mockExecuteFunctions, items);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/market_history/graph?asset=ETH&min_block_timestamp=1640995200&max_block_timestamp=1641081600&num_buckets=100',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle API errors for getMarketHistoryGraph', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getMarketHistoryGraph')
        .mockReturnValueOnce('ETH')
        .mockReturnValueOnce(1640995200)
        .mockReturnValueOnce(1641081600)
        .mockReturnValueOnce(100);

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeMarketHistoryOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('Governance Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.compound.finance/api/v2'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      }
    };
  });

  describe('getAllProposals operation', () => {
    it('should successfully get all governance proposals', async () => {
      const mockResponse = {
        request: { page_size: 100, page_number: 1 },
        proposals: [
          { id: 1, title: 'Test Proposal', state: 'active' }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllProposals')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(1);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/governance/proposals?page_size=100&page_number=1',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });

    it('should handle errors for getAllProposals', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllProposals');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getProposalVotes operation', () => {
    it('should successfully get proposal votes', async () => {
      const mockResponse = {
        request: { proposal_id: '1', page_size: 100, page_number: 1 },
        vote_receipts: [
          { voter: '0x123...', support: true, votes: '1000' }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProposalVotes')
        .mockReturnValueOnce('1')
        .mockReturnValueOnce('')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(1);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle errors for getProposalVotes', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getProposalVotes');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getGovernanceAccounts operation', () => {
    it('should successfully get governance accounts', async () => {
      const mockResponse = {
        request: { page_size: 100, page_number: 1 },
        accounts: [
          { address: '0x123...', proposal_count: 5, vote_count: 10 }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getGovernanceAccounts')
        .mockReturnValueOnce('0x123...')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(1);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
    });

    it('should handle errors for getGovernanceAccounts', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getGovernanceAccounts');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.compound.finance/api/v2'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      }
    };
  });

  describe('getAccountTransactions', () => {
    it('should get account transactions successfully', async () => {
      const mockResponse = {
        transactions: [
          {
            hash: '0x123...',
            block_number: 18500000,
            timestamp: '2023-10-20T10:00:00Z',
            account: '0xabc...',
            action: 'supply',
            asset: 'USDC',
            amount: '1000.50'
          }
        ],
        pagination: {
          page_number: 1,
          page_size: 50,
          total_count: 1
        }
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountTransactions')
        .mockReturnValueOnce('0xabc123,0xdef456')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(50)
        .mockReturnValueOnce(1);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/account/transactions?addresses=0xabc123%2C0xdef456&page_size=50&page_number=1',
        headers: {
          'X-API-KEY': 'test-key'
        },
        json: true
      });

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 }
        }
      ]);
    });

    it('should handle API errors gracefully when continueOnFail is true', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountTransactions')
        .mockReturnValueOnce('0xabc123');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeTransactionOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        {
          json: { error: 'API Error' },
          pairedItem: { item: 0 }
        }
      ]);
    });

    it('should throw error when continueOnFail is false', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(false);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountTransactions')
        .mockReturnValueOnce('0xabc123');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });
});
});
