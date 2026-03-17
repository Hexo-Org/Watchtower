# Watchtower

**Production monitoring dashboard for deployed Soroban smart contracts.**

Watchtower gives you operational visibility into your contracts after deployment — real-time invocation tracking, decoded error monitoring, resource consumption trends, storage TTL health, cost attribution, and multi-channel alerting. It turns raw chain data into the kind of operational intelligence you'd expect from Datadog or Grafana, purpose-built for Soroban.

If you deploy contracts to Stellar, Watchtower is how you know they're healthy.

---

## Why Watchtower Exists

After you deploy a Soroban contract, you're flying blind. StellarExpert shows individual transactions. Mercury indexes events. But neither provides operational monitoring — error rate trends over time, storage entries silently approaching expiration, cost burn rates, or a Slack alert at 3 AM when your contract starts failing.

Every Soroban team today deploys and hopes for the best. When something breaks, they find out from users — hours or days later. Critical storage entries expire with no warning. A function starts consuming 90% of the CPU budget and nobody notices until transactions start failing. Weekly costs double and nobody knows why until someone manually queries the ledger.

Watchtower closes that gap. Paste a contract ID, and within 60 seconds you have a full operational dashboard — live invocations, decoded errors, resource metrics, TTL countdowns, cost tracking, and alerts routed to wherever your team already works.

---

## Features

- **Real-time invocation tracking** — live feed of every function call with caller, status, and resource footprint; time-series charts of invocation volume by function with day-over-day and week-over-week comparisons
- **HostError decoding** — translates cryptic Soroban error codes into human-readable causes and suggested remediations; supports custom contract error enums so your `Error(3)` shows as "InsufficientBalance" instead of a number
- **Resource consumption analytics** — CPU instructions, memory bytes, ledger reads/writes, and transaction size tracked per function with p50/p95/p99 percentiles; budget utilization gauges warn you when functions approach network limits
- **Storage TTL health** — continuous monitoring of every instance, persistent, and temporary storage entry; color-coded TTL status from green (healthy) to red (expiring soon) to black (evicted); renewal cost estimates so you know what it will cost to keep things alive
- **Cost attribution** — invocation fees, storage rent, and TTL extension costs aggregated daily, weekly, and monthly; broken down by function, caller, and storage key; burn rate projections and budget alerts
- **Multi-channel alerting** — error rate spikes, TTL expiration warnings, resource limit approaches, invocation anomalies, cost budget breaches, and contract upgrades routed to Slack, PagerDuty, Discord, email, Telegram, or any webhook endpoint
- **Prometheus export** — all metrics available at a `/metrics` endpoint in Prometheus exposition format for teams with existing Grafana stacks

---

## How It Works

Watchtower continuously ingests data from the Stellar network through two complementary sources — Soroban RPC for real-time events and Mercury's indexing API for historical depth. Every invocation is enriched with full transaction metadata, decoded, aggregated into time-series metrics, and evaluated against your alert rules.

```
Stellar Network
       │
       ├──► Soroban RPC (getEvents, getTransaction, getLedgerEntries)
       │         │
       │         ▼
       │    ┌────────────────┐
       │    │   Ingestion    │ ◄──── Mercury API (backfill + enrichment)
       │    │   Pipeline     │
       │    └───────┬────────┘
       │            │
       │            ▼
       │    ┌────────────────┐
       │    │   Processing   │  Error Decoder → Cost Calculator → Aggregator
       │    └───────┬────────┘
       │            │
       │            ├──► TimescaleDB (time-series metrics)
       │            ├──► PostgreSQL (metadata, config, accounts)
       │            └──► Redis (cache, WebSocket pub/sub)
       │                    │
       │            ┌───────┴────────┐
       │            │                │
       │            ▼                ▼
       │    ┌─────────────┐   ┌────────────┐
       │    │   Alert     │   │  API +     │
       │    │   Engine    │   │  WebSocket │
       │    └──────┬──────┘   └─────┬──────┘
       │           │                │
       │           ▼                ▼
       │    Slack / PagerDuty    Dashboard
       │    Discord / Email      (you)
       │    Webhooks
```

### Ingestion Pipeline
Polls `getEvents` every five seconds per monitored contract, maintaining a ledger cursor for exactly-once processing. Each event triggers a `getTransaction` call to extract full resource metrics, fees, and error details. A separate TTL scanner queries `getLedgerEntries` every five minutes for all tracked storage keys. Mercury provides historical backfill on contract registration and serves as a resilience fallback if RPC is rate-limited.

### Error Decoder
Maps every `ScError` into its `(ScErrorType, ScErrorCode)` tuple and resolves it against a maintained decoding table derived from the Soroban SDK source. Covers all host error types — `WasmVm`, `Storage`, `Auth`, `Budget`, `Context`, `Object`, `Crypto`, `Events`, `Value` — with plain-English descriptions and remediation suggestions. For custom contract errors (`ScErrorType::Contract`), users can upload their error enum definitions to decode application-specific codes.

