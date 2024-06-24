import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SearchProps = {
    onSearch: (query: string) => void;
};

const SearchField: React.FC<SearchProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color="gray" />
            <TextInput
                style={styles.input}
                placeholder="SearchField podcasts"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 10,
        marginVertical: 5,
    },
    input: {
        flex: 1,
        marginLeft: 10,
    },
});

export default SearchField;
