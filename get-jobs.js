module.exports = ({ github, context }) => {
  const run_id = context.payload.workflow_run.run_id;
  const owner = context.repo.owner;
  const repo = context.repo.repo;
  return github.rest.actions.listJobsForWorkflowRun({
    owner,
    repo,
    run_id,
  });
};
