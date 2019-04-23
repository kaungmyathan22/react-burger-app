
import React,{Component} from 'react';
import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from "../../components/UI/Modal/Modal"
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary"

const INGREDIENT_PRICE = {
	salad:0.5,
	cheese:0.4,
	meat:1.3,
	bacon:0.7
}

class BurgerBuilder extends Component {

	state = {
		ingredients:{
			salad:0,
			bacon:0,
			cheese:0,
			meat:0
		},
		totalPrice:4,
		purchasing:false,
		purchaseable:false
	}

	updatePurchaseable(ingredients) {
		// const ingredients = {...this.state.ingredients};
		const sum = Object.keys(ingredients).map(key=>{
			return ingredients[key]
		}).reduce((prev,next)=>{
			return prev+next;
		},0);
		this.setState({purchaseable:sum > 0});
	}

	addIngredientHandler = (type) => {

		const oldCount = this.state.ingredients[type];
		const newCOunt = oldCount + 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = newCOunt;
		const priceAddition = INGREDIENT_PRICE[type];
		const oldPrice  = this.state.totalPrice;
		const newPrice = oldPrice+priceAddition;

		this.setState({totalPrice:newPrice,ingredients:updatedIngredients})

		this.updatePurchaseable(updatedIngredients);

	};

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if(oldCount <= 0) {
			return;
		}
		const newCOunt = oldCount - 1;
		const updatedIngredients = {
			...this.state.ingredients
		};
		updatedIngredients[type] = newCOunt;
		const priceAddition = INGREDIENT_PRICE[type];
		const oldPrice  = this.state.totalPrice;
		const newPrice = oldPrice - priceAddition;

		this.setState({totalPrice:newPrice,ingredients:updatedIngredients})

		this.updatePurchaseable(updatedIngredients)
	};

	purchaseHandler = () => {
		this.setState({purchasing:true})
	}

	purchaseCancelHandler = ()=>{
		this.setState({purchasing:false});
	}

	purchaseContinueHandler = () => {
		alert('you continued');
	}


	render() {

		const disabledInfo = {
			...this.state.ingredients
		};

		for(let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		return (

			<Aux>

				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					<OrderSummary ingredients={this.state.ingredients}
					 purchaseCancled={this.purchaseCancelHandler} 
					 purchaseContinued={this.purchaseContinueHandler}
					 totalPrice={this.state.totalPrice}
					 />
				</Modal>
				<Burger ingredients={this.state.ingredients} />

				<BuildControls 
					ingredientAdded={this.addIngredientHandler} 
					ingredientRemoved={this.removeIngredientHandler}
					disabled={disabledInfo}
					price={this.state.totalPrice}
					ordered={this.purchaseHandler}
					purchaseable={this.state.purchaseable}
				/>

			</Aux>

		);
	}

}

export default BurgerBuilder;