class View {

    constructor(elemento) {
        this._elemento = elemento;
    }

    template() {
        throw new Error('Must be overridden');
    }

    update(model) {
        this._elemento.innerHTML = this.template(model);
    }

}