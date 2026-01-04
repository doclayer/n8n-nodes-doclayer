import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

export class DoclayerTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Doclayer Trigger',
		name: 'doclayerTrigger',
		icon: 'file:doclayer.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers when document events occur in Doclayer',
		defaults: {
			name: 'Doclayer Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'doclayerApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				required: true,
				options: [
					{
						name: 'Document Completed',
						value: 'document.completed',
						description: 'Triggers when a document finishes processing',
					},
					{
						name: 'Document Failed',
						value: 'document.failed',
						description: 'Triggers when document processing fails',
					},
					{
						name: 'Extraction Ready',
						value: 'extraction.ready',
						description: 'Triggers when AI extraction is completed',
					},
					{
						name: 'Job Status Changed',
						value: 'job.status_changed',
						description: 'Triggers when an ingestion job status changes',
					},
					{
						name: 'Workflow Completed',
						value: 'workflow.completed',
						description: 'Triggers when a processing workflow completes',
					},
					{
						name: 'Usage Threshold Reached',
						value: 'billing.threshold_reached',
						description: 'Triggers when billing usage reaches a threshold',
					},
				],
				default: 'document.completed',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'Only trigger for events in this project (optional)',
				displayOptions: {
					show: {
						event: [
							'document.completed',
							'document.failed',
							'extraction.ready',
							'job.status_changed',
						],
					},
				},
			},
			{
				displayName: 'Agent Template ID',
				name: 'agentId',
				type: 'string',
				default: '',
				description: 'Only trigger for this agent template (optional)',
				displayOptions: {
					show: {
						event: ['extraction.ready'],
					},
				},
			},
			{
				displayName: 'Usage Threshold ($)',
				name: 'threshold',
				type: 'number',
				default: 100,
				description: 'Dollar amount threshold to trigger alert',
				displayOptions: {
					show: {
						event: ['billing.threshold_reached'],
					},
				},
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					return false;
				}

				const credentials = await this.getCredentials('doclayerApi');
				const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

				try {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'doclayerApi',
						{
							method: 'GET',
							url: `${baseUrl}/api/v4/webhooks/${webhookData.webhookId}`,
							json: true,
						},
					);

					if (response.url === webhookUrl) {
						return true;
					}
				} catch {
					// Webhook doesn't exist
					return false;
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const event = this.getNodeParameter('event') as string;
				const credentials = await this.getCredentials('doclayerApi');
				const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

				const body: IDataObject = {
					url: webhookUrl,
					event,
				};

				// Add optional filters
				if (['document.completed', 'document.failed', 'extraction.ready', 'job.status_changed'].includes(event)) {
					const projectId = this.getNodeParameter('projectId', '') as string;
					if (projectId) {
						body.project_id = projectId;
					}
				}

				if (event === 'extraction.ready') {
					const agentId = this.getNodeParameter('agentId', '') as string;
					if (agentId) {
						body.agent_id = agentId;
					}
				}

				if (event === 'billing.threshold_reached') {
					const threshold = this.getNodeParameter('threshold', 100) as number;
					body.threshold = threshold;
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'doclayerApi',
					{
						method: 'POST',
						url: `${baseUrl}/api/v4/webhooks`,
						body,
						json: true,
					},
				);

				if (response.id === undefined) {
					return false;
				}

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = response.id;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId === undefined) {
					return true;
				}

				const credentials = await this.getCredentials('doclayerApi');
				const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

				try {
					await this.helpers.httpRequestWithAuthentication.call(
						this,
						'doclayerApi',
						{
							method: 'DELETE',
							url: `${baseUrl}/api/v4/webhooks/${webhookData.webhookId}`,
						},
					);
				} catch {
					// Webhook might have been deleted already
				}

				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = req.body as IDataObject;

		return {
			workflowData: [
				this.helpers.returnJsonArray(body),
			],
		};
	}
}
