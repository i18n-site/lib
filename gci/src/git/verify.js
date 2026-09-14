export default async (git, commit_hash) => {
  const log = await git.log({ maxCount: 1 }).catch(() => null),
    latest_hash = log?.latest?.hash,
    status = await git.status().catch(() => null),
    hash_matched =
      latest_hash &&
      commit_hash &&
      (latest_hash.startsWith(commit_hash) ||
        commit_hash.startsWith(latest_hash)),
    staged_clean = status?.staged?.length === 0;

  return Boolean(hash_matched && staged_clean);
};
