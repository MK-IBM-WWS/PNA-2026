import { ProductCardComponent } from '../../components/product-card/index.js';
import { ProductPage } from '../product/index.js';
import { ajax } from '../../modules/ajax.js';
import { apiUrls } from '../../modules/apiUrls.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {        
        ajax.get(apiUrls.getCats(), (data, status, error) => {
            if (error) {
                console.error('Ошибка загрузки:', error);
                this.showError('Не удалось загрузить');
                return;
            }
            
            if (status === 200 && data) {
                this.renderData(data);
            } else {
                console.error('Ошибка API, статус:', status);
                this.showError(`Ошибка загрузки (статус: ${status})`);
            }
        });
    }

    renderData(items) {
        if (!items || items.length === 0) {
            this.showError('Нет доступных товаров');
            return;
        }
        
        items.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot);
            productCard.render(item, this.clickCard.bind(this));
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger m-3';
        errorDiv.textContent = message;
        this.pageRoot.appendChild(errorDiv);
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    getHTML() {
        return `
            <div id="main-page" class="d-flex flex-wrap justify-content-center gap-3 p-3"></div>
        `;
    }

    clickCard(e) {
        const cardId = e.target.dataset.id;
        console.log('Клик по карточке с ID:', cardId);
        const productPage = new ProductPage(this.parent, cardId);
        productPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'text-center p-5';
        loadingDiv.innerHTML = '<div class="spinner-border text-primary" role="status"></div><p>Загрузка кошек...</p>';
        this.pageRoot.appendChild(loadingDiv);
        
        this.getData();
        
        setTimeout(() => {
            if (loadingDiv.parentNode) {
                loadingDiv.remove();
            }
        }, 100);
    }
}