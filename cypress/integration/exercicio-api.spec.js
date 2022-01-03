/// <reference types="cypress" />
import contracts from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {
     let token
     before(() => {
          cy.token('jorge@qa.com.br', 'teste').then(tkn => { token = tkn })
     });
     it.only('Deve validar contrato de usuarios', () => {
         cy.request('usuarios').then(response =>{
             return contracts.validateAsync(response.body)
           
         })
     
     });
     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios',
          }).then((response) => {
               expect(response.body.usuarios[2].nome).to.equal('756675 da Silva')
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(15)
          });
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          cy.cadastrarUsuario(token, "carlos lucas", "carlinho@ebac.com", "teste ", "true").then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario(token, "jorge lucas", 2323, "teste ", "true").then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.email).to.equal('email deve ser uma string')
          })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[2]._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
                    body: {
                         nome: "756675 da Silva",
                         email: "5555@qa.com.br",
                         password: "teste",
                         administrador: "true"

                    }
               }).then((response) => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')

               })

          })
     })



      it('Deve deletar um usuário previamente cadastrado', () => {
           cy.cadastrarUsuario(token, "carlos joaquin", '2121@qa.com.br', "teste ", "true").then((response) => {
                let id = response.body._id
                cy.request({
                     method: 'DELETE',
                    url: `usuarios/${id}`,
                    headers: { authorization: token }

                }).then(response => {
                     expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
                })
           });
     });

 })