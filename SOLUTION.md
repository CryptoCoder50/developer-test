Take-Home Challenge – Blockchain

Task: Integration of a smart contract into the backend and display of results on the main page

1. Overview

This solution implements the required Blockchain Integration MVP by:

Adding a new backend API endpoint named technical_assessment

Fetching smart contract and live blockchain network information via ethers.js

Displaying the results on the project’s main page via a frontend widget

Ensuring the contract address and RPC configuration are environment-driven

The implementation demonstrates real-time blockchain access and clean frontend-backend integration.

2. Backend Implementation
2.1 New API Endpoint

A new API endpoint was added:

GET /api/technical_assessment


This endpoint retrieves and returns:

Contract address

Network / chain information (name, chainId)

Latest block number (proof of live blockchain access)

RPC timestamp (proof of backend execution)

Contract creator and deployment timestamp (optional, via Etherscan)

2.2 Backend Files Added 

Controller

server/controllers/technicalAssessmentController.js

Responsibilities:

Connects to Ethereum using ethers.js (v5)

Reads the contract address from environment variables

Fetches live chain data using an RPC provider

Optionally fetches contract creation metadata via Etherscan

Returns structured JSON for frontend consumption

Route

server/routes/technicalAssessmentRoute.js

Registers:

GET /technical_assessment


App Mount

server/app.js

Mounted under:

app.use("/api", technicalAssessmentRoute);

2.3 Environment Configuration

Backend configuration is environment-driven.

Required variables:

RPC_URL=https://eth.llamarpc.com
TECH_ASSESSMENT_CONTRACT_ADDRESS=0xdAC17F958D2ee523a2206206994597C13D831ec7


Optional (to include creator and deployment timestamp):

ETHERSCAN_API_KEY=YOUR_API_KEY

3. Frontend Implementation
3.1 Technical Assessment Widget

A new frontend widget was added to display the smart contract information retrieved from the backend.

Features:

Calls /api/technical_assessment

Displays contract and network details

Includes a Refresh button to re-fetch data

Automatically retries if the backend is not ready at first load

3.2 Frontend Files Added / Modified

Widget Component

src/components/TechnicalAssessmentWidget.jsx

Home Page Integration

src/pages/Home.jsx

Rendered on the main page:

<TechnicalAssessmentWidget />

3.3 Frontend Proxy Configuration

To enable clean API calls from the frontend:

"proxy": "http://localhost:3099"


This allows /api/* requests from port 3000 to be forwarded to the backend.

4. Running the Project
4.1 Start Frontend and Backend Together

A single development command is provided:

npm run dev


This starts:

Backend on http://localhost:3099

Frontend on http://localhost:3000

Both services stop cleanly with CTRL + C.

5. Verification Steps
5.1 Verify Backend API

Open in a browser:

http://localhost:3099/api/technical_assessment


Expected:

JSON response

rpcTimestamp updates on refresh

rpcBlockNumber reflects current blockchain height

5.2 Verify Frontend Display

Open:

http://localhost:3000


Scroll to the Technical Assessment section on the main page.

Expected:

Smart contract address displayed

Network / chain information visible

Latest block number visible

Refresh button updates the data

6. Notes

deploymentTimestamp is derived from the contract’s deployment block and is therefore static by design

rpcTimestamp is intentionally dynamic to demonstrate live backend execution

Creator and deployment metadata require an Etherscan API key due to blockchain indexing constraints

7. Delivery Note

A Loom video could not be recorded due to Loom incompatibility on the available system.
This document fully describes the implementation and provides clear steps to reproduce and verify the solution locally.

8. Summary

This solution fulfills all challenge requirements by:

Integrating blockchain access into the backend

Exposing smart contract data via a clean API

Displaying the results on the main page

Demonstrating real-time blockchain interaction