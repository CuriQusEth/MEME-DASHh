# Meme Das Orchestrator

**Meme Das Orchestrator** is an ERC-8004 compliant AI Agent and Model Context Protocol (MCP) orchestrator for the **Meme Das** platform. It serves as an intelligent orchestrator focusing on meme culture, dash mechanics, viral content management, and meme economy automation.

## Project Overview

This project provides trustless, on-chain deterministic behavioral agents that interact directly with the in-game economy. Built with modern web technologies, the orchestrator connects robust web tools with active command execution environments.

### Capabilities

- Meme Culture Management
- Viral Content Automation
- Dash Mechanics
- Meme Economy Orchestration
- Trend Detection
- Community Engagement
- MCP Command Execution

## Tech Stack

- **Framework:** Next.js 14 (App Router enabled for API endpoints) / Express + Vite (Frontend Preview)
- **Extensibility:** Model Context Protocol (MCP)
- **Web3 Integration:** ERC-8004 Standard, Base Mainnet (Chain ID: eip155:8453)
- **API Services:** A2A communications, MCP execution parsing, REST Agent API

## MCP Connection Guide

The system implements the full **Model Context Protocol** (MCP). To connect to the MCP server:

1. Setup your MCP client configuration and point it at the hosted endpoint:
   `https://meme-das-hh.vercel.app/api/mcp`
2. The endpoint responds to both `GET` (health/discovery) and `POST` (execution) calls.
3. The orchestrator exposes the following toolsets [PLACEHOLDER - Ensure tools are registered]:
   - `get_race_status`
   - `start_race`
   - `get_leaderboard`
   - `optimize_speed`
   - `get_track_info`

## Agent Registration

The agent is publicly registered and discoverable via an standard `.well-known` interface at:
`https://meme-das-hh.vercel.app/.well-known/agent-card.json`

This card is aligned with ERC-8004 schema standards containing endpoint definitions, descriptions, capabilities, and versioning info.

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server for local API testing:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Disclaimer

This is for educational and entertainment purposes. Make sure to review the code before deploying any on-chain applications. 
[PLACEHOLDER] Insert API keys, secrets, or wallet private keys in your `.env` securely. Never commit them to the repository.
