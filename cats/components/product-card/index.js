export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card m-2" style="width: 300px;">
                <img class="card-img-top" 
                     src="${data.src || 'https://placekitten.com/300/200'}" 
                     alt="${data.title}" 
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p class="card-text">${(data.text || '').substring(0, 100)}</p>
                    <button class="btn btn-success" 
                            id="click-card-${data.id}" 
                            data-id="${data.id}">
                        Подробнее
                    </button>
                </div>
            </div>
        `;
    }

    addListeners(data, listener) {
        const button = document.getElementById(`click-card-${data.id}`);
        if (button) {
            button.addEventListener('click', listener);
        }
    }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        if (listener) {
            this.addListeners(data, listener);
        }
    }
}