import React, { Component } from 'react';
import { 
    View
    , Animated
    , PanResponder
 } from 'react-native';

export class Deck extends Component{
    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({ 
            onStartShouldSetPanResponder: () => true, 
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy })
            }, 
            onPanResponderRelease: () => {}
         });

         this.state = { panResponder, position };
    }

    render() {
        return(
            <Animated.View 
                style={this.state.position.getLayout()}
                {...this.state.panResponder.panHandlers} >
                {this.renderCards()}
            </Animated.View>
        );
    }

    renderCards() {
        return this.props.data.map(item => {
            return this.props.renderCard(item);
        });
    }
}

export default Deck;