# n8n-nodes-doclayer

[![npm version](https://badge.fury.io/js/n8n-nodes-doclayer.svg)](https://badge.fury.io/js/n8n-nodes-doclayer)

This is an n8n community node for [Doclayer](https://doclayer.ai) — Headless Document AI Platform with 110+ agent templates.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Features

- 📄 **Document Management** - List, retrieve, and delete documents
- 📤 **Document Ingestion** - Upload documents with optional AI agent processing
- 🔍 **Semantic Search** - Vector, graph, and table search capabilities
- 📁 **Project Management** - Create and manage document projects
- 🤖 **Agent Templates** - Browse and use pre-built extraction agents
- ⚡ **Workflow Monitoring** - Track and manage processing workflows
- 💰 **Billing & Usage** - Track costs, usage breakdown, and estimates
- 🧠 **Model Configuration** - Manage LLM and embedding models
- 📊 **Status Monitoring** - Monitor job status and grounding coverage
- 🔔 **Webhook Triggers** - Real-time notifications for document events

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-doclayer`
4. Agree to the risks and click **Install**

### Manual Installation

```bash
# In your n8n installation directory
pnpm install n8n-nodes-doclayer
```

Or with npm:
```bash
npm install n8n-nodes-doclayer
```

## Configuration

### Credentials

1. In n8n, go to **Credentials** > **New**
2. Search for "Doclayer API"
3. Enter your credentials:
   - **API Key**: Your Doclayer API key
   - **Base URL**: Your Doclayer instance URL (default: `https://api.doclayer.ai`)

## Operations

### Document

| Operation | Description |
|-----------|-------------|
| **List** | List all documents in your account |
| **Get** | Retrieve a specific document by ID |
| **Get Chunks** | Get document chunks (text segments) |
| **Get Extractions** | Get AI-extracted data from a document |
| **Delete** | Delete a document |

### Ingestion

| Operation | Description |
|-----------|-------------|
| **Upload Document** | Upload a file for processing |
| **Get Presigned URL** | Get a URL for direct file upload |
| **List Jobs** | List all ingestion jobs |
| **Get Job** | Get details of an ingestion job |
| **Process Job** | Trigger processing for a job |
| **Cancel Job** | Cancel an active ingestion job |
| **Retry Job** | Retry a failed ingestion job |
| **Get Insights** | Get AI-generated insights from a job |

### Search

| Operation | Description |
|-----------|-------------|
| **Vector Search** | Semantic search using embeddings |
| **Graph Search** | Search using knowledge graph |
| **Table Search** | Search within extracted tables |

### Project

| Operation | Description |
|-----------|-------------|
| **List** | List all projects |
| **Get** | Get project details |
| **Create** | Create a new project |
| **Delete** | Delete a project |

### Agent Template

| Operation | Description |
|-----------|-------------|
| **List** | List available agent templates |
| **Get** | Get template details |

### Workflow

| Operation | Description |
|-----------|-------------|
| **List** | List all workflows |
| **Get** | Get workflow status |
| **Get History** | Get workflow execution history |
| **Cancel** | Cancel a running workflow |
| **Retry** | Retry a failed workflow |

### Billing

| Operation | Description |
|-----------|-------------|
| **Get Usage** | Get current period usage breakdown |
| **Get History** | Get billing history by month |
| **Get Tier** | Get current tier information |
| **Get Breakdown** | Get detailed cost breakdown by model |
| **Estimate Cost** | Estimate processing costs for an agent |

### Model

| Operation | Description |
|-----------|-------------|
| **Get Config** | Get current LLM and embedding configuration |
| **List Available** | List all available models by provider |
| **Set LLM** | Configure LLM provider and model |
| **Set Embedding** | Configure embedding provider and model |
| **Test Model** | Test model with sample text |

### Status

| Operation | Description |
|-----------|-------------|
| **List Jobs** | List ingestion jobs with filtering |
| **Inspect Job** | Get detailed job information |
| **Get Grounding Report** | Get extraction grounding coverage |

## Trigger Events (Webhooks)

The **Doclayer Trigger** node allows you to start workflows based on real-time events:

| Event | Description |
|-------|-------------|
| **Document Completed** | Fires when document processing completes |
| **Document Failed** | Fires when document processing fails |
| **Extraction Ready** | Fires when AI extraction is completed |
| **Job Status Changed** | Fires when an ingestion job status changes |
| **Workflow Completed** | Fires when a processing workflow completes |
| **Usage Threshold Reached** | Fires when billing hits a threshold |

## Example Workflows

### Upload and Extract Data

```
1. Trigger → 
2. Read Binary File → 
3. Doclayer (Upload Document with agent_id) → 
4. Wait (for processing) → 
5. Doclayer (Get Extractions) → 
6. Process Data
```

### Semantic Search

```
1. Webhook (with search query) → 
2. Doclayer (Vector Search) → 
3. Format Results → 
4. Respond to Webhook
```

### Document Processing Pipeline

```
1. Watch Folder → 
2. Doclayer (Upload Document) → 
3. Loop: Check Status →
4. Doclayer (Get Extractions) → 
5. Send to Database/API
```

### Cost Monitoring Workflow

```
1. Schedule Trigger (daily) →
2. Doclayer (Billing: Get Usage) →
3. IF cost > threshold →
4. Send Alert (Slack/Email)
```

### Model Configuration

```
1. Webhook →
2. Doclayer (Model: Set LLM) →
3. Doclayer (Model: Test) →
4. Return Success/Failure
```

### Real-time Processing with Triggers

```
1. Doclayer Trigger (Document Completed) →
2. Doclayer (Get Extractions) →
3. Google Sheets (Add Row) →
4. Slack (Send Message)
```

### Error Handling

```
1. Doclayer Trigger (Document Failed) →
2. Slack (Send Alert) →
3. Doclayer (Retry Job)
```

## Agent Templates

Doclayer provides pre-built agent templates for common use cases:

- **contracts.msa-risks** - Extract risks from Master Service Agreements
- **compliance.aml-entity-lookup** - AML entity verification
- **engineering.component-extractor** - Extract technical components
- And many more...

Use the `Agent Template ID` field when uploading documents to automatically apply extraction agents.

## Workflow Templates

This repository includes ready-to-use n8n workflow templates in the `templates/` directory:

| Template | Description |
|---------|-------------|
| `01-invoice-to-google-sheets.json` | Extract invoice data and add to spreadsheet |
| `02-contract-to-slack.json` | Analyze contracts and notify team |
| `03-document-to-webhook.json` | Process documents and send to callback URL |
| `04-realtime-to-airtable.json` | Real-time processing with Doclayer triggers |
| `05-error-handling-retry.json` | Automatic error handling and retry |

### Using Templates

1. Go to **Workflows** → **Import from File** in n8n
2. Select a template JSON file from the `templates/` directory
3. Configure your Doclayer credentials
4. Update any integration-specific settings (Google Sheets, Slack, etc.)
5. Save and activate the workflow

See the [templates README](templates/README.md) for detailed setup instructions for each template.

## Development

```bash
# Clone the repository
git clone https://github.com/doclayer/n8n-nodes-doclayer.git
cd n8n-nodes-doclayer

# Install dependencies
pnpm install

# Build
pnpm build

# Link for local testing
pnpm link --global
```

## Resources

- [Doclayer Documentation](https://docs.doclayer.ai)
- [Doclayer API Reference](https://docs.doclayer.ai/api)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [n8n Community Forum](https://community.n8n.io/)

## Support

- 📧 Email: support@doclayer.ai
- 💬 [Discord Community](https://discord.gg/doclayer)
- 🐛 [GitHub Issues](https://github.com/doclayer/n8n-nodes-doclayer/issues)

## License

This connector is provided under the MIT license. See [LICENSE](LICENSE) for details.

Note: The Doclayer platform and services are governed by separate license terms.

