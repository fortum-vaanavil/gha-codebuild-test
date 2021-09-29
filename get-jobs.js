const yaml = require('js-yaml');
const fs = require('fs');

module.exports = async ({ github, context }) => {
  const doc = yaml.load(fs.readFileSync(context.payload.workflow.path, 'utf8'));
  const selfHosted = new Set(
    Object.entries(doc.jobs).reduce(
      (names, [k, v]) => [
        ...names,
        ...(v['runs-on'] === 'self-hosted' ? [k] : []),
      ],
      [],
    ),
  );

  const run_id = context.payload.workflow_run.id;
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const r = await github.rest.actions.listJobsForWorkflowRun({
    owner,
    repo,
    run_id,
  });
  const selfHostedJobs = r.data.jobs
    .filter((j) => j.status === 'queued' && selfHosted.has(j.name))
    .map(({ id, name }) => ({ id, name }));

  return selfHostedJobs;
};
