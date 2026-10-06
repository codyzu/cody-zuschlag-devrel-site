import {defineConfig, presetWind4, presetIcons} from 'unocss';

export default defineConfig({
  content: {filesystem: ['src/**/*.{astro,ts,md}']},
  safelist: ['bg-gradient-hero'],
  presets: [
    presetWind4({preflights: {reset: true}}),
    presetIcons({
      extraProperties: {display: 'inline-block', 'vertical-align': 'middle'},
    }),
  ],
  theme: {
    colors: {
      highlight: '#85C241',
      secondary: '#9ca3af',
      primary: '#ffffff',
      hero: '#469537',
      background: '#000000',
    },
    font: {sans: 'Roboto, ui-sans-serif, system-ui, sans-serif'},
  },
  shortcuts: {
    link: 'text-highlight no-underline',
    'bg-gradient-title':
      'bg-linear-to-br from-primary via-primary to-highlight',
    'bg-gradient-hero': 'bg-linear-to-br from-primary via-primary to-hero',
    'bg-gradient-link':
      'bg-linear-to-br from-primary via-highlight to-highlight',
  },
  rules: [
    ['section-shadow', {'box-shadow': '0 1rem 3rem rgba(255, 255, 255, .18)'}],
  ],
});
