import {Talk} from './talk';

const talks: Talk[] = [
  {
    conference: 'ReactSummit',
    name: 'Full-stack JS today: Fastify, GraphQL and React',
    date: '2022-06-17T12:00Z',
    location: 'Amsterdam, Netherlands',
    video:
      'https://portal.gitnation.org/contents/full-stack-js-today-fastify-graphql-and-react',
    slides:
      'https://docs.google.com/presentation/d/16OHcPhk1GKjprCFymcK_PAiPbvM7tGG0mCudFzVvHaU/edit?usp=sharing',
    repo: 'https://github.com/codyzu/mfs-js',
  },
  {
    conference: 'Caribbean Developers Conference',
    name: 'Design Tokens',
    date: '2022-11-03T12:00Z',
    location: 'Dominican Republic',
  },
];

export default talks;
