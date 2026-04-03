import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CompoundProtocolApi implements ICredentialType {
	name = 'compoundProtocolApi';
	displayName = 'Compound Protocol API';
	documentationUrl = 'https://docs.compound.finance/';
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
			description: 'API key for Compound Protocol authentication',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.compound.finance/api/v2',
			description: 'Base URL for the Compound Protocol API',
		},
	];
}