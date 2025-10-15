import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express, { Request, Response } from 'express';
import { PomeriumVerifier } from '@pomerium/js-sdk';
import { z } from 'zod';

// Create an MCP server
const server = new McpServer({
    name: 'pomerium-demo-mcp-server',
    version: '1.0.0'
});

// Register a calculator tool
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers together',
        inputSchema: { a: z.number(), b: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ a, b }) => {
        const output = { result: a + b };
        return {
            content: [{ type: 'text', text: `The sum of ${a} and ${b} is ${output.result}` }],
            structuredContent: output
        };
    }
);

// Register a user info tool that uses Pomerium JWT
server.registerTool(
    'get_user_info',
    {
        title: 'Get User Info',
        description: 'Get authenticated user information from Pomerium JWT',
        inputSchema: { jwt: z.string().optional() },
        outputSchema: { 
            email: z.string().optional(),
            name: z.string().optional(),
            user: z.string().optional()
        }
    },
    async ({ jwt }) => {
        if (!jwt) {
            return {
                content: [{ type: 'text', text: 'No JWT provided' }],
                structuredContent: { error: 'No JWT provided' }
            };
        }

        try {
            const jwtVerifier = new PomeriumVerifier({ expirationBuffer: 1000 });
            const verified = await jwtVerifier.verifyJwt(jwt);
            
            const output = {
                email: verified.payload.email as string | undefined,
                name: verified.payload.name as string | undefined,
                user: verified.payload.user as string | undefined
            };

            return {
                content: [{ 
                    type: 'text', 
                    text: `User: ${output.name || 'Unknown'} (${output.email || 'no email'})` 
                }],
                structuredContent: output
            };
        } catch (error) {
            return {
                content: [{ 
                    type: 'text', 
                    text: `Error verifying JWT: ${error instanceof Error ? error.message : 'Unknown error'}` 
                }],
                structuredContent: { error: 'JWT verification failed' }
            };
        }
    }
);

// Register a dynamic greeting resource
server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    {
        title: 'Greeting Resource',
        description: 'Generate personalized greetings'
    },
    async (uri, { name }) => ({
        contents: [
            {
                uri: uri.href,
                text: `Hello, ${name}! Welcome to Pomerium MCP Server.`,
                mimeType: 'text/plain'
            }
        ]
    })
);

// Register a static resource with info about Pomerium
server.registerResource(
    'pomerium-info',
    new ResourceTemplate('info://pomerium', { list: undefined }),
    {
        title: 'Pomerium Info',
        description: 'Information about Pomerium'
    },
    async (uri) => ({
        contents: [
            {
                uri: uri.href,
                text: 'Pomerium is an identity-aware access proxy. Learn more at https://pomerium.com',
                mimeType: 'text/plain'
            }
        ]
    })
);

// Set up Express and HTTP transport
const app = express();
app.use(express.json());

// Health check endpoint
app.get('/', (_req: Request, res: Response) => {
    res.json({
        name: 'Pomerium MCP Server',
        version: '1.0.0',
        status: 'running',
        mcp_endpoint: '/mcp'
    });
});

// MCP endpoint
app.post('/mcp', async (req: Request, res: Response) => {
    try {
        // Create a new transport for each request to prevent request ID collisions
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true
        });

        res.on('close', () => {
            transport.close();
        });

        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('Error handling MCP request:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

const port = parseInt(process.env.PORT || '3010');
app.listen(port, () => {
    console.log(`Pomerium MCP Server running on http://localhost:${port}`);
    console.log(`MCP endpoint: http://localhost:${port}/mcp`);
    console.log('');
    console.log('Available tools:');
    console.log('  - add: Add two numbers together');
    console.log('  - get_user_info: Get authenticated user information from Pomerium JWT');
    console.log('');
    console.log('Available resources:');
    console.log('  - greeting://{name}: Generate personalized greetings');
    console.log('  - info://pomerium: Information about Pomerium');
}).on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
});
