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
class ProxyFactory {

    static create(objeto, props, acao) {

        return new Proxy(objeto, {

            get(target, prop, receiver) {

                if (props.includes(prop) && typeof (target[prop]) == typeof (Function)) {

                    return function () {

                        console.log(`${prop} intercepted`);
                        Reflect.apply(target[prop], target, arguments);
                        return acao(target);
                    }

                }

                return Reflect.get(target, prop, receiver);
            }

        });
    }
}



// class ProxyFactory {

//     static create(objeto, props, acao) {

//         return new Proxy(objeto, {

//             get(target, prop, receiver) {

//                 // se é um função e é função que deseja-se interceptar
//                 if (props.includes(prop) && typeof (target[prop]) == typeof (Function)) {

//                     // Substitui o método do proxy que está sendo chamado pelo função retornada
//                     // não pode ser array function, pois precisa ter contexto dinâmico
//                     return function () {

//                         console.log(`${prop} intercepted`);

//                         // executa função do objeto "proxyado" (adiciona ou esvazia)
//                         // parametros: função a ser executada, contexto de execução, argumentos
//                         // o arguments são os argumentos que adiciona ou esvazia está recebendo
//                         Reflect.apply(target[prop], target, arguments);

//                         // update view
//                         return acao(target);
//                     }

//                 }

//                 return Reflect.get(target, prop, receiver);
//             }

//         });
//     }
// }


/* Exemplo de proxy para getter e setter
        
const negociacao = new Proxy(new Negociacao(new Date(), 1, 100), {


    // target => objeto real
    // prop => propriedade
    // receiver => proxy

    // trap for getter
    get: function (target, prop, receiver) {

        console.log(`The property "${prop}" was intecepted`);
        return Reflect.get(target, prop, receiver);
    },

    // trap for setter
    set: function (target, prop, value, receiver) {

        console.log(`New value "${value}" for property "${prop}". (It old value is ${target[prop]})`);
        return Reflect.set(target, prop, value, receiver);
    }
});

// trap for getter
console.log(negociacao.quantidade);
console.log(negociacao.valor);

// trap for setter
negociacao.quantidade = 100;
negociacao.valor = 10;

*/