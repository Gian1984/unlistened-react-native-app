import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';


const Logo = () => {

    return (
        <TouchableOpacity >
            <Image source={require('@/assets/images/unlistened_transparen_logo_176.png')} style={styles.logo} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    logo: {
        width: 176,
        height: 176,
    },
});

export default Logo;