### Cost Calculator
Extracts the fee from every transaction envelope touching the monitored contract. Computes ongoing storage rent liability using current network rent rates, entry sizes, and remaining TTL. Captures TTL extension costs from `extendTTL` operations. Aggregates everything into daily rollups with function-level and storage-key-level attribution.

### Alert Engine
Continuously evaluates alert rules against the latest metrics using sliding time windows. Supports error rate thresholds, TTL expiration warnings, resource budget utilization, invocation volume anomalies (both spikes and drops), cost budget breaches, contract upgrade detection, and novel error type appearance. Routes notifications through configurable channels with deduplication, cooldown periods, severity levels, and escalation policies.

---

## Dashboard Views

### Overview
Contract health cards at a glance — one per monitored contract showing status (healthy / warning / critical), invocations in the last 24 hours, current error rate, nearest TTL expiry, and today's cost. A global alert feed shows recent notifications across all contracts.

### Invocations
Live invocation feed streaming via WebSocket alongside time-series charts of call volume by function. Filterable by function name, caller address, success/failure, and time range. Top functions ranked by volume with heatmap visualization.

### Errors
Error rate as a percentage of total invocations over configurable windows (1h, 6h, 24h, 7d, 30d). Breakdown by function and by error type. Each error entry shows the decoded HostError with its category, description, and suggested fix. Anomaly highlighting flags sudden rate changes.

### Resources
Per-function resource consumption with percentile bands (p50, p95, p99). CPU instructions, memory bytes, ledger reads, ledger writes, and transaction size tracked over time. Budget utilization gauges show how close each function runs to network limits. Version comparison view for tracking efficiency across contract upgrades.

### Storage
Every storage entry listed with its type (instance / persistent / temporary), decoded key, current TTL in ledgers and estimated calendar time, data size, and last renewal timestamp. Color-coded health status. Timeline view showing projected expiration dates. Critical entry marking for elevated monitoring. Renewal cost estimator.

### Costs
Daily, weekly, and monthly cost charts broken down by category (invocation fees, storage rent, TTL extensions). Function-level and storage-key-level attribution. Burn rate trend line with future projection. Budget utilization gauge. Week-over-week and month-over-month comparisons. CSV export for accounting.

### Alerts
Per-contract alert rule configuration with customizable thresholds, severity levels, channel routing, and cooldown settings. Alert history with full context (what triggered, current value vs. threshold, resolution status). Maintenance window scheduling.

---



## Supported Alert Channels

| Channel | Integration |
|---------|-------------|
| **Slack** | Incoming webhook with rich message formatting |
| **PagerDuty** | Events API v2 for on-call escalation |
| **Discord** | Webhook integration |
| **Email** | Digest and critical alert delivery |
| **Telegram** | Bot API integration |
| **Webhook** | Generic HTTP POST with HMAC-signed JSON payload |



## Onboarding

Adding a contract takes under 60 seconds:

1. Sign in to Watchtower
2. Paste your contract ID (the `C...` address)
3. Select the network (mainnet or testnet)
4. Optionally label the contract and assign it to a group
5. Watchtower validates the contract, discovers all storage keys, begins historical backfill, and starts live monitoring

No SDK installation. No contract modifications. No ABI upload required (though uploading your custom error enum definitions is recommended for richer error decoding).

---

## Security

- **HTTPS everywhere** — all dashboard, API, and webhook communication is encrypted in transit
- **Authentication** — email/password or GitHub OAuth with session management
- **RBAC** — role-based access control for team accounts (admin, editor, viewer)
- **Webhook signing** — outgoing webhook payloads include HMAC-SHA256 signatures for verification
- **API keys** — scoped API keys for programmatic access to the REST API and Prometheus endpoint
- **No private keys** — Watchtower is read-only; it never requires or stores any Stellar secret keys

---

## Limitations & Honest Caveats

- **Cost figures are estimates.** Storage rent calculations use current network parameters and entry sizes. Actual ledger charges may differ slightly. All cost data is labeled as estimated until we can validate against ground truth.
- **Storage key discovery is best-effort.** Watchtower discovers keys from historical events and ongoing invocations. A storage key that was written once, long ago, with no subsequent events may not be automatically discovered. Users can manually add keys to the watch list.
- **RPC rate limits apply.** Monitoring many contracts with many storage keys increases RPC call volume. Watchtower implements request budgeting and exponential backoff, but extremely high-volume setups may need a dedicated RPC endpoint.
- **Alert latency is not sub-second.** Alerts are evaluated on a continuous loop with a target delivery time of under two minutes from threshold breach. This is operational monitoring, not a real-time trading signal.


## Contributing

Watchtower is open source. Contributions are welcome across the stack — ingestion pipeline improvements, new alert channel integrations, dashboard components, HostError decoding updates for new protocol versions, and documentation.

Please open an issue before starting work on a large feature to discuss the approach.

---

## License

MIT
