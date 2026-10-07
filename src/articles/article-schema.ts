import {z} from 'astro/zod';

export const articleSchema = z
  .object({
    title: z.string().trim().min(1),
    url: z.url({protocol: /^https?$/v}),
    date: z.union([
      z.iso.datetime({offset: true, precision: -1}),
      z.iso.datetime({offset: true}),
    ]),
    order: z.number().int().positive(),
  })
  .strict();
