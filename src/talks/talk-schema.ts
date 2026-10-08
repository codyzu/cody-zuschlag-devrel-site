import {z} from 'astro/zod';

export const talkSchema = z
  .object({
    conference: z.string().min(1),
    name: z.string().min(1),
    date: z.union([
      z.iso.datetime({offset: true, precision: -1}),
      z.iso.datetime({offset: true}),
    ]),
    location: z.string().min(1),
    region: z.enum(['USA', 'Europe', 'Asia', 'Virtual']),
    video: z.union([z.url(), z.literal('none')]).optional(),
    slides: z.url().optional(),
    repo: z.url().optional(),
    highlightOrder: z.number().int().positive().optional(),
    description: z.string().trim().min(1).optional(),
    flag: z
      .string()
      .regex(/^i-circle-flags-[a-z]{2}$/v)
      .optional(),
  })
  .strict()
  .refine(
    (talk) =>
      talk.highlightOrder === undefined || talk.description !== undefined,
    {message: 'Highlighted talks require a description', path: ['description']},
  );
