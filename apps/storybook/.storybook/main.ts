import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  // `public/` ships as-is into storybook-static (it carries the .htaccess with the cache rules).
  staticDirs: ["../public"],
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
};

export default config;
