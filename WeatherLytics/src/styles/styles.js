import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: 'red',
    },
    containerDateTime: {
        flexDirection: 'row',
    },
    containerSubdetailsText: {
        alignItems: 'center',
    },
    containerSubdetails: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
    },
    containerHourly:{
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginHorizontal:8,
    },
    containerScrollHourly:{
        // margin:5,
        marginVertical:8,
    },
    verticalLine: {
        height: '100%',
        width: 1,
        backgroundColor: 'lightgray',
    },
    card: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: 120,
        height: 150,
        marginHorizontal: 6,
        marginVertical: 6,
        // margin: 3,
        backgroundColor: '#ffffff40',
        borderRadius: 10,
        borderWidth:1,
        borderColor:'#aaa',
    },
    cardText: {
        color: '#fff',
        fontSize: 17,
        // alignItems: 'center',
        fontWeight: '800',
    },
    knowMoreButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 5,
        width: 120,
        flex: 1,
        marginHorizontal: 20,
        marginBottom: 10,
        borderWidth:1,
        borderColor:'#aaa',
    }
});

export { styles }