import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  // Unity WebGL exports are generated assets, not authored React source.
  { ignores: ["public/sphere/**"] },
  ...nextVitals,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
