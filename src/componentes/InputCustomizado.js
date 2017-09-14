import React, { Component } from 'react'; //obrigatorio
import PubSub from 'pubsub-js';

//precisa exportar para que seja encontrado no App.js
export default class InputCustomizado extends Component {
	
	constructor(){
		super();
		this.state = {msgErro:''}; //vai comecar vazio
	}	

	componentDidMount() {
		PubSub.subscribe('erro-validacao', function(topico, erro){
			if(erro.field === this.props.name){ //se o campo de validacao for igual ao nome do input entao atualiza o estado 
				this.setState({msgErro:erro.defaultMessage}); //defaultMessage é uma propriedade do responseJSON
			}
					
		}.bind(this));

		PubSub.subscribe('limpa-erros', function(topico){
			this.setState({msgErro: ''}); //defaultMessage é uma propriedade do responseJSON					
		}.bind(this));
	}

	render() {
		return (
			<div className="pure-control-group">
				<label htmlFor={this.props.id}>{this.props.label}</label> 
				<input id={this.props.id} type={this.props.type} name={this.props.name} value={this.props.value} onChange={this.props.onChange}/>                  
				<span className="erro">{this.state.msgErro}</span>
			</div>
		);
	}
}




