export class NotificationComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(message, type = 'primary') {
        const id = `notification-${Date.now()}`;
        return (
            `
            <div id="${id}" class="toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3" role="alert" aria-live="assertive" aria-atomic="true" style="z-index: 9999;">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
            `
        );
    }

    render(message, type = 'primary') {
        const html = this.getHTML(message, type);
        this.parent.insertAdjacentHTML('beforeend', html);

        const lastChild = this.parent.lastElementChild;
        
        if (lastChild) {
            const toast = new bootstrap.Toast(lastChild, {
                autohide: true,
                delay: 3000
            });
            toast.show();

            lastChild.addEventListener('hidden.bs.toast', () => {
                lastChild.remove();
            });
        }
    }
}