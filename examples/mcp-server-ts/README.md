# TypeScript MCP Server Example

This is a TypeScript-based Model Context Protocol (MCP) server example that demonstrates how to use the `@pomerium/js-sdk` library to verify Pomerium JWTs in an MCP server context.

## What is MCP?

The [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). MCP enables secure, controlled interactions between AI systems and external data sources and tools.

## About This Example

This example showcases:

- **MCP Server Implementation**: A TypeScript-based MCP server using `@modelcontextprotocol/sdk`
- **Pomerium JWT Verification**: Integration with `@pomerium/js-sdk` for secure authentication
- **MCP Tools**: Example tools including a calculator and user information retrieval
- **MCP Resources**: Dynamic and static resources for LLM context
- **HTTP Transport**: Streamable HTTP transport using Express

## Real-World Example

For a complete production example of an MCP server secured with Pomerium, see the [mcp-app-demo](https://github.com/pomerium/mcp-app-demo) repository. This demo shows:

- A full chat application using MCP servers
- Integration with OpenAI for AI-powered interactions
- Pomerium-secured MCP servers with OAuth2 upstream authentication
- Real-time MCP tool call monitoring
- Complete Docker Compose setup

The demo uses `@pomerium/js-sdk` in the [UserContext component](https://github.com/pomerium/mcp-app-demo/blob/main/src/contexts/UserContext.tsx) to verify user authentication.

## Prerequisites

- Node.js 18 or later
- npm or yarn

## Installation

From this directory, install the dependencies:

```bash
npm install
```

## Running the Server

### Development Mode

Run the server with hot reloading using `tsx`:

```bash
npm run dev
```

### Production Mode

Build and run the compiled JavaScript:

```bash
npm run build
npm start
```

The server will start on `http://localhost:3010` by default. You can change the port by setting the `PORT` environment variable:

```bash
PORT=8080 npm run dev
```

## Testing the MCP Server

Once running, you can test the server with various MCP clients:

### Using MCP Inspector

The [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) is a great tool for testing:

```bash
npx @modelcontextprotocol/inspector
```

Then connect to: `http://localhost:3010/mcp`

### Using Claude Code

```bash
claude mcp add --transport http pomerium-demo http://localhost:3010/mcp
```

### Using VS Code

```bash
code --add-mcp '{"name":"pomerium-demo","type":"http","url":"http://localhost:3010/mcp"}'
```

### Using Cursor

Click this deeplink to add the server to Cursor:
[cursor://anysphere.cursor-deeplink/mcp/install?name=pomerium-demo&config=eyJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMTAvbWNwIn0=](cursor://anysphere.cursor-deeplink/mcp/install?name=pomerium-demo&config=eyJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMTAvbWNwIn0=)

## Available Tools

The server provides these MCP tools:

### `add`
Adds two numbers together.

**Input:**
```json
{
  "a": 5,
  "b": 3
}
```

**Output:**
```json
{
  "result": 8
}
```

### `get_user_info`
Retrieves authenticated user information from a Pomerium JWT token.

**Input:**
```json
{
  "jwt": "eyJhbGc..."
}
```

**Output:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "user": "user-id"
}
```

## Available Resources

### `greeting://{name}`
Generates a personalized greeting for the specified name.

**Example:** `greeting://Alice` returns "Hello, Alice! Welcome to Pomerium MCP Server."

### `info://pomerium`
Provides information about Pomerium.

## Integration with Pomerium

When running behind Pomerium, this server can verify JWTs from the `X-Pomerium-Jwt-Assertion` header. To use this in a production environment:

1. Set up a Pomerium route pointing to this server:

```yaml
routes:
  - from: https://mcp-server.yourdomain.com
    to: http://localhost:3010
    name: MCP Server
    pass_identity_headers: true
    allowed_domains:
      - yourdomain.com
    mcp:
      server: {}
```

2. The server will automatically verify the JWT from the `X-Pomerium-Jwt-Assertion` header
3. Use the `get_user_info` tool to retrieve authenticated user information

## Project Structure

```
mcp-server-ts/
├── server.ts          # Main MCP server implementation
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── README.md          # This file
└── .gitignore        # Git ignore rules
```

## Dependencies

- `@modelcontextprotocol/sdk`: Official MCP TypeScript SDK
- `@pomerium/js-sdk`: Pomerium JWT verification library
- `express`: Web framework for HTTP transport
- `zod`: Schema validation for MCP tools
- `typescript`: TypeScript compiler
- `tsx`: TypeScript execution for development

## Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Pomerium Documentation](https://www.pomerium.com/docs/)
- [Pomerium MCP Demo](https://github.com/pomerium/mcp-app-demo)
- [MCP Capability Overview](https://main.docs.pomerium.com/docs/capabilities/mcp)

## License

Apache-2.0
