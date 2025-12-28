# n8n-nodes-r1rcm

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for R1 RCM revenue cycle management platform, providing 22 resources and 200+ operations for healthcare revenue cycle automation. Includes patient access, eligibility verification, prior authorization, claim lifecycle management, denial management, payment posting, Epic EHR integration, and intelligent automation.

![n8n](https://img.shields.io/badge/n8n-community--node-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## Features

- **Patient Access & Registration** - Patient search, demographics, financial clearance, coverage discovery
- **Eligibility Verification (270/271)** - Real-time and batch eligibility checking, benefits lookup
- **Prior Authorization (278)** - Submit, track, and manage prior authorizations
- **Charge Capture & Coding** - Charge creation, coding workflows, code validation, CCI edits
- **Claim Lifecycle (837P/I/D)** - Create, submit, track, correct, and void claims
- **Claim Status (276/277)** - Real-time claim status inquiries
- **Denial Management** - Denial analysis, root cause, appeals, prevention recommendations
- **Payment Posting (835)** - ERA processing, payment reconciliation, variance detection
- **A/R Management** - Aging analysis, follow-up queues, collection workflows
- **Epic Integration** - HL7/FHIR data synchronization with Epic EHR
- **Work Queue Management** - Task assignment, SLA tracking, productivity metrics
- **Analytics & Reporting** - KPIs, dashboards, trend analysis, scheduled reports
- **Intelligent Automation** - AI/ML-powered automation rules and predictions
- **SFTP File Transfer** - Secure EDI file upload/download with validation
- **Webhooks** - Real-time event subscriptions for RCM events

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-r1rcm`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-r1rcm
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-r1rcm.zip
cd n8n-nodes-r1rcm

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-r1rcm

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-r1rcm %CD%

# 5. Restart n8n
n8n start
```

## Credentials Setup

### R1 RCM API Credentials

| Field | Description |
|-------|-------------|
| Environment | Production, Test/UAT, or Custom |
| Client ID | OAuth 2.0 client identifier |
| Client Secret | OAuth 2.0 client secret |
| API Key | API key for additional authentication |
| Organization ID | Your R1 RCM organization identifier |
| Facility ID | Default facility identifier |

### R1 RCM Integration Credentials (Epic)

| Field | Description |
|-------|-------------|
| Integration Endpoint | Epic integration endpoint URL |
| Certificate | mTLS certificate (PEM format) |
| Private Key | mTLS private key (PEM format) |
| Partner ID | R1 RCM partner identifier |

### R1 RCM SFTP Credentials

| Field | Description |
|-------|-------------|
| Host | SFTP server hostname |
| Port | SFTP port (default: 22) |
| Username | SFTP username |
| Password/SSH Key | Authentication method |
| Directory Path | Default directory for operations |

## Resources & Operations

### Patient Access (11 operations)
- Get Patient Info, Search Patients, Create/Update Patient
- Get Demographics, Verify Identity
- Get Insurance Coverage, Financial Clearance
- Patient Responsibility Estimate, Coverage Discovery
- Propensity to Pay

### Registration (8 operations)
- Create/Get/Update Registration
- Get Status, Complete, Cancel
- Pre-Registration Info, Registration Queue

### Eligibility (9 operations)
- Check Eligibility (270/271), Real-Time Eligibility
- Batch Check, Benefits Summary
- Coverage Details, Deductible Info, Copay Info
- Prior Auth Requirements, Eligibility History

### Prior Authorization (9 operations)
- Submit/Get/Update/Cancel Prior Auth
- Auth Reference, Requirements
- Track Request, Auth Queue, Auth History

### Charge Capture (10 operations)
- Create/Get/Update/Delete Charge
- Charges by Encounter/Patient
- Unbilled Charges, Charge Lag
- Review Charge, Coding Queue

### Coding (10 operations)
- Get Encounter for Coding, Submit Codes
- Coding Status, Query Codes
- Code Suggestions, Validate Codes
- CCI Edits, LCD/NCD
- Coding Queue, Productivity

### Claim (12 operations)
- Create/Get/Submit Claim (837P/I/D)
- Get Status (276/277), Update/Void
- Resubmit, Correct
- Claim History, Lifecycle
- Claims by Patient, Claim Errors

### Denial (11 operations)
- Get Denial/Denials, Analyze
- Denial Reason, Root Cause
- Create/Get/Track Appeal
- Denial Trends, Prevention Recommendations
- Denial Queue

### Payment (11 operations)
- Get/Post/Apply Payment
- Get ERA (835)
- Payment by Check/Payer
- Unapplied Payments
- Reconcile, Payment Variance
- Contract Variance, Underpayments

### A/R Management (10 operations)
- A/R Aging, A/R by Payer/Facility
- High Balance Accounts
- Follow-Up/Collection/Bad Debt Queue
- Assign Work, Work Status
- Update A/R Status

### Work Queue (9 operations)
- Get Work Queues, Queue Items
- Assign/Complete/Transfer Work Item
- Queue Metrics, Queue by Type
- User Work, Queue SLA

### Analytics (13 operations)
- Revenue/KPI Dashboard
- A/R Metrics, Days in A/R
- Collection Rate, Clean Claim Rate
- Denial Rate, Net Collection Rate
- Revenue Trends
- Payer/Provider/Facility Performance
- Export Analytics

### Reporting (11 operations)
- Generate/Get/List Reports
- Schedule Report
- A/R/Production/Denial/Payment Report
- Executive Summary
- Custom Report, Export Report

### Epic Integration (8 operations)
- Get Epic Patient/Encounter/Charges
- Sync Patient Data (bidirectional)
- Send to Epic (FHIR)
- Get Epic Status
- Reconcile Data, Epic Queue

### Contract (8 operations)
- Get Contract/Contracts
- Fee Schedule, Expected Payment
- Compare to Contract
- Contract Variance, Underpayment Analysis
- Contract Terms

### Provider (7 operations)
- Get/Search Providers
- Provider Credentials, Performance, Productivity
- Validate NPI, Enrolled Providers

### Facility (5 operations)
- Get Facility/Facilities
- Facility Performance, Metrics, A/R

### Payer (7 operations)
- Get Payer/Payers
- Payer Rules, Performance, Trends
- Payer Contacts, Check Status

### Automation (7 operations)
- Get/Create/Update Automation Rules
- Automation Status, Bot Performance
- Automation Queue, Intelligent Automation

### SFTP (5 operations)
- Upload/Download File
- List Files, Get Status, Delete File

### Webhook (7 operations)
- Create/Get/Update/Delete Webhook
- List Webhooks, Test Webhook
- Get Webhook Events

### Utility (7 operations)
- Validate NPI, Validate Tax ID
- Code Lookup, CARC/RARC Codes
- Place of Service Codes
- Test Connection, API Status

## Trigger Node

The R1 RCM Trigger node enables real-time event-driven workflows:

### Event Categories

- **Patient Events** - Registered, Updated, Merged, Coverage Verified, Financial Clearance
- **Registration Events** - Created, Completed, Pre-Registration Done
- **Eligibility Events** - Verified, Failed, Benefits Updated
- **Authorization Events** - Submitted, Approved, Denied, Pending, Expiring, Expired
- **Charge Events** - Created, Updated, Review Required, Lag Alert
- **Coding Events** - Complete, Review Required, Validation Error, DRG Assigned
- **Claim Events** - Created, Submitted, Accepted, Rejected, Paid, Denied, Status Changed
- **Denial Events** - Received, Appeal Due, Appeal Submitted, Appeal Decision, Overturned
- **Payment Events** - Received, Posted, Underpayment, Variance, ERA Received
- **Work Queue Events** - Assigned, Due, SLA Warning, SLA Breach, Threshold
- **Analytics Events** - KPI Alert, Threshold Exceeded, Trend Alert, Report Ready
- **Epic Events** - Sync Complete, Sync Error, Message Received

## Usage Examples

### Patient Registration Workflow

```json
{
  "nodes": [
    {
      "name": "Create Patient",
      "type": "n8n-nodes-r1rcm.r1Rcm",
      "parameters": {
        "resource": "patientAccess",
        "operation": "createPatient",
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "1980-01-15",
        "gender": "male",
        "ssn": "123-45-6789"
      }
    }
  ]
}
```

### Eligibility Verification

```json
{
  "nodes": [
    {
      "name": "Check Eligibility",
      "type": "n8n-nodes-r1rcm.r1Rcm",
      "parameters": {
        "resource": "eligibility",
        "operation": "checkEligibility",
        "patientId": "{{ $json.patientId }}",
        "payerId": "BCBS",
        "serviceType": "professional",
        "dateOfService": "2024-01-15"
      }
    }
  ]
}
```

### Prior Authorization Submission

```json
{
  "nodes": [
    {
      "name": "Submit Prior Auth",
      "type": "n8n-nodes-r1rcm.r1Rcm",
      "parameters": {
        "resource": "priorAuth",
        "operation": "submitPriorAuth",
        "patientId": "{{ $json.patientId }}",
        "payerId": "AETNA",
        "serviceType": "MRI",
        "diagnosisCodes": "M54.5",
        "procedureCodes": "72148",
        "requestedUnits": 1,
        "urgency": "routine"
      }
    }
  ]
}
```

### Claim Submission (837P)

```json
{
  "nodes": [
    {
      "name": "Submit Claim",
      "type": "n8n-nodes-r1rcm.r1Rcm",
      "parameters": {
        "resource": "claim",
        "operation": "submitClaim",
        "claimType": "837P",
        "patientId": "{{ $json.patientId }}",
        "encounterId": "{{ $json.encounterId }}",
        "diagnosisCodes": "J06.9",
        "procedureCodes": "99213",
        "chargeAmount": 150.00
      }
    }
  ]
}
```

### Denial Management

```json
{
  "nodes": [
    {
      "name": "Analyze Denial",
      "type": "n8n-nodes-r1rcm.r1Rcm",
      "parameters": {
        "resource": "denial",
        "operation": "analyzeDenial",
        "denialId": "{{ $json.denialId }}",
        "includeRootCause": true,
        "includeAppealRecommendation": true
      }
    }
  ]
}
```

### Payment Posting (835)

```json
{
  "nodes": [
    {
      "name": "Process ERA",
      "type": "n8n-nodes-r1rcm.r1Rcm",
      "parameters": {
        "resource": "payment",
        "operation": "getEra",
        "eraId": "{{ $json.eraId }}",
        "autoReconcile": true,
        "flagVariances": true
      }
    }
  ]
}
```

### Epic Integration

```json
{
  "nodes": [
    {
      "name": "Sync Patient from Epic",
      "type": "n8n-nodes-r1rcm.r1Rcm",
      "parameters": {
        "resource": "epicIntegration",
        "operation": "syncPatientData",
        "epicPatientId": "E12345",
        "syncDirection": "epic_to_r1rcm",
        "dataTypes": ["demographics", "insurance", "encounters"]
      }
    }
  ]
}
```

## Healthcare RCM Concepts

### EDI Transaction Types

| Transaction | Purpose |
|-------------|---------|
| 270 | Eligibility Inquiry |
| 271 | Eligibility Response |
| 276 | Claim Status Inquiry |
| 277 | Claim Status Response |
| 278 | Prior Authorization |
| 835 | Electronic Remittance Advice (ERA) |
| 837P | Professional Claims |
| 837I | Institutional Claims |
| 837D | Dental Claims |

### CARC/RARC Codes

- **CARC** - Claim Adjustment Reason Codes explain why a payment differs from the billed amount
- **RARC** - Remittance Advice Remark Codes provide additional explanation

### Key Metrics

| Metric | Description | Benchmark |
|--------|-------------|-----------|
| Days in A/R | Average days to collect | < 40 days |
| Clean Claim Rate | First-pass acceptance rate | > 95% |
| Denial Rate | Percentage of claims denied | < 5% |
| Net Collection Rate | Collected vs. allowed | > 95% |

### Work Queue Types

- Eligibility Verification
- Prior Authorization
- Charge Review
- Coding Review
- Claim Edits
- Denial Follow-up
- Payment Posting
- A/R Follow-up
- Patient Collections
- Bad Debt

## Error Handling

The node provides comprehensive error handling with healthcare-specific context:

```javascript
try {
  // Operation execution
} catch (error) {
  // Error includes:
  // - errorCode: Healthcare-specific code
  // - errorMessage: Human-readable description
  // - resource: Resource being accessed
  // - operation: Operation attempted
  // - suggestions: Recommended resolution steps
}
```

## Security Best Practices

1. **HIPAA Compliance** - All PHI is handled securely; sensitive data is not logged
2. **Credential Security** - Use n8n's credential management; never hardcode secrets
3. **TLS/mTLS** - All API communications use TLS; Epic integration supports mTLS
4. **Audit Trail** - All operations include request IDs for traceability
5. **Data Minimization** - Request only necessary data fields
6. **Access Control** - Use least-privilege API credentials

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Fix linting issues
npm run lint:fix

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-operation`)
3. Commit your changes (`git commit -am 'Add new operation'`)
4. Push to the branch (`git push origin feature/new-operation`)
5. Create a Pull Request

All contributions must comply with BSL 1.1 licensing.

## Support

- **Documentation**: [velobpa.com/docs/n8n-nodes-r1rcm](https://velobpa.com/docs/n8n-nodes-r1rcm)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-r1rcm/issues)
- **Email**: support@velobpa.com

## Acknowledgments

- [n8n](https://n8n.io) - Workflow automation platform
- [R1 RCM](https://r1rcm.com) - Revenue cycle management platform
- Healthcare industry standards: HL7, FHIR, X12 EDI
