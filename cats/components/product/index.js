export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card mb-3" style="max-width: 800px; margin: 0 auto;">
                <div class="row g-0">
                    <div class="col-md-6">
                        <img src="${data.src}" 
                             class="img-fluid rounded-start" 
                             alt="${data.title}"
                             style="width: 100%; height: 400px; object-fit: cover;">
                    </div>
                    <div class="col-md-6">
                        <div class="card-body">
                            <h2 class="card-title">${data.title}</h2>
                            <p class="card-text lead">${data.description}</p>
                            <p class="card-text trail">${data.text}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render(data) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
    }
}