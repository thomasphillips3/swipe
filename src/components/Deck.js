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
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }

    getCardStyle() {
        return  { 
            ...this.state.position.getLayout(),
            transform: [{ rotate: '45deg' }]
        };
    }

    renderCards() {
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View 
                        key={item.id}
                        style={this.getCardStyle()}
                        {...this.state.panResponder.panHandlers} 
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            
            return this.props.renderCard(item);
        });
    }
}

export default Deck;