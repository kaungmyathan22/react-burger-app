
import React,{Component} from 'react';
import Aux from '../../hoc/Aux'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from "../../components/UI/Modal/Modal"
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary"
import axios from "../../axios-order";
import Spinner from "../../components/UI/Spinner/Spinner"

const INGREDIENT_PRICE = {
	salad:0.5,
	cheese:0.4,
	meat:1.3,
	bacon:0.7
}

class BurgerBuilder extends Component {

	state = {
		ingredients:null,
		totalPrice:4,
		purchasing:false,
		purchaseable:false,
		loading:false,
		error:false,
	}

	componentDidMount() {
		axios.get('https://react-my-burger-874a7.firebaseio.com/ingredients.json')
			 .then(response=>{
			 	this.setState({ingredients:response.data});
			 	console.log(response.data);
			 })
			 .catch(error=>{
			 	this.setState({error:true})
			 });
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
		// alert('you continued');
		this.setState({loading:true});
		const data = {
			ingredients:this.state.ingredients,
			price:this.state.totalPrice,
			customer:{
				name:"Kaung Myat Han",
				address: {
					street:"Test street",
					zipCode:'343434',
					country:"Myanmar"
				},
				email:"km@gmail.com",
			},
			deliveryMethod:"fastest"
		};

		axios.post('/orders.json',data)
			 .then(reponse=>{
				this.setState({loading:false, purchasing:false})
			 }).catch(error=>{	
			 	this.setState({loading:false, purchasing:false})
			 });
	}


	render() {


		const disabledInfo = {
			...this.state.ingredients
		};

		for(let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;

		let burger = this.state.error? <p> ingredients can't be loaded </p> :<Spinner />

		if(this.state.ingredients) {
			burger = (

			<Aux>

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

			orderSummary = (<OrderSummary ingredients={this.state.ingredients}
					 purchaseCancled={this.purchaseCancelHandler} 
					 purchaseContinued={this.purchaseContinueHandler}
					 totalPrice={this.state.totalPrice}
					 />
						);

		}


		if(this.state.loading) {
			orderSummary = <Spinner/>
			console.log("loading")
		}
		return (


			<Aux>

				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{ orderSummary }
				</Modal>
				
				{ burger }


			</Aux>

		);
	}

}

export default withErrorHandler(BurgerBuilder,axios);