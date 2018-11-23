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

export class Deck extends Component {
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    }

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
         this.state = { panResponder, position, index: 0 };
        }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }

    forceSwipe(swipeDirection) {
        const x = swipeDirection === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;

        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: DURATION
        }).start(() => {
            this.onSwipeComplete(swipeDirection);
        });
    }

    onSwipeComplete(swipeDirection) {
        const { onSwipeLeft, onSwipeRight, data } = this.props;
        const item = data[this.state.index];

        swipeDirection === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        this.state.position.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
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
        return this.props.data.map((item, i) => {
            if (i < this.state.index) {
                return null;
            }

            if (i === this.state.index) {
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