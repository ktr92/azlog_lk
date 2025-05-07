const app = (function () {
  "use strict"

  let currentStep = 1
  let formJson
  let ddInit = false

  $(function () {
    $("input[name='quantity']").on("change", function (e) {
      if (!$(this).val() || $(this).val() < 1) {
        $(this).val(1)
      }
    })
  })

  const state = {
    isdefault: false,
    from: '',
    to: ''
  }

  const termSelect = () => {
    jQuery(document).on('click', '.dropdownJS__label', function (e) {
      e.preventDefault()
      jQuery(this).closest('.dropdownJS').toggleClass('open')
    })
    jQuery(document).on("click", ".dropdownJS__menu li", function (e) {
      e.preventDefault()
      const $element = jQuery(this)
      const $wrapper = $element.closest('.dropdownJS')
      let termname = $element.attr('data-name')
      let termid = $element.attr('data-id')
      let termtime = $element.attr('data-time')

      $wrapper.addClass('selected')
      $wrapper.find('.dropdownJS__label .dropdownJS__text1').text(termname).attr('data-ternimalresult', termname)
      $wrapper.find('.dropdownJS__label .dropdownJS__text2-value').text(termtime)
      $wrapper.find('.dropdownJS__label .dropdownJS__text1').attr('data-ternimalresult_id', termid)
      $wrapper.find('.terminal-name').val(termname)
      $wrapper.find('.terminal-id').val(termid)
      $wrapper.removeClass('open')

        if (state.from !==  $('input[name="terminal-from-id"]').val() || state.to !==  $('input[name="terminal-to-id"]').val()) {
            calcDelivery()
        }

    })
  }

  const setDefaultTerminal = () => {
    const sendTerm = $(
      '[data-stepvisible="send_terminal"] .dropdownJS__menu li:first'
    )
    if (sendTerm && sendTerm.length) {
      sendTerm.trigger("click")
    }
    const recTerm = $(
      '[data-stepvisible="receive_terminal"] .dropdownJS__menu li:first'
    )

    if (recTerm && recTerm.length) {
      recTerm.trigger("click")
    }

  }

  const dateInit = (disabledDays = []) => {
    // 0 = ВС, 1 = ПН, 2 = ВТ, 3 = СР, 4 = ЧТ, 5 = ПТ, 6 = СБ
    $(".js-datepicker").each(function () {
      $(this).datepicker().data("datepicker").destroy()
      $(this).datepicker({
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
    })
  }

  class Dropdown {
    constructor(selector) {
      /* this.$el = document.querySelector(selector) */
      this.$el = selector
      this.items = []
      var forItems = Array.from(this.$el.querySelectorAll("li"))
      forItems.forEach(
        function (item) {
          var itemsList = {}
          itemsList.name = item.dataset.name || ""
          itemsList.time = item.dataset.time || ""
          itemsList.summ = item.dataset.summ || ""
          itemsList.id = item.dataset.id || ""

          this.items.push(itemsList)
        }.bind(this)
      )

      /*    this.$el.querySelector('.dropdownJS__label .dropdownJS__text1').textContent = this.items[0].name
                              this.$el.querySelector('.dropdownJS__label .dropdownJS__text2-value').textContent = this.items[0].time
                              this.$el.querySelector('.dropdownJS__label .dropdownJS__text3').textContent = this.items[0].summ
                              this.$el.querySelector('.dropdownJS__label .terminal-id').value = this.items[0].id
                              this.$el.querySelector('.dropdownJS__label .terminal-name').value = this.items[0].name; */

      this.$el
        .querySelector(".dropdownJS__label")
        .addEventListener("click", (event) => {
          if (this.$el.classList.contains("open")) {
            this.close()
          } else {
            this.open()
          }
        })

      this.$el.querySelectorAll("li").forEach(
        function (event) {
          event.addEventListener(
            "click",
            function (el) {
              this.select(el.currentTarget.dataset.id)
            }.bind(this)
          )
        }.bind(this)
      )
    }

    select(id) {
      const item = this.items.find((i) => i.id === id)
      /*  console.log(item) */
      this.$el.querySelector(
        ".dropdownJS__label .dropdownJS__text1"
      ).textContent = item.name
      this.$el.querySelector(
        ".dropdownJS__label .dropdownJS__text2-value"
      ).textContent = item.time
      this.$el.querySelector(
        ".dropdownJS__label .dropdownJS__text3"
      ).textContent = item.summ

      this.$el.querySelector(".dropdownJS__label .terminal-id").value = item.id
      this.$el.querySelector(".dropdownJS__label .terminal-name").value =
        item.name
      this.close()
      //костыль для выбора термимнала
      calcDelivery()
    }

    open() {
      this.$el.classList.add("open")
    }

    close() {
      this.$el.classList.remove("open")
    }
  }

  const selectLetter = () => {
    $(document).on("click", ".js-select-letter", function (e) {
      e.preventDefault()
      const $link = $(this)
      $(".ways__link").removeClass("active")
      $link.parent(".ways__link").addClass("active")
      $.post(
        "/local/ajax/way.byletter.php",
        {
          BLOCK_ID: $link.data("id"),
          LETTER: $link.data("letter"),
        },
        function (result) {
          $(".js-ways-content").replaceWith(result)
        }
      )
    })

    $('[data-entity="show-letter"]').on("click", function (e) {
      e.preventDefault()
      const $link = $(this),
        letter = $link.data("letter")

      $(".ways__link").removeClass("active")
      $link.parent(".ways__link").addClass("active")

      $(".js-ways-content").hide()
      $('.js-ways-content[data-letter="' + letter + '"]').show()
    })
  }

  const dadataAutocomplete = () => {
    const url =
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address"
    //автодополнение

    let timeout = 0

    $('[data-entity="city-autocomplete"]').on("keyup", function () {
      const query = $(this).val()
      const resultContainer = $(this)
        .parent(".inputLocation")
        .find(".cityListContainer")

      // resultContainer.remove();
      var options = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + dadataKey,
        },
        body: JSON.stringify({
          query: query,
        }),
      }

      if (!$(this).data("full")) {
        options = {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Token " + dadataKey,
          },
          body: JSON.stringify({
            query: query,
            from_bound: { value: "city" },
            to_bound: { value: "settlement" },
          }),
        }
      }

      console.log(options)

      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        fetch(url, options)
          .then((response) => response.text())
          .then((result) =>
            resultContainer
              .html(makeDropDownList($.parseJSON(result)))
              .parent()
              .show()
          )
          .catch((error) => console.log("error", error))
      }, 2000)
    })

    //выбор города
    $(document).on(
      "click",
      '[data-entity="city-autocomplete-select"]',
      function (e) {
        e.preventDefault()

        const tp = new Promise((res, rej) => {
          const $link = $(this),
            kladrId = $link.data("kladr-id"),
            city = $link.text(),
            $parent = $(this).parents(".inputLocation")

          if ($parent.find('[name="to"]').length) {
            $('[name="toAddress"]').val("")
            $('[name="delivery-address"]').val("")
            $('[name="delivery-city"]').val("")
          } else {
            $('[name="fromAddress"]').val("")
            $('[name="pickup-address"]').val("")
            $('[name="pickup-city"]').val("")
          }

          $parent.find('[data-entity="city-autocomplete"]').val(city)
          $parent
            .find('[data-entity="city-kladr-id"]')
            .val(kladrId)
            .trigger("change")
          $parent.find(".cityListContainer").html("")
          $parent.find(".cityList").hide()

          res()
        })

        tp.then((value) => {
          setDefaultTerminal()
        })

        /*  ddInit = false */
      }
    )

    $('[data-entity="fulladdress-autocomplete"]').on("keyup", function () {
      const query = $(this).val()
      const resultContainer = $(this)
        .parent(".inputLocation")
        .find(".cityListContainer")
      let city = $('[name="from"]').val()
      if ($(this).attr("name") == "toAddress") {
        city = $('[name="to"]').val()
      }
      // resultContainer.remove();
      var options = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token " + dadataKey,
        },
        body: JSON.stringify({
          query: query,
          // "restrict_value": true,
          locations: [
            {
              kladr_id: city,
            },
          ],
        }),
      }

      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        fetch(url, options)
          .then((response) => response.text())
          .then((result) =>
            resultContainer
              .html(
                makeDropDownList(
                  $.parseJSON(result),
                  "address-autocomplete-select"
                )
              )
              .parent()
              .show()
          )
          .catch((error) => console.log("error", error))
      }, 2000)
    })

    //выбор города
    $(document).on(
      "click",
      '[data-entity="city-autocomplete-select"]',
      function (e) {
        e.preventDefault()
        const tp = new Promise((res, rej) => {
          const $link = $(this),
            kladrId = $link.data("kladr-id"),
            city = $link.text(),
            $parent = $(this).parents(".inputLocation")

          $parent.find('[data-entity="city-autocomplete"]').val(city)
          $parent
            .find('[data-entity="city-kladr-id"]')
            .val(kladrId)
            .trigger("change")
          $parent.find(".cityListContainer").html("")
          $parent.find(".cityList").hide()

          res()
        })

        tp.then((value) => {
          setDefaultTerminal()
        })
      }
    )
    //выбор адреса
    $(document).on(
      "click",
      '[data-entity="address-autocomplete-select"]',
      function (e) {
        e.preventDefault()
        const $link = $(this),
          kladrId = $link.data("kladr-id"),
          cityKladrId = $link.data("city-kladr-id"),
          city = $link.text(),
          $parent = $(this).parents(".inputLocation")

        $parent.find('[data-entity="fulladdress-autocomplete"]').val(city)
        $parent.find('[data-entity="kladr-id"]').val(kladrId).trigger("change")
        $parent
          .find('[data-entity="city-kladr-id"]')
          .val(cityKladrId)
          .trigger("change")
        $parent.find(".cityListContainer").html("")
        $parent.find(".cityList").hide()

        calcDelivery()
      }
    )
  }

  const calcInit = () => {
    $('form[data-entity="calc-form"]').on(
      "change",
      "input:not(.final-form), select:not(.final-form), textarea:not(.final-form)",
      function () {
        calcDelivery()
      }
    )

    $(".calc-test").on("click", function (e) {
      e.preventDefault()
      calcDelivery()
    })

    $('form[data-entity="calc-form"]').on("submit", function (e) {
      if ($(this).prop("action") == "#") {
        e.preventDefault()
      }
    })

    $('[data-entity="submit-form"]').on("click", function (e) {
      e.preventDefault()
      const $form = $(this).parents("form")

      function validateRequired() {
        let valid = true
        valid = validateEmail()
        const required = []
        const $required = $form.find("input[required]")
        $required.each(function () {
          const obj = {
            input: $(this),
            val: $(this).val().toString(),
          }
          required.push(obj)
        })

        required.forEach(function (item) {
          if (item.val.length < 1) {
            valid = false
            item.input.addClass("error")
          } else {
            item.input.removeClass("error")
          }
        })

        if ($(".error").length) {
          $("html, body").animate(
            {
              scrollTop: $(".error").offset().top - 50,
            },
            500
          )
        }

        return valid
      }

      let errorList = []
      $.each($(".calcerrors__text:visible"), function (i, val) {
        errorList.push($(this).text())
      })
      $('[name="ERRORS"]').val(errorList.join(","))

      if (validateRequired()) {
        $.post(
          "/calc/save_notify/index.php",
          $form.serialize(),
          function (result) {
            window.location.href = "/spasibo/"
          }
        )
      }
    })
  }

  const setTerminal = () => {
    $('span[data-stepdata="p_otpravki"]')
      .closest(".dropdownJS")
      .find(".dropdownJS__menu li:first")
      .trigger("click")
    $('span[data-stepdata="p_dostavki"]')
      .closest(".dropdownJS")
      .find(".dropdownJS__menu li:first")
      .trigger("click")
  }

  let isInit = false
  const calcDelivery = () => {
    if (isInit) {
      // return;
    }
    isInit = true

    /* if (!ddInit) { */
    const ddlist = []
    document.querySelectorAll(".dropdownJS").forEach(function (item) {
      if (item.querySelectorAll("li").length > 0) {
        ddlist.push(item)
      } else {
      }
    })

    /*  ddlist.forEach(function (item) {
            new Dropdown(item)
        }) */

    /* } */

    let calForm = $('[data-entity="calc-form"]')
    let disabled = calForm.find(":input:disabled")
    disabled.removeAttr("disabled")
    // serialize the form
    let serialized = calForm.serialize()
    // re-disabled the set of inputs that you previously enabled
    disabled.attr("disabled", "disabled")

    $(document).on("click", ".switches li.disabled", function () {
      $(this).find(".disabled-text").show()
    })
    $(document).on("click", ".formcheckbox__label.disabled", function () {
      $(this).find(".disabled-text").show()
    })

    /*  console.log($('[data-entity="calc-form"]').serialize()) */
    $.post(
      "/local/ajax/calc.php?t=" + Date.now(),
      serialized,
      function (result) {
        formJson = result

        if (result.ENABLED_TEPLO) {
          $('[data-entity="teplo-checkbox"]').removeClass("disabled")
          $('[data-entity="teplo-checkbox"]')
            .find("input")
            .prop("disabled", false)
            .attr("disabled", false)
          $('[data-entity="teplo-checkbox"]').find(".disabled-text").hide()
        } else {
          $('[data-entity="teplo-checkbox"] input').prop("checked", false)

          $('[data-entity="teplo-checkbox"]').addClass("disabled")
          $('[data-entity="doc-checkbox"]').find(".disabled-text").hide()
          /*   $('[data-entity="teplo-checkbox"]').find('.disabled-text').show(); */
          $('[data-entity="teplo-checkbox"]')
            .find("input")
            .prop("disabled", "disabled")
            .attr("disabled", "disabled")
        }

        if (result.ENABLED_DOCS) {
          $('[data-entity="doc-checkbox"] input').prop("checked", false)

          $('[data-entity="doc-checkbox"]').removeClass("disabled")
          $('[data-entity="doc-checkbox"]')
            .find("input")
            .prop("disabled", false)
            .attr("disabled", false)
          $('[data-entity="doc-checkbox"]').find(".disabled-text").hide()
        } else {
          $('[data-entity="doc-checkbox"]').addClass("disabled")
          $('[data-entity="doc-checkbox"]').find(".disabled-text").hide()
          /*   $('[data-entity="doc-checkbox"]').find('.disabled-text').show(); */
          $('[data-entity="doc-checkbox"]')
            .find("input")
            .prop("disabled", "disabled")
            .attr("disabled", "disabled")
        }

        $(".debug-result").html(JSON.stringify(result, null, 2))

        // console.log(result.PRICE);
        $(".step-5").hide()
        if (result.PRICE && result.PRICE.PRICE !== null) {
          $(".step-0").hide()
          $(".step-1").show()
          $(".step-3").show()
          $("#auto-price").html(result.PRICE.PRICE_PRINT)
          $("#auto-name").html(result.TERMINAL_TO_FROM)
        } else {
          $(".step-1").hide()
          $(".step-3").hide()
          $(".step-0").show()
        }

        if (result.AUTO && +result.AUTO.DAYS > 0) {
          $("#auto-days").html(result.AUTO.DAYS)
          $('[data-entity="auto-delivery"]').show()
        } else {
          $('[data-entity="auto-delivery"]').hide()
        }

        if (
          result.CONTAINER2 &&
          typeof result.CONTAINER2.DAYS !== null &&
          +result.CONTAINER2.DAYS > 0
        ) {
          $("#container2-days").html(result.CONTAINER2.DAYS)
          $('[data-entity="container2-delivery"]').show()
          $("#container2-delivery-text").show()
        } else {
          // alert('wtf');

          $("#container2-delivery-text").hide()
          $('[data-entity="container2-delivery"]').hide()
        }

        if (
          result.CONTAINER &&
          typeof result.CONTAINER.DAYS !== null &&
          +result.CONTAINER.DAYS > 0
        ) {
          // $('#auto-price').html(result.CONTAINER2.PRICE_PRINT);
          $("#container-days").html(result.CONTAINER.DAYS)
          $('[data-entity="container-delivery"]').show()
        } else {
          $('[data-entity="container-delivery"]').hide()
        }

        if (
          result.EXPRESS &&
          typeof result.EXPRESS.DAYS !== null &&
          +result.EXPRESS.DAYS > 0
        ) {
          // $('#auto-price').html(result.CONTAINER2.PRICE_PRINT);
          $("#express-days").html(result.EXPRESS.DAYS)
          $('[data-entity="express-delivery"]').show()
        } else {
          $('[data-entity="express-delivery"]').hide()
        }

        if (
          result.SUPEREXPRESS &&
          typeof result.SUPEREXPRESS.DAYS !== null &&
          +result.SUPEREXPRESS.DAYS > 0
        ) {
          // $('#auto-price').html(result.CONTAINER2.PRICE_PRINT);
          $("#superexpress-days").html(result.SUPEREXPRESS.DAYS)
          $('[data-entity="superexpress-delivery"]').show()
        } else {
          $('[data-entity="superexpress-delivery"]').hide()
        }

        if (
          result.FERRYBOAT &&
          typeof result.FERRYBOAT.DAYS !== null &&
          +result.FERRYBOAT.DAYS > 0
        ) {
          // $('#auto-price').html(result.CONTAINER2.PRICE_PRINT);
          $("#ferryboat-days").html(result.FERRYBOAT.DAYS)
          $('[data-entity="ferryboat-delivery"]').show()
        } else {
          $('[data-entity="ferryboat-delivery"]').hide()
        }

        $("input[name=delivery-type][value=" + result.DELIVERY_TYPE + "]").prop(
          "checked",
          true
        )

        //страховка
        if (result.INSURANCE) {
          $("#insurance-price").html(result.INSURANCE.PRICE_PRINT)
        }
        //деревянная обрешетка
        if (result.CRATE) {
          $("#crate-price").html(result.CRATE.PRICE_PRINT)
          $("#crate-wrapper").removeAttr("hidden").show()
        } else {
          $("#crate-wrapper").prop("hidden", true).hide()
        }

        //паллетный борт
        if (result.PALET) {
          $("#palet-price").html(result.PALET.PRICE_PRINT)
          $("#palet-wrapper").removeAttr("hidden").show()
        } else {
          $("#palet-wrapper").prop("hidden", true).hide()
        }

        $(".more-service-item").remove()
        if (result.MORE_SERVICE.length > 0) {
          let moreServiceContainer = $('[data-entity="more-service"]')
          $.each(result.MORE_SERVICE, function (i, val) {
            let _html =
              '<li class="more-service-item"><span class="calcprice-params_left"><span><span>' +
              this.NAME +
              "</span></span></span>"
            _html +=
              '<span class="calcprice-params_right">' +
              this.PRICE +
              "</span></li>"
            moreServiceContainer.append(_html)
          })
        }
        $(".from-service-item").remove()
        if (result.FROM_SERVICE.length > 0) {
          let fromServiceContainer = $('[data-entity="from-service"]')
          $.each(result.FROM_SERVICE, function (i, val) {
            let _html =
              '<li class="from-service-item"><span class="calcprice-params_left"><span><span>' +
              this.NAME +
              "</span></span></span>"
            _html +=
              '<span class="calcprice-params_right">' +
              this.PRICE +
              "</span></li>"
            fromServiceContainer.append(_html)
          })
        }

        if (result.NOTICE) {
          let fromServiceContainer = $('[data-entity="notice"]')
          $(".notice-service-item").remove()
          $.each(result.NOTICE, function (i, val) {
            if (typeof this.NAME !== "undefined") {
              let _html =
                '<li class="notice-service-item"><span class="calcprice-params_left"><span><span>' +
                this.NAME +
                "</span></span></span>"
              _html +=
                '<span class="calcprice-params_right">' +
                this.PRICE +
                "</span></li>"
              fromServiceContainer.append(_html)
            }
          })
          $('[data-step="notice"]').show()
        } else {
          $('[data-step="notice"]').hide()
        }

        $(".to-service-item").remove()
        if (result.TO_SERVICE && result.TO_SERVICE.length > 0) {
          let toServiceContainer = $('[data-entity="to-service"]')
          $.each(result.TO_SERVICE, function (i, val) {
            let _html =
              '<li class="to-service-item"><span class="calcprice-params_left"><span><span>' +
              this.NAME +
              "</span></span></span>"
            _html +=
              '<span class="calcprice-params_right">' +
              this.PRICE +
              "</span></li>"
            toServiceContainer.append(_html)
          })
        }

        //терминалы для выбора
        if (result.TERMINALS) {
          let $terminalList = $('[data-entity="ternimal-list"]')
          $terminalList.html("")

          //Тут должны быть терминалы
          $.each(result.TERMINALS, function (i, val) {
            let summ = ""
            if (this.WEIGHT > 0 || this.VOLUME > 0) {
              summ += "При отправке: "
              if (this.VOLUME > 0) {
                summ += " +" + this.WEIGHT + " Р/кг"
              }
              if (this.WEIGHT > 0 && this.VOLUME > 0) {
                summ += " или "
              }
              if (this.VOLUME > 0) {
                summ += " +" + this.VOLUME + " Р/м3"
              }
            }

            let _html =
              '<li data-name="' +
              this.FullAdress +
              '" data-time="10:00 - 19:00"\n' +
              'data-id="' +
              this.ID +
              '" data-summ="' +
              summ +
              '">\n' +
              '<span class="dropdownJS__text1">' +
              this.FullAdress +
              "</span>\n" +
              '<span class="dropdownJS__text3">График работы: 10:00 - 19:00</span>\n'

            /*   if (this.WEIGHT > 0 || this.VOLUME > 0) {
                                        _html += '<span class="dropdownJS__text2">При отправке: +';
                                        if (this.VOLUME  > 0) {
                                            _html += this.WEIGHT + 'Р/кг';
                                        }
                                        if (this.WEIGHT > 0 && this.VOLUME > 0) {
                                            _html += ' или ';
                                        }
                                        if (this.VOLUME  > 0) {
                                            _html += this.VOLUME + 'Р/м3';
                                        }
                                        _html += '</span>\n';
                                    } */
            if (this.WEIGHT > 0 || this.VOLUME > 0) {
              _html += '<span class="dropdownJS__text3">' + summ + "</span>\n"
            }

            _html += "</li>"
            $terminalList.append(_html)
          })
          if (state.from !== result.TERMINALS[0].ID) {
            setDefaultTerminal()
          }
          state.from = result.TERMINALS[0].ID

        }
        if (result.TERMINALS_TO) {
          let $terminalList = $('[data-entity="ternimal-list-to"]')
          $terminalList.html("")
          // alert(1);
          //Тут должны быть терминалы
          $.each(result.TERMINALS_TO, function (i, val) {
            const _html =
              '<li data-name="' +
              this.FullAdress +
              '" data-time="10:00 - 19:00"\n' +
              'data-id="' +
              this.ID +
              '" data-summ="+0 Р">\n' +
              '<span class="dropdownJS__text1">' +
              this.FullAdress +
              "</span>\n" +
              '<span class="dropdownJS__text2">График работы: 10:00 - 19:00</span>\n' +
              "</li>"
            $terminalList.append(_html)
          })

          if (state.to !== result.TERMINALS_TO[0].ID) {
            setDefaultTerminal()
          }
          state.to = result.TERMINALS_TO[0].ID

        }

        //услуги забора груза
        if (result.PICKUP_PRICE) {
          $(".step-2").show()
          $("#pickup-price").html(result.PICKUP_PRICE_PRINT)
        } else {
          $(".step-2").hide()
        }

        //услуги доставки груза
        if (result.DELIVERY_PRICE) {
          $(".step-5").show()
          $("#delivery-price").html(result.DELIVERY_PRICE_PRINT)
        } else {
          $(".step-5").hide()
        }

        if (result.TOTAL) {
          $("#total-price").html(result.TOTAL_PRINT)
        }

        if (result.SHOW_FORM) {
          $('[data-step="order"]').hide()
          $('[data-entity="warning"]').removeClass("hidden")
          $(".step-4").show()
          // $('.step-5').hide();
          // $('.step-1').hide();
          // $('.step-2').hide();
          // $('.step-3').hide();
          if (result.NOTICE && result.NOTICE.length > 0) {
            // $.each(result.NOTICE, function (i, val) {
            //     let _html = this.NAME + ' ' + this.PRICE + '\n';
            //     $('#message-notice').val(_html);
            // })
          }
        } else {
          $('[data-step="order"]').show()
          $('[data-entity="warning"]').addClass("hidden")
          $(".step-4").hide()
        }

        $('[data-entity="errors"]').hide()
        //тепловой режим
        if (result.IS_TEPLO) {
          $('[data-entity="errors"]').show()
          $('[data-entity="teplo"]').show()
        } else {
          $('[data-entity="teplo"]').hide()
        }
        //негабарит
        if (result.IS_OVERSIZE) {
          $('[data-entity="errors"]').show()
          $('[data-entity="oversize"]').show()
        } else {
          $('[data-entity="oversize"]').hide()
        }
        //документы
        if (result.IS_DOCS) {
          $('[data-entity="errors"]').show()
          $('[data-entity="docs"]').show()
        } else {
          $('[data-entity="docs"]').hide()
        }

        if (result.CAN_PICKUP) {
          $('[data-entity="can-pickup"]').hide()
        } else {
          $('[data-entity="errors"]').show()
          $('[data-entity="can-pickup"]').show()
        }

        if (result.CAN_DELIVERY) {
          $('[data-entity="can-delivery"]').hide()
        } else {
          $('[data-entity="errors"]').show()
          $('[data-entity="can-delivery"]').show()
        }

        //согласование
        if (result.SHOW_FORM) {
          $('[data-entity="errors"]').show()
          $('[data-entity="need-contact"]').show()
        } else {
          $('[data-entity="need-contact"]').hide()
        }

        document.querySelectorAll(".dropdownJS").forEach(function (item) {
          if (item.querySelectorAll("li").length > 0) {
            /* new Dropdown(item) */
          }
        })

        /*   if (!ddInit) {
                    setTerminal()
                    ddInit = true
                } else {
                    const prevSend = $(
                        '[data-stepvisible="send_terminal"] .dropdownJS_info > .dropdownJS__text1'
                    ).text()
                    if (
                        !$(
                            `[data-stepvisible="send_terminal"] .dropdownJS__menu:contains(${prevSend})`
                        ).length
                    ) {
                        setTerminal()
                    }
                    const prevReceive = $(
                        '[data-stepvisible="receive_terminal"] .dropdownJS_info > .dropdownJS__text1'
                    ).text()
                    if (
                        !$(
                            `[data-stepvisible="receive_terminal"] .dropdownJS__menu:contains(${prevReceive})`
                        ).length
                    ) {
                        setTerminal()
                    }
                }

                isInit = false */
      },
      "json"
    )

    $(document).on("click", '[data-entity="show-order-form"]', function (e) {
      e.preventDefault()
      alert(1)
      $('[data-step="order"]').hide()
      $('[data-entity="warning"]').addClass("hidden")
      $(".step-4").show()
    })
    $(document).on("change", 'input[name="R_F_LATER"]', function (e) {
      e.preventDefault()
      if ($(this).is(":checked")) {
        $(this)
          .closest(".calcform-js")
          .find('[name="R_F_PASS_1"]')
          .removeAttr("data-required")
        $(this)
          .closest(".calcform-js")
          .find('[name="R_F_PASS_2"]')
          .removeAttr("data-required")
      } else {
        $(this)
          .closest(".calcform-js")
          .find('[name="R_F_PASS_1"]')
          .attr("data-required", "required")
        $(this)
          .closest(".calcform-js")
          .find('[name="R_F_PASS_2"]')
          .attr("data-required", "required")
      }
    })

    /*  $('input[data-stepdata="p_otpravki"]').on('change', function() {
                   if($(this).val() !== '') {
                     $('span[data-stepdata="p_otpravki"]').closest('.dropdownJS').find('.dropdownJS__menu li:first').trigger('click')
                   }
                 })
              */
    /* $('span[data-stepdata="p_otpravki"]').closest('.dropdownJS').find('.dropdownJS__menu li:first').trigger('click')
     */
    /*   $('input[name="sendpointtab"]').on('change', function() {
                    if($(this).val() !== '') {
                      $('span[data-stepdata="p_otpravki"]').closest('.dropdownJS').find('.dropdownJS__menu li:first').trigger('click')
                    }
                  })
                   */
  }

  const makeDropDownList = (data, entity = "city-autocomplete-select") => {
    /*  console.log(data) */
    let _html = ""
    $.each(data.suggestions, function (index, value) {
      _html +=
        '<li><a data-entity="' +
        entity +
        '" href="#" data-city-kladr-id="' +
        value.data.city_kladr_id +
        '" data-kladr-id="' +
        value.data.kladr_id +
        '">' +
        value.value +
        "</a></li>"
    })

    return _html
  }

  const switcher = () => {
    $(".switcher a").on("click", function (e) {
      e.preventDefault()
      let input1 = $("#cityInput1").val()
      let input2 = $("#cityInput2").val()
      $("#cityInput1").val(input2)
      $("#cityInput2").val(input1)

      input1 = $('[name="from"]').val()
      input2 = $('[name="to"]').val()
      $('[name="from"]').val(input2)
      $('[name="to"]').val(input1)
      calcDelivery()
    })
  }

  const moreService = () => {
    //включаем обрешетку для хрупкив и жидких грузов
    /*     $("#fragileCargo, #liquidCargo").on("change", function () {
                  if (
                    $("#fragileCargo").is(":checked") ||
                    $("#liquidCargo").is(":checked")
                  ) {
                    $('[name="CRATE"]')
                      .prop("checked", true)
                      .prop("disabled", true)
                      .trigger("change")
                  } else {
                    $('[name="CRATE"]')
                      .prop("checked", false)
                      .prop("disabled", false)
                      .trigger("change")
                  }
                }) */
    $("#fragileCargo, #liquidCargo").on("change", function () {
      if (
        $("#fragileCargo").is(":checked") ||
        $("#liquidCargo").is(":checked")
      ) {
        $('[name="CRATE"]')
          .prop("checked", true)
          .prop("disabled", true)
          .trigger("change")

        /*   $("#fragileCargo").removeClass('checkbox_required').siblings('.switches__name').removeClass('checkbox_required')
                        $("#liquidCargo").removeClass('checkbox_required').siblings('.switches__name').removeClass('checkbox_required') */
      } else {
        $('[name="CRATE"]')
          .prop("checked", false)
          .prop("disabled", false)
          .trigger("change")
        /*   if (
                            $("[name='CRATE']").is(":checked")
                        ) {
                            $("#fragileCargo").addClass('checkbox_required').siblings('.switches__name').addClass('checkbox_required')
                            $("#liquidCargo").addClass('checkbox_required').siblings('.switches__name').addClass('checkbox_required')
                        } */
      }
    })

    $("[name='CRATE']").on("change", function () {
      if ($("[name='CRATE']").is(":checked")) {
        $("[name='PALET']").attr("checked", false)
        $("#fragileCargo").attr("checked", true)
        /*   $("#fragileCargo")
                  .addClass("checkbox_required")
                  .siblings(".switches__name")
                  .addClass("checkbox_required")
                $("#liquidCargo")
                  .addClass("checkbox_required")
                  .siblings(".switches__name")
                  .addClass("checkbox_required") */
      } else {
        /*   $("#fragileCargo")
                  .removeClass("checkbox_required")
                  .siblings(".switches__name")
                  .removeClass("checkbox_required")
                $("#liquidCargo")
                  .removeClass("checkbox_required")
                  .siblings(".switches__name")
                  .removeClass("checkbox_required") */
      }
    })
    $("[name='PALET']").on("change", function () {
      if ($("[name='PALET']").is(":checked")) {
        $("[name='CRATE']").attr("checked", false)
        $("#fragileCargo")
          .removeClass("checkbox_required")
          .siblings(".switches__name")
          .removeClass("checkbox_required")
        $("#liquidCargo")
          .removeClass("checkbox_required")
          .siblings(".switches__name")
          .removeClass("checkbox_required")
      }
    })

    $('[name="FROM_FullTentRemoval"]').on("change", function () {
      if ($(this).is(":checked")) {
        $('[name="FROM_SideTentRemoval"]')
          .prop("checked", false)
          .prop("disabled", true)
          .trigger("change")
        $('[name="FROM_UpperTentRemoval"]')
          .prop("checked", false)
          .prop("disabled", true)
          .trigger("change")
      } else {
        $('[name="FROM_SideTentRemoval"]')
          .prop("disabled", false)
          .trigger("change")
        $('[name="FROM_UpperTentRemoval"]')
          .prop("disabled", false)
          .trigger("change")
      }
    })
    $('[name="TO_LOADING"]').on("change", function () {
      if ($(this).is(":checked")) {
        $(this).closest(".calcform ").find(".prrblock").slideDown()
      } else {
        $(this).closest(".calcform ").find(".prrblock").slideUp()
      }
    })
    $('[name="FROM_LOADING"]').on("change", function () {
      if ($(this).is(":checked")) {
        $(this).closest(".calcform ").find(".prrblock").slideDown()
      } else {
        $(this).closest(".calcform ").find(".prrblock").slideUp()
      }
    })
    $('[name="R_F_LATER"]').on("change", function () {
      if ($(this).is(":checked")) {
        $(this)
          .closest(".calcform ")
          .find('[name="R_F_DOCTYPE"]')
          .removeAttr("data-required")
        $(this)
          .closest(".calcform ")
          .find('[name="R_PASS_1"]')
          .removeAttr("data-required")
        $(this)
          .closest(".calcform ")
          .find('[name="R_PASS_2"]')
          .removeAttr("data-required")
        $(this)
          .closest(".calcform ")
          .find('[name="R_F_DOC"]')
          .removeAttr("data-required")
      } else {
        $(this)
          .closest(".calcform ")
          .find('[name="R_F_DOCTYPE"]')
          .attr("data-required", "required")
        $(this)
          .closest(".calcform ")
          .find('[name="R_PASS_1"]')
          .attr("data-required", "required")
        $(this)
          .closest(".calcform ")
          .find('[name="R_PASS_2"]')
          .attr("data-required", "required")
        $(this)
          .closest(".calcform ")
          .find('[name="R_F_DOC"]')
          .attr("data-required", "required")
      }
    })
  }

  const vacancy = () => {
    $('[data-entity="vacancy-modal"]').on("click", function (e) {
      e.preventDefault()
      const $link = $(this)
      $("#vacancy-name").text($link.data("name"))
      $('[name="VACANCY"]').val($link.data("name"))
    })
  }

  const ajaxForm = function () {
    $(document).on("submit", ".ajax-form", function (e) {
      e.preventDefault()
      let $form = $(this)
      let formData = new FormData($form[0])

      $.ajax({
        url: $form.data("url"),
        type: "POST",
        data: formData,
        async: false,
        success: function (result) {
          $form
            .find(':input[type="text"]:visible, :input[type="email"]:visible')
            .val("")
          //alert('Отправлено');
          $(".modal").modal("hide")
          $("#modalThanks").modal("show")
        },
        cache: false,
        contentType: false,
        processData: false,
      })
    })
  }

  const stepitems = {
    properties: [],
    radio: [],
    set: [],
  }

  function checkExist(obj) {
    const objfound = stepitems.properties.filter(
      (item) => item.property === obj.property
    )

    if (objfound.length === 0) {
      stepitems.properties.push(obj)
    } else {
      objfound[0].value = obj.value
      objfound[0].text = obj.text
    }
  }

  function checkExistRadio(obj) {
    const objfound = stepitems.properties.filter(
      (item) => item.property === obj.property
    )

    if (objfound.length === 0) {
      stepitems.radio.push(obj)
    } else {
      objfound[0].value = obj.value
      objfound[0].text = obj.text
    }
  }

  function getInputData(selector) {
    $(`[data-stepvisible="${selector}"]`)
      .find(
        'input[type="text"][data-steptype="source"], input[type="tel"][data-steptype="source"], input[type="email"][data-steptype="source"]'
      )
      .each(function (index) {
        var obj = {}
        obj.property = $(this).data("stepdata")
        obj.value = $(this).val()
        obj.text = ""
        obj.type = "textinput"
        checkExist(obj)
      })
  }

  function getCheckboxData(selector) {
    $(`[data-stepvisible="${selector}"]`)
      .find('input[type="checkbox"][data-steptype="source"]')
      .each(function (index) {
        var obj = {}
        obj.property = $(this).data("stepdata")
        obj.value = $(this).is(":checked") ? 1 : 0
        obj.text = $(this)
          .parent()
          .find("[data-text]")
          .text()
          .replace(/\s+/g, " ")
        obj.type = "checkbox"
        checkExist(obj)
      })
  }

  function getRadioData(selector) {
    $(`[data-stepvisible="${selector}"]`)
      .find('input[type="radio"][data-steptype="source"]')
      .each(function (index) {
        var obj = {}
        obj.property = $(this).data("stepdata")
        obj.value = $(this).is(":checked") ? 1 : 0
        obj.text = $(this).siblings("[data-text]").text().replace(/\s+/g, " ")
        obj.type = "radio"
        checkExist(obj)
      })
  }

  function getSpanData(selector) {
    $(`[data-stepvisible="${selector}"]`)
      .find('span[data-steptype="source"]')
      .each(function (index) {
        var obj = {}
        obj.property = $(this).data("stepdata")
        obj.value = $(this).text().replace(/\s+/g, " ")
        obj.text = ""
        obj.type = "text"
        checkExist(obj)
      })
  }

  function getSelectData(selector) {
    $(`[data-stepvisible="${selector}"]`)
      .find('select[data-steptype="source"]:visible option:selected')
      .each(function (index) {
        var obj = {}
        obj.property = $(this).closest("select").data("stepdata")
        obj.value = $(this).text().replace(/\s+/g, " ")
        obj.text = ""
        obj.type = "select"
        checkExist(obj)
      })
  }

  function selectInit() {
    $('select[data-select="select_doc"]').each(function () {
      const select = $(this)
      select.on("change", function () {
        let selected = select.find(":selected").data("select")

        select
          .closest(".calcitem__content")
          .find('[data-select="input_doc"]')
          .find("[data-select]")
          .hide()
        select
          .closest(".calcitem__content")
          .find('[data-select="input_doc"]')
          .find(`[data-select="${selected}"]`)
          .show()
      })
    })

    $('select[data-payer="payer"]').each(function () {
      const select = $(this)
      select.on("change", function () {
        let selected = select.find(":selected").data("payer")
        select.closest(".calcitem__content").find("[data-payerform]").hide()
        select
          .closest(".calcitem__content")
          .find(`[data-payerform="${selected}"]`)
          .show()
      })
    })
  }

  function initData() {
    selectInit()
    // берем данные из блоков, в которых нет табов
    getInputData("anyway")
    getCheckboxData("anyway")
    getSpanData("anyway")
    getSelectData("anyway")
    getRadioData("anyway")

    // берем все выбранные radio (табы)
    $('input[type="radio"][data-radiotab="tab"]:checked').each(function (
      index
    ) {
      if ($(this).val()) {
        var obj = {}
        obj.property = $(this).attr("id")
        obj.value = $(this).val()
        obj.text = $(this).closest("label").text().replace(/\s+/g, " ")
        obj.type = "radio"
        checkExistRadio(obj)
      }
    })

    // Берем данные только из выбранных табов
    stepitems.radio.forEach((item) => {
      getInputData(item.property)
      getCheckboxData(item.property)
      getSpanData(item.property)
      getSelectData(item.property)
      getRadioData(item.property)
    })

    /*  console.log(stepitems) */
  }

  function isSizeSet() {
    // если несколько мест - берем в отдельное свойство

    const isSize = stepitems.radio.filter(
      (item) => item.property === "set_size"
    )[0]

    if (isSize) {
      $("[data-inputset]").each(function () {
        stepitems.set.push({
          set: $(this).data("inputset"),
          text: `Место ${$(this).data("inputset")}`,
          values: $(this)
            .find('[data-steptype="source_set"]')
            .toArray()
            .map((item) => {
              return {
                property: item.dataset.stepdata,
                value: item.value,
              }
            }),
        })
      })

      const MathUtils = {
        roundToPrecision: function (subject, precision) {
          return +(+subject).toFixed(precision)
        },
      }

      let len = stepitems.set.reduce(
        (sum, item) =>
          MathUtils.roundToPrecision(
            sum + parseFloat(item.values[0].value.replace(/[^0-9]/g, "")),
            1
          ),
        0
      )

      stepitems.properties.push({
        property: "ob_len",
        value: len + " см",
        text: "",
        type: "textinput",
      })
      let shir = stepitems.set.reduce(
        (sum, item) =>
          MathUtils.roundToPrecision(
            sum + parseFloat(item.values[1].value.replace(/[^0-9]/g, "")),
            1
          ),
        0
      )

      stepitems.properties.push({
        property: "ob_shir",
        value: shir + " см",
        text: "",
        type: "textinput",
      })
      let h = stepitems.set.reduce(
        (sum, item) =>
          MathUtils.roundToPrecision(
            sum + parseFloat(item.values[2].value.replace(/[^0-9]/g, "")),
            1
          ),
        0
      )

      stepitems.properties.push({
        property: "ob_h",
        value: h + " см",
        text: "",
        type: "textinput",
      })
      let w = stepitems.set.reduce(
        (sum, item) =>
          MathUtils.roundToPrecision(
            sum + parseFloat(item.values[3].value.replace(/[^0-9]/g, "")),
            1
          ),
        0
      )

      stepitems.properties.push({
        property: "ob_w",
        value: w + " кг",
        text: "",
        type: "textinput",
      })
      let count = stepitems.set.reduce(
        (sum, item) =>
          MathUtils.roundToPrecision(
            sum + parseFloat(item.values[4].value.replace(/[^0-9]/g, "")),
            1
          ),
        0
      )

      stepitems.properties.push({
        property: "ob_count",
        value: count,
        text: "",
        type: "textinput",
      })

      let vol = stepitems.set.reduce(
        (sum, item) =>
          MathUtils.roundToPrecision(
            sum + parseFloat(item.values[5].value.replace(/[^0-9]\./g, "")),
            3
          ),
        0
      )

      stepitems.properties.push({
        property: "ob_vol",
        value: vol + " м³",
        text: "",
        type: "textinput",
      })
    }
  }

  function setData() {
    $('[data-steptype="result"]').each(function () {
      const current = $(this).data("stepdata")
      let input = stepitems.properties.filter(
        (item) => item.property === current
      )
      if (
        input.length &&
        input[0].type === "textinput" &&
        input[0].value != ""
      ) {
        $(this).text(input[0].value)
      }
      if (input.length && input[0].type === "checkbox" && input[0].value != 0) {
        $(this).text(input[0].text)
      }
      if (input.length && input[0].type === "select" && input[0].value != "") {
        $(this).text(input[0].value)
      }
      if (input.length && input[0].type === "text" && input[0].value != "") {
        $(this).text(input[0].value)
      }

      let radio = stepitems.radio.filter((item) => item.property === current)
      if (radio.length && radio[0].type === "radio" && radio[0].value != 0) {
        $(this).text(radio[0].text)
      }
    })

    $("[data-if]").each(function () {
      const current = $(this).data("if")
      let input = stepitems.properties.filter(
        (item) => item.property === current
      )
      if (
        input.length &&
        input[0].type === "textinput" &&
        input[0].value != ""
      ) {
        $(this).show()
      } else {
        $(this).hide()
      }
    })

    $('[data-totaltype="fizyur"]').each(function () {
      const current = $(this).data("stepdata")
      if (stepitems.radio.filter((item) => item.property === current).length) {
        $(this).show()
      } else {
        $(this).hide()
      }
    })
  }

  const stepForm = () => {
    $(document).on("click", '[data-entity="step-next"]', function (e) {
      e.preventDefault()
      if (validateStepData(currentStep + 1)) {
        initData()
        $(".form-step").hide()
        ++currentStep
        fillStepData(currentStep)
        $('[data-entity="form-step-' + currentStep + '"]').show()
        $([document.documentElement, document.body]).animate(
          {
            scrollTop: $(
              '[data-entity="form-step-' + currentStep + '"]'
            ).offset().top,
          },
          1000
        )
        if (currentStep === 1) {
          $('.form-step .calcpage__nav [data-entity="step-next"]').show()
          $('[data-entity="step-next"]').text("Оформить заявку")
          $('[data-entity="step-prev"]').removeClass("active")
        }
        if (currentStep === 2) {
          $('.form-step .calcpage__nav [data-entity="step-next"]').show()
          $('[data-entity="step-next"]').text("Продолжить")
          $('[data-entity="step-prev"]').addClass("active")
        }
        if (currentStep === 3) {
          $('[data-entity="step-next"]').text("Оформить заявку")
          $('[data-entity="step-prev"]').addClass("active")
          $('.form-step .calcpage__nav [data-entity="step-next"]').hide()
        }
      }
    })

    $(document).on(
      "click",
      '[data-entity="step-prev"]',
      function (e) {
        e.preventDefault()
        /* if (validateStepData(currentStep - 1)) { */
        --currentStep
        if (currentStep < 1) {
          currentStep = 1
        }
        fillStepData(currentStep)
        $(".form-step").hide()
        $('[data-entity="form-step-' + currentStep + '"]').show()
        $([document.documentElement, document.body]).animate(
          {
            scrollTop: $(
              '[data-entity="form-step-' + currentStep + '"]'
            ).offset().top,
          },
          1000
        )

        if (currentStep === 1) {
          $('[data-entity="step-next"]').text("Оформить заявку")
          $('[data-entity="step-prev"]').removeClass("active")
        }
        if (currentStep === 2) {
          $('[data-entity="step-next"]').text("Продолжить")
          $('[data-entity="step-prev"]').addClass("active")
        }
        if (currentStep === 3) {
          $('[data-entity="step-next"]').text("Оформить заявку")
          $('[data-entity="step-prev"]').addClass("active")
        }
      }
      /*  } */
    )
  }

  const fillStepData = (step) => {
    if (step == 2) {
      setData()
      isSizeSet()
    }

    //confirm.html
    if (step == 3) {
      setData()
    }

    if (step == 4) {
      $("#calcForm").prop("action", "/calc/save/")
      $("input:checkbox, input:text").prop("disabled", false)
      $("#calcForm").submit()
    }
  }

  const getMailData = () => {
    const $stepBlock = $('[data-entity="form-step-3"]')

    let _html = ""
    let from = ""
    let to = ""
    from += $stepBlock.find('.fromto__title[data-stepdata="f_otpravki"]').text()
    from += $stepBlock
      .find('.fromto__title[data-stepdata="f_otpravki"]')
      .next("div")
      .text()

    to += $stepBlock.find('.fromto__title[data-stepdata="f_otpravki"]').text()
    to += $stepBlock
      .find('.fromto__title[data-stepdata="f_otpravki"]')
      .next("div")
      .text()

    console.log("FROM")
    console.log(from)
    console.log("TO")
    console.log(to)
  }

  function validateEmail() {
    let valid = true
    const email = []
    const $email = $("input[type='email'][data-required='required']:visible")

    $email.each(function () {
      const obj = {
        input: $(this),
        val: $(this).val().toString(),
      }
      email.push(obj)
    })

    email.forEach(function (item) {
      console.log("item: ", item)

      var emailReg = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i

      if (!emailReg.test(item.val)) {
        valid = false
        item.input.addClass("error")
      } else {
        valid = true
        item.input.removeClass("error")
      }
    })
    console.log("$email: ", valid)

    return valid
  }

  function validateRequired() {
    let valid = true

    valid = validateEmail()

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

    if ($(".error").length) {
      $("html, body").animate(
        {
          scrollTop: $(".error").offset().top - 50,
        },
        500
      )
    }

    return valid
  }

  function validateDepending() {
    let valid = true
    const required = []
    const $required = $("input[data-isrequired]:checked")

    if ($required) {
      $required.each(function () {
        const obj = {
          input: $(this),
          val: $(this).val(),
          depinput: $(this).data("isrequired"),
        }
        required.push(obj)
      })
    }

    required.forEach(function (item) {
      const depending = $(`[data-mbrequired="${item.depinput}"]`)
      if (depending) {
        if (!depending.val().length) {
          valid = false
          depending.addClass("error")
        }
      }
    })

    return valid
  }

  const checkConfirm = () => {
    /*  console.log(123) */
    if ($('input[name="privacy"]').is(":checked")) {
      return true
    } else {
      $('input[name="privacy"]')
        .closest(".pageform__check")
        .find(".checkbox__box")
        .addClass("error")
      return false
    }
  }

  const validateStepData = (step) => {
    let validation = true
    $("input").removeClass("error")

    if (step == 2) {
      let isTerminal = true
      document
        .querySelectorAll(".dropdownJS__label .dropdownJS__text1")
        .forEach((item) => {
          if (item.textContent) {
            item.closest(".dropdownJS__label").classList.remove("error")
          } else {
            item.closest(".dropdownJS__label").classList.add("error")
            isTerminal = false
          }
        })

      validation =
        /* validateDepending() && */
        validateRequired() && isTerminal
    }

    if (step == 3) {
      validation = /* validateDepending() && */ validateRequired()
    }
    if (step == 4) {
      validation = validateRequired() && checkConfirm()
    }

    return validation
  }

  return {
    init: function () {
      dateInit() // = dateInit([0]) = ВС; dateInit([0, 6]) = ВС и СБ
      selectLetter()
      dadataAutocomplete()
      calcInit()
      switcher()
      moreService()
      vacancy()
      ajaxForm()
      stepForm()
      termSelect()
    },
    calcDelivery: function () {
      calcDelivery()
    },
  }
})()

$(document).ready(function () {
  app.init()

  $("[data-cost]").on("keyup", function (e) {
    app.calcDelivery()
  })
})
