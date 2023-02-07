import { sveltekit } from "@sveltejs/kit/vite";
import { searchForWorkspaceRoot, defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: [
        // search up for workspace root
        searchForWorkspaceRoot(process.cwd()),
      ],
    },
  },
});
