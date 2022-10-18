import {Talk} from './talk-type';

const talks: Talk[] = [
  {
    conference: 'NodeConf EU',
    name: 'Full-stack JS today: Fastify, GraphQL and React',
    date: '2022-10-03T12:00Z',
    location: 'Kilkenny, Ireland',
    video: 'https://youtu.be/guAMBFqKSF4',
    slides:
      'https://docs.google.com/presentation/d/1vHYSlgV8pSI3kobGQlYxfssvaeZrGA4BqDn0qLGDmYg/edit?usp=sharing',
    repo: 'https://github.com/codyzu/mfs-js',
  },
  {
    conference: 'NodeConf EU',
    name: 'Fireside chat with James Snell',
    date: '2022-10-04T12:00Z',
    location: 'Kilkenny, Ireland',
    video: 'https://youtu.be/XktEZKOIaXY',
  },
  {
    conference: 'NodeConf EU',
    name: 'From zero to GraphQL Workshop',
    date: '2022-10-03T15:00Z',
    location: 'Kilkenny, Ireland',
    video: 'none',
    slides: 'https://nearform.github.io/the-graphql-workshop',
    repo: 'https://github.com/nearform/the-graphql-workshop',
  },
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
];

export default talks;
