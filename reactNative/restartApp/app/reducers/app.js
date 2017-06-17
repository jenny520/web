/**
 * Created by zhoumeiyan on 2017/5/30.
 */
const initState = {
    booted: false,
    user: null,
    welcomed: false,
    entered: false,
    logined: false,
    sliderLoop: false,
    banners: [
        require('../assets/images/s1.jpg'),
        require('../assets/images/s2.jpg'),
        require('../assets/images/s3.jpg')
    ]
};

export default appReducer = (state = initState,action) => {
    switch (action.type) {
        case 'APP_BOOTED':
            return {
                ...state,
                booted: true
            };
        default:
            return state
    }
}