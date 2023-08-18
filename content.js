// Helper function to extract slug from URL
const extractSlugFromUrl = (url) => {
   const pathParts = url.pathname.split("/").filter((part) => part !== "");
   return pathParts.join("/");
};

// Helper function to copy text to clipboard
const copyToClipboard = (text) => {
   return navigator.clipboard.writeText(text);
};

// Helper function to query active tab and execute action
const queryActiveTabAndExecute = (action) => {
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      action(tabs[0]);
   });
};

// Function to copy the whole slug
const extractWholeSlug = () => {
   queryActiveTabAndExecute((tab) => {
      const slug = extractSlugFromUrl(new URL(tab.url));
      if (slug) {
         copyToClipboard(slug)
            .then(() => {
               console.log("Whole slug copied to clipboard:", slug);
            })
            .catch((error) => {
               console.error("Error copying whole slug:", error);
            });
      }
   });
};

// Function to open local host with slug
const runLocalHostWithSlug = (host) => {
   queryActiveTabAndExecute((tab) => {
      const slug = extractSlugFromUrl(new URL(tab.url));
      if (slug) {
         const localPageUrl = `http://localhost:${host}/${slug}`;
         chrome.tabs.create({ url: localPageUrl });
      }
   });
};

// Function to extract slug with depth
const extractSlugWithDepth = (depth) => {
   queryActiveTabAndExecute((tab) => {
      const url = new URL(tab.url);
      const pathParts = url.pathname.split("/").filter((part) => part !== "");

      const depthToConsider = Math.min(depth, pathParts.length);
      const slug = pathParts.slice(-depthToConsider).join("/");

      if (slug) {
         copyToClipboard(slug)
            .then(() => {
               console.log("Slug copied to clipboard:", slug);
               window.close();
            })
            .catch((error) => {
               console.error("Error copying slug:", error);
            });
      }
   });
};

// onload function
document.addEventListener("DOMContentLoaded", function () {
   const extractWholeSlugButton = document.querySelector(".extract-whole-slug");
   const runLocalHostButton = document.querySelector(".run-local-host");
   const extractWithDepthButton = document.querySelector(".extract-slug-with-depth");

   extractWholeSlugButton.addEventListener("click", extractWholeSlug);

   runLocalHostButton.addEventListener("click", function () {
      const hostInput = document.querySelector(".host-input");
      const host = hostInput.value;
      runLocalHostWithSlug(host);
   });

   extractWithDepthButton.addEventListener("click", function () {
      const depthInput = document.querySelector(".depth-input");
      const depth = parseInt(depthInput.value, 10);
      extractSlugWithDepth(depth);
   });
});
