import { ThreeDModelComponent } from '../3d-model/index.js';

export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
        this.threeDModel = null;
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
                                 style="width: 100%; height: 500px; object-fit: cover; border-radius: 10px;">
                            <div class="card-body">
                                <div class="running-text-container" style="
                                    overflow: hidden;
                                    background-color: green;
                                    padding: 15px;
                                    border-radius: 10px;
                                    border: 2px solid green;
                                    font-weight: bold;
                                    font-size: 18px;
                                    color: white;
                                ">
                                    <div class="running-text" style="
                                        white-space: nowrap;
                                        animation: scrollText 15s linear infinite;
                                    "> Мощная солнечная панель, обеспечит Ваш дом экологичной и стабильной электроэнергией
                                    </div>
                                </div>
                                
                                <style>
                                    @keyframes scrollText {
                                        0% { transform: translateX(100%); }
                                        100% { transform: translateX(-100%); }
                                    }
                                    .running-text:hover {
                                        animation-play-state: paused;
                                    }
                                </style>
                                
                                <div id="model-container" style="margin: 20px 0;"></div>
                                
                                <h2 class="card-title text-center mt-4">${data.title}</h2>
                                <p class="card-text text-center lead">${data.text}</p>
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
        const modelContainer = document.getElementById('model-container');
        if (modelContainer) {
            this.threeDModel = new ThreeDModelComponent(modelContainer, '/cats/models/solar.glb');
            this.threeDModel.render();
        }
    }
}