document.addEventListener("DOMContentLoaded", function () {
   const extractButton = document.querySelector(".extract-button");

   extractButton.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
         const url = new URL(tabs[0].url);
         const slug = url.pathname
            .split("/")
            .filter((part) => part !== "")
            .pop();

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
   });
});
