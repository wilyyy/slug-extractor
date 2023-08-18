/**
 * This function will copy paste the whole slug
 */
const ExtractWholeSLug = () => {};

/**
 * This function will open a new tab with localhost/slug
 * @param {string} host how deep in the within the slug we want to copy
 */
const RunLocalHostWithSlug = (host) => {};

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

   extractWithDepthButton.addEventListener("click", function () {
      const depthInput = document.querySelector(".depth-input");
      const depth = parseInt(depthInput.value, 10);

      ExtractSlugWithDepth(depth);
   });
});
