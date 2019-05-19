class NegociacaoController {

    constructor() {
        let $ = document.querySelector.bind(document);

        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade'); 
        this._inputValor = $('#valor');

        /**
         * O Proxy do JS só consegue interceptar uma ação de um objeto
         * quando uma propriedade é lida ou recebe um valor (set/get). 
         * Propriedades de funções não são interceptadas pelo proxy.
         * 
         * Solucação para interceptação de uma função do objeto:
         * 
         *  - Comportamento: ao executar uma função o JS primeiro 
         *    da um 'get' da propriedade que representa a função para, 
         *    em seguida, executar Reflection.apply().
         * 
         * Através desse comportamento é possível incerptar um função.
         * 
         *  - sempre que for um método usar Reflect.apply()
         */

         // guardando o contexto
        const self = this;

        this._listNegociacoes = new Proxy(new ListaNegociacoes(), {

            get(target, prop, receiver) {

                const isAdicionaOuEsvazia = ['adiciona', 'esvazia'].includes(prop);
                const isOfTypeFunction = typeof (target[prop]) == typeof (Function);
                if (isAdicionaOuEsvazia && isOfTypeFunction) {

                    // Substitui o método do proxy que está sendo chamado pelo função retornada
                    // não pode ser array function, pois precisa ter contexto dinâmico
                    return function () {

                        console.log(`${prop} intercepted`);

                        // executa função do objeto "proxyado" (adiciona ou esvazia)
                        // parametros: função a ser executada, contexto de execução, argumentos
                        // o arguments são os argumentos que adiciona ou esvazia está recebendo
                        Reflect.apply(target[prop], target, arguments);

                        // update view
                        self._negociacoesView.update(target);
                    }

                }

                return Reflect.get(target, prop, receiver);
            }

        });
        

        this._negociacoesView = new NegociacoesView($('#negociacoesView'));
        this._negociacoesView.update(this._listNegociacoes);

        this._mensagem = new Mensagem();
        this._mensagemView = new MensagemView($('#mensageView'));
        this._mensagemView.update(this._mensagem.texto);
    }

    adiciona(event) {
        event.preventDefault();

        this._listNegociacoes.adiciona(this._criaNegociacao());

        this._mensagem.texto = 'Negociação adicionada com sucesso';
        this._mensagemView.update(this._mensagem);

        this._limpaFormulario();
    }

    apaga() {
        this._listNegociacoes.esvazia();

        this._mensagem.texto = 'Negociações apagadas com sucesso';
        this._mensagemView.update(this._mensagem);
    }

    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value
        );
    }

    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        
        this._inputData.focus();
    }
}