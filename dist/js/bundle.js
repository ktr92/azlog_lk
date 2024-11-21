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
  closeByClickOutside('[data-menu="mainmenu"]', '[data-menutoggle="mainmenu"]')
  closeByClickOutside(
    '[data-toggle="messageblock"]',
    '[data-toggleclick="messageblock"]'
  )
  closeByClickOutside(
    '[data-toggle="accountmenu"]',
    '[data-toggleclick="accountmenu"]'
  )
  closeByClickOutside(
    '[data-toggle="dateblock"]',
    '[data-toggleclick="dateblock"]'
  )
  closeByClickOutside(
    '[data-toggle="agentblock"]',
    '[data-toggleclick="agentblock"]'
  )
  closeByClickOutside(
    '[data-toggle="toolbarmenu"]',
    '[data-toggleclick="toolbarmenu"]'
  )
  closeByClickOutside(".popup", '[data-toggle="popup"]')
  dateInit()
}

const dateInit = (disabledDays = []) => {
  // 0 = ВС, 1 = ПН, 2 = ВТ, 3 = СР, 4 = ЧТ, 5 = ПТ, 6 = СБ
  /*  $('.inputlabel_date').on('click', function(e) {
    e.preventDefault()
    e.stopPropagation()
    let dp = $(this).find('.lk-datepicker').datepicker({
      minDate: new Date(),
      onRenderCell: function (date, cellType) {
        if (cellType == "day") {
          var day = date.getDay(),
            isDisabled = disabledDays.indexOf(day) != -1

          return {
            disabled: isDisabled,
          }
        }
      },
    })
  }) */
  $(".lk-datepicker").each(function () {
    $(this).datepicker().data("datepicker").destroy()
    let dp = $(this).datepicker({
      startDate : new Date(),
      minDate: new Date(),
      onRenderCell: function (date, cellType) {
        if (cellType == "day") {
          var day = date.getDay(),
            isDisabled = disabledDays.indexOf(day) != -1
          return {
            disabled: isDisabled,
          }
        }
      },
    })

    $(this)
      .closest(".inputlabel_date")
      .on("click", function (e) {
        e.preventDefault()
        dp.data("datepicker").show()
      })
  })
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

function initBoxMask(count = "") {
  $(`[data-weight-format]${count}`).inputmask("integer", {
    mask: "( 999){+|1} кг",
    numericInput: true,
    showMaskOnHover: false,
    showMaskOnFocus: true,
    rightAlign: false,
  })

  $(`[data-volume-format]${count}`).inputmask({
    rightAlign: false,
    alias: "numeric",
    digits: 2,
    suffix: " м³",
    showMaskOnHover: false,
    showMaskOnFocus: true,
  })
  $(`[data-number-format]${count}`).inputmask({
    rightAlign: false,
    alias: "integer",
    allowMinus: true,
    showMaskOnHover: false,
    showMaskOnFocus: true,
  })
  $(`[data-size-format]${count}`).inputmask({
    mask: "( 999){+|1} см",
    numericInput: true,
    showMaskOnHover: false,
    showMaskOnFocus: true,
    rightAlign: false,
  })
  $(`[data-separate-format]${count}`).inputmask({
    mask: "99 x 99 x 99",
    alias: "integer",
    showMaskOnHover: false,
    showMaskOnFocus: true,
    rightAlign: false,
  })
}


function validateRequired() {
  let valid = true

  $('.error').removeClass('error')
  const required = []
  const $required = $('input[data-required="required"]:visible')

  $required.each(function () {
    const obj = {
      input: $(this),
      val: $(this).val().toString(),
      min: +$(this).data("min") || 1,
      max: +$(this).data("max") || 9999,
    }
    required.push(obj)
  })

  required.forEach(function (item) {
    if (item.val.length < 1) {
      valid = false
      item.input.addClass("error")
    }
  })

  if ($(".checkbox_required:visible").length) {
    return false
  }

 /*  if ($(".error").length) {
    $("html, body").animate(
      {
        scrollTop: $(".error").offset().top - 50,
      },
      500
    )
  } */

  return valid
}

$(document).ready(function () {

  $(document).on("click", '.modal-backdrop', function (e) {
    $('.modal').modal('hide')
  })


  
  $("[data-modaltab]").on("click", function (e) {
    e.preventDefault()
    e.stopPropagation()
    const tab = $(this).attr('data-modaltab')
    const $wrapper = $(this).closest("[data-tabswrapper]")
    $wrapper.find(`.active`).removeClass("active")
    $wrapper.find(`.mobactive`).removeClass("mobactive")
    $wrapper.find(`[data-modalcontent=${tab}]`).addClass("active")
    $wrapper.find(`[data-modalcontent=${tab}]`).addClass("mobactive")
    $wrapper.find(`[data-tabsmenumain]`).addClass("menuactive")
    $wrapper.find(`[data-tabsmenu]`).addClass("menuactive")
    $(this).addClass('active')    
    $(this).addClass('mobactive')    
  })
  $("[data-menuback]").on("click", function (e) {
    e.preventDefault()
    e.stopPropagation()
    const $wrapper = $(this).closest("[data-tabswrapper]")
    $wrapper.find(`.active`).removeClass("active")
    $wrapper.find(`.mobactive`).removeClass("mobactive")
    $wrapper.find(`.menuactive`).removeClass("menuactive")
    
  })


  $('[data-submit="stepform"]').on('click', function(e) {
    e.preventDefault()
    const $form = $(this).parents("form")

    $form.find('.error').removeClass('error')

    let errorList = []
    $.each($(".calcerrors__text:visible"), function (i, val) {
      errorList.push($(this).text())
    })
    $('[name="ERRORS"]').val(errorList.join(","))

    if (validateRequired()) {
     // send form
     alert('its okay')
    }
  })

  jQuery
  ;(function ($) {
    $(function () {
      $(".calctabs-js").on("click", "label:not(.active)", function () {
        $(this).addClass("active").siblings().removeClass("active")
        $(this)
          .closest("[data-tabswrapper]")

          .find("[data-tabs]")
          .removeClass("active")
          .eq($(this).index())
          .addClass("active")
        $(this)
          .closest("[data-tabswrapper]")

          .find("[data-tabscontent]")
          .removeClass("active")
          .eq($(this).index())
          .addClass("active")
        /* if ($('input[name="fromAddress"]').val() !== "") {
          $('span[data-stepdata="p_otpravki"]')
            .closest(".dropdownJS")
            .find(".dropdownJS__menu li:first")
            .trigger("click")
        }
        if ($('input[name="toAddress"]').val() !== "") {
          $('span[data-stepdata="p_dostavki"]')
            .closest(".dropdownJS")
            .find(".dropdownJS__menu li:first")
            .trigger("click")
        } */
      })
    })
  })(jQuery)

 
  $(".inputhints a").on("click", function (e) {
    e.preventDefault()
    const val = $(this).text()
    $(this).closest("[data-wrapper]").find("input").val(val)
  })

  $('[data-action="newtel"]').on("click", function (e) {
    e.preventDefault()
    $(this).siblings(".newtel").append(`
      <div class="floating">
        <input type="tel" name="R_F_PHONE[]" data-stepdata="receive_tel"
          data-steptype="source" data-required="required" data-min="18" data-max="18" onkeyup="this.setAttribute('value', this.value);" value="">
        <span class="floating-label">Телефон</span></span>
      </div>
      `)

    $('input[type="tel"]')
      .focus(function () {
        $(this).setCursorPosition(3)
      })
      .mask("+7 (999) 999-99-99")
  })

  function offDadata(selector) {
    if ($(selector).attr('data-dadatatype')) {
      $(selector).removeAttr('data-dadata')
    } else {
      $(selector).removeAttr('data-blocked').removeAttr('disabled')

    }
  }

  function onDadata(selector) {
    if ($(selector).attr('data-dadatatype')) {
      $(selector).attr('data-dadata', "org")
    } else {
      $(selector).attr('data-blocked', selector).attr('disabled', 'disabled')

    }

  }


  $('[data-ondadata]').on("change", function (e) {
    const selector = $(this).attr('data-ondadata')
    if ($(this).is(":checked")) {
      offDadata($(`[data-offdadata=${selector}]`))
    } else {
      onDadata($(`[data-offdadata=${selector}]`))
    }
    
  })


  $("input").on("change", function (e) {
    if ($(this).closest('[data-depgroup]').length) {
      const dep = $(this).attr("data-dependcheck")
      if (dep) {
        if ($(this).is(":checked")) {
          $(`[data-dependbox=${dep}`).addClass('active')
        } 
      } else {
        const depgroup = $(this).closest('[data-depgroup]').attr('data-depgroup')
        $(`[data-dependbox=${depgroup}`).removeClass('active')
      }
    }

    validateRequired()
   
  })
  $(".checkblock input").on("change", function (e) {
    const label = $(this).closest(".checkblock").find("[data-dependon]")
    if ($(this).is(":checked")) {
      label.text("Активирован")
    } else {
      label.text("Отключен")
    }
    
  })
  $("input#R_SIMPLIFY").on("change", function (e) {
    const $wrapper = $(this).closest(".calcform__inputs")
    if ($(this).is(":checked")) {
      $wrapper.find('[data-dependselect]').attr('data-blocked', 'blocked')
      $wrapper.find('[data-depend]').removeAttr('data-required').removeClass('error')
      $wrapper.find('[data-depend]').attr('disabled', 'disabled')

    } else {
      $wrapper.find('[data-dependselect]').removeAttr('data-blocked', 'blocked')
      $wrapper.find('[data-depend]').attr('data-required', 'required')
      $wrapper.find('[data-depend]').removeAttr('disabled')
    }
    
  })
  $("[data-action='addbox']").on("click", function (e) {
    e.preventDefault()

    let count = $("[data-box]").length
    const $domtarget = $("#calcobjects")
    count++

    const newbox = `
      <div class="calcobject" data-box='${count}'>
        <div class="calcobject__row">
          <div class="calcobject__number">
            <span>${count}</span>
          </div>
          <div class="calcobject__input floating">
            <div class="floating">
              <input data-inputid="boxvolume_${count}" data-new-box=${count} type="text" name='boxVolume[]' value='' onkeyup="this.setAttribute('value', this.value);" data-volume-format=""  data-required="required"> 
              <span class="floating-label">Обьем<span class="red">*</span></span>
            </div>
          </div>
          <div class="calcobject__input">
            <div class="floating">
              <input data-inputid="boxweight_${count}" data-new-box=${count} type="text" name='boxWeight[]' value='' onkeyup="this.setAttribute('value', this.value);" data-weight-format="" data-required="required"> 
              <span class="floating-label">Вес места<span class="red">*</span></span>
            </div>
          </div>
          <div class="calcobject__input">
            <div class="floating">
              <input data-inputid="boxcount_${count}" data-new-box=${count} type="text" name='boxCount[]' name='volume_1' value='' onkeyup="this.setAttribute('value', this.value);" data-number-format=""> 
              <span class="floating-label">Количество</span>
            </div>
          </div>
          <div class="calcobject__input w-full">
            <div class="floating">
              <input data-inputid="boxsizes_${count}" data-new-box=${count} type="text" name='boxSizes[]' value='' onkeyup="this.setAttribute('value', this.value);" data-separate-format=""> 
              <span class="floating-label">Габариты <span class="gray">(Необязательно)</span></span>
            </div>
          </div>
        </div>
        <div class="calcobject__remove" data-action="boxremove">
          <img src="img/closebox.svg">
        </div>
      </div>
    `

    $domtarget.append(newbox)
    initBoxMask(`[data-new-box=${count}]`)

    $("[data-action='boxremove']").on("click", function (e) {
      const $boxid = $(this).closest("[data-box]")
      $boxid.remove()

      $(".calcobject__number").each(function (index) {
        $(this).text(index + 1)
      })
    })
  })

  initBoxMask()

  $('[data-click="newtel"]').on("click", function (e) {
    $(this).hide()
    $(this).siblings(".tel2").addClass("active")
  })

  $("[name=F_DOCTYPE]").on("change", function () {
    if ($(this).val() !== "Паспорт РФ") {
      $("[name=F_PASS_1]").hide()
    } else {
      $("[name=F_PASS_1]").show()
    }
  })

  $.fn.setCursorPosition = function (pos) {
    if ($(this).get(0).setSelectionRange) {
      $(this).get(0).setSelectionRange(pos, pos)
    } else if ($(this).get(0).createTextRange) {
      var range = $(this).get(0).createTextRange()
      range.collapse(true)
      range.moveEnd("character", pos)
      range.moveStart("character", pos)
      range.select()
    }
  }

  $('input[type="tel"]')
    .focus(function () {
      $(this).setCursorPosition(3)
    })
    .mask("+7 (999) 999-99-99")

  $("input.phonedob")
    .focus(function () {
      $(this).setCursorPosition(3)
    })
    .mask("9999", { autoclear: false })
  $('input[data-stepdata="send_pasp1"]').mask("9999")
  $('input[data-stepdata="send_pasp2"]').mask("999999")
  $('input[data-stepdata="receive_pasp1"]').mask("9999")
  $('input[data-stepdata="receive_pasp2"]').mask("999999")
  $('input[data-stepdata="payer_pasp1"]').mask("9999")
  $('input[data-stepdata="payer_pasp2"]').mask("999999")
  $('input[data-stepdata="send_kpp"]').mask("99999999")
  $('input[data-stepdata="send_inn"]').mask("999999999")
  $('input[data-stepdata="receive_yurkpp"]').mask("99999999")
  $('input[data-stepdata="receive_yurinn"]').mask("999999999?999")
  $('input[name="FLOOR"]').mask("9?9")
  $('input[name="TO_FLOOR"]').mask("9?9")

  const $tabs = document.querySelector("[data-headertabs]")

  if ($tabs) {
    $tabs.addEventListener("click", function (e) {
      const el = e.target
      if (el.tagName === "LI") {
        if (!el.classList.contains("active")) {
          let index = Array.from(el.parentNode.children).indexOf(el)

          document.querySelectorAll("[data-headertabs] li").forEach((item) => {
            item.classList.remove("active")
          })
          el.classList.add("active")

          document.querySelectorAll("[data-contenttabs]").forEach((item) => {
            item.classList.remove("active")
          })
          const items = Array.from(
            document.querySelector("[data-tabswrapper]").children
          )
          items[index].classList.add("active")
        }
      }
    })
  }

  $(".pagefilterbtn").on("click", function (e) {
    e.preventDefault()

    $(this).closest(".pagefilter").toggleClass("active")

    $(this).closest(".pagefilter").find(".pagefilterbtn__hidden").slideToggle()
  })

  $("[data-toggleclick]").on("click", function (e) {
    $(this).toggleClass("active")
    e.preventDefault()
    let dropdown = $(this).data("toggleclick")
    $("[data-toggle].active")
      .not($(`[data-toggle=${dropdown}]`))
      .removeClass("active")
    $("[data-toggleclick].active")
      .not($(`[data-toggleclick=${dropdown}]`))
      .removeClass("active")
    $(`[data-toggle=${dropdown}]`).toggleClass("active")
    $(`[data-toggleactive=${dropdown}]`).toggleClass("active")
  })
  $("[data-togglevalue]").on("click", function (e) {
    e.preventDefault()
    $(this).toggleClass("active")
    // get value
    let val = $(this).data("togglevalue")

    // get wrapper leement
    const $wrapper = $(this).closest("[data-toggleitem]")
    // get dropdown ID
    let id = $wrapper.data("toggleitem")
    // close dropdown
    $(`[data-toggle=${id}]`).toggleClass("active")
    // set value
    $(`[data-value=${id}]`).text(val)
    $(`[data-inputvalue=${id}]`).val(val)

    if ($(this).data("togglevalue2")) {
      let val2 = $(this).data("togglevalue2")
      $(`[data-value2=${id}]`).text(val2)
    }
  })
  $("[data-toggletermid]").on("click", function (e) {
    e.preventDefault()
    $(this).toggleClass("active")
    // get value
    let terminalid = $(this).data("toggletermid")
    let terminalname = $(this).data("toggletermname")
    let terminaltime = $(this).data("toggletermtime")

    // get wrapper leement
    const $wrapper = $(this).closest("[data-toggleitem]")
    // get dropdown ID
    let id = $wrapper.data("toggleitem")
    // close dropdown
    $(`[data-toggle=${id}]`).toggleClass("active")
    // set value
    $wrapper.find(`[data-value=${id}]`).text(terminalid + ' ' + terminalname)
    $wrapper.find(`[data-value2=${id}]`).text(terminaltime)
    $wrapper.find(`[data-input="ternimalid"]`).val(terminalid)
    $wrapper.find(`[data-input="ternimalname"]`).val(terminalname)
    

    
  })

  $("[data-toggleclickset]").on("click", function (e) {
    $(this).toggleClass("active")
    e.preventDefault()
    let dropdown = $(this).data("toggleclickset")
    let wrapper = $(this).closest(`[data-toggleitem]`)
    $("[data-toggleitem].active").not(wrapper).removeClass("active")
    $("[data-toggle].active")
      .not(wrapper.find(`[data-toggle=${dropdown}]`))
      .removeClass("active")
    $("[data-toggleclickset].active")
      .not(wrapper.find(`[data-toggleclickset=${dropdown}]`))
      .removeClass("active")
    wrapper.addClass("active")
    wrapper.find(`[data-toggle=${dropdown}]`).toggleClass("active")
    $(`[data-toggleactive=${dropdown}]`).toggleClass("active")
  })

  document.querySelectorAll('[data-toggle="password"]').forEach((item) => {
    item.addEventListener("click", (event) => {
      let inp = item.previousElementSibling
      if (inp.type === "password") {
        inp.type = "text"
      } else {
        inp.type = "password"
      }
    })
  })

  $("a.scrollTo").click(function () {
    var destination = $($(this).attr("href")).offset().top - 30
    $("html:not(:animated),body:not(:animated)").animate(
      {
        scrollTop: destination,
      },
      1100
    )
    return false
  })

  $("[data-menutoggle]").on("click", function (e) {
    e.preventDefault()
    let menu = $(this).data("menutoggle")
    $(`[data-menu=${menu}]`).toggleClass("active")
    $(this).toggleClass("active")
    $(".jsbackdrop").toggleClass("active")
    $("body").toggleClass("expmenu")
  })

  $(".jsbackdrop").on("click", function (e) {
    $(this).removeClass("active")
    $("[data-menu]").removeClass("active")
    $("[data-menutoggle]").removeClass("active")
  })

  $("input[type=tel]").mask("7 (999) 999-99-99")

  $("[data-toggle='popup']").on("click", function (e) {
    const target = $(this).attr("href")
    $(target).addClass("active")
    $(".jsbackdrop").addClass("active")
  })
  $("[data-dismiss='popup']").on("click", function (e) {
    const target = $(this).closest(".popup")
    $(target).removeClass("active")
    $(".jsbackdrop").removeClass("active")
  })

  $('[data-entity="city-autocomplete"]').on("keyup", function () {
    let timeout = 0
    let val = $(this).val()
    /*   val = val.replace(/\D/g, ""); */
    if (val.length >= 3) {
      var url =
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address"
      var token = "72536b22937ea398d010960a0631dcdf2316cc6b"

      var options = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({ query: val, count: 11 }),
      }

      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        $(".sgstlist").remove()

        fetch(url, options)
          .then((response) => response.text())
          .then((result) => {
            const datatype = $(this).attr("data-dadatatype")
            const items = JSON.parse(result).suggestions
            console.log(items)
            const $wrapper = $(this).closest("div")
            $wrapper.html()
            $wrapper.addClass("relative")

            if (items.length < 1) {
              $wrapper.append(`
                <div class="sgstlist">
                  <div class="sgstlist__item">Ничего не найдено</div>
                </div>
                `)

              return
            }

            let list = ""
            let showdata = ""
            

            items.forEach((item) => {
              showinfo = ""
              showdata = item.value.replace(/"/g, "").replace(/'/g, "")
              cityid = item.data.city_kladr_id
             

              list += `<div 
                    class="sgstlist__item" 
                    data-suggcity="${showdata}" data-suggcityId=${cityid}>
                      <span class="sgstlist__name">${showdata}</span>                   
                     
                  </div>`
            })

           
            $wrapper.append(`
                <div class="sgstlist">
                  <div class="sgstlist__title">Выберите вариант или продолжите ввод</div>
                  <div class="sgstlist__items">${list}</div>
                </div>
                `)
          })
          /*  .then(result => setInnInfo(result.length)) */
          .catch((error) => console.log("error", error))
      }, 1000)
    }
  })

  $("[data-dadata='org']").on("keyup", function () {
    let timeout = 0
    let val = $(this).val()
    /*   val = val.replace(/\D/g, ""); */
    if (val.length >= 3) {
      var url =
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party"
      var token = "72536b22937ea398d010960a0631dcdf2316cc6b"

      var options = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + token,
        },
        body: JSON.stringify({ query: val, count: 11 }),
      }

      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        $(".sgstlist").remove()

        fetch(url, options)
          .then((response) => response.text())
          .then((result) => {
            const datatype = $(this).attr("data-dadatatype")
            const items = JSON.parse(result).suggestions
            console.log(items)
            const $wrapper = $(this).closest("div")
            $wrapper.html()
            $wrapper.addClass("relative")

            if (items.length < 1) {
              $wrapper.append(`
                <div class="sgstlist">
                  <div class="sgstlist__item">Ничего не найдено</div>
                </div>
                `)

              return
            }

            let list = ""
            let showdata = ""
            let related = ""
            let showinfo = ""
            let compname = ""
            let kpp = ""
            let compform = ""

            items.forEach((item) => {
              showinfo = ""
              showdata = item.value.replace(/"/g, "").replace(/'/g, "")
              related = item.data.inn.replace(/"/g, "").replace(/'/g, "")

              if (item.data.inn) {
                showinfo += item.data.inn.replace(/"/g, "").replace(/'/g, "")
              }
              if (item.data.address) {
                showinfo +=
                  " " +
                  item.data.address.value.replace(/"/g, "").replace(/'/g, "")
              }

              if (item.data.kpp) {
                kpp = item.data.kpp.replace(/"/g, "").replace(/'/g, "")
              }
              if (item.data.opf) {
                compform = item.data.opf.short
                  .replace(/"/g, "")
                  .replace(/'/g, "")
              }

              compname = item.value.replace(/"/g, "").replace(/'/g, "")

              if (datatype === "inn") {
                showdata = item.data.inn.replace(/"/g, "").replace(/'/g, "")
                related = item.value.replace(/"/g, "").replace(/'/g, "")
              }
              list += `<div 
                    class="sgstlist__item" 
                    data-suggvalue="${showdata}" data-suggrelated="${related}" data-suggkpp="${kpp}" data-suggform="${compform}" data-compname="${compname}">
                      <span class="sgstlist__name">${compname}</span>
                      <span class="sgstlist__info">${showinfo}</span>
                      
                     
                  </div>`
            })

            /* if (items.length >= 11) {
                list += `
                    <div class="sgstlist__item sgstlist__item_warn"></div>
                  `
              } */

            $wrapper.append(`
                <div class="sgstlist">
                  <div class="sgstlist__title">Выберите вариант или продолжите ввод</div>
                  <div class="sgstlist__items">${list}</div>
                </div>
                `)
          })
          /*  .then(result => setInnInfo(result.length)) */
          .catch((error) => console.log("error", error))
      }, 1000)
    }
  })

  $(document).on("click", "[data-suggcityId]", function (e) {
    const source = $(this)
    const $input = source
    .closest("[data-datatawrapper]")
    .find("input")
    const $idinput = source
    .closest("[data-datatawrapper]")
    .find('[data-entity="city-kladr-id"]')

    const value = source.attr("data-suggcityId")
    const name = source.attr("data-suggcity").replace(/"/g, "")

    $idinput.val(value)
    $input.val(name)
    $(".sgstlist").remove()
  })
  $(document).on("click", "[data-suggvalue]", function (e) {
    const source = $(this)
    const $name = source
      .closest("[data-datatawrapper]")
      .find("[data-dadata='name']")
    const $kpp = source
      .closest("[data-datatawrapper]")
      .find("[data-dadata='kpp']")
    const $short = source
      .closest("[data-datatawrapper]")
      .find("[data-dadata='short']")
    /*  const related = source
        .closest(".relative")
        .find("[data-dadata]")
        .not(this) */
    const name = source.attr("data-compname").replace(/"/g, "")
    const kpp = source.attr("data-suggkpp").replace(/"/g, "")
    const short = source.attr("data-suggform").replace(/"/g, "")
    $(".sgstlist").remove()

    $name.val(name).attr("value", name)
    $kpp.val(kpp).attr("value", kpp)
    $short.text(short).attr("value", short)

    console.log($name)
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