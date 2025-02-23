import { TableNames } from "./_generated/dataModel";
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {      
      const tasks = await ctx.db.query("tasks" as TableNames).collect();
    return tasks;
  },
});

