import * as core from '@actions/core';
import * as github from '@actions/github';
import Cloudflare from 'cloudflare';

async function run(): Promise<void> {
  try {
    const cloudflareToken = core.getInput('cloudflare-token', { required: true });
    const zoneId = core.getInput('zone-id', { required: true });
    const baseDomain = core.getInput('base-domain', { required: true });
    const dnsContent = core.getInput('dns-content', { required: true });
    
   const cf = new Cloudflare({
      apiToken: cloudflareToken, 
   }); 

    const { payload } = github.context;
    const prNumber = payload.pull_request?.number;
    const action = payload.action;
    const branchName = payload.pull_request?.head.ref || '';
    
    if (!prNumber) {
      throw new Error('No PR number found in context');
    }

    const sanitizedBranch = branchName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-');

    const subdomain = `pr-${prNumber}-${sanitizedBranch}`;
    const fullDomain = `${subdomain}.${baseDomain}`;

    if (action === 'opened' || action === 'reopened' || action === 'ready_for_review' || action === 'converted_to_draft') {
      await cf.dns.records.create( {
        zone_id: zoneId,
        type: 'CNAME',
        name: subdomain,
        content: dnsContent,
        proxied: true
      });

      core.info(`Created DNS record for ${fullDomain}`);
      core.setOutput('domain', fullDomain);

    } else if (action === 'closed') {
      const records = await cf.dns.records.list({ zone_id: zoneId });
      const record = records.result.find(r => r.name === fullDomain);
      
      if (record && record.id) {
        await cf.dns.records.delete(record.id, { zone_id: zoneId });
        core.info(`Deleted DNS record for ${fullDomain}`);
      } else {
        core.warning(`No DNS record found for ${fullDomain}`);
      }
    }

  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

run();
