# n8n-nodes-compound-protocol

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with the Compound Protocol, enabling automated DeFi workflows with 6 core resources. Access lending markets, track governance proposals, monitor account positions, retrieve price feeds, interact with Comet markets, and analyze protocol analytics directly from your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![DeFi](https://img.shields.io/badge/DeFi-Compound-green)
![Ethereum](https://img.shields.io/badge/Ethereum-Compatible-purple)
![API](https://img.shields.io/badge/API-GraphQL%2FREST-orange)

## Features

- **Complete CToken Management** - Supply, redeem, borrow, and repay operations across all Compound markets
- **Account Monitoring** - Track balances, positions, transaction history, and liquidation health factors
- **Governance Integration** - Create proposals, vote, delegate voting power, and monitor governance events
- **Real-time Price Feeds** - Access current and historical asset prices from Compound's oracle network
- **Comet Markets Support** - Interact with Compound V3 isolated lending markets and cross-collateral positions
- **Advanced Analytics** - Retrieve protocol metrics, TVL data, interest rates, and market utilization statistics
- **Multi-chain Support** - Compatible with Ethereum mainnet and supported Layer 2 networks
- **Error Recovery** - Robust error handling with automatic retry mechanisms and detailed error reporting

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
| API Key | Compound API key for authenticated requests | Yes |
| Network | Ethereum network (mainnet, goerli, sepolia) | Yes |
| RPC Endpoint | Custom RPC endpoint URL (optional) | No |
| Rate Limit | Requests per second limit (default: 5) | No |

## Resources & Operations

### 1. CTokens

| Operation | Description |
|-----------|-------------|
| Get Market Data | Retrieve market information for specific cToken |
| Supply | Supply underlying assets to earn interest |
| Redeem | Redeem cTokens for underlying assets |
| Borrow | Borrow assets against collateral |
| Repay | Repay borrowed assets |
| Get Balance | Get cToken balance for an address |
| Get Exchange Rate | Get current cToken to underlying exchange rate |
| Get Supply Rate | Get current supply interest rate |
| Get Borrow Rate | Get current borrow interest rate |

### 2. Accounts

| Operation | Description |
|-----------|-------------|
| Get Account | Retrieve complete account information |
| Get Balances | Get all token balances for an account |
| Get Positions | Get lending and borrowing positions |
| Get Transaction History | Retrieve account transaction history |
| Get Health Factor | Calculate account liquidation health |
| Get Collateral Factor | Get collateral factors for account assets |
| Check Liquidation | Determine if account is eligible for liquidation |

### 3. Governance

| Operation | Description |
|-----------|-------------|
| Get Proposals | List all governance proposals |
| Get Proposal | Get detailed proposal information |
| Create Proposal | Submit new governance proposal |
| Vote | Cast vote on active proposal |
| Delegate | Delegate voting power to another address |
| Get Votes | Get voting history for address |
| Get Voting Power | Get current voting power for address |
| Get Proposal State | Get current state of proposal |

### 4. PriceFeeds

| Operation | Description |
|-----------|-------------|
| Get Price | Get current asset price from oracle |
| Get Historical Prices | Retrieve price history for asset |
| Get All Prices | Get prices for all supported assets |
| Get Price Feed Info | Get oracle and price feed metadata |
| Validate Price | Verify price freshness and validity |

### 5. CometMarkets

| Operation | Description |
|-----------|-------------|
| Get Market Info | Retrieve Comet market configuration |
| Get User Position | Get user's position in Comet market |
| Supply Collateral | Supply collateral to Comet market |
| Withdraw Collateral | Withdraw collateral from position |
| Borrow Base | Borrow base asset from Comet market |
| Repay Base | Repay borrowed base asset |
| Get Utilization | Get market utilization metrics |
| Get Rewards | Get reward token information |

### 6. Analytics

| Operation | Description |
|-----------|-------------|
| Get Protocol Stats | Retrieve overall protocol metrics |
| Get Market Stats | Get statistics for specific market |
| Get TVL Data | Get total value locked across markets |
| Get Interest Rates | Get historical interest rate data |
| Get Volume Data | Get lending/borrowing volume metrics |
| Get User Analytics | Get analytics for specific user |
| Get Liquidation Data | Get liquidation events and statistics |

## Usage Examples

```javascript
// Monitor account health and trigger alerts
const accountHealth = await this.helpers.httpRequest({
  method: 'GET',
  url: `https://api.compound.finance/api/v2/account`,
  qs: {
    addresses: '0x1234...abcd',
    block_number: 'latest'
  },
  headers: {
    'Authorization': `Bearer ${credentials.apiKey}`
  }
});

if (accountHealth.accounts[0].health.value < 1.2) {
  // Trigger liquidation protection workflow
  return { riskLevel: 'high', action: 'rebalance' };
}
```

```javascript
// Auto-compound earnings by reinvesting interest
const earnings = await this.helpers.httpRequest({
  method: 'GET',
  url: `https://api.compound.finance/api/v2/account`,
  qs: {
    addresses: '0x5678...efgh'
  }
});

for (const token of earnings.accounts[0].tokens) {
  if (token.supply_balance_underlying.value > 0.01) {
    // Supply additional earned tokens
    await supplyToCompound(token.address, token.supply_balance_underlying.value);
  }
}
```

```javascript
// Track governance proposals and auto-vote
const proposals = await this.helpers.httpRequest({
  method: 'GET',
  url: 'https://api.compound.finance/api/v2/governance/proposals',
  qs: {
    state: 'active',
    page_size: 10
  }
});

for (const proposal of proposals.proposals) {
  if (proposal.title.includes('Security') || proposal.title.includes('Upgrade')) {
    // Cast vote based on proposal analysis
    await castVote(proposal.id, true, 'Automated security vote');
  }
}
```

```javascript
// Monitor price feeds for arbitrage opportunities
const prices = await this.helpers.httpRequest({
  method: 'GET',
  url: 'https://api.compound.finance/api/v2/prices',
  qs: {
    symbols: 'ETH,USDC,DAI'
  }
});

const ethPrice = prices.prices.find(p => p.symbol === 'ETH');
const usdcPrice = prices.prices.find(p => p.symbol === 'USDC');

if (Math.abs(ethPrice.price - externalEthPrice) / ethPrice.price > 0.005) {
  return { arbitrageOpportunity: true, asset: 'ETH', priceDiff: '0.5%' };
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and active |
| Rate Limit Exceeded | Too many requests sent in time window | Implement delays or reduce request frequency |
| Market Not Found | Specified cToken or market does not exist | Check market address and network configuration |
| Insufficient Balance | Account lacks required tokens for operation | Verify account balance before transactions |
| Network Error | Connection issues with Compound API or blockchain | Retry with exponential backoff, check network |
| Invalid Address | Ethereum address format is incorrect | Validate address format and checksum |

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
- **Compound Documentation**: [Compound Protocol Docs](https://compound.finance/docs)
- **API Reference**: [Compound API Docs](https://compound.finance/docs/api)