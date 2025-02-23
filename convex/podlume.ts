import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUrl = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId)
    }
})

export const createPodlume = mutation({
    args: {
        podlumeTitle: v.string(),
        podlumeDescription: v.string(),
        audioUrl: v.string(),
        imageUrl: v.string(),
        voiceType: v.string(),
        imagePrompt: v.string(),
        voicePrompt: v.string(),
        views: v.number(),
        audioDuration: v.number(),
        audioStorageId: v.id('_storage'),
        imageStorageId: v.id('_storage'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity){
            throw new ConvexError('Not authenticated')
        }

        const user = await ctx.db
            .query('users')
            .filter((q) => q.eq(q.field('email'), identity.email))
            .collect();

        if(user.length === 0) {
            throw new ConvexError('User not found')
        }

        const podlumes = await ctx.db.insert('podlume', {
            ...args,
            user: user[0]._id,
            author: user[0].name,
            authorId: user[0].clerkId,
            authorImageUrl: user[0].imageUrl,
        })

        return podlumes;
    }
})

export const getTrendingPodlume = query({
    handler: async (ctx) => {
        const podlumes = await ctx.db.query('podlume').collect();

        return podlumes;
    }
})

export const getPodlumeById = query({
    args: { podlumeId: v.id('podlume') },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.podlumeId);
        
    }
})

// this query will get all the podcasts based on the voiceType of the podcast , which we are showing in the Similar Podcasts section.
  export const getPodlumeByVoiceType = query({
    args: {
      podlumeId: v.id("podlume"),
    },
    handler: async (ctx, args) => {
      const podlume0 = await ctx.db.get(args.podlumeId);
  
      return await ctx.db
        .query("podlume")
        .filter((q) =>
          q.and(
            q.eq(q.field("voiceType"), podlume0?.voiceType),
            q.neq(q.field("_id"), args.podlumeId)
          )
        )
        .collect();
    },
  });
  
  // this query will get all the podcasts.
  export const getAllPodlume = query({
    handler: async (ctx) => {
      return await ctx.db.query("podlume").order("desc").collect();
    },
  });
  
  // this query will get the podcast by the authorId.
  export const getPodlumeByAuthorId = query({
    args: {
      authorId: v.string(),
    },
    handler: async (ctx, args) => {
      const podlume = await ctx.db
        .query("podlume")
        .filter((q) => q.eq(q.field("authorId"), args.authorId))
        .collect();
  
      const totalListeners = podlume.reduce(
        (sum, podlume) => sum + podlume.views,
        0
      );
  
      return { podlume, listeners: totalListeners };
    },
  });
  
  // this query will get the podcast by the search query.
  export const getPodlumeBySearch = query({
    args: {
      search: v.string(),
    },
    handler: async (ctx, args) => {
      if (args.search === "") {
        return await ctx.db.query("podlume").order("desc").collect();
      }
  
      const authorSearch = await ctx.db
        .query("podlume")
        .withSearchIndex("search_author", (q) => q.search("author", args.search))
        .take(10);
  
      if (authorSearch.length > 0) {
        return authorSearch;
      }
  
      const titleSearch = await ctx.db
        .query("podlume")
        .withSearchIndex("search_title", (q) =>
          q.search("podlumeTitle", args.search)
        )
        .take(10);
  
      if (titleSearch.length > 0) {
        return titleSearch;
      }
  
      return await ctx.db
        .query("podlume")
        .withSearchIndex("search_body", (q) =>
          q.search('podlumeDescription' || "podlumeTitle", args.search)
        )
        .take(10);
    },
  });
  
  // this mutation will update the views of the podcast.
  export const updatePodlumeViews = mutation({
    args: {
      podlumeId: v.id("podlume"),
    },
    handler: async (ctx, args) => {
      const podlume = await ctx.db.get(args.podlumeId);
  
      if (!podlume) {
        throw new ConvexError("Podlume not found");
      }
  
      return await ctx.db.patch(args.podlumeId, {
        views: podlume.views + 1,
      });
    },
  });
  
  // this mutation will delete the podcast.
  export const deletePodlume = mutation({
    args: {
      podlumeId: v.id("podlume"),
      imageStorageId: v.id("_storage"),
      audioStorageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
      const podlume = await ctx.db.get(args.podlumeId);
  
      if (!podlume) {
        throw new ConvexError("Podcast not found");
      }
  
      await ctx.storage.delete(args.imageStorageId);
      await ctx.storage.delete(args.audioStorageId);
      return await ctx.db.delete(args.podlumeId);
    },
  });
  