# Automate DeFi: New Compound Protocol Node for n8n

We're excited to announce the release of our latest community node for n8n: the Compound Protocol integration! Developed by Velocity BPA, this node brings decentralized finance (DeFi) automation directly into your n8n workflows.

## The Challenge of DeFi Integration

Compound Protocol is one of the leading DeFi platforms for lending and borrowing cryptocurrency. However, integrating Compound into automated workflows has traditionally required extensive blockchain development knowledge, custom API implementations, and constant maintenance to keep up with protocol updates. Whether you're managing treasury operations, building DeFi dashboards, or automating yield strategies, the technical barriers have been significant.

## Introducing n8n-nodes-compound-protocol

Our new node eliminates these barriers by providing a no-code interface to interact with Compound Protocol directly within n8n. Now you can build sophisticated DeFi automation workflows without writing a single line of smart contract code.

## Key Features

**Multi-Version Support**: The node supports both Compound V2 (cTokens) and V3 (Comet), giving you flexibility to work with either protocol version based on your needs.

**Comprehensive Operations**: Access lending, borrowing, supply, withdrawal, and balance checking operations through simple, intuitive node configurations.

**Real-Time Data**: Query current supply rates, borrow rates, and account positions to make informed decisions in your automated workflows.

**Seamless Integration**: Combine Compound operations with n8n's 400+ existing integrations to create powerful cross-platform automations—from Slack notifications on position changes to automated treasury management based on Google Sheets data.

## Getting Started

Installation is straightforward. In your n8n instance, run:


npm install n8n-nodes-compound-protocol


After restarting n8n, you'll find the Compound Protocol node in your node palette, ready to use.

## Use Cases

- Automate supply and withdrawal based on rate thresholds
- Monitor lending positions and send alerts
- Generate periodic reports on DeFi portfolio performance
- Integrate DeFi operations with traditional business systems
- Build custom treasury management workflows

## Open Source and Community Driven

This node is open source and available on GitHub: https://github.com/Velocity-BPA/n8n-nodes-compound-protocol

We welcome contributions, feature requests, and feedback from the community.

## Need Custom Node Development?

At Velocity BPA, we specialize in building custom n8n nodes and automation solutions tailored to your specific needs. Whether you need integrations with proprietary systems, blockchain protocols, or specialized APIs, our team can help.

Ready to supercharge your DeFi automation? Install the Compound Protocol node today and start building smarter workflows!