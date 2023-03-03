import {create, insertBatch, search, type RetrievedDoc} from '@lyrasearch/lyra';
import {type Talk} from './talk-type';

export function createTalkSearch(talks: Talk[]) {
  const db = create({
    schema: {
      conference: 'string',
      name: 'string',
      location: 'string',
    },
    components: {
      tokenizer: {
        enableStemming: false,
      },
    },
  });

  // Flag to indicate if the index has been lazy loaded
  let indexReady = false;

  async function searchTalks(
    value: string,
  ): Promise<
    Array<
      RetrievedDoc<{conference: 'string'; name: 'string'; location: 'string'}>
    >
  > {
    // Lazy load the index on the first search
    if (!indexReady) {
      await insertBatch(await db, talks);
      indexReady = true;
    }

    const result = await search(await db, {
      term: value,
      properties: '*',
      // Tolerance does not seem compatible when deactivating the stemmer see: https://github.com/LyraSearch/lyra/issues/248
      // Tolerance: 1,
    });

    return result.hits;
  }

  return searchTalks;
}
