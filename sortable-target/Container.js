import React, { Component } from 'react';
import update from 'react/lib/update';
import Card from './Card';
import { DropTarget } from 'react-dnd';

class Container extends Component {

	constructor(props) {
		super(props);		
		this.state = { cards: props.list };
	}

	pushCard(card) {
		this.setState(update(this.state, {
			cards: {
				$push: [ card ]
			}
		}));
	}

	removeCard(index) {		
		this.setState(update(this.state, {
			cards: {
				$splice: [
					[index, 1]
				]
			}
		}));
	}

	moveCard(dragIndex, hoverIndex) {
		const { cards } = this.state;
		const targetList = this.props.id;
		const dragCard = cards[dragIndex];

		this.setState(update(this.state, {
			cards: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragCard]
				]
			}
		}));
	}

	render() {
		const { cards } = this.state;
		const { canDrop, isOver, connectDropTarget } = this.props;
		const isActive = canDrop && isOver;
		const style = {
			width: "200px",
			height: "404px",
			border: '1px dashed gray'
		};

		let backgroundColor = '#FFF';
		if (isActive) {
			backgroundColor = 'lightgreen';
		}
		return connectDropTarget(
			<div style={{...style, backgroundColor}}>
				{cards.map((card, i) => {
					return (
						<Card 
							key={card.id}
							index={i}
							listId={this.props.id}
							card={card}							
							pushCard={this.pushCard.bind(this)}
							removeCard={this.removeCard.bind(this)}
							moveCard={this.moveCard.bind(this)} />
					);
				})}
			</div>
		);
  }
}

const cardTarget = {
	drop(props, monitor, component ) {
		const { id } = props;
		const sourceObj = monitor.getItem();		
		if ( id !== sourceObj.listId ) component.pushCard(sourceObj.card);
		return {
			listId: id
		};
	}
}

export default DropTarget("CARD", cardTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop(),
	isOverCurrent: monitor.isOver({ shallow: true })
}))(Container);