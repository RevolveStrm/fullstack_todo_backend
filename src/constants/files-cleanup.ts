export const CLEANUP_CONDITIONS = {
  where: {
    OR: [
      {
        deletedAt: {
          not: null,
        },
      },
      {
        taskId: null,
      },
    ],
  },
};
