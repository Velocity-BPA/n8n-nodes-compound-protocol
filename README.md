# n8n-nodes-compound-protocol

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for interacting with the Compound Protocol DeFi platform. This node provides 5 resources with comprehensive operations for account management, token analysis, market data, governance participation, and price tracking across the Compound ecosystem.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![DeFi](https://img.shields.io/badge/DeFi-Protocol-green)
![Ethereum](https://img.shields.io/badge/Ethereum-Compatible-blue)
![Web3](https://img.shields.io/badge/Web3-Integration-purple)

## Features

- **Account Management** - Track lending positions, borrowing activities, and account health metrics
- **CToken Operations** - Interact with Compound tokens for supply, borrow, and redeem operations
- **Market Analytics** - Access comprehensive market data including interest rates and total value locked
- **Governance Integration** - Participate in Compound governance through proposal tracking and voting
- **Real-time Price Data** - Monitor asset prices and market movements across supported tokens
- **Transaction History** - Retrieve detailed transaction logs and historical account activity
- **Risk Assessment** - Calculate collateral ratios and liquidation risks for lending positions
- **Yield Tracking** - Monitor interest earned and borrowing costs over time

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-compound-protocol`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-compound-protocol
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-compound-protocol.git
cd n8n-nodes-compound-protocol
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-compound-protocol
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Compound Protocol API key for enhanced rate limits | Yes |
| Environment | Network environment (mainnet, testnet) | Yes |
| RPC URL | Custom Ethereum RPC endpoint (optional) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Account Details | Retrieve account summary including supplied and borrowed assets |
| Get Account History | Fetch transaction history for a specific account |
| Get Collateral Status | Check collateral factors and account health metrics |
| Calculate Liquidation Risk | Assess liquidation risk based on current positions |
| Get Earned Interest | Track total interest earned across all supplied assets |
| Get Borrowing Costs | Calculate total interest paid on borrowed assets |

### 2. CToken

| Operation | Description |
|-----------|-------------|
| Get Token Info | Retrieve basic information about a specific cToken |
| Get Exchange Rate | Fetch current exchange rate between cToken and underlying asset |
| Get Supply Rate | Get current supply interest rate for the token |
| Get Borrow Rate | Get current borrowing interest rate for the token |
| Get Total Supply | Retrieve total supply of the cToken |
| Get Total Borrows | Get total borrowed amount of the underlying asset |
| Get Reserve Factor | Fetch the reserve factor for the cToken |
| Get Collateral Factor | Get the collateral factor used for borrowing calculations |

### 3. Market History

| Operation | Description |
|-----------|-------------|
| Get Historical Rates | Retrieve historical interest rates for specified time periods |
| Get Volume History | Fetch historical trading and lending volumes |
| Get TVL History | Track total value locked over time |
| Get Utilization History | Monitor asset utilization rates across time periods |
| Get Market Events | Retrieve significant market events and updates |
| Get Liquidation History | Track liquidation events and volumes |

### 4. Governance

| Operation | Description |
|-----------|-------------|
| Get Proposals | List all governance proposals with current status |
| Get Proposal Details | Retrieve detailed information about a specific proposal |
| Get Voting History | Fetch voting records for proposals |
| Get Voter Details | Get information about specific voters and their voting power |
| Get Delegation Info | Track COMP token delegations |
| Get Governance Stats | Retrieve overall governance participation metrics |

### 5. PriceData

| Operation | Description |
|-----------|-------------|
| Get Current Price | Fetch real-time price for any supported asset |
| Get Historical Prices | Retrieve price history for specified time ranges |
| Get Price Feed | Access Compound's price oracle data |
| Get Market Cap Data | Retrieve market capitalization information |
| Get Volume Data | Fetch trading volume across different time periods |
| Compare Asset Prices | Compare prices across multiple assets simultaneously |

## Usage Examples

```javascript
// Get account lending positions
{
  "account": "0x742e1e71b4e34fd0a738e1b33f87dc3e2a2b0e8c",
  "includeHistory": true,
  "calculateHealth": true
}

// Monitor cToken exchange rates
{
  "cToken": "cDAI",
  "includeBorrowRate": true,
  "includeSupplyRate": true,
  "includeUtilization": true
}

// Track governance proposal
{
  "proposalId": "125",
  "includeVotes": true,
  "includeVotingPower": true
}

// Get historical market data
{
  "asset": "USDC",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "interval": "daily",
  "metrics": ["supplyRate", "borrowRate", "totalSupply"]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid Address | Ethereum address format is incorrect | Ensure address is a valid 42-character hex string starting with 0x |
| Token Not Found | Specified cToken does not exist in Compound | Verify token symbol against supported Compound markets |
| Rate Limit Exceeded | API request limit has been reached | Implement request throttling or upgrade API plan |
| Network Error | Connection to Compound protocol failed | Check network connectivity and RPC endpoint availability |
| Insufficient Data | Requested historical data is not available | Adjust date range or check if market existed during specified period |
| Governance Proposal Not Found | Invalid proposal ID provided | Verify proposal exists using the list proposals operation |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-compound-protocol/issues)
- **Compound Documentation**: [docs.compound.finance](https://docs.compound.finance)
- **DeFi Community**: [compound.community](https://compound.community)