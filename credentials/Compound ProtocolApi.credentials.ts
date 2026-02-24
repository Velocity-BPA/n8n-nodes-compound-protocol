import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CompoundProtocolApi implements ICredentialType {
	name = 'compoundProtocolApi';
	displayName = 'Compound Protocol API';
	documentationUrl = 'https://compound.finance/docs/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key for Compound Protocol. Get yours at compound.finance',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.compound.finance/api/v2',
			required: true,
			description: 'Base URL for the Compound Protocol API',
		},
	];
}