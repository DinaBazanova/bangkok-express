import createElement from '../../../assets/lib/create-element.js';

export default class Modal {
	constructor() {
		this.render()

		let btnClose = this.modal.querySelector('.modal__close')
		btnClose.addEventListener('click', this.buttomClose)
		document.addEventListener('keydown', this.escClose)
	}

	render() {
		this.modal = createElement(`
      		<div class="modal">
        		<div class="modal__overlay"></div>
				<div class="modal__inner">
					<div class="modal__header">
						<button type="button" class="modal__close">
							<img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
						</button>
						<h3 class="modal__title">
						Вот сюда нужно добавлять заголовок
						</h3>
					</div>
					<div class="modal__body">
						A сюда нужно добавлять содержимое тела модального окна
				  	</div>
        		</div>
      		</div>
		`)
		//console.log(this.modal)
	}

	open() {
		document.body.append(this.modal)
		document.body.classList.add('is-modal-open')
	}

	setTitle(modalTitle) {
		this.modal.querySelector('.modal__title').textContent = modalTitle
	}

	setBody = (node) => {
		this.modal.querySelector('.modal__body').innerHTML = node.outerHTML 
	}
	close() {
		this.modal.remove() 
		document.body.classList.remove('is-modal-open')
		document.removeEventListener('keydown', this.escClose)
	}
	buttomClose = () => {
		this.modal.remove()
		document.body.classList.remove('is-modal-open')
		document.removeEventListener('keydown', this.escClose)
	}
	escClose = (event) => {
		if (event.code === 'Escape') {
			this.modal.remove()
			document.body.classList.remove('is-modal-open')
			document.removeEventListener('keydown', this.escClose)
		}
	}
}
