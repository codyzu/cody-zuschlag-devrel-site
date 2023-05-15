// Ensure the flag icons are parsed by unocss
// @unocss-include
import {type Talk} from './talk-type';

const talks: Talk[] = [
  {
    conference: 'OpenJS Collaborators Summit',
    name: 'Zen and the Art of Open Source',
    date: '2023-05-09T12:00Z',
    location: 'Virtual',
    video: undefined,
    slides:
      'https://docs.google.com/presentation/d/11pf28uBhezrfs7uagDbInNZXDnem-2qJAUlR3GHIweM/edit?usp=sharing',
  },
  {
    conference: 'Devoxx France',
    name: 'IPFS - The Practical Bits',
    date: '2023-04-14T12:00Z',
    location: 'Paris, France',
    flag: 'i-circle-flags-fr',
    video: undefined,
    slides:
      'https://docs.google.com/presentation/d/181kDUwgV9nhtp0FbUYqlZ3xB_LHgs75kbNxu0MVnKKY/edit?usp=sharing',
  },
  {
    conference: 'Open Source Security',
    name: 'Open Source Security Fireside chat with Tobie Langel and NearForm DX',
    date: '2023-03-02T12:00Z',
    location: 'Virtual',
    video: 'https://youtu.be/rGaOsPMc26Y',
  },
  {
    conference: 'DeveloperWeek + ProductWorld (virtual)',
    name: "Design Tokens, Systems, and a Component's Journey From Design to Deployment",
    date: '2023-02-21T12:00Z',
    location: 'Virtual',
    video: undefined,
    slides:
      'https://docs.google.com/presentation/d/1L0CxND0HnDgFiBTdzsc2hNhGtczhb8jKh1_LboYEhho/edit?usp=sharing',
  },
  {
    conference: 'DeveloperWeek + ProductWorld (live)',
    name: "Design Tokens, Systems, and a Component's Journey From Design to Deployment",
    date: '2023-02-15T12:00Z',
    location: 'Oakland, CA, USA',
    flag: 'i-circle-flags-us',
    video: 'none',
    slides:
      'https://docs.google.com/presentation/d/1L0CxND0HnDgFiBTdzsc2hNhGtczhb8jKh1_LboYEhho/edit?usp=sharing',
  },
  {
    conference: 'DevFest Alps',
    name: 'Zen and the Art of Organizational Open Source',
    date: '2023-01-14T12:00Z',
    location: 'Turin, Italy',
    flag: 'i-circle-flags-it',
    video: 'none',
    slides:
      'https://docs.google.com/presentation/d/11pf28uBhezrfs7uagDbInNZXDnem-2qJAUlR3GHIweM/edit?usp=sharing',
  },
  {
    conference: 'Open Source',
    name: 'Inclusion and Diversity in Open Source | Fireside chat with Robin Ginn and NearForm DX team',
    date: '2023-01-10T12:00Z',
    location: 'Virtual',
    video: 'https://youtu.be/sa0GwlmIMJY',
  },
  {
    conference: 'Lyra',
    name: 'Lyra, hold my beer! Fireside chat with Michele Riva & Paolo Insogna',
    date: '2022-12-07T12:00Z',
    location: 'Virtual',
    video: 'https://youtu.be/gG2l9ZfgipU',
  },
  {
    conference: 'IPFS Camp Lisbon',
    name: 'Fireside chat with Paolo Insogna',
    date: '2022-10-28T12:00Z',
    location: 'Lisbon, Portugal',
    flag: 'i-circle-flags-pt',
    video: 'https://youtu.be/P6NUoAvtOWg',
  },
  {
    conference: 'NodeConf EU',
    name: 'Fireside chat with Matteo Collina',
    date: '2022-10-04T12:00Z',
    location: 'Kilkenny, Ireland',
    flag: 'i-circle-flags-ie',
    video: 'https://youtu.be/69W5TLKK1Sk',
  },
  {
    conference: 'NodeConf EU',
    name: 'Fireside chat with James Snell',
    date: '2022-10-04T12:00Z',
    location: 'Kilkenny, Ireland',
    flag: 'i-circle-flags-ie',
    video: 'https://youtu.be/XktEZKOIaXY',
  },
  {
    conference: 'NodeConf EU',
    name: 'Fireside chat with Mikeal Rogers',
    date: '2022-10-04T12:00Z',
    location: 'Kilkenny, Ireland',
    flag: 'i-circle-flags-ie',
    video: 'https://youtu.be/pSM__WKciMg',
  },
  {
    conference: 'NodeConf EU',
    name: 'Fireside chat with Paolo Fragomeni',
    date: '2022-10-04T12:00Z',
    location: 'Kilkenny, Ireland',
    flag: 'i-circle-flags-ie',
    video: 'https://youtu.be/NYGZ7Vljuqo',
  },
  {
    conference: 'NodeConf EU',
    name: 'Full-stack JS today: Fastify, GraphQL and React',
    date: '2022-10-03T12:00Z',
    location: 'Kilkenny, Ireland',
    flag: 'i-circle-flags-ie',
    video: 'https://youtu.be/guAMBFqKSF4',
    slides:
      'https://docs.google.com/presentation/d/1vHYSlgV8pSI3kobGQlYxfssvaeZrGA4BqDn0qLGDmYg/edit?usp=sharing',
    repo: 'https://github.com/codyzu/mfs-js',
  },
  {
    conference: 'NodeConf EU',
    name: 'From zero to GraphQL Workshop',
    date: '2022-10-03T15:00Z',
    location: 'Kilkenny, Ireland',
    flag: 'i-circle-flags-ie',
    video: 'none',
    slides: 'https://nearform.github.io/the-graphql-workshop',
    repo: 'https://github.com/nearform/the-graphql-workshop',
  },
  {
    conference: 'ReactSummit',
    name: 'Full-stack JS today: Fastify, GraphQL and React',
    date: '2022-06-17T12:00Z',
    location: 'Amsterdam, Netherlands',
    flag: 'i-circle-flags-nl',
    video:
      'https://portal.gitnation.org/contents/full-stack-js-today-fastify-graphql-and-react',
    slides:
      'https://docs.google.com/presentation/d/16OHcPhk1GKjprCFymcK_PAiPbvM7tGG0mCudFzVvHaU/edit?usp=sharing',
    repo: 'https://github.com/codyzu/mfs-js',
  },
];

export default talks;
