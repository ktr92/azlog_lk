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

$(document).ready(function () {

  (jQuery)
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

  $('.inputhints a').on('click', function(e) {
    e.preventDefault()
    const val = $(this).text()
    $(this).closest('[data-wrapper]').find('input').val(val)
  })
 
  $('.checkblock input').on("change", function (e) {
    const label = $(this).closest('.checkblock').find('[data-dependon]')
    if ($(this).is(':checked')) {
      label.text("Активирован")
    } else {
      label.text("Отключен")
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
            ${count}
          </div>
          <div class="calcobject__input floating">
            <div class="floating">
              <input data-inputid="boxvolume_${count}" data-new-box=${count} type="text" name='boxVolume[]' value='' onkeyup="this.setAttribute('value', this.value);" data-volume-format=""> 
              <span class="floating-label">Обьем<span class="red">*</span></span>
            </div>
          </div>
          <div class="calcobject__input">
            <div class="floating">
              <input data-inputid="boxweight_${count}" data-new-box=${count} type="text" name='boxWeight[]' value='' onkeyup="this.setAttribute('value', this.value);" data-weight-format=""> 
              <span class="floating-label">Вес места<span class="red">*</span></span>
            </div>
          </div>
          <div class="calcobject__input">
            <div class="floating">
              <input data-inputid="boxcount_${count}" data-new-box=${count} type="text" name='boxCount[]' name='volume_1' value='' onkeyup="this.setAttribute('value', this.value);" data-number-format=""> 
              <span class="floating-label">Одинаковых мест </span>
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
      const $boxid = $(this).closest('[data-box]')
      $boxid.remove()

      $('.calcobject__number').each(function(index) {
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
  $('input[data-stepdata="send_inn"]').mask("999999999?999")
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
})

window.addEventListener("load", function () {
  initFE()
})
