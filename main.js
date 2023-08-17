const ExtractSlug = (depth) => {
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

document.addEventListener("DOMContentLoaded", function () {
   const extractButton = document.querySelector(".extract-button");

   extractButton.addEventListener("click", function () {
      const depthInput = document.querySelector(".depth-input");
      const depth = parseInt(depthInput.value, 10);

      ExtractSlug(depth);
   });
});
