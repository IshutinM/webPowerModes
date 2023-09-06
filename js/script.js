document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tabheader__item'),
    tabContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items ')

  //tabcontent

  function hideTabComtant() {
    tabContent.forEach((item) => {
      item.classList.add('hide')
      item.classList.remove('show', 'fade')
    })

    tabs.forEach((item) => {
      item.classList.remove('tabheader__item_active')
    })
  }

  function showTabContent(i = 0) {
    tabContent[i].classList.add('show', 'fade')
    tabContent[i].classList.remove('hide')

    tabs[i].classList.add('tabheader__item_active')
  }

  hideTabComtant()
  showTabContent()

  tabsParent.addEventListener('click', (event) => {
    const target = event.target

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabComtant()
          showTabContent(i)
        }
      })
    }
  })

  //   modal
  const modal = document.querySelector('.modal'),
    modalTrigger = document.querySelectorAll('[data-modal]'),
    modalCloseBtn = document.querySelector('[data-close]')

  function modalClose() {
    modal.classList.add('hide')
    modal.classList.remove('show')
    document.body.style.overflow = ''
  }

  function openModal() {
    modal.classList.add('show')
    modal.classList.remove('hide')
    document.body.style.overflow = 'hidden'

    clearInterval(modalTimerId)
  }
  modalTrigger.forEach((item) => {
    item.addEventListener('click', openModal)
  })
  modalCloseBtn.addEventListener('click', modalClose)

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modalClose()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.code == 'Escape' && modal.classList.contains('show')) {
      modalClose()
    }
  })

  const modalTimerId = setTimeout(openModal, 2000)

  function showModalByScroll() {
    if (
      window.scrollY + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal()
      window.removeEventListener('scroll', showModalByScroll)
    }
  }

  window.addEventListener('scroll', showModalByScroll)

  class MenuCard {
    constructor(
      imageSrc,
      subtitle,
      description,
      price,
      transfer,
      parentSelector
    ) {
      this.imageSrc = imageSrc
      this.subtitle = subtitle
      this.description = description
      this.price = price
      this.parent = document.querySelector(parentSelector)
      this.transfer = transfer
      this.changeToUA()
    }

    changeToUA() {
      this.price = this.price * this.transfer
    }

    render() {
      const element = document.createElement('div')
      element.innerHTML = `
        <div class="menu__item">
          <img src="${this.imageSrc}" alt="${this.subtitle}" />
          <h3 class="menu__item-subtitle">${this.subtitle}</h3>
          <div class="menu__item-descr">${this.description}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
          </div>
        </div>
      `
      this.parent.append(element)
    }
  }

  const div = new MenuCard(
    'img/tabs/vegy.jpg',
    "Меню 'Фитнес'",
    "Меню 'Фитнес' - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!",
    229, // Это значение цены без умножения на transfer
    2.65,
    '.menu .container'
    // Родительский селектор
  )
  const premiumMenu = new MenuCard(
    'img/tabs/elite.jpg',
    'Меню “Премиум”',
    'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    550,
    2.65, // Предположим, что это коэффициент для конвертации валюты
    '.menu .container' // Предположим, что это селектор родительского элемента
  )

  const postMenu = new MenuCard(
    'img/tabs/post.jpg',
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    420, // Предположим, что это цена без конвертации
    2.65, // Предположим, что это коэффициент для конвертации валюты
    '.menu .container' // Предположим, что это селектор родительского элемента
  )

  // Вызов метода render для каждой из созданных карточек
  premiumMenu.render()
  postMenu.render()

  div.render() // Вызываем метод render для создания и добавления элемента в DOM

  // FORMS

  const forms = document.querySelectorAll('form')

  const message = {
    loading: 'Загрузка',
    success: 'Спасибо, скоро мы с Вами свяжемся',
    failure: 'Что-то пошло не так...',
  }

  forms.forEach((form) => {
    postData(form)
  })

  function postData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const statusMessage = document.createElement('div')
      statusMessage.classList.add('status')
      statusMessage.textContent = message.loading
      form.append(statusMessage)

      
      const request = new XMLHttpRequest()
      request.open('POST', 'server.php')

      request.setRequestHeader(
        'Content-type',
        // 'application/x-www-form-urlencoded'
        'application / json'
      )


      
      const object = {}
      formData.forEach(function (value, key) {
        object[key] = value
      })

      const json = JSON.stringify(object)

      request.send(json)
      const formData = new URLSearchParams(new FormData(form)).toString()

      request.send(formData)

      request.addEventListener('load', () => {
        if (request.status === 200) {
          console.log(request.response)
          statusMessage.textContent = message.success
          form.reset()
          setTimeout(() => {
            statusMessage.remove()
          }, 2000)
        } else {
          statusMessage.textContent = message.failure
        }
      })

      request.addEventListener('error', () => {
        statusMessage.textContent = message.failure
      })
    })
  }
})
