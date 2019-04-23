import React from "react";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems"
import classes from "./SideDrawer.module.css"
import Backdrop from '../../UI/Backdrop/Backdrop'
import Aux from "../../../hoc/Aux"

const sideDrawer = (props) => {

	let attached_classes = [classes.SideDrawer, classes.Close]

	if(props.open) {
		attached_classes = [classes.SideDrawer, classes.Open]
	}

	return (

		<Aux>
			<Backdrop show={props.open} clicked={props.closed}/>

			<div className={attached_classes.join(' ')} >

				<Logo height="11%"/>
				<nav>
				<NavigationItems/>
				</nav>

			</div>
		</Aux>

	);
}

export default sideDrawer;