import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
	constructor(categories) {
		this.categories = categories;

		this.elem = document.createElement('DIV')
		this.elem.classList.add('ribbon')

		this.ribbonInner = document.createElement('NAV')
		this.ribbonInner.classList.add('ribbon__inner')

		this.arrowLeft = createElement(`
      <button class="ribbon__arrow ribbon__arrow_left">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>`)

		for (let i = 0; i < this.categories.length; i++) {
			this.categories[i] = createElement(`
      <a href="#" class="ribbon__item" data-id="${categories[i].id}">${categories[i].name}</a>`)
			this.ribbonInner.append(this.categories[i])
		}

		this.arrowRight = createElement(`
      <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </button>`)

		this.elem.append(this.arrowRight)
		this.elem.append(this.ribbonInner)
		this.elem.append(this.arrowLeft)

		this.arrowLeft.addEventListener('click', this.scrollLeft)
		this.arrowRight.addEventListener('click', this.scrollRight)
		this.ribbonInner.addEventListener('scroll', this.hideArrow)
		this.ribbonInner.addEventListener('click', this.ribbonSelect)
	}
	scrollLeft = () => {
		this.ribbonInner.scrollBy(-350, 0)
	}
	scrollRight = () => {
		this.ribbonInner.scrollBy(350, 0)
	}

	hideArrow = () => {
		let scrollLeft = this.ribbonInner.scrollLeft
		let scrollWidth = this.ribbonInner.scrollWidth
		let clientWidth = this.ribbonInner.clientWidth
		let scrollRight = scrollWidth - scrollLeft - clientWidth

		if (scrollLeft != 0 && scrollRight > 1) {
			this.arrowLeft.classList.add('ribbon__arrow_visible')
			this.arrowRight.classList.add('ribbon__arrow_visible')
		} else if (scrollLeft == 0) {
			this.arrowLeft.classList.remove('ribbon__arrow_visible')
		} else {
			this.arrowRight.classList.remove('ribbon__arrow_visible')
		}	
	}

	ribbonSelect = (ev) => {	
		if (ev.target.tagName == 'A') {
			ev.preventDefault()
			for (let elem of this.ribbonInner.children ) {
				elem.classList.remove('ribbon__item_active')
			}
			ev.target.classList.add('ribbon__item_active')	
		
			const event = new CustomEvent('ribbon-select', {
				detail: ev.target.dataset.id,
  			bubbles: true
			})
			this.ribbonInner.dispatchEvent(event)
		}	
	}
}
