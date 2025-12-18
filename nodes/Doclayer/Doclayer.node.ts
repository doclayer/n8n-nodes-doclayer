import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class Doclayer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Doclayer',
		name: 'doclayer',
		icon: 'file:doclayer.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'AI-powered document processing, extraction, and search',
		defaults: {
			name: 'Doclayer',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'doclayerApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// ─────────────────────────────────────────────────────────────
			// Resource
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Document',
						value: 'document',
						description: 'Work with documents',
					},
					{
						name: 'Ingestion',
						value: 'ingestion',
						description: 'Upload and process documents',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search across documents',
					},
					{
						name: 'Project',
						value: 'project',
						description: 'Manage projects',
					},
					{
						name: 'Agent Template',
						value: 'agentTemplate',
						description: 'Browse agent templates',
					},
					{
						name: 'Workflow',
						value: 'workflow',
						description: 'Manage processing workflows',
					},
					{
						name: 'Billing',
						value: 'billing',
						description: 'Usage tracking and cost management',
					},
					{
						name: 'Model',
						value: 'model',
						description: 'LLM and embedding model configuration',
					},
					{
						name: 'Status',
						value: 'status',
						description: 'Monitor ingestion jobs and processing status',
					},
				],
				default: 'document',
			},

			// ─────────────────────────────────────────────────────────────
			// Document Operations
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['document'],
					},
				},
				options: [
					{
						name: 'List',
						value: 'list',
						description: 'List all documents',
						action: 'List documents',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a document by ID',
						action: 'Get a document',
					},
					{
						name: 'Get Chunks',
						value: 'getChunks',
						description: 'Get document chunks',
						action: 'Get document chunks',
					},
					{
						name: 'Get Extractions',
						value: 'getExtractions',
						description: 'Get document extractions',
						action: 'Get document extractions',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a document',
						action: 'Delete a document',
					},
				],
				default: 'list',
			},

			// ─────────────────────────────────────────────────────────────
			// Ingestion Operations
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ingestion'],
					},
				},
				options: [
					{
						name: 'Upload Document',
						value: 'upload',
						description: 'Upload a document for processing',
						action: 'Upload a document',
					},
					{
						name: 'Get Presigned URL',
						value: 'presign',
						description: 'Get a presigned URL for direct upload',
						action: 'Get presigned URL',
					},
					{
						name: 'List Jobs',
						value: 'listJobs',
						description: 'List ingestion jobs',
						action: 'List ingestion jobs',
					},
					{
						name: 'Get Job',
						value: 'getJob',
						description: 'Get ingestion job details',
						action: 'Get ingestion job',
					},
					{
						name: 'Process Job',
						value: 'process',
						description: 'Trigger processing for a job',
						action: 'Process ingestion job',
					},
					{
						name: 'Cancel Job',
						value: 'cancel',
						description: 'Cancel an ingestion job',
						action: 'Cancel ingestion job',
					},
					{
						name: 'Retry Job',
						value: 'retry',
						description: 'Retry a failed ingestion job',
						action: 'Retry ingestion job',
					},
					{
						name: 'Get Insights',
						value: 'getInsights',
						description: 'Get AI-generated insights for a job',
						action: 'Get job insights',
					},
				],
				default: 'upload',
			},

			// ─────────────────────────────────────────────────────────────
			// Search Operations
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['search'],
					},
				},
				options: [
					{
						name: 'Vector Search',
						value: 'vector',
						description: 'Perform semantic vector search',
						action: 'Vector search',
					},
					{
						name: 'Graph Search',
						value: 'graph',
						description: 'Search using knowledge graph',
						action: 'Graph search',
					},
					{
						name: 'Table Search',
						value: 'table',
						description: 'Search within tables',
						action: 'Table search',
					},
				],
				default: 'vector',
			},

			// ─────────────────────────────────────────────────────────────
			// Project Operations
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: 'List',
						value: 'list',
						description: 'List all projects',
						action: 'List projects',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a project by ID',
						action: 'Get a project',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new project',
						action: 'Create a project',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a project',
						action: 'Delete a project',
					},
				],
				default: 'list',
			},

			// ─────────────────────────────────────────────────────────────
			// Agent Template Operations
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['agentTemplate'],
					},
				},
				options: [
					{
						name: 'List',
						value: 'list',
						description: 'List available agent templates',
						action: 'List agent templates',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get agent template details',
						action: 'Get agent template',
					},
				],
				default: 'list',
			},

			// ─────────────────────────────────────────────────────────────
			// Workflow Operations
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['workflow'],
					},
				},
				options: [
					{
						name: 'List',
						value: 'list',
						description: 'List all workflows',
						action: 'List workflows',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get workflow status',
						action: 'Get workflow',
					},
					{
						name: 'Get History',
						value: 'getHistory',
						description: 'Get workflow execution history',
						action: 'Get workflow history',
					},
					{
						name: 'Cancel',
						value: 'cancel',
						description: 'Cancel a running workflow',
						action: 'Cancel workflow',
					},
					{
						name: 'Retry',
						value: 'retry',
						description: 'Retry a failed workflow',
						action: 'Retry workflow',
					},
				],
				default: 'list',
			},

			// ─────────────────────────────────────────────────────────────
			// Billing Operations
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['billing'],
					},
				},
				options: [
					{
						name: 'Get Usage',
						value: 'getUsage',
						description: 'Get current usage breakdown',
						action: 'Get usage',
					},
					{
						name: 'Get History',
						value: 'getHistory',
						description: 'Get billing history',
						action: 'Get billing history',
					},
					{
						name: 'Get Tier',
						value: 'getTier',
						description: 'Get current tier information',
						action: 'Get tier info',
					},
					{
						name: 'Get Breakdown',
						value: 'getBreakdown',
						description: 'Get detailed cost breakdown by model',
						action: 'Get cost breakdown',
					},
					{
						name: 'Estimate Cost',
						value: 'estimate',
						description: 'Estimate processing costs',
						action: 'Estimate cost',
					},
				],
				default: 'getUsage',
			},

			// ─────────────────────────────────────────────────────────────
			// Model Operations
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['model'],
					},
				},
				options: [
					{
						name: 'Get Config',
						value: 'getConfig',
						description: 'Get current model configuration',
						action: 'Get model config',
					},
					{
						name: 'List Available',
						value: 'list',
						description: 'List available models',
						action: 'List available models',
					},
					{
						name: 'Set LLM',
						value: 'setLlm',
						description: 'Set LLM provider and model',
						action: 'Set LLM model',
					},
					{
						name: 'Set Embedding',
						value: 'setEmbedding',
						description: 'Set embedding provider and model',
						action: 'Set embedding model',
					},
					{
						name: 'Test Model',
						value: 'test',
						description: 'Test model with sample text',
						action: 'Test model',
					},
				],
				default: 'getConfig',
			},

			// ─────────────────────────────────────────────────────────────
			// Status Operations
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['status'],
					},
				},
				options: [
					{
						name: 'List Jobs',
						value: 'listJobs',
						description: 'List recent ingestion jobs with status',
						action: 'List jobs',
					},
					{
						name: 'Inspect Job',
						value: 'inspect',
						description: 'Inspect a single ingestion job with details',
						action: 'Inspect job',
					},
					{
						name: 'Get Grounding Report',
						value: 'grounding',
						description: 'Get extraction grounding coverage report',
						action: 'Get grounding report',
					},
				],
				default: 'listJobs',
			},

			// ─────────────────────────────────────────────────────────────
			// Common Fields
			// ─────────────────────────────────────────────────────────────

			// Document ID field
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['get', 'getChunks', 'getExtractions', 'delete'],
					},
				},
				description: 'The unique identifier of the document',
			},

			// Project ID field (for filtering)
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['document', 'ingestion'],
						operation: ['list', 'listJobs', 'upload'],
					},
				},
				description: 'Filter by project ID',
			},

			// Project ID (required for certain operations)
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['get', 'delete'],
					},
				},
				description: 'The unique identifier of the project',
			},

			// Job ID field
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['ingestion'],
						operation: ['getJob', 'process', 'cancel', 'retry', 'getInsights'],
					},
				},
				description: 'The unique identifier of the ingestion job',
			},

			// Workflow ID field
			{
				displayName: 'Workflow ID',
				name: 'workflowId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['workflow'],
						operation: ['get', 'getHistory', 'cancel', 'retry'],
					},
				},
				description: 'The unique identifier of the workflow',
			},

			// Template ID field
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['agentTemplate'],
						operation: ['get'],
					},
				},
				description: 'The unique identifier of the agent template',
			},

			// ─────────────────────────────────────────────────────────────
			// Ingestion Upload Fields
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						resource: ['ingestion'],
						operation: ['upload'],
					},
				},
				description: 'Name of the binary property containing the file to upload',
			},
			{
				displayName: 'Agent Template ID',
				name: 'agentId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['ingestion'],
						operation: ['upload'],
					},
				},
				description:
					'Optional agent template ID for processing (e.g., "contracts.msa-risks")',
			},

			// ─────────────────────────────────────────────────────────────
			// Presign Fields
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Filename',
				name: 'filename',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['ingestion'],
						operation: ['presign'],
					},
				},
				description: 'The name of the file to upload',
			},
			{
				displayName: 'Content Type',
				name: 'contentType',
				type: 'string',
				default: 'application/pdf',
				displayOptions: {
					show: {
						resource: ['ingestion'],
						operation: ['presign'],
					},
				},
				description: 'MIME type of the file',
			},

			// ─────────────────────────────────────────────────────────────
			// Search Fields
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['search'],
					},
				},
				description: 'The search query',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 10,
				displayOptions: {
					show: {
						resource: ['search'],
					},
				},
				description: 'Maximum number of results to return',
			},

			// ─────────────────────────────────────────────────────────────
			// Project Create Fields
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Project Name',
				name: 'projectName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create'],
					},
				},
				description: 'Name for the new project',
			},
			{
				displayName: 'Description',
				name: 'projectDescription',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create'],
					},
				},
				description: 'Description for the new project',
			},

			// ─────────────────────────────────────────────────────────────
			// Additional Options
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['document'],
						operation: ['list'],
					},
				},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'All', value: '' },
							{ name: 'Pending', value: 'pending' },
							{ name: 'Processing', value: 'processing' },
							{ name: 'Completed', value: 'completed' },
							{ name: 'Failed', value: 'failed' },
						],
						default: '',
						description: 'Filter by document status',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 20,
						description: 'Maximum number of documents to return',
					},
				],
			},

			// Category filter for templates
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['agentTemplate'],
						operation: ['list'],
					},
				},
				description: 'Filter templates by category',
			},

			// ─────────────────────────────────────────────────────────────
			// Billing Fields
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Period',
				name: 'period',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['billing'],
						operation: ['getUsage', 'getBreakdown'],
					},
				},
				description: 'Period in YYYY-MM format (default: current month)',
			},
			{
				displayName: 'Limit',
				name: 'historyLimit',
				type: 'number',
				default: 12,
				displayOptions: {
					show: {
						resource: ['billing'],
						operation: ['getHistory'],
					},
				},
				description: 'Number of months to return',
			},
			{
				displayName: 'Agent ID',
				name: 'estimateAgentId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['billing'],
						operation: ['estimate'],
					},
				},
				description: 'Agent template ID for cost estimation',
			},
			{
				displayName: 'Document Count',
				name: 'estimateCount',
				type: 'number',
				required: true,
				default: 1,
				displayOptions: {
					show: {
						resource: ['billing'],
						operation: ['estimate'],
					},
				},
				description: 'Number of documents to estimate cost for',
			},

			// ─────────────────────────────────────────────────────────────
			// Model Fields
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Provider Filter',
				name: 'providerFilter',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['model'],
						operation: ['list'],
					},
				},
				description: 'Filter models by provider',
			},
			{
				displayName: 'Provider',
				name: 'provider',
				type: 'options',
				required: true,
				options: [
					{ name: 'Mistral', value: 'mistral' },
					{ name: 'Gemini', value: 'gemini' },
					{ name: 'OpenAI', value: 'openai' },
				],
				default: 'openai',
				displayOptions: {
					show: {
						resource: ['model'],
						operation: ['setLlm', 'setEmbedding'],
					},
				},
				description: 'Model provider',
			},
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['model'],
						operation: ['setLlm', 'setEmbedding'],
					},
				},
				description: 'The model ID to use',
			},
			{
				displayName: 'Test Text',
				name: 'testText',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['model'],
						operation: ['test'],
					},
				},
				description: 'Sample text to send to the model',
			},

			// ─────────────────────────────────────────────────────────────
			// Status Fields
			// ─────────────────────────────────────────────────────────────
			{
				displayName: 'Job ID',
				name: 'statusJobId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['status'],
						operation: ['inspect'],
					},
				},
				description: 'Ingestion job ID to inspect',
			},
			{
				displayName: 'Additional Options',
				name: 'statusOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['status'],
						operation: ['listJobs'],
					},
				},
				options: [
					{
						displayName: 'Project ID',
						name: 'projectId',
						type: 'string',
						default: '',
						description: 'Filter by project ID',
					},
					{
						displayName: 'Status Filter',
						name: 'statusFilter',
						type: 'multiOptions',
						options: [
							{ name: 'Pending', value: 'pending' },
							{ name: 'Processing', value: 'processing' },
							{ name: 'Completed', value: 'completed' },
							{ name: 'Failed', value: 'failed' },
						],
						default: [],
						description: 'Filter by job status',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 25,
						description: 'Maximum jobs to return',
					},
				],
			},
			{
				displayName: 'Grounding Options',
				name: 'groundingOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['status'],
						operation: ['grounding'],
					},
				},
				options: [
					{
						displayName: 'Job ID',
						name: 'jobId',
						type: 'string',
						default: '',
						description: 'Filter by job ID',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'string',
						default: '',
						description: 'Filter by trace status',
					},
					{
						displayName: 'Field Name',
						name: 'fieldName',
						type: 'string',
						default: '',
						description: 'Filter by field name',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 20,
						description: 'Maximum traces to inspect',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('doclayerApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};
				let method: IHttpRequestMethods = 'GET';
				let endpoint = '';
				let body: IDataObject = {};
				const qs: IDataObject = {};

				// ─────────────────────────────────────────────────────────────
				// Document Resource
				// ─────────────────────────────────────────────────────────────
				if (resource === 'document') {
					if (operation === 'list') {
						method = 'GET';
						endpoint = '/api/v4/documents';
						const projectId = this.getNodeParameter('projectId', i, '') as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
						if (projectId) qs.project_id = projectId;
						if (additionalFields.status) qs.doc_status = additionalFields.status;
						if (additionalFields.limit) qs.limit = additionalFields.limit;
					} else if (operation === 'get') {
						method = 'GET';
						const documentId = this.getNodeParameter('documentId', i) as string;
						endpoint = `/api/v4/documents/${documentId}`;
					} else if (operation === 'getChunks') {
						method = 'GET';
						const documentId = this.getNodeParameter('documentId', i) as string;
						endpoint = `/api/v4/documents/${documentId}/chunks`;
					} else if (operation === 'getExtractions') {
						method = 'GET';
						const documentId = this.getNodeParameter('documentId', i) as string;
						endpoint = `/api/v4/documents/${documentId}/extractions`;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const documentId = this.getNodeParameter('documentId', i) as string;
						endpoint = `/api/v4/documents/${documentId}`;
					}
				}

				// ─────────────────────────────────────────────────────────────
				// Ingestion Resource
				// ─────────────────────────────────────────────────────────────
				else if (resource === 'ingestion') {
					if (operation === 'upload') {
						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
						const projectId = this.getNodeParameter('projectId', i, '') as string;
						const agentId = this.getNodeParameter('agentId', i, '') as string;

						const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
						const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

						// Build multipart form data
						const boundary = '----n8nFormBoundary' + Math.random().toString(36).substring(2);
						const fileName = binaryData.fileName || 'document';
						const mimeType = binaryData.mimeType || 'application/octet-stream';

						// Create multipart body
						let bodyParts: Buffer[] = [];

						// Add file part
						bodyParts.push(Buffer.from(
							`--${boundary}\r\n` +
							`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n` +
							`Content-Type: ${mimeType}\r\n\r\n`
						));
						bodyParts.push(buffer);
						bodyParts.push(Buffer.from('\r\n'));

						// Add project_id part
						bodyParts.push(Buffer.from(
							`--${boundary}\r\n` +
							`Content-Disposition: form-data; name="project_id"\r\n\r\n` +
							`${projectId}\r\n`
						));

						// Add agent_id part if provided
						if (agentId) {
							bodyParts.push(Buffer.from(
								`--${boundary}\r\n` +
								`Content-Disposition: form-data; name="agent_id"\r\n\r\n` +
								`${agentId}\r\n`
							));
						}

						// Close boundary
						bodyParts.push(Buffer.from(`--${boundary}--\r\n`));

						const requestOptions: IHttpRequestOptions = {
							method: 'POST',
							url: `${baseUrl}/api/v4/ingest`,
							body: Buffer.concat(bodyParts),
							headers: {
								'Content-Type': `multipart/form-data; boundary=${boundary}`,
							},
						};

						responseData = (await this.helpers.httpRequestWithAuthentication.call(
							this,
							'doclayerApi',
							requestOptions,
						)) as IDataObject;

						returnData.push({ json: responseData });
						continue;
					} else if (operation === 'presign') {
						method = 'POST';
						endpoint = '/api/v4/ingest/presign';
						const filename = this.getNodeParameter('filename', i) as string;
						const contentType = this.getNodeParameter('contentType', i, 'application/pdf') as string;
						body = { filename, content_type: contentType };
					} else if (operation === 'listJobs') {
						method = 'GET';
						endpoint = '/api/v4/ingest/jobs';
					} else if (operation === 'getJob') {
						method = 'GET';
						const jobId = this.getNodeParameter('jobId', i) as string;
						endpoint = `/api/v4/ingest/${jobId}`;
					} else if (operation === 'process') {
						method = 'POST';
						const jobId = this.getNodeParameter('jobId', i) as string;
						endpoint = `/api/v4/ingest/${jobId}/process`;
					} else if (operation === 'cancel') {
						method = 'POST';
						const jobId = this.getNodeParameter('jobId', i) as string;
						endpoint = `/api/v4/ingestions/${jobId}/cancel`;
					} else if (operation === 'retry') {
						method = 'POST';
						const jobId = this.getNodeParameter('jobId', i) as string;
						endpoint = `/api/v4/ingestions/${jobId}/retry`;
					} else if (operation === 'getInsights') {
						method = 'GET';
						const jobId = this.getNodeParameter('jobId', i) as string;
						endpoint = `/api/v4/ingest/${jobId}/insights`;
					}
				}

				// ─────────────────────────────────────────────────────────────
				// Search Resource
				// ─────────────────────────────────────────────────────────────
				else if (resource === 'search') {
					method = 'POST';
					const query = this.getNodeParameter('query', i) as string;
					const limit = this.getNodeParameter('limit', i, 10) as number;

					if (operation === 'vector') {
						endpoint = '/api/v4/search/vector';
						body = { query, limit };
					} else if (operation === 'graph') {
						endpoint = '/api/v4/search/graph';
						body = { query, limit };
					} else if (operation === 'table') {
						endpoint = '/api/v4/table/search';
						body = { query, limit };
					}
				}

				// ─────────────────────────────────────────────────────────────
				// Project Resource
				// ─────────────────────────────────────────────────────────────
				else if (resource === 'project') {
					if (operation === 'list') {
						method = 'GET';
						endpoint = '/api/v4/projects';
					} else if (operation === 'get') {
						method = 'GET';
						const projectId = this.getNodeParameter('projectId', i) as string;
						endpoint = `/api/v4/projects/${projectId}`;
					} else if (operation === 'create') {
						method = 'POST';
						endpoint = '/api/v4/projects';
						const projectName = this.getNodeParameter('projectName', i) as string;
						const projectDescription = this.getNodeParameter('projectDescription', i, '') as string;
						body = { name: projectName };
						if (projectDescription) body.description = projectDescription;
					} else if (operation === 'delete') {
						method = 'DELETE';
						const projectId = this.getNodeParameter('projectId', i) as string;
						endpoint = `/api/v4/projects/${projectId}`;
					}
				}

				// ─────────────────────────────────────────────────────────────
				// Agent Template Resource
				// ─────────────────────────────────────────────────────────────
				else if (resource === 'agentTemplate') {
					if (operation === 'list') {
						method = 'GET';
						endpoint = '/api/v4/agents/templates';
						const category = this.getNodeParameter('category', i, '') as string;
						if (category) qs.category = category;
					} else if (operation === 'get') {
						method = 'GET';
						const templateId = this.getNodeParameter('templateId', i) as string;
						endpoint = `/api/v4/agents/templates/${templateId}`;
					}
				}

				// ─────────────────────────────────────────────────────────────
				// Workflow Resource
				// ─────────────────────────────────────────────────────────────
				else if (resource === 'workflow') {
					if (operation === 'list') {
						method = 'GET';
						endpoint = '/api/v4/workflows';
					} else if (operation === 'get') {
						method = 'GET';
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						endpoint = `/api/v4/workflows/${workflowId}`;
					} else if (operation === 'getHistory') {
						method = 'GET';
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						endpoint = `/api/v4/workflows/${workflowId}/history`;
					} else if (operation === 'cancel') {
						method = 'POST';
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						endpoint = `/api/v4/workflows/${workflowId}/cancel`;
					} else if (operation === 'retry') {
						method = 'POST';
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						endpoint = `/api/v4/workflows/${workflowId}/retry`;
					}
				}

				// ─────────────────────────────────────────────────────────────
				// Billing Resource
				// ─────────────────────────────────────────────────────────────
				else if (resource === 'billing') {
					if (operation === 'getUsage') {
						method = 'GET';
						endpoint = '/api/v4/billing/usage';
						const period = this.getNodeParameter('period', i, '') as string;
						if (period) qs.period = period;
					} else if (operation === 'getHistory') {
						method = 'GET';
						endpoint = '/api/v4/billing/history';
						const limit = this.getNodeParameter('historyLimit', i, 12) as number;
						qs.limit = limit;
					} else if (operation === 'getTier') {
						method = 'GET';
						endpoint = '/api/v4/billing/tier';
					} else if (operation === 'getBreakdown') {
						method = 'GET';
						endpoint = '/api/v4/billing/breakdown';
						const period = this.getNodeParameter('period', i, '') as string;
						if (period) qs.period = period;
					} else if (operation === 'estimate') {
						method = 'POST';
						endpoint = '/api/v4/billing/estimate';
						const agentId = this.getNodeParameter('estimateAgentId', i) as string;
						const count = this.getNodeParameter('estimateCount', i) as number;
						body = { agent_id: agentId, count };
					}
				}

				// ─────────────────────────────────────────────────────────────
				// Model Resource
				// ─────────────────────────────────────────────────────────────
				else if (resource === 'model') {
					if (operation === 'getConfig') {
						method = 'GET';
						endpoint = '/api/v4/models/config';
					} else if (operation === 'list') {
						method = 'GET';
						endpoint = '/api/v4/models/available';
						const provider = this.getNodeParameter('providerFilter', i, '') as string;
						if (provider) qs.provider = provider;
					} else if (operation === 'setLlm') {
						method = 'PUT';
						endpoint = '/api/v4/models/llm';
						const provider = this.getNodeParameter('provider', i) as string;
						const modelId = this.getNodeParameter('modelId', i) as string;
						body = { provider, model_id: modelId };
					} else if (operation === 'setEmbedding') {
						method = 'PUT';
						endpoint = '/api/v4/models/embedding';
						const provider = this.getNodeParameter('provider', i) as string;
						const modelId = this.getNodeParameter('modelId', i) as string;
						body = { provider, model_id: modelId };
					} else if (operation === 'test') {
						method = 'POST';
						endpoint = '/api/v4/models/test';
						const text = this.getNodeParameter('testText', i) as string;
						body = { text };
					}
				}

				// ─────────────────────────────────────────────────────────────
				// Status Resource
				// ─────────────────────────────────────────────────────────────
				else if (resource === 'status') {
					if (operation === 'listJobs') {
						method = 'GET';
						endpoint = '/api/v4/ingest/jobs';
						const options = this.getNodeParameter('statusOptions', i, {}) as IDataObject;
						if (options.projectId) qs.project_id = options.projectId;
						if (options.statusFilter && (options.statusFilter as string[]).length > 0) {
							qs.status = (options.statusFilter as string[]).join(',');
						}
						if (options.limit) qs.limit = options.limit;
					} else if (operation === 'inspect') {
						method = 'GET';
						const jobId = this.getNodeParameter('statusJobId', i) as string;
						endpoint = `/api/v4/ingest/${jobId}`;
					} else if (operation === 'grounding') {
						method = 'GET';
						endpoint = '/api/v4/extraction-traces';
						const options = this.getNodeParameter('groundingOptions', i, {}) as IDataObject;
						if (options.jobId) qs.job_id = options.jobId;
						if (options.status) qs.status = options.status;
						if (options.fieldName) qs.field_name = options.fieldName;
						if (options.limit) qs.limit = options.limit;
					}
				}

				// Make the request
				const requestOptions: IHttpRequestOptions = {
					method,
					url: `${baseUrl}${endpoint}`,
					qs,
					json: true,
				};

				if (Object.keys(body).length > 0) {
					requestOptions.body = body;
				}

				responseData = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'doclayerApi',
					requestOptions,
				)) as IDataObject;

				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((item) => ({ json: item })));
				} else {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}

