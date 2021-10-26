import Carousel from './src/Carousel/index.js';
import slides from './src/Carousel/slides.js';

import RibbonMenu from './src/RibbonMenu/index.js';
import categories from './src/RibbonMenu/categories.js';

import StepSlider from './src/StepSlider/index.js';
import ProductsGrid from './src/ProductsGrid/index.js';

import CartIcon from './src/CartIcon/index.js';
import Cart from './src/Cart/index.js';

export default class Main {

	constructor() {
	}

	async render() {
		let carousel = new Carousel(slides)
		document.querySelector('[data-carousel-holder]').append(carousel.elem)

		this.ribbonMenu = new RibbonMenu(categories)
		document.querySelector('[data-ribbon-holder]').append(this.ribbonMenu.elem)

		this.stepSlider = new StepSlider({
			steps: 5,
			value: 3
		})
		document.querySelector('[data-slider-holder]').append(this.stepSlider.elem)

		let cartIcon = new CartIcon()
		document.querySelector('[data-cart-icon-holder]').append(cartIcon.elem)

		this.cart = new Cart(cartIcon)

		let promise = fetch('products.json')
			.then(response => response.json())

		this.products = await promise

		this.productsGrid = new ProductsGrid(this.products)
		document.querySelector('[data-products-grid-holder]').append(this.productsGrid.elem)
		
		this.productsGrid.updateFilter({
			noNuts: document.getElementById('nuts-checkbox').checked,
			vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
			maxSpiciness: this.stepSlider.value,
			category: this.ribbonMenu.value
		});
		
		document.body.addEventListener("product-add", event => {
			this.cart.addProduct(
				this.products.find( item => item.id == event.detail)
			)
		})

		document.body.addEventListener("slider-change", event => {
			this.productsGrid.updateFilter({
				maxSpiciness: event.detail
			})
		})
		
		document.body.addEventListener("ribbon-select", event => {
			this.productsGrid.updateFilter({
				category: event.detail
			})
		})

		document.querySelector('.filters__inner').addEventListener('change', event => {
			if (event.target.closest('#nuts-checkbox')) {
				this.productsGrid.updateFilter({
					noNuts: document.getElementById('nuts-checkbox').checked
				})
			} else if (event.target.closest('#vegeterian-checkbox')) {
				this.productsGrid.updateFilter({
					vegeterianOnly: document.getElementById('vegeterian-checkbox').checked
				})
			}
		})
	}
}
