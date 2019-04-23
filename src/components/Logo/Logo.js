import React from "react"
import logo_img from "../../assets/images/burger-logo.png";
import classes from "./Logo.module.css"

const logo = (props) => {

	return(

		<div className={classes.Logo} style={{height:props.height}}>

			<img src={logo_img} />

		</div>

		)

};

export default logo;