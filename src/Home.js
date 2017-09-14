import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';

export default class Home extends Component {

		constructor() {
		    super();
		    this.state = {lista : [], autores: []};
    	}

    	  componentDidMount(){  
	      $.ajax({
	          url:"http://localhost:8080/api/livros",
	          dataType: 'json',
	          success:function(resposta){    
	            this.setState({lista:resposta});
	          }.bind(this)
	        }
	      );

	      $.ajax({
	          url:"http://localhost:8080/api/autores",
	          dataType: 'json',
	          success:function(resposta){    
	            this.setState({autores:resposta});
	          }.bind(this)
	        }
	      );

	      PubSub.subscribe('atualiza-lista-livros', function(topico,novaLista){
  			this.setState({lista:novaLista});
		}.bind(this));
	}


	render() {
		return(
			<div>
				<div className="header">
          <h1>Bem vindo ao sistema</h1>
          <h3>Livros Cadastrados</h3>
        </div>
        <div className="content home" id="content">
				  <TabelaLivros lista={this.state.lista}/> 		
        </div>
			</div>

			);
	}
}

class TabelaLivros extends Component{
    
    render() {
        return(
                <div className="corpo">            
                      <table className="pure-table">
                        <thead>
                          <tr>
                            <th className="ordena">Título</th>
                            <th>Preço</th>
                            <th>Autor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.props.lista.map(function(livro){
                              return (
                                <tr key={livro.id}>
                                  <td>{livro.titulo}</td>
                                  <td>{livro.preco}</td>
                                  <td>{livro.autor.nome}</td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </table>
                    </div>
      );
    }
}