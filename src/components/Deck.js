import React, { Component } from 'react';
import { 
    View
    , Animated
    , PanResponder
    , Dimensions
 } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH/3;
const MULTIPLIER = 1.5;
const DURATION = 250;

export class Deck extends Component{
    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({ 
            onStartShouldSetPanResponder: () => true, 
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy })
            }, 
            onPanResponderRelease: (event, gesture) => {
                if(gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.snapBackToOrigin();
                }
            }
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

    forceSwipe(swipeDirection) {
        let direction = 1;
        console.log(swipeDirection);
        if (swipeDirection === 'left') direction*=-1;
        
        Animated.timing(this.state.position, {
            toValue: { x: SCREEN_WIDTH * direction, y: 0 },
            duration: DURATION
        }).start();
    }

    snapBackToOrigin() {
        Animated.spring(this.state.position, { 
            toValue: { x: 0, y: 0 }
        }).start();
    }

    getCardStyle() {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * MULTIPLIER, 0, SCREEN_WIDTH * MULTIPLIER],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return  { 
            ...position.getLayout(),
            transform: [{ rotate }]
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