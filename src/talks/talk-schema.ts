import {z} from 'astro/zod';

export function createTalkSchema<T extends z.ZodType>(thumbnailSchema: T) {
  return z
    .object({
      conference: z.string().min(1),
      name: z.string().min(1),
      date: z.union([
        z.iso.datetime({offset: true, precision: -1}),
        z.iso.datetime({offset: true}),
      ]),
      location: z.string().min(1),
      region: z.enum(['USA', 'Europe', 'Asia', 'Virtual']),
      recordingStatus: z.enum([
        'available',
        'unpublished',
        'unavailable',
        'not-recorded',
      ]),
      video: z.url().optional(),
      slides: z.url().optional(),
      repo: z.url().optional(),
      highlightOrder: z.number().int().positive().optional(),
      description: z.string().trim().min(1).optional(),
      thumbnail: thumbnailSchema.optional(),
      thumbnailAlt: z.string().trim().min(1).optional(),
      flag: z
        .string()
        .regex(/^i-circle-flags-[a-z]{2}$/v)
        .optional(),
    })
    .strict()
    .refine(
      (talk) =>
        (talk.recordingStatus === 'available') === (talk.video !== undefined),
      {
        message: 'Only available recordings require and accept a video URL',
        path: ['video'],
      },
    )
    .refine(
      (talk) =>
        talk.highlightOrder === undefined || talk.description !== undefined,
      {
        message: 'Highlighted talks require a description',
        path: ['description'],
      },
    )
    .refine(
      (talk) => talk.thumbnail === undefined || talk.thumbnailAlt !== undefined,
      {
        message: 'Talk thumbnails require alternative text',
        path: ['thumbnailAlt'],
      },
    );
}

export const talkSchema = createTalkSchema(z.string().trim().min(1));
