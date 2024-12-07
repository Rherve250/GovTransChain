import {  MdSpaceDashboard ,MdEmojiPeople} from 'react-icons/md';
import { AiOutlineStock } from "react-icons/ai";
import { RxActivityLog } from "react-icons/rx";
import { GrTransaction } from "react-icons/gr";


const links = [
	{
		name: 'Dashboard',
		path: '/Admin/Dashboard',
		icon: MdSpaceDashboard,
	},
	{
		name: 'Program',
		path: '/Admin/Programs',
		icon: RxActivityLog ,
	},
	{
		name: 'Stock',
		path: '/Admin/Stocks',
		icon: AiOutlineStock ,
	},
	{
		name: 'Transaction',
		path: '/Transactions',
		icon: GrTransaction ,
	},
	{
		name: "Users",
		path: "/Users",
		icon: MdEmojiPeople
	}
];



export { links };
