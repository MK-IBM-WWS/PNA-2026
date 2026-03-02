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
                title: 'Британская',
                text: 'Спокойная и независимая плюшка.'
            },
            {
                id: 2,
                src: './components/images/2.jpg',
                title: 'Мейн-кун',
                text: 'Большой и дружелюбный великан.'
            },
            {
                id: 3,
                src: './components/images/3.jpg',
                title: 'Сфинкс',
                text: 'Любвеобильный и теплый инопланетянин.'
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