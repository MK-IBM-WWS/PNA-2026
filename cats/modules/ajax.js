class Ajax {
    /**
     * @param {string} url
     * @param {function} callback
     */
    get(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }

    /**
     * @param {string} url
     * @param {object} data
     * @param {function} callback
     */
    post(url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }

    /**
     * @param {string} url
     * @param {object} data
     * @param {function} callback
     */
    patch(url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('PATCH', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }

    /**
     * @param {string} url
     * @param {function} callback
     */
    delete(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', url);
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this._handleResponse(xhr, callback);
            }
        };
    }

    /**
     * @param {XMLHttpRequest} xhr
     * @param {function} callback
     */
    _handleResponse(xhr, callback) {
        let data = null;
        let error = null;
        
        try {
            if (xhr.responseText) {
                data = JSON.parse(xhr.responseText);
            }
        } catch (e) {
            error = 'Ошибка парсинга JSON: ' + e.message;
            console.error(error);
        }
        
        callback(data, xhr.status, error);
    }
}

export const ajax = new Ajax();