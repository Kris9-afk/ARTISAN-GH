---
name: admin-console-compromise
description: "Use when an admin console, dashboard, or privileged web application may be compromised and code or configuration changes are needed for authorized containment, remediation, and recovery. Covers evidence preservation, credential containment, safe code changes, testing, deployment, and post-incident verification."
argument-hint: "Describe the suspected compromise, affected admin-console area, and available evidence."
user-invocable: true
---

# Admin Console Compromise Response

## Purpose

Guide an authorized engineer through a controlled response when an admin console or its supporting code may be compromised. Keep the system defensible and auditable. Do not hide activity, destroy evidence, bypass access controls, or make unreviewed production edits.

## Use When

- An admin console shows unauthorized changes, users, sessions, or actions.
- Privileged credentials, tokens, dependencies, build artifacts, or deployment systems may be exposed.
- The console needs an emergency code or configuration change after compromise.
- A security responder needs a documented remediation and recovery sequence.

## Stop Conditions

Pause code changes and escalate to the incident lead, security team, or service owner when:

- Authorization to inspect or modify the system is unclear.
- Evidence may be overwritten by restarting, redeploying, or rotating logs.
- The attacker may still have access to source control, CI/CD, cloud accounts, identity providers, or secrets.
- The proposed change could destroy forensic evidence or affect unrelated production systems.

## Procedure

### 1. Declare and scope the incident

1. Record the incident ID, time zone, responders, affected environments, and current symptoms.
2. Identify the admin-console URL, repository, deployment pipeline, service accounts, identity provider, and data stores involved.
3. Establish an incident channel and an approval owner for emergency changes.
4. Capture the current version, deployment identifier, relevant commit hashes, and recent configuration changes.

### 2. Contain access without destroying evidence

1. Restrict the console to a trusted administrative path, maintenance mode, or a temporary allowlist approved by the incident lead.
2. Revoke active sessions, refresh tokens, API keys, and privileged credentials suspected of exposure. Record the time and scope of each revocation.
3. Rotate secrets from a clean administrative workstation or trusted secret-management workflow; do not paste secrets into source files or chat.
4. Preserve audit logs, access logs, deployment logs, database records, and suspicious files before cleanup or redeployment.
5. Do not delete attacker-created accounts or files until the security team has collected the evidence they need.

### 3. Determine the code-change boundary

1. Compare the deployed artifact with the last known-good commit or artifact digest.
2. Review recent commits, pull requests, CI jobs, dependency updates, environment changes, and administrator actions.
3. Trace the smallest code path that controls the suspected behavior: authentication, authorization, session handling, input validation, privileged action, or audit logging.
4. Treat the source repository, build runner, package registry, and deployment credentials as potentially compromised until verified.
5. If source integrity is uncertain, create a clean recovery branch from a verified last-known-good source rather than editing the possibly compromised working tree.

### 4. Make the minimum defensive change

Use a reviewed emergency change that addresses the confirmed control failure. Typical changes include:

- Enforce server-side authorization for every privileged action; never rely on hidden UI controls.
- Require phishing-resistant MFA or step-up authentication for sensitive operations where supported.
- Invalidate sessions after password, role, MFA, or credential changes.
- Add allowlists and strict validation for administrative inputs.
- Remove exposed debug routes, development credentials, unsafe defaults, and untrusted script loading.
- Pin or replace compromised dependencies and regenerate lockfiles from a trusted environment.
- Ensure security-relevant actions emit tamper-resistant audit events with actor, target, result, request ID, and timestamp.
- Fail closed when authorization, tenant, or policy data cannot be loaded.

Keep the change narrow, reviewable, and reversible. Do not add hidden backdoors, bypasses, undocumented administrator accounts, or code intended to conceal the incident.

### 5. Validate before deployment

1. Add or update focused tests for the compromised behavior, including unauthorized, expired-session, cross-tenant, replay, and failure cases where relevant.
2. Run type checks, linting, unit tests, integration tests, and security checks for the affected slice.
3. Build from the clean recovery branch in a trusted CI environment and record the artifact digest.
4. Have a second authorized reviewer inspect the diff, dependency changes, secret handling, and rollback plan.
5. Test the artifact in an isolated environment using sanitized data and non-production credentials.

### 6. Deploy and verify recovery

1. Approve the deployment through the incident change process and preserve the approval record.
2. Deploy the verified artifact using newly rotated credentials.
3. Confirm authentication, authorization, session invalidation, audit events, health checks, and key administrative workflows.
4. Monitor privileged actions, failed logins, new accounts, token use, unexpected outbound requests, and deployment activity.
5. Keep the rollback target available, but do not roll back to an artifact or secret set that may be compromised.
6. Document what changed, why it changed, who approved it, the artifact digest, and the exact verification results.

### 7. Close out and harden

1. Complete a timeline from the first suspicious event through containment and recovery.
2. Rotate any remaining credentials that could have been reachable from the compromised system.
3. Review repository and CI/CD permissions, branch protection, required reviews, runner isolation, dependency provenance, and production access.
4. Add detections and alerts for the observed attack path and test them.
5. Record residual risk, follow-up owners, deadlines, and lessons learned.

## Completion Checklist

- [ ] Incident ownership, authorization, and change approval are documented.
- [ ] Relevant evidence is preserved before destructive cleanup.
- [ ] Active access and exposed credentials are contained and rotated.
- [ ] The deployed artifact was compared with a verified source or digest.
- [ ] The remediation is minimal, reviewed, tested, and built in a trusted environment.
- [ ] Production verification covers authorization, sessions, audit logging, and monitoring.
- [ ] Rollback and residual-risk decisions are documented.

## Expected Output

When applying this skill, produce:

1. A short incident scope and confidence statement.
2. A containment and evidence-preservation checklist.
3. The smallest proposed code/configuration change, with affected files and security rationale.
4. Tests and validation commands appropriate to the repository.
5. A deployment, monitoring, rollback, and follow-up plan.

Never include real secrets, tokens, private customer data, or instructions for evading detection.
