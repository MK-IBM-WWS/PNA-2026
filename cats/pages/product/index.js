import { ProductComponent } from '../../components/product/index.js';
import { BackButtonComponent } from '../../components/back-button/index.js';
import { MainPage } from '../main/index.js';

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
        console.log('ProductPage создан для ID:', id);
    }

    getData() {
        const catsData = {
            1: { 
                title: 'Британская кошка', 
                description: 'Спокойная, независимая, но очень любит хозяев. Идеальный компаньон для вечеров дома.'
            },
            2: { 
                title: 'Мейн-кун', 
                description: 'Огромный и дружелюбный, настоящий домашний рысь. Отлично ладит с детьми.'
            },
            3: { 
                title: 'Сфинкс', 
                description: 'Ласковый и теплый, обожает сидеть на руках. Гипоаллергенная порода.'
            },
            4: { 
                title: 'Сиамская кошка', 
                description: 'Голосистая, активная и очень преданная. Будет следовать за вами хвостиком.'
            },
            5: { 
                title: 'Персидская кошка', 
                description: 'Пушистая, спокойная и царственная. Любит лежать на коленях.'
            }
        };

        const cat = catsData[this.id] || {
            title: `Кошка #${this.id}`,
            description: 'Очень милая кошка ждет своего хозяина!'
        };

        return {
            id: this.id,
            src: `./components/images/${this.id}.jpg`,
            title: cat.title,
            text: cat.description
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