export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="container mt-4">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card">
                            <img src="${data.src}" 
                                 class="card-img-top" 
                                 alt="${data.title}"
                                 style="width: 100%; height: 500px; object-fit: cover; border-radius: 10px;"
                                 onerror="this.src='https://placekitten.com/800/500'">
                            
                            <div class="card-body">
                                <marquee behavior="scroll" 
                                         direction="left" 
                                         scrollamount="15"
                                         style="font-size: 18px; 
                                                color: red; 
                                                background-color: white; 
                                                padding: 15px; 
                                                border-radius: 10px;
                                                border: 2px solid pink;
                                                font-weight: bold;">
                                    Очень мягкая, пушистая и любит, когда ее гладят. 
                                    Живёт в уютном доме и ждёт своего хозяина!
                                </marquee>
                                
                                <h2 class="card-title text-center mt-4">${data.title}</h2>
                                <p class="card-text text-center lead">${data.text}</p>
                                
                                <div class="text-center mt-3">
                                    <button class="btn btn-primary btn-lg" onclick="history.back()">
                                        ← Вернуться к списку котиков
                                    </button>
                                </div>
                            </div>
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