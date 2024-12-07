import { configureStore } from '@reduxjs/toolkit';
import CreateProfileSlice from '../slice/CreateProfileSlice';


const store = configureStore({
	reducer: {
		Profile: CreateProfileSlice
	},
});

export default store;
