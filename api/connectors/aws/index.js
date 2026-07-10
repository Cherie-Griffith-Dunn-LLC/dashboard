'use strict';

const { BaseConnector } = require('../../shared/framework/baseConnector');
const { intBetween } = require('../../shared/framework/sim');

/**
 * AWS connector.
 *
 * Feeds cloud posture from AWS (Security Hub / GuardDuty findings) and reflects
 * the Amazon Connect footprint into the executive view. Live mode uses AWS
 * credentials (AWS_REGION + role/keys) and the optional AWS SDK.
 */
class AwsConnector extends BaseConnector {
  constructor(env = process.env) {
    super({ name: 'aws', category: 'cloud', domains: ['vulnerabilities', 'executive'] }, env);
  }

  isConfigured() {
    return Boolean(this.env.AWS_REGION && (this.env.AWS_ACCESS_KEY_ID || this.env.AWS_ROLE_ARN));
  }

  simulateFetch(ctx) {
    const rng = this.rng(ctx.tenantId);
    return {
      accounts: intBetween(rng, 1, 6),
      securityHubFindings: {
        critical: intBetween(rng, 0, 6),
        high: intBetween(rng, 0, 25),
        medium: intBetween(rng, 2, 60),
      },
      guardDutyFindings: intBetween(rng, 0, 15),
      publicS3Buckets: intBetween(rng, 0, 4),
      iamKeysOver90d: intBetween(rng, 0, 10),
      connectInstances: intBetween(rng, 0, 2),
    };
  }

  transformData(raw) {
    const f = raw.securityHubFindings;
    const issues = [];
    if (f.critical > 0) issues.push({ severity: 'critical', title: `${f.critical} critical AWS Security Hub findings` });
    if (raw.publicS3Buckets > 0) issues.push({ severity: 'high', title: `${raw.publicS3Buckets} public S3 buckets` });
    if (raw.iamKeysOver90d > 0) issues.push({ severity: 'medium', title: `${raw.iamKeysOver90d} IAM access keys older than 90 days` });
    if (raw.guardDutyFindings > 5) issues.push({ severity: 'medium', title: `${raw.guardDutyFindings} active GuardDuty findings` });
    return {
      accounts: raw.accounts,
      securityHub: Object.assign({ total: f.critical + f.high + f.medium }, f),
      guardDutyFindings: raw.guardDutyFindings,
      posture: { publicS3Buckets: raw.publicS3Buckets, iamKeysOver90d: raw.iamKeysOver90d },
      amazonConnect: { instances: raw.connectInstances },
      issues,
    };
  }
}

module.exports = { AwsConnector };
