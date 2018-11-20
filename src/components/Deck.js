import React, { Component } from 'react';
import { View, Animated } from 'react-native';

export class Deck extends Component{
    render() {
        return(
            <View>
                {this.renderCards()}
            </View>
        );
    }

    renderCards() {
        return this.props.data.map(item => {
            return this.props.renderCard(item);
        });
    }
}

export default Deck;