// tailwind-plugins/tokens.ts
import plugin from 'tailwindcss/plugin';

export const tokenPlugin = plugin(function ({ addUtilities, theme }) {
  // --- Radius ---
  const radius = theme('borderRadius');
  const radiusUtils = Object.fromEntries(
    Object.entries(radius).map(([key, value]) => [`.radius-${key}`, { borderRadius: value }]),
  );

  // --- Spacing ---
  const spacing = theme('spacing');
  const spacingUtils = Object.fromEntries(
    Object.entries(spacing).flatMap(([key, value]) => [
      [`.p-${key}`, { padding: value }],
      [`.pt-${key}`, { paddingTop: value }],
      [`.pr-${key}`, { paddingRight: value }],
      [`.pb-${key}`, { paddingBottom: value }],
      [`.pl-${key}`, { paddingLeft: value }],
      [`.px-${key}`, { paddingLeft: value, paddingRight: value }],
      [`.py-${key}`, { paddingTop: value, paddingBottom: value }],
      [`.m-${key}`, { margin: value }],
      [`.mt-${key}`, { marginTop: value }],
      [`.mr-${key}`, { marginRight: value }],
      [`.mb-${key}`, { marginBottom: value }],
      [`.ml-${key}`, { marginLeft: value }],
      [`.mx-${key}`, { marginLeft: value, marginRight: value }],
      [`.my-${key}`, { marginTop: value, marginBottom: value }],
    ]),
  );

  // --- Colors ---
  const colors = theme('colors');
  const colorUtils = Object.fromEntries(
    Object.entries(colors).flatMap(([key, value]) => [
      [`.bg-${key}`, { backgroundColor: value }],
      [`.text-${key}`, { color: value }],
      [`.border-${key}`, { borderColor: value }],
    ]),
  );

  // --- Shadows ---
  const shadows = theme('boxShadow');
  const shadowUtils = Object.fromEntries(
    Object.entries(shadows).map(([key, value]) => [`.shadow-${key}`, { boxShadow: value }]),
  );

  addUtilities(
    {
      ...radiusUtils,
      ...spacingUtils,
      ...colorUtils,
      ...shadowUtils,
    },
    { variants: ['responsive', 'hover', 'focus'] },
  );
});
