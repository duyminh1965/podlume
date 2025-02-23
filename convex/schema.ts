import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    podlume: defineTable({        
        user: v.id('users'),
        podlumeTitle: v.string(),
        podlumeDescription: v.string(),
        audioUrl: v.optional(v.string()),
        audioStorageId: v.optional(v.id('_storage')),
        imageUrl: v.optional(v.string()),
        imageStorageId: v.optional(v.id('_storage')),
        author: v.string(),
        authorId: v.string(),
        authorImageUrl: v.string(),
        voicePrompt: v.string(),
        imagePrompt: v.string(),
        voiceType: v.string(),
        audioDuration: v.number(),
        views: v.number(),
    })
    .searchIndex('search_author', { searchField: 'author'})
    .searchIndex('search_title', { searchField: 'podlumeTitle'})
    .searchIndex('search_body', { searchField: 'podlumeDescription'}),    
    users: defineTable({
        email: v.string(),
        imageUrl: v.string(),
        clerkId: v.string(),
        name: v.string(),
    }),
    
})