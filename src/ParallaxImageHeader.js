import React, { Component } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ScrollView,
  Platform,
  Text,
  Dimensions
} from 'react-native';

// Default values & constants
let IMAGE_MAX_HEIGHT = 100;
const HEADER_HEIGHT = Platform.OS === 'ios' ? 64 : 56;
const HEADER_PADDINGTOP = Platform.OS === 'ios' ? 12 : 0;
const SCREEN_DIMENSIONS = Dimensions.get('window');

class ParallaxImageHeader extends Component {

  //
  // Constructor
  //
  constructor(props) {
    super(props);
    // Get height from props
    IMAGE_MAX_HEIGHT = this.props.headerHeight;
    // Animated value for scrollY
    this.state = {
      scrollY: new Animated.Value(0)
    };
  }

  //
  // Render animated image
  //
  _renderAnimatedImage = (imageTranslate, imageScale) => {
    // Render animated image styles
    const animatedImageStyles = StyleSheet.create({
      backgroundImage: {
        position: 'absolute',
        width: SCREEN_DIMENSIONS.width,
        resizeMode: 'cover',
        height: IMAGE_MAX_HEIGHT
      }
    });

    // Return
    return (
      <Animated.Image
        source={this.props.imgSrc}
        style={[
          animatedImageStyles.backgroundImage,
          { transform: [{ translateY: imageTranslate }, { scale: imageScale }] }
        ]}
      />
    );
  }

  //
  // Render title bar
  //
  _renderTitleBar = (headerOpacity, headerPosition) => {
    // Render title bar
    const titleBarStyles = StyleSheet.create({
      title: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 17,
        marginTop: HEADER_PADDINGTOP,
      },
      header: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: this.props.headerColor,
        height: HEADER_HEIGHT,
      },
    });

    // Return
    return (
      <Animated.View
        style={[
          titleBarStyles.header,
          { opacity: headerOpacity },
          { top: headerPosition }
        ]}
      >
        <Text style={titleBarStyles.title}>{this.props.title}</Text>
      </Animated.View>
    );
  }

  //
  // onScroll event handler
  //
  _onScrollEventHandler = () => {
    return (Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
    ));
  }

  //
  // Render
  //
  render() {
    // Generic styles
    const globalStyles = StyleSheet.create({
      fill: {
        flex: 1,
      },
      container: {
        flex: 1,
        borderColor: 'transparent',
      },
      scrollViewContent: {
        marginTop: IMAGE_MAX_HEIGHT,
        backgroundColor: '#ffffff',
        paddingTop: 6,
        paddingBottom: 6,
      },
      row: {
        height: 40,
        margin: 16,
        backgroundColor: '#D3D3D3',
        alignItems: 'center',
        justifyContent: 'center',
      }
    });

    // Compute header opacity
    const headerOpacity = this.state.scrollY.interpolate({
      inputRange: [0, IMAGE_MAX_HEIGHT / 2.5, IMAGE_MAX_HEIGHT / 1.5],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });
    // Compute header position (dropdown effect)
    const headerPosition = this.state.scrollY.interpolate({
      inputRange: [0, IMAGE_MAX_HEIGHT / 1.2],
      outputRange: [-15, 0],
      extrapolate: 'clamp',
    });
    // Compute image position
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [-IMAGE_MAX_HEIGHT, 0, IMAGE_MAX_HEIGHT],
      outputRange: [IMAGE_MAX_HEIGHT / 2, 0, -IMAGE_MAX_HEIGHT / 3],
      extrapolate: 'clamp',
    });
    // Compute image scale
    const imageScale = this.state.scrollY.interpolate({
      inputRange: [-IMAGE_MAX_HEIGHT, 0, IMAGE_MAX_HEIGHT],
      outputRange: [2, 1, 1],
      extrapolate: 'clamp',
    });

    // Return
    return (
      <View style={globalStyles.container}>
        {this._renderAnimatedImage(imageTranslate, imageScale)}
        <ScrollView
          style={globalStyles.fill}
          scrollEventThrottle={16}
          onScroll={this._onScrollEventHandler()}
        >
          <View style={globalStyles.scrollViewContent}>
            {this.props.children}
          </View>
        </ScrollView>
        {this._renderTitleBar(headerOpacity, headerPosition)}
      </View>
    );
  }
}

export default ParallaxImageHeader;
