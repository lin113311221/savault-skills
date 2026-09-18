# Hosted-service diagnostics for maintainers

Read this reference only when a real CLI canary reaches Savault's hosted enhancement service and fails with a server-side error. Ordinary users should not need CloudBase or provider administration access.

## Keep the three limits separate

1. **Account entitlement** is created by an `SVC_` card and reported by `savault balance`. It limits one service account.
2. **Shared backend budget** is a server-owned spend cap across accounts. Issuing, re-entering, or enlarging a card does not raise it.
3. **Provider readiness** includes the upstream account balance and a reviewed price-validity window. A service account can have ample allowance while either backend layer rejects every paid request.

Use the actual error code to choose the layer:

- `PRICE_REVIEW_REQUIRED` means the deployed `SAVAULT_PRICES_VALID_UNTIL` is missing, invalid, or expired. Recheck current provider pricing before extending it; do not simply choose a distant date.
- `SERVICE_BUDGET_EXHAUSTED` means the shared ledger cannot reserve the request's estimated cost. Read the server budget, spent amount, frozen flag, and outstanding reservations before proposing a change.
- `QUOTA_EXHAUSTED` refers to the current service account, not the shared backend.
- `DEVICE_NOT_BOUND` is an entitlement/device-seat issue and should be fixed through normal redemption or device management, not database edits.

## Production boundary

The domestic hosted service currently uses the CloudBase environment and function recorded by the Savault project handoff. Verify that source before every operation; do not infer the target from the public website environment. A website deployment and the enhancement API may live in different CloudBase environments or regions.

Prefer read-only checks first. Raising the shared budget, changing the pricing window, rotating provider keys, settling reservations, or deploying a function are production mutations with possible financial impact. Require explicit authorization for the specific mutation, verify the upstream balance/current prices, apply the narrowest change, and read back the deployed state before running one paid canary.

## Secret-safe CloudBase inspection

Some CloudBase CLI function-detail commands return complete environment-variable values, including provider keys and admin tokens. Never stream their raw output into an agent response, evidence file, CI log, or issue. Capture the response locally, select only non-sensitive fields such as function name, status, region, modification time, and the specific non-secret price-validity timestamp, then discard the raw value.

If a raw function-detail response containing secrets is exposed to a chat or durable log, treat the affected credentials as disclosed. Stop further use of the output, do not quote it, and request authorization to rotate the exposed credentials.

## Acceptance after a repair

Run one `--limit 1 --update-existing` canary with the requested enhancements enabled. A passing acceptance requires all of the following:

- the job progress has no relevant enhancement failure;
- the expected account balance decreases consistently with the successful calls;
- the Notion page is read back and contains the expected transcript, image interpretation, or summary for that media type;
- only then may a user-authorized full-folder job start.

A completed base-note write with enhancement errors is a failed enhancement acceptance, even when `created` or `updated` is nonzero and `failed` is zero.

## Async ASR and concurrency traps

- A retry key derived only from a CDN media URL is not stable: Xiaohongshu can rotate the path or signed URL between fetches. Derive the same-day ASR idempotency key from the stable source item ID, then hash it before sending it to the service.
- MP4 container duration and provider-decoded audio duration can differ by a few seconds because of encoder padding. The reservation must include the same narrow tolerance accepted at settlement; accepting a larger settlement than the reservation merely moves the failure into ledger reconciliation.
- Provider-level success can still contain a failed subtask. When the subtask has no reported usage, settle it as a known no-charge failure so the reservation and concurrency slot are released; the client may then fall back to image interpretation.
- Ambiguous provider timeouts must keep their accounting reservation, but they must not occupy a concurrency slot forever. Count only recent active reservations for concurrency and retain older rows as audit/budget evidence.
- Read back both total retained-unknown reservations and recent active reservations. Do not erase payloads or force-settle ambiguous provider outcomes merely to make the counters look clean.

For multi-user operation, verify the database ledger limit, per-account limit, rate limit, CloudBase function status/timeout, and provider behavior separately. Raising concurrency is a production and cost change; use a bounded concurrent probe before claiming the new capacity.

## Notion readback pitfalls

If `ntn pages get` or `ntn datasources query` fails while trying to discover the latest Notion OpenAPI spec, retry with the currently supported explicit `--notion-version` instead of treating the page as empty. Reset per-page variables before every read so one failed response cannot inherit the previous page's title or flags.

The platform's displayed collection count can exceed the number returned by its live collection API (for example, a removed/private item). Report both numbers. Acceptance covers only the source IDs actually returned and written; do not invent or duplicate a sixteenth page to match a badge count.
