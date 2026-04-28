class ApiUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getCats() {
        return `${this.baseUrl}/stocks`;
    }

    getCatById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }

    createCat() {
        return `${this.baseUrl}/stocks`;
    }

    deleteCatById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }

    updateCatById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }
}

export const apiUrls = new ApiUrls();