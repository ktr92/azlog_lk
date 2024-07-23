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

function lazyLoadSrc(selector) {
  const callback = (entries, observer) => {
    entries.forEach(entry => {
      const source = entry.target
      if (entry.intersectionRatio > 0) {
        if (!source.getAttribute('src')) {
            source.setAttribute('src', source.dataset.src)
            observer.unobserve(source)
        }
      }
    })
  }
  const target = document.querySelectorAll(selector)
  const options = {
    threshold: 0.4
  }
  let obs = new IntersectionObserver(callback, options)
  target.forEach(item => {
    obs.observe(item)
  }) 
}

$(document).ready(function () {
  new WOW().init();

  
document.querySelectorAll('.dropdown').forEach(function (item) {
  item.addEventListener('click', event => {

    if (event.target.classList.contains('dropdown__label')) {
      if (item.querySelector('.dropdown__menu').classList.contains('active')) {
        item.querySelector('.dropdown__menu').classList.remove('active')
        item.querySelector('.dropdown__label').classList.remove('active')
      } else {
        item.querySelector('.dropdown__menu').classList.add('active')
        event.target.classList.add('active')
      }

    } else if (event.target.tagName.toLowerCase() == 'li') {
      if (item.querySelector('li.selected')) {
        item.querySelector('li.selected').classList.remove('selected')
      }

      event.target.classList.add('selected')
      item.querySelector('.dropdown__label').classList.remove('active')
      item.querySelector('.dropdown__label').textContent = event.target.textContent
      item.querySelector('.dropdown_value').value = event.target.textContent
      item.querySelector('.dropdown__menu').classList.remove('active')
    }
  })
})



window.onclick = function (event) {
  var dropdown = document.querySelectorAll('.dropdown__label.active')
  dropdown.forEach(function (drop) {
    if (event.target != drop) {
      document.querySelectorAll('.dropdown__menu.active').forEach(function (item) {
        item.classList.remove('active')
      })
      document.querySelectorAll('.dropdown__label.active').forEach(function (item) {
        item.classList.remove('active')
      })
    }





  })
}

$(".fileupload input[type=file]").change(function()	{		
  if (this.files[0]) {
    var filename = $(this).val().replace(/.*\\/, ""); 
    /* $(this).siblings('span').empty(); */
    $(this).closest('.fileupload').find('.filename').remove()
    $(this).closest('.fileupload').append('<span class="filename"> ' + filename + ' ' + ' </span>');
    $('.file-error').html("");
    $('.file-upload span').css('text-transform', 'none');
    $('.changefile').css('display', 'block');
  }
  });

  $('.headerlogo').on('click', function(e) {
    $(this).toggleClass('active')
  })

  function initSlider(selector, count, fade, nav, left, right, resp) {
    var $status = $(nav);
    var $slickElement = $(selector);
  
    $slickElement.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
      // no dots -> no slides
      if(!slick.$dots){
        return;
      }
      
      //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
      var i = (currentSlide ? currentSlide : 0) + 1;
      // use dots to get some count information
      $status.html('<span class="pagingInfo_active">' + i + '</span>' + '<span class="pagingInfo_default">' + '/ ' +  (slick.$dots[0].children.length) + '</span>');
    });
  
    $slickElement.slick({
      infinite: false,
      slidesToShow: count,
      slidesToScroll: 1,
      autoplay: false,
      fade: fade,
      dots: true,
       prevArrow: left,
      nextArrow: right,
      responsive: resp
    });
  };

  initSlider('.projects__slider', 1, true, '.pagingInfo', '.projects__left', '.projects__right')
  initSlider('.reviews__slider', 2, false, '.pagingInfo_reviews', '.reviews__left', '.reviews__right', [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true
      }
    }
  ])


 

 /*  $('.projects__slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    infinite: false,
    prevArrow: '.projects__left',
    nextArrow: '.projects__right'
  }); */

  var something = (function () {
    var executed = false
    return function () {
      if (!executed) {
        executed = true
        $(".stats__number span").each(function () {
          $(this)
            .prop("Counter", 0)
            .animate(
              {
                Counter: $(this).text(),
              },
              {
                duration: 2000,
                easing: "swing",
                step: function (now) {
                  $(this).text(Math.ceil(now))
                },
              }
            )
        })
      }
    }
  })()

  $(window).scroll(function () {
    if ($(".stats").length) {
      var top_of_element = $(".stats").offset().top
      var bottom_of_element =
        $(".stats").offset().top + $(".stats").outerHeight()
      var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight()
      var top_of_screen = $(window).scrollTop()

      if (
        bottom_of_screen > top_of_element &&
        top_of_screen < bottom_of_element
      ) {
        something()
      }
    }
  })


  $('#demo').gradient({
    colors: ['#0CC4FB', '#2295F8', '#2858E4', '#193FAB']
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
    $(this).removeClass("active");
    $("[data-menu]").removeClass("active");
    $("[data-menutoggle]").removeClass("active");
    $("body").toggleClass("expmenu");
  });


 
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

document.addEventListener('DOMContentLoaded', function() {
  lazyLoadSrc('img');
  lazyLoadSrc('iframe');
})
