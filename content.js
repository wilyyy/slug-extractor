// Helper function to extract slug from URL
const ExtractSlugFromUrl = (url) => {
   const pathParts = url.pathname.split("/").filter((part) => part !== "");
   return pathParts.join("/");
};

// Helper function to copy text to clipboard
const CopyToClipboard = (text) => {
   return navigator.clipboard.writeText(text);
};

// Helper function to query active tab and execute action
const QueryActiveTabAndExecute = (action) => {
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      action(tabs[0]);
   });
};

// Function to show current slug preview
const ShowSlugPreview = (slug) => {
   const slugPreview = document.querySelector(".slug-preview");
   slugPreview.textContent = `${slug}`;
};

// Function to open local host with slug
const RunLocalHostWithSlug = (host) => {
   QueryActiveTabAndExecute((tab) => {
      const slug = ExtractSlugFromUrl(new URL(tab.url));
      const localPageUrl = slug
         ? `http://localhost:${host}/${slug}`
         : `http://localhost:${host}/`;
      chrome.tabs.create({ url: localPageUrl });
   });
};

// Function to copy the whole slug
const ExtractWholeSlug = () => {
   QueryActiveTabAndExecute((tab) => {
      const slug = ExtractSlugFromUrl(new URL(tab.url));
      if (slug) {
         CopyToClipboard(slug)
            .then(() => {
               console.log("Whole slug copied to clipboard:", slug);
            })
            .catch((error) => {
               console.error("Error copying whole slug:", error);
            });
      }
   });
};

// Function to extract slug with depth
const ExtractSlugWithDepth = (depth) => {
   QueryActiveTabAndExecute((tab) => {
      const url = new URL(tab.url);
      const pathParts = url.pathname.split("/").filter((part) => part !== "");

      const depthToConsider = Math.min(depth, pathParts.length);
      const slug = pathParts.slice(-depthToConsider).join("/");

      if (slug) {
         CopyToClipboard(slug)
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

   QueryActiveTabAndExecute((tab) => {
      const slug = ExtractSlugFromUrl(new URL(tab.url));
      ShowSlugPreview(slug);
   });

   runLocalHostButton.addEventListener("click", function () {
      const hostInput = document.querySelector(".host-input");
      const host = hostInput.value;
      RunLocalHostWithSlug(host);
   });

   extractWholeSlugButton.addEventListener("click", ExtractWholeSlug);

   extractWithDepthButton.addEventListener("click", function () {
      const depthInput = document.querySelector(".depth-input");
      const depth = parseInt(depthInput.value, 10);
      ExtractSlugWithDepth(depth);
   });
});
