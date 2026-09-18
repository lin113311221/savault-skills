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
