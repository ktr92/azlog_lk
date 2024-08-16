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
