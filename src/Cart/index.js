import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from './Modal/index.js';

export default class Cart {
	cartItems = []; // [product: {...}, count: N]

	constructor(cartIcon) {
		this.cartIcon = cartIcon;
		
		this.addEventListeners();
	}

	addProduct(product) {
		if (product) {
			let result
			if (result = this.cartItems.find(item => item.product === product)) {
				result.count++
			} else {
				this.cartItems.push({ product, count: 1 })
			}
		}
		this.cartIcon.update(this)
	}

	updateProductCount(productId, amount) {
		this.cartItems.find(item => item.product["id"] === `${productId}`).count += amount 
		this.onProductUpdate(this.cartItems)
	}

	isEmpty() {
		if (this.cartItems.length === 0) {
			return true
		} else { return false }
	}

	getTotalCount() {
		let totalCount = 0
		this.cartItems.map(item => totalCount += item.count)
		return totalCount
	}

	getTotalPrice() {
		let totalPrice = 0
		this.cartItems.map(item => totalPrice += item.count * item.product["price"])
		return totalPrice
	}

	renderProduct(product, count) {
		return createElement(`
			<div class="cart-product" data-product-id="${product.id}">
				<div class="cart-product__img">
					<img src="/assets/images/products/${product.image}" alt="product">
				</div>
				<div class="cart-product__info">
					<div class="cart-product__title">${escapeHtml(product.name)}</div>
					<div class="cart-product__price-wrap">
						<div class="cart-counter">
							<button type="button" class="cart-counter__button cart-counter__button_minus">
								<img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
							</button>
							<span class="cart-counter__count">${count}</span>
							<button type="button" class="cart-counter__button cart-counter__button_plus">
								<img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
							</button>
						</div>
						<div class="cart-product__price">€${(count * product.price).toFixed(2)}</div>
					</div>
				</div>
			</div>`);
	}

	renderOrderForm() {
		return createElement(`
			<form class="cart-form">
     			<h5 class="cart-form__title">Delivery</h5>
      			<div class="cart-form__group cart-form__group_row">
					<input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
					<input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
					<input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
				</div>
      			<div class="cart-form__group">
					<input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
				</div>
      			<div class="cart-buttons">
        			<div class="cart-buttons__buttons btn-group">
          				<div class="cart-buttons__info">
							<span class="cart-buttons__info-text">total</span>
							<span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
						</div>
          				<button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        			</div>
      			</div>
    		</form>`);
	}

	renderModal() {
		this.modal = new Modal()
		this.modal.open()
		this.modal.setTitle('Your order')

		let cartItems = this.cartItems.map( item => {
			item = this.renderProduct(item.product, item.count)
			return item.outerHTML
			})
			.join('')

		this.modalBody = createElement(`<div>${cartItems}</div>`)
		this.modalBody.append(this.renderOrderForm())
		this.modal.setBody(this.modalBody)

		this.modalBody = document.querySelector('.modal__body')
		this.modalBody.addEventListener('click', event => this.changeCount(event))
		
		let form = this.modalBody.querySelector('.cart-form')
		form.addEventListener('submit', event => this.onSubmit(event))
	}

	changeCount (event) {

		if (event.target.closest('.cart-product')) {
			let productId = event.target.closest('.cart-product').dataset.productId
			if (event.target.closest('button').classList.contains('cart-counter__button_minus')) {// console.log(this.cartItems)
				this.updateProductCount(productId, -1)
			} else if (event.target.closest('button').classList.contains('cart-counter__button_plus')) {
				this.updateProductCount(productId, 1)
			}
		}
	}

	onProductUpdate(cartItem) {

		if (document.body.classList.contains('is-modal-open')) {
			let totalPrice = 0
				
			cartItem.forEach((element, index, arr) => {
				let productId = element.product["id"]
				let productCount = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`)
				let productPrice = this.modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`)
				let infoPrice = this.modalBody.querySelector(`.cart-buttons__info-price`)
				
				productCount.innerHTML = element.count
				productPrice.innerHTML = `€${(element.count * element.product["price"]).toFixed(2)}`
				infoPrice.innerHTML = `€${(totalPrice += element.count * element.product["price"]).toFixed(2)}`;
				

				if (element.count < 1) {
					arr.splice(index, 1)
					this.modalBody.querySelector(`[data-product-id=${productId}]`).remove()
				}	
			})
			if (this.isEmpty()) {
				this.modal.close()
			}	
		}

		this.cartIcon.update(this);
	}

	onSubmit(event) {
		event.preventDefault()
		event.target.classList.add('is-loading')
		let formData = new FormData(this.modalBody.querySelector('.cart-form'));
		fetch ('https://httpbin.org/post', {
			method: 'POST',
			body: formData
		})
		.then ( response => {
			if (response.ok) {
				this.modal.setTitle('Success!')
				this.cartItems.splice(0, this.cartItems.length)
				this.modalBody.innerHTML = `
					<div class="modal__body-inner">
						<p>
							Order successful! Your order is being cooked :) <br>
							We’ll notify you about delivery time shortly.<br>
							<img src="/assets/images/delivery.gif">
						</p>
					</div>`
			}
		})
	}	

	addEventListeners() {
		this.cartIcon.elem.onclick = () => this.renderModal();
	}
}

