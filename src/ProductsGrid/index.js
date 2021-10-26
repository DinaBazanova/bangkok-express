import createElement from '../../assets/lib/create-element.js';
import ProductCard from './ProductCard/index.js';

export default class ProductGrid {
	constructor(products) {
		this.products = products // полный спиток товаров. this.selectedProducts - текущий список товаров
		this.filters = {}
		this.currentFilters = {}
		this.setSelectedProducts(products)
		this.renderElem()
		this.renderProductsCard()
		this.elem.addEventListener('click', this.addInOrder)
	}

	renderElem() {
		this.elem = createElement(`
			<div class="products-grid">
				<div class="products-grid__inner">
					<!--ВОТ ТУТ БУДУТ КАРТОЧКИ ТОВАРОВ-->
				</div>
			</div>
		`)
		this.productsGridInner = this.elem.querySelector('.products-grid__inner')
	}
	renderProductsCard() {
		this.productsGridInner.innerHTML = this.selectedProducts.map(item => {	
			this.productCard = new ProductCard(item)
			return this.productCard.elem.outerHTML
			})
			.join('')	
	}
	
	setSelectedProducts(value) {
		return this.selectedProducts = value
	}

	updateFilter(filters) {
		this.setSelectedProducts(this.products)

		Object.assign(this.currentFilters,filters)
		
		if (this.currentFilters.noNuts === true) {
			this.selectedProducts = this.selectedProducts.filter( item => {
				if (["nuts"] in item == false || item["nuts"] == false) {
					return item
				}
			})
		
		}
		
		if (this.currentFilters.vegeterianOnly === true) {
			this.selectedProducts = this.selectedProducts.filter( item => {
				if (item["vegeterian"] === true) {
					return item
				}
			})		
		}

		if (this.currentFilters.maxSpiciness >= 0) {
			this.selectedProducts = this.selectedProducts.filter( item => {
				if (item.spiciness <= this.currentFilters.maxSpiciness) {
					return item	
				}
			})
		}

		if (this.currentFilters.category) {
			this.selectedProducts = this.selectedProducts.filter( item => {
				if (item.category === this.currentFilters.category) {
					return item	
				}
			
			})	
		}
		
		this.renderProductsCard()
	}
	
	addInOrder = (ev) => {
		if (ev.target.closest('.card__button')) {
	
		const event = new CustomEvent("product-add", {
			detail: 
				this.selectedProducts.filter(item => {
					if (item["name"] === ev.target.closest('.card__button').previousElementSibling.textContent) {
						return item
					}
				})[0].id ,
			bubbles: true
		})

		this.elem.dispatchEvent(event)
		}
	}
}
