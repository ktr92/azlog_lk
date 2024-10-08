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
  closeByClickOutside('[data-toggle="messageblock"]', '[data-toggleclick="messageblock"]')
  closeByClickOutside('[data-toggle="accountmenu"]', '[data-toggleclick="accountmenu"]')
  closeByClickOutside('[data-toggle="dateblock"]', '[data-toggleclick="dateblock"]')
  closeByClickOutside('[data-toggle="agentblock"]', '[data-toggleclick="agentblock"]')
  closeByClickOutside('[data-toggle="toolbarmenu"]', '[data-toggleclick="toolbarmenu"]')
  closeByClickOutside('.popup', '[data-toggle="popup"]')

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

  $('[data-click="newtel"]').on('click', function(e) {
    $(this).hide()
    $(this).siblings('.tel2').addClass('active')
  })

  $('[name=F_DOCTYPE]').on('change', function() {
    if ($(this).val() !== 'Паспорт РФ') {
      $('[name=F_PASS_1]').hide()
    } else {
      $('[name=F_PASS_1]').show()
    }
  })

  $.fn.setCursorPosition = function(pos) {
    if ($(this).get(0).setSelectionRange) {
      $(this).get(0).setSelectionRange(pos, pos);
    } else if ($(this).get(0).createTextRange) {
      var range = $(this).get(0).createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  };

  $('input[type="tel"]').focus(function(){
    $(this).setCursorPosition(3);
  }).mask("+7 (999) 999-99-99")


  $("input.phonedob").focus(function(){
    $(this).setCursorPosition(3);
  }).mask("9999", {autoclear: false})
  $('input[data-stepdata="send_pasp1"]').mask("9999")
  $('input[data-stepdata="send_pasp2"]').mask("999999")
  $('input[data-stepdata="receive_pasp1"]').mask("9999")
  $('input[data-stepdata="receive_pasp2"]').mask("999999")
  $('input[data-stepdata="payer_pasp1"]').mask("9999")
  $('input[data-stepdata="payer_pasp2"]').mask("999999")
  $('input[data-stepdata="send_kpp"]').mask("99999999")
  $('input[data-stepdata="send_inn"]').mask("999999999?999")
  $('input[data-stepdata="receive_yurkpp"]').mask("99999999")
  $('input[data-stepdata="receive_yurinn"]').mask("999999999?999")
  $('input[name="FLOOR"]').mask("9?9")
  $('input[name="TO_FLOOR"]').mask("9?9")

  const $tabs = document.querySelector('[data-headertabs]')

  if ($tabs) {
    $tabs.addEventListener('click', function(e) {
      const el = e.target
      if (el.tagName === 'LI') {
          if (!el.classList.contains('active')) {
              let index = Array.from(el.parentNode.children).indexOf(el)
  
              document.querySelectorAll('[data-headertabs] li').forEach(item => {
                  item.classList.remove('active')
              })
              el.classList.add('active')
  
              document.querySelectorAll('[data-contenttabs]').forEach(item => {
                  item.classList.remove('active')
              })
              const items = Array.from(document.querySelector('[data-tabswrapper]').children)
              items[index].classList.add('active')
          }
      }
  })
  }


  $('.pagefilterbtn').on('click', function(e) {
    e.preventDefault()

    $(this).closest('.pagefilter').toggleClass('active')

    $(this).closest('.pagefilter').find('.pagefilterbtn__hidden').slideToggle()
})
 
  $('[data-toggleclick]').on('click', function(e) {
    $(this).toggleClass('active')
    e.preventDefault()
    let dropdown = $(this).data('toggleclick')
    $('[data-toggle].active').not($(`[data-toggle=${dropdown}]`)).removeClass('active')
    $('[data-toggleclick].active').not($(`[data-toggleclick=${dropdown}]`)).removeClass('active')
    $(`[data-toggle=${dropdown}]`).toggleClass('active')
    $(`[data-toggleactive=${dropdown}]`).toggleClass('active')
})
  $('[data-togglevalue]').on('click', function(e) {
    e.preventDefault()
    $(this).toggleClass('active')
    // get value
    let val = $(this).data('togglevalue')
    // get wrapper leement
    const $wrapper = $(this).closest('[data-toggleitem]')
    // get dropdown ID
    let id = $wrapper.data('toggleitem')
    // close dropdown
    $(`[data-toggle=${id}]`).toggleClass('active')
    // set value
    $(`[data-value=${id}]`).text(val)
    $(`[data-inputvalue=${id}]`).val(val)
})

$('[data-toggleclickset]').on('click', function(e) {
    $(this).toggleClass('active')
    e.preventDefault()
    let dropdown = $(this).data('toggleclickset')
    let wrapper = $(this).closest(`[data-toggleitem]`)
    $('[data-toggleitem].active').not(wrapper).removeClass('active')
    $('[data-toggle].active').not(wrapper.find(`[data-toggle=${dropdown}]`)).removeClass('active')
    $('[data-toggleclickset].active').not(wrapper.find(`[data-toggleclickset=${dropdown}]`)).removeClass('active')
    wrapper.addClass('active')
    wrapper.find(`[data-toggle=${dropdown}]`).toggleClass('active')
    $(`[data-toggleactive=${dropdown}]`).toggleClass('active')
})

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

  $("[data-menutoggle]").on("click", function (e) {
    e.preventDefault();
    let menu = $(this).data("menutoggle");
    $(`[data-menu=${menu}]`).toggleClass("active");
    $(this).toggleClass("active");
    $(".jsbackdrop").toggleClass("active");
    $("body").toggleClass("expmenu");
  });

  $(".jsbackdrop").on("click", function (e) {
    $(this).removeClass("active")
    $("[data-menu]").removeClass("active")
    $("[data-menutoggle]").removeClass("active")
  })

  $("input[type=tel]").mask("7 (999) 999-99-99");


  $("[data-toggle='popup']").on('click', function(e) {
    const target = $(this).attr('href')
    $(target).addClass('active');
    $(".jsbackdrop").addClass("active");
  })
  $("[data-dismiss='popup']").on('click', function(e) {
    const target = $(this).closest('.popup')
    $(target).removeClass('active');
    $(".jsbackdrop").removeClass("active");
  })
 
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