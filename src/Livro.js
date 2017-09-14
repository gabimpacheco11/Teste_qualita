import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

export default class LivroBox extends Component{
	
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
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                  <FormularioLivro autores={this.state.autores}/>
                </div>
			</div>

			);
	}
}


class FormularioLivro extends Component {
	
    constructor() {
    super();
    this.state = {titulo:'',preco:'',autorId:''};
    this.enviaForm = this.enviaForm.bind(this);
    this.setTitulo = this.setTitulo.bind(this);
    this.setPreco = this.setPreco.bind(this);
    this.setAutorId = this.setAutorId.bind(this);
  }

	setTitulo(evento){
	  this.setState({titulo:evento.target.value});
	}

	setPreco(evento){
	  this.setState({preco:evento.target.value});
	}

	setAutorId(evento){
	  this.setState({autorId:evento.target.value});
	}

	enviaForm(evento){
	  evento.preventDefault();
	  $.ajax({
	     url:'http://localhost:8080/api/livros',
	     contentType:'application/json',
	     dataType:'json',
	     type:'post',
	     data: JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
	     
	     success: function(resposta, novaListagem){
	       PubSub.publish('atualiza-lista-livros',novaListagem);
	       this.setState({titulo: '', preco: '', autorId:''});
	       alert('Livro cadastrado com sucesso');
	    }.bind(this),

	     error: function(resposta){
	       if(resposta.status === 400){
	       	new TratadorErros().publicaErros(resposta.responseJSON); 
	       }
	     },
	     beforeSend: function(){
	     	PubSub.publish("limpa-erros", {});
	     }      
	   });
	 }

	
	render() {
	
	    return (
	   
		<div className="autorForm">
	        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
          	<InputCustomizado id="titulo" name="titulo" label="Titulo: " type="text" value={this.state.titulo} placeholder="Titulo do livro" onChange={this.setTitulo} />
          	<InputCustomizado id="preco" name="preco" label="Preco: " type="text" value={this.state.preco} placeholder="Preço do livro" onChange={this.setPreco} />  
	          <div className="pure-control-group">
	          <label htmlFor="autorId">Autor</label>
	            <select name="autorId" id="autorID" onChange={this.setAutorId}>
	                <option value="">Selecione autor</option>
	                {
				        this.props.autores.map(function(autor){
				            return <option value={autor.id}>{autor.nome}</option>
				        })
				    }
	            </select>
	          </div>  
	          <div className="pure-control-group">                                 
	           <label></label>
	            <button type="submit"  className="pure-button pure-button-primary">Gravar</button>                        
        	  </div>
        	</form>
        </div>
	    );
	  }
	}

