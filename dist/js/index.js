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
  closeByClickOutside(
    '[data-toggle="select-time-day1"]',
    '[data-toggleclick="select-time-day1"]'
  )
  closeByClickOutside(
    '[data-toggle="send_terminal"]',
    '[data-toggleclick="send_terminal"]'
  )
  closeByClickOutside(
    '[data-toggle="receive_terminal"]',
    '[data-toggleclick="receive_terminal"]'
  )
  closeByClickOutside('[data-toggle="dop"]', '[data-toggleclick="dop"]')
  closeByClickOutside('[data-toggle="dop2"]', '[data-toggleclick="dop2"]')
  closeByClickOutside(".popup", '[data-toggle="popup"]')
}

function closeByClickOutside(element, button) {
  $(document).click(function (event) {
    if (!$(event.target).closest(`${element},${button}`).length) {
      $(button).removeClass("active")
      $(element).removeClass("active")
      $(element).closest("[data-toggleitem]").removeClass("active")
    }
  })

  $(document).keyup(function (e) {
    if (e.key === "Escape") {
      // escape key maps to keycode `27`
      $(button).removeClass("active")
      $(element).removeClass("active")
      $(element).closest("[data-toggleitem]").removeClass("active")

    }
  })
}

$(document).ready(function () {

  $( ".modal:not(#popup_edit2)" ).on('shown.bs.modal', function(){
    $(`[data-modalcontent].mobactive`).removeClass("mobactive").removeClass("active")
});

  $('.signout_close').on('click', function(e) {
    $('[data-toggle="accountmenu"]').removeClass('active')
  })

  $(document).on("click", ".modal-backdrop", function (e) {
    $(".modal").modal("hide")
    
  })

  $("[data-modaltab]").on("click", function (e) {
    e.preventDefault()
    e.stopPropagation()
    const tab = $(this).attr("data-modaltab")
    const $wrapper = $(this).closest("[data-tabswrapper]")
    $wrapper.find(`.active`).removeClass("active")
    $wrapper.find(`.mobactive`).removeClass("mobactive")
    $wrapper.find(`[data-modalcontent=${tab}]`).addClass("active")
    $wrapper.find(`[data-modalcontent=${tab}]`).addClass("mobactive")
    $wrapper.find(`[data-tabsmenumain]`).addClass("menuactive")
    $wrapper.find(`[data-tabsmenu]`).addClass("menuactive")
    $(this).addClass("active")
    $(this).addClass("mobactive")
  })
  $("[data-menuback]").on("click", function (e) {
    e.preventDefault()
    e.stopPropagation()
    const $wrapper = $(this).closest("[data-tabswrapper]")
    $wrapper.find(`.active`).removeClass("active")
    $wrapper.find(`.mobactive`).removeClass("mobactive")
    $wrapper.find(`.menuactive`).removeClass("menuactive")
  })
  $("[data-actionid][data-toggle='modal']").on("click", function (e) {
    const tab = $(this).attr("data-actionid")
    $(`[data-modalcontent].mobactive`).removeClass("mobactive")
    $(`[data-modalcontent=${tab}]`).addClass("mobactive")
    $(`[data-modalcontent].active`).removeClass("active")
    $(`[data-modalcontent=${tab}]`).addClass("active")
    $(`[data-modaltab].mobactive`).removeClass("mobactive")
    $(`[data-modaltab=${tab}]`).addClass("mobactive")
    $(`[data-modaltab].active`).removeClass("active")
    $(`[data-modaltab=${tab}]`).addClass("active").trigger('click')
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
      })
    })
  })(jQuery)

  

  $('[data-action="newtel"]').on("click", function (e) {
    e.preventDefault()
    $(this).siblings(".newtel").append(`
      <div class="floating">
        <span class="removetel"><img src="img/modalclose.svg" alt="" ></span>
        <input type="tel" name="R_F_PHONE[]" data-stepdata="receive_tel"
          data-steptype="source" data-required="required" data-min="18" data-max="18" onkeyup="this.setAttribute('value', this.value);" value="">
        <span class="floating-label">Телефон</span></span>
      </div>
      `)

    $('.removetel').on('click', function(e) {
      $('.removetel').closest('.formblock__col').find('[data-click="newtel"]').show()

      $(e.target).closest('.floating').remove()
    })
 

    $('input[type="tel"]')
      .focus(function () {
        $(this).setCursorPosition(3)
      })
      .mask("+7 (999) 999-99-99")
  })



  $('[data-click="newtel"]').on("click", function (e) {
    $(this).hide()
    $(this).siblings(".tel2").addClass("active").show()
    $('.removetel').on('click', function(e) {
      $('.removetel').closest('.formblock__col').find('[data-click="newtel"]').show()

      $(e.target).closest('.tel2').hide()
    })
  })

  $(".modal [name=F_DOCTYPE]").on("change", function () {
    if ($(this).val() !== "Паспорт РФ") {
      $("[name=F_PASS_1]").hide()
    } else {
      $("[name=F_PASS_1]").show()
    }
  })
  $(".calcform__inputs [name=R_F_DOCTYPE]").on("change", function () {
    if ($(this).val() !== "Паспорт РФ") {
      $(this).closest('.stepform__row').find("[name=R_F_PASS_1]").closest('.floating').hide()
    } else {
      $(this).closest('.stepform__row').find("[name=R_F_PASS_1]").closest('.floating').show()
    }
  })
  $(".calcform__inputs [name=F_DOCTYPE]").on("change", function () {
    if ($(this).val() !== "Паспорт РФ") {
      $(this).closest('.stepform__row').find("[name=F_PASS_1]").closest('.floating').hide()
    } else {
      $(this).closest('.stepform__row').find("[name=F_PASS_1]").closest('.floating').show()
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
  $('input[data-stepdata="dop_floor"]').mask("9?9")
  $('input[data-stepdata="dop_dost_floor"]').mask("9?9")
  /*   $('input[name="FLOOR"]').mask("9?9") */
  /*  $('input[name="TO_FLOOR"]').mask("9?9") */

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
    $(this).closest("[data-toggleitem]").addClass('active')
    e.preventDefault()
    let dropdown = $(this).data("toggleclick")
    $("[data-toggle].active")
      .not($(`[data-toggle=${dropdown}]`))
      .removeClass("active")
    $("[data-toggleclick].active")
      .not($(`[data-toggleclick=${dropdown}]`))
      .removeClass("active")
    $("[data-toggleitem].active")
      .not($(`[data-toggleitem=${dropdown}]`))
      .removeClass("active")
    $(`[data-toggle=${dropdown}]`).toggleClass("active")
    $(`[data-toggleactive=${dropdown}]`).toggleClass("active")
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

  $("[data-popup]").on("click", function (e) {
    e.preventDefault()
    let id = $(this).data("popup")
    $(`[data-aside=${id}]`).toggleClass("active")
    $(this).toggleClass("active")
    $(".jsbackdrop").toggleClass("active")
    $("body").toggleClass("expmenu")
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
    $("[data-aside]").removeClass("active")
    $("[data-popup]").removeClass("active")
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
