/******/ (() => { // webpackBootstrap
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
function initFE() {
  closeByClickOutside('[data-menu="mainmenu"]', '[data-menutoggle="mainmenu"]');
}

function closeByClickOutside(element, button) {
  $(document).click(function (event) {
    if (!$(event.target).closest(`${element},${button}`).length) {
      $(button).removeClass("active")
      $(element).removeClass("active")
    }
  })

  $(document).keyup(function (e) {
    if (e.key === "Escape") {
      // escape key maps to keycode `27`
      $(button).removeClass("active")
      $(element).removeClass("active")
    }
  })
}



$(document).ready(function () {

  document.querySelectorAll('[data-toggle="password"]').forEach(item => {
    item.addEventListener('click', event => {

        let inp = item.previousElementSibling
        if (inp.type === "password") {
            inp.type = "text";
        } else {
            inp.type = "password";
        }
    })
  })



 
  $("a.scrollTo").click(function () {

    var destination = $($(this).attr("href")).offset().top - 30;
    $("html:not(:animated),body:not(:animated)").animate({
      scrollTop: destination
    }, 1100);
    return false;
  });

 

  $(".jsbackdrop").on("click", function (e) {
    $(this).removeClass("active")
    $("[data-menu]").removeClass("active")
    $("[data-menutoggle]").removeClass("active")
  })

  $("input[type=tel]").mask("7 (999) 999-99-99")
 
})


window.addEventListener("load", function () {
  initFE()
})

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************!*\
  !*** ./src/scss/responsive.scss ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map