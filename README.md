# n8n-nodes-compound-protocol

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node enables seamless integration with Compound Protocol, a leading decentralized finance (DeFi) platform for earning interest and borrowing cryptocurrency. With 5 comprehensive resources, it provides full access to account management, token market operations, governance participation, market analytics, and transaction monitoring capabilities.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![DeFi](https://img.shields.io/badge/DeFi-Protocol-green)
![Ethereum](https://img.shields.io/badge/Ethereum-Blockchain-lightblue)
![Compound](https://img.shields.io/badge/Compound-V2%2FV3-purple)

## Features

- **Account Management** - Access account balances, supply positions, borrow positions, and liquidation health
- **CToken Operations** - Interact with Compound tokens including supply, redeem, borrow, and repay operations
- **Market Analytics** - Retrieve comprehensive market data, interest rates, and historical performance metrics
- **Governance Integration** - Participate in Compound governance with proposal voting and delegation features
- **Transaction Monitoring** - Track and analyze transaction history with detailed event logging
- **Real-time Data** - Access live market rates, APY calculations, and protocol statistics
- **Multi-Network Support** - Compatible with Ethereum mainnet and supported testnets
- **Comprehensive Error Handling** - Robust error management with detailed debugging information

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
| API Key | Your Compound Protocol API key for accessing market data | Yes |
| Network | Target network (mainnet, goerli, sepolia) | Yes |
| RPC URL | Custom RPC endpoint URL (optional, uses default if not provided) | No |
| Wallet Address | Your wallet address for account-specific operations | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Account | Retrieve account information including balances and positions |
| Get Supply Positions | List all active supply positions for an account |
| Get Borrow Positions | List all active borrow positions for an account |
| Get Account Health | Check liquidation risk and health factor |
| Get Transaction History | Retrieve account transaction history |

### 2. CToken

| Operation | Description |
|-----------|-------------|
| Get Token Info | Retrieve cToken contract information and metadata |
| Get Exchange Rate | Get current exchange rate between cToken and underlying asset |
| Get Supply Rate | Retrieve current supply APY for the cToken |
| Get Borrow Rate | Retrieve current borrow APY for the cToken |
| Get Total Supply | Get total supply of the cToken |
| Get Total Borrows | Get total outstanding borrows for the cToken |
| Get Cash Balance | Retrieve available cash in the cToken market |

### 3. MarketHistory

| Operation | Description |
|-----------|-------------|
| Get Historical Rates | Retrieve historical interest rates for markets |
| Get Volume History | Get trading volume history for specified time periods |
| Get Price History | Retrieve historical price data for underlying assets |
| Get Market Events | Get historical market events and significant changes |
| Get APY Trends | Analyze APY trends over time for supply and borrow rates |

### 4. Governance

| Operation | Description |
|-----------|-------------|
| Get Proposals | List governance proposals with status and details |
| Get Proposal Details | Retrieve detailed information about a specific proposal |
| Get Voting History | View voting history for proposals |
| Get Delegate Info | Retrieve information about governance delegates |
| Get COMP Distribution | Check COMP token distribution and rewards |

### 5. Transaction

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve detailed transaction information by hash |
| Get Transaction Events | List all events emitted by a transaction |
| Get Block Transactions | Get all Compound transactions in a specific block |
| Get Recent Transactions | Retrieve recent transactions across all markets |
| Get Failed Transactions | List failed transactions with error details |

## Usage Examples

```javascript
// Get account supply positions
{
  "resource": "account",
  "operation": "getSupplyPositions",
  "accountAddress": "0x1234567890123456789012345678901234567890",
  "includeMetadata": true
}
```

```javascript
// Retrieve current market rates for USDC
{
  "resource": "ctoken",
  "operation": "getSupplyRate",
  "tokenSymbol": "cUSDC",
  "formatOutput": "percentage"
}
```

```javascript
// Get historical APY data for the last 30 days
{
  "resource": "marketHistory",
  "operation": "getHistoricalRates",
  "market": "cDAI",
  "period": "30d",
  "granularity": "1d"
}
```

```javascript
// Check active governance proposals
{
  "resource": "governance",
  "operation": "getProposals",
  "status": "active",
  "limit": 10,
  "includeVotingPower": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | API key is missing or invalid | Verify API key in credentials and ensure it's active |
| Network Connection Failed | Unable to connect to Compound Protocol | Check network settings and RPC URL configuration |
| Invalid Address Format | Wallet address format is incorrect | Ensure address is valid Ethereum format (0x...) |
| Rate Limit Exceeded | Too many API requests in short period | Implement delays between requests or upgrade API plan |
| Market Not Found | Specified cToken market doesn't exist | Verify market symbol and check supported markets list |
| Insufficient Data | Historical data not available for requested period | Adjust date range or check data availability |

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
- **DeFi Community**: [compound.finance/governance](https://compound.finance/governance)