const yaml = require('js-yaml');
const fs = require('fs');

module.exports = async ({ github, context }) => {
  const doc = yaml.load(fs.readFileSync(context.payload.workflow.path, 'utf8'));
  const numSelfHosted = Object.values(doc.jobs).reduce(
    (s, c) => s + (c['runs-on'] === 'self-hosted' ? 1 : 0),
  );
  return numSelfHosted;

  const run_id = context.payload.workflow_run.id;
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const r = await github.rest.actions.listJobsForWorkflowRun({
    owner,
    repo,
    run_id,
  });

  return r.data.jobs;
};
