import { ProductComponent } from '../../components/product/index.js';
import { BackButtonComponent } from '../../components/back-button/index.js';
import { MainPage } from '../main/index.js';

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getData() {
        const panelData = {
            1: { 
                title: 'Стандартная', 
                description: 'Обычная солнечная панель, можно крепить на кронштейн.'
            },
            2: { 
                title: 'Складная', 
                description: 'Солнечная панель для туристических походов.'
            },
            3: { 
                title: 'Облегчённая', 
                description: 'Солнечная панель для автодомов.'
            }
        };

        const panel = panelData[this.id] || {
            title: `Солнечная панель #${this.id}`,
            description: 'Экологичная и выгодная энергия'
        };

        return {
            id: this.id,
            src: `./components/images/${this.id}.jpg`,
            title: panel.title,
            text: panel.description
        };
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

        const data = this.getData();
        const product = new ProductComponent(this.pageRoot);
        product.render(data);
    }
}