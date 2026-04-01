import { ProductCardComponent } from '../../components/product-card/index.js';
import { ProductPage } from '../product/index.js';

export class MainPage {
    constructor(parent) {
        this.parent = parent;
    }

    getData() {
        return [
            {
                id: 1,
                src: './components/images/1.jpg',
                title: 'Стандартная',
                text: 'Обычная солнечная панель, можно крепить на кронштейн.'
            },
            {
                id: 2,
                src: './components/images/2.jpg',
                title: 'Складная',
                text: 'Солнечная панель для туристических походов.'
            },
            {
                id: 3,
                src: './components/images/3.jpg',
                title: 'Облегченная',
                text: 'Солнечная панель для автодомов.'
            }
        ];
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
        const productPage = new ProductPage(this.parent, cardId);
        productPage.render();
    }

    render() {
        this.parent.innerHTML = '';
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);

        const data = this.getData();

        data.forEach((item) => {
            const productCard = new ProductCardComponent(this.pageRoot);
            productCard.render(item, this.clickCard.bind(this));
        });
    }
}