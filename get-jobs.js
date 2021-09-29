module.exports = async ({ github, context }) => {
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
