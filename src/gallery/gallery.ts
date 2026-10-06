import type {ImageMetadata} from 'astro';
import techStack from './01_reactsummit_tech_stack_big.jpeg';
import reactCloseup from './02_reactsummit_closeup_3.jpeg';
import nodeCloseup from './03_nodeconf_closeup.jpeg';
import community from './04_nodeconf_community.jpeg';
import introduction from './05_devfest_alps_intro_portrait.jpeg';
import unicorns from './06_reactsummit_unicorns.jpeg';
import motivation from './07_devfest_alps_why.jpeg';
import title from './08_reactsummit_me.jpeg';

type GalleryPhoto = {
  image: ImageMetadata;
  alt: string;
  order: number;
  aspectRatio: '4/3' | '3/4';
  featured: boolean;
};

export const gallery = [
  {
    image: techStack,
    alt: 'Cody presenting the technology stack at React Summit',
    order: 1,
    aspectRatio: '4/3',
    featured: true,
  },
  {
    image: reactCloseup,
    alt: 'Cody speaking on stage at React Summit',
    order: 2,
    aspectRatio: '4/3',
    featured: false,
  },
  {
    image: nodeCloseup,
    alt: 'Cody presenting at NodeConf EU',
    order: 3,
    aspectRatio: '4/3',
    featured: false,
  },
  {
    image: community,
    alt: 'Cody presenting a community-first slide at NodeConf EU',
    order: 4,
    aspectRatio: '4/3',
    featured: false,
  },
  {
    image: introduction,
    alt: 'Cody introducing his talk at DevFest Alps',
    order: 5,
    aspectRatio: '3/4',
    featured: false,
  },
  {
    image: unicorns,
    alt: 'Cody presenting a slide about unicorns at React Summit',
    order: 6,
    aspectRatio: '4/3',
    featured: false,
  },
  {
    image: motivation,
    alt: 'Cody explaining the motivation for his talk at DevFest Alps',
    order: 7,
    aspectRatio: '4/3',
    featured: false,
  },
  {
    image: title,
    alt: 'Cody’s presentation title slide at React Summit',
    order: 8,
    aspectRatio: '4/3',
    featured: false,
  },
] satisfies GalleryPhoto[];
