/**
 * новый калькулятор v2
 */
const appv2 = (function () {
  "use strict"

  /**
   * переменные состояния "приложения"
   */
  const state = {
    currentStep: 1,
    totalSteps: 3,
  }

  /**
   * отправка формы здесь
   */
  const submitForm = () => {
    console.log("Если форма валидна, отправляем заявку ")
  }

  /**
   * добавление нового места в блоке с габаритами груза
   */
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
              <input data-inputid="boxsizes_${count}" data-new-box=${count} type="text" name='boxSizes[]' value='' onkeyup="this.setAttribute('value', this.value);" data-separate-format="" data-validate='boxsizes' data-validwarn='200' data-validerror='1000' data-required="required"> 
              <span class="floating-label">Габариты <span class="gray">(Необязательно)</span></span>
               <span class="texterror"></span>
                                      <span class="inputvalidicon"></span>
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

    boxsizesInit()
  })

  /**
   * добавление обраочика событий при вооде размера (валидация при вводе)
   */
  const boxsizesInit = () => {
    $('[data-validate="boxsizes"]').on("keyup", function (e) {
      const $wrapper = $(this).closest("div")
      $wrapper.addClass("edited")
      $wrapper.removeClass("validwarn")
      $wrapper.removeClass("validerror")
      const val = $(this).val()
      const warn = Number($(this).data("validwarn"))
      const err = Number($(this).data("validerror"))
      const values = val.split("x")
      checkSizes($(this), values, warn, err)
    })
  }

  /**
   * проверка габаритов груза на соотвествие условиям заданным в атрибутах инпута
   * @param {HTMLInputElement} input - инпут который проверяем
   * @param {Array} values - массив значений габаритов извлеченных из поля ввода (22 x 22 x 22 -> [22, 22, 22])
   * @param {string} warn - условие при котором появляется предупреждение о негабаритном грузе
   * @param {string} err - условие при котором форма с габаритами места становится невалидной
   */
  const checkSizes = (input, values, warn, err) => {
    let valid = true
    let count = 0
    values.forEach((value) => {
      console.log(values)
      const errtext = input.closest("div").find(".texterror")
      if (
        value !== "_" &&
        value !== " _ " &&
        value !== "_ " &&
        value !== " _" &&
        value !== "00"
      ) {
        count++
        const intval = Number(value.trim())
        console.log(intval)
        if (intval >= warn && intval < err) {
          input.closest("div").addClass("validwarn")
          console.log("length: ", errtext.text().length)
          if (!errtext.hasClass("iserror")) {
            errtext.text(
              "Габариты груза будут рассчитаны как “Негабаритный груз” "
            )
          }
          valid = false
        } else {
          errtext.text()
        }
        if (intval >= err) {
          input.closest("div").removeClass("validwarn")
          input.closest("div").addClass("validerror")
          errtext.text("Габариты груза превышают максимальные значения")
          errtext.addClass("iserror")
          valid = false
        } else {
          errtext.text()
          errtext.removeClass("iserror")
        }
      }
    })

    if (valid && count === 3) {
      input.closest("div").addClass("validokay")
      input.closest("div").removeClass("edited")
    } else {
      input.closest("div").removeClass("validokay")
    }
  }

  /**
   * инициализация масок для полей в блоке "О грузе", вызывается при первой загрузке и при добавлении новых мест
   * @param {string} count - индекс-идентификатор места, передается если более 1 места
   */
  const initBoxMask = (count = "") => {
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
      mask: "9{1,5} x 9{1,5} x 9{1,5}",
      showMaskOnHover: false,
      showMaskOnFocus: true,
      rightAlign: false,
    })
  }

  /**
   * инициализация всех календарей-инпутов у которых указан класс "lk-datepicker"
   * @param {Array} disabledDays - массив дат, которые будут недоступны для выбора
   */
  const dateInit = (disabledDays = []) => {
    $(".lk-datepicker").each(function () {
      $(this).datepicker().data("datepicker").destroy()
      let dp = $(this).datepicker({
        startDate: new Date(),
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

  /**
   * инициализация событий
   */
  const initListeners = () => {
    /**
     * кастомные select - выбор элемента из выпадающего списка, установка значения в связанный с ним инпут
     */
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
    /**
     * нажатие на стрелку "назад"
     */
    $('[data-back="stepform"]').on("click", function (e) {
      e.preventDefault()
      prevStep()
    })

    /**
     * смена кастомного радиобаттона в виде кнопки, простановка нужных классов
     */
    $(document).on(
      "change",
      '.radiotypeblock input[type="radio"]',
      function (e) {
        $(".radiotype label").removeClass("active")
        $(".resultblock__main").removeClass("active")
        if ($(this).is(":checked")) {
          $(this).closest(".radiotype").find("label").addClass("active")
          $(this)
            .closest(".radiotype")
            .find(".resultblock__main")
            .addClass("active")
        }
      }
    )

    /**
     * обработчик нажатия кнопки "далее" в сайдбаре. вызывает @see validateRequired
     */
    $('[data-submit="stepform"]').on("click", function (e) {
      e.preventDefault()
      const $form = $(this).parents("form")

      $form.find(".error").removeClass("error")

      let errorList = []
      $.each($(".calcerrors__text:visible"), function (i, val) {
        errorList.push($(this).text())
      })
      $('[name="ERRORS"]').val(errorList.join(","))

      if (validateRequired()) {
        nextStep()
      }
    })

    /**
     * обработчик смены табов у группы инпутов (отправитель, получатель) - при изменении показать/скрыть нужный блок формы.
     */
    $("input").on("change", function (e) {
      if ($(this).closest("[data-depgroup]").length) {
        const dep = $(this).attr("data-dependcheck")
        if (dep) {
          if ($(this).is(":checked")) {
            $(`[data-dependbox=${dep}`).addClass("active")
          }
        } else {
          const depgroup = $(this)
            .closest("[data-depgroup]")
            .attr("data-depgroup")
          $(`[data-dependbox=${depgroup}`).removeClass("active")
        }
      }
    })

    /**
     * обработчик смены кастомного чекбокса у опций в форме калькулятора (Тепловой режим и т.п.)
     */
    $(".checkblock input").on("change", function (e) {
      const label = $(this).closest(".checkblock").find("[data-dependon]")
      if ($(this).is(":checked")) {
        label.text("Активирован").show()
        label.closest(".borderblock ").addClass("checkactive")
      } else {
        label.text("Отключен").hide()
        label.closest(".borderblock ").removeClass("checkactive")
      }
    })

    /**
     * при выборе упрощенной выдачи заказа по СМС убираем ненужные поля
     */
    $("input#R_SIMPLIFY").on("change", function (e) {
      const $wrapper = $(this).closest(".calcform__inputs")
      if ($(this).is(":checked")) {
        $wrapper.find("[data-dependselect]").attr("data-blocked", "blocked")
        $wrapper
          .find("[data-depend]")
          .removeAttr("data-required")
          .removeClass("error")
        $wrapper.find("[data-depend]").attr("disabled", "disabled")
      } else {
        $wrapper
          .find("[data-dependselect]")
          .removeAttr("data-blocked", "blocked")
        $wrapper.find("[data-depend]").attr("data-required", "required")
        $wrapper.find("[data-depend]").removeAttr("disabled")
      }
    })

    /**
     * выбор терминала в выпадающем списке терминалов
     */
    $("[data-toggletermid]").on("click", function (e) {
      e.preventDefault()
      $(this).toggleClass("active")
      // get value
      let terminalid = $(this).data("toggletermid")
      let terminalname = $(this).data("toggletermname")
      let terminaltime = $(this).data("toggletermtime")

      // get wrapper element
      const $wrapper = $(this).closest("[data-toggleitem]")
      // get dropdown ID
      let id = $wrapper.data("toggleitem")
      // close dropdown
      $(`[data-toggle=${id}]`).toggleClass("active")
      // set value
      $wrapper.find(`[data-value=${id}]`).text(terminalid + " " + terminalname)
      $wrapper.find(`[data-value2=${id}]`).text(terminaltime)
      $wrapper.find(`[data-input="ternimalid"]`).val(terminalid)
      $wrapper.find(`[data-input="ternimalname"]`).val(terminalname)
    })
  }

  /**
   * инициализация начального состояния калькулятора, вызывается сразу при первой загрузке
   */
  const initView = () => {
    $("[data-calcstep]").hide()
    $('[data-calcstep="form-step-' + state.currentStep + '"]').show()
    dateInit()
    initListeners()
  }

  /**
   * данная функция вызывается при смене шага и запускает процессы необходимые при смене шага
   */
  const changeStep = () => {
    $("[data-calcstep]").hide()

    // fillStepData(currentStep)
    $('[data-calcstep="form-step-' + state.currentStep + '"]').show()
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $("header").offset().top,
      },
      1000
    )
  }

  /**
   * шаг вперед, либо отправка формы если это последний шаг
   */
  const nextStep = () => {
    if (nextStep < state.totalSteps) {
      ++state.currentStep
      changeStep()
    } else {
      submitForm()
    }
  }

  /**
   * шаг назад
   */
  const prevStep = () => {
    if (nextStep > 0) {
      --state.currentStep
      changeStep()
    }
  }

  /**
   * валидация текущего шага. находим только видимые инпуты c атрибутом required и вычисляем флаг valid
   * @returns {boolean} - валидна форма или нет
   */
  const validateRequired = () => {
    let valid = true

    $(".error").removeClass("error")
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

    return valid
  }

  /**
   * инициализация событий связанных с функционалом dadata
   */
  const fndadata = () => {
    fndadataCity()
    fndadataCompany()
  }

  /**
   * обработка событий dadata для организаций
   */
  const fndadataCompany = () => {
    /**
     * ввод данных об организации, отправка запроса dadata, формироване списка
     */
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

    /**
     * клик по элементу списка dadata для организаций - установка значений соотвествующих инпутов
     */

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
  }

  /**
   * обработка событий dadata для городов
   */
  const fndadataCity = () => {
    /**
     * ввод города, отправка запроса dadata, формирование списка городов
     */
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

    /**
     * клик по городу из списка dadata, установка нужного значения в инпут города
     */

    $(document).on("click", "[data-suggcityId]", function (e) {
      const source = $(this)
      const $input = source.closest("[data-datatawrapper]").find("input")
      const $idinput = source
        .closest("[data-datatawrapper]")
        .find('[data-entity="city-kladr-id"]')

      const value = source.attr("data-suggcityId")
      const name = source.attr("data-suggcity").replace(/"/g, "")

      $idinput.val(value)
      $input.val(name)
      $(".sgstlist").remove()
    })
  }

  return {
    init: function () {
      initView()
      initListeners()
      fndadata()
      initBoxMask()
      boxsizesInit()
    },
  }
})()

window.addEventListener("load", function () {
  appv2.init()
})
