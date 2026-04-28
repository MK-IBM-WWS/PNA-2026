import { ProductComponent } from '../../components/product/index.js';
import { BackButtonComponent } from '../../components/back-button/index.js';
import { MainPage } from '../main/index.js';
import { ajax } from '../../modules/ajax.js';
import { apiUrls } from '../../modules/apiUrls.js';

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getData() {
        const url = apiUrls.getCatById(this.id);
        
        ajax.get(url, (data, status, error) => {
            if (error) {
                console.error('Ошибка загрузки:', error);
                this.showError('Не удалось загрузить информацию о панели');
                return;
            }
            
            if (status === 200 && data) {
                this.renderData(data);
            } else if (status === 404) {
                this.showError('Панель с таким ID не найдена');
            } else {
                console.error('Ошибка API, статус:', status);
                this.showError(`Ошибка загрузки (статус: ${status})`);
            }
        });
    }

    renderData(item) {
        const product = new ProductComponent(this.pageRoot);
        product.render(item);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger m-3';
        errorDiv.textContent = message;
        this.pageRoot.appendChild(errorDiv);
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    getHTML() {
        return `
            <div id="product-page" class="container mt-3"></div>
        `;
    }

    clickBack() {
        const mainPage = new MainPage(this.parent);
        mainPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(this.clickBack.bind(this));

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'text-center p-5';
        loadingDiv.innerHTML = '<div class="spinner-border text-primary" role="status"></div><p>Загрузка</p>';
        this.pageRoot.appendChild(loadingDiv);

        this.getData();
        
        setTimeout(() => {
            if (loadingDiv.parentNode) {
                loadingDiv.remove();
            }
        }, 500);
    }
}