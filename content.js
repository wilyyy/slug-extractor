/**
 * This function will copy paste the whole slug
 */
const ExtractWholeSlug = () => {
   try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
         const url = new URL(tabs[0].url);
         const slug = url.pathname.substring(1); // Remove the leading slash

         if (slug) {
            navigator.clipboard
               .writeText(slug)
               .then(() => {
                  console.log("Whole slug copied to clipboard:", slug);
                  // You can optionally close the popup window here if needed
               })
               .catch((error) => {
                  console.error("Error copying whole slug:", error);
               });
         }
      });
   } catch (error) {
      console.error("Error:", error);
   }
};

/**
 * This function will open a new tab with localhost/slug
 * @param {string} host how deep in the within the slug we want to copy
 */
const RunLocalHostWithSlug = (host) => {
   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);
      const pathParts = url.pathname.split("/").filter((part) => part !== "");

      const depthToConsider = Math.min(pathParts.length, depth);
      const slug = pathParts.slice(-depthToConsider).join("/");

      if (slug) {
         const localPageUrl = `http://localhost:${host}/${slug}`;
         chrome.tabs.create({ url: localPageUrl });
      }
   });
};

/**
 * This function extracts a portion of the slug based on breadcrumb depth value
 * @param {number} depth how deep in the within the slug we want to copy
 */
const ExtractSlugWithDepth = (depth) => {
   try {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
         const url = new URL(tabs[0].url);
         const pathParts = url.pathname.split("/").filter((part) => part !== "");

         const depthToConsider = Math.min(depth, pathParts.length);
         const slug = pathParts.slice(-depthToConsider).join("/");

         if (slug) {
            navigator.clipboard
               .writeText(slug)
               .then(() => {
                  console.log("Slug copied to clipboard:", slug);
                  window.close();
               })
               .catch((error) => {
                  console.error("Error copying slug:", error);
               });
         }
      });
   } catch (error) {
      console.error("Error:", error);
   }
};

// onload function
document.addEventListener("DOMContentLoaded", function () {
   const extractWholeSlugButton = document.querySelector(".extract-whole-slug");
   const runLocalHostButton = document.querySelector(".run-local-host");
   const extractWithDepthButton = document.querySelector(".extract-slug-with-depth");

   extractWholeSlugButton.addEventListener("click", ExtractWholeSlug);

   runLocalHostButton.addEventListener("click", function () {
      const hostInput = document.querySelector(".host-input");
      const host = hostInput.value;
      RunLocalHostWithSlug(host);
   });

   extractWithDepthButton.addEventListener("click", function () {
      const depthInput = document.querySelector(".depth-input");
      const depth = parseInt(depthInput.value, 10);

      ExtractSlugWithDepth(depth);
   });
});
