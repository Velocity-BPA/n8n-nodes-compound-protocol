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

  it('should get account summary successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccount')
      .mockReturnValueOnce('mainnet')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890');

    const mockResponse = {
      accounts: [{
        address: '0x1234567890123456789012345678901234567890',
        total_collateral_value_in_eth: '100.5',
        total_borrow_value_in_eth: '50.2'
      }]
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.compound.finance/api/v2/account?addresses=0x1234567890123456789012345678901234567890',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get account service data successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountService')
      .mockReturnValueOnce('mainnet')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce(12345678);

    const mockResponse = {
      accounts: [{
        address: '0x1234567890123456789012345678901234567890',
        health: { value: '1.5' },
        tokens: []
      }]
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should get account history successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountHistory')
      .mockReturnValueOnce('mainnet')
      .mockReturnValueOnce('0x1234567890123456789012345678901234567890')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(1);

    const mockResponse = {
      pagination_summary: { page_number: 1, page_size: 100 },
      account_transactions: []
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  it('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccount')
      .mockReturnValueOnce('mainnet')
      .mockReturnValueOnce('invalid-address');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address format'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid address format');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
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
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getAllCTokens operation', () => {
    it('should get all cTokens successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllCTokens')
        .mockReturnValueOnce(12345)
        .mockReturnValueOnce('mainnet');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
        cTokens: [{ address: '0x123', symbol: 'cETH' }]
      });

      const result = await executeCTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ cTokens: [{ address: '0x123', symbol: 'cETH' }] });
    });

    it('should handle getAllCTokens error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllCTokens')
        .mockReturnValueOnce(12345)
        .mockReturnValueOnce('mainnet');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

      const result = await executeCTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('getCTokenService operation', () => {
    it('should get cToken service data successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCTokenService')
        .mockReturnValueOnce('0x123,0x456')
        .mockReturnValueOnce(12345)
        .mockReturnValueOnce('polygon');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
        cToken: [{ address: '0x123', supplyRate: '0.02' }]
      });

      const result = await executeCTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ cToken: [{ address: '0x123', supplyRate: '0.02' }] });
    });

    it('should handle getCTokenService error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCTokenService')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('mainnet');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('Service Error'));

      await expect(executeCTokenOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Service Error');
    });
  });

  describe('getCTokenHistory operation', () => {
    it('should get cToken history successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCTokenHistory')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce(10000)
        .mockReturnValueOnce(20000)
        .mockReturnValueOnce('arbitrum');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
        cTokenHistory: [{ blockNumber: 15000, event: 'Supply' }]
      });

      const result = await executeCTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ cTokenHistory: [{ blockNumber: 15000, event: 'Supply' }] });
    });

    it('should handle getCTokenHistory error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCTokenHistory')
        .mockReturnValueOnce('0x123')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('mainnet');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('History Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

      const result = await executeCTokenOperations.call(mockExecuteFunctions, [{ json: {} }]);
      
      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('History Error');
    });
  });
});

