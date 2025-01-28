const app = (function () {
  "use strict"

  let currentStep = 3

  function calcDelivery() {
    console.log("calcDelivery")
  }

  $("[data-calcstep]").hide()
  $('[data-calcstep="form-step-' + currentStep + '"]').show()

  $('[data-back="stepform"]').on("click", function (e) {
    e.preventDefault()
    prevStep()
  })

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

  const changeStep = () => {
    $("[data-calcstep]").hide()

    // fillStepData(currentStep)
    $('[data-calcstep="form-step-' + currentStep + '"]').show()
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $("header").offset().top,
      },
      1000
    )
  }
  const nextStep = () => {
    // initData()
    ++currentStep
    changeStep()
    fillStepData(currentStep)
  }
  const prevStep = () => {
    // initData()
    --currentStep
    changeStep()
    fillStepData(currentStep)
  }

  return {
    init: function () {},
  }
})();

$(document).ready(function () {
  app.init()
})
