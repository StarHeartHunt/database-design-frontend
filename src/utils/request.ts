import { createFetch } from "@vueuse/core";

export const useDataFetch = createFetch({
  baseUrl: "http://127.0.0.1:3000",
  combination: "overwrite",
  options: {
    async beforeFetch({ options, cancel }) {
      const token = window.localStorage.getItem("jwtToken");
      if (!token) cancel();

      const CONTENT_TYPE_HEADERS = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      if (options.body) {
        options.headers = {
          ...options.headers,
          ...CONTENT_TYPE_HEADERS,
        };
      }

      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      return { options };
    },
  },
});
