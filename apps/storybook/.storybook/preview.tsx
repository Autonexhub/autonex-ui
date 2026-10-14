import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "muted", value: "#F5F5F5" },
        { name: "dark", value: "#0a0a0a" },
      ],
    },
    layout: "centered",
  },
};

export default preview;
