/** @type {import('tailwindcss').Config} config */

import plugin from 'tailwindcss/plugin.js';
import postcss from 'postcss';
import postcssJs from 'postcss-js';
import fs from 'fs';
import path from 'path';
import tokensToTailwind from './resources/css-utils/tokens-to-tailwind.js';
import clampGenerator from './resources/css-utils/clamp-generator.js';

// Raw design tokens
const colorTokens = JSON.parse(fs.readFileSync(path.resolve('./resources/design-tokens/colors.json'), 'utf8'));
const fontTokens = JSON.parse(fs.readFileSync(path.resolve('./resources/design-tokens/fonts.json'), 'utf8'));
const spacingTokens = JSON.parse(fs.readFileSync(path.resolve('./resources/design-tokens/spacing.json'), 'utf8'));
const textSizeTokens = JSON.parse(fs.readFileSync(path.resolve('./resources/design-tokens/text-sizes.json'), 'utf8'));
const textLeadingTokens = JSON.parse(fs.readFileSync(path.resolve('./resources/design-tokens/text-leading.json'), 'utf8'));
const textWeightTokens = JSON.parse(fs.readFileSync(path.resolve('./resources/design-tokens/text-weights.json'), 'utf8'));
const viewportTokens = JSON.parse(fs.readFileSync(path.resolve('./resources/design-tokens/viewports.json'), 'utf8'));


// Process design tokens
const colors = tokensToTailwind(colorTokens.items);
const fontFamily = tokensToTailwind(fontTokens.items);
const fontWeight = tokensToTailwind(textWeightTokens.items);
const fontSize = tokensToTailwind(clampGenerator(textSizeTokens.items));
const lineHeight = tokensToTailwind(clampGenerator(textLeadingTokens.items));
const spacing = tokensToTailwind(clampGenerator(spacingTokens.items));

// Tailwind config
const config = {
  content: ['./app/**/*.php', './resources/**/*.{php,vue,js}'],
  // Add color classes to safe list so they are always generated
  safelist: [],
  presets: [],
  theme: {
    screens: {
      sm: `${viewportTokens.min}px`,
      md: `${viewportTokens.mid}px`,
      lg: `${viewportTokens.max}px`,
    },
    colors,
    spacing,
    fontSize,
    lineHeight,
    fontFamily,
    fontWeight,
    backgroundColor: ({theme}) => theme('colors'),
    textColor: ({theme}) => theme('colors'),
    margin: ({theme}) => ({
      auto: 'auto',
      ...theme('spacing')
    }),
    padding: ({theme}) => theme('spacing')
  },
  variantOrder: [
    'first',
    'last',
    'odd',
    'even',
    'visited',
    'checked',
    'empty',
    'read-only',
    'group-hover',
    'group-focus',
    'focus-within',
    'hover',
    'focus',
    'focus-visible',
    'active',
    'disabled',
  ],

  // Disables Tailwind's reset and usage of rgb/opacity
  corePlugins: {
    preflight: false,
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
  },

  // Prevents Tailwind's core components
  blocklist: ['container'],

  // Prevents Tailwind from generating that wall of empty custom properties
  experimental: {
    optimizeUniversalDefaults: true
  },
  plugins: [
    // Generates custom property values from tailwind config
    plugin(function ({addComponents, config}) {
      let result = '';

      const currentConfig = config();

      const groups = [
        {key: 'colors', prefix: 'color'},
        {key: 'spacing', prefix: 'space'},
        {key: 'fontSize', prefix: 'size'},
        {key: 'lineHeight', prefix: 'leading'},
        {key: 'fontFamily', prefix: 'font'},
        {key: 'fontWeight', prefix: 'font'},
      ];

      groups.forEach(({key, prefix}) => {
        const group = currentConfig.theme[key];

        if (!group) {
          return;
        }

        Object.keys(group).forEach((key) => {
          result += `--${prefix}-${key}: ${group[key]};`;
        });
      });

      addComponents({
        ':root': postcssJs.objectify(postcss.parse(result)),
      });
    }),
    // Generates custom utility classes
    plugin(function ({addUtilities, config}) {
      const currentConfig = config();
      const customUtilities = [
        {key: 'spacing', prefix: 'flow-space', property: '--flow-space'},
        {key: 'spacing', prefix: 'region-space', property: '--region-space'},
        {key: 'spacing', prefix: 'gutter', property: '--gutter'},
      ];

      customUtilities.forEach(({key, prefix, property}) => {
        const group = currentConfig.theme[key];

        if (!group) {
          return;
        }

        Object.keys(group).forEach((key) => {
          addUtilities({
            [`.${prefix}-${key}`]: postcssJs.objectify(
              postcss.parse(`${property}: ${group[key]}`),
            ),
          });
        });
      });
    }),
  ],
};

export default config;