describe('Market History Resource', () => {
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

	describe('getMarketGraph operation', () => {
		it('should successfully get market graph data', async () => {
			const mockResponse = {
				data: [
					{
						block_number: 18000000,
						supply_rate: '0.02',
						borrow_rate: '0.05',
						total_supply: '1000000',
						total_borrows: '500000',
					},
				],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMarketGraph')
				.mockReturnValueOnce('cDAI')
				.mockReturnValueOnce('mainnet')
				.mockReturnValueOnce(17000000)
				.mockReturnValueOnce(18000000)
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(1)
				.mockReturnValueOnce(50);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeMarketHistoryOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.compound.finance/api/v2/market_history/graph',
				qs: {
					asset: 'cDAI',
					network: 'mainnet',
					min_block_number: 17000000,
					max_block_number: 18000000,
					page_size: 100,
					page_number: 1,
					num_buckets: 50,
				},
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle errors in getMarketGraph operation', async () => {
			const errorMessage = 'API request failed';
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getMarketGraph');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error(errorMessage));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const items = [{ json: {} }];
			const result = await executeMarketHistoryOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([
				{
					json: { error: errorMessage },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getHistoricalRates operation', () => {
		it('should successfully get historical rates', async () => {
			const mockResponse = {
				rates: [
					{
						block_number: 18000000,
						supply_rate: '0.02',
						borrow_rate: '0.05',
						timestamp: 1234567890,
					},
				],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getHistoricalRates')
				.mockReturnValueOnce('cUSDC')
				.mockReturnValueOnce('polygon')
				.mockReturnValueOnce(17000000)
				.mockReturnValueOnce(18000000)
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(1);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeMarketHistoryOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.compound.finance/api/v2/market_history/rates',
				qs: {
					asset: 'cUSDC',
					network: 'polygon',
					min_block_number: 17000000,
					max_block_number: 18000000,
					page_size: 50,
					page_number: 1,
				},
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getUtilizationHistory operation', () => {
		it('should successfully get utilization history', async () => {
			const mockResponse = {
				utilization: [
					{
						block_number: 18000000,
						utilization_rate: '0.75',
						timestamp: 1234567890,
					},
				],
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getUtilizationHistory')
				.mockReturnValueOnce('cETH')
				.mockReturnValueOnce('arbitrum')
				.mockReturnValueOnce(17000000)
				.mockReturnValueOnce(18000000)
				.mockReturnValueOnce(25)
				.mockReturnValueOnce(2);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeMarketHistoryOperations.call(mockExecuteFunctions, items);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.compound.finance/api/v2/market_history/utilization',
				qs: {
					asset: 'cETH',
					network: 'arbitrum',
					min_block_number: 17000000,
					max_block_number: 18000000,
					page_size: 25,
					page_number: 2,
				},
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
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

	describe('getProposals operation', () => {
		it('should get proposals successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getProposals')
				.mockReturnValueOnce('')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(false);

			const mockResponse = {
				proposals: [
					{ id: 1, title: 'Test Proposal 1' },
					{ id: 2, title: 'Test Proposal 2' },
				],
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeGovernanceOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle proposals request error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getProposals');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(
				executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('API Error');
		});
	});

	describe('getProposalVotes operation', () => {
		it('should get proposal votes successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getProposalVotes')
				.mockReturnValueOnce(1)
				.mockReturnValueOnce('true')
				.mockReturnValueOnce(100)
				.mockReturnValueOnce(1);

			const mockResponse = {
				proposal_vote_receipts: [
					{ voter: '0x123...', support: true, votes: '1000' },
				],
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeGovernanceOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle proposal votes request error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getProposalVotes');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(
				executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('API Error');
		});
	});

	describe('getGovernanceAccounts operation', () => {
		it('should get governance accounts successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getGovernanceAccounts')
				.mockReturnValueOnce('0x123...')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(1);

			const mockResponse = {
				accounts: [
					{ address: '0x123...', balance: '1000', votes: '500' },
				],
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeGovernanceOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle governance accounts request error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getGovernanceAccounts');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

			await expect(
				executeGovernanceOperations.call(mockExecuteFunctions, [{ json: {} }]),
			).rejects.toThrow('API Error');
		});
	});
});

describe('PriceData Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        api_key: 'test-key',
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

  describe('getCurrentPrices operation', () => {
    it('should get current prices successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCurrentPrices')
        .mockReturnValueOnce('mainnet')
        .mockReturnValueOnce('USDC');

      const mockResponse = {
        prices: [
          { symbol: 'USDC', price: '1.00', timestamp: 1234567890 }
        ]
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePriceDataOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/price?symbol=USDC&network=mainnet',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle getCurrentPrices errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCurrentPrices')
        .mockReturnValueOnce('mainnet')
        .mockReturnValueOnce('INVALID');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Asset not found'));

      const result = await executePriceDataOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Asset not found');
    });
  });

  describe('getPriceHistory operation', () => {
    it('should get price history successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPriceHistory')
        .mockReturnValueOnce('mainnet')
        .mockReturnValueOnce('USDC')
        .mockReturnValueOnce(1000000)
        .mockReturnValueOnce(2000000)
        .mockReturnValueOnce(50);

      const mockResponse = {
        prices: [
          { symbol: 'USDC', price: '1.00', block_number: 1500000, timestamp: 1234567890 }
        ]
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePriceDataOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.compound.finance/api/v2/price/history?symbol=USDC&network=mainnet&min_block_number=1000000&max_block_number=2000000&num_buckets=50',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle getPriceHistory errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getPriceHistory')
        .mockReturnValueOnce('mainnet')
        .mockReturnValueOnce('INVALID');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid block range'));

      const result = await executePriceDataOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid block range');
    });
  });
});
});
